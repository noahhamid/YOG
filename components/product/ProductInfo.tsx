"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import OrderModal from "./OrderModal";
import { toast } from "@/components/ToastProvider";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  .pi-wrap { font-family:'Sora',sans-serif; display:flex; flex-direction:column; gap:20px; }
  .pi-brand { font-size:11px; font-weight:700; color:#9e9890; text-transform:uppercase; letter-spacing:0.8px; margin:0; }
  .pi-title { font-size:26px; font-weight:800; color:#1a1714; letter-spacing:-0.7px; line-height:1.2; margin:4px 0 10px; }

  .pi-rating-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .pi-stars { display:flex; gap:2px; color:#eab308; }
  .pi-rating-val { font-size:13px; font-weight:700; color:#1a1714; }
  .pi-rating-count { font-size:12px; color:#9e9890; }
  .pi-sold-divider { width:3px; height:3px; border-radius:50%; background:#d1cdc7; }
  .pi-sold { font-size:12px; color:#9e9890; font-weight:500; }
  .pi-no-reviews { font-size:12px; color:#9e9890; }

  .pi-price-row { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
  .pi-price { font-size:30px; font-weight:800; color:#1a1714; letter-spacing:-1px; }
  .pi-compare { font-size:16px; color:#c4bfb8; text-decoration:line-through; }
  .pi-discount-tag { font-size:11px; font-weight:700; background:#fef2f2; color:#dc2626; padding:3px 8px; border-radius:6px; }

  .pi-stock-row { display:flex; align-items:center; gap:7px; }
  .pi-stock-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .pi-stock-label { font-size:12px; font-weight:600; }

  .pi-section-label {
    font-size:11px; font-weight:700; color:#9e9890;
    text-transform:uppercase; letter-spacing:0.6px;
    margin-bottom:10px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;
  }
  .pi-section-label span { color:#1a1714; font-weight:700; text-transform:none; letter-spacing:0; }

  .pi-size-error {
    color:#dc2626; font-size:11px; font-weight:600;
    text-transform:none; letter-spacing:0;
    display:flex; align-items:center; gap:4px;
  }
  @keyframes pi-error-in { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:none} }
  .pi-size-error { animation:pi-error-in 0.2s ease; }

  @keyframes pi-flash { 0%,100%{border-color:#e8e4de} 50%{border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,0.12);} }
  .pi-sizes.flash .pi-size-btn:not(:disabled) { animation:pi-flash 0.4s ease 2; }

  .pi-colors { display:flex; gap:8px; flex-wrap:wrap; }
  .pi-color-btn {
    width:32px; height:32px; border-radius:50%; border:2px solid #e8e4de;
    cursor:pointer; transition:all 0.15s; position:relative;
  }
  .pi-color-btn.active { border-color:#1a1714; border-width:2.5px; box-shadow:0 0 0 3px rgba(26,23,20,0.12); }
  .pi-color-btn:hover:not(.active) { border-color:#9e9890; transform:scale(1.1); }

  .pi-sizes { display:flex; gap:8px; flex-wrap:wrap; }
  .pi-size-btn {
    padding:7px 16px; border-radius:20px; border:1.5px solid #e8e4de;
    font-size:13px; font-weight:600; color:#1a1714; background:#fff;
    cursor:pointer; transition:all 0.15s; font-family:'Sora',sans-serif;
  }
  .pi-size-btn:hover:not(.active):not(:disabled) { border-color:#1a1714; }
  .pi-size-btn.active { background:#1a1714; color:#fff; border-color:#1a1714; }
  .pi-size-btn:disabled { border-color:#f0ede8; color:#d1cdc7; cursor:not-allowed; text-decoration:line-through; }

  .pi-qty-row { display:flex; align-items:center; gap:0; background:#f5f3f0; border-radius:22px; width:fit-content; border:1px solid #e8e4de; overflow:hidden; }
  .pi-qty-btn {
    width:36px; height:36px; border:none; background:transparent; font-size:18px;
    font-weight:600; cursor:pointer; color:#1a1714; transition:background 0.15s;
    display:flex; align-items:center; justify-content:center;
  }
  .pi-qty-btn:hover:not(:disabled) { background:#ebebeb; }
  .pi-qty-btn:disabled { color:#c4bfb8; cursor:not-allowed; }
  .pi-qty-val { min-width:36px; text-align:center; font-size:14px; font-weight:700; color:#1a1714; }

  .pi-actions { display:flex; flex-direction:column; gap:10px; }
  .pi-btn-primary {
    width:100%; padding:14px; border-radius:12px; border:none;
    background:#1a1714; color:#fff; font-size:14px; font-weight:700;
    cursor:pointer; transition:all 0.15s; display:flex; align-items:center;
    justify-content:center; gap:8px; font-family:'Sora',sans-serif;
  }
  .pi-btn-primary:hover:not(:disabled) { background:#333; box-shadow:0 4px 16px rgba(0,0,0,0.18); transform:translateY(-1px); }
  .pi-btn-primary:disabled { background:#e8e4de; color:#9e9890; cursor:not-allowed; transform:none; box-shadow:none; }
  .pi-btn-ghost {
    width:100%; padding:13px; border-radius:12px;
    border:1.5px solid #e8e4de; background:#fff; color:#1a1714;
    font-size:14px; font-weight:700; cursor:pointer; transition:all 0.15s;
    display:flex; align-items:center; justify-content:center; gap:8px;
    font-family:'Sora',sans-serif;
  }
  .pi-btn-ghost:hover:not(:disabled) { border-color:#1a1714; background:#f5f3f0; }
  .pi-btn-ghost:disabled { border-color:#f0ede8; color:#c4bfb8; cursor:not-allowed; }

  .pi-divider { border:none; border-top:1px solid #e8e4de; margin:0; }
`;

const StarIco = ({ filled }: { filled?: boolean }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const PackageIco = () => (
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
const CartIco = () => (
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
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const WarnIco = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function ProductInfo({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.value || "",
  );
  const [quantity, setQuantity] = useState(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [sizeFlash, setSizeFlash] = useState(false);

  const triggerSizeError = () => {
    setShowSizeError(true);
    setSizeFlash(true);
    document
      .getElementById("pi-size-section")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setSizeFlash(false), 900);
    setTimeout(() => setShowSizeError(false), 4000);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      triggerSizeError();
      return;
    }
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock: product.totalStock,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    });
    toast.cart(
      "Added to cart",
      `${product.title} · Size ${selectedSize} · Qty ${quantity}`,
    );
  };

  const handleOrderNow = () => {
    if (!selectedSize) {
      triggerSizeError();
      return;
    }
    setIsOrderModalOpen(true);
  };

  const canOrder = product.inStock;

  return (
    <>
      <style>{CSS}</style>
      <div className="pi-wrap">
        <div>
          {product.brand && <p className="pi-brand">{product.brand}</p>}
          <h1 className="pi-title">{product.title}</h1>
          {product.reviewCount > 0 ? (
            <div className="pi-rating-row">
              <div className="pi-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIco key={s} filled={s <= Math.round(product.rating)} />
                ))}
              </div>
              <span className="pi-rating-val">{product.rating}</span>
              <span className="pi-rating-count">
                ({product.reviewCount} review
                {product.reviewCount !== 1 ? "s" : ""})
              </span>
              {product.sold > 0 && (
                <>
                  <div className="pi-sold-divider" />
                  <span className="pi-sold">{product.sold} sold</span>
                </>
              )}
            </div>
          ) : (
            <div className="pi-rating-row">
              <div className="pi-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIco key={s} />
                ))}
              </div>
              <span className="pi-no-reviews">No reviews yet</span>
            </div>
          )}
        </div>

        <hr className="pi-divider" />

        <div className="pi-price-row">
          <span className="pi-price">{product.price.toLocaleString()} ETB</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <>
              <span className="pi-compare">
                {product.compareAtPrice.toLocaleString()} ETB
              </span>
              <span className="pi-discount-tag">
                -
                {Math.round(
                  ((product.compareAtPrice - product.price) /
                    product.compareAtPrice) *
                    100,
                )}
                %
              </span>
            </>
          )}
        </div>

        <div className="pi-stock-row">
          <div
            className="pi-stock-dot"
            style={{ background: product.inStock ? "#22c55e" : "#ef4444" }}
          />
          <span
            className="pi-stock-label"
            style={{ color: product.inStock ? "#16a34a" : "#dc2626" }}
          >
            {product.inStock
              ? `In Stock · ${product.totalStock} available`
              : "Out of Stock"}
          </span>
        </div>

        <hr className="pi-divider" />

        {product.colors.length > 0 && (
          <div>
            <p className="pi-section-label">
              Color:{" "}
              <span>
                {product.colors.find((c: any) => c.value === selectedColor)
                  ?.name || "Select"}
              </span>
            </p>
            <div className="pi-colors">
              {product.colors.map((c: any) => (
                <button
                  key={c.value}
                  className={`pi-color-btn ${selectedColor === c.value ? "active" : ""}`}
                  style={{
                    background: c.hex,
                    boxShadow:
                      c.hex === "#FFFFFF" || c.hex === "white"
                        ? "inset 0 0 0 1px #e8e4de"
                        : "none",
                  }}
                  onClick={() => setSelectedColor(c.value)}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div id="pi-size-section">
            <p className="pi-section-label">
              Size: <span>{selectedSize || "Select"}</span>
              {showSizeError && (
                <span className="pi-size-error">
                  <WarnIco /> Please select a size first
                </span>
              )}
            </p>
            <div className={`pi-sizes${sizeFlash ? " flash" : ""}`}>
              {product.sizes.map((s: any) => (
                <button
                  key={s.value}
                  className={`pi-size-btn ${selectedSize === s.value ? "active" : ""}`}
                  disabled={!s.available}
                  onClick={() => {
                    if (s.available) {
                      setSelectedSize(s.value);
                      setShowSizeError(false);
                    }
                  }}
                >
                  {s.value}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="pi-section-label">Quantity</p>
          <div className="pi-qty-row">
            <button
              className="pi-qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="pi-qty-val">{quantity}</span>
            <button
              className="pi-qty-btn"
              onClick={() =>
                setQuantity(Math.min(product.totalStock, quantity + 1))
              }
              disabled={quantity >= product.totalStock}
            >
              +
            </button>
          </div>
        </div>

        <div className="pi-actions">
          <button
            className="pi-btn-primary"
            onClick={handleOrderNow}
            disabled={!canOrder}
          >
            <PackageIco /> Order Now
          </button>
          <button
            className="pi-btn-ghost"
            onClick={handleAddToCart}
            disabled={!canOrder}
          >
            <CartIco /> Add to Cart
          </button>
        </div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          sellerId: product.seller.id,
          sellerName: product.seller.name,
        }}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
      />
    </>
  );
}
