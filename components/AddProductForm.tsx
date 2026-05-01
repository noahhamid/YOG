"use client";
import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ChangeEvent,
  KeyboardEvent,
  DragEvent,
  FocusEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ToastProvider";

// ─── Types ────────────────────────────────────────────────────────────────────
interface IconProps {
  d: string;
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}
type IconPropsNoD = Omit<IconProps, "d">;

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface Variant {
  size: string;
  color: string;
  quantity: number;
}

interface FormErrors {
  [key: string]: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({
  d,
  size = 16,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.75,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const XIcon = (p: IconPropsNoD) => <Icon {...p} d="M18 6 6 18M6 6l12 12" />;
const PlusIcon = (p: IconPropsNoD) => <Icon {...p} d="M12 5v14M5 12h14" />;
const MinusIcon = (p: IconPropsNoD) => <Icon {...p} d="M5 12h14" />;
const CheckIcon = (p: IconPropsNoD) => (
  <Icon {...p} d="M20 6 9 17l-5-5" strokeWidth={2.5} />
);
const ArrowLeftIcon = (p: IconPropsNoD) => <Icon {...p} d="m15 18-6-6 6-6" />;
const AlertIcon = (p: IconPropsNoD) => (
  <Icon
    {...p}
    d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  />
);
const UploadIcon = (p: IconPropsNoD) => (
  <Icon
    {...p}
    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7-5-5-5 5m5-5v12"
  />
);
const SparkleIcon = (p: IconPropsNoD) => (
  <Icon
    {...p}
    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"
  />
);
const ChevronDown = (p: IconPropsNoD) => <Icon {...p} d="m6 9 6 6 6-6" />;

const LoaderIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── Image compression ────────────────────────────────────────────────────────
const compressImage = (
  file: File,
  maxW = 1200,
  maxH = 1200,
  q = 0.85,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
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
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
          "image/jpeg",
          q,
        );
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── Dropdown ────────────────────────────────────────────────────────────────
interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}

function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  error,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);
  const label = selected?.label ?? null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "var(--input-bg)",
          border: `1.5px solid ${error ? "var(--error)" : open ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          color: label ? "var(--text)" : "var(--muted)",
          fontSize: 14,
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: open ? "0 0 0 3px var(--accent-soft)" : "none",
          fontFamily: "inherit",
        }}
      >
        <span>{label ?? placeholder}</span>
        <span
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
            color: "var(--muted)",
          }}
        >
          <ChevronDown size={14} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              zIndex: 100,
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: opt.description ? "10px 14px" : "9px 14px",
                    background: isActive ? "var(--accent-soft)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    transition: "background 0.1s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "var(--hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      {opt.description}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SectionHead ─────────────────────────────────────────────────────────────
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--text)",
          margin: 0,
          letterSpacing: -0.3,
        }}
      >
        {title}
      </h3>
      {sub && (
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            margin: "3px 0 0",
            fontWeight: 400,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label,
  required,
  error,
  children,
}: {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 7,
          }}
        >
          {label}
          {required && (
            <span style={{ color: "var(--error)", marginLeft: 3 }}>*</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "var(--error)",
            fontSize: 11,
            marginTop: 5,
          }}
        >
          <AlertIcon size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── inputStyle ───────────────────────────────────────────────────────────────
const inputStyle = (
  hasError: boolean | string | undefined,
): React.CSSProperties => ({
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  background: "var(--input-bg)",
  border: `1.5px solid ${hasError ? "var(--error)" : "var(--border)"}`,
  borderRadius: 10,
  color: "var(--text)",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
  fontFamily: "inherit",
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddProductForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit?: (product: unknown) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    clothingType: "",
    occasion: "",
    material: "",
    status: "PUBLISHED",
  });
  const [variants, setVariants] = useState<Variant[]>([
    { size: "S", color: "Black", quantity: 0 },
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle
  const fileRef = useRef<HTMLInputElement>(null);

  const categoryOptions: DropdownOption[] = [
    { value: "MEN", label: "Men's", description: "For men" },
    { value: "WOMEN", label: "Women's", description: "For women" },
    { value: "UNISEX", label: "Unisex", description: "For everyone" },
  ];
  const clothingTypeOptions: DropdownOption[] = [
    { value: "TOP", label: "Tops", description: "T-shirts, Shirts, Blouses" },
    { value: "BOTTOM", label: "Bottoms", description: "Jeans, Pants, Skirts" },
    { value: "DRESS", label: "Dresses", description: "All dress styles" },
    { value: "OUTERWEAR", label: "Outerwear", description: "Jackets, Coats" },
    {
      value: "UNDERWEAR",
      label: "Underwear",
      description: "Intimates & Loungewear",
    },
    { value: "SHOES", label: "Shoes", description: "Shoes & Footwears" },
    {
      value: "ACCESSORIES",
      label: "Accessories",
      description: "Bags, Hats, Jewelry",
    },
    {
      value: "ACTIVEWEAR",
      label: "Activewear",
      description: "Sports & Fitness",
    },
  ];
  const occasionOptions: DropdownOption[] = [
    { value: "CASUAL", label: "Casual", description: "Everyday wear" },
    { value: "FORMAL", label: "Formal", description: "Business & Events" },
    {
      value: "SPORTSWEAR",
      label: "Sportswear",
      description: "Athletic activities",
    },
    { value: "STREETWEAR", label: "Streetwear", description: "Urban fashion" },
    {
      value: "WORKWEAR",
      label: "Workwear",
      description: "Professional attire",
    },
  ];
  const statusOptions: DropdownOption[] = [
    {
      value: "PUBLISHED",
      label: "Published",
      description: "Visible to buyers",
    },
    { value: "DRAFT", label: "Draft", description: "Hidden from store" },
    { value: "ARCHIVED", label: "Archived", description: "No longer sold" },
  ];

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const applyFocus = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.style.borderColor = "var(--accent)";
    e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
  };
  const applyBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", "Please upload an image");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", "Max file size is 10 MB");
      return;
    }
    setUploading(true);
    setUploadProgress(10);
    try {
      setUploadProgress(35);
      const compressed = await compressImage(file);
      setUploadProgress(65);
      const fd = new FormData();
      fd.append("file", compressed, file.name);
      fd.append("type", "product");
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-user-data": userStr ?? "" },
        body: fd,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      setUploadProgress(100);
      if (res.ok && data.url) setImages((p) => [...p, data.url!]);
      else toast.error("Upload failed", data.error ?? "Unable to upload image");
    } catch {
      toast.error("Upload failed", "Something went wrong while uploading");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDropFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") setImages((p) => [...p, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setImages((p) => [...p, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formData.title.trim()) e.title = "Title is required";
    if (!formData.description.trim()) e.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      e.price = "Valid price is required";
    if (!formData.category) e.category = "Category is required";
    if (!formData.clothingType) e.clothingType = "Clothing type is required";
    if (images.length < 2) e.images = "At least 2 images required";
    if (variants.length === 0) e.variants = "At least one variant required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : null,
        clothingType: formData.clothingType || null,
        occasion: formData.occasion || null,
        material: formData.material || null,
        variants,
        images,
      };
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr ?? "",
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { product?: unknown; error?: string };
      if (res.ok) {
        toast.success(
          "Product added!",
          "Your product has been created successfully",
        );
        onSubmit?.(data.product);
      } else {
        toast.error(
          "Failed to create product",
          data.error ?? "Something went wrong",
        );
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Failed to submit", "Something went wrong while submitting");
      setIsSubmitting(false);
    }
  };

  // ── CSS ─────────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    :root {
      --bg:#f6f5f3; --card:#ffffff; --sidebar:#fafaf9; --text:#1a1714;
      --muted:#9e9890; --border:#e8e4de; --input-bg:#fdfcfb;
      --accent:#2563eb; --accent-soft:rgba(37,99,235,0.08);
      --error:#dc2626; --hover:#f5f3f0; --divider:rgba(0,0,0,0.06);
    }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes fadeSlideIn {
      from { opacity:0; transform:translateY(16px) scale(0.98); }
      to   { opacity:1; transform:none; }
    }
    @keyframes sidebarSlideIn {
      from { transform:translateX(100%); }
      to   { transform:translateX(0); }
    }

    .apf-overlay {
      position:fixed;inset:0;background:rgba(15,12,9,0.55);backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;padding:16px;z-index:9999;
    }
    .apf-modal {
      background:var(--card);border-radius:20px;width:100%;max-width:1100px;
      max-height:92vh;overflow:hidden;display:flex;flex-direction:column;
      box-shadow:0 32px 80px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.06);
      animation:fadeSlideIn 0.28s cubic-bezier(0.16,1,0.3,1);
      font-family:'Sora',sans-serif;
    }

    /* ── Header ── */
    .apf-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:16px 24px;border-bottom:1px solid var(--divider);
      background:var(--card);position:sticky;top:0;z-index:10;flex-shrink:0;
      gap:10px;
    }
    .apf-header-left  { display:flex;align-items:center;gap:10px;min-width:0; }
    .apf-header-right { display:flex;align-items:center;gap:8px;flex-shrink:0; }
    .apf-icon-btn {
      width:36px;height:36px;border-radius:10px;border:1px solid var(--border);
      background:transparent;cursor:pointer;display:flex;align-items:center;
      justify-content:center;color:var(--muted);transition:all 0.15s;flex-shrink:0;
    }
    .apf-icon-btn:hover { background:var(--hover);color:var(--text); }
    .apf-publish-btn {
      display:flex;align-items:center;gap:7px;padding:9px 18px;
      background:var(--text);color:#fff;border:none;border-radius:10px;
      font-family:'Sora',sans-serif;font-size:13px;font-weight:600;
      cursor:pointer;transition:all 0.15s;letter-spacing:-0.1px;white-space:nowrap;
    }
    .apf-publish-btn:hover    { background:#333;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.18); }
    .apf-publish-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none; }

    /* mobile organise button */
    .apf-org-btn {
      display:none;align-items:center;gap:5px;padding:8px 12px;
      border:1.5px solid var(--border);background:var(--card);border-radius:10px;
      font-family:'Sora',sans-serif;font-size:12px;font-weight:600;color:var(--text);
      cursor:pointer;transition:all 0.15s;white-space:nowrap;flex-shrink:0;
    }
    .apf-org-btn:hover { border-color:var(--text); }

    /* ── Body ── */
    .apf-body { display:flex;flex:1;overflow:hidden;position:relative; }

    /* ── Main scroll area ── */
    .apf-main {
      flex:1;overflow-y:auto;padding:24px 28px;
      display:flex;flex-direction:column;gap:28px;
    }

    /* ── Desktop sidebar ── */
    .apf-sidebar {
      width:260px;flex-shrink:0;background:var(--sidebar);overflow-y:auto;
      padding:20px 18px;display:flex;flex-direction:column;gap:20px;
      border-left:1px solid var(--divider);
    }

    /* ── Mobile sidebar overlay ── */
    .apf-sidebar-backdrop {
      display:none;position:absolute;inset:0;background:rgba(0,0,0,0.35);
      z-index:40;backdrop-filter:blur(2px);
    }
    .apf-sidebar-mobile {
      display:none;position:absolute;top:0;right:0;bottom:0;width:min(300px,85vw);
      background:var(--sidebar);overflow-y:auto;padding:20px 18px;
      flex-direction:column;gap:20px;border-left:1px solid var(--divider);
      z-index:41;animation:sidebarSlideIn 0.28s cubic-bezier(0.16,1,0.3,1);
    }

    .apf-section         { display:flex;flex-direction:column;gap:0; }
    .apf-section-divider { border:none;border-top:1px solid var(--divider);margin:0 0 20px; }

    /* grid helpers */
    .apf-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:16px; }

    /* variant row */
    .apf-variant-row { display:grid;grid-template-columns:100px 1fr 80px 36px;gap:8px;align-items:center; }

    /* images grid */
    .apf-images-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:10px; }

    .apf-img-thumb {
      aspect-ratio:1;border-radius:10px;overflow:hidden;position:relative;
      border:1.5px solid var(--border);background:var(--hover);
    }
    .apf-img-thumb img { width:100%;height:100%;object-fit:cover; }
    .apf-img-remove {
      position:absolute;top:5px;right:5px;width:22px;height:22px;
      background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:6px;
      cursor:pointer;display:none;align-items:center;justify-content:center;
    }
    .apf-img-thumb:hover .apf-img-remove { display:flex; }
    .apf-img-cover {
      position:absolute;bottom:5px;left:5px;padding:2px 6px;
      background:var(--text);color:#fff;font-size:9px;font-weight:700;
      border-radius:4px;letter-spacing:0.4px;text-transform:uppercase;
    }
    .apf-upload-zone {
      aspect-ratio:1;border-radius:10px;border:2px dashed var(--border);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:5px;cursor:pointer;transition:all 0.15s;background:transparent;color:var(--muted);
    }
    .apf-upload-zone:hover,.apf-upload-zone.drag {
      border-color:var(--accent);background:var(--accent-soft);color:var(--accent);
    }
    .apf-url-row  { display:flex;gap:8px;margin-top:10px; }
    .apf-url-input {
      flex:1;padding:9px 12px;font-size:13px;background:var(--input-bg);
      border:1.5px solid var(--border);border-radius:9px;color:var(--text);
      outline:none;font-family:'Sora',sans-serif;transition:all 0.15s;min-width:0;
    }
    .apf-url-input:focus { border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft); }
    .apf-url-add {
      padding:9px 14px;background:var(--text);color:#fff;border:none;
      border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;
      font-family:'Sora',sans-serif;transition:all 0.15s;white-space:nowrap;
    }
    .apf-url-add:hover { background:#333; }
    .apf-progress     { width:100%;height:3px;background:var(--border);border-radius:99px;overflow:hidden;margin-top:4px; }
    .apf-progress-bar { height:100%;background:var(--accent);transition:width 0.3s; }
    .apf-sidebar-label {
      font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.8px;
      text-transform:uppercase;margin:0 0 10px;
    }
    .apf-status-badge {
      display:inline-flex;align-items:center;gap:5px;padding:5px 10px;
      border-radius:20px;font-size:11px;font-weight:600;
    }
    .apf-dot { width:6px;height:6px;border-radius:50%; }

    /* ── Responsive ── */
    @media(max-width:900px) {
      .apf-overlay  { padding:0; align-items:flex-end; }
      .apf-modal    { border-radius:20px 20px 0 0; max-height:96vh; max-width:100%; }
      /* hide desktop sidebar */
      .apf-sidebar  { display:none; }
      /* show mobile sidebar toggle */
      .apf-org-btn  { display:flex; }
      /* show mobile sidebar when open */
      .apf-sidebar-backdrop.open { display:block; }
      .apf-sidebar-mobile.open   { display:flex; }
    }

    @media(max-width:640px) {
      .apf-header   { padding:12px 16px; }
      .apf-main     { padding:18px 16px; gap:22px; }
      .apf-grid-2   { grid-template-columns:1fr; gap:12px; }
      .apf-images-grid { grid-template-columns:repeat(3,1fr); gap:8px; }
      /* variant row: stack size+color on one line, qty+remove on same */
      .apf-variant-row { grid-template-columns:1fr 1fr;gap:7px; }
      .apf-variant-row > *:nth-child(3) { grid-column:1; }
      .apf-variant-row > *:nth-child(4) { grid-column:2; }
    }

    @media(max-width:420px) {
      .apf-images-grid { grid-template-columns:repeat(3,1fr); gap:6px; }
      .apf-url-row { flex-direction:column; }
      .apf-url-add { width:100%; text-align:center; }
      .apf-publish-btn span { display:none; } /* hide label, keep icon */
    }
  `;

