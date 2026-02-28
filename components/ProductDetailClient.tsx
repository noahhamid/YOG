"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Share2 } from "lucide-react";
import ProductImageGallery from "./product/ProductImageGallery";
import ProductInfo from "./product/ProductInfo";
import SellerCard from "./product/SellerCard";
import ProductReviews from "./product/ProductReviews";
import { productCache } from "@/lib/productCache";

interface Props {
  product: any;
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ LIFT RATING STATE UP SO BOTH ProductInfo AND ProductReviews CAN SHARE IT
  const [liveRating, setLiveRating] = useState<number>(product.rating || 0);
  const [liveReviewCount, setLiveReviewCount] = useState<number>(
    product.reviewCount || 0,
  );

  // Cache the product data when component mounts
  useEffect(() => {
    productCache.set(product.id, product);
  }, [product]);

  // Called by ProductReviews whenever a review is added, edited, or deleted
  const handleReviewChange = (newRating: number, newCount: number) => {
    setLiveRating(newRating);
    setLiveReviewCount(newCount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Share2 size={18} />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart
                size={18}
                className={isFavorite ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images & Reviews */}
          <div className="space-y-6">
            <ProductImageGallery
              images={product.images}
              title={product.title}
              discount={product.discount}
            />

            {/* Reviews Section — passes callback up */}
            <ProductReviews
              productId={product.id}
              onReviewChange={handleReviewChange}
            />
          </div>

          {/* Right Column - Info */}
          <div className="space-y-4">
            <SellerCard seller={product.seller} />

            {/* Pass live rating & reviewCount so ProductInfo updates instantly */}
            <ProductInfo
              product={{
                ...product,
                rating: liveRating,
                reviewCount: liveReviewCount,
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 max-w-3xl">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
