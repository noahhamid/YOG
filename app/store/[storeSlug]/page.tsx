import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SellerStoreClient from "@/components/SellerStoreClient";

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params;

  // Fetch seller data
  const seller = await prisma.seller.findUnique({
    where: {
      storeSlug,
      approved: true, // Only show approved sellers
    },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: {
          images: {
            orderBy: { position: "asc" },
          },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
      },
      followersList: true,
    },
  });

  if (!seller) {
    notFound();
  }

  // Increment view count
  await prisma.seller.update({
    where: { id: seller.id },
    data: { totalViews: { increment: 1 } },
  });

  // Calculate stats
  const totalStock = seller.products.reduce(
    (sum, product) =>
      sum + product.variants.reduce((vSum, v) => vSum + v.quantity, 0),
    0,
  );

  const averageRating = 4.8; // TODO: Calculate from reviews when implemented
  const totalReviews = 0; // TODO: Count from reviews when implemented

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
        verified: seller.approved,
        location: seller.location,
        joined: seller.createdAt.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        description:
          seller.storeDescription ||
          seller.description ||
          "Welcome to our store!",
        rating: averageRating,
        totalReviews,
        followers: seller.followersList.length,
        totalViews: seller.totalViews,
        totalSales: seller.totalSales,
        totalProducts: seller.products.length,
        totalStock,
        instagram: seller.instagram,
      }}
      products={seller.products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.images[0]?.url || "https://via.placeholder.com/400",
        sold: 0, // TODO: Calculate from orders when implemented
      }))}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { storeSlug } = await params;

  const seller = await prisma.seller.findUnique({
    where: { storeSlug },
  });

  if (!seller) {
    return {
      title: "Store Not Found",
    };
  }

  return {
    title: `${seller.brandName} - YOG Marketplace`,
    description:
      seller.storeDescription ||
      seller.description ||
      `Shop from ${seller.brandName}`,
  };
}
