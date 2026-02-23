import StorePageClient from "@/components/store/StorePageClient";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params;

  return <StorePageClient storeSlug={storeSlug} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { storeSlug } = await params;

  return {
    title: `Store - YOG Marketplace`,
    description: "Shop from verified sellers",
  };
}
