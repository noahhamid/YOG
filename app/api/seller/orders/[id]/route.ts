import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Statuses that mean stock has been committed / fulfilled
const STOCK_DEDUCT_ON  = "DELIVERED";  // deduct when delivered to customer
const STOCK_RESTORE_ON = "CANCELLED";  // restore if cancelled
const SALES_COUNT_ON   = "DELIVERED";  // count toward totalSales when delivered

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    const userStr = req.headers.get("x-user-data");
    if (!userStr) return NextResponse.json({ error: "Please sign in first" }, { status: 401 });

    const user = JSON.parse(userStr);

    const seller = await prisma.seller.findUnique({ where: { userId: user.id } });
    if (!seller) return NextResponse.json({ error: "You need to be a seller" }, { status: 403 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {
            variants: true,
            images: { take: 1, orderBy: { position: 'asc' } },
          },
        },
      },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.sellerId !== seller.id) return NextResponse.json({ error: "You can only update your own orders" }, { status: 403 });

    const body = await req.json();
    const { status, notes } = body;

    const prevStatus = order.status;
    const newStatus  = status || prevStatus;

    // ── Find the variant this order was for ──────────────────────────────────
    const variant = order.product.variants.find(
      (v) => v.size === order.selectedSize &&
             v.color.toLowerCase() === order.selectedColor.toLowerCase()
    );

    // ── Side effects based on status transition ──────────────────────────────
    // Only act on actual status changes
    if (newStatus !== prevStatus) {

      // 1️⃣  SHIPPED → deduct stock (this is when product actually leaves inventory)
      if (newStatus === STOCK_DEDUCT_ON && prevStatus !== STOCK_DEDUCT_ON) {
        if (variant) {
          if (variant.quantity < order.quantity) {
            return NextResponse.json(
              { error: `Not enough stock to ship. Only ${variant.quantity} available.` },
              { status: 400 }
            );
          }
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { quantity: { decrement: order.quantity } },
          });
          console.log(`📦 Stock deducted: ${order.quantity}x from variant ${variant.id}`);

          // Check if now out of stock — notify seller
          const updatedVariants = await prisma.productVariant.findMany({
            where: { productId: order.productId },
          });
          const totalStock = updatedVariants.reduce((s, v) => s + v.quantity, 0);
          if (totalStock === 0) {
            await prisma.notification.create({
              data: {
                userId: seller.userId,
                type: "ORDER_UPDATE",
                title: "Product Out of Stock! 📦",
                message: `"${order.product.title}" is now out of stock. Consider restocking.`,
                productId: order.productId,
                sellerId: seller.id,
                imageUrl: order.product.images[0]?.url || null,
              },
            });
          }
        }
      }

      // 2️⃣  CANCELLED → restore stock only if it was already deducted (was DELIVERED)
      if (newStatus === STOCK_RESTORE_ON) {
        const wasDeducted = prevStatus === "DELIVERED";
        if (wasDeducted && variant) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { quantity: { increment: order.quantity } },
          });
          console.log(`🔄 Stock restored: ${order.quantity}x to variant ${variant.id}`);
        }
      }

      // 3️⃣  DELIVERED → increment totalSales on seller
      if (newStatus === SALES_COUNT_ON && prevStatus !== SALES_COUNT_ON) {
        await prisma.seller.update({
          where: { id: seller.id },
          data: { totalSales: { increment: order.quantity } },
        });
        console.log(`💰 totalSales +${order.quantity} for seller ${seller.id}`);
      }

      // 4️⃣  Un-DELIVERED (e.g. DELIVERED → CANCELLED edge case) → decrement totalSales
      if (prevStatus === SALES_COUNT_ON && newStatus !== SALES_COUNT_ON) {
        await prisma.seller.update({
          where: { id: seller.id },
          data: { totalSales: { decrement: order.quantity } },
        });
        console.log(`↩️  totalSales -${order.quantity} for seller ${seller.id} (status rolled back)`);
      }
    }

    // ── Update the order ─────────────────────────────────────────────────────
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        notes: notes !== undefined ? notes : order.notes,
      },
      include: {
        product: { include: { images: true } },
      },
    });

    console.log(`✅ Order ${order.orderNumber}: ${prevStatus} → ${newStatus}`);

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}