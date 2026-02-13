import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
  try {
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

    // Get logged-in user from localStorage (they send it in the request)
    const userEmail = email.toLowerCase();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { seller: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign in first." },
        { status: 404 }
      );
    }

    // Check if user already has a seller application
    if (user.seller) {
      return NextResponse.json(
        { error: "You have already applied to become a seller" },
        { status: 400 }
      );
    }

    console.log(`📝 Creating seller application for user: ${user.id}`);

    // Create seller application
    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        brandName,
        ownerName,
        phone,
        email: userEmail,
        instagram: instagram || null,
        location,
        clothingType,
        businessType,
        experience: experience || null,
        description: description || null,
        approved: false, // Needs admin approval
      },
    });

    // Update user role to SELLER (but not approved yet)
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    });

    console.log(`✅ Seller application created: ${seller.id}`);
    console.log(`✅ User role updated to SELLER`);

    return NextResponse.json(
      {
        success: true,
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
    console.error("❌ Seller application error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}