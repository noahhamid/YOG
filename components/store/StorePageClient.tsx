"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Ico = ({ d, size = 16, sw = 1.75, fill = "none" }: any) => (
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
const MapPinIco = (p: any) => (
  <Ico
    {...p}
    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  />
);
const CalendarIco = (p: any) => (
  <Ico
    {...p}
    d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
  />
);
const CheckIco = (p: any) => <Ico {...p} d="M20 6 9 17l-5-5" sw={2.5} />;
const ShareIco = (p: any) => (
  <Ico
    {...p}
    d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
  />
);
const HeartIco = ({ filled, ...p }: any) => (
  <Ico
    {...p}
    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
    fill={filled ? "currentColor" : "none"}
  />
);
const AwardIco = (p: any) => (
  <Ico
    {...p}
    d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89 7 23l5-3 5 3-1.21-9.12"
  />
);
const InstaIco = (p: any) => (
  <Ico
    {...p}
    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z"
  />
);
const ExtLinkIco = (p: any) => (
  <Ico
    {...p}
    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"
  />
);
const PkgStatIco = (p: any) => (
  <Ico
    {...p}
    d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"
  />
);

function StarIcon({
  filled,
  half,
  size = 16,
}: {
  filled?: boolean;
  half?: boolean;
  size?: number;
}) {
  const id = `hg-${Math.random().toString(36).slice(2, 7)}`;
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={`url(#${id})`}
          stroke="#eab308"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#eab308" : "none"}
      stroke="#eab308"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon
          key={s}
          size={size}
          filled={s <= Math.floor(rating)}
          half={
            s === Math.ceil(rating) && rating % 1 >= 0.25 && rating % 1 < 0.75
          }
        />
      ))}
    </div>
  );
}

