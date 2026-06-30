import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

// Update product
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const productId = params.id;

    console.log(`🔍 Editing product ID: ${productId}`);

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
        { error: "You need to be a seller" },
        { status: 403 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.sellerId !== seller.id) {
      return NextResponse.json(
        { error: "You can only edit your own products" },
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

    console.log(`✏️ Updating product: ${title}`);

    await prisma.productVariant.deleteMany({
      where: { productId },
    });

    await prisma.productImage.deleteMany({
      where: { productId },
    });

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price,
        compareAtPrice,
        category,
        brand,
        status,
        variants: {
          create: variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            quantity: v.quantity,
            sku: `${title.substring(0, 3).toUpperCase()}-${v.size}-${v.color}`.replace(/\s/g, ""),
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

    console.log(`✅ Product updated: ${updatedProduct.id}`);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const productId = params.id;

    console.log(`🔍 Deleting product ID: ${productId}`);

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
        { error: "You need to be a seller" },
        { status: 403 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.sellerId !== seller.id) {
      return NextResponse.json(
        { error: "You can only delete your own products" },
        { status: 403 }
      );
    }

    console.log(`🗑️ Deleting product: ${product.title}`);

    await prisma.product.delete({
      where: { id: productId },
    });

    console.log(`✅ Product deleted: ${productId}`);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Error deleting product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}