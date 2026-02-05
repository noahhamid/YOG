"use client";

import { useState } from "react";
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
} from "lucide-react";

// Mock data
const initialProducts = [
  {
    id: 1,
    name: "Classic White Tee",
    price: "800",
    stock: 25,
    category: "Casual Wear",
    image:
      "https://i.pinimg.com/1200x/6c/29/4d/6c294de767f1fc184ae4591d38662b49.jpg",
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: "2,500",
    stock: 12,
    category: "Streetwear",
    image:
      "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
  },
];

const initialOrders = [
  {
    id: "ORD-001",
    customer: "Abebe Kebede",
    product: "Classic White Tee",
    quantity: 2,
    total: "1,600",
    status: "pending",
    date: "2024-02-04",
  },
  {
    id: "ORD-002",
    customer: "Tigist Alemu",
    product: "Denim Jacket",
    quantity: 1,
    total: "2,500",
    status: "pending",
    date: "2024-02-03",
  },
  {
    id: "ORD-003",
    customer: "Yohannes Desta",
    product: "Classic White Tee",
    quantity: 1,
    total: "800",
    status: "completed",
    date: "2024-02-02",
  },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleAddProduct = (data: any) => {
    const newProduct = {
      id: products.length + 1,
      name: data.name,
      price: data.price,
      stock: 50, // Default stock or you can add stock field to the form
      category: data.category,
      image:
        "https://i.pinimg.com/736x/ab/bb/f3/abbbf3e25662109c77967649cff0f65e.jpg",
    };

    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order,
      ),
    );
  };

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalProducts = products.length;

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
            <h1
              className="text-5xl font-light text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Seller Dashboard
            </h1>
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
                    {totalProducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-orange-600" />
                </div>
                <div>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Pending Orders
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {pendingOrders}
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
                    Completed
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {orders.filter((o) => o.status === "completed").length}
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
                    Total Orders
                  </p>
                  <p
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {orders.length}
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
                {pendingOrders > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingOrders}
                  </span>
                )}
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
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {product.category}
                      </div>
                    </div>

                    <h4
                      className="text-lg font-semibold text-gray-900 mb-3"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {product.name}
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
                            product.stock > 10
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert("Edit functionality coming soon!")}
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
              className="bg-white rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-100">
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Order ID
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Customer
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Product
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Quantity
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Total
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Date
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Status
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td
                          className="px-6 py-4 text-sm font-medium text-gray-900"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {order.id}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-700"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {order.customer}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-700"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {order.product}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-700"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {order.quantity}
                        </td>
                        <td
                          className="px-6 py-4 text-sm font-semibold text-gray-900"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {order.total} ETB
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-700"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {order.date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {order.status === "completed" ? (
                              <CheckCircle size={14} />
                            ) : (
                              <Clock size={14} />
                            )}
                            {order.status === "completed"
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleCompleteOrder(order.id)}
                              className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Mark Complete
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State for Orders */}
              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    No orders yet
                  </h3>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Orders will appear here once customers start purchasing
                  </p>
                </div>
              )}
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
    </>
  );
}
