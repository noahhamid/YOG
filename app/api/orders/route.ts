import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Create new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      customerName,
      customerPhone,
      customerEmail,
      quantity,
      selectedSize,
      selectedColor,
      deliveryMethod,
      deliveryAddress,
      unitPrice,
      deliveryFee,
    } = body;

    // Validation
    if (!productId || !customerName || !customerPhone || !quantity || !selectedSize || !selectedColor || !deliveryMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (deliveryMethod === "DELIVERY" && !deliveryAddress) {
      return NextResponse.json(
        { error: "Delivery address is required for delivery orders" },
        { status: 400 }
      );
    }

    // Get product and verify stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
        seller: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if variant exists and has stock
    const variant = product.variants.find(
      (v) => v.size === selectedSize && v.color.toLowerCase() === selectedColor.toLowerCase()
    );

    if (!variant) {
      return NextResponse.json(
        { error: "Selected variant not found" },
        { status: 404 }
      );
    }

    if (variant.quantity < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.quantity} items available in stock` },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Calculate totals
    const totalPrice = unitPrice * quantity;
    const finalTotal = totalPrice + (deliveryFee || 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        productId,
        sellerId: product.sellerId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        quantity,
        selectedSize,
        selectedColor,
        unitPrice,
        totalPrice,
        deliveryFee: deliveryFee || 0,
        finalTotal,
        deliveryMethod,
        deliveryAddress: deliveryMethod === "DELIVERY" ? deliveryAddress : null,
        status: "PENDING",
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        seller: true,
      },
    });

    // Reduce stock (optional - you might want to do this only when order is confirmed)
    await prisma.productVariant.update({
      where: { id: variant.id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    console.log(`✅ Order created: ${orderNumber}`);
    console.log(`📦 Product: ${product.title}`);
    console.log(`👤 Customer: ${customerName} (${customerPhone})`);
    console.log(`🏪 Seller: ${product.seller.brandName}`);

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: {
        orderNumber: order.orderNumber,
        id: order.id,
        status: order.status,
        totalPrice: order.finalTotal,
        deliveryMethod: order.deliveryMethod,
      },
    });
  } catch (error: any) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}