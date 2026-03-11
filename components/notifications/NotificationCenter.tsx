"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  imageUrl?: string | null;
  productId?: string | null;
  sellerId?: string | null;
  read: boolean;
  createdAt: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when unread count changes — use to update the bell badge */
  onUnreadChange?: (count: number) => void;
  /** Called when a brand-new notification arrives — use to show a toast */
  onNewNotification?: (n: Notification) => void;
}

// ─── Poll interval (ms) ───────────────────────────────────────────────────────
const POLL_INTERVAL = 20_000; // 20 seconds

// ─── Icons ────────────────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const TrashIcon = () => (
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const PackageIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// Icon per notification type so SYSTEM looks distinct
const TYPE_ICON: Record<string, () => JSX.Element> = {
  SYSTEM: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  ORDER_UPDATE: PackageIcon,
  NEW_PRODUCT: PackageIcon,
  FOLLOW: () => (
    <svg
      width="18"
      height="18"
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
  ),
};

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; accent: string }
> = {
  ORDER_UPDATE: {
    label: "Order",
    color: "#1a1714",
    bg: "#f0ede9",
    accent: "#1a1714",
  },
  NEW_PRODUCT: {
    label: "Product",
    color: "#1a1714",
    bg: "#f0ede9",
    accent: "#1a1714",
  },
  FOLLOW: {
    label: "Follow",
    color: "#1a1714",
    bg: "#f0ede9",
    accent: "#1a1714",
  },
  SYSTEM: {
    label: "System",
    color: "#c2410c",
    bg: "#fff7ed",
    accent: "#ea580c",
  },
};

