"use client";
import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  ChangeEvent,
  KeyboardEvent,
  DragEvent,
  FocusEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  id?: string;
  size: string;
  color: string;
  quantity: number;
}

interface ProductImage {
  url: string;
  position: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  clothingType?: string | null;
  occasion?: string | null;
  material?: string | null;
  status: string;
  variants: Variant[];
  images: ProductImage[];
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
const ImageIcon = (p: IconPropsNoD) => (
  <Icon
    {...p}
    d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7m4-2h6v6m-11 5 9.5-9.5"
  />
);
const EditIcon = (p: IconPropsNoD) => (
  <Icon
    {...p}
    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
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

// ─── Dropdown ─────────────────────────────────────────────────────────────────
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
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
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
          fontFamily: "inherit",
          boxShadow: open ? "0 0 0 3px var(--accent-soft)" : "none",
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

// ─── SectionHead ──────────────────────────────────────────────────────────────
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
        <p style={{ fontSize: 12, color: "var(--muted)", margin: "3px 0 0" }}>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

const applyFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "var(--accent)";
  e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
};
const applyBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "var(--border)";
  e.target.style.boxShadow = "none";
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EditProductForm({
  product,
  onClose,
  onSubmit,
}: {
  product: Product;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() ?? "",
    category: product.category,
    clothingType: product.clothingType ?? "",
    occasion: product.occasion ?? "",
    material: product.material ?? "",
    status: product.status,
  });

  const [variants, setVariants] = useState<Variant[]>(
    product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      quantity: v.quantity,
    })),
  );

  const [images, setImages] = useState<string[]>(
    product.images
      .sort((a, b) => a.position - b.position)
      .map((img) => img.url),
  );

  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [dragOver, setDragOver] = useState(false);
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
    { value: "SHOES", label: "Footwear", description: "Shoes & Accessories" },
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
    { value: "PARTY", label: "Party", description: "Nights out" },
    {
      value: "WORKWEAR",
      label: "Workwear",
      description: "Professional attire",
    },
    { value: "LOUNGEWEAR", label: "Loungewear", description: "Relaxed & cozy" },
  ];
  const statusOptions: DropdownOption[] = [
    {
      value: "PUBLISHED",
      label: "Published",
      description: "Visible to buyers",
    },
    { value: "DRAFT", label: "Draft", description: "Hidden from store" },
  ];
  const sizes: DropdownOption[] = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "2XL",
    "3XL",
  ].map((s) => ({ value: s, label: s }));

  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr) as Record<string, unknown>);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleFiles = (files: FileList) => {
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
    if (!currentUser) {
      alert("Please sign in first");
      return;
    }
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
        variants: variants.map((v) => ({
          size: v.size,
          color: v.color,
          quantity: v.quantity,
        })),
        images,
      };
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": JSON.stringify(currentUser),
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (res.ok) {
        alert("Product updated!");
        onSubmit();
      } else {
        alert(data.error ?? "Failed to update");
        setIsSubmitting(false);
      }
    } catch {
      alert("Failed to update product");
      setIsSubmitting(false);
    }
  };

  const checklist: [string, boolean][] = [
    ["Title", !!formData.title],
    ["Description", !!formData.description],
    ["Price", !!formData.price && parseFloat(formData.price) > 0],
    ["Category", !!formData.category],
    ["Type", !!formData.clothingType],
    ["2+ Images", images.length >= 2],
    ["Variant", variants.length > 0],
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    :root {
      --bg:#f6f5f3; --card:#ffffff; --sidebar:#fafaf9;
      --text:#1a1714; --muted:#9e9890; --border:#e8e4de;
      --input-bg:#fdfcfb; --accent:#2563eb; --accent-soft:rgba(37,99,235,0.08);
      --error:#dc2626; --hover:#f5f3f0; --divider:rgba(0,0,0,0.06);
      --warn:#f59e0b; --warn-soft:rgba(245,158,11,0.1);
    }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes fadeSlideIn {
      from { opacity:0; transform:translateY(16px) scale(0.98); }
      to   { opacity:1; transform:none; }
    }
    .epf-overlay {
      position:fixed;inset:0;background:rgba(15,12,9,0.55);backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;padding:16px;z-index:9999;
    }
    .epf-modal {
      background:var(--card);border-radius:20px;width:100%;max-width:1100px;
      max-height:92vh;overflow:hidden;display:flex;flex-direction:column;
      box-shadow:0 32px 80px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.06);
      animation:fadeSlideIn 0.28s cubic-bezier(0.16,1,0.3,1);
      font-family:'Sora',sans-serif;
    }
    .epf-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:18px 28px;border-bottom:1px solid var(--divider);
      background:var(--card);position:sticky;top:0;z-index:10;flex-shrink:0;
    }
    .epf-header-left  { display:flex;align-items:center;gap:12px; }
    .epf-header-right { display:flex;align-items:center;gap:10px; }
    .epf-icon-btn {
      width:36px;height:36px;border-radius:10px;border:1px solid var(--border);
      background:transparent;cursor:pointer;display:flex;align-items:center;
      justify-content:center;color:var(--muted);transition:all 0.15s;
    }
    .epf-icon-btn:hover { background:var(--hover);color:var(--text); }
    .epf-save-btn {
      display:flex;align-items:center;gap:7px;padding:9px 20px;
      background:var(--accent);color:#fff;border:none;border-radius:10px;
      font-family:'Sora',sans-serif;font-size:13px;font-weight:600;
      cursor:pointer;transition:all 0.15s;letter-spacing:-0.1px;
    }
    .epf-save-btn:hover    { background:#1d4ed8;transform:translateY(-1px);box-shadow:0 4px 14px rgba(37,99,235,0.28); }
    .epf-save-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none; }
    .epf-body { display:flex;flex:1;overflow:hidden; }
    .epf-main {
      flex:1;overflow-y:auto;padding:28px 32px;
      display:flex;flex-direction:column;gap:32px;
    }
    .epf-sidebar {
      width:268px;flex-shrink:0;background:var(--sidebar);overflow-y:auto;
      padding:24px 20px;display:flex;flex-direction:column;gap:24px;
      border-left:1px solid var(--divider);
    }
