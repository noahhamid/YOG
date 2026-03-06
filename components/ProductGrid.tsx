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
const CACHE_DURATION = 1 * 60 * 1000;
const AUTO_REFRESH_INTERVAL = 3 * 1000;

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg:#f6f5f3; --card:#fff; --text:#1a1714; --muted:#9e9890;
  --border:#e8e4de; --hover:#f5f3f0;
}

/* ── Page wrapper ── */
.pg2-section {
  width:100%; min-height:100vh;
  background:var(--bg); font-family:'Sora',sans-serif;
  padding:32px 24px 80px;
}
.pg2-inner { max-width:1440px; margin:0 auto; }
.pg2-layout { display:flex; gap:22px; align-items:flex-start; }
.pg2-main   { flex:1; min-width:0; }

/* ── Toolbar ── */
.pg2-toolbar {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:18px; flex-wrap:wrap; gap:10px;
}
.pg2-count { font-size:13px; color:var(--muted); font-weight:500; line-height:1; }
.pg2-count strong { color:var(--text); font-weight:700; }
.pg2-filter-tag {
  display:inline-flex; align-items:center; gap:5px;
  padding:4px 10px; background:var(--text); color:#fff;
  border-radius:20px; font-size:11px; font-weight:700; cursor:pointer;
  transition:background 0.15s;
}
.pg2-filter-tag:hover { background:#333; }
.pg2-toolbar-right { display:flex; align-items:center; gap:10px; }
.pg2-sort {
  padding:9px 36px 9px 14px; border:1.5px solid var(--border);
  border-radius:10px; background:var(--card);
  font-family:'Sora',sans-serif; font-size:12px; font-weight:600;
  color:var(--text); outline:none; cursor:pointer; transition:border-color 0.15s;
  appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%239e9890' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 12px center;
}
.pg2-sort:focus { border-color:var(--text); }

/* ── Grid ── */
.pg2-grid {
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:14px;
}
@media(max-width:1400px){ .pg2-grid { grid-template-columns:repeat(4,1fr); } }
@media(max-width:1100px){ .pg2-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:760px)  { .pg2-grid { grid-template-columns:repeat(2,1fr); gap:10px; } }

/* ── Product card ── */
.pg2-card {
  background:var(--card); border-radius:14px; overflow:hidden;
  border:1px solid var(--border); display:block; text-decoration:none;
  transition:box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  will-change:transform; cursor:pointer;
  position:relative;
}
.pg2-card:not(.oos):hover {
  box-shadow:0 12px 36px rgba(0,0,0,0.10);
  transform:translateY(-4px);
  border-color:rgba(0,0,0,0.1);
}

/* ── Image ── */
.pg2-img-wrap {
  position:relative; aspect-ratio:3/4; overflow:hidden;
  background:var(--hover);
}
.pg2-img {
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; transition:opacity 0.45s ease, transform 0.45s ease;
}
.pg2-img.pri { opacity:1; }
.pg2-img.sec { opacity:0; }
.pg2-card:not(.oos):hover .pg2-img.pri.alt { opacity:0; }
.pg2-card:not(.oos):hover .pg2-img.sec    { opacity:1; }
.pg2-card:not(.oos):hover .pg2-img.pri    { transform:scale(1.05); }
.pg2-card:not(.oos):hover .pg2-img.sec    { transform:scale(1.05); }
.pg2-img.dim { opacity:0.5; filter:grayscale(0.3); }

/* ── Hover gradient + actions ── */
.pg2-hover-layer {
  position:absolute; inset:0; z-index:4;
  background:linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 45%, transparent 70%);
  opacity:0; transition:opacity 0.22s; pointer-events:none;
}
.pg2-card:not(.oos):hover .pg2-hover-layer { opacity:1; }

