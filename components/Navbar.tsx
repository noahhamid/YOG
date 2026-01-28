"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Menu } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          relative flex items-center justify-between w-full max-w-[1800px] px-12 py-3 
          transition-all duration-300 rounded-full pointer-events-auto
        `}
      >
        {/* LEFT SECTION: Pushed to the far left */}
        <div className="flex items-center gap-8 flex-1 py-3">
          {["Shop", "Men", "Women", "Trending"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-50 transition-all hover:tracking-[0.2em] whitespace-nowrap relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CENTER SECTION: The Enhanced Logo Trapezoid */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[-24px] z-20">
          <Link href="/" className="relative flex flex-col items-center group">
            <motion.div
              className={`
                bg-gradient-to-b from-white to-gray-50 flex items-center justify-center transition-all duration-500 shadow-xl hover:shadow-2xl
                ${isScrolled ? "px-36 py-1" : "px-64 py-1"}
              `}
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)",
              }}
            >
              {/* Subtle border effect */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)",
                  background:
                    "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 100%)",
                }}
              />

              <div className="flex flex-col items-center relative">
                <span
                  className="text-3xl font-black tracking-[0.3em] py-[15px] leading-none text-black relative"
                  style={{
                    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                    textShadow: "2px 2px 0px rgba(0,0,0,0.05)",
                    letterSpacing: "0.25em",
                  }}
                >
                  YOG
                  {/* Subtle accent line underneath */}
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-black opacity-20" />
                </span>
              </div>
            </motion.div>

            {/* Hover glow effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
              }}
            />
          </Link>
        </div>

        {/* RIGHT SECTION: Pushed to the far right */}
        <div className="flex items-center justify-end gap-8 flex-1">
          {/* Main Category Links */}
          <div className="hidden xl:flex items-center gap-8 border-r border-black/10 pr-8">
            {["Seasonal", "Accessories"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-50 transition-all hover:tracking-[0.2em] whitespace-nowrap relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Account Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/signin"
              className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 transition-all hover:tracking-[0.2em] relative group"
            >
              Sign In
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/cart"
              className="hover:opacity-60 transition-all hover:scale-110 relative group"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {/* Optional: Add a small notification dot */}
              {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full" /> */}
            </Link>
            <button className="lg:hidden ml-2 hover:opacity-60 transition-all hover:scale-110">
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
