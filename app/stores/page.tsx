"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
const ArrowIco = ({ size = 14 }: { size?: number }) => (
  <Ico size={size} d="M5 12h14m-7-7 7 7-7 7" />
);
const XIco = ({ size = 12 }: { size?: number }) => (
  <Ico size={size} d="M18 6 6 18M6 6l12 12" />
);
const StarIco = ({ size = 12 }: { size?: number }) => (
  <Ico
    size={size}
    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    sw={1.5}
  />
);
const FlameIco = ({ size = 12 }: { size?: number }) => (
  <Ico
    size={size}
    d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
  />
);
const PackageIco = ({ size = 12 }: { size?: number }) => (
  <Ico
    size={size}
    d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"
  />
);
const NewIco = ({ size = 12 }: { size?: number }) => (
  <Ico size={size} d="M12 5v14M5 12h14" />
);
const UsersIco = ({ size = 16 }: { size?: number }) => (
  <Ico
    size={size}
    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
  />
);
const CheckIco = ({ size = 12 }: { size?: number }) => (
  <Ico size={size} d="M20 6 9 17l-5-5" sw={2.5} />
);

// ─── Filters ──────────────────────────────────────────────────────────────────
type FilterKey =
  | "all"
  | "top-rated"
  | "most-popular"
  | "most-sales"
  | "large-stock"
  | "new";

const FILTERS: {
  key: FilterKey;
  label: string;
  Icon: React.FC<{ size?: number }>;
}[] = [
  { key: "all", label: "All Stores", Icon: UsersIco },
  { key: "top-rated", label: "Top Rated", Icon: StarIco },
  { key: "most-popular", label: "Most Followed", Icon: FlameIco },
  { key: "most-sales", label: "Best Selling", Icon: ArrowIco },
  { key: "large-stock", label: "Large Stock", Icon: PackageIco },
  { key: "new", label: "Newest", Icon: NewIco },
];

