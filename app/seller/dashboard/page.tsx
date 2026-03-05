"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";
import OrdersTab from "@/components/OrdersTab";

// ─── Inline Icons ─────────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, sw = 1.75, fill = "none" }) => (
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
const PlusIco = (p) => <Ico {...p} d="M12 5v14M5 12h14" />;
const PackageIco = (p) => (
  <Ico
    {...p}
    d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"
  />
);
const DollarIco = (p) => (
  <Ico {...p} d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
);
const TrendIco = (p) => (
  <Ico {...p} d="M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6" />
);
const BagIco = (p) => (
  <Ico
    {...p}
    d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
  />
);
const EditIco = (p) => (
  <Ico
    {...p}
    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  />
);
const TrashIco = (p) => (
  <Ico
    {...p}
    d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  />
);
const SettingsIco = (p) => (
  <Ico
    {...p}
    d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
  />
);
const ClockIco = (p) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"
  />
);
const XCircleIco = (p) => (
  <Ico
    {...p}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm3-13-6 6m0-6 6 6"
  />
);
const SparkleIco = (p) => (
  <Ico
    {...p}
    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"
  />
);
const ArrowRightIco = (p) => <Ico {...p} d="M5 12h14m-7-7 7 7-7 7" />;

// ─── Shared CSS vars (same tokens as Add/Edit forms) ─────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  :root {
    --bg: #f6f5f3;
    --card: #ffffff;
    --text: #1a1714;
    --muted: #9e9890;
    --border: #e8e4de;
    --accent: #2563eb;
    --accent-soft: rgba(37,99,235,0.08);
    --error: #dc2626;
    --hover: #f5f3f0;
    --divider: rgba(0,0,0,0.06);
    --success: #16a34a;
    --success-soft: #dcfce7;
    --warn: #d97706;
    --warn-soft: #fef3c7;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'Sora', sans-serif !important; background: var(--bg); }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .sd-page { min-height: 100vh; background: var(--bg); padding-top: 72px; font-family: 'Sora', sans-serif; }
  .sd-wrap { max-width: 1320px; margin: 0 auto; padding: 36px 24px 60px; }

  /* ── Header ── */
  .sd-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; }
  .sd-header-title { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.8px; margin: 0; }
  .sd-header-sub { font-size: 13px; color: var(--muted); margin: 4px 0 0; }
  .sd-header-actions { display: flex; gap: 10px; align-items: center; }

  .sd-btn-primary {
    display: flex; align-items: center; gap: 7px; padding: 10px 20px;
    background: var(--text); color: #fff; border: none; border-radius: 11px;
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; letter-spacing: -0.1px; text-decoration: none;
  }
  .sd-btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.16); }

  .sd-btn-ghost {
    display: flex; align-items: center; gap: 7px; padding: 10px 18px;
    background: var(--card); color: var(--text); border: 1.5px solid var(--border);
    border-radius: 11px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; text-decoration: none;
  }
  .sd-btn-ghost:hover { border-color: var(--text); background: var(--hover); }

  /* ── Stats ── */
  .sd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
  @media (max-width: 1024px) { .sd-stats { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .sd-stats { grid-template-columns: 1fr; } }

  .sd-stat {
    background: var(--card); border-radius: 16px; padding: 22px 24px;
    border: 1px solid var(--border); display: flex; align-items: center; gap: 16px;
    animation: fadeUp 0.4s ease both;
  }
  .sd-stat-icon {
    width: 48px; height: 48px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .sd-stat-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 4px; }
  .sd-stat-value { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.8px; margin: 0; }

  /* ── Tabs ── */
  .sd-tabs { display: flex; gap: 2px; border-bottom: 1.5px solid var(--border); margin-bottom: 28px; }
  .sd-tab {
    padding: 12px 20px; font-size: 13px; font-weight: 600; color: var(--muted);
    background: none; border: none; cursor: pointer; position: relative;
    font-family: 'Sora', sans-serif; transition: color 0.15s; white-space: nowrap;
  }
  .sd-tab:hover { color: var(--text); }
  .sd-tab.active { color: var(--text); }
  .sd-tab.active::after {
    content: ''; position: absolute; bottom: -1.5px; left: 0; right: 0;
    height: 2px; background: var(--text); border-radius: 2px 2px 0 0;
  }
  .sd-tab-count {
    display: inline-flex; align-items: center; justify-content: center;
    width: 20px; height: 20px; border-radius: 6px; font-size: 10px; font-weight: 700;
    background: var(--hover); color: var(--muted); margin-left: 6px;
  }
  .sd-tab.active .sd-tab-count { background: var(--text); color: #fff; }

  /* ── Products toolbar ── */
  .sd-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .sd-toolbar-meta { display: flex; gap: 20px; align-items: center; }
  .sd-meta-chip {
    display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;
    color: var(--muted); padding: 5px 10px; background: var(--card);
    border: 1px solid var(--border); border-radius: 8px;
  }
  .sd-meta-dot { width: 7px; height: 7px; border-radius: 50%; }

  /* ── Product grid ── */
  .sd-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  @media (max-width: 1200px) { .sd-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 860px)  { .sd-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px)  { .sd-grid { grid-template-columns: 1fr; } }

  .sd-product-card {
    background: var(--card); border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border); transition: all 0.2s;
    animation: fadeUp 0.35s ease both;
  }
  .sd-product-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-2px); }

  .sd-product-img { position: relative; aspect-ratio: 1; background: var(--hover); overflow: hidden; }
  .sd-product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .sd-product-card:hover .sd-product-img img { transform: scale(1.04); }

  .sd-badge {
    position: absolute; top: 10px; right: 10px;
    display: flex; flex-direction: column; align-items: flex-end; gap: 5px;
  }
  .sd-badge-pill {
    padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700;
    letter-spacing: 0.3px; backdrop-filter: blur(4px);
  }

  .sd-product-body { padding: 16px; }
  .sd-product-name { font-size: 14px; font-weight: 700; color: var(--text); margin: 0 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.2px; }
  .sd-product-desc { font-size: 12px; color: var(--muted); margin: 0 0 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }

  .sd-product-price-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
  .sd-product-price { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
  .sd-product-compare { font-size: 11px; color: var(--muted); text-decoration: line-through; margin-top: 1px; }
  .sd-product-stock-label { font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: right; }
  .sd-product-stock-val { font-size: 15px; font-weight: 800; text-align: right; }

  .sd-product-actions { display: flex; gap: 8px; }
  .sd-action-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px; border-radius: 9px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.15s; font-family: 'Sora', sans-serif;
  }

  /* ── Empty state ── */
  .sd-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; background: var(--card); border-radius: 20px; border: 1.5px dashed var(--border);
    text-align: center;
  }
  .sd-empty-icon { width: 72px; height: 72px; background: var(--hover); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--muted); }
  .sd-empty-title { font-size: 18px; font-weight: 700; color: var(--text); margin: 0 0 8px; }
  .sd-empty-sub { font-size: 13px; color: var(--muted); margin: 0 0 24px; }

  /* ── Loading ── */
  .sd-loader { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); }
  .sd-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--text); border-radius: 50%; animation: spin 0.7s linear infinite; }

  /* ── Status pages (pending/rejected) ── */
  .sd-status-page { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .sd-status-card { background: var(--card); border-radius: 24px; padding: 48px 40px; max-width: 440px; width: 100%; text-align: center; border: 1px solid var(--border); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
  .sd-status-icon { width: 72px; height: 72px; border-radius: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
  .sd-status-title { font-size: 22px; font-weight: 800; color: var(--text); margin: 0 0 12px; letter-spacing: -0.5px; }
  .sd-status-body { font-size: 13px; color: var(--muted); line-height: 1.7; margin: 0 0 20px; }
  .sd-status-box { border-radius: 12px; padding: 14px 16px; text-align: left; margin-bottom: 24px; }
`;

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
interface OrdersCache {
  all: any[];
  pending: any[];
  confirmed: any[];
  shipped: any[];
  delivered: any[];
  timestamp: number;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, iconBg, iconColor, delay = 0 }) {
  return (
    <div className="sd-stat" style={{ animationDelay: `${delay}ms` }}>
      <div
        className="sd-stat-icon"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="sd-stat-label">{label}</p>
        <p className="sd-stat-value">{value}</p>
      </div>
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onEdit, onDelete, delay = 0 }) {
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

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sellerStatus, setSellerStatus] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersCache, setOrdersCache] = useState<OrdersCache>({
    all: [],
    pending: [],
    confirmed: [],
    shipped: [],
    delivered: [],
    timestamp: 0,
  });
  const [orderStats, setOrderStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const preloadAllOrders = async () => {
      try {
        const userStr = localStorage.getItem("yog_user");
        if (!userStr) return;
        const [all, pending, confirmed, shipped, delivered] = await Promise.all(
          [
            fetch("/api/seller/orders", {
              headers: { "x-user-data": userStr },
            }).then((r) => r.json()),
            fetch("/api/seller/orders?status=pending", {
              headers: { "x-user-data": userStr },
            }).then((r) => r.json()),
            fetch("/api/seller/orders?status=confirmed", {
              headers: { "x-user-data": userStr },
            }).then((r) => r.json()),
            fetch("/api/seller/orders?status=shipped", {
              headers: { "x-user-data": userStr },
            }).then((r) => r.json()),
            fetch("/api/seller/orders?status=delivered", {
              headers: { "x-user-data": userStr },
            }).then((r) => r.json()),
          ],
        );
        setOrdersCache({
          all: all.orders || [],
          pending: pending.orders || [],
          confirmed: confirmed.orders || [],
          shipped: shipped.orders || [],
          delivered: delivered.orders || [],
          timestamp: Date.now(),
        });
        setOrderStats(all.stats);
      } catch (err) {
        console.error("Error preloading orders:", err);
      }
    };
    if (!isLoading && user) preloadAllOrders();
  }, [isLoading, user]);

  const checkAuth = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    if (userData.role !== "SELLER" && userData.role !== "ADMIN") {
      router.push("/seller/apply");
      return;
    }
    if (userData.role === "ADMIN") {
      setIsLoading(false);
      await fetchProducts(userStr);
      return;
    }
    await checkSellerStatus(userStr);
    await fetchProducts(userStr);
  };

  const checkSellerStatus = async (userStr: string) => {
    try {
      const res = await fetch("/api/seller/status", {
        headers: { "x-user-data": userStr },
      });
      setSellerStatus(await res.json());
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (userStr?: string) => {
    try {
      const res = await fetch("/api/products", {
        headers: {
          "x-user-data": userStr || localStorage.getItem("yog_user") || "",
        },
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { "x-user-data": userStr || "" },
      });
      if (res.ok) {
        alert("Product deleted!");
        fetchProducts();
      } else {
        const d = await res.json();
        alert(d.error || "Failed");
      }
    } catch {
      alert("Failed to delete product");
    }
  };

  const refreshOrdersCache = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;
    const [all, pending, confirmed, shipped, delivered] = await Promise.all([
      fetch("/api/seller/orders", { headers: { "x-user-data": userStr } }).then(
        (r) => r.json(),
      ),
      fetch("/api/seller/orders?status=pending", {
        headers: { "x-user-data": userStr },
      }).then((r) => r.json()),
      fetch("/api/seller/orders?status=confirmed", {
        headers: { "x-user-data": userStr },
      }).then((r) => r.json()),
      fetch("/api/seller/orders?status=shipped", {
        headers: { "x-user-data": userStr },
      }).then((r) => r.json()),
      fetch("/api/seller/orders?status=delivered", {
        headers: { "x-user-data": userStr },
      }).then((r) => r.json()),
    ]);
    setOrdersCache({
      all: all.orders || [],
      pending: pending.orders || [],
      confirmed: confirmed.orders || [],
      shipped: shipped.orders || [],
      delivered: delivered.orders || [],
      timestamp: Date.now(),
    });
    setOrderStats(all.stats);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="sd-loader">
          <div className="sd-spinner" />
        </div>
      </>
    );
  }

  // ── Pending approval ─────────────────────────────────────────────────────────
  if (
    sellerStatus?.seller &&
    !sellerStatus.seller.approved &&
    !sellerStatus.seller.rejectionReason
  ) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <Navbar />
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
              Thank you for applying! Our team is reviewing your application.
              This typically takes 2–3 business days.
            </p>
            <div
              className="sd-status-box"
              style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <p style={{ fontSize: 12, color: "#1d4ed8", margin: 0 }}>
                We'll notify you via email once your application has been
                reviewed.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Rejected ─────────────────────────────────────────────────────────────────
  if (sellerStatus?.seller?.rejectionReason) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <Navbar />
        <div className="sd-status-page">
          <div className="sd-status-card">
            <div
              className="sd-status-icon"
              style={{ background: "#fef2f2", color: "var(--error)" }}
            >
              <XCircleIco size={32} />
            </div>
            <h1 className="sd-status-title">Application Not Approved</h1>
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
                {sellerStatus.seller.rejectionReason}
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
      </>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  const totalStock = products.reduce(
    (s, p) => s + p.variants.reduce((vs, v) => vs + v.quantity, 0),
    0,
  );
  const publishedCount = products.filter(
    (p) => p.status === "PUBLISHED",
  ).length;

  const statCards = [
    {
      icon: PackageIco,
      label: "Total Products",
      value: products.length,
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
    },
    {
      icon: BagIco,
      label: "Total Orders",
      value: orderStats?.total || 0,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      icon: DollarIco,
      label: "Revenue (ETB)",
      value: (orderStats?.revenue || 0).toLocaleString(),
      iconBg: "#faf5ff",
      iconColor: "#7c3aed",
    },
    {
      icon: TrendIco,
      label: "Pending Orders",
      value: orderStats?.pending || 0,
      iconBg: "#fff7ed",
      iconColor: "#d97706",
    },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar />

      <div className="sd-page">
        <div className="sd-wrap">
          {/* ── Header ── */}
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
                here's your store overview
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

          {/* ── Stats ── */}
          <div className="sd-stats">
            {statCards.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 60} />
            ))}
          </div>

          {/* ── Tabs ── */}
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

          {/* ── Products tab ── */}
          {activeTab === "products" && (
            <>
              {/* Toolbar */}
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
                  <div className="sd-meta-chip" style={{ display: "flex" }}>
                    <PackageIco
                      size={12}
                      style={{ marginRight: 4, color: "var(--muted)" }}
                    />
                    {totalStock} in stock
                  </div>
                </div>
              </div>

              {/* Grid */}
              {products.length > 0 ? (
                <div className="sd-grid">
                  {products.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      delay={i * 40}
                      onEdit={(p) => setEditingProduct(p)}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="sd-empty">
                  <div className="sd-empty-icon">
                    <PackageIco size={32} />
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

          {/* ── Orders tab ── */}
          {activeTab === "orders" && (
            <OrdersTab
              isActive={activeTab === "orders"}
              ordersCache={ordersCache}
              onRefreshCache={refreshOrdersCache}
            />
          )}
        </div>
      </div>

      {/* ── Add modal ── */}
      {showAddModal && (
        <AddProductForm
          onClose={() => setShowAddModal(false)}
          onSubmit={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
      )}

      {/* ── Edit modal ── */}
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
