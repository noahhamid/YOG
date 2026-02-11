"use client";

import { useState } from "react";
import { Mail, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login with: ${email} - Backend not connected yet!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <ShoppingBag className="text-black" size={28} />
          </div>
          <span className="text-4xl font-bold text-white">YOG</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome to YOG
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Enter your email to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all"
            >
              Continue
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Want to sell on YOG?{" "}
            <Link
              href="/seller/apply"
              className="text-black font-semibold hover:underline"
            >
              Apply as a Seller
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
