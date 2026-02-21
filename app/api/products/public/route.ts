import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ ENABLE CACHING
export const revalidate = 30;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || "";
    const isTrending = searchParams.get("isTrending") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";

    // ✅ BUILD OPTIMIZED WHERE CLAUSE
    const where: any = {
      status: "PUBLISHED",
      seller: {
        approved: true,
      },
    };

    if (category && category !== "all") {
      where.category = category.toUpperCase();
    }

    if (isTrending) where.isTrending = true;
    if (isFeatured) where.isFeatured = true;

    // ✅ OPTIMIZED QUERY - MINIMAL DATA
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
        // Only first image
        images: {
          select: { url: true },
          orderBy: { position: "asc" },
          take: 1,
        },
        // Variants for sizes/colors
        variants: {
          select: {
            size: true,
            color: true,
            quantity: true,
          },
        },
        // Minimal seller data
        seller: {
          select: {
            id: true,
            brandName: true,
            storeSlug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit to 100 products max
    });

    // ✅ TRANSFORM DATA
    const transformedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category.toLowerCase(),
      brand: product.brand || product.seller.brandName,
      image: product.images[0]?.url || "https://via.placeholder.com/400",
      images: product.images.map((img) => img.url),
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
    }));

    return NextResponse.json({
      products: transformedProducts,
      count: transformedProducts.length,
    });
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}