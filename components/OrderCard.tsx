"use client";

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
  onUpdateStatus: (order: Order) => void;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <img
            src={
              order.product.images[0]?.url || "https://via.placeholder.com/100"
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
          onClick={() => onUpdateStatus(order)}
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
  );
}
