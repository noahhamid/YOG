import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const userDataHeader = req.headers.get("x-user-data");
    if (!userDataHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = JSON.parse(userDataHeader);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      include: {
        seller: {
          include: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is a seller with active orders
    if (user.seller) {
      const pendingOrders = user.seller.orders.filter(
        (order) =>
          order.status === "PENDING" ||
          order.status === "CONFIRMED" ||
          order.status === "PROCESSING" ||
          order.status === "SHIPPED"
      );

      if (pendingOrders.length > 0) {
        return NextResponse.json(
          {
            error: `Cannot delete account with ${pendingOrders.length} pending order(s). Please complete or cancel all orders first.`,
          },
          { status: 400 }
        );
      }
    }

    // Set deletedAt to 30 days from now (soft delete)
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    await prisma.user.update({
      where: { id: userData.id },
      data: {
        deletedAt: deletionDate,
      },
    });

    return NextResponse.json({
      message: "Account scheduled for deletion in 30 days",
      deletionDate: deletionDate.toISOString(),
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to schedule account deletion" },
      { status: 500 }
    );
  }
} 