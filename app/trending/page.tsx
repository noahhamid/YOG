"use client";

import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { Flame } from "lucide-react";

export default function TrendingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* Adjusted padding: px-4 for mobile, px-10 for desktop */}
      <div className="pt-24 md:pt-32 px-4 md:px-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
            {/* Responsive icon size */}
            <Flame className="text-orange-500 w-8 h-8 md:w-12 md:h-12" />
            <h1
              /* Adjusted text size: text-4xl (~36px) for mobile, text-[72px] for desktop */
              className="text-black font-light uppercase text-3xl sm:text-4xl md:text-6xl lg:text-[72px] leading-tight"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "0.08em",
                fontWeight: 300,
              }}
            >
              Trending Now
            </h1>
            <Flame className="text-orange-500 w-8 h-8 md:w-12 md:h-12" />
          </div>
          <p
            className="text-gray-600 text-base md:text-lg"
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
