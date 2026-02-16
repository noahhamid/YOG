import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch product
  const product = await prisma.product.findUnique({
    where: {
      id,
      status: "PUBLISHED",
    },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
      variants: {
        orderBy: { size: "asc" },
      },
      seller: {
        include: {
          followersList: true,
        },
      },
    },
  });

  if (!product || !product.seller.approved) {
    notFound();
  }

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  // Calculate total stock
  const totalStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);

  // Get related products (same category, different product)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      status: "PUBLISHED",
      seller: {
        approved: true,
      },
    },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
      variants: true,
    },
    take: 4,
  });

  // Transform data for client
  const transformedProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    discount: product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : 0,
    category: product.category,
    brand: product.brand || product.seller.brandName,
    images: product.images.map((img) => img.url),
    variants: product.variants.map((v) => ({
      size: v.size,
      color: v.color,
      quantity: v.quantity,
      available: v.quantity > 0,
    })),
    sizes: sizes.map((size) => ({
      value: size,
      available: product.variants.some(
        (v) => v.size === size && v.quantity > 0,
      ),
    })),
    colors: colors.map((color) => ({
      name: color.charAt(0).toUpperCase() + color.slice(1),
      value: color.toLowerCase(),
      hex: getColorHex(color),
    })),
    totalStock,
    inStock: totalStock > 0,
    seller: {
      id: product.seller.id,
      name: product.seller.brandName,
      slug: product.seller.storeSlug,
      verified: product.seller.approved,
      followers: product.seller.followersList.length,
      location: product.seller.location,
      instagram: product.seller.instagram,
      rating: 4.8, // TODO: Calculate from reviews
      responseRate: 98, // TODO: Calculate from actual data
      responseTime: "within hours", // TODO: Calculate from actual data
      joinedDate: product.seller.createdAt.getFullYear().toString(),
    },
    createdAt: product.createdAt.toISOString(),
    rating: 4.5, // TODO: Calculate from reviews
    reviewCount: 0, // TODO: Count from reviews
    sold: 0, // TODO: Calculate from orders
  };

  const transformedRelated = relatedProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.map((img) => img.url),
    rating: 4.5, // TODO: Calculate from reviews
  }));

  return (
    <ProductDetailClient
      product={transformedProduct}
      relatedProducts={transformedRelated}
    />
  );
}

// Helper function to get color hex codes
function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    gray: "#9CA3AF",
    grey: "#9CA3AF",
    blue: "#3B82F6",
    red: "#EF4444",
    green: "#10B981",
    khaki: "#C4B5A0",
    yellow: "#FCD34D",
    orange: "#FB923C",
    pink: "#EC4899",
    purple: "#A855F7",
    brown: "#92400E",
    beige: "#E5D3B3",
    navy: "#1E3A8A",
  };

  return colorMap[color.toLowerCase()] || "#9CA3AF";
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: true,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} - YOG Marketplace`,
    description: product.description,
  };
}
