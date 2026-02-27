"use client";

import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { Flame } from "lucide-react";

export default function TrendingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 px-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame size={48} className="text-orange-500" />
            <h1
              className="text-black font-light uppercase text-[72px]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "0.08em",
                fontWeight: 300,
              }}
            >
              Trending Now
            </h1>
            <Flame size={48} className="text-orange-500" />
          </div>
          <p
            className="text-gray-600 text-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
            }}
          >
            What everyone's loving right now
          </p>
        </div>
        <ProductGrid initialCategory="trending" showTrendingOnly />
      </div>
    </main>
  );
}
