import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await requireAuth();

    const body = await req.json();
    const {
      brandName,
      ownerName,
      phone,
      email,
      instagram,
      location,
      clothingType,
      businessType,
      experience,
      description,
    } = body;

    // Validation
    if (!brandName || !ownerName || !phone || !email || !location || !clothingType || !businessType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has a seller application
    const existingSeller = await prisma.seller.findUnique({
      where: { userId: user.id },
    });

    if (existingSeller) {
      return NextResponse.json(
        { error: "You have already applied to become a seller" },
        { status: 400 }
      );
    }

    // Create seller application
    // Create seller application
const seller = await prisma.seller.create({
  data: {
    userId: user.id,
    brandName,
    location,
    instagram: instagram || null,
    clothingType,
    businessType,
    experience: experience || null,
    description: description || null,
    approved: false,
  },
});

    // Update user role to SELLER (but still not approved)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "SELLER",
        name: ownerName,
        email: email,
        phone: phone,
      },
    });

    return NextResponse.json(
      {
        message: "Seller application submitted successfully",
        seller: {
          id: seller.id,
          brandName: seller.brandName,
          approved: seller.approved,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Seller application error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}