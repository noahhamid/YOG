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
const MenuIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

const LEFT_LINKS = ["Shop", "Men", "Women", "Trending"];

const NavLink = ({
  href,
  label,
  scrolled,
}: {
  href: string;
  label: string;
  scrolled: boolean;
}) => (
  <Link
    href={href}
    className="relative text-[10.5px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-40 whitespace-nowrap group"
    style={{ color: scrolled ? "#1a1714" : "#1a1714" }}
  >
    {label}
    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1a1714] transition-all duration-200 group-hover:w-full" />
  </Link>
);

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

  const loadUser = async () => {
    const s = localStorage.getItem("yog_user");
    if (s) {
      const storedUser = JSON.parse(s);
      setUser(storedUser);

      // Auto-refresh session on load
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
      } catch (err) {
        console.error("Session refresh failed:", err);
      }
    }
  };

  // notification polling
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
              const updated = [...shownIds, newest.id];
              localStorage.setItem(
                "yog_shown_notifications",
                JSON.stringify(updated),
              );
            }
          }
        }
      } catch {}
    };
    poll();
    const iv = setInterval(poll, 10000);
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

  const scrolledBg = "rgba(255,255,255,0.97)";
  const scrolledBorder = "1px solid #e8e4de";

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
          className="relative flex items-center justify-between w-full max-w-[1700px] px-10 py-0 pointer-events-auto"
          style={{
            background: isScrolled ? scrolledBg : "transparent",
            borderBottom: isScrolled ? scrolledBorder : "none",
            backdropFilter: isScrolled ? "blur(14px)" : "none",
            borderRadius: isScrolled ? "0px" : "999px",
            transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
            fontFamily: "'Sora',sans-serif",
          }}
        >
          {/* ── LEFT ──────────────────────────────────────────────────── */}
          <div className="flex items-center gap-7 flex-1 py-4">
            {LEFT_LINKS.map((l) => (
              <NavLink
                key={l}
                href={`/${l.toLowerCase()}`}
                label={l}
                scrolled={isScrolled}
              />
            ))}
          </div>

          {/* ── LOGO (center absolute trapezoid) ──────────────────────── */}
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
                  paddingLeft: isScrolled ? "120px" : "200px",
                  paddingRight: isScrolled ? "120px" : "200px",
                  paddingTop: isScrolled ? "0" : "4px",
                  paddingBottom: isScrolled ? "0" : "4px",
                  transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
                  borderBottom: "1px solid #e8e4de",
                }}
              >
                <span
                  className="py-[14px] text-[28px] font-black leading-none text-[#1a1714] select-none"
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

          {/* ── RIGHT ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-6 flex-1 py-4">
            {/* Following (logged-in only) */}
            {user && (
              <NavLink
                href="/following"
                label="Following"
                scrolled={isScrolled}
              />
            )}

            {/* Sell link */}
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
                scrolled={isScrolled}
              />
            </div>

            {/* Auth links */}
            {!user && (
              <>
                <NavLink href="/login" label="Log In" scrolled={isScrolled} />
                <NavLink href="/signup" label="Sign Up" scrolled={isScrolled} />
              </>
            )}

            {/* Bell */}
            {user && (
              <button
                onClick={() => setShowNotifications(true)}
                className="relative text-[#1a1714] hover:opacity-40 transition-opacity cursor-pointer"
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart */}
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

            {/* Avatar / profile menu */}
            {user && (
              <div className="relative profile-menu">
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
                      {/* User header */}
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

                      {/* Menu items */}
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

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-[#1a1714] hover:opacity-40 transition-opacity cursor-pointer"
              onClick={() => setShowMobileMenu((p) => !p)}
            >
              {showMobileMenu ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        {/* ── Mobile menu ────────────────────────────────────────────── */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                border: "1px solid #e8e4de",
                boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              {[...LEFT_LINKS, "Following", "Sell"].map((l) => (
                <Link
                  key={l}
                  href={
                    l === "Sell"
                      ? user?.role === "SELLER" || user?.role === "ADMIN"
                        ? "/seller/dashboard"
                        : "/seller/apply"
                      : `/${l.toLowerCase()}`
                  }
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[#1a1714] hover:bg-[#f6f5f3] transition-colors"
                  style={{ borderBottom: "1px solid #e8e4de" }}
                >
                  {l}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[#1a1714] hover:bg-[#f6f5f3] transition-colors"
                    style={{ borderBottom: "1px solid #e8e4de" }}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[#1a1714] hover:bg-[#f6f5f3] transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
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