.epf-divider     { border:none;border-top:1px solid var(--divider);margin:0 0 20px; }
    .epf-grid-2      { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
    .epf-variant-row { display:grid;grid-template-columns:110px 1fr 90px 36px;gap:10px;align-items:center; }
    .epf-variant-header { display:grid;grid-template-columns:110px 1fr 90px 36px;gap:10px;margin-bottom:-2px; }
    .epf-variant-label { display:none;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px; }
    .epf-mobile-organize { display:none; }
    .epf-images-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:10px; }
    .epf-img-thumb {
      aspect-ratio:1;border-radius:10px;overflow:hidden;position:relative;
      border:1.5px solid var(--border);background:var(--hover);
    }
    .epf-img-thumb img { width:100%;height:100%;object-fit:cover; }
    .epf-img-remove {
      position:absolute;top:5px;right:5px;width:22px;height:22px;
      background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:6px;
      cursor:pointer;display:none;align-items:center;justify-content:center;
    }
    .epf-img-thumb:hover .epf-img-remove { display:flex; }
    .epf-img-cover {
      position:absolute;bottom:5px;left:5px;padding:2px 6px;
      background:var(--text);color:#fff;font-size:9px;font-weight:700;
      border-radius:4px;letter-spacing:0.4px;text-transform:uppercase;
    }
    .epf-upload-zone {
      aspect-ratio:1;border-radius:10px;border:2px dashed var(--border);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:5px;cursor:pointer;transition:all 0.15s;background:transparent;color:var(--muted);
    }
    .epf-upload-zone:hover,.epf-upload-zone.drag {
      border-color:var(--accent);background:var(--accent-soft);color:var(--accent);
    }
    .epf-url-row { display:flex;gap:8px;margin-top:10px; }
    .epf-url-input {
      flex:1;padding:9px 12px;font-size:13px;background:var(--input-bg);
      border:1.5px solid var(--border);border-radius:9px;color:var(--text);
      outline:none;font-family:'Sora',sans-serif;transition:all 0.15s;
    }
    .epf-url-input:focus { border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft); }
    .epf-url-add {
      padding:9px 14px;background:var(--text);color:#fff;border:none;
      border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;
      font-family:'Sora',sans-serif;transition:all 0.15s;white-space:nowrap;
    }
    .epf-url-add:hover { background:#333; }
    .epf-sidebar-label {
      font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.8px;
      text-transform:uppercase;margin:0 0 10px;
    }
    .epf-status-badge {
      display:inline-flex;align-items:center;gap:5px;padding:5px 10px;
      border-radius:20px;font-size:11px;font-weight:600;
    }
    .epf-dot { width:6px;height:6px;border-radius:50%; }
.epf-edit-banner {
      display:flex;align-items:center;gap:8px;padding:10px 14px;
      background:var(--warn-soft);border:1px solid rgba(245,158,11,0.2);
      border-radius:10px;margin-bottom:4px;
    }
    @media(max-width:768px) {
      .epf-modal { max-width:100%;max-height:100vh;border-radius:0; }
      .epf-body { flex-direction:column; }
      .epf-sidebar { display:none; }
      .epf-main { padding:18px 16px;gap:24px; }
      .epf-header { padding:14px 16px; }
      .epf-grid-2 { grid-template-columns:1fr;gap:12px; }
      .epf-images-grid { grid-template-columns:repeat(3,1fr);gap:8px; }
      .epf-variant-header { display:none; }
      .epf-variant-row { grid-template-columns:1fr;gap:0; }
      .epf-variant-field { display:flex;flex-direction:column;margin-bottom:10px; }
      .epf-variant-label { display:block; }
      .epf-variant-actions { display:flex;justify-content:flex-end;margin-top:4px; }
      .epf-mobile-organize { display:block; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="epf-overlay">
        <div className="epf-modal">
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="epf-header">
            <div className="epf-header-left">
              <button className="epf-icon-btn" onClick={onClose} type="button">
                <ArrowLeftIcon size={16} />
              </button>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <EditIcon size={16} />
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "var(--text)",
                      letterSpacing: -0.6,
                    }}
                  >
                    Edit Product
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
                  Editing:{" "}
                  <strong style={{ color: "var(--text)" }}>
                    {product.title}
                  </strong>
                </p>
              </div>
            </div>
            <div className="epf-header-right">
              <button
                className="epf-save-btn"
                type="submit"
                form="epf-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderIcon size={14} />
                ) : (
                  <CheckIcon size={14} />
                )}
                {isSubmitting ? "Saving…" : "Save Changes"}
              </button>
              <button className="epf-icon-btn" onClick={onClose} type="button">
                <XIcon size={15} />
              </button>
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────────────── */}
          <div className="epf-body">
            <div className="epf-main">
              <form id="epf-form" onSubmit={handleSubmit}>
                {/* Product Details */}
                <div>
                  <SectionHead
                    title="Product Details"
                    sub="Update the name and description of your item"
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

                <hr className="epf-divider" style={{ marginTop: 28 }} />

                {/* Pricing */}
                <div>
                  <SectionHead
                    title="Pricing"
                    sub="Adjust your sale price and optional compare-at price"
                  />
                  <div className="epf-grid-2">
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
                    <Field label="Compare-at Price">
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

                <hr className="epf-divider" style={{ marginTop: 28 }} />

                {/* Variants */}
                <div>
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
                      sub="Edit sizes, colors & available stock"
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
                    <div className="epf-variant-header">
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
                        className="epf-variant-row"
                        style={{
                          background: "var(--hover)",
                          borderRadius: 11,
                          padding: "8px 10px",
                        }}
                      >
                        <div className="epf-variant-field">
                          <span className="epf-variant-label">Size</span>
                          <Dropdown
                            options={sizes}
                            value={v.size}
                            onChange={(val) => {
                              const n = [...variants];
                              n[i].size = val;
                              setVariants(n);
                            }}
                            placeholder="Size"
                          />
                        </div>
                        <div className="epf-variant-field">
                          <span className="epf-variant-label">Color</span>
                          <input
                            value={v.color}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const n = [...variants];
                              n[i].color = e.target.value;
                              setVariants(n);
                            }}
                            placeholder="e.g. Midnight Black"
                            style={{ ...inputStyle(false), fontSize: 13 }}
                            onFocus={applyFocus}
                            onBlur={applyBlur}
                          />
                        </div>
                        <div className="epf-variant-field">
                          <span className="epf-variant-label">Quantity</span>
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
                            }}
                            onFocus={applyFocus}
                            onBlur={applyBlur}
                          />
                        </div>
                        <div className="epf-variant-actions">
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
                            <div style={{ width: 32, height: 32 }} />
                          )}
                        </div>
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

                <hr className="epf-divider" style={{ marginTop: 28 }} />

                {/* Images */}
                <div>
                  <SectionHead
                    title="Product Images"
                    sub="First image is the cover — at least 2 required"
                  />
                  <div className="epf-images-grid">
                    {images.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="epf-img-thumb"
                      >
                        <img src={img} alt={`Product ${i + 1}`} />
                        <button
                          className="epf-img-remove"
                          type="button"
                          onClick={() =>
                            setImages(images.filter((_, j) => j !== i))
                          }
                        >
                          <XIcon size={11} />
                        </button>
                        {i === 0 && (
                          <span className="epf-img-cover">Cover</span>
                        )}
                      </motion.div>
                    ))}
                    <button
                      type="button"
                      className={`epf-upload-zone${dragOver ? " drag" : ""}`}
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e: DragEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e: DragEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setDragOver(false);
                        handleFiles(e.dataTransfer.files);
                      }}
                    >
                      <ImageIcon size={18} />
                      <span style={{ fontSize: 10, fontWeight: 600 }}>
                        Add Photo
                      </span>
                      <span style={{ fontSize: 9, opacity: 0.6 }}>
                        or drag & drop
                      </span>
                    </button>
                  </div>

                  <div className="epf-url-row">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setImageUrl(e.target.value)
                      }
                      placeholder="Or paste an image URL…"
                      className="epf-url-input"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="epf-url-add"
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

                {/* Mobile organize section - shown inline on mobile */}
                <div className="epf-mobile-organize">
                  <hr className="epf-divider" style={{ marginTop: 28 }} />
                  <SectionHead
                    title="Organization"
                    sub="Category, type, occasion & material"
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <Field label="Status">
                      <Dropdown
                        options={statusOptions}
                        value={formData.status}
                        onChange={(v) =>
                          setFormData((p) => ({ ...p, status: v }))
                        }
                        placeholder="Select status"
                      />
                    </Field>
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
                    <Field
                      label="Clothing Type"
                      required
                      error={errors.clothingType}
                    >
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
                        onChange={(v) =>
                          setFormData((p) => ({ ...p, occasion: v }))
                        }
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
              </form>
            </div>

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <div className="epf-sidebar">
              {/* Edit banner */}
              <div className="epf-edit-banner">
                <EditIcon size={13} stroke="var(--warn)" />
                <span
                  style={{ fontSize: 11, color: "#92400e", fontWeight: 600 }}
                >
                  You&apos;re editing an existing product
                </span>
              </div>

              {/* Status */}
              <div>
                <p className="epf-sidebar-label">Status</p>
                <Dropdown
                  options={statusOptions}
                  value={formData.status}
                  onChange={(v) => setFormData((p) => ({ ...p, status: v }))}
                  placeholder="Select status"
                />
                {formData.status && (
                  <div style={{ marginTop: 8 }}>
                    <span
                      className="epf-status-badge"
                      style={{
                        background:
                          formData.status === "PUBLISHED"
                            ? "#dcfce7"
                            : "#fef9c3",
                        color:
                          formData.status === "PUBLISHED"
                            ? "#15803d"
                            : "#a16207",
                      }}
                    >
                      <span
                        className="epf-dot"
                        style={{
                          background:
                            formData.status === "PUBLISHED"
                              ? "#22c55e"
                              : "#eab308",
                        }}
                      />
                      {
                        statusOptions.find((o) => o.value === formData.status)
                          ?.label
                      }
                    </span>
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: "var(--divider)" }} />

              {/* Organisation */}
              <div>
                <p className="epf-sidebar-label">Organization</p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
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
                  <Field
                    label="Clothing Type"
                    required
                    error={errors.clothingType}
                  >
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
                      onChange={(v) =>
                        setFormData((p) => ({ ...p, occasion: v }))
                      }
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
                <p className="epf-sidebar-label">Checklist</p>
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
                        background: done ? "var(--accent)" : "var(--border)",
                        transition: "background 0.2s",
                      }}
                    >
                      {done && (
                        <CheckIcon size={10} stroke="#fff" strokeWidth={3} />
                      )}
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

              <div style={{ height: 1, background: "var(--divider)" }} />

              {/* Product meta */}
              <div>
                <p className="epf-sidebar-label">Product Info</p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {(
                    [
                      ["ID", product.id.slice(0, 12) + "…"],
                      ["Images", `${images.length} uploaded`],
                      ["Variants", `${variants.length} total`],
                    ] as [string, string][]
                  ).map(([k, val]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          fontWeight: 500,
                        }}
                      >
                        {k}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text)",
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />
      </div>
    </>
  );
}
