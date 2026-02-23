"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Star,
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
  storeSlug: string;
}

// ✅ CLIENT-SIDE CACHE TO PREVENT DUPLICATE CALLS
const storeCache = new Map<string, any>();

export default function StorePageClient({ storeSlug }: StorePageClientProps) {
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const hasFetchedRef = useRef(false); // ✅ Prevent double fetch

  // ✅ FETCH ONCE - USE CACHE
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    // Check cache first
    const cached = storeCache.get(storeSlug);
    if (cached) {
      setSeller(cached.seller);
      setProducts(cached.products);
      setFollowerCount(cached.seller.followers);
      setIsLoading(false);
      checkFollow(cached.seller.id);
      return;
    }

    fetchStore();
  }, [storeSlug]);

  const fetchStore = async () => {
    try {
      const res = await fetch(`/api/store/${storeSlug}`);
      const data = await res.json();

      if (res.ok) {
        // ✅ CACHE THE RESPONSE
        storeCache.set(storeSlug, data);

        setSeller(data.seller);
        setProducts(data.products);
        setFollowerCount(data.seller.followers);
        setIsLoading(false);

        // Check follow (non-blocking)
        checkFollow(data.seller.id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const checkFollow = async (sellerId: string) => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;

    try {
      const res = await fetch(`/api/follow?sellerId=${sellerId}`, {
        headers: { "x-user-data": userStr },
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      // Silently fail
    }
  };

  const handleFollow = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      alert("Please sign in");
      return;
    }

    // Optimistic update
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
      // Revert on error
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

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="h-64 bg-gray-200 animate-pulse" />
          <div className="max-w-7xl mx-auto px-4 -mt-20">
            <div className="w-32 h-32 bg-gray-300 rounded-2xl animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  if (!seller) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
            <Link href="/" className="text-blue-600">
              Go Home
            </Link>
          </div>
        </div>
      </>
    );
  }

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
        {/* Cover */}
        <div className="relative h-64 bg-gray-900 overflow-hidden">
          <img
            src={
              seller.storeCover ||
              "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200"
            }
            alt="Cover"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex gap-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                <img
                  src={
                    seller.storeLogo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.brandName)}`
                  }
                  alt={seller.brandName}
                  className="w-full h-full object-cover"
                />
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
                    className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
                      isFollowing ? "bg-gray-100" : "bg-black text-white"
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
                    className="p-3 bg-gray-100 rounded-full"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-6">
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
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <img
                          src={
                            product.image || "https://via.placeholder.com/400"
                          }
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {product.title}
                      </h3>
                      <p className="font-bold">
                        {product.price.toLocaleString()} ETB
                      </p>
                    </div>
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
