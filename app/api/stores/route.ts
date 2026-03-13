import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stores = await prisma.seller.findMany({
      where: {
        status: "APPROVED",
        deletedAt: null,
      },
      select: {
        id:               true,
        brandName:        true,
        ownerName:        true,
        location:         true,
        clothingType:     true,
        storeLogo:        true,
        storeCover:       true,
        storeDescription: true,
        storeSlug:        true,
        totalSales:       true,
        totalViews:       true,
        // ✅ Real counts — not the stale cached `followers` integer
        _count: {
          select: {
            followersList: true,
            products: { where: { status: "PUBLISHED" } },
          },
        },
      },
      orderBy: [
        { totalSales: "desc" },
        { createdAt:  "desc" },
      ],
    });

    // Reshape: expose followers as a flat field so the client type stays the same
    const shaped = stores.map((s) => ({
      ...s,
      followers: s._count.followersList,
      _count: { products: s._count.products },
    }));

    return NextResponse.json({ stores: shaped });
  } catch (error) {
    console.error("GET /api/stores error:", error);
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}