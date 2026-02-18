"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Package,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  const handleCheckout = () => {
    // Navigate to checkout page
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/shop">
              <button
                className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shopping Cart ({cart.length}{" "}
              {cart.length === 1 ? "item" : "items"})
            </h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-semibold text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex gap-6">
                    {/* Product Image - NOW CLICKABLE */}
                    <Link href={`/product/${item.productId}`}>
                      <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <Link href={`/product/${item.productId}`}>
                            <h3
                              className="font-bold text-lg mb-1 hover:underline cursor-pointer"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} • Color: {item.color}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Sold by: {item.sellerName}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span
                            className="text-lg font-semibold w-12 text-center"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p
                            className="text-2xl font-bold"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {(item.price * item.quantity).toLocaleString()} ETB
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.price.toLocaleString()} ETB each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {getCartTotal().toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
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
                        {getCartTotal().toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <Link href="/shop">
                  <button
                    className="w-full border-2 border-black text-black py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Continue Shopping
                  </button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShoppingBag size={18} className="text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Package size={18} className="text-green-600" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <RefreshCw size={18} className="text-green-600" />
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
