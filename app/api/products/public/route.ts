import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Cache for 60 seconds — remove force-dynamic so this actually works
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category   = searchParams.get("category") || "";
    const isTrending = searchParams.get("isTrending") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";

    const where: any = {
      status: "PUBLISHED",
      seller: { status: "APPROVED" }, // ✅ use status not stale approved boolean
    };

    if (category && category !== "all") where.category = category.toUpperCase();
    if (isTrending) where.isTrending = true;
    if (isFeatured) where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        compareAtPrice: true,
        category: true,
        brand: true,
        createdAt: true,
        clothingType: true,
        occasion: true,
        // ✅ Only first 2 images instead of all — massive bandwidth saving
        images: {
          select: { url: true },
          orderBy: { position: "asc" },
          take: 2,
        },
        // ✅ Only what we need from variants
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
      },
      orderBy: { createdAt: "desc" },
      take: 80, // ✅ reduced from 100
    });

    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const transformedProducts = products.map((product) => {
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
        sizes:   [...new Set(product.variants.map((v) => v.size))],
        colors:  [...new Set(product.variants.map((v) => v.color.toLowerCase()))],
        newArrival: new Date(product.createdAt).getTime() > now - THIRTY_DAYS,
        onSale: product.compareAtPrice ? product.compareAtPrice > product.price : false,
        seller: {
          id:   product.seller.id,
          name: product.seller.brandName,
          slug: product.seller.storeSlug,
        },
        stock: product.variants.reduce((sum, v) => sum + v.quantity, 0),
      };
    });

    return NextResponse.json(
      { products: transformedProducts, count: transformedProducts.length },
      {
        headers: {
          // ✅ Tell browser to cache for 30s, CDN for 60s
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}