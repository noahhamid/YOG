"use client";

import { useEffect, useRef, useState } from "react";
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

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const DURATION = 6000;

const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

const SystemIcon = () => (
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
);

const TYPE_CONFIG: Record<
  string,
  {
    label: string;
    iconBg: string;
    iconColor: string;
    barColor: string;
  }
> = {
  ORDER_UPDATE: {
    label: "Order Update",
    iconBg: "#1a1714",
    iconColor: "#fff",
    barColor: "#1a1714",
  },
  NEW_PRODUCT: {
    label: "New Product",
    iconBg: "#1a1714",
    iconColor: "#fff",
    barColor: "#1a1714",
  },
  FOLLOW: {
    label: "New Follower",
    iconBg: "#1a1714",
    iconColor: "#fff",
    barColor: "#1a1714",
  },
  SYSTEM: {
    label: "System Alert",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    barColor: "#ea580c",
  },
};

export default function NotificationToast({
  notification,
  onClose,
}: NotificationToastProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(Date.now());
  const elapsed = useRef(0);

  const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.SYSTEM;
  const isSystem = notification.type === "SYSTEM";
  const Icon = isSystem ? SystemIcon : PackageIcon;

  // Progress bar
  useEffect(() => {
    if (paused) {
      elapsed.current += Date.now() - startRef.current;
      return;
    }
    startRef.current = Date.now();
    const iv = setInterval(() => {
      const total = elapsed.current + (Date.now() - startRef.current);
      const pct = Math.max(0, 100 - (total / DURATION) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
  }, [paused]);

  // Auto-dismiss
  useEffect(() => {
    if (paused) return;
    const remaining = DURATION - elapsed.current;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, remaining);
    return () => clearTimeout(t);
  }, [paused, onClose]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  const getLink = () => {
    if (notification.type === "ORDER_UPDATE")
      return "/seller/dashboard?tab=orders";
    if (notification.type === "NEW_PRODUCT" && notification.productId)
      return `/product/${notification.productId}`;
    if (notification.type === "FOLLOW" && notification.sellerId)
      return `/store/${notification.sellerId}`;
    if (notification.type === "SYSTEM") return "/seller/dashboard";
    return "#";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 340 }}
          className="fixed top-5 right-5 z-[600] w-[380px] max-w-[calc(100vw-2rem)]"
          style={{ fontFamily: "'Sora', sans-serif" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: isSystem ? "1px solid #fed7aa" : "1px solid #e8e4de",
              boxShadow: isSystem
                ? "0 8px 40px rgba(234,88,12,0.18), 0 2px 8px rgba(0,0,0,0.06)"
                : "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Progress bar */}
            <div
              className="h-[3px] w-full"
              style={{ background: `${cfg.barColor}22` }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: cfg.barColor,
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>

            {/* System alert banner */}
            {isSystem && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                  borderBottom: "1px solid #fed7aa",
                  padding: "6px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    color: "#ea580c",
                  }}
                >
                  ⚠ Account Alert
                </span>
              </div>
            )}

            <Link href={getLink()} onClick={dismiss} className="no-underline">
              <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className="shrink-0">
                  {notification.imageUrl ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f6f5f3]">
                      <Image
                        src={notification.imageUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: cfg.iconBg, color: cfg.iconColor }}
                    >
                      <Icon />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.9px]"
                      style={{ color: cfg.barColor }}
                    >
                      {cfg.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dismiss();
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#f6f5f3] transition-colors text-[#9e9890] hover:text-[#1a1714] shrink-0"
                    >
                      <XIcon />
                    </button>
                  </div>
                  <p className="text-[13px] font-semibold text-[#1a1714] leading-snug truncate">
                    {notification.title}
                  </p>
                  <p className="text-[12px] text-[#9e9890] leading-relaxed mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p
                    className="text-[11px] mt-2 font-semibold"
                    style={{ color: cfg.barColor }}
                  >
                    {isSystem ? "View dashboard →" : "Tap to view →"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