  const statusColor = (s: string) => ({
    bg: s === "PUBLISHED" ? "#dcfce7" : s === "DRAFT" ? "#fef9c3" : "#f3f4f6",
    txt: s === "PUBLISHED" ? "#15803d" : s === "DRAFT" ? "#a16207" : "#6b7280",
    dot: s === "PUBLISHED" ? "#22c55e" : s === "DRAFT" ? "#eab308" : "#9ca3af",
  });

  const checklist: [string, boolean][] = [
    ["Title", !!formData.title],
    ["Description", !!formData.description],
    ["Price", !!formData.price && parseFloat(formData.price) > 0],
    ["Category", !!formData.category],
    ["Type", !!formData.clothingType],
    ["2+ Images", images.length >= 2],
    ["Variant", variants.length > 0],
  ];

  // Sidebar content (shared between desktop sidebar and mobile drawer)
  const SidebarContent = () => (
    <>
      {/* Status */}
      <div>
        <p className="apf-sidebar-label">Status</p>
        <Dropdown
          options={statusOptions}
          value={formData.status}
          onChange={(v) => setFormData((p) => ({ ...p, status: v }))}
          placeholder="Select status"
        />
        {formData.status &&
          (() => {
            const sc = statusColor(formData.status);
            return (
              <div style={{ marginTop: 8 }}>
                <span
                  className="apf-status-badge"
                  style={{ background: sc.bg, color: sc.txt }}
                >
                  <span className="apf-dot" style={{ background: sc.dot }} />
                  {
                    statusOptions.find((o) => o.value === formData.status)
                      ?.label
                  }
                </span>
              </div>
            );
          })()}
      </div>

      <div style={{ height: 1, background: "var(--divider)" }} />

      {/* Organisation */}
      <div>
        <p className="apf-sidebar-label">Organization</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Category" required error={errors.category}>
            <Dropdown
              options={categoryOptions}
              value={formData.category}
              onChange={(v) => {
                setFormData((p) => ({ ...p, category: v }));
                setErrors((p) => ({ ...p, category: "" }));
              }}
              placeholder="Select category"
              error={!!errors.category}
            />
          </Field>
          <Field label="Clothing Type" required error={errors.clothingType}>
            <Dropdown
              options={clothingTypeOptions}
              value={formData.clothingType}
              onChange={(v) => {
                setFormData((p) => ({ ...p, clothingType: v }));
                setErrors((p) => ({ ...p, clothingType: "" }));
              }}
              placeholder="Select type"
              error={!!errors.clothingType}
            />
          </Field>
          <Field label="Occasion">
            <Dropdown
              options={occasionOptions}
              value={formData.occasion}
              onChange={(v) => setFormData((p) => ({ ...p, occasion: v }))}
              placeholder="Select occasion"
            />
          </Field>
          <Field label="Material">
            <input
              name="material"
              value={formData.material}
              onChange={handleInput}
              placeholder="e.g. 100% Cotton"
              style={inputStyle(false)}
              onFocus={applyFocus}
              onBlur={applyBlur}
            />
          </Field>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--divider)" }} />

