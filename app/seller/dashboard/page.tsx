"use client";
import Link from "next/link";
import { Settings } from "lucide-react"; // Add this link somewhere in your dashboard

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";
import OrdersTab from "@/components/OrdersTab";
import {
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  ShoppingBag,
  Clock,
  XCircle,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  brand: string | null;
  status: string;
  createdAt: string;
  variants: Array<{
    id: string;
    size: string;
    color: string;
    quantity: number;
  }>;
  images: Array<{
    id: string;
    url: string;
    position: number;
  }>;
}

interface OrdersCache {
  all: any[];
  pending: any[];
  confirmed: any[];
  shipped: any[];
  delivered: any[];
  timestamp: number;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sellerStatus, setSellerStatus] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersCache, setOrdersCache] = useState<OrdersCache>({
    all: [],
    pending: [],
    confirmed: [],
    shipped: [],
    delivered: [],
    timestamp: 0,
  });
  const [orderStats, setOrderStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  useEffect(() => {
    checkAuth();
  }, []);

  // Preload ALL orders with different filters in background
  useEffect(() => {
    const preloadAllOrders = async () => {
      try {
        const userStr = localStorage.getItem("yog_user");
        if (!userStr) return;

        console.log("🔄 Preloading all order filters...");
        const startTime = performance.now();

        // Fetch all filters in parallel
        const [
          allOrders,
          pendingOrders,
          confirmedOrders,
          shippedOrders,
          deliveredOrders,
        ] = await Promise.all([
          fetch("/api/seller/orders", {
            headers: { "x-user-data": userStr },
          }).then((res) => res.json()),

          fetch("/api/seller/orders?status=pending", {
            headers: { "x-user-data": userStr },
          }).then((res) => res.json()),

          fetch("/api/seller/orders?status=confirmed", {
            headers: { "x-user-data": userStr },
          }).then((res) => res.json()),

          fetch("/api/seller/orders?status=shipped", {
            headers: { "x-user-data": userStr },
          }).then((res) => res.json()),

          fetch("/api/seller/orders?status=delivered", {
            headers: { "x-user-data": userStr },
          }).then((res) => res.json()),
        ]);

        const endTime = performance.now();
        console.log(
          `✅ All orders preloaded in ${(endTime - startTime).toFixed(0)}ms`,
        );

        // Cache all the data
        setOrdersCache({
          all: allOrders.orders || [],
          pending: pendingOrders.orders || [],
          confirmed: confirmedOrders.orders || [],
          shipped: shippedOrders.orders || [],
          delivered: deliveredOrders.orders || [],
          timestamp: Date.now(),
        });

        setOrderStats(allOrders.stats);

        console.log("📊 Cached orders:", {
          all: allOrders.orders?.length || 0,
          pending: pendingOrders.orders?.length || 0,
          confirmed: confirmedOrders.orders?.length || 0,
          shipped: shippedOrders.orders?.length || 0,
          delivered: deliveredOrders.orders?.length || 0,
        });
      } catch (error) {
        console.error("Error preloading orders:", error);
      }
    };

    // Only preload if user is logged in and not loading
    if (!isLoading && user) {
      preloadAllOrders();
    }
  }, [isLoading, user]);

  const checkAuth = async () => {
    const userStr = localStorage.getItem("yog_user");

    if (!userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    if (userData.role !== "SELLER" && userData.role !== "ADMIN") {
      router.push("/seller/apply");
      return;
    }

    if (userData.role === "ADMIN") {
      setIsLoading(false);
      await fetchProducts(userStr);
      return;
    }

    await checkSellerStatus(userStr);
    await fetchProducts(userStr);
  };

  const checkSellerStatus = async (userStr: string) => {
    try {
      const response = await fetch("/api/seller/status", {
        headers: {
          "x-user-data": userStr,
        },
      });

      const data = await response.json();
      setSellerStatus(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking seller status:", error);
      setIsLoading(false);
    }
  };

  const fetchProducts = async (userStr?: string) => {
    try {
      const response = await fetch("/api/products", {
        headers: {
          "x-user-data": userStr || localStorage.getItem("yog_user") || "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const userStr = localStorage.getItem("yog_user");
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "x-user-data": userStr || "",
        },
      });

      if (response.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // Refresh orders cache (call this after updating an order)
  const refreshOrdersCache = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;

    try {
      const [
        allOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
      ] = await Promise.all([
        fetch("/api/seller/orders", {
          headers: { "x-user-data": userStr },
        }).then((res) => res.json()),

        fetch("/api/seller/orders?status=pending", {
          headers: { "x-user-data": userStr },
        }).then((res) => res.json()),

        fetch("/api/seller/orders?status=confirmed", {
          headers: { "x-user-data": userStr },
        }).then((res) => res.json()),

        fetch("/api/seller/orders?status=shipped", {
          headers: { "x-user-data": userStr },
        }).then((res) => res.json()),

        fetch("/api/seller/orders?status=delivered", {
          headers: { "x-user-data": userStr },
        }).then((res) => res.json()),
      ]);

      setOrdersCache({
        all: allOrders.orders || [],
        pending: pendingOrders.orders || [],
        confirmed: confirmedOrders.orders || [],
        shipped: shippedOrders.orders || [],
        delivered: deliveredOrders.orders || [],
        timestamp: Date.now(),
      });

      setOrderStats(allOrders.stats);
    } catch (error) {
      console.error("Error refreshing orders cache:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (
    sellerStatus?.seller &&
    !sellerStatus.seller.approved &&
    !sellerStatus.seller.rejectionReason
  ) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-yellow-600" />
            </div>
            <h1
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Application Under Review
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for applying! Our team is reviewing your application.
              This typically takes 2-3 business days.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                We'll notify you via email once your application has been
                reviewed.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (sellerStatus?.seller?.rejectionReason) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h1
              className="text-3xl font-bold mb-4 text-center"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Application Not Approved
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 font-semibold mb-2">Reason:</p>
              <p className="text-sm text-red-700">
                {sellerStatus.seller.rejectionReason}
              </p>
            </div>
            <button
              onClick={() => router.push("/seller/apply")}
              className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Reapply Now
            </button>
          </div>
        </div>
      </>
    );
  }

  const totalStock = products.reduce(
    (sum, product) =>
      sum + product.variants.reduce((vSum, v) => vSum + v.quantity, 0),
    0,
  );
  const publishedCount = products.filter(
    (p) => p.status === "PUBLISHED",
  ).length;

  const stats = [
    {
      icon: Package,
      label: "Total Products",
      value: products.length,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: orderStats?.total || 0,
      color: "from-green-500 to-green-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `${(orderStats?.revenue || 0).toLocaleString()} ETB`,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Pending Orders",
      value: orderStats?.pending || 0,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Seller Dashboard
            </h1>
            <p
              className="text-gray-600"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Welcome back, {user?.name}!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
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
                        className="text-2xl font-bold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`pb-4 font-semibold transition-colors relative ${
                    activeTab === "products"
                      ? "text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Products ({products.length})
                  {activeTab === "products" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-4 font-semibold transition-colors relative ${
                    activeTab === "orders"
                      ? "text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Orders ({orderStats?.total || 0})
                  {activeTab === "orders" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {activeTab === "products" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-sm text-gray-600">
                    Published: {publishedCount}
                  </span>
                  <span className="text-sm text-gray-600">
                    Total Stock: {totalStock}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Plus size={20} />
                  Add Product
                </button>

                <Link
                  href="/seller/settings"
                  className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-black transition-all"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Settings size={20} />
                  <span className="font-semibold">Store Settings</span>
                </Link>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={
                            product.images[0]?.url ||
                            "https://via.placeholder.com/400"
                          }
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3
                          className="font-bold text-lg mb-2 line-clamp-1"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p
                              className="font-bold text-xl"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {product.price.toLocaleString()} ETB
                            </p>
                            {product.compareAtPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                {product.compareAtPrice.toLocaleString()} ETB
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Stock</p>
                            <p className="font-semibold">
                              {product.variants.reduce(
                                (sum, v) => sum + v.quantity,
                                0,
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    No products yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by adding your first product
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Plus size={20} />
                    Add Your First Product
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "orders" && (
            <OrdersTab
              isActive={activeTab === "orders"}
              ordersCache={ordersCache}
              onRefreshCache={refreshOrdersCache}
            />
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddProductForm
              onClose={() => setShowAddModal(false)}
              onSubmit={() => {
                setShowAddModal(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EditProductForm
              product={editingProduct}
              onClose={() => setEditingProduct(null)}
              onSubmit={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
