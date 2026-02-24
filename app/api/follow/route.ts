import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Check if user is following a seller
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    const userStr = req.headers.get("x-user-data");
    if (!userStr || !sellerId) {
      return NextResponse.json({ isFollowing: false });
    }

    const user = JSON.parse(userStr);

    // ✅ CHANGE FROM sellerFollower TO follow
    const follow = await prisma.follow.findUnique({
      where: {
        userId_sellerId: {
          userId: user.id,
          sellerId: sellerId,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Error checking follow:", error);
    return NextResponse.json({ isFollowing: false });
  }
}

// Follow/Unfollow a seller
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
    const body = await req.json();
    const { sellerId, action } = body;

    if (!sellerId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action === "follow") {
      // ✅ CHANGE FROM sellerFollower TO follow
      await prisma.follow.create({
        data: {
          userId: user.id,
          sellerId: sellerId,
        },
      });

      // Increment follower count
      await prisma.seller.update({
        where: { id: sellerId },
        data: { followers: { increment: 1 } },
      });

      return NextResponse.json({
        success: true,
        message: "Followed successfully",
      });
    } else if (action === "unfollow") {
      // ✅ CHANGE FROM sellerFollower TO follow
      await prisma.follow.delete({
        where: {
          userId_sellerId: {
            userId: user.id,
            sellerId: sellerId,
          },
        },
      });

      // Decrement follower count
      await prisma.seller.update({
        where: { id: sellerId },
        data: { followers: { decrement: 1 } },
      });

      return NextResponse.json({
        success: true,
        message: "Unfollowed successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error toggling follow:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle follow" },
      { status: 500 }
    );
  }
}