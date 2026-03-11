"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const PauseIcon = () => (
  <svg
    width="16"
    height="16"
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
    width="16"
    height="16"
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
    width="16"
    height="16"
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const AlertIcon = () => (
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Sora',sans-serif; background:#f6f5f3; }
  .admin-page { min-height:100vh; padding-top:80px; padding-bottom:60px; }
  .admin-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
  .admin-header { margin-bottom:32px; }
  .admin-title { font-size:28px; font-weight:800; color:#1a1714; letter-spacing:-0.7px; }
  .admin-subtitle { font-size:14px; color:#9e9890; margin-top:6px; }
  
  .sellers-grid { display:grid; gap:20px; }
  .seller-card { background:#fff; border-radius:16px; border:1px solid #e8e4de; padding:20px; 
    box-shadow:0 2px 12px rgba(0,0,0,0.04); transition:transform 0.2s, box-shadow 0.2s; }
  .seller-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.08); }
  
  .seller-header { display:flex; gap:16px; margin-bottom:16px; }
  .seller-logo { width:64px; height:64px; border-radius:12px; object-fit:cover; background:#f6f5f3; 
    border:2px solid #e8e4de; }
  .seller-info { flex:1; }
  .seller-brand { font-size:18px; font-weight:700; color:#1a1714; margin-bottom:4px; }
  .seller-email { font-size:13px; color:#9e9890; }
  .seller-slug { font-size:12px; color:#2563eb; font-weight:600; margin-top:4px; }
  
  .seller-meta { display:flex; gap:16px; margin-bottom:16px; padding:12px; background:#f6f5f3; 
    border-radius:10px; font-size:12px; }
  .meta-item { display:flex; flex-direction:column; gap:2px; }
  .meta-label { color:#9e9890; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
  .meta-value { color:#1a1714; font-weight:700; }
  
  .seller-actions { display:flex; flex-wrap:wrap; gap:8px; }
  .action-btn { padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; 
    cursor:pointer; transition:all 0.15s; display:inline-flex; align-items:center; gap:6px; 
    border:none; font-family:'Sora',sans-serif; }
  .action-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-approve { background:#16a34a; color:#fff; }
  .btn-approve:hover:not(:disabled) { background:#15803d; transform:translateY(-1px); }
  .btn-reject { background:#dc2626; color:#fff; }
  .btn-reject:hover:not(:disabled) { background:#b91c1c; transform:translateY(-1px); }
  .btn-pause { background:#f59e0b; color:#fff; }
  .btn-pause:hover:not(:disabled) { background:#d97706; transform:translateY(-1px); }
  .btn-unpause { background:#10b981; color:#fff; }
  .btn-unpause:hover:not(:disabled) { background:#059669; transform:translateY(-1px); }
  .btn-suspend { background:#7c3aed; color:#fff; }
  .btn-suspend:hover:not(:disabled) { background:#6d28d9; transform:translateY(-1px); }
  .btn-delete { background:#ef4444; color:#fff; }
  .btn-delete:hover:not(:disabled) { background:#dc2626; transform:translateY(-1px); }
  
  .status-badge { display:inline-block; padding:4px 12px; border-radius:6px; font-size:11px; 
    font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
  .status-pending { background:#fef3c7; color:#92400e; }
  .status-approved { background:#d1fae5; color:#065f46; }
  .status-rejected { background:#fee2e2; color:#991b1b; }
  .status-paused { background:#fef3c7; color:#92400e; }
  .status-suspended { background:#ede9fe; color:#5b21b6; }
  .status-deleted { background:#fee2e2; color:#991b1b; }
  
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:100; 
    display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal { background:#fff; border-radius:20px; max-width:500px; width:100%; 
    box-shadow:0 20px 60px rgba(0,0,0,0.3); }
  .modal-header { padding:24px; border-bottom:1px solid #e8e4de; display:flex; align-items:center; gap:12px; }
  .modal-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; 
    justify-content:center; }
  .modal-title { font-size:18px; font-weight:800; color:#1a1714; }
  .modal-body { padding:24px; }
  .modal-text { font-size:14px; color:#4b5563; line-height:1.6; margin-bottom:16px; }
  .modal-input { width:100%; padding:12px; border:2px solid #e8e4de; border-radius:10px; 
    font-size:14px; font-family:'Sora',sans-serif; margin-bottom:16px; }
  .modal-input:focus { outline:none; border-color:#2563eb; }
  .modal-footer { padding:20px 24px; border-top:1px solid #e8e4de; display:flex; gap:12px; 
    justify-content:flex-end; }
  
  .empty-state { text-align:center; padding:60px 20px; }
  .empty-icon { font-size:64px; margin-bottom:16px; }
  .empty-title { font-size:20px; font-weight:700; color:#1a1714; margin-bottom:8px; }
  .empty-text { font-size:14px; color:#9e9890; }
`;

interface Seller {
  id: string;
  brandName: string;
  storeSlug: string;
  storeLogo: string | null;
  status: string;
  createdAt: string;
  pausedReason?: string | null;
  suspendedReason?: string | null;
  user: {
    name: string;
    email: string;
  };
  _count: {
    products: number;
    orders: number;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{
    action: "pause" | "suspend" | "delete" | null;
    seller: Seller | null;
  }>({ action: null, seller: null });
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkAdmin();
    loadSellers();
  }, []);

  const checkAdmin = () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "ADMIN") {
      router.push("/");
    }
  };

  const loadSellers = async () => {
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/admin/sellers", {
        headers: { "x-user-data": userStr || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setSellers(data.sellers || []);
      }
    } catch (error) {
      console.error("Failed to load sellers:", error);
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
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({ sellerId, action }),
      });

      if (res.ok) {
        await loadSellers();
      }
    } catch (error) {
      console.error("Action failed:", error);
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
          "x-user-data": userStr || "",
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
        setReason("");
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; text: string }> = {
      PENDING: { class: "status-pending", text: "Pending" },
      APPROVED: { class: "status-approved", text: "Active" },
      REJECTED: { class: "status-rejected", text: "Rejected" },
      PAUSED: { class: "status-paused", text: "Paused" },
      SUSPENDED: { class: "status-suspended", text: "Suspended" },
      DELETED: { class: "status-deleted", text: "Deleted" },
    };
    const badge = badges[status] || badges.PENDING;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (isLoading) {
    return (
      <>
        <style>{CSS}</style>
        <Navbar />
        <div className="admin-page">
          <div className="admin-wrap">
            <div className="empty-state">
              <LoaderIcon />
              <p className="empty-text">Loading sellers...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <div className="admin-page">
        <div className="admin-wrap">
          <div className="admin-header">
            <h1 className="admin-title">Seller Management</h1>
            <p className="admin-subtitle">
              Manage seller applications and accounts
            </p>
          </div>

          {sellers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2 className="empty-title">No Sellers Yet</h2>
              <p className="empty-text">Seller applications will appear here</p>
            </div>
          ) : (
            <div className="sellers-grid">
              {sellers.map((seller) => (
                <div key={seller.id} className="seller-card">
                  <div className="seller-header">
                    {seller.storeLogo && (
                      <img
                        src={seller.storeLogo}
                        alt={seller.brandName}
                        className="seller-logo"
                      />
                    )}
                    <div className="seller-info">
                      <div className="seller-brand">{seller.brandName}</div>
                      <div className="seller-email">{seller.user.email}</div>
                      <div className="seller-slug">@{seller.storeSlug}</div>
                    </div>
                    {getStatusBadge(seller.status)}
                  </div>

                  <div className="seller-meta">
                    <div className="meta-item">
                      <span className="meta-label">Products</span>
                      <span className="meta-value">
                        {seller._count.products}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Orders</span>
                      <span className="meta-value">{seller._count.orders}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Joined</span>
                      <span className="meta-value">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {(seller.pausedReason || seller.suspendedReason) && (
                    <div
                      style={{
                        marginBottom: 12,
                        padding: 12,
                        background: "#fef3c7",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#92400e",
                      }}
                    >
                      <strong>Reason:</strong>{" "}
                      {seller.pausedReason || seller.suspendedReason}
                    </div>
                  )}

                  <div className="seller-actions">
                    {seller.status === "PENDING" && (
                      <>
                        <button
                          className="action-btn btn-approve"
                          onClick={() =>
                            handleQuickAction(seller.id, "approve")
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? <LoaderIcon /> : <CheckIcon />}
                          Approve
                        </button>
                        <button
                          className="action-btn btn-reject"
                          onClick={() => handleQuickAction(seller.id, "reject")}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <LoaderIcon /> : <XIcon />}
                          Reject
                        </button>
                      </>
                    )}

                    {seller.status === "APPROVED" && (
                      <>
                        <button
                          className="action-btn btn-pause"
                          onClick={() =>
                            setActionModal({ action: "pause", seller })
                          }
                          disabled={isProcessing}
                        >
                          <PauseIcon />
                          Pause
                        </button>
                        <button
                          className="action-btn btn-suspend"
                          onClick={() =>
                            setActionModal({ action: "suspend", seller })
                          }
                          disabled={isProcessing}
                        >
                          <BanIcon />
                          Suspend
                        </button>
                      </>
                    )}

                    {seller.status === "PAUSED" && (
                      <>
                        <button
                          className="action-btn btn-unpause"
                          onClick={() =>
                            handleQuickAction(seller.id, "unpause")
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? <LoaderIcon /> : <PlayIcon />}
                          Unpause
                        </button>
                        <button
                          className="action-btn btn-suspend"
                          onClick={() =>
                            setActionModal({ action: "suspend", seller })
                          }
                          disabled={isProcessing}
                        >
                          <BanIcon />
                          Suspend
                        </button>
                      </>
                    )}

                    {seller.status === "SUSPENDED" && (
                      <button
                        className="action-btn btn-unpause"
                        onClick={() =>
                          handleQuickAction(seller.id, "unsuspend")
                        }
                        disabled={isProcessing}
                      >
                        {isProcessing ? <LoaderIcon /> : <PlayIcon />}
                        Unsuspend
                      </button>
                    )}

                    {seller.status === "REJECTED" && (
                      <button
                        className="action-btn btn-approve"
                        onClick={() => handleQuickAction(seller.id, "approve")}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <LoaderIcon /> : <CheckIcon />}
                        Approve
                      </button>
                    )}

                    {seller.status !== "DELETED" && (
                      <button
                        className="action-btn btn-delete"
                        onClick={() =>
                          setActionModal({ action: "delete", seller })
                        }
                        disabled={isProcessing}
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {actionModal.action && actionModal.seller && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              !isProcessing && setActionModal({ action: null, seller: null })
            }
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div
                  className="modal-icon"
                  style={{
                    background:
                      actionModal.action === "delete"
                        ? "#fee2e2"
                        : actionModal.action === "suspend"
                          ? "#ede9fe"
                          : "#fef3c7",
                  }}
                >
                  <AlertIcon />
                </div>
                <div>
                  <div className="modal-title">
                    {actionModal.action === "pause" && "Pause Account"}
                    {actionModal.action === "suspend" && "Suspend Account"}
                    {actionModal.action === "delete" && "Delete Account"}
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <p className="modal-text">
                  {actionModal.action === "pause" &&
                    "This seller won't be able to post new products or edit existing ones until unpaused."}
                  {actionModal.action === "suspend" &&
                    "All products will be hidden and the seller won't be able to access their account until unsuspended."}
                  {actionModal.action === "delete" &&
                    "This will permanently delete the seller account and all their data. This action cannot be undone."}
                </p>
                <p className="modal-text">
                  <strong>Seller:</strong> {actionModal.seller.brandName} (@
                  {actionModal.seller.storeSlug})
                </p>
                <textarea
                  className="modal-input"
                  placeholder={`Reason for ${actionModal.action}ing (optional)`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="action-btn"
                  style={{ background: "#f6f5f3", color: "#1a1714" }}
                  onClick={() => setActionModal({ action: null, seller: null })}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className={`action-btn ${
                    actionModal.action === "delete"
                      ? "btn-delete"
                      : actionModal.action === "suspend"
                        ? "btn-suspend"
                        : "btn-pause"
                  }`}
                  onClick={handleModalAction}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <LoaderIcon /> Processing...
                    </>
                  ) : (
                    <>
                      {actionModal.action === "pause" && <PauseIcon />}
                      {actionModal.action === "suspend" && <BanIcon />}
                      {actionModal.action === "delete" && <TrashIcon />}
                      Confirm
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
