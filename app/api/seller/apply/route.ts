import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

function generateSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

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

    if (!brandName || !ownerName || !phone || !email || !location || !clothingType || !businessType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { seller: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign in first." },
        { status: 404 }
      );
    }

    const slug = generateSlug(brandName);
    const userEmail = email.toLowerCase();

    if (user.seller) {
      if (user.seller.rejectionReason) {
        console.log(`🔄 Reapplying seller: ${user.id}`);

        const seller = await prisma.seller.update({
          where: { userId: user.id },
          data: {
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
            approved: false,
            rejectionReason: null,
            storeSlug: slug,
          },
        });

        console.log(`✅ Seller reapplication submitted: ${seller.id}`);

        return NextResponse.json(
          {
            success: true,
            message: "Seller reapplication submitted successfully",
            seller: {
              id: seller.id,
              brandName: seller.brandName,
              approved: seller.approved,
            },
          },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { error: "You have already applied to become a seller" },
          { status: 400 }
        );
      }
    }

    console.log(`📝 Creating seller application for user: ${user.id}`);

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
        approved: false,
        storeSlug: slug,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    });

    console.log(`✅ Seller application created: ${seller.id}`);
    console.log(`✅ User role updated to SELLER`);
    console.log(`✅ Store slug generated: ${slug}`);

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