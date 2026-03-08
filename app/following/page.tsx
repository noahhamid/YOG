"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

interface FollowedSeller {
  followId: string;
  followedAt: string;
  seller: {
    id: string;
    brandName: string;
    storeSlug: string | null;
    storeLogo: string | null;
    storeCover: string | null;
    storeDescription: string | null;
    location: string;
    followers: number;
    totalProducts: number;
    totalSales: number;
    approved: boolean;
  };
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  .fw-page { font-family:'Sora',sans-serif; }

  .fw-card {
    position:relative; overflow:hidden; border-radius:16px;
    aspect-ratio:16/3.5; cursor:pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .fw-card:hover { transform:translateY(-3px); box-shadow:0 20px 48px rgba(0,0,0,0.18); }

  .fw-card-bg {
    position:absolute; inset:0; object-fit:cover; width:100%; height:100%;
    transition: transform 0.5s ease;
  }
  .fw-card:hover .fw-card-bg { transform:scale(1.04); }

  /* dark gradient overlay */
  .fw-card-overlay {
    position:absolute; inset:0;
    background:linear-gradient(
      to right,
      rgba(12,10,8,0.88) 0%,
      rgba(12,10,8,0.55) 50%,
      rgba(12,10,8,0.12) 100%
    );
  }

  .fw-card-body {
    position:absolute; inset:0;
    display:flex; align-items:center; gap:16px;
    padding:18px 24px;
  }

  .fw-logo {
    width:44px; height:44px; border-radius:10px; overflow:hidden;
    border:2px solid rgba(255,255,255,0.25); flex-shrink:0;
    background:#1a1714;
  }

  .fw-info { flex:1; min-width:0; }
  .fw-brand { font-size:15px; font-weight:800; color:#fff; letter-spacing:-0.4px; margin:0 0 2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fw-location { display:flex; align-items:center; gap:4px; font-size:10px; color:rgba(255,255,255,0.5); font-weight:600; margin-bottom:0; }
  .fw-desc { display:none; }

  .fw-stats { display:flex; gap:16px; margin-top:7px; }
  .fw-stat-val { font-size:12px; font-weight:800; color:#fff; line-height:1; margin:0 0 2px; }
  .fw-stat-lbl { font-size:9px; color:rgba(255,255,255,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin:0; }

  .fw-actions { display:flex; flex-direction:row; gap:8px; flex-shrink:0; align-items:center; }
  .fw-btn-visit {
    padding:8px 16px; background:#fff; color:#1a1714;
    border:none; border-radius:9px; font-size:11px; font-weight:700;
    cursor:pointer; font-family:'Sora',sans-serif; white-space:nowrap;
    transition:all 0.18s; display:inline-flex; align-items:center; gap:5px;
  }
  .fw-btn-visit:hover { background:#f0ede9; transform:translateY(-1px); }
  .fw-btn-unfollow {
    padding:8px 14px; background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7);
    border:1px solid rgba(255,255,255,0.18); border-radius:9px;
    font-size:11px; font-weight:600; cursor:pointer; font-family:'Sora',sans-serif;
    transition:all 0.18s; display:inline-flex; align-items:center; justify-content:center; gap:5px;
    backdrop-filter:blur(6px);
  }
  .fw-btn-unfollow:hover { background:rgba(239,68,68,0.3); border-color:rgba(239,68,68,0.5); color:#fca5a5; }
  .fw-btn-unfollow:disabled { opacity:0.5; cursor:not-allowed; }

  /* skeleton pulse */
  @keyframes fw-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .fw-skeleton { animation:fw-pulse 1.6s ease-in-out infinite; }
`;

const MapPinIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ArrowIcon = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const StoreIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const SpinnerIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function FollowingPage() {
  const router = useRouter();
  const [following, setFollowing] = useState<FollowedSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unfollowing, setUnfollowing] = useState<string | null>(null);

  useEffect(() => {
    loadFollowing();
  }, []);

  const loadFollowing = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login?redirect=/following");
      return;
    }
    try {
      const res = await fetch("/api/following", {
        headers: { "x-user-data": userStr },
      });
      const data = await res.json();
      if (res.ok) setFollowing(data.following);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (sellerId: string) => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr || !confirm("Unfollow this store?")) return;
    setUnfollowing(sellerId);
    try {
      const res = await fetch("/api/store/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-data": userStr },
        body: JSON.stringify({ sellerId, action: "unfollow" }),
      });
      if (res.ok)
        setFollowing((prev) => prev.filter((f) => f.seller.id !== sellerId));
    } catch (e) {
      console.error(e);
    } finally {
      setUnfollowing(null);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <main className="min-h-screen bg-[#f6f5f3] fw-page pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.3px] mb-1.5">
              Your network
            </p>
            <div className="flex items-end justify-between">
              <h1 className="text-[30px] font-extrabold text-[#1a1714] tracking-tight leading-none">
                Following
              </h1>
              {!isLoading && following.length > 0 && (
                <span className="text-[13px] font-semibold text-[#9e9890]">
                  {following.length} store{following.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Loading skeletons */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="fw-skeleton rounded-[16px] bg-[#d4cfc9]"
                  style={{ aspectRatio: "16/3.5" }}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && following.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div
                className="w-18 h-18 rounded-2xl flex items-center justify-center mb-5 text-[#9e9890]"
                style={{
                  width: 72,
                  height: 72,
                  background: "#fff",
                  border: "1px solid #e8e4de",
                }}
              >
                <StoreIcon />
              </div>
              <h2 className="text-[18px] font-extrabold text-[#1a1714] mb-1.5">
                No stores followed yet
              </h2>
              <p className="text-[13px] text-[#9e9890] max-w-xs mb-6 leading-relaxed">
                Follow your favourite stores to get updates on new drops and
                exclusive offers.
              </p>
              <Link href="/shop">
                <button className="inline-flex items-center gap-2 bg-[#1a1714] text-white px-6 py-3 rounded-[11px] text-[13px] font-bold hover:bg-[#333] transition-all cursor-pointer hover:-translate-y-px hover:shadow-lg">
                  Explore Stores <ArrowIcon />
                </button>
              </Link>
            </div>
          )}

          {/* Store cards — full-width cinematic cards stacked */}
          {!isLoading && following.length > 0 && (
            <div className="flex flex-col gap-3">
              {following.map((item, idx) => (
                <div
                  key={item.followId}
                  className="fw-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Background cover */}
                  {item.seller.storeCover ? (
                    <img
                      src={item.seller.storeCover}
                      alt=""
                      className="fw-card-bg"
                    />
                  ) : (
                    <div
                      className="fw-card-bg"
                      style={{ background: `hsl(${(idx * 47) % 360},18%,14%)` }}
                    />
                  )}

                  {/* Gradient overlay */}
                  <div className="fw-card-overlay" />

                  {/* Body */}
                  <div className="fw-card-body">
                    {/* Logo */}
                    <div className="fw-logo">
                      {item.seller.storeLogo ? (
                        <Image
                          src={item.seller.storeLogo}
                          alt={item.seller.brandName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white opacity-60">
                          <StoreIcon />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="fw-info">
                      <h3 className="fw-brand">{item.seller.brandName}</h3>
                      {item.seller.location && (
                        <div className="fw-location">
                          <MapPinIcon />
                          {item.seller.location}
                        </div>
                      )}
                      {item.seller.storeDescription && (
                        <p className="fw-desc">
                          {item.seller.storeDescription}
                        </p>
                      )}
                      <div className="fw-stats">
                        {[
                          [item.seller.totalProducts, "Products"],
                          [item.seller.followers, "Followers"],
                          [item.seller.totalSales, "Sales"],
                        ].map(([v, l]) => (
                          <div key={l as string}>
                            <p className="fw-stat-val">
                              {(v as number).toLocaleString()}
                            </p>
                            <p className="fw-stat-lbl">{l as string}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="fw-actions">
                      <Link
                        href={`/store/${item.seller.storeSlug ?? item.seller.id}`}
                      >
                        <button className="fw-btn-visit">
                          Visit Store <ArrowIcon />
                        </button>
                      </Link>
                      <button
                        className="fw-btn-unfollow"
                        onClick={() => handleUnfollow(item.seller.id)}
                        disabled={unfollowing === item.seller.id}
                      >
                        {unfollowing === item.seller.id ? (
                          <>
                            <SpinnerIcon /> Unfollowing
                          </>
                        ) : (
                          <>
                            <HeartIcon filled />
                            &nbsp;Following
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
