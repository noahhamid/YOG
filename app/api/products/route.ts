import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "You need to be a seller to add products" },
        { status: 403 }
      );
    }

    if (!seller.approved) {
      return NextResponse.json(
        { error: "Your seller account is not approved yet" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      compareAtPrice,
      category,
      brand,
      status,
      variants,
      images,
    } = body;

    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!variants || variants.length === 0) {
      return NextResponse.json(
        { error: "At least one variant is required" },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    console.log(`📦 Creating product: ${title}`);

    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        title,
        description,
        price,
        compareAtPrice,
        category,
        brand,
        status: status || "PUBLISHED",
        variants: {
          create: variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            quantity: v.quantity,
            sku: `${title.substring(0, 3).toUpperCase()}-${v.size}-${v.color}`.replace(
              /\s/g,
              ""
            ),
          })),
        },
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            position: index,
          })),
        },
      },
      include: {
        variants: true,
        images: true,
      },
    });

    console.log(`✅ Product created: ${product.id}`);

    if (product.status === "PUBLISHED") {
      try {
        const followers = await prisma.follow.findMany({
          where: { sellerId: seller.id },
          select: { userId: true },
        });

        if (followers.length > 0) {
          await prisma.notification.createMany({
            data: followers.map((follow) => ({
              userId: follow.userId,
              type: "NEW_PRODUCT",
              title: `New product from ${seller.brandName}`,
              message: `Check out: ${product.title}`,
              productId: product.id,
              sellerId: seller.id,
              imageUrl: images[0] || null,
            })),
          });

          console.log(`🔔 Sent notifications to ${followers.length} followers`);
        }
      } catch (notifError) {
        console.error("❌ Error creating notifications:", notifError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error: any) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id },
    });

    if (!seller) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: seller.id },
      include: {
        variants: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}