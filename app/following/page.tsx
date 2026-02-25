"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Package,
  Users,
  ShoppingBag,
  Store,
  Loader2,
} from "lucide-react";

interface FollowedSeller {
  followId: string;
  followedAt: string;
  seller: {
    id: string;
    brandName: string;
    storeSlug: string | null;
    storeLogo: string | null;
    storeCover: string | null;
    storeDescription: string | null;
    location: string;
    followers: number;
    totalProducts: number; // ✅ Now calculated from _count
    totalSales: number;
    approved: boolean;
  };
}

export default function FollowingPage() {
  const router = useRouter();
  const [following, setFollowing] = useState<FollowedSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFollowing();
  }, []);

  const loadFollowing = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login?redirect=/following");
      return;
    }

    try {
      const res = await fetch("/api/following", {
        headers: {
          "x-user-data": userStr,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFollowing(data.following);
      }
    } catch (error) {
      console.error("Error loading following:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (sellerId: string) => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;

    if (!confirm("Unfollow this store?")) return;

    try {
      const res = await fetch("/api/store/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr,
        },
        body: JSON.stringify({
          sellerId,
          action: "unfollow",
        }),
      });

      if (res.ok) {
        // Remove from list
        setFollowing((prev) => prev.filter((f) => f.seller.id !== sellerId));
      }
    } catch (error) {
      console.error("Error unfollowing:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
          <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Following</h1>
            <p className="text-gray-600">
              {following.length} store{following.length !== 1 ? "s" : ""} you
              follow
            </p>
          </div>

          {/* Following List */}
          {following.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Store size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Not following anyone yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start following stores to see them here
              </p>
              <Link
                href="/shop"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Explore Stores
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {following.map((item) => (
                <div
                  key={item.followId}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
                >
                  {/* Cover Image */}
                  <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-700">
                    {item.seller.storeCover ? (
                      <Image
                        src={item.seller.storeCover}
                        alt={item.seller.brandName}
                        fill
                        className="object-cover opacity-50"
                      />
                    ) : null}
                  </div>

                  {/* Logo */}
                  <div className="px-6 -mt-12 relative z-10 mb-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
                      {item.seller.storeLogo ? (
                        <Image
                          src={item.seller.storeLogo}
                          alt={item.seller.brandName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                          <Store size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="px-6 pb-6">
                    <h3 className="text-xl font-bold mb-2">
                      {item.seller.brandName}
                    </h3>

                    {item.seller.storeDescription && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.seller.storeDescription}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin size={14} />
                      <span>{item.seller.location}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {item.seller.totalProducts}
                        </p>
                        <p className="text-xs text-gray-600">Products</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {item.seller.followers}
                        </p>
                        <p className="text-xs text-gray-600">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {item.seller.totalSales}
                        </p>
                        <p className="text-xs text-gray-600">Sales</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/store/${item.seller.storeSlug}`}
                        className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors text-center"
                      >
                        Visit Store
                      </Link>
                      <button
                        onClick={() => handleUnfollow(item.seller.id)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        <Heart size={18} className="fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
