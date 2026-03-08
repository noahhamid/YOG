"use client";
import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  @keyframes om-in { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
  @keyframes om-spin { to{transform:rotate(360deg)} }
  .om-backdrop {
    position:fixed; inset:0; background:rgba(0,0,0,0.48); z-index:100;
    display:flex; align-items:flex-end; justify-content:center; padding:0;
    backdrop-filter:blur(3px);
  }
  @media(min-width:640px){.om-backdrop{align-items:center;padding:20px;}}
  .om-modal {
    background:#fff; width:100%; max-width:560px; max-height:92vh;
    overflow-y:auto; border-radius:24px 24px 0 0; font-family:'Sora',sans-serif;
    animation:om-in 0.28s cubic-bezier(0.22,1,0.36,1);
  }
  @media(min-width:640px){.om-modal{border-radius:24px;}}
  .om-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:22px 24px 18px; border-bottom:1px solid #e8e4de;
    position:sticky; top:0; background:#fff; z-index:10; border-radius:24px 24px 0 0;
  }
  @media(min-width:640px){.om-header{border-radius:24px 24px 0 0;}}
  .om-title { font-size:18px; font-weight:800; color:#1a1714; letter-spacing:-0.5px; margin:0; }
  .om-close {
    width:34px; height:34px; border-radius:50%; border:1.5px solid #e8e4de;
    background:#fff; cursor:pointer; display:flex; align-items:center;
    justify-content:center; color:#9e9890; transition:all 0.15s;
  }
  .om-close:hover { border-color:#1a1714; color:#1a1714; }
  .om-body { padding:20px 24px 28px; display:flex; flex-direction:column; gap:18px; }

  /* Product summary */
  .om-product {
    display:flex; gap:14px; background:#f5f3f0; border-radius:14px;
    padding:14px; border:1px solid #e8e4de;
  }
  .om-product-img { width:72px; height:72px; border-radius:10px; overflow:hidden; flex-shrink:0; background:#e8e4de; }
  .om-product-img img { width:100%; height:100%; object-fit:cover; }
  .om-product-info { flex:1; min-width:0; }
  .om-product-name { font-size:14px; font-weight:700; color:#1a1714; margin:0 0 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .om-product-meta { font-size:12px; color:#9e9890; margin:0 0 3px; }
  .om-product-price { font-size:16px; font-weight:800; color:#1a1714; margin:6px 0 0; letter-spacing:-0.3px; }

  /* Form */
  .om-field { display:flex; flex-direction:column; gap:6px; }
  .om-label { font-size:12px; font-weight:700; color:#1a1714; display:flex; align-items:center; gap:6px; }
  .om-required { color:#dc2626; }
  .om-input, .om-textarea {
    width:100%; padding:11px 14px; border:1.5px solid #e8e4de; border-radius:10px;
    font-size:13px; font-family:'Sora',sans-serif; color:#1a1714;
    background:#fff; outline:none; transition:border-color 0.15s;
    box-sizing:border-box;
  }
  .om-input:focus, .om-textarea:focus { border-color:#1a1714; }
  .om-input::placeholder, .om-textarea::placeholder { color:#c4bfb8; }
  .om-textarea { resize:none; }

  /* Delivery method */
  .om-delivery-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .om-delivery-btn {
    padding:14px 12px; border:1.5px solid #e8e4de; border-radius:12px;
    display:flex; align-items:center; gap:10px; cursor:pointer;
    background:#fff; transition:all 0.15s; font-family:'Sora',sans-serif; text-align:left;
  }
  .om-delivery-btn:hover:not(.active) { border-color:#9e9890; background:#f5f3f0; }
  .om-delivery-btn.active { border-color:#1a1714; background:#1a1714; color:#fff; }
  .om-delivery-icon { width:36px; height:36px; border-radius:9px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .om-delivery-btn:not(.active) .om-delivery-icon { background:#f5f3f0; }
  .om-delivery-name { font-size:13px; font-weight:700; }
  .om-delivery-sub { font-size:11px; opacity:0.7; margin-top:1px; }

  /* Order summary */
  .om-summary { background:#f5f3f0; border-radius:14px; padding:16px; border:1px solid #e8e4de; }
  .om-summary-row { display:flex; justify-content:space-between; align-items:center; font-size:13px; margin-bottom:8px; }
  .om-summary-row:last-child { margin-bottom:0; padding-top:10px; border-top:1px solid #e8e4de; }
  .om-summary-label { color:#9e9890; }
  .om-summary-val { font-weight:600; color:#1a1714; }
  .om-total-label { font-size:14px; font-weight:700; color:#1a1714; }
  .om-total-val { font-size:20px; font-weight:800; color:#1a1714; letter-spacing:-0.5px; }

  /* Submit */
  .om-submit {
    width:100%; padding:14px; border-radius:12px; border:none;
    background:#1a1714; color:#fff; font-size:14px; font-weight:700;
    cursor:pointer; transition:all 0.15s; display:flex; align-items:center;
    justify-content:center; gap:8px; font-family:'Sora',sans-serif;
  }
  .om-submit:hover:not(:disabled) { background:#333; box-shadow:0 4px 16px rgba(0,0,0,0.18); }
  .om-submit:disabled { background:#e8e4de; color:#9e9890; cursor:not-allowed; }
  .om-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:om-spin 0.7s linear infinite; }
`;

const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const TruckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const MeetupIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const PackageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const PinIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    sellerId: string;
    sellerName: string;
  };
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export default function OrderModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity,
}: Props) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryMethod: "DELIVERY" as "DELIVERY" | "MEETUP",
    deliveryAddress: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = form.deliveryMethod === "DELIVERY" ? 50 : 0;
  const subtotal = product.price * quantity;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone) {
      alert("Please fill in all required fields");
      return;
    }
    if (form.deliveryMethod === "DELIVERY" && !form.deliveryAddress) {
      alert("Please provide a delivery address");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          sellerId: product.sellerId,
          quantity,
          selectedSize,
          selectedColor,
          unitPrice: product.price,
          totalPrice: subtotal,
          deliveryFee,
          finalTotal: total,
          deliveryMethod: form.deliveryMethod,
          deliveryAddress: form.deliveryAddress,
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || undefined,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Order placed! Order #${data.orderNumber}`);
        onClose();
        setForm({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          deliveryMethod: "DELIVERY",
          deliveryAddress: "",
          notes: "",
        });
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="om-backdrop " onClick={onClose}>
        <div className="om-modal" onClick={(e) => e.stopPropagation()}>
          <div className="om-header">
            <h2 className="om-title">Place Order</h2>
            <button className="om-close" onClick={onClose}>
              <XIcon />
            </button>
          </div>

          <div className="om-body">
            {/* Product */}
            <div className="om-product">
              <div className="om-product-img">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="om-product-info">
                <p className="om-product-name">{product.title}</p>
                <p className="om-product-meta">
                  Size: {selectedSize} · Color: {selectedColor}
                </p>
                <p className="om-product-meta">Qty: {quantity}</p>
                <p className="om-product-price">
                  {product.price.toLocaleString()} ETB
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="om-field">
              <label className="om-label">
                <UserIcon /> Full Name <span className="om-required">*</span>
              </label>
              <input
                className="om-input"
                type="text"
                placeholder="John Doe"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                required
              />
            </div>

            <div className="om-field">
              <label className="om-label">
                <PhoneIcon /> Phone Number{" "}
                <span className="om-required">*</span>
              </label>
              <input
                className="om-input"
                type="tel"
                placeholder="+251 912 345 678"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
                required
              />
            </div>

            <div className="om-field">
              <label className="om-label">
                <PackageIcon /> Email{" "}
                <span style={{ color: "#9e9890", fontWeight: 500 }}>
                  (optional)
                </span>
              </label>
              <input
                className="om-input"
                type="email"
                placeholder="john@example.com"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
              />
            </div>

            {/* Delivery method */}
            <div className="om-field">
              <label className="om-label">
                Delivery Method <span className="om-required">*</span>
              </label>
              <div className="om-delivery-grid">
                <button
                  type="button"
                  className={`om-delivery-btn ${form.deliveryMethod === "DELIVERY" ? "active" : ""}`}
                  onClick={() =>
                    setForm({ ...form, deliveryMethod: "DELIVERY" })
                  }
                >
                  <div className="om-delivery-icon">
                    <TruckIcon />
                  </div>
                  <div>
                    <p className="om-delivery-name">Delivery</p>
                    <p className="om-delivery-sub">50 ETB fee</p>
                  </div>
                </button>
                <button
                  type="button"
                  className={`om-delivery-btn ${form.deliveryMethod === "MEETUP" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, deliveryMethod: "MEETUP" })}
                >
                  <div className="om-delivery-icon">
                    <MeetupIcon />
                  </div>
                  <div>
                    <p className="om-delivery-name">Meet Up</p>
                    <p className="om-delivery-sub">Free</p>
                  </div>
                </button>
              </div>
            </div>

            {form.deliveryMethod === "DELIVERY" && (
              <div className="om-field">
                <label className="om-label">
                  <PinIcon /> Delivery Address{" "}
                  <span className="om-required">*</span>
                </label>
                <textarea
                  className="om-textarea"
                  rows={3}
                  placeholder="Street address, city, zip..."
                  value={form.deliveryAddress}
                  onChange={(e) =>
                    setForm({ ...form, deliveryAddress: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="om-field">
              <label className="om-label">
                Notes{" "}
                <span style={{ color: "#9e9890", fontWeight: 500 }}>
                  (optional)
                </span>
              </label>
              <textarea
                className="om-textarea"
                rows={2}
                placeholder="Any special instructions..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {/* Summary */}
            <div className="om-summary">
              <div className="om-summary-row">
                <span className="om-summary-label">Subtotal</span>
                <span className="om-summary-val">
                  {subtotal.toLocaleString()} ETB
                </span>
              </div>
              <div className="om-summary-row">
                <span className="om-summary-label">Delivery fee</span>
                <span className="om-summary-val">
                  {deliveryFee === 0 ? "Free" : `${deliveryFee} ETB`}
                </span>
              </div>
              <div className="om-summary-row">
                <span className="om-total-label">Total</span>
                <span className="om-total-val">
                  {total.toLocaleString()} ETB
                </span>
              </div>
            </div>

            <button
              className="om-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="om-spinner" />
                  Placing order…
                </>
              ) : (
                <>
                  <PackageIcon /> Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
