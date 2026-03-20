"use client";

import { useState, useEffect, useRef } from "react";

const LOGO_URL =
  "https://res.cloudinary.com/ddfozmzv0/image/upload/v1774012277/edited-photo_ojra9c.png";

const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  .nav-root * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

  /* ── Bar ── */
  .nav-bar {
    position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
    z-index: 9999;
    display: flex; align-items: center;
    width: calc(100% - 32px); max-width: 1200px;
    padding: 0 8px 0 6px; height: 66px; gap: 0;
    background: rgba(246,245,243,0.78);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(232,228,222,0.9); border-radius: 18px;
    box-shadow: 0 4px 32px rgba(26,23,20,0.08), 0 1px 0 rgba(255,255,255,0.6) inset;
    transition: box-shadow 0.3s, background 0.3s;
  }
  .nav-bar.scrolled {
    background: rgba(246,245,243,0.95);
    box-shadow: 0 8px 48px rgba(26,23,20,0.13), 0 1px 0 rgba(255,255,255,0.6) inset;
  }

  /* ── Brand ── */
  .nav-brand { display: flex; align-items: center; gap: 6px; text-decoration: none; flex-shrink: 0; margin-right: 6px; }
  .nav-logo-img { height: 58px; width: auto; object-fit: contain; display: block; }

  /* ── Center ── */
  .nav-center {
    flex: 1; display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    transition: flex 0.42s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
  }
  .nav-center.search-open { flex: 0 0 0px; opacity: 0; pointer-events: none; }

  .nav-links { display: flex; align-items: center; gap: 2px; white-space: nowrap; }
  .nav-link {
    position: relative; padding: 7px 14px; font-size: 12px; font-weight: 600; color: #6b6760;
    text-decoration: none; border-radius: 10px; border: none; background: transparent;
    cursor: pointer; letter-spacing: 0.01em; transition: color .2s, background .2s; white-space: nowrap;
  }
  .nav-link:hover { color: #1a1714; background: rgba(26,23,20,.05); }
  .nav-link.active { color: #1a1714; background: rgba(26,23,20,.07); }
  .nav-link::after {
    content:''; position:absolute; bottom:4px; left:14px; right:14px;
    height:1.5px; background:#1a1714; border-radius:1px;
    transform:scaleX(0); transform-origin:left; transition:transform .22s cubic-bezier(.16,1,.3,1);
  }
  .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
  .nav-link-badge {
    display:inline-flex; align-items:center; justify-content:center;
    margin-left:5px; padding:1px 6px; background:#1a1714; color:#f6f5f3;
    font-size:8px; font-weight:800; letter-spacing:.06em; text-transform:uppercase;
    border-radius:99px; vertical-align:middle; line-height:14px;
  }
  .nav-sell {
    padding:7px 12px; font-size:12px; font-weight:700; color:#9e9890;
    border:1.5px solid #e8e4de; border-radius:10px; background:transparent;
    cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; gap:5px; text-decoration:none;
  }
  .nav-sell:hover { color:#1a1714; border-color:#1a1714; background:#fff; }

  /* ── Right cluster ── */
  .nav-right {
    display: flex; align-items: center; gap: 3px; flex-shrink: 0; margin-left: 4px;
    transition: flex 0.42s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-right.search-open { flex: 1; justify-content: flex-end; }

  /* ── Search ── */
  .nav-search-wrap {
    display: flex; align-items: center; position: relative;
    transition: width 0.42s cubic-bezier(0.16,1,0.3,1); width: 36px;
  }
  .nav-search-wrap.exp { width: clamp(240px, 36vw, 440px); }
  .nav-search-pill {
    width: 100%; height: 36px; display: flex; align-items: center; gap: 8px;
    padding: 0 12px; background: #fff; border: 1.5px solid #e8e4de; border-radius: 11px;
    overflow: hidden; transition: all 0.42s cubic-bezier(0.16,1,0.3,1); cursor: pointer;
  }
  .nav-search-pill:focus-within { border-color: #1a1714; box-shadow: 0 0 0 3px rgba(26,23,20,.07); cursor: default; }
  .nav-search-pill.col { width: 36px; padding: 0; justify-content: center; background: transparent; border-color: transparent; border-radius: 11px; }
  .nav-search-pill.col:hover { background: rgba(26,23,20,.06); }
  .nav-search-icon { color: #6b6760; flex-shrink: 0; display: flex; transition: color .2s; }
  .nav-search-pill:focus-within .nav-search-icon { color: #1a1714; }
  .nav-search-input { flex: 1; border: none; background: transparent; outline: none; font-size: 12px; font-weight: 500; color: #1a1714; font-family: 'Sora', sans-serif; width: 0; min-width: 0; }
  .nav-search-input::placeholder { color: #b8b3ad; }
  .nav-search-wrap.exp .nav-search-input { width: 100%; }
  .nav-search-close { background: none; border: none; cursor: pointer; padding: 0; color: #b8b3ad; display: flex; border-radius: 6px; transition: color .15s; flex-shrink: 0; }
  .nav-search-close:hover { color: #1a1714; }
  .nav-search-drop {
    position: absolute; top: calc(100% + 8px); right: 0; width: 100%; min-width: 310px;
    background: #fff; border: 1.5px solid #e8e4de; border-radius: 14px; overflow: hidden;
    box-shadow: 0 12px 40px rgba(26,23,20,.12);
    animation: drop-in .22s cubic-bezier(.16,1,.3,1) forwards; z-index: 200;
  }
  @keyframes drop-in { from{opacity:0;transform:scaleY(.92) translateY(-6px)} to{opacity:1;transform:scaleY(1) translateY(0)} }
  .search-lbl { padding:10px 14px 6px; font-size:9px; font-weight:800; color:#b8b3ad; text-transform:uppercase; letter-spacing:1px; }
  .search-chips { display:flex; flex-wrap:wrap; gap:6px; padding:0 14px 10px; }
  .search-chip { padding:5px 12px; font-size:11px; font-weight:700; color:#6b6760; background:#f6f5f3; border:1.5px solid #e8e4de; border-radius:99px; cursor:pointer; font-family:'Sora',sans-serif; transition:all .15s; }
  .search-chip:hover { border-color:#1a1714; color:#1a1714; }
  .search-divider { height:1px; background:#f0ede9; margin:0 14px; }
  .search-item { display:flex; align-items:center; gap:10px; padding:9px 14px; cursor:pointer; transition:background .12s; }
  .search-item:hover { background:#f6f5f3; }
  .search-thumb { width:34px; height:34px; border-radius:8px; background:#f0ede9; overflow:hidden; flex-shrink:0; }
  .search-thumb img { width:100%; height:100%; object-fit:cover; }
  .search-item-name { font-size:12px; font-weight:600; color:#1a1714; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .search-item-cat  { font-size:11px; color:#9e9890; margin-top:1px; }
  .search-item-price { font-size:12px; font-weight:700; color:#1a1714; flex-shrink:0; }
  .search-footer { padding:10px 14px; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; font-size:11px; font-weight:700; color:#9e9890; transition:color .15s; }
  .search-footer:hover { color:#1a1714; }

  /* ── Icon buttons ── */
  .nav-icon-btn {
    position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;
    border:none; background:transparent; border-radius:11px; cursor:pointer; color:#6b6760; transition:color .18s, background .18s;
  }
  .nav-icon-btn:hover { color:#1a1714; background:rgba(26,23,20,.06); }
  .nav-badge {
    position:absolute; top:4px; right:4px; min-width:16px; height:16px; padding:0 4px;
    background:#1a1714; color:#f6f5f3; font-size:9px; font-weight:800; line-height:16px;
    border-radius:99px; text-align:center; border:1.5px solid rgba(246,245,243,.9);
  }
  .nav-badge.pulse { animation:nb-pulse 2s ease-in-out infinite; }
  @keyframes nb-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(26,23,20,.35)} 50%{box-shadow:0 0 0 4px rgba(26,23,20,0)} }
  .nav-divider { width:1px; height:20px; background:#e8e4de; margin:0 2px; flex-shrink:0; }

  /* ── Profile button ── */
  .nav-profile-btn {
    display:flex; align-items:center; gap:8px; padding:3px 4px 3px 10px;
    border:1.5px solid #e8e4de; border-radius:13px; background:#fff;
    cursor:pointer; transition:all .2s; margin-left:2px;
  }
  .nav-profile-btn:hover, .nav-profile-btn.open { border-color:#1a1714; box-shadow:0 2px 12px rgba(0,0,0,.08); }
  .nav-profile-name { font-size:12px; font-weight:700; color:#1a1714; letter-spacing:-0.02em; white-space:nowrap; }
  .nav-avatar { width:28px; height:28px; border-radius:9px; overflow:hidden; flex-shrink:0; background:#1a1714; display:flex; align-items:center; justify-content:center; }
  .nav-avatar img { width:100%; height:100%; object-fit:contain; display:block; }

  /* ── Profile dropdown ── */
  .nav-profile-drop {
    position:absolute; top:calc(100% + 10px); right:0; width:234px;
    background:#fff; border:1.5px solid #e8e4de; border-radius:16px; overflow:hidden;
    box-shadow:0 16px 48px rgba(26,23,20,.14);
    animation:drop-in .24s cubic-bezier(.16,1,.3,1) forwards; z-index:200;
  }
  .pdrop-header { padding:14px 16px 12px; border-bottom:1px solid #f0ede9; }
  .pdrop-name  { font-size:13px; font-weight:800; color:#1a1714; letter-spacing:-0.03em; line-height:1.2; }
  .pdrop-email { font-size:11px; color:#9e9890; margin-top:2px; }
  .pdrop-role  { display:inline-flex; align-items:center; margin-top:8px; padding:3px 9px; background:#1a1714; color:#f6f5f3; font-size:9px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; border-radius:99px; line-height:1.4; }
  .pdrop-section { padding:6px 0; }
  .pdrop-item {
    display:flex; align-items:center; gap:10px; padding:9px 16px;
    font-size:12px; font-weight:600; color:#1a1714; cursor:pointer;
    transition:background .12s; border:none; background:transparent;
    width:100%; text-align:left; letter-spacing:-0.01em; text-decoration:none;
  }
  .pdrop-item:hover { background:#f6f5f3; }
  .pdrop-item .pdrop-ico { color:#9e9890; flex-shrink:0; display:flex; transition:color .15s; }
  .pdrop-item:hover .pdrop-ico { color:#1a1714; }
  .pdrop-divider { height:1px; background:#f0ede9; }
  .pdrop-signout { color:#c0392b !important; }
  .pdrop-signout .pdrop-ico { color:#e07070 !important; }
  .pdrop-signout:hover { background:#fdf0f0 !important; }

  /* ── Mobile hamburger button ── */
  .nav-mobile-btn {
    display:none; width:38px; height:38px; align-items:center; justify-content:center;
    border:none; background:transparent; border-radius:12px; cursor:pointer; color:#1a1714;
    transition:background .18s; flex-shrink: 0;
  }
  .nav-mobile-btn:hover { background:rgba(26,23,20,.06); }

  /* ── Mobile full-screen drawer ── */
  .nav-drawer {
    position:fixed; inset:0; z-index:9998; pointer-events:none;
  }
  .nav-drawer-backdrop {
    position:absolute; inset:0;
    background:rgba(26,23,20,0);
    transition:background 0.4s ease;
  }
  .nav-drawer.open .nav-drawer-backdrop {
    background:rgba(26,23,20,0.4);
    pointer-events:all;
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
  }
  .nav-drawer-panel {
    position:absolute; top:0; left:0; right:0;
    background:#f6f5f3;
    border-bottom:1.5px solid #e8e4de;
    border-radius:0 0 28px 28px;
    padding:0 0 28px;
    transform:translateY(-110%);
    transition:transform 0.48s cubic-bezier(0.16,1,0.3,1);
    box-shadow:0 24px 80px rgba(26,23,20,0.18);
    overflow:hidden;
  }
  .nav-drawer.open .nav-drawer-panel {
    transform:translateY(0);
    pointer-events:all;
  }

  /* Drawer top bar (mirrors main bar height) */
  .drawer-topbar {
    height:66px; display:flex; align-items:center; justify-content:space-between;
    padding:0 20px 0 10px; border-bottom:1px solid #ede9e3;
  }

  /* Drawer search */
  .drawer-search-wrap {
    margin:18px 20px 8px;
    display:flex; align-items:center; gap:10px;
    background:#fff; border:1.5px solid #e8e4de; border-radius:13px;
    padding:0 14px; height:46px;
    transition:border-color .2s, box-shadow .2s;
  }
  .drawer-search-wrap:focus-within {
    border-color:#1a1714;
    box-shadow:0 0 0 3px rgba(26,23,20,.07);
  }
  .drawer-search-ico { color:#9e9890; display:flex; flex-shrink:0; transition:color .2s; }
  .drawer-search-wrap:focus-within .drawer-search-ico { color:#1a1714; }
  .drawer-search-input {
    flex:1; border:none; background:transparent; outline:none;
    font-size:14px; font-weight:500; color:#1a1714; font-family:'Sora',sans-serif;
  }
  .drawer-search-input::placeholder { color:#b8b3ad; }

  /* Trending chips in drawer */
  .drawer-chips-wrap { padding:6px 20px 14px; display:flex; flex-wrap:wrap; gap:7px; }
  .drawer-chip {
    padding:5px 13px; font-size:11px; font-weight:700; color:#6b6760;
    background:#fff; border:1.5px solid #e8e4de; border-radius:99px;
    cursor:pointer; font-family:'Sora',sans-serif; transition:all .15s;
  }
  .drawer-chip:hover { border-color:#1a1714; color:#1a1714; }

  /* Drawer nav links — staggered in */
  .drawer-links { padding:4px 12px; }
  .drawer-link {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 12px; font-size:18px; font-weight:700; color:#1a1714;
    text-decoration:none; border-radius:14px; border:none; background:transparent;
    cursor:pointer; width:100%; letter-spacing:-0.04em;
    opacity:0; transform:translateY(10px);
    transition:background .15s, opacity .0s, transform .0s;
  }
  .nav-drawer.open .drawer-link {
    opacity:1; transform:translateY(0);
    transition:background .15s,
      opacity .4s cubic-bezier(0.16,1,0.3,1),
      transform .4s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-drawer.open .drawer-link:nth-child(1) { transition-delay: 0.08s, 0.08s, 0.08s; }
  .nav-drawer.open .drawer-link:nth-child(2) { transition-delay: 0.13s, 0.13s, 0.13s; }
  .nav-drawer.open .drawer-link:nth-child(3) { transition-delay: 0.18s, 0.18s, 0.18s; }
  .nav-drawer.open .drawer-link:nth-child(4) { transition-delay: 0.23s, 0.23s, 0.23s; }
  .nav-drawer.open .drawer-link:nth-child(5) { transition-delay: 0.28s, 0.28s, 0.28s; }
  .drawer-link:hover { background:rgba(26,23,20,.05); }
  .drawer-link.sell { color:#9e9890; font-size:15px; font-weight:600; }

  .drawer-link-right { display:flex; align-items:center; gap:8px; }

  /* Drawer divider */
  .drawer-divider { height:1px; background:#ede9e3; margin:4px 12px 8px; }

  /* Drawer bottom action row */
  .drawer-bottom {
    display:flex; align-items:center; gap:8px;
    margin:8px 20px 0;
    opacity:0; transform:translateY(8px);
    transition:opacity .0s, transform .0s;
  }
  .nav-drawer.open .drawer-bottom {
    opacity:1; transform:translateY(0);
    transition:opacity .4s cubic-bezier(.16,1,.3,1) .32s, transform .4s cubic-bezier(.16,1,.3,1) .32s;
  }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .nav-center { display:none; }
    .nav-profile-name { display:none; }
    /* hide desktop search — it's inside drawer on mobile */
    .nav-search-wrap { display:none; }
    .nav-mobile-btn { display:flex; }
  }
  @media (max-width: 600px) {
    .nav-bar { height:58px; top:12px; width:calc(100% - 24px); padding:0 6px 0 4px; }
    .nav-logo-img { height:46px; }
    .drawer-topbar { height:58px; }
    .drawer-link { font-size:16px; padding:12px 12px; }
  }
`;

const PRODUCTS = [
  {
    id: 1,
    name: "Oversized Linen Blazer",
    cat: "Men · Formal",
    price: "ETB 1,240",
    img: "https://i.pinimg.com/736x/9e/08/02/9e080294c3e98b72af065936d7354819.jpg",
  },
  {
    id: 2,
    name: "Streetwear Cargo Set",
    cat: "Men · Streetwear",
    price: "ETB 890",
    img: "https://i.pinimg.com/736x/20/c6/59/20c65924540dfb04f838becaa011024f.jpg",
  },
  {
    id: 3,
    name: "Floral Wrap Dress",
    cat: "Women · Summer",
    price: "ETB 760",
    img: "https://i.pinimg.com/736x/60/0a/dd/600add9cd7c693096eb36e0f4816fb3f.jpg",
  },
  {
    id: 4,
    name: "Tailored Suit Jacket",
    cat: "Men · Formal",
    price: "ETB 2,100",
    img: "https://i.pinimg.com/736x/ab/bb/f3/abbbf3e25662109c77967649cff0f65e.jpg",
  },
  {
    id: 5,
    name: "Silk Evening Gown",
    cat: "Women · Formal",
    price: "ETB 3,450",
    img: "https://i.pinimg.com/1200x/e9/3a/72/e93a72d23920a6cda792be63b7df8879.jpg",
  },
];
const TRENDING = ["Streetwear", "Linen sets", "Formal wear", "Activewear"];
const LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Trending", href: "/trending", badge: "New" },
];

const Ico = {
  Search: ({ size = 16 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Close: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Bell: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Cart: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Tag: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Chevron: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Arrow: () => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Store: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  SignOut: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: ({ open }: { open: boolean }) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <line
        x1="4"
        y1="7"
        x2="20"
        y2="7"
        style={{
          transition: "all .3s",
          transformOrigin: "center",
          transform: open ? "rotate(45deg) translate(3px,4px)" : "none",
        }}
      />
      <line
        x1="4"
        y1="17"
        x2="20"
        y2="17"
        style={{
          transition: "all .3s",
          transformOrigin: "center",
          transform: open ? "rotate(-45deg) translate(3px,-4px)" : "none",
        }}
      />
    </svg>
  ),
};

export default function Navbar() {
  const [active, setActive] = useState("Shop");
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.cat.toLowerCase().includes(query.toLowerCase()),
      )
    : PRODUCTS.slice(0, 3);

  const mobileResults = mobileQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(mobileQuery.toLowerCase()) ||
          p.cat.toLowerCase().includes(mobileQuery.toLowerCase()),
      )
    : [];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [searchOpen]);

  // focus mobile search when drawer opens
  useEffect(() => {
    if (drawerOpen) setTimeout(() => mobileInputRef.current?.focus(), 380);
    else setMobileQuery("");
  }, [drawerOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const h = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };
    setTimeout(() => document.addEventListener("mousedown", h), 0);
    return () => document.removeEventListener("mousedown", h);
  }, [searchOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const h = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node))
        setProfileOpen(false);
    };
    setTimeout(() => document.addEventListener("mousedown", h), 0);
    return () => document.removeEventListener("mousedown", h);
  }, [profileOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const h = (e: MouseEvent) => {
      if (!drawerRef.current?.contains(e.target as Node)) setDrawerOpen(false);
    };
    setTimeout(() => document.addEventListener("mousedown", h), 0);
    return () => document.removeEventListener("mousedown", h);
  }, [drawerOpen]);

  return (
    <div className="nav-root">
      <style>{NAV_STYLES}</style>

      {/* ── Main bar ── */}
      <nav className={`nav-bar${scrolled ? " scrolled" : ""}`}>
        {/* Brand */}
        <a href="/" className="nav-brand">
          <img src={LOGO_URL} alt="Yog Fashion" className="nav-logo-img" />
        </a>

        {/* Center links */}
        <div className={`nav-center${searchOpen ? " search-open" : ""}`}>
          <div className="nav-links">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`nav-link${active === l.label ? " active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(l.label);
                }}
              >
                {l.label}
                {l.badge && <span className="nav-link-badge">{l.badge}</span>}
              </a>
            ))}
            <a href="/sell" className="nav-sell">
              <Ico.Tag /> Sell
            </a>
          </div>
        </div>

        {/* Right */}
        <div className={`nav-right${searchOpen ? " search-open" : ""}`}>
          {/* Desktop search */}
          <div
            ref={searchRef}
            className={`nav-search-wrap${searchOpen ? " exp" : ""}`}
          >
            <div
              className={`nav-search-pill${searchOpen ? "" : " col"}`}
              onClick={() => !searchOpen && setSearchOpen(true)}
            >
              <span className="nav-search-icon">
                <Ico.Search size={16} />
              </span>
              {searchOpen && (
                <>
                  <input
                    ref={inputRef}
                    className="nav-search-input"
                    placeholder="Search products, brands…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    className="nav-search-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchOpen(false);
                    }}
                  >
                    <Ico.Close />
                  </button>
                </>
              )}
            </div>
            {searchOpen && (
              <div className="nav-search-drop">
                {!query.trim() && (
                  <>
                    <div className="search-lbl">Trending searches</div>
                    <div className="search-chips">
                      {TRENDING.map((t) => (
                        <button
                          key={t}
                          className="search-chip"
                          onClick={() => setQuery(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="search-divider" />
                  </>
                )}
                <div className="search-lbl">
                  {query.trim()
                    ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                    : "Suggested for you"}
                </div>
                {results.length === 0 ? (
                  <div
                    style={{
                      padding: "14px",
                      fontSize: "12px",
                      color: "#9e9890",
                      textAlign: "center",
                    }}
                  >
                    No products found
                  </div>
                ) : (
                  results.map((p, i) => (
                    <div key={p.id}>
                      {i > 0 && <div className="search-divider" />}
                      <div className="search-item">
                        <div className="search-thumb">
                          <img src={p.img} alt={p.name} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="search-item-name">{p.name}</div>
                          <div className="search-item-cat">{p.cat}</div>
                        </div>
                        <div className="search-item-price">{p.price}</div>
                      </div>
                    </div>
                  ))
                )}
                <div className="search-divider" />
                <div
                  className="search-footer"
                  onClick={() => setSearchOpen(false)}
                >
                  View all results <Ico.Arrow />
                </div>
              </div>
            )}
          </div>

          <button className="nav-icon-btn">
            <Ico.Bell />
            <span className="nav-badge pulse">3</span>
          </button>
          <button className="nav-icon-btn">
            <Ico.Cart />
            <span className="nav-badge">2</span>
          </button>
          <div className="nav-divider" />

          {/* Profile */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              className={`nav-profile-btn${profileOpen ? " open" : ""}`}
              onClick={() => setProfileOpen((o) => !o)}
            >
              <span className="nav-profile-name">Yog Admin</span>
              <div className="nav-avatar">
                <img src={LOGO_URL} alt="" />
              </div>
            </button>
            {profileOpen && (
              <div className="nav-profile-drop">
                <div className="pdrop-header">
                  <div className="pdrop-name">Yog Admin</div>
                  <div className="pdrop-email">aa31noah@outlook.com</div>
                  <div className="pdrop-role">Admin</div>
                </div>
                <div className="pdrop-section">
                  <a href="/account" className="pdrop-item">
                    <span className="pdrop-ico">
                      <Ico.Settings />
                    </span>
                    Account Settings
                  </a>
                  <a href="/seller-dashboard" className="pdrop-item">
                    <span className="pdrop-ico">
                      <Ico.Store />
                    </span>
                    Seller Dashboard
                  </a>
                </div>
                <div className="pdrop-divider" />
                <div className="pdrop-section">
                  <button className="pdrop-item pdrop-signout">
                    <span className="pdrop-ico">
                      <Ico.SignOut />
                    </span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-label="Menu"
          >
            <Ico.Menu open={drawerOpen} />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div ref={drawerRef} className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <div
          className="nav-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="nav-drawer-panel">
          {/* Topbar — mirrors nav bar height */}
          <div className="drawer-topbar">
            <a href="/" className="nav-brand">
              <img src={LOGO_URL} alt="Yog Fashion" className="nav-logo-img" />
            </a>
            <button
              className="nav-mobile-btn"
              onClick={() => setDrawerOpen(false)}
              style={{ background: "rgba(26,23,20,.06)" }}
            >
              <Ico.Menu open={true} />
            </button>
          </div>

          {/* Search inside drawer */}
          <div className="drawer-search-wrap">
            <span className="drawer-search-ico">
              <Ico.Search size={17} />
            </span>
            <input
              ref={mobileInputRef}
              className="drawer-search-input"
              placeholder="Search products, brands…"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
            />
            {mobileQuery && (
              <button
                onClick={() => setMobileQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#b8b3ad",
                  display: "flex",
                }}
              >
                <Ico.Close />
              </button>
            )}
          </div>

          {/* Trending chips */}
          {!mobileQuery && (
            <div className="drawer-chips-wrap">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  className="drawer-chip"
                  onClick={() => setMobileQuery(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Mobile search results */}
          {mobileQuery && (
            <div style={{ padding: "0 20px 12px" }}>
              {mobileResults.length === 0 ? (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9e9890",
                    padding: "8px 0",
                  }}
                >
                  No products found
                </div>
              ) : (
                mobileResults.map((p, i) => (
                  <div key={p.id}>
                    {i > 0 && (
                      <div
                        style={{
                          height: "1px",
                          background: "#f0ede9",
                          margin: "0 0 0",
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 0",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#f0ede9",
                        }}
                      >
                        <img
                          src={p.img}
                          alt={p.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1a1714",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9e9890",
                            marginTop: 1,
                          }}
                        >
                          {p.cat}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#1a1714",
                          flexShrink: 0,
                        }}
                      >
                        {p.price}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Nav links */}
          {!mobileQuery && (
            <>
              <div className="drawer-links">
                {LINKS.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="drawer-link"
                    onClick={() => {
                      setActive(l.label);
                      setDrawerOpen(false);
                    }}
                  >
                    <span>
                      {l.label}
                      {l.badge && (
                        <span
                          className="nav-link-badge"
                          style={{ marginLeft: 8 }}
                        >
                          {l.badge}
                        </span>
                      )}
                    </span>
                    <span className="drawer-link-right">
                      <Ico.Chevron />
                    </span>
                  </a>
                ))}
                <div className="drawer-divider" />
                <a href="/sell" className="drawer-link sell">
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Ico.Tag /> Sell on Yog
                  </span>
                  <Ico.Chevron />
                </a>
              </div>

              {/* Bottom row — bell, cart, profile */}
              <div className="drawer-bottom">
                <button
                  className="nav-icon-btn"
                  style={{
                    background: "rgba(26,23,20,.05)",
                    borderRadius: 12,
                    width: 46,
                    height: 46,
                  }}
                >
                  <Ico.Bell />
                  <span className="nav-badge pulse">3</span>
                </button>
                <button
                  className="nav-icon-btn"
                  style={{
                    background: "rgba(26,23,20,.05)",
                    borderRadius: 12,
                    width: 46,
                    height: 46,
                  }}
                >
                  <Ico.Cart />
                  <span className="nav-badge">2</span>
                </button>
                <button
                  className="nav-profile-btn"
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                    padding: "9px 10px 9px 14px",
                  }}
                >
                  <span
                    className="nav-profile-name"
                    style={{ display: "block" }}
                  >
                    Yog Admin
                  </span>
                  <div className="nav-avatar">
                    <img src={LOGO_URL} alt="" />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
