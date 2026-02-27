"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Menu,
  User,
  LogOut,
  Store,
  Settings,
  RefreshCw,
  Bell,
} from "lucide-react";
import Link from "next/link";
import NotificationCenter from "./notifications/NotificationCenter";
import NotificationToast from "./notifications/NotificationToast";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: "USER" | "SELLER" | "ADMIN";
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastNotification, setToastNotification] = useState<any>(null);
  const [shownNotificationIds, setShownNotificationIds] = useState<Set<string>>(
    new Set(),
  ); // ✅ TRACK SHOWN TOASTS
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadUser();
    window.addEventListener("userLoggedIn", loadUser);
    return () => window.removeEventListener("userLoggedIn", loadUser);
  }, []);

  const loadUser = () => {
    const storedUser = localStorage.getItem("yog_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  // ✅ LOAD SHOWN NOTIFICATIONS ONCE ON MOUNT
  useEffect(() => {
    if (!user) return;

    try {
      const stored = localStorage.getItem("yog_shown_notifications");
      if (stored) {
        const parsed = JSON.parse(stored);
        setShownNotificationIds(new Set(parsed));
      }
    } catch (error) {
      console.error("Error loading shown notifications:", error);
    }
  }, [user]); // ✅ ONLY RUN WHEN USER CHANGES

  // ✅ POLL FOR NOTIFICATIONS (SEPARATE EFFECT)
  useEffect(() => {
    if (!user) return;

    const checkNotifications = async () => {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;

      try {
        const res = await fetch("/api/notifications", {
          headers: {
            "x-user-data": userStr,
          },
        });

        const data = await res.json();

        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);

          // ✅ SHOW TOAST ONLY FOR NEW UNREAD NOTIFICATIONS THAT HAVEN'T BEEN SHOWN
          if (data.notifications && data.notifications.length > 0) {
            const newestUnread = data.notifications.find(
              (n: any) => !n.read && !shownNotificationIds.has(n.id),
            );

            if (newestUnread) {
              setToastNotification(newestUnread);

              // ✅ MARK AS SHOWN (but not as read)
              const newSet = new Set(shownNotificationIds);
              newSet.add(newestUnread.id);
              setShownNotificationIds(newSet);

              // ✅ PERSIST TO LOCALSTORAGE
              localStorage.setItem(
                "yog_shown_notifications",
                JSON.stringify(Array.from(newSet)),
              );
            }
          }
        }
      } catch (error) {
        console.error("Error checking notifications:", error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 10000);

    return () => clearInterval(interval);
  }, [user]); // ✅ REMOVED shownNotificationIds FROM DEPENDENCIES

  const handleRefreshSession = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        localStorage.setItem("yog_user", JSON.stringify(data.user));
        setUser(data.user);
        alert("Session refreshed! Your role is now: " + data.user.role);
        window.location.reload();
      } else {
        alert("Failed to refresh session");
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      alert("Failed to refresh session");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("yog_user");
    setUser(null);
    setShowProfileMenu(false);
    window.location.href = "/";
  };

  return (
    <>
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
            {user && (
              <>
                <Link
                  href="/following"
                  className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 relative group"
                  style={{
                    color: isScrolled ? "white" : "black",
                    transition: "all 0.3s ease-out",
                  }}
                >
                  Following
                  <span
                    className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                    style={{
                      backgroundColor: isScrolled ? "white" : "black",
                    }}
                  />
                </Link>

                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative hover:opacity-60 transition-all"
                  style={{
                    color: isScrolled ? "white" : "black",
                  }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}

            <div className="hidden xl:flex items-center gap-8 border-r border-black/10 pr-8">
              <Link
                href={
                  user?.role === "SELLER" || user?.role === "ADMIN"
                    ? "/seller/dashboard"
                    : "/seller/apply"
                }
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

            <div className="flex items-center gap-6">
              {!user && (
                <>
                  <Link
                    href="/login"
                    className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 relative group"
                    style={{
                      color: isScrolled ? "white" : "black",
                      transition: "all 0.3s ease-out",
                    }}
                  >
                    Log In
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                      style={{
                        backgroundColor: isScrolled ? "white" : "black",
                      }}
                    />
                  </Link>
                  <Link
                    href="/signup"
                    className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap hover:opacity-60 relative group"
                    style={{
                      color: isScrolled ? "white" : "black",
                      transition: "all 0.3s ease-out",
                    }}
                  >
                    Sign Up
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                      style={{
                        backgroundColor: isScrolled ? "white" : "black",
                      }}
                    />
                  </Link>
                </>
              )}

              {user && (
                <div className="relative profile-menu">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileMenu(!showProfileMenu);
                    }}
                    className="flex items-center gap-2 hover:opacity-60 transition-all group"
                    style={{
                      color: isScrolled ? "white" : "black",
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isScrolled
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      }`}
                    >
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] hidden lg:block">
                      {user.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                      >
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <p className="font-bold text-gray-900 text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-700"
                                  : user.role === "SELLER"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </div>

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

                          {user.role === "SELLER" && (
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

                          {user.role === "ADMIN" && (
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

                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              handleRefreshSession();
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors w-full text-left"
                          >
                            <RefreshCw size={18} className="text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">
                              Refresh Session
                            </span>
                          </button>

                          <div className="border-t border-gray-200 my-2"></div>

                          <button
                            onClick={handleSignOut}
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

              <Link
                href="/cart"
                className="hover:opacity-60 transition-all hover:scale-110 relative"
                style={{
                  color: isScrolled ? "white" : "black",
                }}
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <button
                className="lg:hidden ml-2 hover:opacity-60 transition-all"
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

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {toastNotification && (
        <NotificationToast
          notification={toastNotification}
          onClose={() => setToastNotification(null)}
        />
      )}
    </>
  );
};

export default Navbar;
