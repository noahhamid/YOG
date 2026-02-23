import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ storeSlug: string }> }
) {
  try {
    const { storeSlug } = await props.params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Get seller ID
    const seller = await prisma.seller.findUnique({
      where: { storeSlug },
      select: { id: true },
    });

    if (!seller) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Fetch products with pagination
    const products = await prisma.product.findMany({
      where: {
        sellerId: seller.id,
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
      select: {
        id: true,
        title: true,
        price: true,
        compareAtPrice: true,
        images: {
          select: { url: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}