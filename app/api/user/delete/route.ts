import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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

    // Verify password if the user has one set
    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required" },
          { status: 400 }
        );
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 400 }
        );
      }
    }
    // Google-only users skip password check — session already proves identity

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

    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: deletionDate },
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