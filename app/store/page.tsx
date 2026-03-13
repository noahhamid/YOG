"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Store {
  id: string;
  brandName: string;
  ownerName: string;
  location: string;
  clothingType: string;
  storeLogo: string | null;
  storeCover: string | null;
  storeDescription: string | null;
  storeSlug: string | null;
  followers: number;
  totalSales: number;
  totalViews: number;
  _count?: { products: number };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({
  d,
  size = 16,
  sw = 1.75,
}: {
  d: string;
  size?: number;
  sw?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
const SearchIco = ({ size = 16 }: { size?: number }) => (
  <Ico size={size} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
);
const MapPinIco = ({ size = 16 }: { size?: number }) => (
  <Ico
    size={size}
    d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  />
);
const UsersIco = ({ size = 16 }: { size?: number }) => (
  <Ico
    size={size}
    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
  />
);
const PackageIco = ({ size = 16 }: { size?: number }) => (
  <Ico
    size={size}
    d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"
  />
);
const ArrowRightIco = ({ size = 14 }: { size?: number }) => (
  <Ico size={size} d="M5 12h14m-7-7 7 7-7 7" />
);
const SparkleIco = ({ size = 16 }: { size?: number }) => (
  <Ico
    size={size}
    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"
  />
);
const XIco = ({ size = 14 }: { size?: number }) => (
  <Ico size={size} d="M18 6 6 18M6 6l12 12" />
);

// ─── Clothing type filter chips ───────────────────────────────────────────────
const CLOTHING_TYPES = [
  "All",
  "TOP",
  "BOTTOM",
  "DRESS",
  "OUTERWEAR",
  "SHOES",
  "ACCESSORIES",
  "ACTIVEWEAR",
  "UNDERWEAR",
];

const CLOTHING_LABELS: Record<string, string> = {
  TOP: "Tops",
  BOTTOM: "Bottoms",
  DRESS: "Dresses",
  OUTERWEAR: "Outerwear",
  SHOES: "Shoes",
  ACCESSORIES: "Accessories",
  ACTIVEWEAR: "Activewear",
  UNDERWEAR: "Underwear",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  :root {
    --bg:#f6f5f3; --card:#fff; --text:#1a1714; --muted:#9e9890;
    --border:#e8e4de; --hover:#f5f3f0;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'Sora', sans-serif !important; background: var(--bg); }

  @keyframes fadeUp   { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes shimmer  { from { background-position: -200% 0; } to { background-position: 200% 0; } }
  @keyframes spin     { to { transform: rotate(360deg); } }

  .st-page   { min-height: 100vh; background: var(--bg); padding-top: 72px; font-family: 'Sora', sans-serif; }
  .st-wrap   { max-width: 1320px; margin: 0 auto; padding: 40px 24px 80px; }

  /* Hero strip */
  .st-hero   { margin-bottom: 40px; }
  .st-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 10px; }
  .st-title  { font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: var(--text); letter-spacing: -1.2px; margin: 0 0 8px; line-height: 1.1; }
  .st-sub    { font-size: 14px; color: var(--muted); margin: 0; max-width: 480px; line-height: 1.6; }

  /* Search + filter row */
  .st-controls { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
  .st-search-wrap { position: relative; max-width: 420px; }
  .st-search { width: 100%; padding: 11px 16px 11px 42px; background: var(--card); border: 1.5px solid var(--border); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
  .st-search:focus { border-color: var(--text); box-shadow: 0 0 0 3px rgba(26,23,20,0.06); }
  .st-search::placeholder { color: var(--muted); }
  .st-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
  .st-chips { display: flex; gap: 6px; flex-wrap: wrap; }
  .st-chip {
    padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700;
    border: 1.5px solid var(--border); background: var(--card); color: var(--muted);
    cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: 'Sora', sans-serif;
  }
  .st-chip:hover   { border-color: var(--text); color: var(--text); }
  .st-chip.active  { background: var(--text); color: #fff; border-color: var(--text); }

  /* Results meta */
  .st-meta { font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 20px; }

  /* Grid */
  .st-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  @media (max-width: 1200px) { .st-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 860px)  { .st-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px)  { .st-grid { grid-template-columns: 1fr; } }

  /* Store card */
  .st-card {
    background: var(--card); border-radius: 20px; border: 1px solid var(--border);
    overflow: hidden; transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    animation: fadeUp 0.35s ease both; text-decoration: none; display: block; color: inherit;
  }
  .st-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.1); transform: translateY(-3px); border-color: rgba(0,0,0,0.1); }

  /* Cover */
  .st-cover { position: relative; height: 110px; background: linear-gradient(135deg, #e8e4de 0%, #f0ede9 100%); overflow: hidden; }
  .st-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .st-card:hover .st-cover img { transform: scale(1.04); }
  .st-cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f0ede9, #e8e4de); }

  /* Logo */
  .st-logo-wrap { position: absolute; bottom: -22px; left: 20px; }
  .st-logo {
    width: 48px; height: 48px; border-radius: 13px; border: 2.5px solid #fff;
    background: #fff; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; color: var(--text);
  }
  .st-logo img { width: 100%; height: 100%; object-fit: cover; }

  /* Body */
  .st-body    { padding: 30px 18px 18px; }
  .st-brand   { font-size: 15px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .st-type-tag { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: var(--muted); background: var(--hover); padding: 3px 8px; border-radius: 6px; margin-bottom: 8px; }
  .st-desc    { font-size: 12px; color: var(--muted); line-height: 1.55; margin: 0 0 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
  .st-location { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--muted); font-weight: 600; margin-bottom: 14px; }

  /* Stats row */
  .st-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 14px; }
  .st-stat-item { padding: 10px 12px; text-align: center; }
  .st-stat-item + .st-stat-item { border-left: 1px solid var(--border); }
  .st-stat-val   { font-size: 15px; font-weight: 800; color: var(--text); letter-spacing: -0.4px; display: block; }
  .st-stat-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); margin-top: 1px; display: block; }

  /* CTA */
  .st-cta {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 9px; background: var(--text); color: #fff; border: none; border-radius: 11px;
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer;
    transition: all 0.15s; text-decoration: none;
  }
  .st-cta:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.16); }

  /* Skeleton */
  .st-skel { background: linear-gradient(90deg, #ede9e4 25%, #e4e0db 50%, #ede9e4 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }

  /* Empty */
  .st-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; text-align: center; }
  .st-empty-icon { width: 72px; height: 72px; background: var(--hover); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--muted); }
  .st-empty-title { font-size: 18px; font-weight: 700; color: var(--text); margin: 0 0 8px; }
  .st-empty-sub   { font-size: 13px; color: var(--muted); margin: 0; }

  /* Clear btn */
  .st-clear { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--muted); background: none; border: none; cursor: pointer; font-family: 'Sora', sans-serif; padding: 0; transition: color 0.15s; }
  .st-clear:hover { color: var(--text); }
`;

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="st-card"
      style={{ animationDelay: `${delay}ms`, pointerEvents: "none" }}
    >
      <div className="st-cover" />
      <div className="st-body" style={{ paddingTop: 36 }}>
        <div
          className="st-skel"
          style={{ height: 14, width: "60%", marginBottom: 8 }}
        />
        <div
          className="st-skel"
          style={{ height: 10, width: "35%", marginBottom: 12 }}
        />
        <div
          className="st-skel"
          style={{ height: 10, width: "100%", marginBottom: 5 }}
        />
        <div
          className="st-skel"
          style={{ height: 10, width: "80%", marginBottom: 18 }}
        />
        <div
          className="st-skel"
          style={{ height: 56, borderRadius: 12, marginBottom: 14 }}
        />
        <div className="st-skel" style={{ height: 36, borderRadius: 11 }} />
      </div>
    </div>
  );
}

// ─── Store card ───────────────────────────────────────────────────────────────
function StoreCard({ store, delay = 0 }: { store: Store; delay?: number }) {
  const initials = store.brandName.slice(0, 2).toUpperCase();
  const href = store.storeSlug
    ? `/store/${store.storeSlug}`
    : `/store/${store.id}`;

  const fmt = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <Link
      href={href}
      className="st-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Cover */}
      <div className="st-cover">
        {store.storeCover ? (
          <img src={store.storeCover} alt="" />
        ) : (
          <div className="st-cover-placeholder">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(158,152,144,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
            </svg>
          </div>
        )}
        {/* Logo */}
        <div className="st-logo-wrap">
          <div className="st-logo">
            {store.storeLogo ? (
              <img src={store.storeLogo} alt={store.brandName} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="st-body">
        <p className="st-brand">{store.brandName}</p>
        {store.clothingType && (
          <span className="st-type-tag">
            {CLOTHING_LABELS[store.clothingType] ?? store.clothingType}
          </span>
        )}
        <p className="st-desc">
          {store.storeDescription ||
            `Discover curated fashion from ${store.brandName}`}
        </p>
        {store.location && (
          <div className="st-location">
            <MapPinIco size={11} /> {store.location}
          </div>
        )}

        {/* Stats */}
        <div className="st-stats">
          <div className="st-stat-item">
            <span className="st-stat-val">{fmt(store.followers)}</span>
            <span className="st-stat-label">Followers</span>
          </div>
          <div className="st-stat-item">
            <span className="st-stat-val">{fmt(store.totalSales)}</span>
            <span className="st-stat-label">Sales</span>
          </div>
          <div className="st-stat-item">
            <span className="st-stat-val">{store._count?.products ?? "—"}</span>
            <span className="st-stat-label">Products</span>
          </div>
        </div>

        <span className="st-cta">
          Visit Store <ArrowRightIco size={13} />
        </span>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stores");
      const data = (await res.json()) as { stores?: Store[] };
      setStores(data.stores ?? []);
    } catch (e) {
      console.error("Failed to fetch stores:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Filter
  const filtered = stores.filter((s) => {
    const matchType = activeType === "All" || s.clothingType === activeType;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.brandName.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      (s.storeDescription ?? "").toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const hasFilters = search !== "" || activeType !== "All";

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <div className="st-page">
        <div className="st-wrap">
          {/* Hero */}
          <div className="st-hero">
            <div className="st-eyebrow">
              <SparkleIco size={12} /> Ethiopian Fashion Sellers
            </div>
            <h1 className="st-title">Explore Stores</h1>
            <p className="st-sub">
              Browse verified sellers from across Ethiopia — from streetwear to
              formal wear, all in one place.
            </p>
          </div>

          {/* Controls */}
          <div className="st-controls">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {/* Search */}
              <div className="st-search-wrap">
                <span className="st-search-icon">
                  <SearchIco size={15} />
                </span>
                <input
                  className="st-search"
                  type="text"
                  placeholder="Search stores, locations…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* Clear */}
              {hasFilters && (
                <button
                  className="st-clear"
                  onClick={() => {
                    setSearch("");
                    setActiveType("All");
                  }}
                >
                  <XIco size={12} /> Clear filters
                </button>
              )}
            </div>
            {/* Type chips */}
            <div className="st-chips">
              {CLOTHING_TYPES.map((t) => (
                <button
                  key={t}
                  className={`st-chip${activeType === t ? " active" : ""}`}
                  onClick={() => setActiveType(t)}
                >
                  {t === "All" ? "All Stores" : (CLOTHING_LABELS[t] ?? t)}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <p className="st-meta">
              {filtered.length} {filtered.length === 1 ? "store" : "stores"}{" "}
              found
              {activeType !== "All" &&
                ` in ${CLOTHING_LABELS[activeType] ?? activeType}`}
              {search && ` for "${search}"`}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="st-grid">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} delay={i * 40} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="st-empty">
              <div className="st-empty-icon">
                <UsersIco size={30} />
              </div>
              <h3 className="st-empty-title">
                {hasFilters ? "No stores match your search" : "No stores yet"}
              </h3>
              <p className="st-empty-sub">
                {hasFilters
                  ? "Try a different search or filter"
                  : "Sellers will appear here once approved"}
              </p>
              {hasFilters && (
                <button
                  className="st-clear"
                  style={{ marginTop: 16, fontSize: 13 }}
                  onClick={() => {
                    setSearch("");
                    setActiveType("All");
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="st-grid">
              {filtered.map((store, i) => (
                <StoreCard key={store.id} store={store} delay={i * 40} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
