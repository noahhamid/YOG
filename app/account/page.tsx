"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────
interface IconProps {
  size?: number;
  d?: string;
  sw?: number;
  fill?: string;
}

const Ico = ({ d, size = 16, sw = 1.75, fill = "none" }: IconProps) => (
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

const ArrowLeftIco = (p: IconProps) => <Ico {...p} d="m15 18-6-6 6-6" />;
const SaveIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8"
  />
);
const UserIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
  />
);
const MailIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"
  />
);
const LockIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"
  />
);
const TrashIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  />
);
const CheckIco = (p: IconProps) => (
  <Ico {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />
);
const AlertIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  />
);
const ClockIco = (p: IconProps) => (
  <Ico {...p} d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
);
const LoaderIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    style={{ animation: "sp-spin 0.8s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  :root {
    --bg: #f6f5f3; --card: #ffffff; --text: #1a1714; --muted: #9e9890;
    --border: #e8e4de; --input-bg: #fdfcfb; --accent: #2563eb;
    --accent-soft: rgba(37,99,235,0.08); --error: #dc2626;
    --error-soft: #fef2f2; --success: #16a34a; --success-soft: #f0fdf4;
    --hover: #f5f3f0; --divider: rgba(0,0,0,0.06);
  }
  @keyframes sp-spin { to { transform: rotate(360deg); } }
  @keyframes sp-fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  .sp-page { min-height:100vh; background:var(--bg); padding-top:72px; font-family:'Sora',sans-serif; }
  .sp-wrap { max-width:900px; margin:0 auto; padding:36px 24px 72px; }

  .sp-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600;
    color:var(--muted); text-decoration:none; transition:color 0.15s; margin-bottom:24px; }
  .sp-back:hover { color:var(--text); }

  .sp-header { margin-bottom:32px; }
  .sp-header-title { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-0.7px; margin:0 0 4px; }
  .sp-header-sub { font-size:13px; color:var(--muted); margin:0; }

  .sp-toast { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px;
    font-size:13px; font-weight:600; margin-bottom:20px; animation:sp-fadeUp 0.2s ease; }

  .sp-card { background:var(--card); border-radius:20px; border:1px solid var(--border);
    padding:28px; box-shadow:0 4px 24px rgba(0,0,0,0.06); animation:sp-fadeUp 0.35s ease; margin-bottom:20px; }

  .sp-section-title { font-size:16px; font-weight:800; color:var(--text); margin:0 0 20px; 
    padding-bottom:12px; border-bottom:1px solid var(--divider); }

  .sp-field { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
  .sp-label { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700;
    color:var(--muted); text-transform:uppercase; letter-spacing:0.6px; }
  .sp-input {
    width:100%; padding:11px 14px; font-size:14px; background:var(--input-bg);
    border:1.5px solid var(--border); border-radius:10px; color:var(--text);
    outline:none; box-sizing:border-box; transition:border-color 0.15s, box-shadow 0.15s;
    font-family:'Sora',sans-serif;
  }
  .sp-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .sp-input:disabled { opacity:0.6; cursor:not-allowed; background:var(--hover); }

  .sp-btn { padding:12px 24px; border-radius:10px; font-size:13px; font-weight:700;
    font-family:'Sora',sans-serif; cursor:pointer; transition:all 0.15s;
    display:inline-flex; align-items:center; justify-content:center; gap:8px; border:none; }
  .sp-btn-primary { background:var(--text); color:#fff; }
  .sp-btn-primary:hover:not(:disabled) { background:#333; transform:translateY(-1px); }
  .sp-btn-danger { background:var(--error); color:#fff; }
  .sp-btn-danger:hover:not(:disabled) { background:#b91c1c; transform:translateY(-1px); }
  .sp-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  .sp-danger-zone { background:var(--error-soft); border:1px solid #fecaca; 
    border-radius:12px; padding:20px; }
  .sp-danger-title { font-size:14px; font-weight:700; color:var(--error); margin:0 0 8px; }
  .sp-danger-text { font-size:12px; color:#991b1b; margin:0 0 16px; line-height:1.6; }

  .sp-loader { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); }
  .sp-spinner { width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--text); border-radius:50%; animation:sp-spin 0.7s linear infinite; }

  .sp-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:100;
    display:flex; align-items:center; justify-content:center; padding:20px; }
  .sp-modal { background:#fff; border-radius:20px; max-width:480px; width:100%;
    box-shadow:0 20px 60px rgba(0,0,0,0.2); }
  .sp-modal-header { padding:20px 24px; border-bottom:1px solid var(--border); }
  .sp-modal-title { font-size:18px; font-weight:800; color:var(--text); margin:0; }
  .sp-modal-body { padding:24px; }
  .sp-modal-footer { padding:16px 24px; border-top:1px solid var(--border);
    display:flex; gap:12px; justify-content:flex-end; }
`;

interface FieldProps {
  label: string;
  icon: React.ComponentType<IconProps>;
  children: React.ReactNode;
}

function Field({ label, icon: Icon, children }: FieldProps) {
  return (
    <div className="sp-field">
      <label className="sp-label">
        <Icon size={12} /> {label}
      </label>
      {children}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [lastNameChange, setLastNameChange] = useState<Date | null>(null);
  const [canChangeName, setCanChangeName] = useState(true);
  const [daysUntilNameChange, setDaysUntilNameChange] = useState(0);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const res = await fetch("/api/user/profile", {
        headers: { "x-user-data": userStr },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.user) {
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
        });

        // Check if user can change name
        if (data.user.lastNameChange) {
          const lastChange = new Date(data.user.lastNameChange);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

          setLastNameChange(lastChange);

          if (lastChange > twoWeeksAgo) {
            setCanChangeName(false);
            const nextChangeDate = new Date(lastChange);
            nextChangeDate.setDate(nextChangeDate.getDate() + 14);
            const daysLeft = Math.ceil(
              (nextChangeDate.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            );
            setDaysUntilNameChange(daysLeft);
          }
        }
      }
    } catch {
      showToast("error", "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      showToast("error", "Name is required");
      return;
    }

    if (!canChangeName) {
      showToast(
        "error",
        `You can change your name again in ${daysUntilNameChange} day${daysUntilNameChange !== 1 ? "s" : ""}`,
      );
      return;
    }

    setIsSaving(true);

    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Name updated successfully!");
        const user = JSON.parse(userStr || "{}");
        const updated = { ...user, name: formData.name };
        localStorage.setItem("yog_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("userLoggedIn"));

        // Update restrictions
        setCanChangeName(false);
        setDaysUntilNameChange(14);
        setLastNameChange(new Date());
      } else {
        showToast("error", data.error || "Failed to update profile");
      }
    } catch {
      showToast("error", "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      showToast("error", "Current password is required");
      return;
    }
    if (!passwordData.newPassword) {
      showToast("error", "New password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast("error", data.error || "Failed to change password");
      }
    } catch {
      showToast("error", "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showToast("error", "Please enter your password");
      return;
    }

    setIsDeleting(true);

    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("yog_user");
        window.location.href = "/";
      } else {
        showToast("error", data.error || "Failed to delete account");
      }
    } catch {
      showToast("error", "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <style>{CSS}</style>
        <Navbar />
        <div className="sp-loader">
          <div className="sp-spinner" />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <div className="sp-page">
        <div className="sp-wrap">
          <Link href="/" className="sp-back">
            <ArrowLeftIco size={15} /> Back to Home
          </Link>

          <div className="sp-header">
            <h1 className="sp-header-title">Account Settings</h1>
            <p className="sp-header-sub">
              Manage your profile, security, and preferences
            </p>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                className="sp-toast"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  background:
                    toast.type === "success"
                      ? "var(--success-soft)"
                      : "var(--error-soft)",
                  color:
                    toast.type === "success"
                      ? "var(--success)"
                      : "var(--error)",
                  border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                {toast.type === "success" ? (
                  <CheckIco size={16} />
                ) : (
                  <AlertIco size={16} />
                )}
                {toast.msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Personal Information */}
          <div className="sp-card">
            <h2 className="sp-section-title">Personal Information</h2>

            {/* Name Change Restriction Notice */}
            {!canChangeName && (
              <div
                className="mb-4 px-4 py-3 rounded-xl flex items-start gap-3"
                style={{ background: "#fef3c7", border: "1px solid #fbbf24" }}
              >
                <ClockIco size={16} />
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#92400e",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    Name Change Restriction
                  </p>
                  <p
                    style={{ fontSize: 11, color: "#92400e", lineHeight: 1.5 }}
                  >
                    You can change your name again in{" "}
                    <strong>
                      {daysUntilNameChange} day
                      {daysUntilNameChange !== 1 ? "s" : ""}
                    </strong>
                    . Names can only be changed once every 2 weeks.
                  </p>
                </div>
              </div>
            )}

            <Field label="Full Name" icon={UserIco}>
              <input
                className="sp-input"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="John Doe"
                disabled={!canChangeName}
              />
              {canChangeName && (
                <p
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}
                >
                  You can change your name once every 2 weeks
                </p>
              )}
            </Field>

            <Field label="Email Address" icon={MailIco}>
              <input
                className="sp-input"
                type="email"
                value={formData.email}
                disabled
                placeholder="john@example.com"
              />
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                Email address cannot be changed
              </p>
            </Field>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving || !canChangeName}
              className="sp-btn sp-btn-primary"
            >
              {isSaving ? (
                <>
                  <LoaderIcon size={14} /> Saving...
                </>
              ) : (
                <>
                  <SaveIco size={14} /> Save Changes
                </>
              )}
            </button>
          </div>

          {/* Change Password */}
          <div className="sp-card">
            <h2 className="sp-section-title">Change Password</h2>

            <div
              className="mb-4 px-4 py-3 rounded-xl"
              style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#1e3a8a",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Forgot your password?
              </p>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: 12,
                  color: "#2563eb",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
                className="hover:underline"
              >
                Reset password via email →
              </Link>
            </div>

            <Field label="Current Password" icon={LockIco}>
              <input
                className="sp-input"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((p) => ({
                    ...p,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
              />
            </Field>
            <Field label="New Password" icon={LockIco}>
              <input
                className="sp-input"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
              />
            </Field>
            <Field label="Confirm New Password" icon={LockIco}>
              <input
                className="sp-input"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
              />
            </Field>
            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="sp-btn sp-btn-primary"
            >
              {isSaving ? (
                <>
                  <LoaderIcon size={14} /> Updating...
                </>
              ) : (
                <>
                  <LockIco size={14} /> Update Password
                </>
              )}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="sp-card">
            <h2 className="sp-section-title">Danger Zone</h2>
            <div className="sp-danger-zone">
              <h3 className="sp-danger-title">Delete Account</h3>
              <p className="sp-danger-text">
                Your account will be scheduled for deletion and permanently
                removed after 30 days. During this period, you can cancel the
                deletion by logging back in. After 30 days, all your data,
                orders, and reviews will be permanently deleted and cannot be
                recovered.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="sp-btn sp-btn-danger"
              >
                <TrashIco size={14} /> Schedule Account Deletion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="sp-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          >
            <motion.div
              className="sp-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sp-modal-header">
                <h3 className="sp-modal-title">Schedule Account Deletion</h3>
              </div>
              <div className="sp-modal-body">
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text)",
                    marginBottom: 16,
                    lineHeight: 1.6,
                  }}
                >
                  Your account will be scheduled for permanent deletion in 30
                  days. You can cancel this by logging back in anytime before
                  the deletion date. After 30 days, all your data will be
                  permanently removed and cannot be recovered.
                </p>

                <Field label="Enter Your Password" icon={LockIco}>
                  <input
                    className="sp-input"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password to confirm"
                    autoFocus
                  />
                </Field>
              </div>
              <div className="sp-modal-footer">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                  disabled={isDeleting}
                  className="sp-btn"
                  style={{ background: "var(--hover)", color: "var(--text)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={!deletePassword || isDeleting}
                  className="sp-btn sp-btn-danger"
                >
                  {isDeleting ? (
                    <>
                      <LoaderIcon size={14} /> Scheduling...
                    </>
                  ) : (
                    <>
                      <TrashIco size={14} /> Schedule Deletion
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
