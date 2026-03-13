
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userStr);
    const { sellerId, action } = await req.json();

    if (!sellerId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if seller exists
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      );
    }

    if (action === "follow") {
      // Check if already following
      const existingFollow = await prisma.follow.findUnique({
        where: {
          userId_sellerId: {
            userId: user.id,
            sellerId,
          },
        },
      });

      if (existingFollow) {
        return NextResponse.json(
          { error: "Already following this store" },
          { status: 400 }
        );
      }

      // Create follow
      await prisma.follow.create({
        data: {
          userId: user.id,
          sellerId,
        },
      });

      // Increment follower count
      await prisma.seller.update({
        where: { id: sellerId },
        data: { followers: { increment: 1 } },
      });

      console.log(`✅ User ${user.email} followed seller ${seller.brandName}`);

      return NextResponse.json({
        success: true,
        message: "Successfully followed store",
      });
    } else if (action === "unfollow") {
      // Delete follow
      await prisma.follow.delete({
        where: {
          userId_sellerId: {
            userId: user.id,
            sellerId,
          },
        },
      });

      // Decrement follower count
      await prisma.seller.update({
        where: { id: sellerId },
        data: { followers: { decrement: 1 } },
      });

      console.log(`✅ User ${user.email} unfollowed seller ${seller.brandName}`);

      return NextResponse.json({
        success: true,
        message: "Successfully unfollowed store",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("❌ Error following/unfollowing store:", error);
    return NextResponse.json(
      { error: error.message || "Failed to follow/unfollow store" },
      { status: 500 }
    );
  }
}

// Check if user is following a seller
export async function GET(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json({ isFollowing: false });
    }

    const user = JSON.parse(userStr);
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID required" },
        { status: 400 }
      );
    }

    const follow = await prisma.follow.findUnique({
      where: {
        userId_sellerId: {
          userId: user.id,
          sellerId,
        },
      },
    });

    return NextResponse.json({
      isFollowing: !!follow,
    });
  } catch (error: any) {
    console.error("❌ Error checking follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}
