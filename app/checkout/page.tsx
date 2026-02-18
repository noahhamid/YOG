"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  CreditCard,
  MapPin,
  User,
  Phone,
  ArrowLeft,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryMethod: "delivery",
    address: "",
    notes: "",
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      router.push("/cart");
      return;
    }

    // Load user data
    const userStr = localStorage.getItem("yog_user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, [cart, router]);

  const deliveryFee = formData.deliveryMethod === "delivery" ? 50 : 0;
  const total = getCartTotal() + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Group cart items by seller
      const ordersBySeller = cart.reduce((acc: any, item) => {
        if (!acc[item.sellerId]) {
          acc[item.sellerId] = {
            sellerId: item.sellerId,
            sellerName: item.sellerName,
            items: [],
          };
        }
        acc[item.sellerId].items.push(item);
        return acc;
      }, {});

      // Create orders for each seller
      const orderPromises = Object.values(ordersBySeller).map(
        async (sellerOrder: any) => {
          // For each item, create a separate order
          const itemPromises = sellerOrder.items.map(async (item: any) => {
            const orderData = {
              productId: item.productId,
              customerName: formData.name,
              customerPhone: formData.phone,
              customerEmail: formData.email || null,
              quantity: item.quantity,
              selectedSize: item.size,
              selectedColor: item.color,
              deliveryMethod: formData.deliveryMethod.toUpperCase(),
              deliveryAddress:
                formData.deliveryMethod === "delivery"
                  ? formData.address
                  : null,
              unitPrice: item.price,
              deliveryFee: deliveryFee / cart.length, // Split delivery fee
            };

            const response = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderData),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || "Failed to create order");
            }

            return await response.json();
          });

          return await Promise.all(itemPromises);
        },
      );

      await Promise.all(orderPromises);

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push("/checkout/success");
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null; // Will redirect
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-semibold"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>

          <h1
            className="text-4xl font-bold mb-8"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h2
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <User size={24} />
                    Customer Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+251 9XX XXX XXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h2
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <CreditCard size={24} />
                    Delivery Method
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, deliveryMethod: "delivery" })
                      }
                      className={`p-6 border-2 rounded-xl transition-all ${
                        formData.deliveryMethod === "delivery"
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <MapPin
                        className={`mx-auto mb-3 ${formData.deliveryMethod === "delivery" ? "text-white" : "text-gray-700"}`}
                        size={32}
                      />
                      <p
                        className="font-bold text-lg mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Delivery
                      </p>
                      <p className="text-sm opacity-75">50 ETB</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, deliveryMethod: "meetup" })
                      }
                      className={`p-6 border-2 rounded-xl transition-all ${
                        formData.deliveryMethod === "meetup"
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <ShoppingBag
                        className={`mx-auto mb-3 ${formData.deliveryMethod === "meetup" ? "text-white" : "text-gray-700"}`}
                        size={32}
                      />
                      <p
                        className="font-bold text-lg mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Meet-up
                      </p>
                      <p className="text-sm opacity-75">Free</p>
                    </button>
                  </div>

                  {formData.deliveryMethod === "delivery" && (
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Delivery Address *
                      </label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Enter your full delivery address"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                  )}

                  {formData.deliveryMethod === "meetup" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        The seller will contact you to arrange a meeting
                        location.
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Order Notes (Optional)
                  </h2>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Any special instructions or notes for the seller?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                {/* Payment Info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <CreditCard
                      className="text-green-600 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <p
                        className="font-bold text-green-900 mb-2 text-lg"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Payment on Delivery
                      </p>
                      <p className="text-sm text-green-800">
                        Pay with cash when your order arrives. You can inspect
                        the product before making payment.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-32">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-4 border-b border-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {item.size} • {item.color}
                        </p>
                        <p className="text-sm font-bold mt-1">
                          {item.quantity} × {item.price.toLocaleString()} ETB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {getCartTotal().toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {deliveryFee.toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span
                        className="text-xl font-bold"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Total
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {total.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
