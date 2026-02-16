import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;


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
      },
    });

    if (!product || !product.seller.approved) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Get unique sizes and colors
    const sizes = [...new Set(product.variants.map((v) => v.size))];
    const colors = [
      ...new Set(product.variants.map((v) => v.color.toLowerCase())),
    ];

    // Calculate total stock
    const totalStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);

    // Transform for frontend
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
        verified: product.seller.approved,
        followers: product.seller.followersList.length,
        location: product.seller.location,
        instagram: product.seller.instagram,
      },
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