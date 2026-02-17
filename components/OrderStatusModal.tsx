"use client";

import { Clock, CheckCircle, Truck, XCircle, Package } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
}

interface OrderStatusModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: (orderId: string, newStatus: string) => void;
}

export default function OrderStatusModal({
  order,
  onClose,
  onUpdate,
}: OrderStatusModalProps) {
  const statuses = [
    { value: "PENDING", label: "Pending", icon: Clock },
    { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
    { value: "PROCESSING", label: "Processing", icon: Package },
    { value: "SHIPPED", label: "Shipped", icon: Truck },
    { value: "DELIVERED", label: "Delivered", icon: CheckCircle },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Update Order Status
        </h2>
        <p className="text-sm text-gray-600 mb-6">Order #{order.orderNumber}</p>
        <div className="space-y-3">
          {statuses.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => onUpdate(order.id, status.value)}
                className={`w-full p-4 rounded-lg border-2 font-semibold transition-all flex items-center gap-3 ${
                  order.status === status.value
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Icon size={20} />
                {status.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
