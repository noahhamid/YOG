import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StorePageClient from "@/components/store/StorePageClient";
import { cache } from "react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

// ✅ CACHED SERVER-SIDE FETCH
const getCachedStore = cache(async (storeSlug: string) => {
  try {
    const [seller, products] = await Promise.all([
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

      prisma.product.findMany({
        where: {
          seller: { storeSlug },
          status: "PUBLISHED",
        },
        select: {
          id: true,
          title: true,
          price: true,
          compareAtPrice: true,
          images: {
            select: { url: true },
            orderBy: { position: "asc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 24,
      }),
    ]);

    if (!seller) return null;

    // ✅ NON-BLOCKING VIEW INCREMENT
    prisma.seller
      .update({
        where: { id: seller.id },
        data: { totalViews: { increment: 1 } },
      })
      .catch(() => {});

    return {
      seller: {
        ...seller,
        totalProducts: seller._count.products,
      },
      products: products.map((p) => ({
        ...p,
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
  const data = await getCachedStore(storeSlug);

  if (!data) {
    notFound();
  }

  return <StorePageClient initialData={data} storeSlug={storeSlug} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { storeSlug } = await params;
  const data = await getCachedStore(storeSlug);

  if (!data) {
    return {
      title: "Store Not Found - YOG Marketplace",
    };
  }

  return {
    title: `${data.seller.brandName} - YOG Marketplace`,
    description:
      data.seller.storeDescription ||
      data.seller.description ||
      "Shop from verified sellers",
    openGraph: {
      title: data.seller.brandName,
      description: data.seller.storeDescription || data.seller.description,
      images: [data.seller.storeLogo || data.seller.storeCover].filter(Boolean),
    },
  };
}

// ✅ PRE-GENERATE POPULAR STORES
export async function generateStaticParams() {
  const sellers = await prisma.seller.findMany({
    where: { approved: true },
    select: { storeSlug: true },
    take: 50,
    orderBy: { totalViews: "desc" },
  });

  return sellers.map((seller) => ({
    storeSlug: seller.storeSlug,
  }));
}
