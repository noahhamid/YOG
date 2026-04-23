"use client";

import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";

export default function WomenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* Reduced padding on mobile (px-4) vs desktop (px-10) */}
      <div className="pt-24 md:pt-32 px-4 md:px-10">
        <div className="text-center mb-8 md:mb-12">
          <h1
            /* Fluid font sizing from 3xl on mobile to 72px on large screens */
            className="text-black font-light uppercase text-3xl sm:text-4xl md:text-6xl lg:text-[72px] mb-3 leading-tight"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.08em",
              fontWeight: 300,
            }}
          >
            Women's Collection
          </h1>
          <p
            className="text-gray-600 text-base md:text-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
            }}
          >
            Curated styles for the modern woman
          </p>
        </div>
        <ProductGrid initialCategory="women" />
      </div>
    </main>
  );
}
