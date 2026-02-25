import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json(
        { error: "Please sign in to view following" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userStr);

    // Get all sellers the user is following
    const following = await prisma.follow.findMany({
      where: {
        userId: user.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            brandName: true,
            storeSlug: true,
            storeLogo: true,
            storeCover: true,
            storeDescription: true,
            location: true,
            followers: true,
            totalSales: true, // ✅ This exists
            approved: true,
            _count: {
              select: {
                products: {
                  where: { status: "PUBLISHED" },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      following: following.map((f) => ({
        followId: f.id,
        followedAt: f.createdAt,
        seller: {
          ...f.seller,
          totalProducts: f.seller._count.products, // ✅ Calculate from _count
        },
      })),
    });
  } catch (error: any) {
    console.error("❌ Error fetching following:", error);
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    );
  }
}