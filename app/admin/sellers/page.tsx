"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// ── Icons ──────────────────────────────────────────────────────────────────
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
const PhoneIcon = () => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MapPinIcon = () => (
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
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ShirtIcon = () => (
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
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
  </svg>
);
const BriefIcon = () => (
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
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const CalIcon = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IGIcon = () => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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

// ── Types ──────────────────────────────────────────────────────────────────
interface Seller {
  id: string;
  userId: string;
  brandName: string;
  ownerName: string;
  phone: string;
  email: string;
  instagram: string | null;
  location: string;
  clothingType: string;
  businessType: string;
  experience: string | null;
  description: string | null;
  approved: boolean;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: { name: string; email: string; role: string };
}

type FilterType = "all" | "pending" | "approved" | "rejected";

// ── Status badge ───────────────────────────────────────────────────────────
const StatusBadge = ({ seller }: { seller: Seller }) => {
  if (seller.approved)
    return (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600"
        style={{ border: "1px solid #a7f3d0" }}
      >
        <CheckIcon />
        Approved
      </span>
    );
  if (seller.rejectionReason)
    return (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-500"
        style={{ border: "1px solid #fecaca" }}
      >
        <XIcon />
        Rejected
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600"
      style={{ border: "1px solid #fde68a" }}
    >
      <ClockIcon />
      Pending
    </span>
  );
};

// ── Meta pill ──────────────────────────────────────────────────────────────
const Meta = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-[#9e9890]">
    <span className="text-[#b8b4ae]">{icon}</span>
    {text}
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminSellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<
    "approve" | "reject" | null
  >(null);

  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login?redirect=/admin/sellers");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    setIsAuthenticated(true);
    fetchSellers();
  }, [router]);

  const fetchSellers = async () => {
    try {
      const res = await fetch("/api/admin/sellers");
      const data = await res.json();
      if (res.ok) {
        setSellers(data.sellers);
        setFilteredSellers(data.sellers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let f = sellers;
    if (filter === "pending")
      f = f.filter((s) => !s.approved && !s.rejectionReason);
    if (filter === "approved") f = f.filter((s) => s.approved);
    if (filter === "rejected") f = f.filter((s) => !!s.rejectionReason);
    if (searchQuery)
      f = f.filter(
        (s) =>
          s.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    setFilteredSellers(f);
  }, [filter, searchQuery, sellers]);

  const handleApprove = async (sellerId: string) => {
    if (!confirm("Approve this seller?")) return;
    setActionLoading("approve");
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchSellers();
        setSelectedSeller(null);
      } else alert((await res.json()).error || "Failed");
    } catch {
      alert("Failed to approve seller");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (sellerId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    if (!confirm("Reject this seller?")) return;
    setActionLoading("reject");
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (res.ok) {
        fetchSellers();
        setSelectedSeller(null);
        setRejectionReason("");
      } else alert((await res.json()).error || "Failed");
    } catch {
      alert("Failed to reject seller");
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    total: sellers.length,
    pending: sellers.filter((s) => !s.approved && !s.rejectionReason).length,
    approved: sellers.filter((s) => s.approved).length,
    rejected: sellers.filter((s) => !!s.rejectionReason).length,
  };

  if (isLoading || !isAuthenticated)
    return (
      <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid #e8e4de" }}
          />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: "2px solid transparent",
              borderTopColor: "#1a1714",
            }}
          />
        </div>
      </div>
    );

  const FILTERS: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "approved", label: "Approved", count: stats.approved },
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
      label: "Approved",
      value: stats.approved,
      accent: "#059669",
      bg: "#ecfdf5",
      icon: <CheckIcon />,
    },
    {
      label: "Rejected",
      value: stats.rejected,
      accent: "#dc2626",
      bg: "#fef2f2",
      icon: <XIcon />,
    },
  ];

  return (
    <>
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
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search brand, owner, or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-[10px] text-[13px] font-medium text-[#1a1714] bg-[#f6f5f3] placeholder:text-[#c4c0bb] focus:outline-none transition-all"
                style={{ border: "1px solid #e8e4de" }}
              />
            </div>
            {/* Filter pills */}
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

          {/* List */}
          {filteredSellers.length === 0 ? (
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
              {filteredSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-white rounded-2xl p-5 transition-all hover:shadow-md"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl bg-[#f6f5f3] flex items-center justify-center shrink-0 text-[#9e9890]"
                        style={{ border: "1px solid #e8e4de" }}
                      >
                        <StoreIcon />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="text-[14px] font-extrabold text-[#1a1714] leading-tight">
                            {seller.brandName}
                          </h3>
                          <StatusBadge seller={seller} />
                        </div>
                        <p className="text-[12px] text-[#9e9890] mb-2">
                          {seller.ownerName}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <Meta icon={<MailIcon />} text={seller.email} />
                          <Meta icon={<PhoneIcon />} text={seller.phone} />
                          <Meta icon={<MapPinIcon />} text={seller.location} />
                          <Meta
                            icon={<BriefIcon />}
                            text={seller.businessType}
                          />
                          <Meta
                            icon={<ShirtIcon />}
                            text={seller.clothingType}
                          />
                          <Meta
                            icon={<CalIcon />}
                            text={`Applied ${new Date(seller.createdAt).toLocaleDateString()}`}
                          />
                        </div>
                        {seller.rejectionReason && (
                          <div
                            className="mt-3 px-3 py-2 rounded-[9px] text-[11px] text-red-600 bg-red-50 max-w-lg"
                            style={{ border: "1px solid #fecaca" }}
                          >
                            <span className="font-bold">Rejection reason:</span>{" "}
                            {seller.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View button */}
                    <button
                      onClick={() => {
                        setSelectedSeller(seller);
                        setRejectionReason("");
                      }}
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

      {/* ── Detail Drawer / Modal ── */}
      {selectedSeller && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="bg-white w-full max-w-xl rounded-2xl max-h-[88vh] overflow-y-auto"
            style={{
              border: "1px solid #e8e4de",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10"
              style={{ borderBottom: "1px solid #e8e4de" }}
            >
              <div>
                <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px]">
                  Application
                </p>
                <h2 className="text-[16px] font-extrabold text-[#1a1714] leading-tight">
                  {selectedSeller.brandName}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedSeller(null);
                  setRejectionReason("");
                }}
                className="w-8 h-8 rounded-[9px] bg-[#f6f5f3] flex items-center justify-center text-[#9e9890] hover:bg-[#e8e4de] transition-colors cursor-pointer"
                style={{ border: "1px solid #e8e4de" }}
              >
                <XIcon />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Status */}
              <div className="flex items-center gap-2">
                <StatusBadge seller={selectedSeller} />
                <span className="text-[11px] text-[#9e9890]">
                  Applied{" "}
                  {new Date(selectedSeller.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Business info */}
              <Section label="Business Information">
                <Grid2>
                  <Field label="Brand Name" value={selectedSeller.brandName} />
                  <Field
                    label="Business Type"
                    value={selectedSeller.businessType}
                  />
                  <Field
                    label="Clothing Type"
                    value={selectedSeller.clothingType}
                  />
                  <Field
                    label="Experience"
                    value={selectedSeller.experience || "—"}
                  />
                </Grid2>
              </Section>

              {/* Contact */}
              <Section label="Contact Information">
                <Grid2>
                  <Field label="Owner" value={selectedSeller.ownerName} />
                  <Field label="Email" value={selectedSeller.email} />
                  <Field label="Phone" value={selectedSeller.phone} />
                  <Field label="Location" value={selectedSeller.location} />
                  {selectedSeller.instagram && (
                    <Field label="Instagram" value={selectedSeller.instagram} />
                  )}
                </Grid2>
              </Section>

              {/* Description */}
              {selectedSeller.description && (
                <Section label="Brand Description">
                  <p className="text-[13px] text-[#9e9890] leading-relaxed">
                    {selectedSeller.description}
                  </p>
                </Section>
              )}

              {/* Rejection reason (if already rejected) */}
              {selectedSeller.rejectionReason && (
                <div
                  className="px-4 py-3 rounded-[11px] text-[12px] text-red-600 bg-red-50"
                  style={{ border: "1px solid #fecaca" }}
                >
                  <span className="font-bold">Rejection reason:</span>{" "}
                  {selectedSeller.rejectionReason}
                </div>
              )}

              {/* Actions — pending only */}
              {!selectedSeller.approved && !selectedSeller.rejectionReason && (
                <div
                  className="pt-2"
                  style={{ borderTop: "1px solid #e8e4de" }}
                >
                  <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1px] mb-3">
                    Actions
                  </p>
                  <div className="mb-3">
                    <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                      Rejection reason{" "}
                      <span className="font-normal normal-case tracking-normal text-[#c4c0bb]">
                        (required to reject)
                      </span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      placeholder="Explain why this application is being rejected…"
                      className="w-full px-4 py-3 rounded-[11px] text-[13px] text-[#1a1714] bg-[#f6f5f3] placeholder:text-[#c4c0bb] focus:outline-none transition-all resize-none"
                      style={{ border: "1px solid #e8e4de" }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(selectedSeller.id)}
                      disabled={actionLoading !== null}
                      className="flex-1 py-3 rounded-[11px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 hover:-translate-y-px hover:shadow-md"
                      style={{
                        background: "#ecfdf5",
                        color: "#059669",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      {actionLoading === "approve" ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckIcon /> Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(selectedSeller.id)}
                      disabled={actionLoading !== null}
                      className="flex-1 py-3 rounded-[11px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 hover:-translate-y-px hover:shadow-md"
                      style={{
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                      }}
                    >
                      {actionLoading === "reject" ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <XIcon /> Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────
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
