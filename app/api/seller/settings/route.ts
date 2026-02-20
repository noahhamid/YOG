import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch seller settings
export async function GET(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userStr);

    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({ seller });
  } catch (error) {
    console.error("Error fetching seller:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT - Update seller settings
export async function PUT(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userStr);
    const body = await req.json();

    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    const {
      brandName,
      storeSlug,
      storeLogo,
      storeCover,
      storeDescription,
      instagram,
      location,
    } = body;

    // Validate slug if changed
    if (storeSlug && storeSlug !== seller.storeSlug) {
      const existing = await prisma.seller.findUnique({
        where: { storeSlug },
      });

      if (existing) {
        return NextResponse.json(
          { error: "This store URL is already taken" },
          { status: 400 }
        );
      }

      if (!/^[a-z0-9-]+$/.test(storeSlug)) {
        return NextResponse.json(
          { error: "Store URL can only contain lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }
    }

    // Update seller
    const updated = await prisma.seller.update({
      where: { id: seller.id },
      data: {
        brandName: brandName || seller.brandName,
        storeSlug: storeSlug || seller.storeSlug,
        storeLogo: storeLogo !== undefined ? storeLogo : seller.storeLogo,
        storeCover: storeCover !== undefined ? storeCover : seller.storeCover,
        storeDescription: storeDescription !== undefined ? storeDescription : seller.storeDescription,
        instagram: instagram !== undefined ? instagram : seller.instagram,
        location: location || seller.location,
      },
    });

    return NextResponse.json({
      success: true,
      seller: updated,
    });
  } catch (error: any) {
    console.error("Error updating seller:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}