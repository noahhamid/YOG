"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import OrderCard from "./OrderCard";
import OrderStatusModal from "./OrderStatusModal";

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

interface OrdersCache {
  all: Order[];
  pending: Order[];
  confirmed: Order[];
  shipped: Order[];
  delivered: Order[];
  timestamp: number;
}

interface OrdersTabProps {
  isActive: boolean;
  ordersCache: OrdersCache;
  onRefreshCache: () => Promise<void>;
}

export default function OrdersTab({
  isActive,
  ordersCache,
  onRefreshCache,
}: OrdersTabProps) {
  const [orderFilter, setOrderFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
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

        // Refresh the cache
        await onRefreshCache();

        setSelectedOrder(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  const filters = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  // Get orders from cache based on filter - INSTANT!
  const getOrdersForFilter = (filter: string): Order[] => {
    switch (filter) {
      case "all":
        return ordersCache.all;
      case "pending":
        return ordersCache.pending;
      case "confirmed":
        return ordersCache.confirmed;
      case "shipped":
        return ordersCache.shipped;
      case "delivered":
        return ordersCache.delivered;
      default:
        return ordersCache.all;
    }
  };

  const displayOrders = getOrdersForFilter(orderFilter);

  // Check if data is loaded
  const isLoaded = ordersCache.timestamp > 0;

  return (
    <>
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setOrderFilter(filter.value)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              orderFilter === filter.value
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {!isLoaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : displayOrders.length > 0 ? (
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={setSelectedOrder}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h3
            className="text-xl font-semibold mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            No {orderFilter !== "all" ? orderFilter : ""} orders yet
          </h3>
          <p className="text-gray-600">
            {orderFilter === "all"
              ? "Orders will appear here when customers place them"
              : `No ${orderFilter} orders at the moment`}
          </p>
        </div>
      )}

      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateOrderStatus}
        />
      )}
    </>
  );
}
