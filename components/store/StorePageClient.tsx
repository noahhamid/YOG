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
} from "lucide-react";
import Link from "next/link";

interface StorePageClientProps {
  storeSlug: string;
  initialData: {
    seller: any;
    products: any[];
  };
}

export default function StorePageClient({
  storeSlug,
  initialData,
}: StorePageClientProps) {
  const [seller] = useState(initialData.seller);
  const [products] = useState(initialData.products);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    initialData.seller.followers,
  );

  const handleFollow = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      alert("Please sign in");
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
          sellerId: seller.id,
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
      navigator.share({ title: seller?.brandName, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const stats = [
    { icon: Eye, label: "Views", value: seller.totalViews.toLocaleString() },
    {
      icon: ShoppingBag,
      label: "Sales",
      value: seller.totalSales.toLocaleString(),
    },
    { icon: Users, label: "Followers", value: followerCount.toLocaleString() },
    { icon: Package, label: "Products", value: seller.totalProducts },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Cover - ✅ USE NEXT IMAGE */}
        <div className="relative h-64 bg-gray-900 overflow-hidden">
          {seller.storeCover ? (
            <Image
              src={seller.storeCover}
              alt="Store cover"
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
            />
          ) : (
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200"
              alt="Default cover"
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex gap-6">
              {/* Logo - ✅ USE NEXT IMAGE */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                {seller.storeLogo ? (
                  <Image
                    src={seller.storeLogo}
                    alt={seller.brandName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(seller.brandName)}&size=128`}
                    alt={seller.brandName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{seller.brandName}</h1>
                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {seller.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    Joined{" "}
                    {new Date(seller.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <p className="mb-4">
                  {seller.storeDescription || seller.description}
                </p>

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
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            {products.length === 0 ? (
              <div className="text-center py-20">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product: any) => (
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
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.title}
                    </h3>
                    <p className="font-bold">
                      {product.price.toLocaleString()} ETB
                    </p>
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
