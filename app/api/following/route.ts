import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to view following" },
        { status: 401 }
      );
    }

    const following = await prisma.follow.findMany({
      where: {
        userId: session.user.id,
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
            totalSales: true,
            approved: true,
            _count: {
              select: {
                products: {
                  where: { status: "PUBLISHED" },
                },
                followersList: true,
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
          totalProducts: f.seller._count.products,
          followers: f.seller._count.followersList,
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