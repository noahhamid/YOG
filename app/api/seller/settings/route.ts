import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// GET - Fetch seller settings (minimal data)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        brandName: true,
        storeSlug: true,
        storeLogo: true,
        storeCover: true,
        storeDescription: true,
        instagram: true,
        location: true,
      },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({ seller });
  } catch (error) {
    console.error("Error fetching seller:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update seller settings
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      brandName,
      storeSlug,
      storeLogo,
      storeCover,
      storeDescription,
      instagram,
      location,
    } = body;

    if (storeSlug && !/^[a-z0-9-]+$/.test(storeSlug)) {
      return NextResponse.json(
        {
          error:
            "Store URL can only contain lowercase letters, numbers, and hyphens",
        },
        { status: 400 }
      );
    }

    try {
      const updated = await prisma.seller.update({
        where: { userId: session.user.id },
        data: {
          ...(brandName && { brandName }),
          ...(storeSlug && { storeSlug }),
          ...(storeLogo !== undefined && { storeLogo }),
          ...(storeCover !== undefined && { storeCover }),
          ...(storeDescription !== undefined && { storeDescription }),
          ...(instagram !== undefined && { instagram }),
          ...(location && { location }),
        },
        select: {
          id: true,
          brandName: true,
          storeSlug: true,
          storeLogo: true,
          storeCover: true,
        },
      });

      return NextResponse.json({
        success: true,
        seller: updated,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "This store URL is already taken" },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error updating seller:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}