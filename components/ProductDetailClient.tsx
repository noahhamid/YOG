"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductImageGallery from "./product/ProductImageGallery";
import ProductInfo from "./product/ProductInfo";
import SellerCard from "./product/SellerCard";
import ProductReviews from "./product/ProductReviews";
import { productCache } from "@/lib/productCache";
import Navbar from "@/components/Navbar";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  @keyframes pd-fade { from{opacity:0} to{opacity:1} }

  .pd-page { min-height:100vh; background:#f6f5f3; font-family:'Sora',sans-serif; }

  /* ── Body ── */
  .pd-body { max-width:1200px; margin:0 auto; padding:88px 20px 72px; }

  /* ── Top action row — back + breadcrumb + share/fav ── */
  .pd-topbar {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:22px; gap:12px;
  }
  .pd-topbar-left  { display:flex; align-items:center; gap:10px; min-width:0; }
  .pd-topbar-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .pd-icon-btn {
    width:36px; height:36px; border-radius:10px;
    border:1.5px solid #e8e4de; background:#fff;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    color:#9e9890; transition:all 0.15s; flex-shrink:0;
  }
  .pd-icon-btn:hover { border-color:#1a1714; color:#1a1714; background:#f5f3f0; }
  .pd-icon-btn.active { color:#ef4444; border-color:#fecaca; background:#fef2f2; }
  .pd-breadcrumb {
    font-size:12px; color:#9e9890; font-weight:500;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .pd-breadcrumb span { color:#1a1714; font-weight:700; }

  /* ── Main two-col grid ── */
  .pd-main-grid {
    display:grid;
    grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr);
    gap:32px; align-items:start; margin-bottom:48px;
  }
  @media(max-width:900px){ .pd-main-grid { grid-template-columns:1fr; gap:24px; } }

  /* Image col sticky — only navbar above it now (72px) */
  .pd-col-image { position:sticky; top:88px; }
  @media(max-width:900px){ .pd-col-image { position:static; } }

  .pd-col-info { display:flex; flex-direction:column; gap:18px; }

  .pd-desc-card {
    background:#fff; border:1px solid #e8e4de; border-radius:16px;
    padding:22px 24px; animation:pd-fade 0.4s ease both 0.15s;
  }
  .pd-desc-title { font-size:14px; font-weight:800; color:#1a1714; letter-spacing:-0.2px; margin:0 0 10px; }
  .pd-desc-text  { font-size:13px; color:#6b6560; line-height:1.85; white-space:pre-line; margin:0; }

  .pd-reviews-section {
    background:#fff; border:1px solid #e8e4de; border-radius:20px;
    padding:28px 28px 32px; animation:pd-fade 0.4s ease both 0.2s;
  }
  @media(max-width:640px){ .pd-reviews-section { padding:20px 16px 24px; border-radius:16px; } }

  .pd-info-card { animation:pd-fade 0.35s ease both; }
  .pd-info-card:nth-child(2) { animation-delay:0.06s; }
  .pd-info-card:nth-child(3) { animation-delay:0.12s; }
`;

const BackIco = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ShareIco = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </svg>
);
const HeartIco = ({ filled }: { filled?: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"}
    stroke={filled ? "#ef4444" : "currentColor"}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);
  const [liveRating, setLiveRating] = useState(product.rating || 0);
  const [liveCount, setLiveCount] = useState(product.reviewCount || 0);

  useEffect(() => {
    productCache.set(product.id, product);
  }, [product]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pd-page">
        <Navbar />
        <div className="pd-body">
          {/* ── Back + breadcrumb + actions ── */}
          <div className="pd-topbar">
            <div className="pd-topbar-left">
              <button className="pd-icon-btn" onClick={() => router.back()}>
                <BackIco />
              </button>
              <p className="pd-breadcrumb">
                {product.category} · <span>{product.title}</span>
              </p>
            </div>
            <div className="pd-topbar-right">
              <button className="pd-icon-btn" onClick={handleShare}>
                <ShareIco />
              </button>
              <button
                className={`pd-icon-btn${isFav ? " active" : ""}`}
                onClick={() => setIsFav(!isFav)}
              >
                <HeartIco filled={isFav} />
              </button>
            </div>
          </div>

          {/* ── Main two-col grid ── */}
          <div className="pd-main-grid">
            <div className="pd-col-image">
              <ProductImageGallery
                images={product.images}
                title={product.title}
                discount={product.discount}
              />
            </div>

            <div className="pd-col-info">
              <div className="pd-info-card">
                <SellerCard seller={product.seller} />
              </div>
              <div className="pd-info-card">
                <ProductInfo
                  product={{
                    ...product,
                    rating: liveRating,
                    reviewCount: liveCount,
                  }}
                />
              </div>
              {product.description && (
                <div className="pd-info-card pd-desc-card">
                  <p className="pd-desc-title">Description</p>
                  <p className="pd-desc-text">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Reviews ── */}
          <div className="pd-reviews-section">
            <ProductReviews
              productId={product.id}
              onReviewChange={(r, c) => {
                setLiveRating(r);
                setLiveCount(c);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
