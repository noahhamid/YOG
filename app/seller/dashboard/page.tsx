"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";
import OrdersTab from "@/components/OrdersTab";
// ─── Shared order types (defined here, mirrored in OrderCard.tsx / OrdersTab.tsx) ──
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

// ─── Icons ────────────────────────────────────────────────────────────────────
interface IcoProps {
  d: string;
  size?: number;
  sw?: number;
  fill?: string;
}
type IcoPropsNoD = Omit<IcoProps, "d">;

const Ico = ({ d, size = 18, sw = 1.75, fill = "none" }: IcoProps) => (
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
const PlusIco = (p: IcoPropsNoD) => <Ico {...p} d="M12 5v14M5 12h14" />;
const EditIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  />
);
const TrashIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  />
);
const SettingsIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
  />
);
const ClockIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"
  />
);
const XCircleIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm3-13-6 6m0-6 6 6"
  />
);
const SparkleIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"
  />
);
const ArrowRightIco = (p: IcoPropsNoD) => (
  <Ico {...p} d="M5 12h14m-7-7 7 7-7 7" />
);
const PkgStatIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"
  />
);
const PauseIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M10 9v6m4-6v6M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
  />
);
const BanIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM4.93 4.93l14.14 14.14"
  />
);
const DeletedIco = (p: IcoPropsNoD) => (
  <Ico
    {...p}
    d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6"
  />
);

