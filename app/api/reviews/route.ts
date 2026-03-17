import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// ✅ Helper — recalculates and stores averageRating + reviewCount on Product
// Called after every create/update/delete so the values are always fresh
async function syncProductRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: agg._avg.rating ?? 0,
      reviewCount:   agg._count.rating,
    },
  });
}

// GET — reads stored stats from Product, no heavy AVG calculation
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const [reviews, product] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        take: 20, // ✅ reduced from 50
        select: {
          id: true, userId: true, userName: true, userEmail: true,
          rating: true, comment: true, helpful: true, verified: true, createdAt: true,
        },
      }),
      prisma.product.findUnique({
        where: { id: productId },
        select: { averageRating: true, reviewCount: true },
      }),
    ]);

    // Distribution from the fetched reviews (close enough for display)
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    reviews.forEach(r => { dist[r.rating] = (dist[r.rating] || 0) + 1; });

    return NextResponse.json({
      reviews,
      stats: {
        // ✅ Use stored values — no recalculation
        totalReviews:        product?.reviewCount   ?? 0,
        averageRating:       product?.averageRating ?? 0,
        ratingDistribution:  dist,
      },
    });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST — create review then sync stored rating
export async function POST(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) return NextResponse.json({ error: "Please sign in to leave a review" }, { status: 401 });

    const user = JSON.parse(userStr);
    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment)
      return NextResponse.json({ error: "Product ID, rating, and comment are required" }, { status: 400 });
    if (rating < 1 || rating > 5)
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const existingReview = await prisma.review.findFirst({ where: { productId, userId: user.id } });
    if (existingReview) return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });

    const hasPurchased = await prisma.order.findFirst({
      where: { productId, customerEmail: user.email, status: "DELIVERED" },
    });

    const review = await prisma.review.create({
      data: { productId, userId: user.id, userName: user.name, userEmail: user.email, rating, comment, verified: !!hasPurchased },
    });

    // ✅ Update stored rating on Product
    await syncProductRating(productId);

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// PATCH — edit review then sync stored rating
export async function PATCH(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

    const user = JSON.parse(userStr);
    const { reviewId, rating, comment } = await req.json();

    if (!reviewId || !rating || !comment)
      return NextResponse.json({ error: "Review ID, rating, and comment are required" }, { status: 400 });
    if (rating < 1 || rating > 5)
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });

    const existingReview = await prisma.review.findFirst({ where: { id: reviewId, userId: user.id } });
    if (!existingReview) return NextResponse.json({ error: "Review not found or not yours" }, { status: 404 });

    const updated = await prisma.review.update({ where: { id: reviewId }, data: { rating, comment } });

    // ✅ Update stored rating on Product
    await syncProductRating(existingReview.productId);

    return NextResponse.json({ review: updated });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE — remove review then sync stored rating
export async function DELETE(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

    const user = JSON.parse(userStr);
    const reviewId = new URL(req.url).searchParams.get("reviewId");
    if (!reviewId) return NextResponse.json({ error: "Review ID is required" }, { status: 400 });

    const existingReview = await prisma.review.findFirst({ where: { id: reviewId, userId: user.id } });
    if (!existingReview) return NextResponse.json({ error: "Review not found or not yours" }, { status: 404 });

    await prisma.review.delete({ where: { id: reviewId } });

    // ✅ Update stored rating on Product
    await syncProductRating(existingReview.productId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}