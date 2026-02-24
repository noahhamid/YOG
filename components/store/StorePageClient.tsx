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
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface StorePageClientProps {
  storeData: {
    id: string;
    brandName: string;
    storeSlug: string | null;
    storeLogo: string | null;
    storeCover: string | null;
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

  const stats = [
    { icon: Eye, label: "Views", value: storeData.totalViews.toLocaleString() },
    {
      icon: ShoppingBag,
      label: "Sales",
      value: storeData.totalSales.toLocaleString(),
    },
    { icon: Users, label: "Followers", value: followerCount.toLocaleString() },
    {
      icon: Package,
      label: "Products",
      value: storeData.totalProducts.toString(),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Cover Image */}
        <div className="relative h-64 bg-gray-900 overflow-hidden">
          {storeData.storeCover ? (
            <Image
              src={storeData.storeCover}
              alt="Store cover"
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          {/* Store Header */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                {storeData.storeLogo ? (
                  <Image
                    src={storeData.storeLogo}
                    alt={storeData.brandName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                    <Package size={48} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1
                  className="text-4xl font-bold mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {storeData.brandName}
                </h1>
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
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
                      className="flex items-center gap-1 hover:text-black transition-colors"
                    >
                      <Instagram size={16} />@{storeData.instagram}
                    </a>
                  )}
                </div>
                {storeData.storeDescription && (
                  <p className="mb-4 text-gray-700">
                    {storeData.storeDescription}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors ${
                      isFollowing
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={isFollowing ? "fill-current" : ""}
                    />
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <Icon size={24} className="mb-2 text-gray-600" />
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl p-8 mb-8">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Products
            </h2>
            {storeData.products.length === 0 ? (
              <div className="text-center py-20">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {storeData.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
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
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.title}
                    </h3>
                    <p className="font-bold">
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
