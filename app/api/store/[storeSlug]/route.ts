import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ storeSlug: string }> }
) {
  try {
    const { storeSlug } = await props.params;

    // ✅ SINGLE OPTIMIZED QUERY
    const [seller, products] = await Promise.all([
      // Get seller info
      prisma.seller.findUnique({
        where: {
          storeSlug,
          approved: true,
        },
        select: {
          id: true,
          brandName: true,
          storeSlug: true,
          storeLogo: true,
          storeCover: true,
          storeDescription: true,
          description: true,
          location: true,
          instagram: true,
          totalViews: true,
          totalSales: true,
          followers: true,
          createdAt: true,
          _count: {
            select: {
              products: {
                where: { status: "PUBLISHED" },
              },
            },
          },
        },
      }),

      // Get first 12 products (separate query for speed)
      prisma.$queryRaw`
        SELECT p.id, p.title, p.price, p."compareAtPrice",
               (SELECT pi.url FROM "ProductImage" pi 
                WHERE pi."productId" = p.id 
                ORDER BY pi.position ASC 
                LIMIT 1) as image
        FROM "Product" p
        WHERE p."sellerId" IN (
          SELECT id FROM "Seller" WHERE "storeSlug" = ${storeSlug}
        )
        AND p.status = 'PUBLISHED'
        ORDER BY p."createdAt" DESC
        LIMIT 12
      `,
    ]);

    if (!seller) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // ✅ FIRE-AND-FORGET VIEW INCREMENT (NO AWAIT, NO CATCH)
    setImmediate(() => {
      prisma.seller.update({
        where: { id: seller.id },
        data: { totalViews: { increment: 1 } },
      }).catch(() => {});
    });

    return NextResponse.json({
      seller: {
        ...seller,
        totalProducts: seller._count.products,
      },
      products,
    });
  } catch (error: any) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}