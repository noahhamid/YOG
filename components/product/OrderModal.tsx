"use client";

import { useState } from "react";
import { X, MapPin, Phone, User, Package, Truck, Home } from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    sellerId: string;
    sellerName: string;
  };
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export default function OrderModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity,
}: OrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryMethod: "DELIVERY" as "DELIVERY" | "MEETUP",
    deliveryAddress: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = formData.deliveryMethod === "DELIVERY" ? 50 : 0;
  const subtotal = product.price * quantity;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.deliveryMethod === "DELIVERY" && !formData.deliveryAddress) {
      alert("Please provide a delivery address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          sellerId: product.sellerId,
          quantity,
          selectedSize,
          selectedColor,
          unitPrice: product.price,
          totalPrice: subtotal,
          deliveryFee,
          finalTotal: total,
          deliveryMethod: formData.deliveryMethod,
          deliveryAddress: formData.deliveryAddress,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Order placed successfully! Order #${data.orderNumber}`);
        onClose();
        // Reset form
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          deliveryMethod: "DELIVERY",
          deliveryAddress: "",
          notes: "",
        });
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Complete Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Product Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex gap-4">
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{product.title}</h3>
              <p className="text-sm text-gray-600">
                Size: {selectedSize} • Color: {selectedColor}
              </p>
              <p className="text-sm text-gray-600">Quantity: {quantity}</p>
              <p className="font-bold text-lg mt-1">
                {product.price.toLocaleString()} ETB
              </p>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <User size={16} />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Phone size={16} />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="+251 912 345 678"
                required
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Package size={16} />
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="john@example.com"
              />
            </div>

            {/* Delivery Method */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Delivery Method *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, deliveryMethod: "DELIVERY" })
                  }
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                    formData.deliveryMethod === "DELIVERY"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Truck size={20} />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Delivery</p>
                    <p className="text-xs opacity-80">50 ETB fee</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, deliveryMethod: "MEETUP" })
                  }
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                    formData.deliveryMethod === "MEETUP"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Home size={20} />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Meetup</p>
                    <p className="text-xs opacity-80">Free</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            {formData.deliveryMethod === "DELIVERY" && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <MapPin size={16} />
                  Delivery Address *
                </label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Street address, city, zip code..."
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Any special instructions..."
                rows={2}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {subtotal.toLocaleString()} ETB
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">
                  {deliveryFee.toLocaleString()} ETB
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl">
                  {total.toLocaleString()} ETB
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <Package size={20} />
                  Place Order
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
