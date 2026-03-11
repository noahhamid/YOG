"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
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
const PauseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const PlayIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const BanIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const StoreIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ClockIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const MailIcon = () => (
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
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const AlertTriIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  </svg>
);
const LoaderIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{ animation: "admin-spin 0.8s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
  @keyframes admin-spin { to { transform: rotate(360deg); } }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Seller {
  id: string;
  brandName: string;
  storeSlug: string;
  storeLogo: string | null;
  status: string;
  createdAt: string;
  pausedReason?: string | null;
  suspendedReason?: string | null;
  user: { name: string; email: string };
  _count: { products: number; orders: number };
}

type FilterType =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "paused"
  | "suspended";
type ModalAction = "pause" | "suspend" | "delete";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<
  string,
  {
    label: string;
    bg: string;
    color: string;
    border: string;
    icon: React.ReactNode;
  }
> = {
  PENDING: {
    label: "Pending",
    bg: "#fffbeb",
    color: "#d97706",
    border: "#fde68a",
    icon: <ClockIcon />,
  },
  APPROVED: {
    label: "Active",
    bg: "#ecfdf5",
    color: "#059669",
    border: "#a7f3d0",
    icon: <CheckIcon />,
  },
  REJECTED: {
    label: "Rejected",
    bg: "#fef2f2",
    color: "#dc2626",
    border: "#fecaca",
    icon: <XIcon />,
  },
  PAUSED: {
    label: "Paused",
    bg: "#fffbeb",
    color: "#d97706",
    border: "#fde68a",
    icon: <PauseIcon />,
  },
  SUSPENDED: {
    label: "Suspended",
    bg: "#f5f3ff",
    color: "#7c3aed",
    border: "#ddd6fe",
    icon: <BanIcon />,
  },
  DELETED: {
    label: "Deleted",
    bg: "#fef2f2",
    color: "#dc2626",
    border: "#fecaca",
    icon: <TrashIcon />,
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.PENDING;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Meta = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-[#9e9890]">
    <span className="text-[#b8b4ae]">{icon}</span>
    {text}
  </div>
);
const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1px] mb-3">
      {label}
    </p>
    {children}
  </div>
);
const Grid2 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);
const Field = ({ label, value }: { label: string; value: string }) => (
  <div
    className="bg-[#f6f5f3] rounded-[10px] px-3 py-2.5"
    style={{ border: "1px solid #e8e4de" }}
  >
    <p className="text-[10px] font-bold text-[#b8b4ae] uppercase tracking-[0.6px] mb-0.5">
      {label}
    </p>
    <p className="text-[13px] font-semibold text-[#1a1714]">{value}</p>
  </div>
);

