"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Check,
  Star,
  MessageCircle,
  Share2,
  Heart,
  Eye,
  ShoppingBag,
  Users,
  TrendingUp,
  Store,
  Clock,
  Package,
  Award,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

interface SellerStorePageProps {
  storeSlug: string;
}

export default function SellerStorePage({ storeSlug }: SellerStorePageProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "about" | "reviews">(
    "products",
  );

  // Mock seller data
  const seller = {
    name: "Urban Addis",
    slug: "urban-addis",
    logo: "https://ui-avatars.com/api/?name=Urban+Addis&size=200&background=000&color=fff&bold=true",
    coverImage:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
    verified: true,
    location: "Addis Ababa, Ethiopia",
    joined: "January 2023",
    description:
      "Premium streetwear and urban fashion. Curated collection of authentic Ethiopian street style mixed with global trends.",
    rating: 4.8,
    totalReviews: 342,
    followers: 12400,
    monthlyViews: 45600,
    monthlySales: 234,
    totalProducts: 48,
    responseRate: 98,
    responseTime: "within hours",
    badges: ["Verified Seller", "Top Rated", "Fast Shipper"],
  };

  const stats = [
    {
      icon: Eye,
      label: "Monthly Views",
      value: seller.monthlyViews.toLocaleString(),
      color: "blue",
    },
    {
      icon: ShoppingBag,
      label: "Monthly Sales",
      value: seller.monthlySales,
      color: "green",
    },
    {
      icon: Users,
      label: "Followers",
      value: seller.followers.toLocaleString(),
      color: "purple",
    },
    {
      icon: Package,
      label: "Products",
      value: seller.totalProducts,
      color: "orange",
    },
  ];

  const products = [
    {
      id: 1,
      title: "Essential White Tee",
      price: 800,
      image:
        "https://i.pinimg.com/1200x/6c/29/4d/6c294de767f1fc184ae4591d38662b49.jpg",
      sold: 145,
    },
    {
      id: 2,
      title: "Denim Jacket",
      price: 2500,
      image:
        "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
      sold: 89,
    },
    {
      id: 3,
      title: "Utility Cargo",
      price: 1800,
      image:
        "https://i.pinimg.com/736x/d1/7c/8d/d17c8d81022342185ae929271704f535.jpg",
      sold: 67,
    },
    {
      id: 4,
      title: "Oversized Hoodie",
      price: 1500,
      image:
        "https://i.pinimg.com/1200x/2e/da/3d/2eda3de39d654180908f3d87590ceb1b.jpg",
      sold: 203,
    },
    {
      id: 5,
      title: "Slim Joggers",
      price: 1200,
      image:
        "https://i.pinimg.com/1200x/ed/73/47/ed73471bd6bc58afbf67fd11d1de9536.jpg",
      sold: 98,
    },
    {
      id: 6,
      title: "Graphic Tee",
      price: 900,
      image:
        "https://i.pinimg.com/736x/4f/99/be/4f99be2e372c30cf87d9a16d1f5b209a.jpg",
      sold: 176,
    },
  ];

  const reviews = [
    {
      id: 1,
      user: "Abebe K.",
      rating: 5,
      date: "2 days ago",
      comment:
        "Amazing store! Quality products and fast shipping. Will definitely buy again.",
      verified: true,
    },
    {
      id: 2,
      user: "Sara M.",
      rating: 5,
      date: "1 week ago",
      comment:
        "Great customer service. The seller responded quickly to all my questions.",
      verified: true,
    },
    {
      id: 3,
      user: "Daniel T.",
      rating: 4,
      date: "2 weeks ago",
      comment: "Good products, but delivery took a bit longer than expected.",
      verified: true,
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
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">
                          {seller.rating}
                        </span>
                        <span className="text-gray-600 text-sm">
                          ({seller.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {seller.badges.map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Award size={12} />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Heart
                        size={18}
                        className={isFollowing ? "fill-current" : ""}
                      />
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <MessageCircle size={18} />
                      Chat
                    </button>
                    <button className="p-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all">
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

          {/* Performance Highlights */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-green-600" size={24} />
              <h3
                className="text-xl font-bold text-green-900"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Store Performance
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p
                  className="text-sm text-green-700 mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Response Rate
                </p>
                <p
                  className="text-3xl font-bold text-green-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {seller.responseRate}%
                </p>
              </div>
              <div>
                <p
                  className="text-sm text-green-700 mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Response Time
                </p>
                <p
                  className="text-3xl font-bold text-green-900 capitalize"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {seller.responseTime}
                </p>
              </div>
              <div>
                <p
                  className="text-sm text-green-700 mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Customer Satisfaction
                </p>
                <p
                  className="text-3xl font-bold text-green-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {seller.rating}/5.0
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <div className="flex gap-6 overflow-x-auto">
                {["products", "about", "reviews"].map((tab) => (
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
              {products.map((product, index) => (
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
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart size={16} />
                        </button>
                      </div>
                      <h3
                        className="font-semibold mb-1 truncate"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p
                          className="font-bold text-lg"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {product.price.toLocaleString()} ETB
                        </p>
                        <span className="text-xs text-gray-500">
                          {product.sold} sold
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
                      <Store size={18} className="text-gray-600" />
                      <span className="text-gray-700">{seller.name}</span>
                    </div>
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
                  </div>
                </div>
                <div>
                  <h4
                    className="font-semibold mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Contact
                  </h4>
                  <button className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle size={18} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 mb-12">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl font-bold">{seller.rating}</div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-6 h-6 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">
                        Based on {seller.totalReviews} reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p
                          className="font-semibold"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {review.user}
                        </p>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
