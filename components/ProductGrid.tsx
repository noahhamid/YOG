"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import FilterSidebar from "./FilterSidebar";

interface ProductsCache {
  all: any[];
  men: any[];
  women: any[];
  unisex: any[];
  onSale: any[];
  newArrivals: any[];
  trending: any[];
  timestamp: number;
  productCount: number;
}
interface ProductGridProps {
  initialCategory?: string;
  showTrendingOnly?: boolean;
}

const CACHE_KEY = "yog_products_cache";
const CACHE_DURATION = 5 * 60 * 1000;
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg:#f6f5f3; --card:#fff; --text:#1a1714; --muted:#9e9890;
  --border:#e8e4de; --hover:#f5f3f0;
}

.pg-section {
  width:100%; min-height:100vh;
  background:var(--bg); font-family:'Sora',sans-serif;
  padding:28px 24px 80px;
}
@media(max-width:768px){
  .pg-section { padding:0 0 80px; }
}

.pg-inner { max-width:1440px; margin:0 auto; }

/* ── Mobile sticky search bar ── */
.pg-mobile-bar {
  display:none;
  position:sticky; top:64px; z-index:30;
  background:var(--bg); border-bottom:1px solid var(--border);
  padding:10px 14px; gap:8px;
  align-items:center;
}
@media(max-width:768px){ .pg-mobile-bar { display:flex; } }

