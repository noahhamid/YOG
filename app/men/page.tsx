"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";

export default function MenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 px-10">
        <div className="text-center mb-12">
          <h1
            className="text-black font-light uppercase text-[72px] mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.08em",
              fontWeight: 300,
            }}
          >
            Men's Collection
          </h1>
          <p
            className="text-gray-600 text-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
            }}
          >
            Curated styles for the modern man
          </p>
        </div>
        <ProductGrid initialCategory="men" />
      </div>
    </main>
  );
}
