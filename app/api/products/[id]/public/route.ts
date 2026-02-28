import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Increment view count
    await prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } },
    });

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        status: "PUBLISHED",
      },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: {
          orderBy: { size: "asc" },
        },
        seller: {
          include: {
            followersList: true,
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    if (!product || !product.seller.approved) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    console.log("storeLogo value:", product.seller.storeLogo);

    const sizes = [...new Set(product.variants.map((v) => v.size))];
    const colors = [...new Set(product.variants.map((v) => v.color))];
    const totalStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);

    // Calculate real rating from reviews
    const reviewCount = product.reviews.length;
    const averageRating = reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

    const transformedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      discount: product.compareAtPrice
        ? Math.round(
            ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
          )
        : 0,
      category: product.category,
      clothingType: product.clothingType,
      occasion: product.occasion,
      material: product.material,
      brand: product.brand || product.seller.brandName,
      images: product.images.map((img) => img.url),
      variants: product.variants.map((v) => ({
        size: v.size,
        color: v.color,
        quantity: v.quantity,
        available: v.quantity > 0,
      })),
      sizes,
      colors,
      totalStock,
      inStock: totalStock > 0,
      seller: {
          id: product.seller.id,
  name: product.seller.brandName,
  slug: product.seller.storeSlug,
  logo: product.seller.storeLogo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller.brandName)}&size=200&background=000&color=fff&bold=true`,
  verified: product.seller.approved,
        followers: product.seller.followersList.length,
        location: product.seller.location,
        instagram: product.seller.instagram,
        rating: averageRating > 0 ? averageRating.toFixed(1) : null,
        reviewCount: reviewCount,
      },
      rating: averageRating > 0 ? averageRating.toFixed(1) : null,
      reviewCount: reviewCount,
      views: product.views,
      createdAt: product.createdAt,
    };

    return NextResponse.json({ product: transformedProduct });
  } catch (error: any) {
    console.error("❌ Error fetching product:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}