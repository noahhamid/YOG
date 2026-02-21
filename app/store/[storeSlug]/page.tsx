import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SellerStoreClient from "@/components/SellerStoreClient";
import { Suspense } from "react";

// ✅ CACHE FOR 30 SECONDS
export const revalidate = 30;

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

export default async function StorePage({ params }: PageProps) {
  return (
    <Suspense fallback={<StoreLoadingSkeleton />}>
      <StorePageContent params={params} />
    </Suspense>
  );
}

async function StorePageContent({ params }: PageProps) {
  const { storeSlug } = await params;

  // ✅ OPTIMIZED QUERY - REDUCED DATA
  const seller = await prisma.seller.findUnique({
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
      createdAt: true,
      // Limit products to 50
      products: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          price: true,
          compareAtPrice: true,
          images: {
            select: { url: true },
            orderBy: { position: "asc" },
            take: 1, // Only first image
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50, // Limit to 50 products
      },
      // Count followers instead of loading all
      _count: {
        select: {
          followersList: true,
        },
      },
    },
  });

  if (!seller) {
    notFound();
  }

  // ✅ ASYNC INCREMENT (DON'T WAIT FOR IT)
  prisma.seller
    .update({
      where: { id: seller.id },
      data: { totalViews: { increment: 1 } },
    })
    .catch(() => {}); // Fire and forget

  return (
    <SellerStoreClient
      seller={{
        id: seller.id,
        name: seller.brandName,
        slug: seller.storeSlug || storeSlug,
        logo:
          seller.storeLogo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.brandName)}&size=200&background=000&color=fff&bold=true`,
        coverImage:
          seller.storeCover ||
          "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
        verified: true,
        location: seller.location,
        joined: seller.createdAt.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        description:
          seller.storeDescription ||
          seller.description ||
          "Welcome to our store!",
        rating: 4.8,
        totalReviews: 0,
        followers: seller._count.followersList,
        totalViews: seller.totalViews,
        totalSales: seller.totalSales,
        totalProducts: seller.products.length,
        totalStock: 0,
        instagram: seller.instagram,
      }}
      products={seller.products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.images[0]?.url || "https://via.placeholder.com/400",
        sold: 0,
      }))}
    />
  );
}

// ✅ LOADING SKELETON
function StoreLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-80 bg-gray-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="w-32 h-32 bg-gray-300 rounded-2xl animate-pulse" />
        <div className="mt-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { storeSlug } = await params;

  const seller = await prisma.seller.findUnique({
    where: { storeSlug },
    select: {
      brandName: true,
      storeDescription: true,
      description: true,
    },
  });

  if (!seller) {
    return { title: "Store Not Found" };
  }

  return {
    title: `${seller.brandName} - YOG Marketplace`,
    description:
      seller.storeDescription ||
      seller.description ||
      `Shop from ${seller.brandName}`,
  };
}
