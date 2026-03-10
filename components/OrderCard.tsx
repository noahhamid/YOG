"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface IconProps {
  d: string;
  size?: number;
  sw?: number;
  fill?: string;
}
type IconPropsNoD = Omit<IconProps, "d">;

interface StatusConfig {
  label: string;
  bg: string;
  color: string;
  dot: string;
  Icon: (p: IconPropsNoD) => React.ReactElement;
}

interface StatusEntry extends StatusConfig {
  value: string;
}

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

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (order: Order, newStatus: string) => Promise<void>;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.75, fill = "none" }: IconProps) => (
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

const ClockIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-8V7"
  />
);
const CheckIco = (p: IconPropsNoD) => (
  <Ico {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />
);
const TruckIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m0 0h3l3 3v4h-3m-3-7v7m0 0H8m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"
  />
);
const XCircleIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm3-13-6 6m0-6 6 6"
  />
);
const PackageIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"
  />
);
const PhoneIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
  />
);
const MapPinIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  />
);
const UserIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
  />
);
const StoreIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"
  />
);
const XIcon = (p: IconPropsNoD) => <Ico {...p} d="M18 6 6 18M6 6l12 12" />;
const SparkleIco = (p: IconPropsNoD) => (
  <Ico
    {...p}
    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"
  />
);

const LoaderIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    style={{ animation: "oc-spin 0.8s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: {
    label: "Pending",
    bg: "#fef9c3",
    color: "#a16207",
    dot: "#eab308",
    Icon: ClockIco,
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "#dbeafe",
    color: "#1d4ed8",
    dot: "#3b82f6",
    Icon: CheckIco,
  },
  PROCESSING: {
    label: "Processing",
    bg: "#f3e8ff",
    color: "#7c3aed",
    dot: "#a855f7",
    Icon: PackageIco,
  },
  SHIPPED: {
    label: "Shipped",
    bg: "#e0e7ff",
    color: "#4338ca",
    dot: "#6366f1",
    Icon: TruckIco,
  },
  DELIVERED: {
    label: "Delivered",
    bg: "#dcfce7",
    color: "#15803d",
    dot: "#22c55e",
    Icon: CheckIco,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "#fee2e2",
    color: "#dc2626",
    dot: "#ef4444",
    Icon: XCircleIco,
  },
};