export default function NotificationCenter({
  isOpen,
  onClose,
  onUnreadChange,
  onNewNotification,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Track the IDs we've already seen so we can detect truly new ones
  const seenIds = useRef<Set<string>>(new Set());
  // Track whether the initial load is done (so we don't toast stale notifications)
  const initialLoadDone = useRef(false);

  // ─── Core fetch ────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(
    async (silent = false) => {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;

      if (!silent) setIsLoading(true);

      try {
        const res = await fetch("/api/notifications", {
          headers: { "x-user-data": userStr },
        });
        const data = await res.json();
        if (!data.notifications) return;

        const incoming: Notification[] = data.notifications;

        // Detect brand-new notifications (not seen before AND unread)
        if (initialLoadDone.current) {
          const brandNew = incoming.filter(
            (n) => !seenIds.current.has(n.id) && !n.read,
          );
          // Fire toast for each new one (most recent first, cap at 1 toast at a time)
          if (brandNew.length > 0 && onNewNotification) {
            onNewNotification(brandNew[0]);
          }
        }

        // Update seen set
        incoming.forEach((n) => seenIds.current.add(n.id));
        initialLoadDone.current = true;

        setNotifications(incoming);

        // Bubble unread count up to Navbar bell badge
        const unread = incoming.filter((n) => !n.read).length;
        onUnreadChange?.(unread);
      } catch (e) {
        console.error("Notification fetch error:", e);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [onUnreadChange, onNewNotification],
  );

  // ─── Initial load when panel opens ────────────────────────────────────────
  useEffect(() => {
    if (isOpen) fetchNotifications(false);
  }, [isOpen, fetchNotifications]);

  // ─── Background poll (runs regardless of panel state) ─────────────────────
  useEffect(() => {
    // First silent poll after a short delay so we don't double-fetch on mount
    const firstPoll = setTimeout(() => fetchNotifications(true), 3000);
    const interval = setInterval(() => fetchNotifications(true), POLL_INTERVAL);
    return () => {
      clearTimeout(firstPoll);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const markAsRead = async (id: string) => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-data": userStr },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    const unread = notifications.filter((n) => n.id !== id && !n.read).length;
    onUnreadChange?.(unread);
  };

  const markAllAsRead = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-data": userStr },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onUnreadChange?.(0);
  };

  const deleteNotification = async (id: string) => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;
    await fetch(`/api/notifications?id=${id}`, {
      method: "DELETE",
      headers: { "x-user-data": userStr },
    });
    const remaining = notifications.filter((n) => n.id !== id);
    setNotifications(remaining);
    onUnreadChange?.(remaining.filter((n) => !n.read).length);
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getLink = (n: Notification) => {
    if (n.type === "ORDER_UPDATE") return "/seller/dashboard?tab=orders";
    if (n.type === "NEW_PRODUCT" && n.productId)
      return `/product/${n.productId}`;
    if (n.type === "FOLLOW" && n.sellerId) return `/store/${n.sellerId}`;
    if (n.type === "SYSTEM") return "/seller/dashboard";
    return "#";
  };

  const getTimeAgo = (date: string) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] z-50 flex flex-col"
            style={{ background: "#f6f5f3", fontFamily: "'Sora', sans-serif" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-[#e8e4de] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[9px] bg-[#1a1714] flex items-center justify-center text-white">
                  <BellIcon />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#1a1714] leading-none">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <p className="text-[11px] text-[#9e9890] mt-0.5">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-[#9e9890] hover:text-[#1a1714] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#e8e4de]"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-[9px] hover:bg-[#e8e4de] transition-colors text-[#9e9890] hover:text-[#1a1714]"
                >
                  <XIcon />
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 px-5 py-3 shrink-0">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="text-[12px] font-semibold capitalize px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: filter === f ? "#1a1714" : "transparent",
                    color: filter === f ? "#fff" : "#9e9890",
                  }}
                >
                  {f}
                  {f === "unread" && unreadCount > 0 && (
                    <span
                      className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]"
                      style={{
                        background:
                          filter === f ? "rgba(255,255,255,0.2)" : "#e8e4de",
                        color: filter === f ? "#fff" : "#1a1714",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col gap-3 p-5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 flex gap-3 animate-pulse"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#e8e4de] shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#e8e4de] rounded w-3/4" />
                        <div className="h-3 bg-[#e8e4de] rounded w-full" />
                        <div className="h-2.5 bg-[#e8e4de] rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 px-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#e8e4de] flex items-center justify-center mb-4 text-[#9e9890]">
                    <BellIcon />
                  </div>
                  <p className="text-[14px] font-semibold text-[#1a1714]">
                    All caught up
                  </p>
                  <p className="text-[12px] text-[#9e9890] mt-1">
                    No {filter === "unread" ? "unread " : ""}notifications
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-4">
                  <AnimatePresence initial={false}>
                    {filtered.map((n, i) => {
                      const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.SYSTEM;
                      const Icon = TYPE_ICON[n.type] ?? PackageIcon;
                      const isSystem = n.type === "SYSTEM";

                      return (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            x: 40,
                            height: 0,
                            marginBottom: 0,
                          }}
                          transition={{ delay: i * 0.03 }}
                          className="group bg-white rounded-2xl overflow-hidden"
                          style={{
                            border: n.read
                              ? "1px solid #e8e4de"
                              : isSystem
                                ? `1px solid ${cfg.accent}40`
                                : "1px solid #d4cfc9",
                            boxShadow: n.read
                              ? "none"
                              : isSystem
                                ? `0 2px 16px ${cfg.accent}18`
                                : "0 2px 12px rgba(0,0,0,0.06)",
                          }}
                        >
                          {/* Orange left bar for unread SYSTEM notifications */}
                          {isSystem && !n.read && (
                            <div
                              style={{
                                height: 3,
                                background: `linear-gradient(90deg, ${cfg.accent}, transparent)`,
                              }}
                            />
                          )}

                          <Link
                            href={getLink(n)}
                            onClick={() => {
                              markAsRead(n.id);
                              onClose();
                            }}
                            className="flex items-start gap-3 p-4 no-underline"
                          >
                            {/* Avatar */}
                            <div className="shrink-0">
                              {n.imageUrl ? (
                                <div className="w-11 h-11 rounded-xl overflow-hidden">
                                  <Image
                                    src={n.imageUrl}
                                    alt=""
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                                  style={{
                                    background: cfg.bg,
                                    color: cfg.accent,
                                  }}
                                >
                                  <Icon />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span
                                  className="text-[10px] font-bold uppercase tracking-[0.8px]"
                                  style={{ color: cfg.accent }}
                                >
                                  {cfg.label}
                                </span>
                                {!n.read && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{
                                      background: isSystem
                                        ? cfg.accent
                                        : "#1a1714",
                                    }}
                                  />
                                )}
                              </div>
                              <p className="text-[13px] font-semibold text-[#1a1714] leading-snug mb-0.5 truncate">
                                {n.title}
                              </p>
                              <p className="text-[12px] text-[#9e9890] line-clamp-2 leading-relaxed">
                                {n.message}
                              </p>
                              <p className="text-[11px] text-[#b8b4ae] mt-1.5">
                                {getTimeAgo(n.createdAt)}
                              </p>
                            </div>
                          </Link>

                          {/* Hover actions */}
                          <div className="flex items-center gap-1 px-4 pb-3 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!n.read && (
                              <button
                                onClick={() => markAsRead(n.id)}
                                className="flex items-center gap-1 text-[11px] font-semibold text-[#9e9890] hover:text-[#1a1714] px-2 py-1 rounded-lg hover:bg-[#f6f5f3] transition-all"
                              >
                                <CheckIcon /> Mark read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(n.id)}
                              className="flex items-center gap-1 text-[11px] font-semibold text-[#9e9890] hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-all ml-auto"
                            >
                              <TrashIcon /> Delete
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
