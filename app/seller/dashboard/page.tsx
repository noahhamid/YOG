"use client";
import EditProductForm from "@/components/EditProductForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AddProductForm from "@/components/AddProductForm";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  ShoppingBag,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string; // ← ADD THIS
  price: number;
  compareAtPrice: number | null;
  category: string;
  brand: string | null; // ← ADD THIS
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

export default function SellerDashboard() {
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sellerStatus, setSellerStatus] = useState<any>(null);

  // Check authentication and seller status
  useEffect(() => {
    checkSellerStatus();
  }, [router]);

  const checkSellerStatus = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login?redirect=/seller/dashboard");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    if (userData.role !== "SELLER" && userData.role !== "ADMIN") {
      alert("Access denied. Sellers only.");
      router.push("/");
      return;
    }

    // Fetch seller status
    try {
      const response = await fetch("/api/seller/status", {
        headers: {
          "x-user-data": userStr,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSellerStatus(data.seller);

        // If approved, fetch products
        if (data.seller.approved) {
          fetchProducts();
        } else {
          setIsLoading(false);
        }
      } else {
        alert("Failed to check seller status");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error checking seller status:", error);
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;

      const response = await fetch("/api/products", {
        headers: {
          "x-user-data": userStr,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
      } else {
        console.error("Failed to fetch products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    fetchProducts();
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;

      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-data": userStr,
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

  const getTotalStock = (variants: any[]) => {
    return variants.reduce((sum, v) => sum + v.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  // If seller is not approved, show pending/rejected screen
  if (sellerStatus && !sellerStatus.approved) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Pending Status */}
            {!sellerStatus.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 text-center border-2 border-yellow-200 shadow-xl"
              >
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock size={48} className="text-yellow-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Application Under Review
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Thank you for applying to sell on YOG! Your application is
                  currently being reviewed by our team. We'll notify you via
                  email once a decision has been made.
                </p>
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-6">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">
                    ⏰ Expected Review Time
                  </p>
                  <p className="text-sm text-yellow-700">
                    Applications are typically reviewed within 2-3 business days
                  </p>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all"
                >
                  Back to Home
                </button>
              </motion.div>
            )}

            {/* Rejected Status */}
            {sellerStatus.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 text-center border-2 border-red-200 shadow-xl"
              >
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={48} className="text-red-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Application Rejected
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Unfortunately, your seller application was not approved at
                  this time.
                </p>

                <div className="bg-red-50 rounded-2xl p-6 border border-red-200 mb-8 text-left">
                  <p className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {sellerStatus.rejectionReason}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-8 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    💡 What You Can Do
                  </p>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Review the rejection reason carefully</li>
                    <li>• Address the concerns mentioned</li>
                    <li>• Contact our support team if you have questions</li>
                    <li>• You may reapply after addressing the issues</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => router.push("/seller/apply")}
                    className="flex-1 bg-black text-white px-6 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all"
                  >
                    Reapply
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </>
    );
  }

  // Approved seller - show dashboard
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <h1
                className="text-5xl font-light text-gray-900"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Seller Dashboard
              </h1>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <CheckCircle size={16} />
                Approved
              </span>
            </div>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Manage your products and orders
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package size={24} className="text-blue-600" />
                </div>
                <div>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Total Products
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {products.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Published
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {products.filter((p) => p.status === "PUBLISHED").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Draft
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {products.filter((p) => p.status === "DRAFT").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={24} className="text-purple-600" />
                </div>
                <div>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Total Stock
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {products.reduce(
                      (sum, p) => sum + getTotalStock(p.variants),
                      0,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl p-2 inline-flex gap-2 border-2 border-gray-100 shadow-sm">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "products"
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "orders"
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Orders
                <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Soon
                </span>
              </button>
            </div>
          </motion.div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Add Product Button */}
              <div className="mb-8">
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-black text-white px-6 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl group"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Plus
                    size={20}
                    className="group-hover:rotate-90 transition-transform"
                  />
                  Add New Product
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square">
                      <img
                        src={
                          product.images.sort(
                            (a, b) => a.position - b.position,
                          )[0]?.url || "https://via.placeholder.com/400"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {product.category}
                      </div>
                      <div
                        className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === "PUBLISHED"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {product.status}
                      </div>
                    </div>

                    <h4
                      className="text-lg font-semibold text-gray-900 mb-3 line-clamp-1"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {product.title}
                    </h4>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <DollarSign size={14} />
                          Price:
                        </span>
                        <span className="font-bold text-gray-900">
                          {product.price} ETB
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Package size={14} />
                          Stock:
                        </span>
                        <span
                          className={`font-semibold ${
                            getTotalStock(product.variants) > 10
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {getTotalStock(product.variants)} units
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Variants:</span>
                        <span className="font-semibold text-gray-900">
                          {product.variants.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-gray-100">
                  <Package size={64} className="text-gray-300 mb-4" />
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    No products yet
                  </h3>
                  <p
                    className="text-gray-600 mb-6"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Start by adding your first product
                  </p>
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="bg-black text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Plus size={20} />
                    Add Product
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl border-2 border-gray-100 shadow-xl p-12"
            >
              <div className="flex flex-col items-center justify-center">
                <ShoppingBag size={64} className="text-gray-300 mb-4" />
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Orders Coming Soon
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Order management functionality will be added soon
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {isAddingProduct && (
        <AddProductForm
          onClose={() => setIsAddingProduct(false)}
          onSubmit={handleAddProduct}
        />
      )}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={() => {
            fetchProducts();
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
}
