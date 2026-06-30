import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

// Get seller's orders - OPTIMIZED
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "You need to be a seller" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {
      sellerId: seller.id,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        quantity: true,
        selectedSize: true,
        selectedColor: true,
        finalTotal: true,
        deliveryMethod: true,
        deliveryAddress: true,
        status: true,
        createdAt: true,
        product: {
          select: {
            title: true,
            images: {
              select: {
                url: true,
              },
              take: 1,
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const [pendingCount, confirmedCount, deliveredCount, revenueData] = await Promise.all([
      prisma.order.count({
        where: { sellerId: seller.id, status: 'PENDING' },
      }),
      prisma.order.count({
        where: { sellerId: seller.id, status: 'CONFIRMED' },
      }),
      prisma.order.count({
        where: { sellerId: seller.id, status: 'DELIVERED' },
      }),
      prisma.order.aggregate({
        where: {
          sellerId: seller.id,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
        _sum: {
          finalTotal: true,
        },
      }),
    ]);

    return NextResponse.json({
      orders,
      stats: {
        total: orders.length,
        pending: pendingCount,
        confirmed: confirmedCount,
        delivered: deliveredCount,
        revenue: revenueData._sum.finalTotal || 0,
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