.pg-mob-search {
  flex:1; position:relative;
}
.pg-mob-search-input {
  width:100%; padding:9px 14px 9px 36px;
  border:1.5px solid var(--border); border-radius:10px;
  background:var(--card); font-family:'Sora',sans-serif;
  font-size:13px; color:var(--text); outline:none;
  transition:border-color 0.15s; box-sizing:border-box;
}
.pg-mob-search-input:focus { border-color:var(--text); }
.pg-mob-search-input::placeholder { color:#c4bfb8; }
.pg-mob-search-ico {
  position:absolute; left:10px; top:50%; transform:translateY(-50%);
  color:var(--muted); pointer-events:none;
}
.pg-mob-search-clear {
  position:absolute; right:9px; top:50%; transform:translateY(-50%);
  width:18px; height:18px; border-radius:50%; border:none;
  background:#d1cdc7; color:#fff; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
}

.pg-mob-filter-btn {
  display:flex; align-items:center; gap:6px;
  padding:9px 13px; border:1.5px solid var(--border);
  border-radius:10px; background:var(--card);
  font-family:'Sora',sans-serif; font-size:12px; font-weight:700;
  color:var(--text); cursor:pointer; white-space:nowrap; flex-shrink:0;
  transition:all 0.15s;
}
.pg-mob-filter-btn.has-filters { background:var(--text); color:#fff; border-color:var(--text); }

/* ── Filter drawer (mobile) ── */
@keyframes pg-drawer-in { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes pg-backdrop-in { from{opacity:0} to{opacity:1} }
.pg-drawer-backdrop {
  position:fixed; inset:0; background:rgba(0,0,0,0.4);
  z-index:100; backdrop-filter:blur(2px);
  animation:pg-backdrop-in 0.2s ease;
}
.pg-drawer {
  position:fixed; bottom:0; left:0; right:0; z-index:101;
  background:var(--bg); border-radius:20px 20px 0 0;
  max-height:88vh; overflow-y:auto;
  animation:pg-drawer-in 0.32s cubic-bezier(0.22,1,0.36,1);
  padding-bottom:env(safe-area-inset-bottom);
}
.pg-drawer-handle {
  display:flex; justify-content:center; padding:12px 0 4px;
}
.pg-drawer-handle span {
  width:36px; height:4px; border-radius:2px; background:#d1cdc7;
}
.pg-drawer-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:0 16px 12px; border-bottom:1px solid var(--border);
}
.pg-drawer-title { font-size:15px; font-weight:800; color:var(--text); }
.pg-drawer-close {
  width:32px; height:32px; border-radius:8px; border:1.5px solid var(--border);
  background:var(--card); cursor:pointer; display:flex; align-items:center;
  justify-content:center; color:var(--muted);
}

/* ── Desktop layout ── */
.pg-layout {
  display:flex; gap:22px; align-items:flex-start;
}
.pg-sidebar-col {
  flex-shrink:0; align-self:flex-start;
  position:sticky; top:70px; width:232px;
}
@media(max-width:768px){
  .pg-sidebar-col { display:none; }
}
.pg-main { flex:1; min-width:0; }
@media(max-width:768px){
  .pg-main { padding:14px 14px 0; }
}

/* ── Toolbar ── */
.pg-toolbar {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:18px; flex-wrap:wrap; gap:10px;
}
.pg-filter-chip {
  display:inline-flex; align-items:center; gap:5px;
  padding:4px 11px; background:var(--text); color:#fff;
  border-radius:20px; font-size:11px; font-weight:700;
  cursor:pointer; border:none; font-family:'Sora',sans-serif;
  transition:background 0.15s;
}
.pg-filter-chip:hover { background:#333; }

/* ── Custom sort dropdown ── */
.pg-sort-wrap { position:relative; }
.pg-sort-btn {
  display:flex; align-items:center; gap:8px;
  padding:9px 14px; border:1.5px solid var(--border);
  border-radius:10px; background:var(--card);
  font-family:'Sora',sans-serif; font-size:12px; font-weight:600;
  color:var(--text); cursor:pointer; transition:all 0.15s; white-space:nowrap;
}
.pg-sort-btn:hover { border-color:var(--text); }
.pg-sort-btn.open { border-color:var(--text); box-shadow:0 0 0 3px rgba(26,23,20,0.06); }
.pg-sort-chevron { color:var(--muted); transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1); flex-shrink:0; }
.pg-sort-chevron.open { transform:rotate(180deg); }
.pg-sort-label { font-size:10px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.6px; }
@keyframes pg-sort-in {
  from { opacity:0; transform:translateY(-8px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
.pg-sort-menu {
  position:absolute; top:calc(100% + 6px); left:0; min-width:180px;
  background:var(--card); border:1.5px solid var(--border);
  border-radius:12px; box-shadow:0 12px 36px rgba(0,0,0,0.10);
  overflow:hidden; z-index:50;
  animation:pg-sort-in 0.18s cubic-bezier(0.22,1,0.36,1);
}
.pg-sort-option {
  width:100%; padding:10px 14px; border:none; background:transparent;
  text-align:left; font-family:'Sora',sans-serif; font-size:13px;
  font-weight:500; color:var(--text); cursor:pointer;
  display:flex; align-items:center; justify-content:space-between;
  transition:background 0.12s;
}
.pg-sort-option:hover { background:var(--hover); }
.pg-sort-option.active { font-weight:700; background:var(--hover); }
.pg-sort-check { width:16px; height:16px; border-radius:5px; background:var(--text); display:flex; align-items:center; justify-content:center; }

/* ── Grid ── */
.pg-grid {
  display:grid; grid-template-columns:repeat(4,1fr); gap:16px;
}
@media(max-width:1300px){ .pg-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:900px)  { .pg-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:768px)  { .pg-grid { grid-template-columns:repeat(2,1fr); gap:10px; } }
@media(max-width:380px)  { .pg-grid { grid-template-columns:repeat(2,1fr); gap:8px; } }

/* ── Cards ── */
.pg-card {
  background:var(--card); border-radius:14px; overflow:hidden;
  border:1px solid var(--border); display:block; text-decoration:none;
  cursor:pointer; transition:box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  will-change:transform;
}
.pg-card:not(.oos):hover {
  box-shadow:0 12px 36px rgba(0,0,0,0.10);
  transform:translateY(-3px); border-color:rgba(0,0,0,0.1);
}
.pg-img-wrap {
  position:relative; aspect-ratio:4/5;
  overflow:hidden; background:var(--hover);
}
.pg-img {
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; transition:opacity 0.45s ease, transform 0.45s ease;
}
.pg-img.pri { opacity:1; }
.pg-img.sec { opacity:0; }
.pg-card:not(.oos):hover .pg-img.pri.alt { opacity:0; }
.pg-card:not(.oos):hover .pg-img.sec    { opacity:1; }
.pg-card:not(.oos):hover .pg-img.pri    { transform:scale(1.04); }
.pg-card:not(.oos):hover .pg-img.sec    { transform:scale(1.04); }
.pg-img.dim { opacity:0.45; filter:grayscale(0.4); }
.pg-hover-layer {
  position:absolute; inset:0; z-index:4;
  background:linear-gradient(to top, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.06) 50%, transparent 72%);
  opacity:0; transition:opacity 0.22s;
}
.pg-card:not(.oos):hover .pg-hover-layer { opacity:1; }
.pg-cart-btn {
  position:absolute; bottom:12px; left:12px; right:12px; z-index:5;
  padding:10px 0; border-radius:9px; border:none;
  background:#fff; color:var(--text);
  font-size:12px; font-weight:700; font-family:'Sora',sans-serif;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;
  transform:translateY(10px); opacity:0;
  transition:opacity 0.2s, transform 0.2s, background 0.15s;
}
.pg-card:not(.oos):hover .pg-cart-btn { opacity:1; transform:translateY(0); }
.pg-cart-btn:hover { background:#f0ede8; }
.pg-wish-btn {
  position:absolute; top:10px; right:10px; z-index:5;
  width:30px; height:30px; border-radius:8px; border:none;
  background:rgba(255,255,255,0.9); backdrop-filter:blur(6px);
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  color:var(--text); transition:all 0.18s;
  opacity:0; transform:translateX(6px);
}
.pg-card:not(.oos):hover .pg-wish-btn { opacity:1; transform:translateX(0); }
.pg-wish-btn:hover { background:#fff; color:#ef4444; }
.pg-badge {
  position:absolute; z-index:6; padding:3px 9px; border-radius:20px; pointer-events:none;
  font-size:10px; font-weight:800; letter-spacing:0.2px;
}
.pg-badge.tl { top:10px; left:10px; }
.pg-badge.sale { background:#dc2626; color:#fff; }
.pg-badge.new  { background:#16a34a; color:#fff; }
.pg-badge.oos-center {
  top:50%; left:50%; transform:translate(-50%,-50%);
  background:rgba(26,23,20,0.72); color:#fff;
  backdrop-filter:blur(4px); border-radius:10px; font-size:11px; padding:5px 13px;
}
.pg-info { padding:10px 11px 12px; display:flex; flex-direction:column; gap:0; }
@media(max-width:768px){ .pg-info { padding:8px 10px 10px; } }
.pg-seller {
  font-size:10px; font-weight:600; color:var(--muted);
  text-transform:uppercase; letter-spacing:0.5px; margin:0 0 3px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.pg-title {
  font-size:12px; font-weight:700; color:var(--text);
  margin:0 0 8px; line-height:1.3;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
@media(max-width:400px){ .pg-title { font-size:11px; } }
.pg-colors { display:flex; align-items:center; gap:4px; margin-bottom:8px; flex-wrap:wrap; }
.pg-color-dot { width:11px; height:11px; border-radius:50%; border:1.5px solid rgba(0,0,0,0.1); flex-shrink:0; }
.pg-color-more { font-size:10px; color:var(--muted); font-weight:600; }
.pg-info-divider { height:1px; background:var(--border); margin:0 0 8px; }
.pg-bottom { display:flex; align-items:flex-end; justify-content:space-between; gap:4px; }
.pg-price-main { font-size:14px; font-weight:800; color:var(--text); letter-spacing:-0.5px; line-height:1.1; }
@media(max-width:400px){ .pg-price-main { font-size:13px; } }
.pg-price-etb { font-size:10px; font-weight:500; color:var(--muted); margin-left:2px; }
.pg-compare { font-size:10px; color:#c4bfb8; text-decoration:line-through; display:block; margin-top:1px; }
.pg-sizes { display:flex; gap:3px; flex-wrap:wrap; justify-content:flex-end; }
.pg-size {
  padding:2px 5px; border-radius:5px; border:1px solid var(--border);
  font-size:8px; font-weight:700; color:var(--muted); letter-spacing:0.2px;
  transition:border-color 0.15s;
}
.pg-card:hover .pg-size { border-color:#c4bfb8; }

@keyframes pg-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
.pg-skel {
  border-radius:14px; overflow:hidden; border:1px solid var(--border);
  background:linear-gradient(90deg,#ede9e4 25%,#e4ded8 50%,#ede9e4 75%);
  background-size:1200px 100%; animation:pg-shimmer 1.8s ease-in-out infinite;
}
.pg-skel-img { aspect-ratio:4/5; width:100%; }
.pg-skel-body { padding:10px 11px 12px; display:flex; flex-direction:column; gap:8px; }
.pg-skel-line { border-radius:5px; background:rgba(0,0,0,0.07); }

.pg-empty {
  display:flex; flex-direction:column; align-items:center;
  padding:80px 24px; background:var(--card); border-radius:18px;
  border:1.5px dashed var(--border); text-align:center;
}
.pg-empty-ico { width:60px;height:60px;border-radius:16px;background:var(--hover);display:flex;align-items:center;justify-content:center;color:var(--muted);margin-bottom:14px; }
.pg-empty-title { font-size:16px;font-weight:700;color:var(--text);margin:0 0 6px; }
.pg-empty-sub   { font-size:13px;color:var(--muted);margin:0 0 20px; }
.pg-empty-btn   { padding:10px 22px;background:var(--text);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:background 0.15s; }
.pg-empty-btn:hover { background:#333; }
`;

// ── Icons ──────────────────────────────────────────────────────────────────
const CartIco = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const HeartIco = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const XIco = () => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const SearchIco = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ChevIco = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CheckIco = () => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const FilterIco = () => (
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
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "name", label: "Name: A–Z" },
];

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((o) => o.value === value);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  return (
    <div ref={ref} className="pg-sort-wrap">
      <button
        className={`pg-sort-btn${open ? " open" : ""}`}
        onClick={() => setOpen((p) => !p)}
      >
        <span className="pg-sort-label">Sort</span>
        <span style={{ fontWeight: 700 }}>{current?.label}</span>
        <span className={`pg-sort-chevron${open ? " open" : ""}`}>
          <ChevIco />
        </span>
      </button>
      {open && (
        <div className="pg-sort-menu">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`pg-sort-option${value === opt.value ? " active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
              {value === opt.value && (
                <span className="pg-sort-check">
                  <CheckIco />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="pg-skel">
      <div className="pg-skel-img" />
      <div className="pg-skel-body">
        <div className="pg-skel-line" style={{ height: 9, width: "40%" }} />
        <div className="pg-skel-line" style={{ height: 13, width: "80%" }} />
        <div className="pg-skel-line" style={{ height: 11, width: "60%" }} />
        <div className="pg-skel-line" style={{ height: 1, margin: "2px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="pg-skel-line" style={{ height: 15, width: "38%" }} />
          <div className="pg-skel-line" style={{ height: 14, width: "30%" }} />
        </div>
      </div>
    </div>
  );
}

const COLOR_HEX: Record<string, string> = {
  black: "#1a1714",
  white: "#f8f8f8",
  gray: "#9ca3af",
  grey: "#9ca3af",
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#10b981",
  yellow: "#f59e0b",
  orange: "#f97316",
  purple: "#8b5cf6",
  pink: "#ec4899",
  brown: "#a16207",
  khaki: "#c4b5a0",
  navy: "#1e3a5f",
  beige: "#e8dcc8",
  cream: "#fef3c7",
};
function colorDot(colorStr: string) {
  const key = colorStr.toLowerCase().split(" ").pop() || "";
  return COLOR_HEX[key] || COLOR_HEX[colorStr.toLowerCase()] || "#e8e4de";
}

function ProductCard({ product, index, isVisible }: any) {
  const { addToCart } = useCart();
  const allImages = product.allImages || [];
  const primary = allImages[0] || product.image || "";
  const secondary = allImages[1] || "";
  const hasAlt = !!(secondary && secondary !== primary);
  const isOOS = !product.stock || product.stock === 0;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : 0;
  const uniqueColors = [...new Set<string>(product.colors || [])];

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: primary,
      size: product.sizes?.[0] || "M",
      color: product.colors?.[0] || "black",
      quantity: 1,
      maxStock: product.stock || 10,
      sellerId: product.seller?.id || "unknown",
      sellerName: product.seller?.name || "Unknown",
    });
    alert("✅ Added to cart!");
  };

  return (
    <a
      href={`/product/${product.id}`}
      className={`pg-card${isOOS ? " oos" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.4s ease ${index * 0.035}s, transform 0.4s ease ${index * 0.035}s`,
      }}
    >
      <div className="pg-img-wrap">
        <img
          src={primary}
          alt={product.title}
          loading="lazy"
          className={`pg-img pri${hasAlt ? " alt" : ""}${isOOS ? " dim" : ""}`}
        />
        {hasAlt && (
          <img src={secondary} alt="" loading="lazy" className="pg-img sec" />
        )}
        {!isOOS && discount > 0 && (
          <span className="pg-badge tl sale">−{discount}%</span>
        )}
        {!isOOS && product.newArrival && !discount && (
          <span className="pg-badge tl new">New</span>
        )}
        {isOOS && <span className="pg-badge oos-center">Out of stock</span>}
        {!isOOS && (
          <>
            <div className="pg-hover-layer" />
            <button className="pg-cart-btn" onClick={handleCart}>
              <CartIco /> Add to cart
            </button>
            <button
              className="pg-wish-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert("Wishlist coming soon!");
              }}
            >
              <HeartIco />
            </button>
          </>
        )}
      </div>
      <div className="pg-info">
        {product.seller?.name && (
          <p className="pg-seller">{product.seller.name}</p>
        )}
        <p className="pg-title">{product.title}</p>
        {uniqueColors.length > 0 && (
          <div className="pg-colors">
            {uniqueColors.slice(0, 5).map((c, i) => (
              <span
                key={i}
                className="pg-color-dot"
                style={{ background: colorDot(c) }}
                title={c}
              />
            ))}
            {uniqueColors.length > 5 && (
              <span className="pg-color-more">+{uniqueColors.length - 5}</span>
            )}
          </div>
        )}
        <div className="pg-info-divider" />
        <div className="pg-bottom">
          <div>
            <p className="pg-price-main">
              {product.price.toLocaleString()}
              <span className="pg-price-etb">ETB</span>
            </p>
            {discount > 0 && (
              <span className="pg-compare">
                {product.compareAtPrice.toLocaleString()} ETB
              </span>
            )}
          </div>
          {!isOOS && product.sizes?.length > 0 && (
            <div className="pg-sizes">
              {product.sizes.slice(0, 3).map((s: string) => (
                <span key={s} className="pg-size">
                  {s}
                </span>
              ))}
              {product.sizes.length > 3 && <span className="pg-size">…</span>}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

export default function ProductGrid({
  initialCategory = "all",
  showTrendingOnly = false,
}: ProductGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedClothingTypes, setSelectedClothingTypes] = useState<string[]>(
    [],
  );
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [productsCache, setProductsCache] = useState<ProductsCache>({
    all: [],
    men: [],
    women: [],
    unisex: [],
    onSale: [],
    newArrivals: [],
    trending: [],
    timestamp: 0,
    productCount: 0,
  });
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const hasFetchedRef = useRef(false);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    clothingType: true,
    occasion: true,
    price: true,
    size: true,
    color: true,
    other: true,
  });

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = showDrawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDrawer]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !isVisible) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "100px" },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed: ProductsCache = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setProductsCache(parsed);
            setDisplayedProducts(
              showTrendingOnly
                ? parsed.trending
                : initialCategory === "all"
                  ? parsed.all
                  : (parsed[initialCategory as keyof ProductsCache] as any[]) ||
                    [],
            );
            setIsLoadingProducts(false);
            autoRefreshIntervalRef.current = setInterval(
              () => checkForNewProducts(parsed.productCount),
              AUTO_REFRESH_INTERVAL,
            );
            return;
          }
        } catch {}
      }
    }
    fetchAllProducts(false);
    return () => {
      if (autoRefreshIntervalRef.current)
        clearInterval(autoRefreshIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    filterFromCache();
  }, [
    searchQuery,
    selectedCategory,
    selectedSizes,
    priceRange,
    selectedColors,
    selectedClothingTypes,
    selectedOccasions,
    sortBy,
    showNewArrivals,
    showOnSale,
    productsCache,
  ]);

  const checkForNewProducts = async (count: number) => {
    try {
      const data = await fetch("/api/products/public?isFeatured=true").then(
        (r) => r.json(),
      );
      if ((data.products?.length || 0) !== count) {
        localStorage.removeItem(CACHE_KEY);
        await fetchAllProducts(true);
      }
    } catch {}
  };

  const fetchAllProducts = async (silent = false) => {
    if (!silent) setIsLoadingProducts(true);
    try {
      const [allData, trendingData] = await Promise.all([
        fetch("/api/products/public").then((r) => r.json()),
        fetch("/api/products/trending").then((r) => r.json()),
      ]);
      const all: any[] = allData.products || [];
      const trending: any[] = trendingData.products || [];
      const cache: ProductsCache = {
        all,
        men: all.filter((p) => p.category === "men"),
        women: all.filter((p) => p.category === "women"),
        unisex: all.filter((p) => p.category === "unisex"),
        onSale: all.filter((p) => p.onSale),
        newArrivals: all.filter((p) => p.newArrival),
        trending,
        timestamp: Date.now(),
        productCount: all.length,
      };
      setProductsCache(cache);
      setDisplayedProducts(
        showTrendingOnly
          ? cache.trending
          : initialCategory === "all"
            ? cache.all
            : (cache[initialCategory as keyof ProductsCache] as any[]) || [],
      );
      if (typeof window !== "undefined")
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      if (autoRefreshIntervalRef.current)
        clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = setInterval(
        () => checkForNewProducts(cache.productCount),
        AUTO_REFRESH_INTERVAL,
      );
    } catch {
    } finally {
      if (!silent) setIsLoadingProducts(false);
    }
  };

  const filterFromCache = () => {
    const base = showTrendingOnly ? productsCache.trending : productsCache.all;
    let f = [...base];
    if (!showTrendingOnly && selectedCategory !== "all")
      f = f.filter((p) => p.category === selectedCategory);
    if (showOnSale) f = f.filter((p) => p.onSale);
    if (showNewArrivals) f = f.filter((p) => p.newArrival);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    f = f.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedSizes.length)
      f = f.filter((p) =>
        p.sizes?.some((s: string) => selectedSizes.includes(s)),
      );
    if (selectedColors.length)
      f = f.filter((p) =>
        p.colors?.some((c: string) => selectedColors.includes(c.toLowerCase())),
      );
    if (selectedClothingTypes.length)
      f = f.filter((p) => selectedClothingTypes.includes(p.clothingType));
    if (selectedOccasions.length)
      f = f.filter((p) => selectedOccasions.includes(p.occasion));
    if (sortBy === "price-low") f.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") f.sort((a, b) => b.price - a.price);
    else if (sortBy === "name")
      f.sort((a, b) => a.title.localeCompare(b.title));
    else if (showTrendingOnly)
      f.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
    setDisplayedProducts(f);
  };

  const clearFilters = () => {
    setSearchQuery("");
    if (!showTrendingOnly) setSelectedCategory(initialCategory);
    setSelectedSizes([]);
    setPriceRange([0, 10000]);
    setSelectedColors([]);
    setSelectedClothingTypes([]);
    setSelectedOccasions([]);
    setSortBy("featured");
    setShowNewArrivals(false);
    setShowOnSale(false);
  };

  const toggleSize = (s: string) =>
    setSelectedSizes((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : [...p, s],
    );
  const toggleColor = (c: string) =>
    setSelectedColors((p) =>
      p.includes(c) ? p.filter((x) => x !== c) : [...p, c],
    );
  const toggleClothingType = (t: string) =>
    setSelectedClothingTypes((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t],
    );
  const toggleOccasion = (o: string) =>
    setSelectedOccasions((p) =>
      p.includes(o) ? p.filter((x) => x !== o) : [...p, o],
    );
  const toggleSection = (s: keyof typeof expandedSections) =>
    setExpandedSections((p) => ({ ...p, [s]: !p[s] }));

  const activeFiltersCount =
    (!showTrendingOnly && selectedCategory !== initialCategory ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    selectedClothingTypes.length +
    selectedOccasions.length +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0) +
    (showNewArrivals ? 1 : 0) +
    (showOnSale ? 1 : 0);

  const sharedSidebarProps = {
    searchQuery,
    selectedCategory: showTrendingOnly ? "all" : selectedCategory,
    selectedSizes,
    priceRange,
    selectedColors,
    selectedClothingTypes,
    selectedOccasions,
    showNewArrivals,
    showOnSale,
    onSearchChange: setSearchQuery,
    onCategoryChange: showTrendingOnly ? () => {} : setSelectedCategory,
    onSizeToggle: toggleSize,
    onPriceChange: setPriceRange,
    onColorToggle: toggleColor,
    onClothingTypeToggle: toggleClothingType,
    onOccasionToggle: toggleOccasion,
    onNewArrivalsChange: setShowNewArrivals,
    onSaleChange: setShowOnSale,
    onClearFilters: clearFilters,
    activeFiltersCount,
    expandedSections,
    onToggleSection: toggleSection,
    hideCategoryFilter: showTrendingOnly,
  };

  return (
    <>
      <style>{CSS}</style>

      {/* ── Mobile sticky search + filter bar ── */}
      <div className="pg-mobile-bar">
        <div className="pg-mob-search">
          <span className="pg-mob-search-ico">
            <SearchIco size={15} />
          </span>
          <input
            className="pg-mob-search-input"
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="pg-mob-search-clear"
              onClick={() => setSearchQuery("")}
            >
              <XIco />
            </button>
          )}
        </div>
        <button
          className={`pg-mob-filter-btn${activeFiltersCount > 0 ? " has-filters" : ""}`}
          onClick={() => setShowDrawer(true)}
        >
          <FilterIco />
          Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
        </button>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showDrawer && (
        <>
          <div
            className="pg-drawer-backdrop"
            onClick={() => setShowDrawer(false)}
          />
          <div className="pg-drawer">
            <div className="pg-drawer-handle">
              <span />
            </div>
            <div className="pg-drawer-header">
              <span className="pg-drawer-title">Filters</span>
              <button
                className="pg-drawer-close"
                onClick={() => setShowDrawer(false)}
              >
                <XIco />
              </button>
            </div>
            <FilterSidebar {...sharedSidebarProps} />
          </div>
        </>
      )}

      <section ref={sectionRef} className="pg-section">
        <div className="pg-inner">
          <div className="pg-layout">
            {/* Desktop sidebar */}
            <div className="pg-sidebar-col">
              <FilterSidebar {...sharedSidebarProps} />
            </div>

            <div className="pg-main">
              <div className="pg-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                  {activeFiltersCount > 0 && (
                    <button className="pg-filter-chip" onClick={clearFilters}>
                      {activeFiltersCount} filter
                      {activeFiltersCount !== 1 ? "s" : ""} <XIco />
                    </button>
                  )}
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="pg-grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : displayedProducts.length > 0 ? (
                <div className="pg-grid">
                  {displayedProducts.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      index={i}
                      isVisible={isVisible}
                    />
                  ))}
                </div>
              ) : (
                <div className="pg-empty">
                  <div className="pg-empty-ico">
                    <SearchIco />
                  </div>
                  <p className="pg-empty-title">No products found</p>
                  <p className="pg-empty-sub">
                    Try adjusting your filters or search terms
                  </p>
                  <button className="pg-empty-btn" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
