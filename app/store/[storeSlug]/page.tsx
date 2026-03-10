import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SellerStoreClient from "@/components/store/StorePageClient";

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params;

  const seller = await prisma.seller.findUnique({
    where: { storeSlug, approved: true },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: {
          images: { orderBy: { position: "asc" } },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
      },
      followersList: true,
    },
  });

  if (!seller) notFound();

  await prisma.seller.update({
    where: { id: seller.id },
    data: { totalViews: { increment: 1 } },
  });

  const totalStock = seller.products.reduce(
    (sum, p) => sum + p.variants.reduce((vs, v) => vs + v.quantity, 0),
    0,
  );

  const now = Date.now();
  const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14;

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
        rating: 4.8,
        totalReviews: 0,
        followers: seller.followersList.length,
        totalViews: seller.totalViews,
        totalSales: seller.totalSales,
        totalProducts: seller.products.length,
        totalStock,
        instagram: seller.instagram,
      }}
      products={seller.products.map((product) => {
        const sizes = [...new Set(product.variants.map((v) => v.size))];
        const colors = [...new Set(product.variants.map((v) => v.color))];
        const stock = product.variants.reduce((s, v) => s + v.quantity, 0);
        const isNew = now - new Date(product.createdAt).getTime() < TWO_WEEKS;
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images[0]?.url || "https://via.placeholder.com/400",
          image2: product.images[1]?.url,
          sold: 0,
          sizes,
          colors,
          stock,
          isNew,
          category: product.category,
        };
      })}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { storeSlug } = await params;
  const seller = await prisma.seller.findUnique({ where: { storeSlug } });
  if (!seller) return { title: "Store Not Found" };
  return {
    title: `${seller.brandName} - YOG Marketplace`,
    description:
      seller.storeDescription ||
      seller.description ||
      `Shop from ${seller.brandName}`,
  };
}
