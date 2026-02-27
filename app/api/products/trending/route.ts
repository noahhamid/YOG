import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache for 1 minute

export async function GET(req: NextRequest) {
  try {
    console.log("🔥 Calculating trending products...");

    // ✅ TRENDING ALGORITHM
    // Factors: Sales (40%), Views (30%), Rating (20%), Recency (10%)
    
    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        seller: {
          approved: true,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        compareAtPrice: true,
        category: true,
        clothingType: true,
        occasion: true,
        brand: true,
        views: true,
        createdAt: true,
        images: {
          select: { url: true },
          orderBy: { position: "asc" },
        },
        variants: {
          select: {
            size: true,
            color: true,
            quantity: true,
          },
        },
        seller: {
          select: {
            id: true,
            brandName: true,
            storeSlug: true,
          },
        },
        // Get order count (sales)
        orders: {
          select: { id: true },
        },
        // Get average rating
        reviews: {
          select: { rating: true },
        },
      },
      take: 200, // Get more products for scoring
    });

    // ✅ SCORE EACH PRODUCT
    const scoredProducts = products.map((product) => {
      const salesCount = product.orders.length;
      const viewCount = product.views;
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;
      
      // Days since creation (newer = higher score)
      const daysSinceCreation = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 30 - daysSinceCreation) / 30; // Max score for products < 30 days old

      // ✅ WEIGHTED TRENDING SCORE
      const trendingScore = 
        (salesCount * 0.4) +           // 40% weight on sales
        (viewCount * 0.003) +          // 30% weight on views (scaled down)
        (avgRating * 4 * 0.2) +        // 20% weight on rating (scaled to 20 points)
        (recencyScore * 10 * 0.1);     // 10% weight on recency (scaled to 10 points)

      return {
        ...product,
        trendingScore,
        salesCount,
        viewCount,
        avgRating,
      };
    });

    // ✅ SORT BY TRENDING SCORE
    const trendingProducts = scoredProducts
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 50); // Top 50 trending products

    console.log(`🔥 Top 5 trending products:`);
    trendingProducts.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} (Score: ${p.trendingScore.toFixed(2)}, Sales: ${p.salesCount}, Views: ${p.viewCount}, Rating: ${p.avgRating.toFixed(1)})`);
    });

    // ✅ TRANSFORM FOR FRONTEND
    const transformedProducts = trendingProducts.map((product) => {
      const allImageUrls = product.images.map((img) => img.url);

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        category: product.category.toLowerCase(),
        clothingType: product.clothingType,
        occasion: product.occasion,
        brand: product.brand || product.seller.brandName,
        image: allImageUrls[0] || "https://via.placeholder.com/400",
        allImages: allImageUrls,
        sizes: [...new Set(product.variants.map((v) => v.size))],
        colors: [...new Set(product.variants.map((v) => v.color.toLowerCase()))],
        newArrival: new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
        onSale: product.compareAtPrice ? product.compareAtPrice > product.price : false,
        seller: {
          id: product.seller.id,
          name: product.seller.brandName,
          slug: product.seller.storeSlug,
        },
        stock: product.variants.reduce((sum, v) => sum + v.quantity, 0),
        trendingScore: product.trendingScore,
        trending: true,
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      count: transformedProducts.length,
    });
  } catch (error: any) {
    console.error("❌ Error calculating trending products:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending products" },
      { status: 500 }
    );
  }
}