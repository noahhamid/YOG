import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userStr);

    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "You need to be a seller" },
        { status: 403 }
      );
    }

    // Verify order belongs to seller
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.sellerId !== seller.id) {
      return NextResponse.json(
        { error: "You can only update your own orders" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status, notes } = body;

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || order.status,
        notes: notes !== undefined ? notes : order.notes,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    console.log(`✅ Order ${order.orderNumber} updated to ${status}`);

    // ✅ OPTIONAL: NOTIFY CUSTOMER OF STATUS CHANGE (Future Feature)
    // You could create notifications for customers here when you add customer accounts
    // For now, we'll just log it
    if (status && status !== order.status) {
      console.log(`📧 Status change notification could be sent to: ${order.customerEmail || order.customerPhone}`);
      
      // Example for future customer notifications:
      // if (customerId) {
      //   await prisma.notification.create({
      //     data: {
      //       userId: customerId,
      //       type: "ORDER_UPDATE",
      //       title: `Order ${status}`,
      //       message: `Your order ${order.orderNumber} is now ${status.toLowerCase()}`,
      //       productId: order.productId,
      //       imageUrl: order.product.images[0]?.url || null,
      //     },
      //   });
      // }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
