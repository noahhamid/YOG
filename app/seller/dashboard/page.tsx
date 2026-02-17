"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";
import {
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Phone,
  MapPin,
  User,
  Store,
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

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  finalTotal: number;
  deliveryMethod: string;
  deliveryAddress: string | null;
  status: string;
  createdAt: string;
  product: {
    title: string;
    images: Array<{ url: string }>;
  };
}

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sellerStatus, setSellerStatus] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [orderFilter, setOrderFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, orderFilter]);

  const checkAuth = async () => {
    const userStr = localStorage.getItem("yog_user");

    if (!userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Only sellers and admins can access
    if (userData.role !== "SELLER" && userData.role !== "ADMIN") {
      router.push("/seller/apply");
      return;
    }

    // Admin bypass - admins can always access
    if (userData.role === "ADMIN") {
      setIsLoading(false);
      await fetchProducts(userStr);
      return;
    }

    // Check seller status for regular sellers
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

      console.log("Seller Status:", data); // Debug log
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

  const fetchOrders = async () => {
    try {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;

      const params = new URLSearchParams();
      if (orderFilter !== "all") {
        params.append("status", orderFilter);
      }

      const response = await fetch(`/api/seller/orders?${params.toString()}`, {
        headers: {
          "x-user-data": userStr,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        setOrderStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const userStr = localStorage.getItem("yog_user");
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Order status updated!");
        fetchOrders();
        setSelectedOrder(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} />;
      case "CONFIRMED":
      case "DELIVERED":
        return <CheckCircle size={16} />;
      case "PROCESSING":
        return <Package size={16} />;
      case "SHIPPED":
        return <Truck size={16} />;
      case "CANCELLED":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pending seller - check seller.approved field
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

  // Rejected seller - check seller.rejectionReason field
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

  // Main dashboard - if approved, show dashboard
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
          {/* Header */}
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

          {/* Stats */}
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

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`pb-4 font-semibold transition-colors relative ${activeTab === "products" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Products ({products.length})
                  {activeTab === "products" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-4 font-semibold transition-colors relative ${activeTab === "orders" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
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

          {/* Products Tab */}
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
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
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

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <>
              <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
                {[
                  { value: "all", label: "All Orders" },
                  { value: "pending", label: "Pending" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setOrderFilter(filter.value)}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${orderFilter === filter.value ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4">
                          <img
                            src={
                              order.product.images[0]?.url ||
                              "https://via.placeholder.com/100"
                            }
                            alt={order.product.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div>
                            <h3
                              className="font-bold text-lg mb-1"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {order.product.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Order #{order.orderNumber}
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total</p>
                          <p
                            className="text-2xl font-bold"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {order.finalTotal.toLocaleString()} ETB
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                            <User size={12} />
                            Customer
                          </p>
                          <p className="font-semibold text-sm">
                            {order.customerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                            <Phone size={12} />
                            Phone
                          </p>
                          <p className="font-semibold text-sm">
                            {order.customerPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Size / Color
                          </p>
                          <p className="font-semibold text-sm">
                            {order.selectedSize} / {order.selectedColor}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Quantity</p>
                          <p className="font-semibold text-sm">
                            {order.quantity}x
                          </p>
                        </div>
                      </div>

                      {order.deliveryMethod === "DELIVERY" &&
                        order.deliveryAddress && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              <MapPin size={12} />
                              Delivery Address
                            </p>
                            <p className="text-sm">{order.deliveryAddress}</p>
                          </div>
                        )}

                      {order.deliveryMethod === "MEETUP" && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <Store size={16} />
                            Meet-up - Contact customer to arrange location
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Update Status
                        </button>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Phone size={16} />
                          Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <ShoppingBag
                    size={64}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    No orders yet
                  </h3>
                  <p className="text-gray-600">
                    Orders will appear here when customers place them
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Update Order Status
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Order #{selectedOrder.orderNumber}
            </p>
            <div className="space-y-3">
              {[
                { value: "PENDING", label: "Pending", icon: Clock },
                { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
                { value: "PROCESSING", label: "Processing", icon: Package },
                { value: "SHIPPED", label: "Shipped", icon: Truck },
                { value: "DELIVERED", label: "Delivered", icon: CheckCircle },
                { value: "CANCELLED", label: "Cancelled", icon: XCircle },
              ].map((status) => {
                const Icon = status.icon;
                return (
                  <button
                    key={status.value}
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, status.value)
                    }
                    className={`w-full p-4 rounded-lg border-2 font-semibold transition-all flex items-center gap-3 ${selectedOrder.status === status.value ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Icon size={20} />
                    {status.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
