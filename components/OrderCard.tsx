"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Phone,
  MapPin,
  User,
  Store,
  Package,
  Loader2,
  X,
} from "lucide-react";

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

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (order: Order, newStatus: string) => Promise<void>;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const statuses = [
    { value: "PENDING", label: "Pending", color: "yellow" },
    { value: "CONFIRMED", label: "Confirmed", color: "blue" },
    { value: "PROCESSING", label: "Processing", color: "purple" },
    { value: "SHIPPED", label: "Shipped", color: "indigo" },
    { value: "DELIVERED", label: "Delivered", color: "green" },
    { value: "CANCELLED", label: "Cancelled", color: "red" },
  ];

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

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.status) {
      setShowStatusModal(false);
      return;
    }

    setIsUpdating(true);

    try {
      await onUpdateStatus(order, selectedStatus);
      setShowStatusModal(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
            <p className="font-semibold text-sm">{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <Phone size={12} />
              Phone
            </p>
            <p className="font-semibold text-sm">{order.customerPhone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Size / Color</p>
            <p className="font-semibold text-sm">
              {order.selectedSize} / {order.selectedColor}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Quantity</p>
            <p className="font-semibold text-sm">{order.quantity}x</p>
          </div>
        </div>

        {order.deliveryMethod === "DELIVERY" && order.deliveryAddress && (
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
            onClick={() => setShowStatusModal(true)}
            disabled={isUpdating}
            className="flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
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

      {/* ✅ STATUS UPDATE MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Update Order Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Order #{order.orderNumber}
            </p>

            <div className="space-y-2 mb-6">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  disabled={isUpdating}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                    selectedStatus === status.value
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status.value)}
                    <span className="font-semibold">{status.label}</span>
                  </div>
                  {selectedStatus === status.value && (
                    <CheckCircle size={20} className="text-black" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating || selectedStatus === order.status}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
