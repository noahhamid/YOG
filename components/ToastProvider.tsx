"use client";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "cart" | "error" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

/* ── Singleton event bus ──────────────────────────────────────────────────── */
type Listener = (toast: ToastData) => void;
const listeners: Listener[] = [];

export function showToast(data: Omit<ToastData, "id">) {
  const toast: ToastData = { ...data, id: Math.random().toString(36).slice(2) };
  listeners.forEach((l) => l(toast));
}

/* ── Convenience helpers ─────────────────────────────────────────────────── */
export const toast = {
  cart: (title: string, message?: string) =>
    showToast({ type: "cart", title, message, duration: 3500 }),
  success: (title: string, message?: string) =>
    showToast({ type: "success", title, message, duration: 4000 }),
  error: (title: string, message?: string) =>
    showToast({ type: "error", title, message, duration: 4500 }),
  info: (title: string, message?: string) =>
    showToast({ type: "info", title, message, duration: 3500 }),
};

/* ── CSS ──────────────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes yt-slide-in {
    from { opacity:0; transform:translateX(-110%) scale(0.94); }
    to   { opacity:1; transform:translateX(0)     scale(1);    }
  }
  @keyframes yt-slide-out {
    from { opacity:1; transform:translateX(0)     scale(1);    max-height:120px; margin-bottom:10px; }
    to   { opacity:0; transform:translateX(-110%) scale(0.94); max-height:0;     margin-bottom:0;   }
  }
  @keyframes yt-progress {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }

  .yt-portal {
    position:fixed; top:20px; left:20px; z-index:999999;
    display:flex; flex-direction:column; gap:10px;
    pointer-events:none;
    max-width: calc(100vw - 40px);
  }

  .yt-toast {
    pointer-events:all;
    display:flex; align-items:flex-start; gap:12px;
    padding:13px 14px 13px 13px;
    background:#fff;
    border:1.5px solid #e8e4de;
    border-radius:16px;
    box-shadow:0 8px 32px rgba(26,23,20,0.13), 0 2px 8px rgba(26,23,20,0.06);
    width:320px;
    position:relative; overflow:hidden;
    animation:yt-slide-in 0.38s cubic-bezier(0.22,1,0.36,1) forwards;
    font-family:'Sora',sans-serif;
  }
  @media(max-width:400px){ .yt-toast { width:calc(100vw - 40px); } }

  .yt-toast.leaving {
    animation:yt-slide-out 0.32s cubic-bezier(0.4,0,1,1) forwards;
  }

  /* left accent bar */
  .yt-toast::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3.5px;
    border-radius:16px 0 0 16px;
  }
  .yt-toast.cart::before    { background:linear-gradient(180deg,#1a1714,#4a4540); }
  .yt-toast.success::before { background:linear-gradient(180deg,#16a34a,#22c55e); }
  .yt-toast.error::before   { background:linear-gradient(180deg,#dc2626,#ef4444); }
  .yt-toast.info::before    { background:linear-gradient(180deg,#0284c7,#38bdf8); }

  /* icon wrapper */
  .yt-icon-wrap {
    width:36px; height:36px; border-radius:10px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
  }
  .yt-toast.cart    .yt-icon-wrap { background:#f0ede9; color:#1a1714; }
  .yt-toast.success .yt-icon-wrap { background:#f0fdf4; color:#16a34a; }
  .yt-toast.error   .yt-icon-wrap { background:#fef2f2; color:#dc2626; }
  .yt-toast.info    .yt-icon-wrap { background:#f0f9ff; color:#0284c7; }

  .yt-content { flex:1; min-width:0; padding-right:4px; }
  .yt-title {
    font-size:13px; font-weight:700; color:#1a1714;
    letter-spacing:-0.2px; line-height:1.3; margin:0 0 2px;
  }
  .yt-msg {
    font-size:11.5px; color:#9e9890; line-height:1.5; margin:0;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }

  /* close btn */
  .yt-close {
    width:22px; height:22px; border-radius:6px; border:none;
    background:transparent; cursor:pointer; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    color:#c4bfb8; transition:all 0.15s; margin-top:1px;
    font-family:'Sora',sans-serif;
  }
  .yt-close:hover { background:#f5f3f0; color:#1a1714; }

  /* progress bar */
  .yt-bar {
    position:absolute; bottom:0; left:0; right:0; height:2.5px;
    transform-origin:left;
    border-radius:0 0 16px 16px;
  }
  .yt-toast.cart    .yt-bar { background:#1a1714; }
  .yt-toast.success .yt-bar { background:#16a34a; }
  .yt-toast.error   .yt-bar { background:#dc2626; }
  .yt-toast.info    .yt-bar { background:#0284c7; }
`;

/* ── Icons ────────────────────────────────────────────────────────────────── */
const CartIcon = () => (
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
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ErrorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ICONS: Record<ToastType, React.ReactNode> = {
  cart: <CartIcon />,
  success: <CheckIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
};

/* ── Single toast item ────────────────────────────────────────────────────── */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const duration = toast.duration ?? 3500;

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  return (
    <div className={`yt-toast ${toast.type}${leaving ? " leaving" : ""}`}>
      <div className="yt-icon-wrap">{ICONS[toast.type]}</div>
      <div className="yt-content">
        <p className="yt-title">{toast.title}</p>
        {toast.message && <p className="yt-msg">{toast.message}</p>}
      </div>
      <button className="yt-close" onClick={dismiss}>
        <CloseIcon />
      </button>
      <div
        className="yt-bar"
        style={{ animation: `yt-progress ${duration}ms linear forwards` }}
      />
    </div>
  );
}

/* ── Portal container (mount once in your layout) ─────────────────────────── */
export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (t: ToastData) => setToasts((prev) => [...prev, t]);
    listeners.push(handler);
    return () => {
      const i = listeners.indexOf(handler);
      if (i > -1) listeners.splice(i, 1);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{CSS}</style>
      <div className="yt-portal">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </>,
    document.body,
  );
}
