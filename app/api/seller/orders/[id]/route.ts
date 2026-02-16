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