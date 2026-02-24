import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StorePageClient from "@/components/store/StorePageClient";
import { cache } from "react";

export const revalidate = 30;

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

const getStoreData = cache(async (storeSlug: string) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        storeSlug,
        approved: true,
      },
      select: {
        id: true,
        brandName: true,
        storeSlug: true,
        storeDescription: true,
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
        products: {
          where: { status: "PUBLISHED" },
          select: {
            id: true,
            title: true,
            price: true,
            compareAtPrice: true,
            // ✅ ADD IMAGES
            images: {
              select: { url: true },
              orderBy: { position: "asc" },
              take: 1,
            },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!seller) return null;

    // Non-blocking view increment
    setImmediate(() => {
      prisma.seller
        .update({
          where: { id: seller.id },
          data: { totalViews: { increment: 1 } },
        })
        .catch(() => {});
    });

    return {
      id: seller.id,
      brandName: seller.brandName,
      storeSlug: seller.storeSlug,
      storeDescription: seller.storeDescription,
      location: seller.location,
      instagram: seller.instagram,
      totalViews: seller.totalViews,
      totalSales: seller.totalSales,
      followers: seller.followers,
      totalProducts: seller._count.products,
      createdAt: seller.createdAt,
      // ✅ MAP TO INCLUDE IMAGE
      products: seller.products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        image: p.images[0]?.url || null,
      })),
    };
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
});

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params;
  const storeData = await getStoreData(storeSlug);

  if (!storeData) {
    notFound();
  }

  return <StorePageClient storeData={storeData} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { storeSlug } = await params;
  const storeData = await getStoreData(storeSlug);

  if (!storeData) {
    return {
      title: "Store Not Found - YOG Marketplace",
    };
  }

  return {
    title: `${storeData.brandName} - YOG Marketplace`,
    description:
      storeData.storeDescription || `Shop from ${storeData.brandName}`,
  };
}
