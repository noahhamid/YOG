"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import NotificationCenter from "./notifications/NotificationCenter";
import NotificationToast from "./notifications/NotificationToast";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: "USER" | "SELLER" | "ADMIN";
  image?: string;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const BagIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const BellIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const StoreIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const SettingsIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const LogOutIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Animated hamburger/X icon ──────────────────────────────────────────────
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] cursor-pointer bg-transparent border-none p-0"
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <motion.span
        className="block w-5 h-[2px] bg-[#1a1714] rounded-full origin-center"
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.span
        className="block w-5 h-[2px] bg-[#1a1714] rounded-full"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      />
      <motion.span
        className="block w-5 h-[2px] bg-[#1a1714] rounded-full origin-center"
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      />
    </button>
  );
}

const LEFT_LINKS = ["Shop", "Men", "Women", "Trending"];

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="relative text-[10.5px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-40 whitespace-nowrap group"
    style={{ color: "#1a1714" }}
  >
    {label}
    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1a1714] transition-all duration-200 group-hover:w-full" />
  </Link>
);

const MOBILE_LINKS = ["Shop", "Men", "Women", "Trending", "Stores"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastNotification, setToastNotification] = useState<any>(null);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    loadUser();
    window.addEventListener("userLoggedIn", loadUser);
    return () => window.removeEventListener("userLoggedIn", loadUser);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setShowMobileMenu(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadUser = async () => {
    const s = localStorage.getItem("yog_user");
    if (s) {
      const storedUser = JSON.parse(s);
      setUser(storedUser);
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: storedUser.email }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          localStorage.setItem("yog_user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch {}
    }
  };

  useEffect(() => {
    if (!user) return;
    const poll = async () => {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;
      try {
        const res = await fetch("/api/notifications", {
          headers: { "x-user-data": userStr },
        });
        const data = await res.json();
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
          let shownIds: string[] = [];
          try {
            const s = localStorage.getItem("yog_shown_notifications");
            if (s) shownIds = JSON.parse(s);
          } catch {}
          if (data.notifications?.length) {
            const newest = data.notifications.find(
              (n: any) => !n.read && !shownIds.includes(n.id),
            );
            if (newest) {
              setToastNotification(newest);
              localStorage.setItem(
                "yog_shown_notifications",
                JSON.stringify([...shownIds, newest.id]),
              );
            }
          }
        }
      } catch {}
    };
    poll();
    const iv = setInterval(poll, 60000);
    return () => clearInterval(iv);
  }, [user]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".profile-menu"))
        setShowProfileMenu(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
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
          paddingTop: isScrolled ? "0px" : "20px",
          transition: "padding 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          className="relative flex items-center justify-between w-full max-w-[1700px] px-6 md:px-10 py-0 pointer-events-auto"
          style={{
            background: isScrolled ? "rgba(255,255,255,0.97)" : "transparent",
            borderBottom: isScrolled ? "1px solid #e8e4de" : "none",
            backdropFilter: isScrolled ? "blur(14px)" : "none",
            borderRadius: isScrolled ? "0px" : "999px",
            transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
            fontFamily: "'Sora',sans-serif",
          }}
        >
          {/* ── LEFT — hidden on mobile ── */}
          <div className="hidden lg:flex items-center gap-7 flex-1 py-4">
            {LEFT_LINKS.map((l) => (
              <NavLink key={l} href={`/${l.toLowerCase()}`} label={l} />
            ))}
          </div>

          {/* ── LOGO ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-20"
            style={{
              top: isScrolled ? "0px" : "-20px",
              transition: "top 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <Link href="/" className="block">
              <div
                className="flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
                  background: "#fff",
                  paddingLeft: isScrolled ? "80px" : "120px",
                  paddingRight: isScrolled ? "80px" : "120px",
                  paddingTop: isScrolled ? "0" : "4px",
                  paddingBottom: isScrolled ? "0" : "4px",
                  transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
                  borderBottom: "1px solid #e8e4de",
                }}
              >
                <span
                  className="py-[14px] text-[26px] font-black leading-none text-[#1a1714] select-none"
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    letterSpacing: "0.28em",
                  }}
                >
                  YOG
                </span>
              </div>
            </Link>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex items-center justify-end gap-4 md:gap-6 flex-1 py-4">
            {/* Desktop only links */}
            {user && (
              <span className="hidden lg:block">
                <NavLink href="/following" label="Following" />
              </span>
            )}
            <div
              className="hidden xl:block"
              style={{ borderRight: "1px solid #e8e4de", paddingRight: "24px" }}
            >
              <NavLink
                href={
                  user?.role === "SELLER" || user?.role === "ADMIN"
                    ? "/seller/dashboard"
                    : "/seller/apply"
                }
                label="Sell"
              />
            </div>
            {!user && (
              <div className="hidden lg:flex items-center gap-6">
                <NavLink href="/login" label="Log In" />
                <NavLink href="/signup" label="Sign Up" />
              </div>
            )}

            {/* Bell — desktop only */}
            {user && (
              <button
                onClick={() => setShowNotifications(true)}
                className="hidden lg:flex relative text-[#1a1714] hover:opacity-40 transition-opacity cursor-pointer"
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart — always visible */}
            <Link
              href="/cart"
              className="relative text-[#1a1714] hover:opacity-40 transition-opacity"
            >
              <BagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1a1714] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Avatar — desktop only */}
            {user && (
              <div className="hidden lg:block relative profile-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu((p) => !p);
                  }}
                  className="w-8 h-8 rounded-full bg-[#1a1714] text-white text-[12px] font-bold flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer overflow-hidden"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name[0].toUpperCase()
                  )}
                </button>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-60 bg-white rounded-2xl overflow-hidden"
                      style={{
                        border: "1px solid #e8e4de",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        className="px-4 py-3.5 bg-[#f6f5f3]"
                        style={{ borderBottom: "1px solid #e8e4de" }}
                      >
                        <p className="text-[13px] font-extrabold text-[#1a1714] leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-[#9e9890] mt-0.5">
                          {user.email}
                        </p>
                        <span
                          className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                          style={{
                            background:
                              user.role === "ADMIN"
                                ? "#f3e8ff"
                                : user.role === "SELLER"
                                  ? "#e0f2fe"
                                  : "#f6f5f3",
                            color:
                              user.role === "ADMIN"
                                ? "#7c3aed"
                                : user.role === "SELLER"
                                  ? "#0284c7"
                                  : "#9e9890",
                            border:
                              user.role === "ADMIN"
                                ? "1px solid #c4b5fd"
                                : user.role === "SELLER"
                                  ? "1px solid #bae6fd"
                                  : "1px solid #e8e4de",
                          }}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="py-1.5">
                        {(
                          [
                            {
                              href: "/account",
                              icon: <UserIcon />,
                              label: "Account Settings",
                              show: true,
                            },
                            {
                              href: "/seller/dashboard",
                              icon: <StoreIcon />,
                              label: "Seller Dashboard",
                              show: user.role === "SELLER",
                            },
                            {
                              href: "/admin/sellers",
                              icon: <SettingsIcon />,
                              label: "Admin Panel",
                              show: user.role === "ADMIN",
                            },
                          ] as const
                        )
                          .filter((i) => i.show)
                          .map(({ href, icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#f6f5f3] transition-colors text-[#1a1714]"
                            >
                              <span className="text-[#9e9890]">{icon}</span>
                              <span className="text-[12px] font-semibold">
                                {label}
                              </span>
                            </Link>
                          ))}
                        <div
                          style={{
                            margin: "4px 0",
                            borderTop: "1px solid #e8e4de",
                          }}
                        />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 transition-colors w-full cursor-pointer"
                        >
                          <span className="text-red-400">
                            <LogOutIcon />
                          </span>
                          <span className="text-[12px] font-semibold text-red-500">
                            Sign Out
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Animated hamburger — mobile only */}
            <MenuToggle
              open={showMobileMenu}
              onClick={() => setShowMobileMenu((p) => !p)}
            />
          </div>
        </nav>

        {/* ── Full-screen mobile menu ── */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-3 right-3 mt-2 bg-white rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                border: "1px solid #e8e4de",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              {/* Nav links with staggered animation */}
              {MOBILE_LINKS.map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.04 + 0.05,
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={l === "Stores" ? "/stores" : `/${l.toLowerCase()}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-between px-5 py-4 text-[13px] font-700 text-[#1a1714] hover:bg-[#f6f5f3] transition-colors"
                    style={{
                      borderBottom: "1px solid #f0ede8",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {l}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c4bfb8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </motion.div>
              ))}

              {/* Sell */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.22 }}
              >
                <Link
                  href={
                    user?.role === "SELLER" || user?.role === "ADMIN"
                      ? "/seller/dashboard"
                      : "/seller/apply"
                  }
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[#f6f5f3] transition-colors"
                  style={{ borderBottom: "1px solid #f0ede8" }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1a1714",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Sell on YOG
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 20,
                      background: "#f0fdf4",
                      color: "#15803d",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    Open
                  </span>
                </Link>
              </motion.div>

              {/* User section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.2 }}
              >
                {user ? (
                  <div>
                    <div
                      className="px-5 py-3 flex items-center gap-3"
                      style={{
                        borderBottom: "1px solid #f0ede8",
                        background: "#faf9f8",
                      }}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#1a1714] text-white text-[13px] font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.name[0].toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1a1714",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.name}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#9e9890",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#f6f5f3] transition-colors"
                      style={{ borderBottom: "1px solid #f0ede8" }}
                    >
                      <span style={{ color: "#9e9890" }}>
                        <UserIcon />
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1a1714",
                        }}
                      >
                        Account Settings
                      </span>
                    </Link>
                    {user.role === "SELLER" && (
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#f6f5f3] transition-colors"
                        style={{ borderBottom: "1px solid #f0ede8" }}
                      >
                        <span style={{ color: "#9e9890" }}>
                          <StoreIcon />
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1a1714",
                          }}
                        >
                          Seller Dashboard
                        </span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition-colors w-full"
                    >
                      <span style={{ color: "#f87171" }}>
                        <LogOutIcon />
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#ef4444",
                        }}
                      >
                        Sign Out
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 flex gap-3">
                    <Link
                      href="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex-1 flex items-center justify-center py-3 rounded-xl border border-[#e8e4de] text-[13px] font-700 text-[#1a1714] hover:bg-[#f6f5f3] transition-colors no-underline"
                      style={{ fontWeight: 700 }}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex-1 flex items-center justify-center py-3 rounded-xl bg-[#1a1714] text-[13px] font-700 text-white hover:bg-[#333] transition-colors no-underline"
                      style={{ fontWeight: 700 }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
}
