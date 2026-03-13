import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId, customerName, customerPhone, customerEmail,
      quantity, selectedSize, selectedColor,
      deliveryMethod, deliveryAddress, unitPrice, deliveryFee,
    } = body;

    if (!productId || !customerName || !customerPhone || !quantity || !selectedSize || !selectedColor || !deliveryMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (deliveryMethod === "DELIVERY" && !deliveryAddress) {
      return NextResponse.json({ error: "Delivery address is required for delivery orders" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
        seller: true,
        images: { orderBy: { position: 'asc' }, take: 1 },
      },
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const variant = product.variants.find(
      (v) => v.size === selectedSize && v.color.toLowerCase() === selectedColor.toLowerCase()
    );

    if (!variant) return NextResponse.json({ error: "Selected variant not found" }, { status: 404 });

    // ✅ Check stock — but DON'T deduct yet. Stock only moves when SHIPPED.
    if (variant.quantity < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.quantity} items available in stock` },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const totalPrice = unitPrice * quantity;
    const finalTotal = totalPrice + (deliveryFee || 0);

    const order = await prisma.order.create({
      data: {
        orderNumber, productId,
        sellerId: product.sellerId,
        customerName, customerPhone,
        customerEmail: customerEmail || null,
        quantity, selectedSize, selectedColor,
        unitPrice, totalPrice,
        deliveryFee: deliveryFee || 0,
        finalTotal, deliveryMethod,
        deliveryAddress: deliveryMethod === "DELIVERY" ? deliveryAddress : null,
        status: "PENDING",
      },
      include: {
        product: { include: { images: true } },
        seller: true,
      },
    });

    // Notify seller of new order
    await prisma.notification.create({
      data: {
        userId: product.seller.userId,
        type: "ORDER_UPDATE",
        title: "New Order Received! 🎉",
        message: `${customerName} ordered ${quantity}x ${product.title} (${selectedSize}, ${selectedColor}) - ${finalTotal.toLocaleString()} ETB`,
        productId: product.id,
        sellerId: product.sellerId,
        imageUrl: product.images[0]?.url || null,
      },
    });

    console.log(`✅ Order created: ${orderNumber} — stock held, not deducted yet`);

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
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}