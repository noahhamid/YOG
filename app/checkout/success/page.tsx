"use client";

import Navbar from "@/components/Navbar";
import { Check, Home, Package } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-green-600" />
            </div>

            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Order Placed Successfully! 🎉
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              Thank you for your order! The seller will contact you shortly to
              confirm your order and arrange delivery.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3 text-left">
                <Package
                  className="text-blue-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <p className="font-bold text-blue-900 mb-2">What's Next?</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• The seller will call you to confirm your order</li>
                    <li>• You'll receive updates about your delivery</li>
                    <li>• Pay when your order arrives</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <button
                  className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Home size={20} />
                  Back to Home
                </button>
              </Link>
              <Link href="/shop">
                <button
                  className="border-2 border-black text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
