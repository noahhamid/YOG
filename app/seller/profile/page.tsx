"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface IconProps {
  size?: number;
  d?: string;
  sw?: number;
  fill?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
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
const CameraIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
  />
);
const SaveIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8"
  />
);
const EyeIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
  />
);
const MapPinIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  />
);
const LinkIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
  />
);
const StoreIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"
  />
);
const FileIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M16 13H8m8 4H8m2-8H8"
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
const CopyIco = (p: IconProps) => (
  <Ico
    {...p}
    d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"
  />
);
const CheckSmallIco = (p: IconProps) => <Ico {...p} d="M20 6 9 17l-5-5" />;

const InstaIco = (p: IconProps) => (
  <svg
    width={p.size || 16}
    height={p.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
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

// ─── Compression ──────────────────────────────────────────────────────────────
const compressImage = (
  file: File,
  maxW: number,
  maxH: number,
  q = 0.85,
): Promise<Blob> =>
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
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed"))),
          "image/jpeg",
          q,
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  @keyframes sp-spin    { to { transform: rotate(360deg); } }
  @keyframes sp-fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  @keyframes sp-shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .sp-page  { min-height:100vh; background:#f6f5f3; padding-top:80px; font-family:'Sora',sans-serif; }
  .sp-wrap  { max-width:780px; margin:0 auto; padding:32px 20px 80px; }

  /* back */
  .sp-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600;
    color:#9e9890; text-decoration:none; transition:color .15s; margin-bottom:28px; }
  .sp-back:hover { color:#1a1714; }

  /* header row */
  .sp-hrow { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
  .sp-htitle { font-size:24px; font-weight:800; color:#1a1714; letter-spacing:-.6px; margin:0 0 3px; }
  .sp-hsub   { font-size:13px; color:#9e9890; margin:0; }
  .sp-preview-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px;
    background:#1a1714; color:#fff; border:none; border-radius:11px; font-family:'Sora',sans-serif;
    font-size:13px; font-weight:600; cursor:pointer; text-decoration:none; transition:all .15s; }
  .sp-preview-btn:hover { background:#333; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.18); }

  /* toast */
  .sp-toast { display:flex; align-items:center; gap:9px; padding:11px 16px; border-radius:12px;
    font-size:13px; font-weight:600; margin-bottom:20px; }

  /* ── profile hero card ── */
  .sp-hero { background:#fff; border-radius:20px; border:1px solid #e8e4de;
    overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,.05); margin-bottom:16px; }

  /* cover */
  .sp-cover { position:relative; height:200px; background:#1a1714; overflow:hidden; cursor:pointer; }
  .sp-cover-placeholder { position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; color:rgba(255,255,255,.3); gap:8px; }
  .sp-cover-placeholder span { font-size:12px; font-weight:500; }
  .sp-cover-hover { position:absolute; inset:0; background:rgba(0,0,0,.45); display:flex;
    align-items:center; justify-content:center; opacity:0; transition:opacity .2s; backdrop-filter:blur(3px); z-index:2; }
  .sp-cover:hover .sp-cover-hover { opacity:1; }
  .sp-cover-btn { display:flex; align-items:center; gap:8px; padding:9px 18px; background:#fff;
    color:#1a1714; border-radius:10px; font-size:13px; font-weight:700; border:none; font-family:'Sora',sans-serif; }
  .sp-prog-overlay { position:absolute; inset:0; background:rgba(0,0,0,.85);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; z-index:3; }
  .sp-prog-bar-wrap { width:160px; height:3px; background:rgba(255,255,255,.15); border-radius:99px; overflow:hidden; }
  .sp-prog-bar { height:100%; background:#3b82f6; border-radius:99px; transition:width .3s; }
  .sp-prog-label { font-size:11px; color:rgba(255,255,255,.5); font-family:'Sora',sans-serif; }

  /* avatar circle */
  .sp-avatar-row  { padding:0 28px 24px; display:flex; align-items:flex-end; gap:16px; }
  .sp-avatar-wrap { margin-top:-52px; position:relative; flex-shrink:0; }
  .sp-avatar { width:104px; height:104px; border-radius:50%; border:4px solid #fff;
    box-shadow:0 4px 20px rgba(0,0,0,.13); overflow:hidden; background:#1a1714;
    display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer; }
  .sp-avatar-placeholder { color:rgba(255,255,255,.45); display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:3px; }
  .sp-avatar-hover { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,.65);
    display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; z-index:10; }
  .sp-avatar:hover .sp-avatar-hover { opacity:1; }
  .sp-avatar-cam { width:32px; height:32px; background:#fff; border-radius:50%;
    display:flex; align-items:center; justify-content:center; }
  .sp-avatar-prog { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,.82);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px; z-index:5; }

  /* store name display in hero */
  .sp-hero-name  { font-size:20px; font-weight:800; color:#1a1714; letter-spacing:-.4px; margin:0 0 2px; }
  .sp-hero-slug  { font-size:12px; color:#9e9890; font-weight:500; margin:0; }

  /* ── url copy card ── */
  .sp-url-card { background:#fff; border-radius:16px; border:1px solid #e8e4de;
    padding:16px 20px; margin-bottom:16px; display:flex; align-items:center; gap:12px;
    box-shadow:0 1px 8px rgba(0,0,0,.04); }
  .sp-url-ico { width:36px; height:36px; background:#f6f5f3; border-radius:10px; border:1px solid #e8e4de;
    display:flex; align-items:center; justify-content:center; color:#9e9890; flex-shrink:0; }
  .sp-url-text { flex:1; min-width:0; }
  .sp-url-label { font-size:10px; font-weight:700; color:#b8b3ad; text-transform:uppercase; letter-spacing:.7px; margin:0 0 3px; }
  .sp-url-value { font-size:13px; font-weight:600; color:#1a1714; white-space:nowrap;
    overflow:hidden; text-overflow:ellipsis; margin:0; }
  .sp-url-value span { color:#9e9890; }
  .sp-copy-btn { display:flex; align-items:center; gap:6px; padding:8px 14px;
    border:1.5px solid #e8e4de; border-radius:10px; background:#fff; color:#6b6760;
    font-size:12px; font-weight:700; font-family:'Sora',sans-serif; cursor:pointer;
    transition:all .18s; white-space:nowrap; flex-shrink:0; }
  .sp-copy-btn:hover { border-color:#1a1714; color:#1a1714; background:#f6f5f3; }
  .sp-copy-btn.copied { border-color:#16a34a; color:#16a34a; background:#f0fdf4; }

  /* ── form card ── */
  .sp-form-card { background:#fff; border-radius:20px; border:1px solid #e8e4de;
    overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,.05); }
  .sp-form-section { padding:24px 28px; }
  .sp-section-title { font-size:11px; font-weight:800; color:#b8b3ad; text-transform:uppercase;
    letter-spacing:.8px; margin:0 0 18px; display:flex; align-items:center; gap:8px; }
  .sp-section-title::after { content:''; flex:1; height:1px; background:#f0ede9; }
  .sp-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  @media (max-width:600px) { .sp-form-grid { grid-template-columns:1fr; } .sp-form-section { padding:20px 18px; } .sp-avatar-row { padding:0 18px 20px; } }
  .sp-full { grid-column:1/-1; }

  .sp-field { display:flex; flex-direction:column; gap:7px; }
  .sp-label { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:700;
    color:#9e9890; text-transform:uppercase; letter-spacing:.6px; }
  .sp-input { width:100%; padding:10px 13px; font-size:14px; background:#fdfcfb;
    border:1.5px solid #e8e4de; border-radius:10px; color:#1a1714; outline:none;
    box-sizing:border-box; transition:border-color .15s, box-shadow .15s; font-family:'Sora',sans-serif; }
  .sp-input:focus { border-color:#1a1714; box-shadow:0 0 0 3px rgba(26,23,20,.07); }
  .sp-textarea { resize:none; line-height:1.6; }
  .sp-prefix-wrap { display:flex; align-items:center; border:1.5px solid #e8e4de;
    border-radius:10px; background:#fdfcfb; overflow:hidden; transition:border-color .15s, box-shadow .15s; }
  .sp-prefix-wrap:focus-within { border-color:#1a1714; box-shadow:0 0 0 3px rgba(26,23,20,.07); }
  .sp-prefix { padding:10px 11px; font-size:12px; font-weight:700; color:#b8b3ad;
    background:#f6f5f3; border-right:1.5px solid #e8e4de; white-space:nowrap; flex-shrink:0; }
  .sp-prefix-input { flex:1; padding:10px 13px; font-size:14px; background:transparent;
    border:none; color:#1a1714; outline:none; font-family:'Sora',sans-serif; min-width:0; }
  .sp-form-divider { height:1px; background:#f6f5f3; margin:4px -28px; }

  /* save */
  .sp-save-btn { width:100%; padding:13px; background:#1a1714; color:#fff; border:none;
    border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; font-family:'Sora',sans-serif;
    transition:all .15s; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:24px; }
  .sp-save-btn:hover:not(:disabled) { background:#333; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.16); }
  .sp-save-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }

  /* loader */
  .sp-loader { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f6f5f3; }
  .sp-spinner { width:34px; height:34px; border:2.5px solid #e8e4de; border-top-color:#1a1714; border-radius:50%; animation:sp-spin .7s linear infinite; }
`;

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="sp-field">
      <label className="sp-label">
        <Icon size={11} /> {label}
      </label>
      {children}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button className={`sp-copy-btn${copied ? " copied" : ""}`} onClick={copy}>
      {copied ? (
        <>
          <CheckSmallIco size={13} /> Copied!
        </>
      ) : (
        <>
          <CopyIco size={13} /> Copy Link
        </>
      )}
    </button>
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
      if (data.seller)
        setFormData({
          brandName: data.seller.brandName || "",
          storeSlug: data.seller.storeSlug || "",
          storeLogo: data.seller.storeLogo || "",
          storeCover: data.seller.storeCover || "",
          storeDescription: data.seller.storeDescription || "",
          instagram: data.seller.instagram || "",
          location: data.seller.location || "",
        });
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
        showToast("success", `${type === "logo" ? "Photo" : "Cover"} updated!`);
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

  const storeUrl = formData.storeSlug
    ? `yogmarket.com/stores/${formData.storeSlug}`
    : "";
  const fullUrl = formData.storeSlug
    ? `https://yogmarket.com/stores/${formData.storeSlug}`
    : "";

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
          <div className="sp-hrow">
            <div>
              <h1 className="sp-htitle">Store Profile</h1>
              <p className="sp-hsub">
                Customize your brand identity and store settings
              </p>
            </div>
            {formData.storeSlug && (
              <Link
                href={`/stores/${formData.storeSlug}`}
                target="_blank"
                className="sp-preview-btn"
              >
                <EyeIco size={14} /> Preview Store
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
                  background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
                  color: toast.type === "success" ? "#16a34a" : "#dc2626",
                  border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                {toast.type === "success" ? (
                  <CheckIco size={15} />
                ) : (
                  <AlertIco size={15} />
                )}
                {toast.msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Hero card (cover + avatar) ── */}
          <div className="sp-hero">
            {/* Cover */}
            <div
              className="sp-cover"
              onClick={() => !uploadingCover && coverRef.current?.click()}
            >
              {formData.storeCover ? (
                <Image
                  src={formData.storeCover}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="780px"
                  priority
                />
              ) : (
                <div className="sp-cover-placeholder">
                  <CameraIco size={32} />
                  <span>Click to add a cover image</span>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>
                    1600 × 800 recommended
                  </span>
                </div>
              )}
              {uploadingCover ? (
                <div className="sp-prog-overlay">
                  <LoaderIcon size={26} />
                  <div className="sp-prog-bar-wrap">
                    <div
                      className="sp-prog-bar"
                      style={{ width: `${coverProg}%` }}
                    />
                  </div>
                  <span className="sp-prog-label">
                    {coverProg < 60 ? "Compressing…" : "Uploading…"} {coverProg}
                    %
                  </span>
                </div>
              ) : (
                <div className="sp-cover-hover">
                  <div className="sp-cover-btn">
                    <CameraIco size={15} /> Change Cover
                  </div>
                </div>
              )}
            </div>

            {/* Avatar + name */}
            <div className="sp-avatar-row">
              <div className="sp-avatar-wrap">
                <div
                  className="sp-avatar"
                  onClick={() => !uploadingLogo && logoRef.current?.click()}
                >
                  {formData.storeLogo ? (
                    <Image
                      src={formData.storeLogo}
                      alt="Logo"
                      width={104}
                      height={104}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      priority
                    />
                  ) : (
                    <div className="sp-avatar-placeholder">
                      <StoreIco size={28} />
                      <span
                        style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}
                      >
                        Photo
                      </span>
                    </div>
                  )}
                  {uploadingLogo && (
                    <div className="sp-avatar-prog">
                      <LoaderIcon size={20} />
                      <div
                        style={{
                          width: 50,
                          height: 3,
                          background: "rgba(255,255,255,.15)",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${logoProg}%`,
                            background: "#3b82f6",
                            transition: "width .3s",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {!uploadingLogo && (
                    <div className="sp-avatar-hover">
                      <div className="sp-avatar-cam">
                        <CameraIco size={15} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ paddingBottom: 4 }}>
                <p className="sp-hero-name">
                  {formData.brandName || "Your Store Name"}
                </p>
                {formData.storeSlug && (
                  <p className="sp-hero-slug">
                    yogmarket.com/stores/{formData.storeSlug}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Store link copy card ── */}
          {storeUrl && (
            <div className="sp-url-card">
              <div className="sp-url-ico">
                <LinkIco size={15} />
              </div>
              <div className="sp-url-text">
                <p className="sp-url-label">Your Store Link</p>
                <p className="sp-url-value">
                  <span>yogmarket.com/stores/</span>
                  {formData.storeSlug}
                </p>
              </div>
              <CopyButton value={fullUrl} />
            </div>
          )}

          {/* ── Form card ── */}
          <div className="sp-form-card">
            <div className="sp-form-section">
              <p className="sp-section-title">Store Info</p>
              <div className="sp-form-grid">
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

                <div className="sp-full">
                  <Field label="Store URL" icon={LinkIco}>
                    <div className="sp-prefix-wrap">
                      <span className="sp-prefix">yogmarket.com/stores/</span>
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

                <div className="sp-full">
                  <Field label="Description" icon={FileIco}>
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
              </div>
            </div>

            <div className="sp-form-divider" />

            <div className="sp-form-section">
              <p className="sp-section-title">Contact & Social</p>
              <div className="sp-form-grid">
                <div>
                  <Field label="Location" icon={MapPinIco}>
                    <input
                      className="sp-input"
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, location: e.target.value }))
                      }
                      placeholder="Addis Ababa, Ethiopia"
                    />
                  </Field>
                </div>

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

              <button
                className="sp-save-btn"
                onClick={handleSave}
                disabled={isSaving || uploadingLogo || uploadingCover}
              >
                {isSaving ? (
                  <>
                    <LoaderIcon size={15} /> Saving…
                  </>
                ) : (
                  <>
                    <SaveIco size={15} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

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
