import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Get seller's orders
export async function GET(req: NextRequest) {
  try {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Build where clause
    const where: any = {
      sellerId: seller.id,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get order statistics
    const stats = await prisma.order.groupBy({
      by: ['status'],
      where: { sellerId: seller.id },
      _count: true,
    });

    const totalOrders = orders.length;
    const pendingOrders = stats.find(s => s.status === 'PENDING')?._count || 0;
    const confirmedOrders = stats.find(s => s.status === 'CONFIRMED')?._count || 0;
    const deliveredOrders = stats.find(s => s.status === 'DELIVERED')?._count || 0;

    const totalRevenue = await prisma.order.aggregate({
      where: {
        sellerId: seller.id,
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      },
      _sum: {
        finalTotal: true,
      },
    });

    return NextResponse.json({
      orders,
      stats: {
        total: totalOrders,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        delivered: deliveredOrders,
        revenue: totalRevenue._sum.finalTotal || 0,
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}