function sortStores(stores: Store[], filter: FilterKey): Store[] {
  const s = [...stores];
  switch (filter) {
    case "top-rated":
      return s.sort(
        (a, b) =>
          b.totalSales / Math.max(b.followers, 1) -
          a.totalSales / Math.max(a.followers, 1),
      );
    case "most-popular":
      return s.sort((a, b) => b.followers - a.followers);
    case "most-sales":
      return s.sort((a, b) => b.totalSales - a.totalSales);
    case "large-stock":
      return s.sort(
        (a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0),
      );
    case "new":
      return s.reverse();
    default:
      return s;
  }
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  :root {
    --bg:#f6f5f3; --card:#fff; --text:#1a1714; --muted:#9e9890;
    --border:#e8e4de; --hover:#f5f3f0;
  }
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes sp-fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
  @keyframes sp-shimmer  { from { background-position:-300% 0; } to { background-position:300% 0; } }
  @keyframes sp-scaleIn  { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

  .sp-page  { min-height:100vh; background:var(--bg); padding-top:72px; font-family:'Sora',sans-serif; }
  .sp-wrap  { max-width:1320px; margin:0 auto; padding:0 24px 80px; }

  /* ── Hero ── */
  .sp-hero {
    padding:48px 0 40px;
    border-bottom:1px solid var(--border);
    margin-bottom:32px;
    display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap;
  }
  .sp-hero-left {}
  .sp-eyebrow { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:1.4px; margin:0 0 10px; display:flex; align-items:center; gap:7px; }
  .sp-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:var(--muted); }
  .sp-title { font-size:clamp(32px,4vw,48px); font-weight:800; color:var(--text); letter-spacing:-1.5px; margin:0 0 10px; line-height:1.05; }
  .sp-title em { font-style:normal; color:var(--muted); font-weight:300; letter-spacing:-1px; }
  .sp-sub { font-size:13px; color:var(--muted); margin:0; line-height:1.65; max-width:420px; }
  .sp-hero-right { flex-shrink:0; }
  .sp-count-pill {
    display:flex; align-items:center; gap:10px;
    padding:12px 20px; background:var(--text); color:#fff;
    border-radius:14px; font-size:13px; font-weight:600;
  }
  .sp-count-num { font-size:22px; font-weight:800; letter-spacing:-0.8px; line-height:1; }

  /* ── Controls ── */
  .sp-controls { margin-bottom:28px; display:flex; flex-direction:column; gap:14px; }
  .sp-top-row  { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

  .sp-search-wrap { position:relative; flex:1; max-width:380px; }
  .sp-search {
    width:100%; padding:11px 16px 11px 40px;
    background:var(--card); border:1.5px solid var(--border); border-radius:12px;
    font-family:'Sora',sans-serif; font-size:13px; color:var(--text);
    outline:none; transition:border-color 0.15s, box-shadow 0.15s;
  }
  .sp-search:focus { border-color:var(--text); box-shadow:0 0 0 3px rgba(26,23,20,0.06); }
  .sp-search::placeholder { color:var(--muted); }
  .sp-search-ico { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }

  .sp-clear {
    display:inline-flex; align-items:center; gap:5px;
    font-size:11px; font-weight:700; color:var(--muted);
    background:none; border:1.5px solid var(--border); border-radius:8px;
    cursor:pointer; font-family:'Sora',sans-serif; padding:6px 10px;
    transition:all 0.15s;
  }
  .sp-clear:hover { border-color:var(--text); color:var(--text); }

  /* Filter pills */
  .sp-filters { display:flex; gap:8px; flex-wrap:wrap; }
  .sp-filter {
    display:flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:20px; font-size:12px; font-weight:700;
    border:1.5px solid var(--border); background:var(--card); color:var(--muted);
    cursor:pointer; transition:all 0.18s; white-space:nowrap;
    font-family:'Sora',sans-serif;
  }
  .sp-filter:hover { border-color:var(--text); color:var(--text); transform:translateY(-1px); box-shadow:0 3px 10px rgba(0,0,0,0.06); }
  .sp-filter.active {
    background:var(--text); color:#fff; border-color:var(--text);
    box-shadow:0 4px 14px rgba(26,23,20,0.2);
    transform:translateY(-1px);
  }

  /* Meta */
  .sp-meta { font-size:12px; color:var(--muted); font-weight:600; margin-bottom:22px; }

  /* Grid */
  .sp-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px; }
  @media(max-width:500px)  { .sp-grid { grid-template-columns:1fr; } }

  /* ✅ NEW CARD DESIGN */
  .sp-card {
    background:var(--card); 
    border-radius:18px; 
    border:1px solid var(--border);
    overflow:hidden; 
    text-decoration:none; 
    display:flex; 
    flex-direction:column;
    color:inherit; 
    transition:all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    animation:sp-fadeUp 0.38s ease both;
    will-change:transform;
    position:relative;
  }
  .sp-card:hover { 
    box-shadow:0 20px 60px rgba(0,0,0,0.12); 
    transform:translateY(-6px); 
    border-color:rgba(0,0,0,0.08); 
  }

  /* Header with gradient */
  .sp-card-header {
    position:relative;
    padding:24px 20px 70px;
    background:linear-gradient(135deg, #1a1714 0%, #2d2925 100%);
    overflow:hidden;
  }
  .sp-card-header::before {
    content:'';
    position:absolute;
    top:-50%;
    right:-30%;
    width:200px;
    height:200px;
    background:radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    border-radius:50%;
  }

  /* Logo */
  .sp-logo-circle {
    position:absolute;
    bottom:-40px;
    left:20px;
    width:80px;
    height:80px;
    border-radius:50%;
    border:4px solid #fff;
    background:#fff;
    overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,0.15);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:24px;
    font-weight:800;
    color:var(--text);
    letter-spacing:-0.5px;
    z-index:2;
  }
  .sp-logo-circle img { 
    width:100%; 
    height:100%; 
    object-fit:cover; 
  }

  /* Verified badge */
  .sp-verified-badge {
    position:absolute;
    top:16px;
    right:16px;
    display:inline-flex;
    align-items:center;
    gap:4px;
    padding:5px 10px;
    background:rgba(255,255,255,0.15);
    backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.2);
    border-radius:20px;
    font-size:10px;
    font-weight:700;
    color:#fff;
    letter-spacing:0.3px;
    z-index:1;
  }

  /* Body */
  .sp-card-body { 
    padding:50px 20px 20px; 
    flex:1; 
    display:flex; 
    flex-direction:column; 
  }

  .sp-brand { 
    font-size:17px; 
    font-weight:800; 
    color:var(--text); 
    letter-spacing:-0.5px; 
    margin:0 0 6px; 
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis; 
  }

  .sp-location { 
    display:flex; 
    align-items:center; 
    gap:5px; 
    font-size:12px; 
    color:var(--muted); 
    font-weight:600; 
    margin-bottom:12px; 
  }

  .sp-desc { 
    font-size:13px; 
    color:var(--muted); 
    line-height:1.6; 
    margin:0 0 16px; 
    flex:1; 
    display:-webkit-box; 
    -webkit-line-clamp:2; 
    -webkit-box-orient:vertical; 
    overflow:hidden; 
    min-height:42px; 
  }

  /* Stats */
  .sp-stats { 
    display:flex;
    gap:16px;
    padding:14px 0;
    border-top:1px solid var(--border);
    border-bottom:1px solid var(--border);
    margin-bottom:16px;
  }
  .sp-stat { 
    flex:1;
    text-align:center;
  }
  .sp-stat-val { 
    display:block; 
    font-size:16px; 
    font-weight:800; 
    color:var(--text); 
    letter-spacing:-0.5px; 
  }
  .sp-stat-label { 
    display:block; 
    font-size:10px; 
    font-weight:700; 
    text-transform:uppercase; 
    letter-spacing:0.6px; 
    color:var(--muted); 
    margin-top:2px; 
  }

  /* CTA */
  .sp-cta {
    display:flex; 
    align-items:center; 
    justify-content:center; 
    gap:7px;
    padding:12px; 
    background:var(--text); 
    color:#fff; 
    border-radius:11px;
    font-family:'Sora',sans-serif; 
    font-size:13px; 
    font-weight:700;
    text-decoration:none; 
    transition:all 0.2s; 
    margin-top:auto;
  }
  .sp-cta:hover { 
    background:#333; 
    transform:translateY(-2px); 
    box-shadow:0 6px 20px rgba(0,0,0,0.2); 
  }

  /* Skeleton */
  .sp-skel-base { 
    background:linear-gradient(90deg,#ede9e4 25%,#e4e0db 50%,#ede9e4 75%); 
    background-size:300% 100%; 
    animation:sp-shimmer 1.6s infinite; 
    border-radius:8px; 
  }

  /* Empty */
  .sp-empty { 
    display:flex; 
    flex-direction:column; 
    align-items:center; 
    justify-content:center; 
    padding:100px 24px; 
    text-align:center; 
  }
  .sp-empty-ico { 
    width:80px; 
    height:80px; 
    background:var(--hover); 
    border-radius:24px; 
    display:flex; 
    align-items:center; 
    justify-content:center; 
    margin-bottom:22px; 
    color:var(--muted); 
  }
  .sp-empty-title { 
    font-size:19px; 
    font-weight:800; 
    color:var(--text); 
    margin:0 0 8px; 
    letter-spacing:-0.4px; 
  }
  .sp-empty-sub { 
    font-size:13px; 
    color:var(--muted); 
    margin:0; 
  }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="sp-card"
      style={{ animationDelay: `${delay}ms`, pointerEvents: "none" }}
    >
      <div className="sp-card-header" />
      <div className="sp-card-body">
        <div
          className="sp-skel-base"
          style={{ height: 16, width: "60%", marginBottom: 8 }}
        />
        <div
          className="sp-skel-base"
          style={{ height: 12, width: "40%", marginBottom: 14 }}
        />
        <div
          className="sp-skel-base"
          style={{ height: 12, width: "100%", marginBottom: 5 }}
        />
        <div
          className="sp-skel-base"
          style={{ height: 12, width: "80%", marginBottom: 18 }}
        />
        <div
          className="sp-skel-base"
          style={{ height: 60, marginBottom: 16 }}
        />
        <div
          className="sp-skel-base"
          style={{ height: 44, borderRadius: 11 }}
        />
      </div>
    </div>
  );
}

