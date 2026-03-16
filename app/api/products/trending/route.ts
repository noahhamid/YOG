import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ✅ In-memory cache — 2 minute TTL for trending
let cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 120_000; // 2 minutes

export async function GET(req: NextRequest) {
  try {
    const now = Date.now();

    // ✅ Serve from cache if fresh
    if (cache && now - cache.ts < CACHE_TTL) {
      return NextResponse.json({ products: cache.data, count: cache.data.length });
    }

    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED", seller: { status: "APPROVED" } },
      select: {
        id: true, title: true, description: true, price: true,
        compareAtPrice: true, category: true, clothingType: true,
        occasion: true, brand: true, views: true, createdAt: true,
        images: { select: { url: true }, orderBy: { position: "asc" }, take: 2 },
        variants: { select: { size: true, color: true, quantity: true } },
        seller: { select: { id: true, brandName: true, storeSlug: true } },
        _count: { select: { orders: true } },
        reviews: { select: { rating: true } },
      },
      take: 200,
    });

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const scored = products.map((p) => {
      const salesCount   = p._count.orders;
      const avgRating    = p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
      const daysSince    = (now - new Date(p.createdAt).getTime()) / 86400000;
      const recencyScore = Math.max(0, 30 - daysSince) / 30;
      const trendingScore = (salesCount * 0.4) + (p.views * 0.003) + (avgRating * 4 * 0.2) + (recencyScore * 10 * 0.1);
      const urls = p.images.map((i) => i.url);
      return {
        id: p.id, title: p.title, description: p.description,
        price: p.price, compareAtPrice: p.compareAtPrice,
        category: p.category.toLowerCase(), clothingType: p.clothingType, occasion: p.occasion,
        brand: p.brand || p.seller.brandName,
        image: urls[0] || "https://via.placeholder.com/400", allImages: urls,
        sizes:  [...new Set(p.variants.map((v) => v.size))],
        colors: [...new Set(p.variants.map((v) => v.color.toLowerCase()))],
        newArrival: new Date(p.createdAt).getTime() > now - THIRTY_DAYS,
        onSale: p.compareAtPrice ? p.compareAtPrice > p.price : false,
        seller: { id: p.seller.id, name: p.seller.brandName, slug: p.seller.storeSlug },
        stock: p.variants.reduce((s, v) => s + v.quantity, 0),
        trendingScore, salesCount, avgRating, trending: true,
      };
    });

    const trending = scored.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 50);

    console.log(`🔥 Top 5 trending:`);
    trending.slice(0, 5).forEach((p, i) =>
      console.log(`  ${i + 1}. ${p.title} (Score: ${p.trendingScore.toFixed(2)}, Sales: ${p.salesCount}, Rating: ${p.avgRating.toFixed(1)})`)
    );

    cache = { data: trending, ts: now };

    return NextResponse.json({ products: trending, count: trending.length });
  } catch (error: any) {
    console.error("❌ Error calculating trending:", error);
    return NextResponse.json({ error: "Failed to fetch trending products" }, { status: 500 });
  }
}