.pg2-cart-btn {
  position:absolute; bottom:12px; left:12px; right:12px; z-index:5;
  padding:9px 0; border-radius:9px; border:none;
  background:#fff; color:var(--text);
  font-size:12px; font-weight:700; font-family:'Sora',sans-serif;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;
  transform:translateY(10px); opacity:0;
  transition:opacity 0.22s, transform 0.22s, background 0.15s;
}
.pg2-card:not(.oos):hover .pg2-cart-btn { opacity:1; transform:translateY(0); }
.pg2-cart-btn:hover { background:#f0ede8; }

.pg2-wish-btn {
  position:absolute; top:10px; right:10px; z-index:5;
  width:30px; height:30px; border-radius:8px; border:none;
  background:rgba(255,255,255,0.9); backdrop-filter:blur(6px);
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  color:var(--text); transition:all 0.18s;
  opacity:0; transform:scale(0.8) translateX(4px);
}
.pg2-card:not(.oos):hover .pg2-wish-btn { opacity:1; transform:scale(1) translateX(0); }
.pg2-wish-btn:hover { background:#fff; color:#ef4444; }

/* ── Badges ── */
.pg2-badge-tl, .pg2-badge-tr {
  position:absolute; top:10px; z-index:6;
  padding:3px 9px; border-radius:20px;
  font-size:10px; font-weight:800; letter-spacing:0.2px;
  pointer-events:none;
}
.pg2-badge-tl { left:10px; }
.pg2-badge-tr { right:10px; }
.pg2-badge-sale { background:#dc2626; color:#fff; }
.pg2-badge-new  { background:#16a34a; color:#fff; }
.pg2-badge-oos  {
  background:rgba(26,23,20,0.75); color:#fff;
  backdrop-filter:blur(4px);
  padding:4px 10px; font-size:11px; font-weight:700;
  /* center horizontally */
  left:50%; top:50%; transform:translate(-50%,-50%);
  border-radius:10px; letter-spacing:0.3px;
  position:absolute; z-index:6;
}

/* ── Info ── */
.pg2-info { padding:11px 13px 14px; }
.pg2-name {
  font-size:13px; font-weight:700; color:var(--text);
  margin:0 0 3px; letter-spacing:-0.1px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.pg2-sub {
  font-size:11px; color:var(--muted); margin:0 0 9px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.pg2-bottom { display:flex; align-items:flex-end; justify-content:space-between; gap:6px; }
.pg2-price-wrap {}
.pg2-price {
  font-size:15px; font-weight:800; color:var(--text);
  letter-spacing:-0.4px; line-height:1.1;
}
.pg2-price span { font-size:11px; font-weight:500; color:var(--muted); margin-left:2px; }
.pg2-compare { font-size:11px; color:#c4bfb8; text-decoration:line-through; display:block; margin-top:1px; }
.pg2-sizes { display:flex; gap:4px; flex-wrap:wrap; }
.pg2-size {
  width:22px; height:22px; border-radius:5px;
  border:1px solid var(--border); display:flex; align-items:center;
  justify-content:center; font-size:9px; font-weight:700; color:var(--muted);
  transition:border-color 0.15s, color 0.15s;
}
.pg2-card:hover .pg2-size { border-color:#c4bfb8; }

/* ── Skeleton ── */
@keyframes pg2-shimmer {
  0%   { background-position:-600px 0; }
  100% { background-position: 600px 0; }
}
.pg2-skel-card {
  border-radius:14px; overflow:hidden; border:1px solid var(--border);
}
.pg2-skel-img {
  aspect-ratio:3/4; width:100%;
  background:linear-gradient(90deg,#ede9e4 25%,#e2ded8 50%,#ede9e4 75%);
  background-size:1200px 100%;
  animation:pg2-shimmer 1.8s ease-in-out infinite;
}
.pg2-skel-body { padding:11px 13px 14px; display:flex; flex-direction:column; gap:7px; }
.pg2-skel-line {
  border-radius:5px;
  background:linear-gradient(90deg,#ede9e4 25%,#e2ded8 50%,#ede9e4 75%);
  background-size:1200px 100%;
  animation:pg2-shimmer 1.8s ease-in-out infinite;
}

/* ── Empty ── */
.pg2-empty {
  display:flex; flex-direction:column; align-items:center;
  padding:80px 24px; background:var(--card); border-radius:18px;
  border:1.5px dashed var(--border); text-align:center;
}
.pg2-empty-ico {
  width:60px; height:60px; border-radius:16px;
  background:var(--hover); display:flex; align-items:center;
  justify-content:center; color:var(--muted); margin-bottom:14px;
}
.pg2-empty-title { font-size:16px; font-weight:700; color:var(--text); margin:0 0 6px; }
.pg2-empty-sub   { font-size:13px; color:var(--muted); margin:0 0 20px; }
.pg2-empty-btn {
  padding:10px 22px; background:var(--text); color:#fff;
  border:none; border-radius:10px; font-size:13px; font-weight:700;
  cursor:pointer; font-family:'Sora',sans-serif; transition:background 0.15s;
}
.pg2-empty-btn:hover { background:#333; }
`;

// ─── Icons ───────────────────────────────────────────────────────────────────
const CartIco = () => (
  <svg
    width="12"
    height="12"
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
const HeartIco = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
const SearchIco = () => (
  <svg
    width="26"
    height="26"
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

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="pg2-skel-card">
      <div className="pg2-skel-img" />
      <div className="pg2-skel-body">
        <div className="pg2-skel-line" style={{ height: 12, width: "70%" }} />
        <div className="pg2-skel-line" style={{ height: 10, width: "50%" }} />
        <div
          className="pg2-skel-line"
          style={{ height: 14, width: "40%", marginTop: 4 }}
        />
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
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
    alert(`✅ Added "${product.title}" to cart!`);
  };

  return (
    <a
      href={`/product/${product.id}`}
      className={`pg2-card${isOOS ? " oos" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 0.4s ease ${index * 0.035}s, transform 0.4s ease ${index * 0.035}s`,
      }}
    >
      {/* ── Image ── */}
      <div className="pg2-img-wrap">
        <img
          src={primary}
          alt={product.title}
          loading="lazy"
          className={`pg2-img pri${hasAlt ? " alt" : ""}${isOOS ? " dim" : ""}`}
        />
        {hasAlt && (
          <img src={secondary} alt="" loading="lazy" className="pg2-img sec" />
        )}

        {/* Badges */}
        {!isOOS && discount > 0 && (
          <span className="pg2-badge-tl pg2-badge-sale">−{discount}%</span>
        )}
        {!isOOS && product.newArrival && !discount && (
          <span className="pg2-badge-tl pg2-badge-new">New</span>
        )}
        {isOOS && <span className="pg2-badge-oos">Out of stock</span>}

        {/* Hover layer + actions */}
        {!isOOS && (
          <>
            <div className="pg2-hover-layer" />
            <button className="pg2-cart-btn" onClick={handleCart}>
              <CartIco /> Add to cart
            </button>
            <button
              className="pg2-wish-btn"
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

      {/* ── Info ── */}
      <div className="pg2-info">
        <p className="pg2-name">{product.title}</p>
        <p className="pg2-sub">{product.description}</p>
        <div className="pg2-bottom">
          <div className="pg2-price-wrap">
            <p className="pg2-price">
              {product.price.toLocaleString()}
              <span>ETB</span>
            </p>
            {discount > 0 && (
              <span className="pg2-compare">
                {product.compareAtPrice.toLocaleString()} ETB
              </span>
            )}
          </div>
          {!isOOS && product.sizes?.length > 0 && (
            <div className="pg2-sizes">
              {product.sizes.slice(0, 3).map((s: string) => (
                <span key={s} className="pg2-size">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
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

  // IntersectionObserver
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

  // Fetch on mount
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
            checkForNewProducts(parsed.productCount);
            autoRefreshIntervalRef.current = setInterval(
              () => checkForNewProducts(parsed.productCount),
              AUTO_REFRESH_INTERVAL,
            );
            return;
          }
        } catch {}
      }
    }
    preloadAllCategories(false);
    return () => {
      if (autoRefreshIntervalRef.current)
        clearInterval(autoRefreshIntervalRef.current);
    };
  }, []);

  // Re-filter on any dep change
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

  const checkForNewProducts = async (cachedCount: number) => {
    try {
      const data = await fetch("/api/products/public").then((r) => r.json());
      if ((data.products?.length || 0) !== cachedCount) {
        localStorage.removeItem(CACHE_KEY);
        await preloadAllCategories(true);
      }
    } catch {}
  };

  const preloadAllCategories = async (silent = false) => {
    if (!silent) setIsLoadingProducts(true);
    try {
      const [all, men, women, unisex, onSale, newArr, trending] =
        await Promise.all([
          fetch("/api/products/public").then((r) => r.json()),
          fetch("/api/products/public?category=men").then((r) => r.json()),
          fetch("/api/products/public?category=women").then((r) => r.json()),
          fetch("/api/products/public?category=unisex").then((r) => r.json()),
          fetch("/api/products/public?isFeatured=true").then((r) => r.json()),
          fetch("/api/products/public?isTrending=true").then((r) => r.json()),
          fetch("/api/products/trending").then((r) => r.json()),
        ]);
      const cache: ProductsCache = {
        all: all.products || [],
        men: men.products || [],
        women: women.products || [],
        unisex: unisex.products || [],
        onSale: onSale.products || [],
        newArrivals: newArr.products || [],
        trending: trending.products || [],
        timestamp: Date.now(),
        productCount: all.products?.length || 0,
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
      if (silent && autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = setInterval(
          () => checkForNewProducts(cache.productCount),
          AUTO_REFRESH_INTERVAL,
        );
      }
    } catch {
    } finally {
      if (!silent) setIsLoadingProducts(false);
    }
  };

  const filterFromCache = () => {
    if (showTrendingOnly) {
      let f = [...productsCache.trending];
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
          p.colors?.some((c: string) =>
            selectedColors.includes(c.toLowerCase()),
          ),
        );
      if (selectedClothingTypes.length)
        f = f.filter((p) => selectedClothingTypes.includes(p.clothingType));
      if (selectedOccasions.length)
        f = f.filter((p) => selectedOccasions.includes(p.occasion));
      if (sortBy === "price-low") f.sort((a, b) => a.price - b.price);
      else if (sortBy === "price-high") f.sort((a, b) => b.price - a.price);
      else if (sortBy === "name")
        f.sort((a, b) => a.title.localeCompare(b.title));
      else f.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
      setDisplayedProducts(f);
      return;
    }
    let f =
      selectedCategory !== "all" &&
      !searchQuery &&
      !selectedSizes.length &&
      !selectedColors.length &&
      !selectedClothingTypes.length &&
      !selectedOccasions.length &&
      !showNewArrivals &&
      !showOnSale
        ? [
            ...((productsCache[
              selectedCategory as keyof ProductsCache
            ] as any[]) || []),
          ]
        : [...productsCache.all];
    if (selectedCategory !== "all" && searchQuery)
      f = f.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
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

  return (
    <>
      <style>{CSS}</style>
      <section ref={sectionRef} className="pg2-section">
        <div className="pg2-inner">
          <div className="pg2-layout">
            {/* Sidebar — unchanged component, just styled via its own CSS */}
            <FilterSidebar
              searchQuery={searchQuery}
              selectedCategory={showTrendingOnly ? "all" : selectedCategory}
              selectedSizes={selectedSizes}
              priceRange={priceRange}
              selectedColors={selectedColors}
              selectedClothingTypes={selectedClothingTypes}
              selectedOccasions={selectedOccasions}
              showNewArrivals={showNewArrivals}
              showOnSale={showOnSale}
              onSearchChange={setSearchQuery}
              onCategoryChange={
                showTrendingOnly ? () => {} : setSelectedCategory
              }
              onSizeToggle={toggleSize}
              onPriceChange={setPriceRange}
              onColorToggle={toggleColor}
              onClothingTypeToggle={toggleClothingType}
              onOccasionToggle={toggleOccasion}
              onNewArrivalsChange={setShowNewArrivals}
              onSaleChange={setShowOnSale}
              onClearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              hideCategoryFilter={showTrendingOnly}
            />

            {/* Main */}
            <div className="pg2-main">
              {/* Toolbar */}
              <div className="pg2-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <p className="pg2-count">
                    <strong>{displayedProducts.length}</strong>{" "}
                    {displayedProducts.length === 1 ? "product" : "products"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <button className="pg2-filter-tag" onClick={clearFilters}>
                      {activeFiltersCount} filter
                      {activeFiltersCount !== 1 ? "s" : ""} <XIco />
                    </button>
                  )}
                </div>
                <select
                  className="pg2-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name: A–Z</option>
                </select>
              </div>

              {/* Grid */}
              {isLoadingProducts ? (
                <div className="pg2-grid">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : displayedProducts.length > 0 ? (
                <div className="pg2-grid">
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
                <div className="pg2-empty">
                  <div className="pg2-empty-ico">
                    <SearchIco />
                  </div>
                  <p className="pg2-empty-title">No products found</p>
                  <p className="pg2-empty-sub">
                    Try adjusting your filters or search terms
                  </p>
                  <button className="pg2-empty-btn" onClick={clearFilters}>
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