      {/* Checklist */}
      <div>
        <p className="apf-sidebar-label">Checklist</p>
        {checklist.map(([lbl, done]) => (
          <div
            key={lbl}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: done ? "var(--text)" : "var(--border)",
                transition: "background 0.2s",
              }}
            >
              {done && <CheckIcon size={10} stroke="#fff" strokeWidth={3} />}
            </span>
            <span
              style={{
                fontSize: 12,
                color: done ? "var(--text)" : "var(--muted)",
                fontWeight: done ? 600 : 400,
              }}
            >
              {lbl}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="apf-overlay">
        <div className="apf-modal">
          {/* ── Header ── */}
          <div className="apf-header">
            <div className="apf-header-left">
              <button className="apf-icon-btn" onClick={onClose} type="button">
                <ArrowLeftIcon size={16} />
              </button>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <SparkleIcon size={16} />
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "var(--text)",
                      letterSpacing: -0.6,
                    }}
                  >
                    New Product
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    margin: 0,
                    marginTop: 1,
                  }}
                >
                  Fill in the details below to list your item
                </p>
              </div>
            </div>
            <div className="apf-header-right">
              {/* Mobile: Organize button opens sidebar drawer */}
              <button
                className="apf-org-btn"
                type="button"
                onClick={() => setSidebarOpen(true)}
              >
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
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                Organize
              </button>
              <button
                className="apf-publish-btn"
                type="submit"
                form="apf-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderIcon size={14} />
                ) : (
                  <CheckIcon size={14} />
                )}
                <span>{isSubmitting ? "Publishing…" : "Publish"}</span>
              </button>
              <button className="apf-icon-btn" onClick={onClose} type="button">
                <XIcon size={15} />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="apf-body">
            {/* Main scroll area */}
            <div className="apf-main">
              <form id="apf-form" onSubmit={handleSubmit}>
                {/* Product Details */}
                <div className="apf-section">
                  <SectionHead
                    title="Product Details"
                    sub="Name your item and write a compelling description"
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <Field label="Product Title" required error={errors.title}>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        placeholder="e.g. Oversized Vintage Hoodie"
                        style={inputStyle(errors.title)}
                        onFocus={applyFocus}
                        onBlur={applyBlur}
                      />
                    </Field>
                    <Field
                      label="Description"
                      required
                      error={errors.description}
                    >
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInput}
                        placeholder="Describe your product — materials, fit, sizing, care instructions…"
                        rows={4}
                        style={{
                          ...inputStyle(errors.description),
                          resize: "none",
                        }}
                        onFocus={applyFocus}
                        onBlur={applyBlur}
                      />
                    </Field>
                  </div>
                </div>

                <hr className="apf-section-divider" style={{ marginTop: 24 }} />

                {/* Pricing */}
                <div className="apf-section">
                  <SectionHead
                    title="Pricing"
                    sub="Set your sale price and optional compare-at price"
                  />
                  <div className="apf-grid-2">
                    <Field label="Price (ETB)" required error={errors.price}>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: 13,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "var(--muted)",
                          }}
                        >
                          ETB
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInput}
                          placeholder="1000"
                          min="0"
                          step="0.01"
                          style={{
                            ...inputStyle(errors.price),
                            paddingLeft: 46,
                          }}
                          onFocus={applyFocus}
                          onBlur={applyBlur}
                        />
                      </div>
                    </Field>
                    <Field label="Discounted Price">
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: 13,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "var(--muted)",
                          }}
                        >
                          ETB
                        </span>
                        <input
                          type="number"
                          name="compareAtPrice"
                          value={formData.compareAtPrice}
                          onChange={handleInput}
                          placeholder="1500"
                          min="0"
                          step="0.01"
                          style={{ ...inputStyle(false), paddingLeft: 46 }}
                          onFocus={applyFocus}
                          onBlur={applyBlur}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          marginTop: 5,
                        }}
                      >
                        Shows a strikethrough — used for sales
                      </p>
                    </Field>
                  </div>
                </div>

                <hr className="apf-section-divider" style={{ marginTop: 24 }} />

                {/* Variants */}
                <div className="apf-section">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <SectionHead
                      title="Variants"
                      sub="Size, color & available stock"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setVariants((p) => [
                          ...p,
                          { size: "S", color: "Black", quantity: 0 },
                        ])
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "7px 13px",
                        background: "var(--text)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 9,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      <PlusIcon size={13} /> Add
                    </button>
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 9 }}
                  >
                    <div
                      className="apf-variant-row"
                      style={{ marginBottom: -2 }}
                    >
                      {["Size", "Color", "Qty", ""].map((h, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {variants.map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="apf-variant-row"
                        style={{
                          background: "var(--hover)",
                          borderRadius: 11,
                          padding: "8px 10px",
                        }}
                      >
                        <input
                          value={v.size}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const n = [...variants];
                            n[i].size = e.target.value;
                            setVariants(n);
                          }}
                          placeholder="e.g. M"
                          style={{ ...inputStyle(false), fontSize: 13 }}
                          onFocus={applyFocus}
                          onBlur={applyBlur}
                        />
                        <input
                          value={v.color}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const n = [...variants];
                            n[i].color = e.target.value;
                            setVariants(n);
                          }}
                          placeholder="e.g. Black"
                          style={{ ...inputStyle(false), fontSize: 13 }}
                          onFocus={applyFocus}
                          onBlur={applyBlur}
                        />
                        <input
                          type="number"
                          value={v.quantity}
                          min={0}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const n = [...variants];
                            n[i].quantity = parseInt(e.target.value) || 0;
                            setVariants(n);
                          }}
                          placeholder="0"
                          style={{
                            ...inputStyle(false),
                            fontSize: 13,
                            textAlign: "center",
                          }}
                          onFocus={applyFocus}
                          onBlur={applyBlur}
                        />
                        {variants.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setVariants(variants.filter((_, j) => j !== i))
                            }
                            style={{
                              width: 32,
                              height: 32,
                              background: "#fee2e2",
                              color: "#dc2626",
                              border: "none",
                              borderRadius: 8,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MinusIcon size={13} />
                          </button>
                        ) : (
                          <div />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {errors.variants && (
                    <p
                      style={{
                        color: "var(--error)",
                        fontSize: 11,
                        marginTop: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <AlertIcon size={11} /> {errors.variants}
                    </p>
                  )}
                </div>

                <hr className="apf-section-divider" style={{ marginTop: 24 }} />

                {/* Images */}
                <div className="apf-section">
                  <SectionHead
                    title="Product Images"
                    sub="Upload at least 2 photos — first image becomes the cover"
                  />
                  <div className="apf-images-grid">
                    {images.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="apf-img-thumb"
                      >
                        <img src={img} alt={`Product ${i + 1}`} />
                        <button
                          className="apf-img-remove"
                          type="button"
                          onClick={() =>
                            setImages(images.filter((_, j) => j !== i))
                          }
                        >
                          <XIcon size={11} />
                        </button>
                        {i === 0 && (
                          <span className="apf-img-cover">Cover</span>
                        )}
                      </motion.div>
                    ))}

                    <button
                      type="button"
                      className={`apf-upload-zone${dragOver ? " drag" : ""}`}
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e: DragEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e: DragEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setDragOver(false);
                        handleDropFiles(e.dataTransfer.files);
                      }}
                    >
                      {uploading ? (
                        <>
                          <LoaderIcon size={18} />
                          <span style={{ fontSize: 10, fontWeight: 600 }}>
                            {uploadProgress < 35
                              ? "Reading…"
                              : uploadProgress < 65
                                ? "Compressing…"
                                : "Uploading…"}
                          </span>
                          <div
                            className="apf-progress"
                            style={{ width: "70%", marginTop: 2 }}
                          >
                            <div
                              className="apf-progress-bar"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadIcon size={18} />
                          <span style={{ fontSize: 10, fontWeight: 600 }}>
                            Upload
                          </span>
                          <span style={{ fontSize: 9, opacity: 0.6 }}>
                            or drag & drop
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="apf-url-row">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setImageUrl(e.target.value)
                      }
                      placeholder="Or paste an image URL…"
                      className="apf-url-input"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="apf-url-add"
                      onClick={addImageUrl}
                    >
                      Add URL
                    </button>
                  </div>

                  {errors.images && (
                    <p
                      style={{
                        color: "var(--error)",
                        fontSize: 11,
                        marginTop: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <AlertIcon size={11} /> {errors.images}
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* ── Desktop sidebar ── */}
            <div className="apf-sidebar">
              <SidebarContent />
            </div>

            {/* ── Mobile sidebar drawer ── */}
            <div
              className={`apf-sidebar-backdrop${sidebarOpen ? " open" : ""}`}
              onClick={() => setSidebarOpen(false)}
            />
            <div className={`apf-sidebar-mobile${sidebarOpen ? " open" : ""}`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Organize
                </span>
                <button
                  className="apf-icon-btn"
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XIcon size={15} />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </div>
    </>
  );
}