// ─── Store Card ───────────────────────────────────────────────────────────────
function StoreCard({ store, delay = 0 }: { store: Store; delay?: number }) {
  // ✅ Changed from /store/ to /stores/
  const href = store.storeSlug
    ? `/stores/${store.storeSlug}`
    : `/stores/${store.id}`;
  const initials = store.brandName.slice(0, 2).toUpperCase();
  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <Link
      href={href}
      className="sp-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header with gradient */}
      <div className="sp-card-header">
        {/* Verified badge */}
        <span className="sp-verified-badge">
          <CheckIco size={11} /> Verified
        </span>

        {/* Circular logo */}
        <div className="sp-logo-circle">
          {store.storeLogo ? (
            <img src={store.storeLogo} alt={store.brandName} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="sp-card-body">
        <p className="sp-brand">{store.brandName}</p>
        {store.location && (
          <div className="sp-location">
            <MapPinIco size={12} /> {store.location}
          </div>
        )}
        <p className="sp-desc">
          {store.storeDescription ||
            `Discover curated fashion from ${store.brandName}`}
        </p>

        {/* Stats */}
        <div className="sp-stats">
          <div className="sp-stat">
            <span className="sp-stat-val">{fmt(store.followers)}</span>
            <span className="sp-stat-label">Followers</span>
          </div>
          <div className="sp-stat">
            <span className="sp-stat-val">{fmt(store.totalSales)}</span>
            <span className="sp-stat-label">Sales</span>
          </div>
          <div className="sp-stat">
            <span className="sp-stat-val">{store._count?.products ?? "—"}</span>
            <span className="sp-stat-label">Products</span>
          </div>
        </div>

        <span className="sp-cta">
          Visit Store <ArrowIco size={13} />
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
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

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

  const filtered = sortStores(
    stores.filter((s) => {
      const q = search.toLowerCase();
      return (
        !q ||
        s.brandName.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        (s.storeDescription ?? "").toLowerCase().includes(q)
      );
    }),
    activeFilter,
  );

  const hasFilters = search !== "" || activeFilter !== "all";

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <div className="sp-page">
        <div className="sp-wrap">
          {/* Hero */}
          <div className="sp-hero">
            <div className="sp-hero-left">
              <p className="sp-eyebrow">
                <span className="sp-eyebrow-dot" /> Ethiopian Fashion
              </p>
              <h1 className="sp-title">
                Explore <em>&</em> Discover
                <br />
                Stores
              </h1>
              <p className="sp-sub">
                Browse verified sellers across Ethiopia — streetwear, formal,
                activewear and more.
              </p>
            </div>
            {!isLoading && (
              <div className="sp-hero-right">
                <div className="sp-count-pill">
                  <div>
                    <div className="sp-count-num">{stores.length}</div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        opacity: 0.6,
                        marginTop: 1,
                      }}
                    >
                      Stores
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="sp-controls">
            <div className="sp-top-row">
              <div className="sp-search-wrap">
                <span className="sp-search-ico">
                  <SearchIco size={15} />
                </span>
                <input
                  className="sp-search"
                  type="text"
                  placeholder="Search stores, locations…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {hasFilters && (
                <button
                  className="sp-clear"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("all");
                  }}
                >
                  <XIco size={11} /> Clear
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="sp-filters">
              {FILTERS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  className={`sp-filter${activeFilter === key ? " active" : ""}`}
                  onClick={() => setActiveFilter(key)}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Meta */}
          {!isLoading && (
            <p className="sp-meta">
              {filtered.length} {filtered.length === 1 ? "store" : "stores"}
              {activeFilter !== "all" &&
                ` · ${FILTERS.find((f) => f.key === activeFilter)?.label}`}
              {search && ` · "${search}"`}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="sp-grid">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} delay={i * 50} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="sp-empty">
              <div className="sp-empty-ico">
                <UsersIco size={32} />
              </div>
              <h3 className="sp-empty-title">
                {hasFilters ? "No stores match" : "No stores yet"}
              </h3>
              <p className="sp-empty-sub">
                {hasFilters
                  ? "Try a different search or filter"
                  : "Sellers will appear here once approved"}
              </p>
              {hasFilters && (
                <button
                  className="sp-clear"
                  style={{ marginTop: 18, fontSize: 12 }}
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("all");
                  }}
                >
                  <XIco size={11} /> Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="sp-grid">
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
