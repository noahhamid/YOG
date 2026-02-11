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
    <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{
        paddingTop: isScrolled ? "0px" : "24px",
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`
          relative flex items-center justify-between w-full max-w-[1800px] px-12 py-3 
          pointer-events-auto
          ${isScrolled ? "bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-none" : "bg-transparent rounded-full"}
        `}
      >
        {/* LEFT SECTION */}
        <div
          className="flex items-center gap-8 flex-1 py-3"
          style={{
            paddingLeft: isScrolled ? "120px" : "0px",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {["Shop", "Men", "Women", "Trending"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-50 whitespace-nowrap relative group"
              style={{
                color: isScrolled ? "white" : "black",
                transition: "all 0.3s ease-out",
              }}
            >
              {item}
              <span
                className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                style={{
                  backgroundColor: isScrolled ? "white" : "black",
                }}
              />
            </Link>
          ))}
        </div>

        {/* CENTER: Logo */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{
            top: isScrolled ? "0px" : "-24px",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Link href="/" className="relative flex items-center group">
            <motion.div
              className="bg-gradient-to-b from-white to-gray-50 flex items-center justify-center shadow-xl hover:shadow-2xl"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)",
                paddingLeft: isScrolled ? "144px" : "256px",
                paddingRight: isScrolled ? "144px" : "256px",
                paddingTop: isScrolled ? "0px" : "4px",
                paddingBottom: isScrolled ? "0px" : "4px",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <span
                className="text-3xl font-black tracking-[0.3em] py-[15px] leading-none text-black relative"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: "0.25em",
                }}
              >
                YOG
              </span>
            </motion.div>
          </Link>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="flex items-center justify-end gap-8 flex-1"
          style={{
            paddingRight: isScrolled ? "120px" : "0px",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Sell Link */}
          <div className="hidden xl:flex items-center gap-8 border-r border-black/10 pr-8">
            <Link
              href="/seller/apply"
              className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 relative group"
              style={{
                color: isScrolled ? "white" : "black",
                transition: "all 0.3s ease-out",
              }}
            >
              sell
              <span
                className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                style={{
                  backgroundColor: isScrolled ? "white" : "black",
                }}
              />
            </Link>
          </div>

          {/* Sign In */}
          <Link
            href="/login"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 relative group"
            style={{
              color: isScrolled ? "white" : "black",
              transition: "all 0.3s ease-out",
            }}
          >
            Sign In
            <span
              className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
              style={{
                backgroundColor: isScrolled ? "white" : "black",
              }}
            />
          </Link>

          {/* Shopping Bag */}
          <Link
            href="/cart"
            className="hover:opacity-60 transition-all hover:scale-110"
            style={{
              color: isScrolled ? "white" : "black",
            }}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
          </Link>

          {/* Mobile Menu */}
          <button
            className="lg:hidden ml-2 hover:opacity-60 transition-all"
            style={{
              color: isScrolled ? "white" : "black",
            }}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
