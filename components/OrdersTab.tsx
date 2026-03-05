"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderCard from "./OrderCard";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.75, fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
const BagIco = (p) => (
  <Ico
    {...p}
    d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
  />
);
const ClockIco = (p) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-8V7"
  />
);
const CheckIco = (p) => (
  <Ico {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />
);
const TruckIco = (p) => (
  <Ico
    {...p}
    d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m0 0h3l3 3v4h-3m-3-7v7m0 0H8m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"
  />
);
const RefreshIco = (p) => (
  <Ico
    {...p}
    d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5"
  />
);
const LoaderIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    style={{ animation: "ot-spin 0.8s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  PENDING: { dot: "#eab308", bg: "#fef9c3", color: "#a16207" },
  CONFIRMED: { dot: "#3b82f6", bg: "#dbeafe", color: "#1d4ed8" },
  SHIPPED: { dot: "#6366f1", bg: "#e0e7ff", color: "#4338ca" },
  DELIVERED: { dot: "#22c55e", bg: "#dcfce7", color: "#15803d" },
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  @keyframes ot-spin { to { transform: rotate(360deg); } }
  @keyframes ot-fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }

  .ot-root { font-family: 'Sora', sans-serif; }

  /* ── Filter bar ── */
  .ot-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 12px; flex-wrap: wrap; }
  .ot-filters { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; flex-wrap: nowrap; }
  .ot-filters::-webkit-scrollbar { display: none; }

  .ot-filter-btn {
    display: flex; align-items: center; gap: 6px; padding: 8px 14px;
    border-radius: 10px; font-size: 12px; font-weight: 600; white-space: nowrap;
    cursor: pointer; border: 1.5px solid transparent; transition: all 0.15s;
    font-family: 'Sora', sans-serif; background: #fff;
    border-color: #e8e4de; color: #9e9890;
  }
  .ot-filter-btn:hover { border-color: #1a1714; color: #1a1714; }
  .ot-filter-btn.active { background: #1a1714; color: #fff; border-color: #1a1714; }
  .ot-filter-btn.active .ot-filter-count { background: rgba(255,255,255,0.2); color: #fff; }
  .ot-filter-count {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 5px; border-radius: 5px;
    font-size: 10px; font-weight: 700; background: #f5f3f0; color: #9e9890;
  }
  .ot-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* refresh btn */
  .ot-refresh {
    display: flex; align-items: center; gap: 6px; padding: 8px 14px;
    border-radius: 10px; border: 1.5px solid #e8e4de; background: #fff;
    font-size: 12px; font-weight: 600; color: #9e9890; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: all 0.15s; flex-shrink: 0;
  }
  .ot-refresh:hover { border-color: #1a1714; color: #1a1714; }
  .ot-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Order list ── */
  .ot-list { display: flex; flex-direction: column; gap: 14px; }

  /* ── Loading skeleton ── */
  .ot-loading { display: flex; align-items: center; justify-content: center; padding: 80px 0; }
  .ot-spinner { width: 36px; height: 36px; border: 3px solid #e8e4de; border-top-color: #1a1714; border-radius: 50%; animation: ot-spin 0.7s linear infinite; }

  /* ── Empty state ── */
  .ot-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; background: #fff; border-radius: 18px;
    border: 1.5px dashed #e8e4de; text-align: center;
    animation: ot-fadeUp 0.3s ease;
  }
  .ot-empty-icon {
    width: 64px; height: 64px; border-radius: 18px; background: #f5f3f0;
    display: flex; align-items: center; justify-content: center;
    color: #9e9890; margin-bottom: 18px;
  }
  .ot-empty-title { font-size: 17px; font-weight: 700; color: #1a1714; margin: 0 0 8px; letter-spacing: -0.3px; }
  .ot-empty-sub { font-size: 13px; color: #9e9890; margin: 0; line-height: 1.6; }

  /* ── Count summary strip ── */
  .ot-summary { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
  .ot-summary-chip {
    display: flex; align-items: center; gap: 6px; padding: 5px 11px;
    background: #fff; border: 1px solid #e8e4de; border-radius: 8px;
    font-size: 11px; font-weight: 600; color: #9e9890;
  }
`;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  finalTotal: number;
  deliveryMethod: string;
  deliveryAddress: string | null;
  status: string;
  createdAt: string;
  product: { title: string; images: Array<{ url: string }> };
}
interface OrdersCache {
  all: Order[];
  pending: Order[];
  confirmed: Order[];
  shipped: Order[];
  delivered: Order[];
  timestamp: number;
}
interface OrdersTabProps {
  isActive: boolean;
  ordersCache: OrdersCache;
  onRefreshCache: () => Promise<void>;
}

// ─── Filter config ─────────────────────────────────────────────────────────────
const FILTERS = [
  { value: "all", label: "All", dot: null },
  { value: "pending", label: "Pending", dot: "#eab308" },
  { value: "confirmed", label: "Confirmed", dot: "#3b82f6" },
  { value: "shipped", label: "Shipped", dot: "#6366f1" },
  { value: "delivered", label: "Delivered", dot: "#22c55e" },
];

export default function OrdersTab({
  isActive,
  ordersCache,
  onRefreshCache,
}: OrdersTabProps) {
  const [filter, setFilter] = useState("all");
  const [localOrders, setLocalOrders] = useState<OrdersCache>(ordersCache);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLocalOrders(ordersCache);
  }, [ordersCache]);

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch(`/api/seller/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }

      // Optimistic update
      setLocalOrders((prev) => {
        const update = (list: Order[]) =>
          list.map((o) =>
            o.id === order.id ? { ...o, status: newStatus } : o,
          );
        return {
          ...prev,
          all: update(prev.all),
          pending: update(prev.pending),
          confirmed: update(prev.confirmed),
          shipped: update(prev.shipped),
          delivered: update(prev.delivered),
        };
      });
      onRefreshCache();
    } catch (err: any) {
      alert(err.message || "Failed to update order");
      throw err;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefreshCache();
    } finally {
      setRefreshing(false);
    }
  };

  const getOrders = (f: string): Order[] => {
    switch (f) {
      case "pending":
        return localOrders.pending;
      case "confirmed":
        return localOrders.confirmed;
      case "shipped":
        return localOrders.shipped;
      case "delivered":
        return localOrders.delivered;
      default:
        return localOrders.all;
    }
  };

  const isLoaded = ordersCache.timestamp > 0;
  const displayOrders = getOrders(filter);
  const currentFilterLabel =
    FILTERS.find((f) => f.value === filter)?.label || "All";

  return (
    <>
      <style>{CSS}</style>
      <div className="ot-root">
        {/* Filter bar */}
        <div className="ot-bar">
          <div className="ot-filters">
            {FILTERS.map(({ value, label, dot }) => {
              const count = getOrders(value).length;
              const isActive = filter === value;
              return (
                <button
                  key={value}
                  className={`ot-filter-btn${isActive ? " active" : ""}`}
                  onClick={() => setFilter(value)}
                >
                  {dot && (
                    <span
                      className="ot-dot"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.7)" : dot,
                      }}
                    />
                  )}
                  {label}
                  <span className="ot-filter-count">{count}</span>
                </button>
              );
            })}
          </div>
          <button
            className="ot-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? <LoaderIcon size={13} /> : <RefreshIco size={13} />}
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* Content */}
        {!isLoaded ? (
          <div className="ot-loading">
            <div className="ot-spinner" />
          </div>
        ) : displayOrders.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="ot-list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {displayOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <OrderCard
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="ot-empty">
            <div className="ot-empty-icon">
              <BagIco size={28} />
            </div>
            <p className="ot-empty-title">
              No {filter !== "all" ? currentFilterLabel.toLowerCase() : ""}{" "}
              orders yet
            </p>
            <p className="ot-empty-sub">
              {filter === "all"
                ? "Orders will appear here once customers start placing them"
                : `No ${currentFilterLabel.toLowerCase()} orders at the moment`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
