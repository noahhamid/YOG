"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.75, fill = "none" }) => (
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
const ArrowLeftIco = (p) => <Ico {...p} d="m15 18-6-6 6-6" />;
const CameraIco = (p) => (
  <Ico
    {...p}
    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
  />
);
const SaveIco = (p) => (
  <Ico
    {...p}
    d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8"
  />
);
const EyeIco = (p) => (
  <Ico
    {...p}
    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
  />
);
const MapPinIco = (p) => (
  <Ico
    {...p}
    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  />
);
const InstaIco = (p) => (
  <Ico
    {...p}
    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  />
);
const LinkIco = (p) => (
  <Ico
    {...p}
    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
  />
);
const StoreIco = (p) => (
  <Ico
    {...p}
    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"
  />
);
const FileIco = (p) => (
  <Ico
    {...p}
    d="M14 2H6a2 2 0 0 1-2 2v16a2 2 0 0 1 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M16 13H8m8 4H8m2-8H8"
  />
);
const CheckIco = (p) => (
  <Ico {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />
);
const AlertIco = (p) => (
  <Ico
    {...p}
    d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  />
);
const LoaderIcon = ({ size = 16 }) => (
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

// ─── Compression ──────────────────────────────────────────────────────────────
const compressImage = (file, maxW, maxH, q = 0.85) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        let w = img.width,
          h = img.height;
        if (w > h ? w > maxW : h > maxH) {
          if (w > h) {
            h = (h * maxW) / w;
            w = maxW;
          } else {
            w = (w * maxH) / h;
            h = maxH;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed"))),
          "image/jpeg",
          q,
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── Shared CSS ───────────────────────────────────────────────────────────────
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

  /* breadcrumb */
  .sp-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600;
    color:var(--muted); text-decoration:none; transition:color 0.15s; margin-bottom:24px; }
  .sp-back:hover { color:var(--text); }

  /* header */
  .sp-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:14px; }
  .sp-header-title { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-0.7px; margin:0 0 4px; }
  .sp-header-sub { font-size:13px; color:var(--muted); margin:0; }
  .sp-preview-btn { display:flex; align-items:center; gap:7px; padding:10px 20px;
    background:var(--text); color:#fff; border:none; border-radius:11px;
    font-family:'Sora',sans-serif; font-size:13px; font-weight:600; cursor:pointer;
    text-decoration:none; transition:all 0.15s; }
  .sp-preview-btn:hover { background:#333; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,0.16); }

  /* toast */
  .sp-toast { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px;
    font-size:13px; font-weight:600; margin-bottom:20px; animation:sp-fadeUp 0.2s ease; }

  /* main card */
  .sp-card { background:var(--card); border-radius:20px; border:1px solid var(--border);
    overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06); animation:sp-fadeUp 0.35s ease; }

  /* cover */
  .sp-cover { position:relative; height:220px; background:#1a1714; overflow:hidden; }
  .sp-cover-placeholder { position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; color:rgba(255,255,255,0.35); gap:8px; }
  .sp-cover-placeholder span { font-size:12px; font-weight:600; }
  .sp-cover-hover { position:absolute; inset:0; background:rgba(0,0,0,0.5);
    display:flex; align-items:center; justify-content:center; opacity:0;
    transition:opacity 0.2s; cursor:pointer; backdrop-filter:blur(2px); }
  .sp-cover:hover .sp-cover-hover { opacity:1; }
  .sp-cover-btn { display:flex; align-items:center; gap:8px; padding:10px 20px; background:#fff;
    color:#1a1714; border-radius:10px; font-size:13px; font-weight:700; border:none; cursor:pointer;
    font-family:'Sora',sans-serif; }
  .sp-progress-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.88);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; }
  .sp-progress-bar-wrap { width:180px; height:4px; background:rgba(255,255,255,0.15); border-radius:99px; overflow:hidden; }
  .sp-progress-bar { height:100%; background:#3b82f6; border-radius:99px; transition:width 0.3s; }
  .sp-progress-label { font-size:11px; color:rgba(255,255,255,0.6); font-family:'Sora',sans-serif; }

  /* logo */
  .sp-logo-wrap { margin:-56px 0 0 28px; position:relative; z-index:5; display:inline-block; }
  .sp-logo { width:112px; height:112px; border-radius:20px; border:4px solid #fff;
    box-shadow:0 8px 24px rgba(0,0,0,0.14); overflow:hidden; background:#1a1714;
    display:flex; align-items:center; justify-content:center; }
  .sp-logo-placeholder { color:rgba(255,255,255,0.5); display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:4px; }
  .sp-logo-hover { position:absolute; inset:0; background:rgba(0,0,0,0.7); border-radius:16px;
    display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; cursor:pointer; }
  .sp-logo-wrap:hover .sp-logo-hover { opacity:1; }
  .sp-logo-cam { width:36px; height:36px; background:#fff; border-radius:50%;
    display:flex; align-items:center; justify-content:center; }

  /* form */
  .sp-form-body { padding:24px 28px 28px; }
  .sp-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media (max-width:640px) { .sp-form-grid { grid-template-columns:1fr; } }
  .sp-full { grid-column:1/-1; }

  .sp-field { display:flex; flex-direction:column; gap:8px; }
  .sp-label { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700;
    color:var(--muted); text-transform:uppercase; letter-spacing:0.6px; }
  .sp-input {
    width:100%; padding:11px 14px; font-size:14px; background:var(--input-bg);
    border:1.5px solid var(--border); border-radius:10px; color:var(--text);
    outline:none; box-sizing:border-box; transition:border-color 0.15s, box-shadow 0.15s;
    font-family:'Sora',sans-serif;
  }
  .sp-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .sp-textarea { resize:none; line-height:1.6; }
  .sp-prefix-wrap { display:flex; align-items:center; gap:0; border:1.5px solid var(--border);
    border-radius:10px; background:var(--input-bg); overflow:hidden; transition:border-color 0.15s, box-shadow 0.15s; }
  .sp-prefix-wrap:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .sp-prefix { padding:11px 12px; font-size:12px; font-weight:700; color:var(--muted);
    background:var(--hover); border-right:1px solid var(--border); white-space:nowrap; flex-shrink:0; }
  .sp-prefix-input { flex:1; padding:11px 14px; font-size:14px; background:transparent;
    border:none; color:var(--text); outline:none; font-family:'Sora',sans-serif; min-width:0; }

  .sp-divider { height:1px; background:var(--divider); margin:24px 0; }

  /* save button */
  .sp-save-btn { width:100%; padding:13px; background:var(--text); color:#fff;
    border:none; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer;
    font-family:'Sora',sans-serif; transition:all 0.15s; display:flex;
    align-items:center; justify-content:center; gap:9px; margin-top:28px; }
  .sp-save-btn:hover:not(:disabled) { background:#333; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,0.16); }
  .sp-save-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  /* spinner page */
  .sp-loader { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); }
  .sp-spinner { width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--text); border-radius:50%; animation:sp-spin 0.7s linear infinite; }
`;

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, icon: Icon, children }) {
  return (
    <div className="sp-field">
      <label className="sp-label">
        <Icon size={12} /> {label}
      </label>
      {children}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SellerProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [logoProg, setLogoProg] = useState(0);
  const [coverProg, setCoverProg] = useState(0);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    brandName: "",
    storeSlug: "",
    storeLogo: "",
    storeCover: "",
    storeDescription: "",
    instagram: "",
    location: "",
  });

  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    try {
      const res = await fetch("/api/seller/settings", {
        headers: { "x-user-data": userStr },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.seller) {
        setFormData({
          brandName: data.seller.brandName || "",
          storeSlug: data.seller.storeSlug || "",
          storeLogo: data.seller.storeLogo || "",
          storeCover: data.seller.storeCover || "",
          storeDescription: data.seller.storeDescription || "",
          instagram: data.seller.instagram || "",
          location: data.seller.location || "",
        });
      }
    } catch {
      showToast("error", "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "Image must be under 10MB");
      return;
    }
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;
    const setUploading = type === "logo" ? setUploadingLogo : setUploadingCover;
    const setProg = type === "logo" ? setLogoProg : setCoverProg;
    setUploading(true);
    setProg(20);
    try {
      const compressed = await compressImage(
        file,
        type === "logo" ? 800 : 1600,
        type === "logo" ? 800 : 800,
      );
      setProg(60);
      const fd = new FormData();
      fd.append("file", compressed, file.name);
      fd.append("type", type);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-user-data": userStr },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setProg(100);
      if (data.url) {
        setFormData((p) => ({
          ...p,
          [type === "logo" ? "storeLogo" : "storeCover"]: data.url,
        }));
        showToast("success", `${type === "logo" ? "Logo" : "Cover"} updated!`);
      }
    } catch (err: any) {
      showToast("error", err.message || "Upload failed");
    } finally {
      setUploading(false);
      setProg(0);
    }
  };

  const handleSave = async () => {
    if (!formData.brandName.trim()) {
      showToast("error", "Store name is required");
      return;
    }
    if (!formData.storeSlug.trim()) {
      showToast("error", "Store URL is required");
      return;
    }
    setIsSaving(true);
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/seller/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) showToast("success", "Changes saved successfully!");
      else showToast("error", data.error || "Failed to save");
    } catch {
      showToast("error", "Failed to save settings");
    } finally {
      setIsSaving(false);
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
          {/* Back */}
          <Link href="/seller/dashboard" className="sp-back">
            <ArrowLeftIco size={15} /> Back to Dashboard
          </Link>

          {/* Header */}
          <div className="sp-header">
            <div>
              <h1 className="sp-header-title">Store Profile</h1>
              <p className="sp-header-sub">
                Customize your brand identity and store settings
              </p>
            </div>
            {formData.storeSlug && (
              <Link
                href={`/store/${formData.storeSlug}`}
                target="_blank"
                className="sp-preview-btn"
              >
                <EyeIco size={15} /> Preview Store
              </Link>
            )}
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

          {/* Card */}
          <div className="sp-card">
            {/* Cover */}
            <div className="sp-cover">
              {formData.storeCover ? (
                <Image
                  src={formData.storeCover}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="900px"
                  priority
                />
              ) : (
                <div className="sp-cover-placeholder">
                  <CameraIco size={36} />
                  <span>Add a cover image</span>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>
                    1600 × 800 recommended
                  </span>
                </div>
              )}

              {uploadingCover ? (
                <div className="sp-progress-overlay">
                  <LoaderIcon size={28} stroke="#fff" />
                  <div className="sp-progress-bar-wrap">
                    <div
                      className="sp-progress-bar"
                      style={{ width: `${coverProg}%` }}
                    />
                  </div>
                  <span className="sp-progress-label">
                    {coverProg < 60 ? "Compressing…" : "Uploading…"} {coverProg}
                    %
                  </span>
                </div>
              ) : (
                <div
                  className="sp-cover-hover"
                  onClick={() => coverRef.current?.click()}
                >
                  <div className="sp-cover-btn">
                    <CameraIco size={16} /> Change Cover
                  </div>
                </div>
              )}
            </div>

            {/* Logo + form */}
            <div style={{ padding: "0 0 0" }}>
              {/* Logo */}
              <div className="sp-logo-wrap" style={{ marginBottom: 20 }}>
                <div className="sp-logo">
                  {formData.storeLogo ? (
                    <Image
                      src={formData.storeLogo}
                      alt="Logo"
                      width={112}
                      height={112}
                      className="object-cover"
                      style={{ width: "100%", height: "100%" }}
                      priority
                    />
                  ) : (
                    <div className="sp-logo-placeholder">
                      <StoreIco size={32} />
                      <span
                        style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}
                      >
                        Logo
                      </span>
                    </div>
                  )}
                  {uploadingLogo && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.85)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        borderRadius: 16,
                      }}
                    >
                      <LoaderIcon size={22} />
                      <div
                        style={{
                          width: 56,
                          height: 3,
                          background: "rgba(255,255,255,0.15)",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${logoProg}%`,
                            background: "#3b82f6",
                            transition: "width 0.3s",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {!uploadingLogo && (
                  <div
                    className="sp-logo-hover"
                    onClick={() => logoRef.current?.click()}
                  >
                    <div className="sp-logo-cam">
                      <CameraIco size={17} />
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="sp-form-body">
                <div className="sp-form-grid">
                  {/* Store Name */}
                  <div className="sp-full">
                    <Field label="Store Name" icon={StoreIco}>
                      <input
                        className="sp-input"
                        type="text"
                        value={formData.brandName}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            brandName: e.target.value,
                          }))
                        }
                        placeholder="Your Store Name"
                      />
                    </Field>
                  </div>

                  {/* Store URL */}
                  <div className="sp-full">
                    <Field label="Store URL" icon={LinkIco}>
                      <div className="sp-prefix-wrap">
                        <span className="sp-prefix">yog.com/store/</span>
                        <input
                          className="sp-prefix-input"
                          type="text"
                          value={formData.storeSlug}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              storeSlug: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, ""),
                            }))
                          }
                          placeholder="your-store"
                        />
                      </div>
                    </Field>
                  </div>

                  {/* Description */}
                  <div className="sp-full">
                    <Field label="Store Description" icon={FileIco}>
                      <textarea
                        className="sp-input sp-textarea"
                        rows={4}
                        value={formData.storeDescription}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            storeDescription: e.target.value,
                          }))
                        }
                        placeholder="Tell customers about your brand — what makes you unique, what you offer, your story…"
                      />
                    </Field>
                  </div>

                  {/* Location */}
                  <div>
                    <Field label="Location" icon={MapPinIco}>
                      <input
                        className="sp-input"
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Addis Ababa, Ethiopia"
                      />
                    </Field>
                  </div>

                  {/* Instagram */}
                  <div>
                    <Field label="Instagram" icon={InstaIco}>
                      <div className="sp-prefix-wrap">
                        <span className="sp-prefix">@</span>
                        <input
                          className="sp-prefix-input"
                          type="text"
                          value={formData.instagram}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              instagram: e.target.value.replace("@", ""),
                            }))
                          }
                          placeholder="yourhandle"
                        />
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Save */}
                <button
                  className="sp-save-btn"
                  onClick={handleSave}
                  disabled={isSaving || uploadingLogo || uploadingCover}
                >
                  {isSaving ? (
                    <>
                      <LoaderIcon size={16} /> Saving…
                    </>
                  ) : (
                    <>
                      <SaveIco size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={logoRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e, "logo")}
      />
      <input
        ref={coverRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e, "cover")}
      />
    </>
  );
}
