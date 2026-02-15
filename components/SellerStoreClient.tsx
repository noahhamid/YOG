"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Check,
  Star,
  Share2,
  Heart,
  Eye,
  ShoppingBag,
  Users,
  Package,
  Award,
  Calendar,
  Instagram,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SellerStoreClientProps {
  seller: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    coverImage: string;
    verified: boolean;
    location: string;
    joined: string;
    description: string;
    rating: number;
    totalReviews: number;
    followers: number;
    totalViews: number;
    totalSales: number;
    totalProducts: number;
    totalStock: number;
    instagram: string | null;
  };
  products: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    image: string;
    sold: number;
  }>;
}

export default function SellerStoreClient({
  seller,
  products,
}: SellerStoreClientProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "about">("products");
  const [followerCount, setFollowerCount] = useState(seller.followers);

  // Check if user is already following
  useEffect(() => {
    const checkFollowStatus = async () => {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;

      try {
        const response = await fetch(
          `/api/store/follow?sellerId=${seller.id}`,
          {
            headers: {
              "x-user-data": userStr,
            },
          },
        );

        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [seller.id]);

  const handleFollow = async () => {
    const userStr = localStorage.getItem("yog_user");

    if (!userStr) {
      alert("Please sign in to follow stores");
      router.push("/login?redirect=/store/" + seller.slug);
      return;
    }

    setIsFollowLoading(true);

    try {
      const response = await fetch("/api/store/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr,
        },
        body: JSON.stringify({
          sellerId: seller.id,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      } else {
        alert(data.error || "Failed to follow store");
      }
    } catch (error) {
      console.error("Error following store:", error);
      alert("Failed to follow store");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: seller.name,
          text: `Check out ${seller.name} on YOG Marketplace!`,
          url,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Store link copied to clipboard!");
    }
  };

  const stats = [
    {
      icon: Eye,
      label: "Total Views",
      value: seller.totalViews.toLocaleString(),
      color: "blue",
    },
    {
      icon: ShoppingBag,
      label: "Total Sales",
      value: seller.totalSales.toLocaleString(),
      color: "green",
    },
    {
      icon: Users,
      label: "Followers",
      value: followerCount.toLocaleString(),
      color: "purple",
    },
    {
      icon: Package,
      label: "Products",
      value: seller.totalProducts,
      color: "orange",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden">
          <img
            src={seller.coverImage}
            alt={seller.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          {/* Store Header */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Logo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <img
                    src={seller.logo}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {seller.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                    <Check size={20} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Store Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1
                      className="text-4xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {seller.name}
                    </h1>
                    <div className="flex items-center gap-4 flex-wrap mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-gray-600" />
                        <span
                          className="text-gray-600"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {seller.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-gray-600" />
                        <span
                          className="text-gray-600"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Joined {seller.joined}
                        </span>
                      </div>
                      {seller.instagram && (
                        <a
                          href={`https://instagram.com/${seller.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-pink-600 hover:text-pink-700 transition-colors"
                        >
                          <Instagram size={16} />
                          <span style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {seller.instagram}
                          </span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">
                          {seller.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-600 text-sm">
                          ({seller.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {seller.verified && (
                        <span
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Award size={12} />
                          Verified Seller
                        </span>
                      )}
                      {seller.rating >= 4.5 && (
                        <span
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-200"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Star size={12} />
                          Top Rated
                        </span>
                      )}
                      {seller.totalStock > 100 && (
                        <span
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Package size={12} />
                          Large Inventory
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleFollow}
                      disabled={isFollowLoading}
                      className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-800"
                      } disabled:opacity-50`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Heart
                        size={18}
                        className={isFollowing ? "fill-current" : ""}
                      />
                      {isFollowLoading
                        ? "..."
                        : isFollowing
                          ? "Following"
                          : "Follow"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                blue: "from-blue-500 to-blue-600",
                green: "from-green-500 to-green-600",
                purple: "from-purple-500 to-purple-600",
                orange: "from-orange-500 to-orange-600",
              };
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[stat.color as keyof typeof colors]} flex items-center justify-center`}
                    >
                      <Icon size={28} className="text-white" />
                    </div>
                    <div>
                      <p
                        className="text-sm text-gray-600 mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <div className="flex gap-6 overflow-x-auto">
                {["products", "about"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`pb-4 font-semibold capitalize transition-colors relative whitespace-nowrap ${
                      activeTab === tab
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {products.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-gray-100">
                  <Package size={64} className="text-gray-300 mb-4" />
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    No products yet
                  </h3>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    This store hasn't listed any products yet
                  </p>
                </div>
              ) : (
                products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="group bg-white rounded-2xl p-3 border-2 border-gray-100 hover:shadow-xl transition-all cursor-pointer">
                        <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-3 aspect-square">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.compareAtPrice &&
                            product.compareAtPrice > product.price && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
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
                        <h3
                          className="font-semibold mb-1 truncate"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className="font-bold text-lg"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {product.price.toLocaleString()} ETB
                            </p>
                            {product.compareAtPrice &&
                              product.compareAtPrice > product.price && (
                                <p className="text-xs text-gray-500 line-through">
                                  {product.compareAtPrice.toLocaleString()} ETB
                                </p>
                              )}
                          </div>
                          {product.sold > 0 && (
                            <span className="text-xs text-gray-500">
                              {product.sold} sold
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 mb-12">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                About This Store
              </h3>
              <p
                className="text-gray-700 leading-relaxed mb-6 text-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {seller.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4
                    className="font-semibold mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Store Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-gray-600" />
                      <span className="text-gray-700">{seller.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-gray-600" />
                      <span className="text-gray-700">
                        Member since {seller.joined}
                      </span>
                    </div>
                    {seller.instagram && (
                      <div className="flex items-center gap-2">
                        <Instagram size={18} className="text-gray-600" />
                        <a
                          href={`https://instagram.com/${seller.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 flex items-center gap-1"
                        >
                          {seller.instagram}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4
                    className="font-semibold mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Performance
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Products:</span>
                      <span className="font-semibold">
                        {seller.totalProducts}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Stock:</span>
                      <span className="font-semibold">
                        {seller.totalStock} items
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Rating:</span>
                      <span className="font-semibold">
                        {seller.rating.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