const ALL_STATUSES: StatusEntry[] = Object.entries(STATUS_MAP).map(
  ([value, cfg]) => ({
    value,
    ...cfg,
  }),
);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  @keyframes oc-spin   { to { transform:rotate(360deg); } }
  @keyframes oc-fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  @keyframes oc-fadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }

  .oc-card {
    background:#fff; border-radius:18px; border:1px solid #e8e4de;
    overflow:hidden; font-family:'Sora',sans-serif;
    transition:box-shadow 0.2s,transform 0.2s;
    animation:oc-fadeUp 0.3s ease both;
  }
  .oc-card:hover { box-shadow:0 8px 28px rgba(0,0,0,0.08); }

  .oc-top    { display:flex; align-items:flex-start; gap:16px; padding:18px 18px 0; }
  .oc-img    { width:76px; height:76px; border-radius:12px; object-fit:cover; flex-shrink:0; border:1px solid #e8e4de; }
  .oc-info   { flex:1; min-width:0; }
  .oc-title  { font-size:15px; font-weight:700; color:#1a1714; margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; letter-spacing:-0.2px; }
  .oc-number { font-size:11px; color:#9e9890; margin:0 0 8px; font-weight:500; }
  .oc-badges { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .oc-status-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  .oc-dot         { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .oc-date        { font-size:11px; color:#9e9890; }
  .oc-total-wrap  { text-align:right; flex-shrink:0; }
  .oc-total-label { font-size:10px; color:#9e9890; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 3px; }
  .oc-total-val   { font-size:20px; font-weight:800; color:#1a1714; letter-spacing:-0.5px; }

  .oc-meta { display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin:16px 0 0; border-top:1px solid #f0ede9; border-bottom:1px solid #f0ede9; }
  .oc-meta-item { padding:12px 18px; }
  .oc-meta-item + .oc-meta-item { border-left:1px solid #f0ede9; }
  .oc-meta-label { display:flex; align-items:center; gap:4px; font-size:10px; color:#9e9890; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:5px; }
  .oc-meta-val   { font-size:13px; font-weight:600; color:#1a1714; }

  .oc-delivery-note { margin:14px 18px 0; padding:10px 14px; border-radius:10px; display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; }

  .oc-actions { display:flex; gap:10px; padding:14px 18px 18px; }
  .oc-btn {
    flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
    padding:9px 16px; border-radius:10px; font-size:13px; font-weight:600;
    cursor:pointer; border:none; transition:all 0.15s; font-family:'Sora',sans-serif;
    text-decoration:none;
  }

  .oc-overlay {
    position:fixed; inset:0; background:rgba(15,12,9,0.55); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center; padding:16px; z-index:9999;
  }
  .oc-modal {
    background:#fff; border-radius:20px; width:100%; max-width:440px;
    box-shadow:0 32px 80px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.06);
    font-family:'Sora',sans-serif; animation:oc-fadeIn 0.22s cubic-bezier(0.16,1,0.3,1);
    overflow:hidden;
  }
  .oc-modal-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:20px 24px 16px; border-bottom:1px solid #f0ede9;
  }
  .oc-modal-title { font-size:17px; font-weight:800; color:#1a1714; letter-spacing:-0.4px; margin:0; }
  .oc-modal-sub   { font-size:11px; color:#9e9890; margin:3px 0 0; }
  .oc-icon-btn {
    width:34px; height:34px; border-radius:9px; border:1px solid #e8e4de;
    background:transparent; cursor:pointer; display:flex; align-items:center;
    justify-content:center; color:#9e9890; transition:all 0.15s;
  }
  .oc-icon-btn:hover { background:#f5f3f0; color:#1a1714; }

  .oc-status-list { padding:16px; display:flex; flex-direction:column; gap:8px; }
  .oc-status-option {
    width:100%; padding:12px 14px; border-radius:12px; border:1.5px solid #e8e4de;
    background:transparent; cursor:pointer; display:flex; align-items:center;
    justify-content:space-between; transition:all 0.15s; font-family:'Sora',sans-serif;
    text-align:left;
  }
  .oc-status-option:hover:not(:disabled) { border-color:#1a1714; background:#fafaf9; }
  .oc-status-option.selected { border-color:#1a1714; background:#f5f3f0; }
  .oc-status-option:disabled { opacity:0.5; cursor:not-allowed; }
  .oc-status-option-left { display:flex; align-items:center; gap:10px; }
  .oc-status-icon-wrap   { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; }
  .oc-status-lbl { font-size:13px; font-weight:600; color:#1a1714; }
  .oc-check { width:20px; height:20px; border-radius:6px; background:#1a1714; display:flex; align-items:center; justify-content:center; }

  .oc-modal-footer { display:flex; gap:10px; padding:0 16px 16px; }
  .oc-modal-cancel {
    flex:1; padding:10px; border:1.5px solid #e8e4de; background:transparent;
    border-radius:11px; font-size:13px; font-weight:600; cursor:pointer;
    font-family:'Sora',sans-serif; transition:all 0.15s; color:#1a1714;
  }
  .oc-modal-cancel:hover { background:#f5f3f0; }
  .oc-modal-confirm {
    flex:1; padding:10px; background:#1a1714; color:#fff; border:none;
    border-radius:11px; font-size:13px; font-weight:600; cursor:pointer;
    font-family:'Sora',sans-serif; transition:all 0.15s;
    display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .oc-modal-confirm:hover:not(:disabled) { background:#333; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,0.16); }
  .oc-modal-confirm:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selected, setSelected] = useState(order.status);

  const statusCfg: StatusConfig =
    STATUS_MAP[order.status] ?? STATUS_MAP["PENDING"];
  const StatusIcon = statusCfg.Icon;

  const handleUpdate = async () => {
    if (selected === order.status) {
      setShowModal(false);
      return;
    }
    setIsUpdating(true);
    try {
      await onUpdateStatus(order, selected);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const metaItems: {
    Icon: (p: IconPropsNoD) => React.ReactElement;
    label: string;
    val: string;
  }[] = [
    { Icon: UserIco, label: "Customer", val: order.customerName },
    { Icon: PhoneIco, label: "Phone", val: order.customerPhone },
    {
      Icon: PackageIco,
      label: "Size / Color",
      val: `${order.selectedSize} · ${order.selectedColor}`,
    },
    { Icon: SparkleIco, label: "Quantity", val: `${order.quantity}×` },
  ];

  return (
    <>
      <style>{CSS}</style>

      <div className="oc-card">
        {/* Top */}
        <div className="oc-top">
          <img
            src={
              order.product.images[0]?.url ?? "https://via.placeholder.com/100"
            }
            alt={order.product.title}
            className="oc-img"
          />
          <div className="oc-info">
            <p className="oc-title">{order.product.title}</p>
            <p className="oc-number">Order #{order.orderNumber}</p>
            <div className="oc-badges">
              <span
                className="oc-status-pill"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                <span
                  className="oc-dot"
                  style={{ background: statusCfg.dot }}
                />
                <StatusIcon size={11} />
                {statusCfg.label}
              </span>
              <span className="oc-date">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="oc-total-wrap">
            <p className="oc-total-label">Total</p>
            <p className="oc-total-val">
              {order.finalTotal.toLocaleString()} ETB
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="oc-meta">
          {metaItems.map(({ Icon, label, val }) => (
            <div key={label} className="oc-meta-item">
              <div className="oc-meta-label">
                <Icon size={10} /> {label}
              </div>
              <div className="oc-meta-val">{val}</div>
            </div>
          ))}
        </div>

        {/* Delivery note */}
        {order.deliveryMethod === "DELIVERY" && order.deliveryAddress && (
          <div
            className="oc-delivery-note"
            style={{ background: "#f0fdf4", color: "#15803d" }}
          >
            <MapPinIco size={14} /> {order.deliveryAddress}
          </div>
        )}
        {order.deliveryMethod === "MEETUP" && (
          <div
            className="oc-delivery-note"
            style={{ background: "#eff6ff", color: "#1d4ed8" }}
          >
            <StoreIco size={14} /> Meet-up — contact customer to arrange
            location
          </div>
        )}

        {/* Actions */}
        <div className="oc-actions">
          <button
            className="oc-btn"
            onClick={() => setShowModal(true)}
            disabled={isUpdating}
            style={{ background: "#1a1714", color: "#fff" }}
            onMouseEnter={(e) => {
              if (!isUpdating) e.currentTarget.style.background = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a1714";
            }}
          >
            {isUpdating && <LoaderIcon size={14} />}
            {isUpdating ? "Updating…" : "Update Status"}
          </button>
          <a
            href={`tel:${order.customerPhone}`}
            className="oc-btn"
            style={{ background: "#f0fdf4", color: "#15803d" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dcfce7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f0fdf4";
            }}
          >
            <PhoneIco size={14} /> Call
          </a>
        </div>
      </div>

      {/* Status modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="oc-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="oc-modal"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="oc-modal-header">
                <div>
                  <h3 className="oc-modal-title">Update Order Status</h3>
                  <p className="oc-modal-sub">Order #{order.orderNumber}</p>
                </div>
                <button
                  className="oc-icon-btn"
                  onClick={() => setShowModal(false)}
                  disabled={isUpdating}
                >
                  <XIcon size={15} />
                </button>
              </div>

              <div className="oc-status-list">
                {ALL_STATUSES.map(
                  ({ value, label, bg, color, Icon }: StatusEntry) => {
                    const isSelected = selected === value;
                    return (
                      <button
                        key={value}
                        className={`oc-status-option${isSelected ? " selected" : ""}`}
                        onClick={() => setSelected(value)}
                        disabled={isUpdating}
                      >
                        <div className="oc-status-option-left">
                          <div
                            className="oc-status-icon-wrap"
                            style={{ background: bg, color }}
                          >
                            <Icon size={14} />
                          </div>
                          <span className="oc-status-lbl">{label}</span>
                        </div>
                        {isSelected && (
                          <div className="oc-check">
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#fff"
                              strokeWidth={3}
                              strokeLinecap="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              <div className="oc-modal-footer">
                <button
                  className="oc-modal-cancel"
                  onClick={() => setShowModal(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  className="oc-modal-confirm"
                  onClick={handleUpdate}
                  disabled={isUpdating || selected === order.status}
                >
                  {isUpdating ? (
                    <>
                      <LoaderIcon size={14} /> Updating…
                    </>
                  ) : (
                    "Save Status"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
