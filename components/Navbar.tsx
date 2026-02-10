"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, User, LogOut, Store, Settings } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

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
        style={{
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
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
              className={`text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-50 whitespace-nowrap relative group`}
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

        {/* CENTER SECTION: Logo */}
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
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-black opacity-20" />
                </span>
              </div>
            </motion.div>

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
              }}
            />
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
              className={`text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 relative group`}
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

          {/* Account Actions */}
          <div className="flex items-center gap-6">
            {/* If NOT logged in - Show Sign In */}
            {status === "unauthenticated" && (
              <Link
                href="/auth/login"
                className={`text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 relative group`}
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
            )}

            {/* If loading */}
            {status === "loading" && (
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{
                  borderColor: isScrolled ? "white" : "black",
                }}
              />
            )}

            {/* If logged in - Show Profile Menu */}
            {status === "authenticated" && session?.user && (
              <div className="relative profile-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                  className={`flex items-center gap-2 hover:opacity-60 transition-all group`}
                  style={{
                    color: isScrolled ? "white" : "black",
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isScrolled ? "bg-white text-black" : "bg-black text-white"
                    }`}
                  >
                    {session.user.email?.[0].toUpperCase() || "U"}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] hidden lg:block">
                    {session.user.email?.split("@")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <p className="font-bold text-gray-900 text-sm">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {session.user.email}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              session.user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : session.user.role === "SELLER"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {session.user.role}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User size={18} className="text-gray-600" />
                          <span className="text-sm text-gray-700 font-medium">
                            My Profile
                          </span>
                        </Link>

                        {session.user.role === "SELLER" && (
                          <Link
                            href="/seller/dashboard"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Store size={18} className="text-gray-600" />
                            <span className="text-sm text-gray-700 font-medium">
                              Seller Dashboard
                            </span>
                          </Link>
                        )}

                        {session.user.role === "ADMIN" && (
                          <Link
                            href="/admin/sellers"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Settings size={18} className="text-gray-600" />
                            <span className="text-sm text-gray-700 font-medium">
                              Admin Panel
                            </span>
                          </Link>
                        )}

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleSignOut();
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut size={18} className="text-red-600" />
                          <span className="text-sm text-red-600 font-medium">
                            Sign Out
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Shopping Bag */}
            <Link
              href="/cart"
              className={`hover:opacity-60 transition-all hover:scale-110 relative group`}
              style={{
                color: isScrolled ? "white" : "black",
              }}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
            </Link>

            {/* Mobile Menu */}
            <button
              className={`lg:hidden ml-2 hover:opacity-60 transition-all hover:scale-110`}
              style={{
                color: isScrolled ? "white" : "black",
              }}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
