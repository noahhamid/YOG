import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Get reviews for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    return NextResponse.json({ reviews, stats });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// Create a review
export async function POST(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");

    if (!userStr) {
      return NextResponse.json(
        { error: "Please sign in to leave a review" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userStr);
    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Product ID, rating, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: { productId, userId: user.id },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const hasPurchased = await prisma.order.findFirst({
      where: {
        productId,
        customerEmail: user.email,
        status: "DELIVERED",
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating,
        comment,
        verified: !!hasPurchased,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// Edit a review
export async function PATCH(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");

    if (!userStr) {
      return NextResponse.json(
        { error: "Please sign in" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userStr);
    const body = await req.json();
    const { reviewId, rating, comment } = body;

    if (!reviewId || !rating || !comment) {
      return NextResponse.json(
        { error: "Review ID, rating, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: { id: reviewId, userId: user.id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found or not yours" },
        { status: 404 }
      );
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });

    return NextResponse.json({ review: updated });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}