interface ActionBtnProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant:
    | "approve"
    | "reject"
    | "pause"
    | "unpause"
    | "suspend"
    | "delete"
    | "ghost";
}
const ActionBtn = ({
  onClick,
  disabled,
  children,
  variant,
}: ActionBtnProps) => {
  const styles: Record<string, { bg: string; color: string; border: string }> =
    {
      approve: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
      reject: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
      pause: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
      unpause: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
      suspend: { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
      delete: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
      ghost: { bg: "#f6f5f3", color: "#1a1714", border: "#e8e4de" },
    };
  const s = styles[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer disabled:opacity-50 hover:-translate-y-px hover:shadow-sm"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontFamily: "'Sora',sans-serif",
      }}
    >
      {children}
    </button>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminSellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [actionModal, setActionModal] = useState<{
    action: ModalAction | null;
    seller: Seller | null;
  }>({ action: null, seller: null });
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr) as { role: string };
    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    setIsAuthenticated(true);
    loadSellers();
  }, [router]);

  const loadSellers = async () => {
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/admin/sellers", {
        headers: { "x-user-data": userStr ?? "" },
      });
      if (res.ok) {
        const data = (await res.json()) as { sellers?: Seller[] };
        setSellers(data.sellers ?? []);
      }
    } catch (err) {
      console.error("Failed to load sellers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (sellerId: string, action: string) => {
    setIsProcessing(true);
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/admin/sellers/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr ?? "",
        },
        body: JSON.stringify({ sellerId, action }),
      });
      if (res.ok) {
        await loadSellers();
        setSelectedSeller(null);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalAction = async () => {
    if (!actionModal.seller || !actionModal.action) return;
    setIsProcessing(true);
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/admin/sellers/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr ?? "",
        },
        body: JSON.stringify({
          sellerId: actionModal.seller.id,
          action: actionModal.action,
          reason: reason.trim() || undefined,
        }),
      });
      if (res.ok) {
        await loadSellers();
        setActionModal({ action: null, seller: null });
        setSelectedSeller(null);
        setReason("");
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtering
  const filtered = sellers.filter((s) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "pending"
          ? s.status === "PENDING"
          : filter === "approved"
            ? s.status === "APPROVED"
            : filter === "rejected"
              ? s.status === "REJECTED"
              : filter === "paused"
                ? s.status === "PAUSED"
                : filter === "suspended"
                  ? s.status === "SUSPENDED"
                  : true;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.brandName.toLowerCase().includes(q) ||
      s.user.name.toLowerCase().includes(q) ||
      s.user.email.toLowerCase().includes(q) ||
      s.storeSlug.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: sellers.length,
    pending: sellers.filter((s) => s.status === "PENDING").length,
    approved: sellers.filter((s) => s.status === "APPROVED").length,
    rejected: sellers.filter((s) => s.status === "REJECTED").length,
    paused: sellers.filter((s) => s.status === "PAUSED").length,
    suspended: sellers.filter((s) => s.status === "SUSPENDED").length,
  };

  const FILTERS: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "approved", label: "Active", count: stats.approved },
    { key: "paused", label: "Paused", count: stats.paused },
    { key: "suspended", label: "Suspended", count: stats.suspended },
    { key: "rejected", label: "Rejected", count: stats.rejected },
  ];

  const STAT_CARDS = [
    {
      label: "Total",
      value: stats.total,
      accent: "#1a1714",
      bg: "#f6f5f3",
      icon: <StoreIcon />,
    },
    {
      label: "Pending",
      value: stats.pending,
      accent: "#d97706",
      bg: "#fffbeb",
      icon: <ClockIcon />,
    },
    {
      label: "Active",
      value: stats.approved,
      accent: "#059669",
      bg: "#ecfdf5",
      icon: <CheckIcon />,
    },
    {
      label: "Suspended",
      value: stats.suspended,
      accent: "#7c3aed",
      bg: "#f5f3ff",
      icon: <BanIcon />,
    },
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <>
        <style>{CSS}</style>
        <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center">
          <div className="relative w-10 h-10">
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid #e8e4de" }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid transparent",
                borderTopColor: "#1a1714",
                animation: "admin-spin 0.8s linear infinite",
              }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <Navbar />

      <main
        className="min-h-screen bg-[#f6f5f3] pt-28 pb-20 px-4"
        style={{ fontFamily: "'Sora',sans-serif" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-7">
            <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-1">
              Admin
            </p>
            <h1 className="text-[28px] font-extrabold text-[#1a1714] tracking-tight leading-none">
              Seller Management
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {STAT_CARDS.map(({ label, value, accent, bg, icon }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-4 flex items-center gap-3"
                style={{ border: "1px solid #e8e4de" }}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{
                    background: bg,
                    color: accent,
                    border: `1px solid ${bg === "#f6f5f3" ? "#e8e4de" : bg}`,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <p
                    className="text-[20px] font-extrabold tracking-tight leading-none"
                    style={{ color: accent }}
                  >
                    {value}
                  </p>
                  <p className="text-[10px] font-bold text-[#9e9890] uppercase tracking-[0.6px] mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div
            className="bg-white rounded-2xl p-4 mb-5 flex flex-col md:flex-row gap-3"
            style={{ border: "1px solid #e8e4de" }}
          >
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search brand, owner, email or slug…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-[10px] text-[13px] font-medium text-[#1a1714] bg-[#f6f5f3] placeholder:text-[#c4c0bb] focus:outline-none"
                style={{ border: "1px solid #e8e4de" }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {FILTERS.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="px-4 py-2.5 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer"
                  style={{
                    background: filter === key ? "#1a1714" : "#f6f5f3",
                    color: filter === key ? "#fff" : "#9e9890",
                    border:
                      filter === key
                        ? "1px solid #1a1714"
                        : "1px solid #e8e4de",
                  }}
                >
                  {label} <span className="opacity-60 ml-0.5">({count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seller list */}
          {filtered.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-14 text-center"
              style={{ border: "1px solid #e8e4de" }}
            >
              <div
                className="w-14 h-14 rounded-2xl bg-[#f6f5f3] flex items-center justify-center mx-auto mb-4 text-[#9e9890]"
                style={{ border: "1px solid #e8e4de" }}
              >
                <AlertIcon />
              </div>
              <p className="text-[14px] font-semibold text-[#9e9890]">
                No sellers found
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-white rounded-2xl p-5 transition-all hover:shadow-md"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {seller.storeLogo ? (
                        <img
                          src={seller.storeLogo}
                          alt={seller.brandName}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                          style={{ border: "1px solid #e8e4de" }}
                        />
                      ) : (
                        <div
                          className="w-11 h-11 rounded-xl bg-[#f6f5f3] flex items-center justify-center shrink-0 text-[#9e9890]"
                          style={{ border: "1px solid #e8e4de" }}
                        >
                          <StoreIcon />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="text-[14px] font-extrabold text-[#1a1714] leading-tight">
                            {seller.brandName}
                          </h3>
                          <StatusBadge status={seller.status} />
                        </div>
                        <p className="text-[12px] text-[#9e9890] mb-2">
                          @{seller.storeSlug}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <Meta icon={<MailIcon />} text={seller.user.email} />
                          <Meta
                            icon={<StoreIcon />}
                            text={`${seller._count.products} products · ${seller._count.orders} orders`}
                          />
                          <Meta
                            icon={<ClockIcon />}
                            text={`Joined ${new Date(seller.createdAt).toLocaleDateString()}`}
                          />
                        </div>
                        {(seller.pausedReason ?? seller.suspendedReason) && (
                          <div
                            className="mt-2 px-3 py-1.5 rounded-[9px] text-[11px] text-amber-700 bg-amber-50 max-w-lg"
                            style={{ border: "1px solid #fde68a" }}
                          >
                            <span className="font-bold">Reason:</span>{" "}
                            {seller.pausedReason ?? seller.suspendedReason}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSeller(seller)}
                      className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[12px] font-bold text-[#1a1714] bg-[#f6f5f3] hover:bg-[#e8e4de] transition-colors cursor-pointer"
                      style={{ border: "1px solid #e8e4de" }}
                    >
                      <EyeIcon /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Detail modal ── */}
      <AnimatePresence>
        {selectedSeller && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(3px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isProcessing && setSelectedSeller(null)}
          >
            <motion.div
              className="bg-white w-full max-w-xl rounded-2xl max-h-[88vh] overflow-y-auto"
              style={{
                border: "1px solid #e8e4de",
                fontFamily: "'Sora',sans-serif",
              }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10"
                style={{ borderBottom: "1px solid #e8e4de" }}
              >
                <div>
                  <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px]">
                    Seller
                  </p>
                  <h2 className="text-[16px] font-extrabold text-[#1a1714] leading-tight">
                    {selectedSeller.brandName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="w-8 h-8 rounded-[9px] bg-[#f6f5f3] flex items-center justify-center text-[#9e9890] hover:bg-[#e8e4de] transition-colors cursor-pointer"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  <XIcon />
                </button>
              </div>

              <div className="px-6 py-5 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedSeller.status} />
                  <span className="text-[11px] text-[#9e9890]">
                    Joined{" "}
                    {new Date(selectedSeller.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Section label="Store Information">
                  <Grid2>
                    <Field
                      label="Brand Name"
                      value={selectedSeller.brandName}
                    />
                    <Field
                      label="Store Slug"
                      value={`@${selectedSeller.storeSlug}`}
                    />
                    <Field
                      label="Products"
                      value={String(selectedSeller._count.products)}
                    />
                    <Field
                      label="Orders"
                      value={String(selectedSeller._count.orders)}
                    />
                  </Grid2>
                </Section>

                <Section label="Account">
                  <Grid2>
                    <Field label="Owner" value={selectedSeller.user.name} />
                    <Field label="Email" value={selectedSeller.user.email} />
                  </Grid2>
                </Section>

                {(selectedSeller.pausedReason ??
                  selectedSeller.suspendedReason) && (
                  <div
                    className="px-4 py-3 rounded-[11px] text-[12px] text-amber-700 bg-amber-50"
                    style={{ border: "1px solid #fde68a" }}
                  >
                    <span className="font-bold">Active reason:</span>{" "}
                    {selectedSeller.pausedReason ??
                      selectedSeller.suspendedReason}
                  </div>
                )}

                {/* Actions */}
                <div
                  className="pt-2"
                  style={{ borderTop: "1px solid #e8e4de" }}
                >
                  <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1px] mb-3">
                    Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeller.status === "PENDING" && (
                      <>
                        <ActionBtn
                          variant="approve"
                          disabled={isProcessing}
                          onClick={() =>
                            handleQuickAction(selectedSeller.id, "approve")
                          }
                        >
                          {isProcessing ? <LoaderIcon /> : <CheckIcon />}{" "}
                          Approve
                        </ActionBtn>
                        <ActionBtn
                          variant="reject"
                          disabled={isProcessing}
                          onClick={() =>
                            handleQuickAction(selectedSeller.id, "reject")
                          }
                        >
                          {isProcessing ? <LoaderIcon /> : <XIcon />} Reject
                        </ActionBtn>
                      </>
                    )}
                    {selectedSeller.status === "APPROVED" && (
                      <>
                        <ActionBtn
                          variant="pause"
                          disabled={isProcessing}
                          onClick={() =>
                            setActionModal({
                              action: "pause",
                              seller: selectedSeller,
                            })
                          }
                        >
                          <PauseIcon /> Pause
                        </ActionBtn>
                        <ActionBtn
                          variant="suspend"
                          disabled={isProcessing}
                          onClick={() =>
                            setActionModal({
                              action: "suspend",
                              seller: selectedSeller,
                            })
                          }
                        >
                          <BanIcon /> Suspend
                        </ActionBtn>
                      </>
                    )}
                    {selectedSeller.status === "PAUSED" && (
                      <>
                        <ActionBtn
                          variant="unpause"
                          disabled={isProcessing}
                          onClick={() =>
                            handleQuickAction(selectedSeller.id, "unpause")
                          }
                        >
                          {isProcessing ? <LoaderIcon /> : <PlayIcon />} Unpause
                        </ActionBtn>
                        <ActionBtn
                          variant="suspend"
                          disabled={isProcessing}
                          onClick={() =>
                            setActionModal({
                              action: "suspend",
                              seller: selectedSeller,
                            })
                          }
                        >
                          <BanIcon /> Suspend
                        </ActionBtn>
                      </>
                    )}
                    {selectedSeller.status === "SUSPENDED" && (
                      <ActionBtn
                        variant="unpause"
                        disabled={isProcessing}
                        onClick={() =>
                          handleQuickAction(selectedSeller.id, "unsuspend")
                        }
                      >
                        {isProcessing ? <LoaderIcon /> : <PlayIcon />} Unsuspend
                      </ActionBtn>
                    )}
                    {selectedSeller.status === "REJECTED" && (
                      <ActionBtn
                        variant="approve"
                        disabled={isProcessing}
                        onClick={() =>
                          handleQuickAction(selectedSeller.id, "approve")
                        }
                      >
                        {isProcessing ? <LoaderIcon /> : <CheckIcon />} Approve
                      </ActionBtn>
                    )}
                    {selectedSeller.status !== "DELETED" && (
                      <ActionBtn
                        variant="delete"
                        disabled={isProcessing}
                        onClick={() =>
                          setActionModal({
                            action: "delete",
                            seller: selectedSeller,
                          })
                        }
                      >
                        <TrashIcon /> Delete
                      </ActionBtn>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm modal ── */}
      <AnimatePresence>
        {actionModal.action && actionModal.seller && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              !isProcessing && setActionModal({ action: null, seller: null })
            }
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                border: "1px solid #e8e4de",
                fontFamily: "'Sora',sans-serif",
              }}
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center gap-3 px-6 py-5"
                style={{ borderBottom: "1px solid #e8e4de" }}
              >
                <div
                  className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{
                    background:
                      actionModal.action === "delete"
                        ? "#fef2f2"
                        : actionModal.action === "suspend"
                          ? "#f5f3ff"
                          : "#fffbeb",
                    color:
                      actionModal.action === "delete"
                        ? "#dc2626"
                        : actionModal.action === "suspend"
                          ? "#7c3aed"
                          : "#d97706",
                  }}
                >
                  <AlertTriIcon />
                </div>
                <div>
                  <p className="text-[16px] font-extrabold text-[#1a1714]">
                    {actionModal.action === "pause" && "Pause Account"}
                    {actionModal.action === "suspend" && "Suspend Account"}
                    {actionModal.action === "delete" && "Delete Account"}
                  </p>
                  <p className="text-[12px] text-[#9e9890]">
                    {actionModal.seller.brandName}
                  </p>
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-[13px] text-[#4b5563] leading-relaxed mb-4">
                  {actionModal.action === "pause" &&
                    "This seller won't be able to post new products or edit existing ones until unpaused."}
                  {actionModal.action === "suspend" &&
                    "All products will be hidden and the seller can't access their account until unsuspended."}
                  {actionModal.action === "delete" &&
                    "This will permanently delete the seller account and all their data. This cannot be undone."}
                </p>
                <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                  Reason{" "}
                  <span className="font-normal normal-case tracking-normal text-[#c4c0bb]">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Reason for ${actionModal.action}ing…`}
                  className="w-full px-4 py-3 rounded-[11px] text-[13px] text-[#1a1714] bg-[#f6f5f3] placeholder:text-[#c4c0bb] focus:outline-none resize-none"
                  style={{ border: "1px solid #e8e4de" }}
                />
              </div>

              <div className="flex gap-3 px-6 pb-5">
                <ActionBtn
                  variant="ghost"
                  disabled={isProcessing}
                  onClick={() => {
                    setActionModal({ action: null, seller: null });
                    setReason("");
                  }}
                >
                  Cancel
                </ActionBtn>
                <button
                  onClick={handleModalAction}
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-[11px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 hover:-translate-y-px hover:shadow-md"
                  style={{
                    background:
                      actionModal.action === "delete"
                        ? "#fef2f2"
                        : actionModal.action === "suspend"
                          ? "#f5f3ff"
                          : "#fffbeb",
                    color:
                      actionModal.action === "delete"
                        ? "#dc2626"
                        : actionModal.action === "suspend"
                          ? "#7c3aed"
                          : "#d97706",
                    border:
                      actionModal.action === "delete"
                        ? "1px solid #fecaca"
                        : actionModal.action === "suspend"
                          ? "1px solid #ddd6fe"
                          : "1px solid #fde68a",
                    fontFamily: "'Sora',sans-serif",
                  }}
                >
                  {isProcessing ? (
                    <>
                      <LoaderIcon /> Processing…
                    </>
                  ) : (
                    <>
                      {actionModal.action === "pause" && (
                        <>
                          <PauseIcon /> Pause
                        </>
                      )}
                      {actionModal.action === "suspend" && (
                        <>
                          <BanIcon /> Suspend
                        </>
                      )}
                      {actionModal.action === "delete" && (
                        <>
                          <TrashIcon /> Delete
                        </>
                      )}
                    </>
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
