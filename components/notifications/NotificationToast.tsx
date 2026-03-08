"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  imageUrl?: string;
  productId?: string;
  sellerId?: string;
}

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

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
    width="16"
    height="16"
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

const TYPE_LABEL: Record<string, string> = {
  ORDER_UPDATE: "Order Update",
  NEW_PRODUCT: "New Product",
  FOLLOW: "New Follower",
  SYSTEM: "System",
};

const DURATION = 5000;

export default function NotificationToast({
  notification,
  onClose,
}: NotificationToastProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [paused, setPaused] = useState(false);

  // progress bar countdown
  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const iv = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
  }, [paused]);

  // auto-dismiss
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, DURATION);
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
    return "#";
  };

  const label = TYPE_LABEL[notification.type] ?? "Notification";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 340 }}
          className="fixed top-5 right-5 z-[60] w-[360px] max-w-[calc(100vw-2rem)]"
          style={{ fontFamily: "'Sora', sans-serif" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid #e8e4de",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Progress bar at the top */}
            <div className="h-[3px] bg-[#f0ede9] w-full">
              <motion.div
                className="h-full bg-[#1a1714]"
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>

            <Link href={getLink()} onClick={dismiss} className="no-underline">
              <div className="flex items-start gap-3 p-4">
                {/* Icon / Image */}
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
                    <div className="w-12 h-12 rounded-xl bg-[#1a1714] flex items-center justify-center text-white">
                      <PackageIcon />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.9px] text-[#9e9890]">
                      {label}
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
                  <p className="text-[11px] text-[#b8b4ae] mt-2 font-medium">
                    Tap to view →
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