function AnimEye({ size = 22, color = "currentColor" }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill={color}
        stroke="none"
        className="st-i-iris"
      />
      <circle
        cx="12"
        cy="12"
        r="1.2"
        fill="white"
        stroke="none"
        className="st-i-iris"
      />
    </svg>
  );
}
function AnimBag({ size = 22, color = "currentColor" }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="st-i-bag"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function AnimUsers({ size = 22, color = "currentColor" }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" className="st-i-ubb" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" className="st-i-ubh" />
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        className="st-i-ufb"
      />
      <circle cx="9" cy="7" r="4" className="st-i-ufh" />
    </svg>
  );
}
function AnimPackage({ size = 22, color = "currentColor" }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="st-i-pkg"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  :root{--bg:#f6f5f3;--card:#fff;--text:#1a1714;--muted:#9e9890;--border:#e8e4de;--hover:#f5f3f0;--divider:rgba(0,0,0,0.06);}
  @keyframes st-fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes st-star-pop{0%{transform:scale(1)}40%{transform:scale(1.45)}70%{transform:scale(0.9)}100%{transform:scale(1)}}

  @keyframes st-eye-load{0%{transform:translateX(-5px);}50%{transform:translateX(5px);}100%{transform:translateX(0);}}
  @keyframes st-eye-loop{0%,100%{transform:translateX(-4px);}50%{transform:translateX(4px);}}
  .st-i-iris{animation:st-eye-load 1.3s ease-in-out both;animation-delay:0.05s;}
  .st-stat:hover .st-i-iris{animation:st-eye-loop 0.95s ease-in-out infinite!important;animation-delay:0s!important;}

  @keyframes st-bag-bounce{0%{transform:translateY(12px) scale(0.82);}50%{transform:translateY(-7px) scale(1.10);}70%{transform:translateY(3px) scale(0.96);}85%{transform:translateY(-2px) scale(1.02);}100%{transform:translateY(0) scale(1);}}
  @keyframes st-bag-rock{0%,100%{transform:rotate(0deg);}25%{transform:rotate(-12deg);}75%{transform:rotate(12deg);}}
  .st-i-bag{transform-origin:bottom center;animation:st-bag-bounce 0.7s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.1s;}
  .st-stat:hover .st-i-bag{animation:st-bag-rock 0.46s ease-in-out infinite!important;animation-delay:0s!important;transform-origin:bottom center;}

  @keyframes st-u-left{from{transform:translateX(-11px);}to{transform:translateX(0);}}
  @keyframes st-u-right{from{transform:translateX(11px);}to{transform:translateX(0);}}
  @keyframes st-u-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
  .st-i-ufb,.st-i-ufh{animation:st-u-left 0.38s ease both;animation-delay:0.15s;}
  .st-i-ubb,.st-i-ubh{animation:st-u-right 0.38s ease both;animation-delay:0.28s;}
  .st-stat:hover .st-i-ufh{animation:st-u-bob 0.5s ease-in-out infinite!important;animation-delay:0s!important;transform-origin:center;}
  .st-stat:hover .st-i-ubh{animation:st-u-bob 0.5s ease-in-out 0.15s infinite!important;animation-delay:0.15s!important;transform-origin:center;}
  .st-stat:hover .st-i-ufb,.st-stat:hover .st-i-ubb{animation:none!important;transform:translateX(0);}

  @keyframes st-pkg-drop{0%{transform:translateY(-18px) scale(0.78);}50%{transform:translateY(5px) scale(1.12);}70%{transform:translateY(-4px) scale(0.95);}85%{transform:translateY(2px) scale(1.03);}100%{transform:translateY(0) scale(1);}}
  @keyframes st-pkg-shake{0%,100%{transform:translateX(0) rotate(0deg);}20%{transform:translateX(-3px) rotate(-8deg);}40%{transform:translateX(3px) rotate(7deg);}60%{transform:translateX(-2px) rotate(-5deg);}80%{transform:translateX(2px) rotate(4deg);}}
  .st-i-pkg{transform-origin:center bottom;animation:st-pkg-drop 0.65s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.05s;}
  .st-stat:hover .st-i-pkg{animation:st-pkg-shake 0.5s ease-in-out infinite!important;animation-delay:0s!important;}

  .st-page{min-height:100vh;background:var(--bg);padding-top:72px;font-family:'Sora',sans-serif;}
  .st-cover{position:relative;height:260px;background:#1a1714;overflow:hidden;}
  .st-cover img{width:100%;height:100%;object-fit:cover;opacity:0.45;}
  .st-cover-fade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 60%);}
  .st-wrap{max-width:1280px;margin:0 auto;padding:0 24px 72px;}
  .st-header-card{background:var(--card);border-radius:20px;border:1px solid var(--border);padding:28px 32px;margin-top:-64px;position:relative;z-index:10;box-shadow:0 8px 32px rgba(0,0,0,0.1);animation:st-fadeUp 0.3s ease;margin-bottom:24px;}
  .st-header-inner{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;}
  .st-logo-wrap{position:relative;flex-shrink:0;}
  .st-logo{width:100px;height:100px;border-radius:18px;overflow:hidden;border:3px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,0.12);background:var(--hover);}
  .st-logo img{width:100%;height:100%;object-fit:cover;}
  .st-verified-badge{position:absolute;bottom:-6px;right:-6px;width:26px;height:26px;background:#2563eb;color:#fff;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;}
  .st-info{flex:1;min-width:0;}
  .st-name{font-size:26px;font-weight:800;color:var(--text);letter-spacing:-0.7px;margin:0 0 10px;}
  .st-meta-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:12px;}
  .st-meta-item{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--muted);font-weight:500;}
  .st-meta-item a{color:#e4006d;text-decoration:none;display:flex;align-items:center;gap:4px;}
  .st-meta-item a:hover{text-decoration:underline;}
  .st-badges{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px;}
  .st-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid;}
  .st-actions{display:flex;gap:10px;align-items:flex-start;flex-shrink:0;}
  .st-follow-btn{display:flex;align-items:center;gap:7px;padding:10px 20px;border-radius:11px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all 0.15s;font-family:'Sora',sans-serif;}
  .st-follow-btn.following{background:var(--hover);color:var(--text);border:1.5px solid var(--border);}
  .st-follow-btn.following:hover{border-color:var(--text);}
  .st-follow-btn.not-following{background:var(--text);color:#fff;border:1.5px solid transparent;}
  .st-follow-btn.not-following:hover{background:#333;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.16);}
  .st-share-btn{width:40px;height:40px;border-radius:11px;border:1.5px solid var(--border);background:var(--card);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
  .st-share-btn:hover{border-color:var(--text);color:var(--text);}

  /* ── Star rating row ── */
  .st-rating-row{display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-wrap:wrap;}
  .st-rating-avg{font-size:13px;font-weight:700;color:var(--text);}
  .st-rating-count{font-size:11px;color:var(--muted);}
  .st-rating-divider{width:1px;height:13px;background:var(--border);}

  /* Interactive stars the user taps */
  .st-rate-area{display:flex;align-items:center;gap:3px;}
  .st-rate-label{font-size:11px;font-weight:600;color:var(--muted);white-space:nowrap;min-width:68px;transition:color 0.15s;}
  .st-star-btn{background:none;border:none;padding:2px;cursor:pointer;line-height:0;transition:transform 0.18s cubic-bezier(0.34,1.56,0.64,1),filter 0.15s;will-change:transform;transform-origin:center bottom;}
  .st-star-btn:hover{transform:translateY(-3px);filter:drop-shadow(0 2px 4px rgba(234,179,8,0.45));}
  .st-star-btn:active{transform:translateY(0) scale(0.92);}
  .st-star-btn.popped{animation:st-star-pop 0.38s cubic-bezier(0.34,1.56,0.64,1) both;}
  .st-star-saving{font-size:10px;color:var(--muted);font-style:italic;transition:opacity 0.2s;}
  /* X / clear button */
  .st-clear-btn{background:none;border:none;cursor:pointer;padding:3px 5px;border-radius:6px;font-size:11px;font-weight:700;color:#c4bfb8;line-height:1;transition:color 0.15s,background 0.15s,transform 0.15s;margin-left:1px;}
  .st-clear-btn:hover{color:#dc2626;background:#fef2f2;transform:rotate(90deg);}

  .st-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
  @media(max-width:900px){.st-stats{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:500px){.st-stats{grid-template-columns:1fr 1fr;gap:10px;}}
  .st-stat{background:var(--card);border-radius:16px;border:1px solid var(--border);padding:20px 22px;display:flex;align-items:center;gap:14px;cursor:default;transition:box-shadow 0.2s,transform 0.2s,border-color 0.2s;}
  .st-stat:hover{box-shadow:0 6px 20px rgba(0,0,0,0.08);transform:translateY(-2px);border-color:rgba(0,0,0,0.1);}
  .st-stat-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:visible;}
  .st-stat-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin:0 0 3px;}
  .st-stat-val{font-size:22px;font-weight:800;color:var(--text);letter-spacing:-0.5px;margin:0;}
  .st-tabs{display:flex;gap:2px;border-bottom:1.5px solid var(--border);margin-bottom:24px;}
  .st-tab{padding:11px 18px;font-size:13px;font-weight:600;color:var(--muted);background:none;border:none;cursor:pointer;position:relative;font-family:'Sora',sans-serif;transition:color 0.15s;text-transform:capitalize;}
  .st-tab:hover{color:var(--text);}
  .st-tab.active{color:var(--text);}
  .st-tab.active::after{content:'';position:absolute;bottom:-1.5px;left:0;right:0;height:2px;background:var(--text);border-radius:2px 2px 0 0;}
  .st-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
  @media(max-width:1100px){.st-grid{grid-template-columns:repeat(3,1fr);}}
  @media(max-width:760px){.st-grid{grid-template-columns:repeat(2,1fr);gap:10px;}}
  .st-product-card{background:var(--card);border-radius:14px;overflow:hidden;border:1px solid var(--border);text-decoration:none;display:block;cursor:pointer;transition:box-shadow 0.22s,transform 0.22s,border-color 0.22s;will-change:transform;animation:st-fadeUp 0.35s ease both;}
  .st-product-card:hover{box-shadow:0 12px 36px rgba(0,0,0,0.10);transform:translateY(-3px);border-color:rgba(0,0,0,0.1);}
  .st-product-img{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--hover);}
  .st-product-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.45s ease;}
  .st-product-card:hover .st-product-img img{transform:scale(1.04);}
  .st-img-overlay{position:absolute;inset:0;z-index:4;background:linear-gradient(to top,rgba(0,0,0,0.46) 0%,rgba(0,0,0,0.04) 50%,transparent 72%);opacity:0;transition:opacity 0.22s;}
  .st-product-card:hover .st-img-overlay{opacity:1;}
  .st-add-btn{position:absolute;bottom:10px;left:10px;right:10px;z-index:5;padding:9px 0;border-radius:9px;border:none;background:#fff;color:var(--text);font-size:11px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transform:translateY(10px);opacity:0;transition:opacity 0.2s,transform 0.2s,background 0.15s;}
  .st-product-card:hover .st-add-btn{opacity:1;transform:translateY(0);}
  .st-add-btn:hover{background:#f0ede8;}
  .st-badge-img{position:absolute;z-index:6;top:8px;left:8px;padding:3px 9px;border-radius:20px;pointer-events:none;font-size:10px;font-weight:800;letter-spacing:0.2px;}
  .st-badge-img.sale{background:#dc2626;color:#fff;}
  .st-badge-img.new{background:#16a34a;color:#fff;}
  .st-badge-img.oos{background:rgba(26,23,20,0.75);color:#fff;backdrop-filter:blur(4px);}
  .st-product-body{padding:12px 13px 14px;display:flex;flex-direction:column;}
  .st-product-seller-row{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:3px;}
  .st-product-seller-name{font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0;}
  .st-product-verified{display:inline-flex;align-items:center;gap:3px;flex-shrink:0;padding:2px 6px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:0.2px;background:#e0f2fe;color:#0284c7;border:1px solid #bae6fd;}
  .st-product-name{font-size:13px;font-weight:700;color:var(--text);margin:0 0 7px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .st-product-meta{display:flex;align-items:center;gap:5px;margin-bottom:7px;flex-wrap:wrap;}
  .st-product-cat{padding:2px 7px;border-radius:20px;font-size:9px;font-weight:600;color:var(--muted);background:var(--hover);border:1px solid var(--border);}
  .st-product-stock{font-size:9px;font-weight:600;}
  .st-product-stock.low{color:#d97706;}
  .st-product-stock.ok{color:#16a34a;}
  .st-product-stock.none{color:#dc2626;}
  .st-product-colors{display:flex;align-items:center;gap:3px;margin-bottom:9px;}
  .st-color-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid rgba(0,0,0,0.1);flex-shrink:0;}
  .st-color-more{font-size:9px;color:var(--muted);font-weight:600;}
  .st-product-divider{height:1px;background:var(--border);margin:0 0 9px;}
  .st-product-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:4px;}
  .st-product-price{font-size:15px;font-weight:800;color:var(--text);letter-spacing:-0.4px;line-height:1.1;}
  .st-product-etb{font-size:10px;font-weight:500;color:var(--muted);margin-left:2px;}
  .st-product-compare{font-size:10px;color:#c4bfb8;text-decoration:line-through;display:block;margin-top:1px;}
  .st-product-sizes{display:flex;gap:3px;flex-wrap:wrap;justify-content:flex-end;}
  .st-product-size{padding:2px 5px;border-radius:4px;border:1px solid var(--border);font-size:8px;font-weight:700;color:var(--muted);letter-spacing:0.2px;transition:border-color 0.15s;}
  .st-product-card:hover .st-product-size{border-color:#c4bfb8;}
  .st-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;background:var(--card);border-radius:18px;border:1.5px dashed var(--border);text-align:center;}
  .st-empty-icon{width:64px;height:64px;background:var(--hover);border-radius:18px;display:flex;align-items:center;justify-content:center;color:var(--muted);margin-bottom:18px;}
  .st-empty-title{font-size:17px;font-weight:700;color:var(--text);margin:0 0 8px;}
  .st-empty-sub{font-size:13px;color:var(--muted);margin:0;}
  .st-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
  @media(max-width:640px){.st-about-grid{grid-template-columns:1fr;}}
  .st-about-card{background:var(--card);border-radius:16px;border:1px solid var(--border);padding:24px;}
  .st-about-desc{font-size:14px;color:#4a4540;line-height:1.75;margin:0 0 24px;}
  .st-about-section-title{font-size:13px;font-weight:700;color:var(--text);letter-spacing:-0.2px;margin:0 0 14px;}
  .st-about-row{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--muted);margin-bottom:10px;}
  .st-perf-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--divider);font-size:13px;}
  .st-perf-row:last-child{border-bottom:none;padding-bottom:0;}
  .st-perf-label{color:var(--muted);}
  .st-perf-val{font-weight:700;color:var(--text);}
`;

const COLOR_HEX: Record<string, string> = {
  black: "#1a1714",
  white: "#f8f8f8",
  gray: "#9ca3af",
  grey: "#9ca3af",
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#10b981",
  yellow: "#f59e0b",
  orange: "#f97316",
  purple: "#8b5cf6",
  pink: "#ec4899",
  brown: "#a16207",
  khaki: "#c4b5a0",
  navy: "#1e3a5f",
  beige: "#e8dcc8",
  cream: "#fef3c7",
};
const dot = (c: string) => {
  const k = c.toLowerCase().split(" ").pop() || "";
  return COLOR_HEX[k] || COLOR_HEX[c.toLowerCase()] || "#e8e4de";
};

const STAR_LABELS = ["", "Terrible", "Poor", "Okay", "Good", "Excellent"];

interface SellerStoreClientProps {
  seller: {
    id: string;
    name: string;
    slug: string;
    logo: string;
    coverImage: string;
    verified: boolean;
    location: string;
    joined: string;
    description: string;
    rating: number;
    totalReviews: number;
    followers: number;
    totalViews: number;
    totalSales: number;
    totalProducts: number;
    totalStock: number;
    instagram: string | null;
  };
  products: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    image: string;
    image2?: string;
    sold: number;
    sizes?: string[];
    colors?: string[];
    stock?: number;
    category?: string;
    isNew?: boolean;
  }>;
}

export default function StorePageClient({
  seller,
  products,
}: SellerStoreClientProps) {
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(seller.followers);
  const [activeTab, setActiveTab] = useState<"products" | "about">("products");

  // ── Star rating state ──
  const [avgRating, setAvgRating] = useState(seller.rating);
  const [totalRatings, setTotalRatings] = useState(seller.totalReviews);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [poppedStar, setPoppedStar] = useState(0);

  // ── Load follow + my rating ──
  useEffect(() => {
    const u = localStorage.getItem("yog_user");
    if (!u) return;
    // follow status
    fetch(`/api/stores/follow?sellerId=${seller.id}`, {
      headers: { "x-user-data": u },
    })
      .then((r) => r.json())
      .then((d) => setIsFollowing(d.isFollowing))
      .catch(() => {});
    // my rating
    fetch(`/api/stores/rating?sellerId=${seller.id}`, {
      headers: { "x-user-data": u },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.avg) setAvgRating(d.avg);
        if (d.total) setTotalRatings(d.total);
        if (d.myRating) setMyRating(d.myRating);
      })
      .catch(() => {});
  }, [seller.id]);

  const handleRate = async (star: number) => {
    const u = localStorage.getItem("yog_user");
    if (!u) {
      router.push("/login?redirect=/store/" + seller.slug);
      return;
    }

    // If clicking the same star → remove rating
    const newRating = myRating === star ? 0 : star;

    setPoppedStar(newRating);
    setSaving(true);
    const prevMy = myRating;
    const prevAvg = avgRating;
    const prevTotal = totalRatings;
    setMyRating(newRating);

    try {
      let res: Response;
      if (newRating === 0) {
        res = await fetch(`/api/stores/rating?sellerId=${seller.id}`, {
          method: "DELETE",
          headers: { "x-user-data": u },
        });
      } else {
        res = await fetch("/api/stores/rating", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-data": u },
          body: JSON.stringify({ sellerId: seller.id, rating: newRating }),
        });
      }
      const data = (await res.json()) as {
        avg: number;
        total: number;
        myRating: number;
      };
      setAvgRating(data.avg);
      setTotalRatings(data.total);
      setMyRating(data.myRating);
    } catch {
      setMyRating(prevMy);
      setAvgRating(prevAvg);
      setTotalRatings(prevTotal);
    } finally {
      setSaving(false);
      setTimeout(() => setPoppedStar(0), 400);
    }
  };

  const handleFollow = async () => {
    const u = localStorage.getItem("yog_user");
    if (!u) {
      alert("Please sign in to follow stores");
      router.push("/login?redirect=/store/" + seller.slug);
      return;
    }
    const was = isFollowing;
    setIsFollowing(!was);
    setFollowerCount((p) => (was ? p - 1 : p + 1));
    fetch("/api/stores/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-data": u },
      body: JSON.stringify({
        sellerId: seller.id,
        action: was ? "unfollow" : "follow",
      }),
    }).catch(() => {
      setIsFollowing(was);
      setFollowerCount((p) => (was ? p + 1 : p - 1));
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: seller.name,
          text: `Check out ${seller.name} on YOG!`,
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      alert("Store link copied!");
    }
  };

  const statCards = [
    {
      icon: <AnimEye size={22} color="#2563eb" />,
      label: "Monthly Views",
      value: seller.totalViews.toLocaleString(),
      iconBg: "#eff6ff",
      delay: 0.1,
    },
    {
      icon: <AnimBag size={22} color="#16a34a" />,
      label: "Total Sales",
      value: seller.totalSales.toLocaleString(),
      iconBg: "#f0fdf4",
      delay: 0.18,
    },
    {
      icon: <AnimUsers size={22} color="#7c3aed" />,
      label: "Followers",
      value: followerCount.toLocaleString(),
      iconBg: "#faf5ff",
      delay: 0.26,
    },
    {
      icon: <AnimPackage size={22} color="#d97706" />,
      label: "Products",
      value: String(seller.totalProducts),
      iconBg: "#fff7ed",
      delay: 0.34,
    },
  ];

  const displayRating = hoverRating || myRating || avgRating;
  const activeStars = hoverRating || myRating;

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <main className="st-page">
        <div className="st-cover">
          <img src={seller.coverImage} alt={seller.name} />
          <div className="st-cover-fade" />
        </div>
        <div className="st-wrap">
          {/* ── Header card ── */}
          <div className="st-header-card">
            <div className="st-header-inner">
              <div className="st-logo-wrap">
                <div className="st-logo">
                  <img src={seller.logo} alt={seller.name} />
                </div>
                {seller.verified && (
                  <div className="st-verified-badge">
                    <CheckIco size={12} sw={3} />
                  </div>
                )}
              </div>

              <div className="st-info">
                <h1 className="st-name">{seller.name}</h1>
                <div className="st-meta-row">
                  {seller.location && (
                    <span className="st-meta-item">
                      <MapPinIco size={12} /> {seller.location}
                    </span>
                  )}
                  <span className="st-meta-item">
                    <CalendarIco size={12} /> Joined {seller.joined}
                  </span>
                  {seller.instagram && (
                    <span className="st-meta-item">
                      <InstaIco size={12} />
                      <a
                        href={`https://instagram.com/${seller.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {seller.instagram} <ExtLinkIco size={10} />
                      </a>
                    </span>
                  )}
                </div>

                {/* ── Rating row ── */}
                <div className="st-rating-row">
                  {/* Avg display */}
                  <StarDisplay rating={avgRating} size={14} />
                  {avgRating > 0 && (
                    <span className="st-rating-avg">
                      {avgRating.toFixed(1)}
                    </span>
                  )}
                  <span className="st-rating-count">
                    {totalRatings > 0
                      ? `(${totalRatings} ${totalRatings === 1 ? "rating" : "ratings"})`
                      : "No ratings yet"}
                  </span>

                  {/* Divider */}
                  <div className="st-rating-divider" />

                  {/* Interactive rate-this-store stars */}
                  <div
                    className="st-rate-area"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <span className="st-rate-label">
                      {hoverRating
                        ? STAR_LABELS[hoverRating]
                        : myRating
                          ? `Your rating`
                          : "Rate store:"}
                    </span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        className={`st-star-btn${poppedStar === s ? " popped" : ""}`}
                        onMouseEnter={() => setHoverRating(s)}
                        onClick={() => handleRate(s)}
                        disabled={saving}
                        title={STAR_LABELS[s]}
                      >
                        <StarIcon size={20} filled={(activeStars || 0) >= s} />
                      </button>
                    ))}
                    {saving && <span className="st-star-saving">saving…</span>}
                    {myRating > 0 && !saving && (
                      <button
                        className="st-clear-btn"
                        onClick={() => handleRate(myRating)}
                        title="Remove your rating"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="st-badges">
                  {seller.verified && (
                    <span
                      className="st-badge"
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        borderColor: "#bfdbfe",
                      }}
                    >
                      <AwardIco size={10} /> Verified Seller
                    </span>
                  )}
                  {avgRating >= 4.5 && totalRatings >= 3 && (
                    <span
                      className="st-badge"
                      style={{
                        background: "#fefce8",
                        color: "#a16207",
                        borderColor: "#fde68a",
                      }}
                    >
                      <StarIcon size={10} filled /> Top Rated
                    </span>
                  )}
                  {seller.totalStock > 100 && (
                    <span
                      className="st-badge"
                      style={{
                        background: "#f0fdf4",
                        color: "#15803d",
                        borderColor: "#bbf7d0",
                      }}
                    >
                      <PkgStatIco size={10} /> Large Inventory
                    </span>
                  )}
                </div>
              </div>

              <div className="st-actions">
                <button
                  className={`st-follow-btn ${isFollowing ? "following" : "not-following"}`}
                  onClick={handleFollow}
                >
                  <HeartIco size={15} filled={isFollowing} />
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button className="st-share-btn" onClick={handleShare}>
                  <ShareIco size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="st-stats">
            {statCards.map((s) => (
              <motion.div
                key={s.label}
                className="st-stat"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: s.delay,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="st-stat-icon" style={{ background: s.iconBg }}>
                  {s.icon}
                </div>
                <div>
                  <p className="st-stat-label">{s.label}</p>
                  <p className="st-stat-val">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="st-tabs">
            {(["products", "about"] as const).map((tab) => (
              <button
                key={tab}
                className={`st-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "products" && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {products.length === 0 ? (
                  <div className="st-empty">
                    <div className="st-empty-icon">
                      <PkgStatIco size={28} />
                    </div>
                    <p className="st-empty-title">No products yet</p>
                    <p className="st-empty-sub">
                      This store hasn&apos;t listed any products yet
                    </p>
                  </div>
                ) : (
                  <div className="st-grid">
                    {products.map((product, i) => {
                      const discount =
                        product.compareAtPrice &&
                        product.compareAtPrice > product.price
                          ? Math.round(
                              ((product.compareAtPrice - product.price) /
                                product.compareAtPrice) *
                                100,
                            )
                          : 0;
                      const isOOS = product.stock === 0;
                      const stockLabel = isOOS
                        ? { text: "Out of stock", cls: "none" }
                        : (product.stock ?? 99) <= 5
                          ? { text: `Only ${product.stock} left`, cls: "low" }
                          : { text: "In stock", cls: "ok" };
                      const uniqueColors = [
                        ...new Set<string>(product.colors || []),
                      ];
                      const categoryLabel = product.category
                        ? product.category.charAt(0).toUpperCase() +
                          product.category.slice(1).toLowerCase()
                        : null;
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="st-product-card"
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <div className="st-product-img">
                            <img src={product.image} alt={product.title} />
                            <div className="st-img-overlay" />
                            {isOOS && (
                              <span className="st-badge-img oos">
                                Out of stock
                              </span>
                            )}
                            {!isOOS && discount > 0 && (
                              <span className="st-badge-img sale">
                                −{discount}%
                              </span>
                            )}
                            {!isOOS && product.isNew && !discount && (
                              <span className="st-badge-img new">New</span>
                            )}
                            <button
                              className="st-add-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <svg
                                width="11"
                                height="11"
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
                              {isOOS ? "Out of stock" : "Add to cart"}
                            </button>
                          </div>
                          <div className="st-product-body">
                            <div className="st-product-seller-row">
                              <span className="st-product-seller-name">
                                {seller.name}
                              </span>
                              {seller.verified && (
                                <span className="st-product-verified">
                                  <svg
                                    width="8"
                                    height="8"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="st-product-name">{product.title}</p>
                            <div className="st-product-meta">
                              {categoryLabel && (
                                <span className="st-product-cat">
                                  {categoryLabel}
                                </span>
                              )}
                              <span
                                className={`st-product-stock ${stockLabel.cls}`}
                              >
                                {stockLabel.text}
                              </span>
                            </div>
                            {uniqueColors.length > 0 && (
                              <div className="st-product-colors">
                                {uniqueColors.slice(0, 5).map((c, ci) => (
                                  <span
                                    key={ci}
                                    className="st-color-dot"
                                    style={{ background: dot(c) }}
                                    title={c}
                                  />
                                ))}
                                {uniqueColors.length > 5 && (
                                  <span className="st-color-more">
                                    +{uniqueColors.length - 5}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="st-product-divider" />
                            <div className="st-product-bottom">
                              <div>
                                <p className="st-product-price">
                                  {product.price.toLocaleString()}
                                  <span className="st-product-etb">ETB</span>
                                </p>
                                {discount > 0 && (
                                  <span className="st-product-compare">
                                    {product.compareAtPrice?.toLocaleString()}{" "}
                                    ETB
                                  </span>
                                )}
                              </div>
                              {(product.sizes?.length ?? 0) > 0 && (
                                <div className="st-product-sizes">
                                  {product.sizes!.slice(0, 3).map((s) => (
                                    <span key={s} className="st-product-size">
                                      {s}
                                    </span>
                                  ))}
                                  {product.sizes!.length > 3 && (
                                    <span className="st-product-size">…</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <div className="st-about-card" style={{ marginBottom: 16 }}>
                  <p className="st-about-desc">{seller.description}</p>
                  <div className="st-about-grid">
                    <div>
                      <p className="st-about-section-title">
                        Store Information
                      </p>
                      {seller.location && (
                        <div className="st-about-row">
                          <MapPinIco size={14} /> {seller.location}
                        </div>
                      )}
                      <div className="st-about-row">
                        <CalendarIco size={14} /> Member since {seller.joined}
                      </div>
                      {seller.instagram && (
                        <div className="st-about-row">
                          <InstaIco size={14} />
                          <a
                            href={`https://instagram.com/${seller.instagram.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#e4006d",
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            {seller.instagram} <ExtLinkIco size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="st-about-section-title">Performance</p>
                      {[
                        ["Total Products", seller.totalProducts],
                        ["Total Stock", `${seller.totalStock} items`],
                        [
                          "Customer Rating",
                          avgRating > 0
                            ? `${avgRating.toFixed(1)} / 5.0`
                            : "No ratings yet",
                        ],
                        ["Total Sales", seller.totalSales.toLocaleString()],
                      ].map(([label, val]) => (
                        <div key={label as string} className="st-perf-row">
                          <span className="st-perf-label">{label}</span>
                          <span className="st-perf-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
