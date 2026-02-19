import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get filter parameters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
    const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
    const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "featured";
    const isTrending = searchParams.get("isTrending") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";

    // Build where clause
    const where: any = {
      status: "PUBLISHED",
      seller: {
        approved: true, // ⚠️ THIS IS THE FILTER!
      },
    };

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      where.category = category.toUpperCase();
    }

    // Price filter
    where.price = {
      gte: minPrice,
      lte: maxPrice,
    };

    // Trending/Featured filters
    if (isTrending) {
      where.isTrending = true;
    }
    if (isFeatured) {
      where.isFeatured = true;
    }

    // Brand filter
    if (brands.length > 0) {
      where.brand = {
        in: brands,
      };
    }

    console.log("🔍 Fetching products with where clause:", JSON.stringify(where, null, 2));

    // Fetch products
    let products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: true,
        seller: {
          select: {
            id: true,
            brandName: true,
            storeSlug: true,
            approved: true, // Include approval status in response
          },
        },
      },
      orderBy:
        sortBy === "price-low"
          ? { price: "asc" }
          : sortBy === "price-high"
            ? { price: "desc" }
            : sortBy === "name"
              ? { title: "asc" }
              : { createdAt: "desc" },
    });

    console.log(`✅ Found ${products.length} products from approved sellers`);

    // Filter by sizes (need to check variants)
    if (sizes.length > 0) {
      const beforeSize = products.length;
      products = products.filter((product) =>
        product.variants.some((variant) => sizes.includes(variant.size))
      );
      console.log(`📏 Size filter: ${beforeSize} → ${products.length}`);
    }

    // Filter by colors (need to check variants)
    if (colors.length > 0) {
      const beforeColor = products.length;
      products = products.filter((product) =>
        product.variants.some((variant) =>
          colors.includes(variant.color.toLowerCase())
        )
      );
      console.log(`🎨 Color filter: ${beforeColor} → ${products.length}`);
    }

    // Transform data for frontend
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

    console.log(`📦 Returning ${transformedProducts.length} products to frontend`);

    return NextResponse.json({
      products: transformedProducts,
      count: transformedProducts.length,
    });
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}