// ─── Animated stat icons ──────────────────────────────────────────────────────
function AnimPackage({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="sd-i-pkg"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function AnimBag({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="sd-i-bag"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function AnimCoin({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="sd-i-coin"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v1m0 8v1" />
      <path d="M9.5 9.5C9.5 8.67 10.17 8 11 8h2a1.5 1.5 0 0 1 0 3H11a1.5 1.5 0 0 0 0 3h2a1 1 0 0 1 0 2h-2" />
    </svg>
  );
}
function AnimUsers({
  size = 22,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" className="sd-i-ubb" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" className="sd-i-ubh" />
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        className="sd-i-ufb"
      />
      <circle cx="9" cy="7" r="4" className="sd-i-ufh" />
    </svg>
  );
}

// ─── Local-only types (not shared with OrdersTab) ─────────────────────────────
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  brand: string | null;
  status: string;
  createdAt: string;
  variants: Array<{
    id: string;
    size: string;
    color: string;
    quantity: number;
  }>;
  images: Array<{ id: string; url: string; position: number }>;
}
interface SellerInfo {
  id: string;
  brandName: string;
  approved: boolean;
  status: string;
  rejectionReason: string | null;
  pausedReason: string | null;
  pausedAt: string | null;
  suspendedReason: string | null;
  suspendedAt: string | null;
  deletedAt: string | null;
}
interface SellerStatusResponse {
  status: string;
  approved: boolean;
  seller?: SellerInfo;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  :root {
    --bg:#f6f5f3;--card:#fff;--text:#1a1714;--muted:#9e9890;
    --border:#e8e4de;--error:#dc2626;--hover:#f5f3f0;--divider:rgba(0,0,0,0.06);
    --success:#16a34a;--warn:#d97706;--warn-soft:#fef3c7;
  }
  *,*::before,*::after{box-sizing:border-box;}
  body{font-family:'Sora',sans-serif!important;background:var(--bg);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes spin{to{transform:rotate(360deg)}}

  @keyframes sd-pkg-drop{0%{transform:translateY(-18px) scale(0.78);}50%{transform:translateY(5px) scale(1.12);}70%{transform:translateY(-4px) scale(0.95);}85%{transform:translateY(2px) scale(1.03);}100%{transform:translateY(0) scale(1);}}
  @keyframes sd-pkg-shake{0%,100%{transform:translateX(0) rotate(0deg);}20%{transform:translateX(-3px) rotate(-8deg);}40%{transform:translateX(3px) rotate(7deg);}60%{transform:translateX(-2px) rotate(-5deg);}80%{transform:translateX(2px) rotate(4deg);}}
  .sd-i-pkg{transform-origin:center bottom;animation:sd-pkg-drop 0.65s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.05s;}
  .sd-stat:hover .sd-i-pkg{animation:sd-pkg-shake 0.5s ease-in-out infinite!important;animation-delay:0s!important;}

  @keyframes sd-bag-bounce{0%{transform:translateY(12px) scale(0.82);}50%{transform:translateY(-7px) scale(1.10);}70%{transform:translateY(3px) scale(0.96);}85%{transform:translateY(-2px) scale(1.02);}100%{transform:translateY(0) scale(1);}}
  @keyframes sd-bag-rock{0%,100%{transform:rotate(0deg);}25%{transform:rotate(-12deg);}75%{transform:rotate(12deg);}}
  .sd-i-bag{transform-origin:bottom center;animation:sd-bag-bounce 0.7s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.1s;}
  .sd-stat:hover .sd-i-bag{animation:sd-bag-rock 0.46s ease-in-out infinite!important;animation-delay:0s!important;transform-origin:bottom center;}

  @keyframes sd-coin-pop{0%{transform:scale(0);}55%{transform:scale(1.20);}75%{transform:scale(0.91);}88%{transform:scale(1.06);}100%{transform:scale(1);}}
  @keyframes sd-coin-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  .sd-i-coin{transform-origin:center;animation:sd-coin-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.15s;}
  .sd-stat:hover .sd-i-coin{animation:sd-coin-spin 0.55s linear infinite!important;animation-delay:0s!important;}

  @keyframes sd-u-left{from{transform:translateX(-11px);}to{transform:translateX(0);}}
  @keyframes sd-u-right{from{transform:translateX(11px);}to{transform:translateX(0);}}
  @keyframes sd-u-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
  .sd-i-ufb,.sd-i-ufh{animation:sd-u-left 0.38s ease both;animation-delay:0.15s;}
  .sd-i-ubb,.sd-i-ubh{animation:sd-u-right 0.38s ease both;animation-delay:0.28s;}
  .sd-stat:hover .sd-i-ufh{animation:sd-u-bob 0.5s ease-in-out infinite!important;animation-delay:0s!important;transform-origin:center;}
  .sd-stat:hover .sd-i-ubh{animation:sd-u-bob 0.5s ease-in-out 0.15s infinite!important;animation-delay:0.15s!important;transform-origin:center;}
  .sd-stat:hover .sd-i-ufb,.sd-stat:hover .sd-i-ubb{animation:none!important;transform:translateX(0);}

  .sd-page{min-height:100vh;background:var(--bg);padding-top:72px;font-family:'Sora',sans-serif;}
  .sd-wrap{max-width:1320px;margin:0 auto;padding:36px 24px 60px;}
  .sd-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:36px;flex-wrap:wrap;gap:16px;}
  .sd-header-title{font-size:28px;font-weight:800;color:var(--text);letter-spacing:-0.8px;margin:0;}
  .sd-header-sub{font-size:13px;color:var(--muted);margin:4px 0 0;}
  .sd-header-actions{display:flex;gap:10px;align-items:center;}
  .sd-btn-primary{display:flex;align-items:center;gap:7px;padding:10px 20px;background:var(--text);color:#fff;border:none;border-radius:11px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;text-decoration:none;}
  .sd-btn-primary:hover{background:#333;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.16);}
  .sd-btn-ghost{display:flex;align-items:center;gap:7px;padding:10px 18px;background:var(--card);color:var(--text);border:1.5px solid var(--border);border-radius:11px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;text-decoration:none;}
  .sd-btn-ghost:hover{border-color:var(--text);background:var(--hover);}
  .sd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:36px;}
  @media(max-width:1024px){.sd-stats{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:600px){.sd-stats{grid-template-columns:1fr;}}
  .sd-stat{background:var(--card);border-radius:16px;padding:22px 24px;border:1px solid var(--border);display:flex;align-items:center;gap:16px;cursor:default;transition:box-shadow 0.2s,transform 0.2s,border-color 0.2s;}
  .sd-stat:hover{box-shadow:0 6px 22px rgba(0,0,0,0.08);transform:translateY(-2px);border-color:rgba(0,0,0,0.1);}
  .sd-stat-icon{width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:visible;}
  .sd-stat-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.6px;margin:0 0 4px;}
  .sd-stat-value{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-0.8px;margin:0;}
  .sd-tabs{display:flex;gap:2px;border-bottom:1.5px solid var(--border);margin-bottom:28px;}
  .sd-tab{padding:12px 20px;font-size:13px;font-weight:600;color:var(--muted);background:none;border:none;cursor:pointer;position:relative;font-family:'Sora',sans-serif;transition:color 0.15s;white-space:nowrap;}
  .sd-tab:hover{color:var(--text);}
  .sd-tab.active{color:var(--text);}
  .sd-tab.active::after{content:'';position:absolute;bottom:-1.5px;left:0;right:0;height:2px;background:var(--text);border-radius:2px 2px 0 0;}
  .sd-tab-count{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:6px;font-size:10px;font-weight:700;background:var(--hover);color:var(--muted);margin-left:6px;}
  .sd-tab.active .sd-tab-count{background:var(--text);color:#fff;}
  .sd-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;}
  .sd-toolbar-meta{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
  .sd-meta-chip{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--muted);padding:5px 10px;background:var(--card);border:1px solid var(--border);border-radius:8px;}
  .sd-meta-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .sd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
  @media(max-width:1200px){.sd-grid{grid-template-columns:repeat(3,1fr);}}
  @media(max-width:860px){.sd-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:540px){.sd-grid{grid-template-columns:1fr;}}
  .sd-product-card{background:var(--card);border-radius:16px;overflow:hidden;border:1px solid var(--border);transition:all 0.2s;animation:fadeUp 0.35s ease both;}
  .sd-product-card:hover{box-shadow:0 8px 28px rgba(0,0,0,0.09);transform:translateY(-2px);}
  .sd-product-img{position:relative;aspect-ratio:1;background:var(--hover);overflow:hidden;}
  .sd-product-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s;}
  .sd-product-card:hover .sd-product-img img{transform:scale(1.04);}
  .sd-badge{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;align-items:flex-end;gap:5px;}
  .sd-badge-pill{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;backdrop-filter:blur(4px);}
  .sd-product-body{padding:16px;}
  .sd-product-name{font-size:14px;font-weight:700;color:var(--text);margin:0 0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.2px;}
  .sd-product-desc{font-size:12px;color:var(--muted);margin:0 0 14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.5;}
  .sd-product-price-row{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:14px;}
  .sd-product-price{font-size:18px;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
  .sd-product-compare{font-size:11px;color:var(--muted);text-decoration:line-through;margin-top:1px;}
  .sd-product-stock-label{font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;text-align:right;}
  .sd-product-stock-val{font-size:15px;font-weight:800;text-align:right;}
  .sd-product-actions{display:flex;gap:8px;}
  .sd-action-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all 0.15s;font-family:'Sora',sans-serif;}
  .sd-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;background:var(--card);border-radius:20px;border:1.5px dashed var(--border);text-align:center;}
  .sd-empty-icon{width:72px;height:72px;background:var(--hover);border-radius:20px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;color:var(--muted);}
  .sd-empty-title{font-size:18px;font-weight:700;color:var(--text);margin:0 0 8px;}
  .sd-empty-sub{font-size:13px;color:var(--muted);margin:0 0 24px;}
  .sd-loader{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);}
  .sd-spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--text);border-radius:50%;animation:spin 0.7s linear infinite;}
  .sd-status-page{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:24px;}
  .sd-status-card{background:var(--card);border-radius:24px;padding:48px 40px;max-width:460px;width:100%;text-align:center;border:1px solid var(--border);box-shadow:0 16px 48px rgba(0,0,0,0.08);}
  .sd-status-icon{width:72px;height:72px;border-radius:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
  .sd-status-title{font-size:22px;font-weight:800;color:var(--text);margin:0 0 12px;letter-spacing:-0.5px;}
  .sd-status-body{font-size:13px;color:var(--muted);line-height:1.7;margin:0 0 20px;}
  .sd-status-box{border-radius:12px;padding:14px 16px;text-align:left;margin-bottom:24px;}
  .sd-status-date{font-size:11px;color:var(--muted);margin-top:16px;}
`;

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onEdit,
  onDelete,
  delay = 0,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  delay?: number;
}) {
  const stock = product.variants.reduce((s, v) => s + v.quantity, 0);
  const oos = stock === 0;
  return (
    <div className="sd-product-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="sd-product-img">
        <img
          src={product.images[0]?.url || "https://via.placeholder.com/400"}
          alt={product.title}
          style={{ opacity: oos ? 0.65 : 1 }}
        />
        <div className="sd-badge">
          {oos && (
            <span
              className="sd-badge-pill"
              style={{ background: "rgba(220,38,38,0.9)", color: "#fff" }}
            >
              Out of stock
            </span>
          )}
          <span
            className="sd-badge-pill"
            style={{
              background:
                product.status === "PUBLISHED"
                  ? "rgba(22,163,74,0.9)"
                  : "rgba(255,255,255,0.85)",
              color: product.status === "PUBLISHED" ? "#fff" : "var(--text)",
              border:
                product.status !== "PUBLISHED"
                  ? "1px solid var(--border)"
                  : "none",
            }}
          >
            {product.status === "PUBLISHED" ? "Live" : "Draft"}
          </span>
        </div>
      </div>
      <div className="sd-product-body">
        <p className="sd-product-name">{product.title}</p>
        <p className="sd-product-desc">{product.description}</p>
        <div className="sd-product-price-row">
          <div>
            <p className="sd-product-price">
              {product.price.toLocaleString()} ETB
            </p>
            {product.compareAtPrice && (
              <p className="sd-product-compare">
                {product.compareAtPrice.toLocaleString()} ETB
              </p>
            )}
          </div>
          <div>
            <p className="sd-product-stock-label">Stock</p>
            <p
              className="sd-product-stock-val"
              style={{ color: oos ? "var(--error)" : "var(--text)" }}
            >
              {stock}
            </p>
          </div>
        </div>
        <div className="sd-product-actions">
          <button
            className="sd-action-btn"
            onClick={() => onEdit(product)}
            style={{ background: "var(--hover)", color: "var(--text)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ebebeb")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--hover)")
            }
          >
            <EditIco size={14} /> Edit
          </button>
          <button
            className="sd-action-btn"
            onClick={() => onDelete(product.id)}
            style={{ background: "#fef2f2", color: "var(--error)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
          >
            <TrashIco size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status gate screens ──────────────────────────────────────────────────────
function StatusGate({ sellerStatus }: { sellerStatus: SellerStatusResponse }) {
  const router = useRouter();
  const seller = sellerStatus.seller;
  const status = sellerStatus.status?.toLowerCase() ?? "";

  const fmt = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  if (status === "pending") {
    return (
      <div className="sd-status-page">
        <div className="sd-status-card">
          <div
            className="sd-status-icon"
            style={{ background: "var(--warn-soft)", color: "var(--warn)" }}
          >
            <ClockIco size={32} />
          </div>
          <h1 className="sd-status-title">Application Under Review</h1>
          <p className="sd-status-body">
            Thank you for applying! Our team is reviewing your application. This
            typically takes 2–3 business days.
          </p>
          <div
            className="sd-status-box"
            style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
          >
            <p style={{ fontSize: 12, color: "#1d4ed8", margin: 0 }}>
              We&apos;ll notify you once your application has been reviewed.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className="sd-status-page">
        <div className="sd-status-card">
          <div
            className="sd-status-icon"
            style={{ background: "#fef2f2", color: "var(--error)" }}
          >
            <XCircleIco size={32} />
          </div>
          <h1 className="sd-status-title">Application Not Approved</h1>
          <p className="sd-status-body">
            Unfortunately your seller application was not approved at this time.
          </p>
          <div
            className="sd-status-box"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#991b1b",
                marginBottom: 4,
              }}
            >
              Reason
            </p>
            <p style={{ fontSize: 13, color: "#b91c1c", margin: 0 }}>
              {seller?.rejectionReason || "No reason provided"}
            </p>
          </div>
          <button
            className="sd-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => router.push("/seller/apply")}
          >
            Reapply Now <ArrowRightIco size={15} />
          </button>
        </div>
      </div>
    );
  }
  if (status === "paused") {
    return (
      <div className="sd-status-page">
        <div className="sd-status-card">
          <div
            className="sd-status-icon"
            style={{ background: "#fef3c7", color: "#d97706" }}
          >
            <PauseIco size={32} />
          </div>
          <h1 className="sd-status-title">Your Store is Paused</h1>
          <p className="sd-status-body">
            Your seller account has been temporarily paused. Your products are
            not visible to customers during this time.
          </p>
          <div
            className="sd-status-box"
            style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#92400e",
                marginBottom: 6,
              }}
            >
              Reason for pause
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#b45309",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {seller?.pausedReason || "No reason provided"}
            </p>
          </div>
          <div
            className="sd-status-box"
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              marginBottom: 0,
            }}
          >
            <p style={{ fontSize: 12, color: "#15803d", margin: 0 }}>
              This is temporary. Please contact our support team to resolve the
              issue.
            </p>
          </div>
          {seller?.pausedAt && (
            <p className="sd-status-date">Paused on {fmt(seller.pausedAt)}</p>
          )}
        </div>
      </div>
    );
  }
  if (status === "suspended") {
    return (
      <div className="sd-status-page">
        <div className="sd-status-card">
          <div
            className="sd-status-icon"
            style={{ background: "#fef2f2", color: "#dc2626" }}
          >
            <BanIco size={32} />
          </div>
          <h1 className="sd-status-title">Your Store is Suspended</h1>
          <p className="sd-status-body">
            Your seller account has been suspended. All your products have been
            removed from the marketplace.
          </p>
          <div
            className="sd-status-box"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#991b1b",
                marginBottom: 6,
              }}
            >
              Reason for suspension
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#b91c1c",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {seller?.suspendedReason || "No reason provided"}
            </p>
          </div>
          <div
            className="sd-status-box"
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              marginBottom: 0,
            }}
          >
            <p style={{ fontSize: 12, color: "#1d4ed8", margin: 0 }}>
              If you believe this is a mistake, please contact our support team.
            </p>
          </div>
          {seller?.suspendedAt && (
            <p className="sd-status-date">
              Suspended on {fmt(seller.suspendedAt)}
            </p>
          )}
        </div>
      </div>
    );
  }
  if (status === "deleted") {
    return (
      <div className="sd-status-page">
        <div className="sd-status-card">
          <div
            className="sd-status-icon"
            style={{ background: "#fef2f2", color: "#dc2626" }}
          >
            <DeletedIco size={32} />
          </div>
          <h1 className="sd-status-title">Account Deleted</h1>
          <p className="sd-status-body">
            Your seller account has been permanently deleted. All products and
            order history have been removed.
          </p>
          <div
            className="sd-status-box"
            style={{
              background: "#f9fafb",
              border: "1px solid var(--border)",
              marginBottom: 0,
            }}
          >
            <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
              If you think this was a mistake, please reach out to our support
              team.
            </p>
          </div>
          {seller?.deletedAt && (
            <p className="sd-status-date">Deleted on {fmt(seller.deletedAt)}</p>
          )}
        </div>
      </div>
    );
  }
  return null;
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    role: string;
    id: string;
  } | null>(null);
  const [sellerStatus, setSellerStatus] = useState<SellerStatusResponse | null>(
    null,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersCache, setOrdersCache] = useState<OrdersCache>({
    all: [],
    pending: [],
    confirmed: [],
    shipped: [],
    delivered: [],
    timestamp: 0,
  });
  const [orderStats, setOrderStats] = useState<{
    total?: number;
    revenue?: number;
    pending?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading || !user) return;
    (async () => {
      try {
        const u = localStorage.getItem("yog_user") || "";
        const [all, p, c, s, d] = await Promise.all([
          fetch("/api/seller/orders", { headers: { "x-user-data": u } }).then(
            (r) => r.json(),
          ),
          fetch("/api/seller/orders?status=pending", {
            headers: { "x-user-data": u },
          }).then((r) => r.json()),
          fetch("/api/seller/orders?status=confirmed", {
            headers: { "x-user-data": u },
          }).then((r) => r.json()),
          fetch("/api/seller/orders?status=shipped", {
            headers: { "x-user-data": u },
          }).then((r) => r.json()),
          fetch("/api/seller/orders?status=delivered", {
            headers: { "x-user-data": u },
          }).then((r) => r.json()),
        ]);
        setOrdersCache({
          all: (all.orders || []) as Order[],
          pending: (p.orders || []) as Order[],
          confirmed: (c.orders || []) as Order[],
          shipped: (s.orders || []) as Order[],
          delivered: (d.orders || []) as Order[],
          timestamp: Date.now(),
        });
        setOrderStats(all.stats);
      } catch {}
    })();
  }, [isLoading, user]);

  const checkAuth = async () => {
    const u = localStorage.getItem("yog_user");
    if (!u) {
      router.push("/login");
      return;
    }
    const data = JSON.parse(u);
    setUser(data);
    if (data.role !== "SELLER" && data.role !== "ADMIN") {
      router.push("/seller/apply");
      return;
    }
    if (data.role === "ADMIN") {
      setIsLoading(false);
      await fetchProducts(u);
      return;
    }
    await checkSellerStatus(u);
    await fetchProducts(u);
  };

  const checkSellerStatus = async (u: string) => {
    try {
      const r = await fetch("/api/seller/status", {
        headers: { "x-user-data": u },
      });
      setSellerStatus(await r.json());
    } catch {}
    setIsLoading(false);
  };

  const fetchProducts = async (u?: string) => {
    try {
      const r = await fetch("/api/products", {
        headers: { "x-user-data": u || localStorage.getItem("yog_user") || "" },
      });
      const d = await r.json();
      if (r.ok) setProducts(d.products);
    } catch {}
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      const u = localStorage.getItem("yog_user") || "";
      const r = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "x-user-data": u },
      });
      if (r.ok) {
        alert("Product deleted!");
        fetchProducts();
      } else {
        const d = await r.json();
        alert(d.error || "Failed");
      }
    } catch {
      alert("Failed to delete");
    }
  };

  const refreshOrdersCache = async () => {
    const u = localStorage.getItem("yog_user") || "";
    const [all, p, c, s, d] = await Promise.all([
      fetch("/api/seller/orders", { headers: { "x-user-data": u } }).then((r) =>
        r.json(),
      ),
      fetch("/api/seller/orders?status=pending", {
        headers: { "x-user-data": u },
      }).then((r) => r.json()),
      fetch("/api/seller/orders?status=confirmed", {
        headers: { "x-user-data": u },
      }).then((r) => r.json()),
      fetch("/api/seller/orders?status=shipped", {
        headers: { "x-user-data": u },
      }).then((r) => r.json()),
      fetch("/api/seller/orders?status=delivered", {
        headers: { "x-user-data": u },
      }).then((r) => r.json()),
    ]);
    setOrdersCache({
      all: (all.orders || []) as Order[],
      pending: (p.orders || []) as Order[],
      confirmed: (c.orders || []) as Order[],
      shipped: (s.orders || []) as Order[],
      delivered: (d.orders || []) as Order[],
      timestamp: Date.now(),
    });
    setOrderStats(all.stats);
  };

  if (isLoading)
    return (
      <>
        <style>{CSS}</style>
        <div className="sd-loader">
          <div className="sd-spinner" />
        </div>
      </>
    );

  const blockedStatuses = [
    "PENDING",
    "REJECTED",
    "PAUSED",
    "SUSPENDED",
    "DELETED",
  ];
  if (
    sellerStatus &&
    blockedStatuses.includes(sellerStatus.status?.toUpperCase())
  ) {
    return (
      <>
        <style>{CSS}</style>
        <Navbar />
        <StatusGate sellerStatus={sellerStatus} />
      </>
    );
  }

  const totalStock = products.reduce(
    (s, p) => s + p.variants.reduce((vs, v) => vs + v.quantity, 0),
    0,
  );
  const publishedCount = products.filter(
    (p) => p.status === "PUBLISHED",
  ).length;
  const statCards = [
    {
      icon: <AnimPackage size={22} color="#2563eb" />,
      label: "Total Products",
      value: products.length,
      iconBg: "#eff6ff",
      delay: 0,
    },
    {
      icon: <AnimBag size={22} color="#16a34a" />,
      label: "Total Orders",
      value: orderStats?.total || 0,
      iconBg: "#f0fdf4",
      delay: 80,
    },
    {
      icon: <AnimCoin size={22} color="#7c3aed" />,
      label: "Revenue (ETB)",
      value: (orderStats?.revenue || 0).toLocaleString(),
      iconBg: "#faf5ff",
      delay: 160,
    },
    {
      icon: <AnimUsers size={22} color="#d97706" />,
      label: "Pending Orders",
      value: orderStats?.pending || 0,
      iconBg: "#fff7ed",
      delay: 240,
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <div className="sd-page">
        <div className="sd-wrap">
          <div className="sd-header">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <SparkleIco size={20} />
                <h1 className="sd-header-title">Seller Dashboard</h1>
              </div>
              <p className="sd-header-sub">
                Welcome back,{" "}
                <strong style={{ color: "var(--text)" }}>{user?.name}</strong> —
                here&apos;s your store overview
              </p>
            </div>
            <div className="sd-header-actions">
              <Link href="/seller/profile" className="sd-btn-ghost">
                <SettingsIco size={15} /> Store Profile
              </Link>
              <button
                className="sd-btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <PlusIco size={15} /> Add Product
              </button>
            </div>
          </div>

          <div className="sd-stats">
            {statCards.map((s) => (
              <motion.div
                key={s.label}
                className="sd-stat"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: s.delay / 1000,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="sd-stat-icon" style={{ background: s.iconBg }}>
                  {s.icon}
                </div>
                <div>
                  <p className="sd-stat-label">{s.label}</p>
                  <p className="sd-stat-value">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="sd-tabs">
            <button
              className={`sd-tab ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Products <span className="sd-tab-count">{products.length}</span>
            </button>
            <button
              className={`sd-tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders{" "}
              <span className="sd-tab-count">{orderStats?.total || 0}</span>
            </button>
          </div>

          {activeTab === "products" && (
            <>
              <div className="sd-toolbar">
                <div className="sd-toolbar-meta">
                  <div className="sd-meta-chip">
                    <span
                      className="sd-meta-dot"
                      style={{ background: "#22c55e" }}
                    />
                    {publishedCount} Published
                  </div>
                  <div className="sd-meta-chip">
                    <span
                      className="sd-meta-dot"
                      style={{ background: "var(--muted)" }}
                    />
                    {products.length - publishedCount} Drafts
                  </div>
                  <div className="sd-meta-chip">
                    <PkgStatIco size={12} />
                    &nbsp;{totalStock} in stock
                  </div>
                </div>
              </div>
              {products.length > 0 ? (
                <div className="sd-grid">
                  {products.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      delay={i * 40}
                      onEdit={(prod) => setEditingProduct(prod)}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="sd-empty">
                  <div className="sd-empty-icon">
                    <PkgStatIco size={32} />
                  </div>
                  <h3 className="sd-empty-title">No products yet</h3>
                  <p className="sd-empty-sub">
                    Start building your store by listing your first item
                  </p>
                  <button
                    className="sd-btn-primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    <PlusIco size={15} /> Add Your First Product
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "orders" && (
            <OrdersTab
              isActive={activeTab === "orders"}
              ordersCache={ordersCache}
              onRefreshCache={refreshOrdersCache}
            />
          )}
        </div>
      </div>

      {showAddModal && (
        <AddProductForm
          onClose={() => setShowAddModal(false)}
          onSubmit={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
      )}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </>
  );
}
