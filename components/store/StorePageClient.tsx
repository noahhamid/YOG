"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import {
  MapPin,
  Heart,
  Share2,
  Package,
  Eye,
  ShoppingBag,
  Users,
  Calendar,
  Instagram,
} from "lucide-react";
import Link from "next/link";

interface StorePageClientProps {
  storeData: {
    id: string;
    brandName: string;
    storeSlug: string | null;
    storeDescription: string | null;
    location: string;
    instagram: string | null;
    totalViews: number;
    totalSales: number;
    followers: number;
    totalProducts: number;
    createdAt: Date;
    products: Array<{
      id: string;
      title: string;
      price: number;
      compareAtPrice: number | null;
      image: string | null;
    }>;
  };
}

export default function StorePageClient({ storeData }: StorePageClientProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(storeData.followers);

  const handleFollow = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      alert("Please sign in to follow");
      return;
    }

    const wasFollowing = isFollowing;
    setIsFollowing(!isFollowing);
    setFollowerCount((prev) => (wasFollowing ? prev - 1 : prev + 1));

    try {
      await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr,
        },
        body: JSON.stringify({
          sellerId: storeData.id,
          action: wasFollowing ? "unfollow" : "follow",
        }),
      });
    } catch (error) {
      setIsFollowing(wasFollowing);
      setFollowerCount((prev) => (wasFollowing ? prev + 1 : prev - 1));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: storeData.brandName,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Store Header - Text Only */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  {storeData.brandName}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {storeData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    Joined{" "}
                    {new Date(storeData.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  {storeData.instagram && (
                    <a
                      href={`https://instagram.com/${storeData.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-black"
                    >
                      <Instagram size={16} />@{storeData.instagram}
                    </a>
                  )}
                </div>
                {storeData.storeDescription && (
                  <p className="text-gray-700 mb-4">
                    {storeData.storeDescription}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    isFollowing
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isFollowing ? "fill-current" : ""}
                  />
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <Eye size={24} className="mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold">
                {storeData.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Views</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <ShoppingBag size={24} className="mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold">
                {storeData.totalSales.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Sales</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Users size={24} className="mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold">
                {followerCount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Package size={24} className="mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold">{storeData.totalProducts}</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
          </div>

          {/* Products Grid - WITH IMAGES */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            {storeData.products.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {storeData.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package size={32} className="text-gray-400" />
                        </div>
                      )}
                      {product.compareAtPrice &&
                        product.compareAtPrice > product.price && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            -
                            {Math.round(
                              ((product.compareAtPrice - product.price) /
                                product.compareAtPrice) *
                                100,
                            )}
                            %
                          </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.title}
                    </h3>
                    <p className="font-bold text-lg">
                      {product.price.toLocaleString()} ETB
                    </p>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">
                          {product.compareAtPrice.toLocaleString()} ETB
                        </p>
                      )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
