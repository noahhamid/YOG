"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import NotificationCenter from "./notifications/NotificationCenter";
import NotificationToast from "./notifications/NotificationToast";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: "USER" | "SELLER" | "ADMIN";
  image?: string;
}

type NavLink = {
  label: string;
  href: string;
  badge?: string;
  type?: "scroll" | "route";
};

const LOGO_URL =
  "https://res.cloudinary.com/ddfozmzv0/image/upload/v1774012277/edited-photo_ojra9c.png";

const LINKS: NavLink[] = [
  { label: "Shop", href: "#shop", type: "scroll" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Trending", href: "/trending", badge: "New" },
];
const MOBILE_LINKS = ["Shop", "Men", "Women", "Trending", "Stores"];

// ── CSS ───────────────────────────────────────────────────────────────────────
const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  .nav-root * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

  .nav-bar {
    position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
    z-index: 100;
    display: flex; align-items: center;
    width: calc(100% - 32px); max-width: 1200px;
    padding: 0 8px 0 6px; height: 66px; gap: 0;
    background: rgba(246,245,243,0.78);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(232,228,222,0.9); border-radius: 18px;
    box-shadow: 0 4px 32px rgba(26,23,20,0.08), 0 1px 0 rgba(255,255,255,0.6) inset;
    transition:
      box-shadow 0.5s cubic-bezier(0.16,1,0.3,1),
      background 0.5s cubic-bezier(0.16,1,0.3,1),
      border-color 0.5s ease,
      top 0.5s cubic-bezier(0.16,1,0.3,1),
      width 0.5s cubic-bezier(0.16,1,0.3,1),
      max-width 0.5s cubic-bezier(0.16,1,0.3,1),
      border-radius 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-bar.scrolled {
    top: 10px;
    background: rgba(246,245,243,0.95);
    border-color: rgba(210,206,200,0.95);
    box-shadow: 0 8px 32px rgba(26,23,20,0.13), 0 2px 8px rgba(26,23,20,0.06), 0 1px 0 rgba(255,255,255,0.7) inset;
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
  }
  .nav-brand { display:flex; align-items:center; gap:6px; text-decoration:none; flex-shrink:0; margin-right:6px; }
  .nav-logo-img { height:58px; width:auto; object-fit:contain; display:block; transition:height 0.45s cubic-bezier(0.16,1,0.3,1); }
  .nav-bar.scrolled .nav-logo-img { height:50px; }

  .nav-center {
    flex:1; display:flex; align-items:center; justify-content:center;
    overflow:hidden; transition:flex 0.42s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
  }

  .nav-links { display:flex; align-items:center; gap:2px; white-space:nowrap; }
  .nav-link {
    position:relative; padding:7px 14px; font-size:12px; font-weight:600; color:#6b6760;
    text-decoration:none; border-radius:10px; border:none; background:transparent;
    cursor:pointer; letter-spacing:0.01em; transition:color .2s, background .2s; white-space:nowrap;
  }
  .nav-bar.scrolled .nav-link { color:#524f4c; }
  .nav-link:hover { color:#1a1714; background:rgba(26,23,20,.05); }
  .nav-link.active { color:#1a1714; background:rgba(26,23,20,.07); }
  .nav-link::after {
    content:''; position:absolute; bottom:4px; left:14px; right:14px;
    height:1.5px; background:#1a1714; border-radius:1px;
    transform:scaleX(0); transform-origin:left; transition:transform .22s cubic-bezier(.16,1,.3,1);
  }
  .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }
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

  .nav-right { display:flex; align-items:center; gap:3px; flex-shrink:0; margin-left:auto; }

  /* Icon buttons */
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
  .nav-badge.red { background:#dc2626; }
  .nav-badge.pulse { animation:nb-pulse 2s ease-in-out infinite; }
  @keyframes nb-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.4)} 50%{box-shadow:0 0 0 4px rgba(220,38,38,0)} }
  .nav-divider { width:1px; height:20px; background:#e8e4de; margin:0 2px; flex-shrink:0; }

  /* Profile button */
  .nav-profile-btn {
    display:flex; align-items:center; gap:8px; padding:3px 4px 3px 10px;
    border:1.5px solid #e8e4de; border-radius:13px; background:#fff;
    cursor:pointer; transition:all .2s; margin-left:2px;
  }
  .nav-profile-btn:hover, .nav-profile-btn.open { border-color:#1a1714; box-shadow:0 2px 12px rgba(0,0,0,.08); }
  .nav-profile-name { font-size:12px; font-weight:700; color:#1a1714; letter-spacing:-0.02em; white-space:nowrap; }
  .nav-avatar { width:28px; height:28px; border-radius:9px; overflow:hidden; flex-shrink:0; background:#1a1714; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:700; }
  .nav-avatar img { width:100%; height:100%; object-fit:cover; display:block; }

  /* Profile dropdown */
  .nav-profile-drop {
    position:absolute; top:calc(100% + 10px); right:0; width:234px;
    background:#fff; border:1.5px solid #e8e4de; border-radius:16px; overflow:hidden;
    box-shadow:0 16px 48px rgba(26,23,20,.14);
    animation:drop-in .24s cubic-bezier(.16,1,.3,1) forwards; z-index:200;
  }
  @keyframes drop-in { from{opacity:0;transform:scaleY(.92) translateY(-6px)} to{opacity:1;transform:scaleY(1) translateY(0)} }
  .pdrop-header { padding:14px 16px 12px; border-bottom:1px solid #f0ede9; background:#f6f5f3; }
  .pdrop-name  { font-size:13px; font-weight:800; color:#1a1714; letter-spacing:-0.03em; line-height:1.2; }
  .pdrop-email { font-size:11px; color:#9e9890; margin-top:2px; }
  .pdrop-role  { display:inline-flex; align-items:center; margin-top:8px; padding:3px 9px; background:#1a1714; color:#f6f5f3; font-size:9px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; border-radius:99px; line-height:1.4; }
  .pdrop-role.seller { background:#0284c7; }
  .pdrop-role.admin  { background:#7c3aed; }
  .pdrop-role.user   { background:#6b6760; }
  .pdrop-section { padding:6px 0; }
  .pdrop-item {
    display:flex; align-items:center; gap:10px; padding:9px 16px;
    font-size:12px; font-weight:600; color:#1a1714; cursor:pointer;
    transition:background .12s; border:none; background:transparent;
    width:100%; text-align:left; letter-spacing:-0.01em; text-decoration:none;
    font-family:'Sora',sans-serif;
  }
  .pdrop-item:hover { background:#f6f5f3; }
  .pdrop-item .pdrop-ico { color:#9e9890; flex-shrink:0; display:flex; transition:color .15s; }
  .pdrop-item:hover .pdrop-ico { color:#1a1714; }
  .pdrop-divider { height:1px; background:#f0ede9; }
  .pdrop-signout { color:#c0392b !important; }
  .pdrop-signout .pdrop-ico { color:#e07070 !important; }
  .pdrop-signout:hover { background:#fdf0f0 !important; }

  /* Mobile hamburger */
  .nav-mobile-btn {
    display:none; width:38px; height:38px; align-items:center; justify-content:center;
    border:none; background:transparent; border-radius:12px; cursor:pointer; color:#1a1714;
    transition:background .18s; flex-shrink:0;
  }
  .nav-mobile-btn:hover { background:rgba(26,23,20,.06); }
  .drawer-close-btn {
    display:flex; align-items:center; justify-content:center;
    width:38px; height:38px; border:none; background:rgba(26,23,20,0.07);
    border-radius:12px; cursor:pointer; color:#1a1714; flex-shrink:0; transition:background .18s;
  }
  .drawer-close-btn:hover { background:rgba(26,23,20,0.13); }

  /* Mobile drawer — z-index bumped to 9999 to always sit on top */
  .nav-drawer { position:fixed; inset:0; z-index:9999; pointer-events:none; }
  .nav-drawer-backdrop { position:absolute; inset:0; background:rgba(26,23,20,0); transition:background 0.4s ease; }
  .nav-drawer.open .nav-drawer-backdrop { background:rgba(26,23,20,0.4); pointer-events:all; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); }
  .nav-drawer-panel {
    position:absolute; top:0; left:0; right:0;
    background:#f6f5f3; border-bottom:1.5px solid #e8e4de;
    border-radius:0 0 28px 28px; padding:0 0 28px;
    transform:translateY(-110%);
    transition:transform 0.48s cubic-bezier(0.16,1,0.3,1);
    box-shadow:0 24px 80px rgba(26,23,20,0.18);
    max-height:100dvh;
    overflow-y:auto;
  }
  .nav-drawer.open .nav-drawer-panel { transform:translateY(0); pointer-events:all; }

  .drawer-topbar { height:66px; display:flex; align-items:center; justify-content:space-between; padding:0 20px 0 10px; border-bottom:1px solid #ede9e3; }

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
    transition:background .15s, opacity .4s cubic-bezier(0.16,1,0.3,1), transform .4s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-drawer.open .drawer-link:nth-child(1) { transition-delay:0.08s,0.08s,0.08s; }
  .nav-drawer.open .drawer-link:nth-child(2) { transition-delay:0.13s,0.13s,0.13s; }
  .nav-drawer.open .drawer-link:nth-child(3) { transition-delay:0.18s,0.18s,0.18s; }
  .nav-drawer.open .drawer-link:nth-child(4) { transition-delay:0.23s,0.23s,0.23s; }
  .nav-drawer.open .drawer-link:nth-child(5) { transition-delay:0.28s,0.28s,0.28s; }
  .nav-drawer.open .drawer-link:nth-child(6) { transition-delay:0.33s,0.33s,0.33s; }
  .drawer-link:hover { background:rgba(26,23,20,.05); }
  .drawer-link.sell { color:#9e9890; font-size:15px; font-weight:600; }
  .drawer-link-right { display:flex; align-items:center; gap:8px; }
  .drawer-divider { height:1px; background:#ede9e3; margin:4px 12px 8px; }

  .drawer-profile-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:12px 12px; border-radius:14px; cursor:pointer;
    text-decoration:none; width:100%;
    opacity:0; transform:translateY(10px);
    transition:background .15s, opacity .0s, transform .0s;
  }
  .nav-drawer.open .drawer-profile-row {
    opacity:1; transform:translateY(0);
    transition:background .15s, opacity .4s cubic-bezier(0.16,1,0.3,1) .38s, transform .4s cubic-bezier(0.16,1,0.3,1) .38s;
  }
  .drawer-profile-row:hover { background:rgba(26,23,20,.05); }

  /* Responsive */
  @media (max-width: 960px) {
    .nav-center { display:none; }
    .nav-profile-name { display:none; }
    .nav-search-wrap { display:none; }
    .nav-mobile-btn { display:flex; }
    .nav-bell-btn { display:flex; }
    .nav-cart-btn { display:flex; }
    .nav-divider { display:none; }
    .nav-profile-btn { display:none; }
    .nav-bar { justify-content:space-between; }
    .nav-brand { margin-right:0; }
  }
  @media (max-width: 768px) {
  .nav-bar { top:12px; width:calc(100% - 24px); }
  .nav-bar.scrolled { top:0; width:100%; border-radius:0 0 16px 16px; border-left:none; border-right:none; border-top:none; }
}
@media (max-width: 600px) {
  .nav-bar { height:56px; top:10px; width:calc(100% - 20px); padding:0 6px 0 4px; border-radius:16px; }
  .nav-bar.scrolled { top:0; width:100%; border-radius:0 0 14px 14px; border-left:none; border-right:none; border-top:none; }
  .nav-logo-img { height:46px; }
  .drawer-topbar { height:56px; padding:0 14px 0 6px; }
  .drawer-topbar .nav-logo-img { height:44px; }
  .nav-drawer-panel { border-radius:0; min-height:100dvh; padding-bottom:env(safe-area-inset-bottom,24px); }
  .drawer-links { padding:4px 10px; }
  .drawer-link { font-size:22px; padding:13px 12px; }
  .drawer-link.sell { font-size:15px; }
  .drawer-profile-row { padding:13px 12px; }
}
@media (max-width: 390px) {
  .nav-bar { height:52px; border-radius:14px; }
  .nav-bar.scrolled { top:0; width:100%; border-radius:0 0 12px 12px; border-left:none; border-right:none; border-top:none; }
  .nav-logo-img { height:42px; }
  .nav-icon-btn { width:32px; height:32px; }
  .nav-mobile-btn { width:34px; height:34px; }
  .drawer-topbar { height:52px; }
  .drawer-link { font-size:20px; padding:11px 12px; }
}
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
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
  User: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastNotification, setToastNotification] = useState<any>(null);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const profileRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const h = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node))
        setProfileOpen(false);
    };
    setTimeout(() => document.addEventListener("mousedown", h), 0);
    return () => document.removeEventListener("mousedown", h);
  }, [profileOpen]);

  // ── Auth + session ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadUser();
    window.addEventListener("userLoggedIn", loadUser);
    return () => window.removeEventListener("userLoggedIn", loadUser);
  }, []);

  const loadUser = async () => {
    const s = localStorage.getItem("yog_user");
    if (!s) return;
    const stored = JSON.parse(s);
    setUser(stored);
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: stored.email }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("yog_user", JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch {}
  };

  // ── Notification polling ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const poll = async () => {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) return;
      try {
        const res = await fetch("/api/notifications", {
          headers: { "x-user-data": userStr },
        });
        const data = await res.json();
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
          let shownIds: string[] = [];
          try {
            const s = localStorage.getItem("yog_shown_notifications");
            if (s) shownIds = JSON.parse(s);
          } catch {}
          if (data.notifications?.length) {
            const newest = data.notifications.find(
              (n: any) => !n.read && !shownIds.includes(n.id),
            );
            if (newest) {
              setToastNotification(newest);
              localStorage.setItem(
                "yog_shown_notifications",
                JSON.stringify([...shownIds, newest.id]),
              );
            }
          }
        }
      } catch {}
    };
    poll();
    const iv = setInterval(poll, 60000);
    return () => clearInterval(iv);
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("yog_user");
    setUser(null);
    setProfileOpen(false);
    window.location.href = "/";
  };

  const roleClass =
    user?.role === "SELLER"
      ? "seller"
      : user?.role === "ADMIN"
        ? "admin"
        : "user";

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
        <div className="nav-center">
          <div className="nav-links">
            {LINKS.map((l) => {
              if (l.type === "scroll") {
                return (
                  <button
                    key={l.label}
                    className="nav-link"
                    onClick={() => {
                      if (pathname === "/") {
                        document
                          .getElementById("shop")
                          ?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        router.push("/#shop");
                      }
                    }}
                  >
                    {l.label}
                  </button>
                );
              }
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`nav-link${pathname === l.href ? " active" : ""}`}
                >
                  {l.label}
                  {l.badge && <span className="nav-link-badge">{l.badge}</span>}
                </Link>
              );
            })}
            <a
              href={
                user?.role === "SELLER" || user?.role === "ADMIN"
                  ? "/seller/dashboard"
                  : "/seller/apply"
              }
              className="nav-sell"
            >
              <Ico.Tag /> Sell
            </a>
          </div>
        </div>

        {/* Right cluster */}
        <div className="nav-right">
          {/* Bell */}
          {user && (
            <button
              className="nav-icon-btn nav-bell-btn"
              onClick={() => setShowNotifications(true)}
            >
              <Ico.Bell />
              {unreadCount > 0 && (
                <span
                  className={`nav-badge red${unreadCount > 0 ? " pulse" : ""}`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Cart */}
          <Link href="/cart" className="nav-icon-btn nav-cart-btn">
            <Ico.Cart />
            {cartCount > 0 && (
              <span className="nav-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user && <div className="nav-divider" />}

          {/* Profile */}
          {user ? (
            <div ref={profileRef} style={{ position: "relative" }}>
              <button
                className={`nav-profile-btn${profileOpen ? " open" : ""}`}
                onClick={() => setProfileOpen((o) => !o)}
              >
                <span className="nav-profile-name">{user.name}</span>
                <div className="nav-avatar">
                  {user.image ? (
                    <img src={user.image} alt={user.name} />
                  ) : (
                    user.name[0].toUpperCase()
                  )}
                </div>
              </button>
              {profileOpen && (
                <div className="nav-profile-drop">
                  <div className="pdrop-header">
                    <div className="pdrop-name">{user.name}</div>
                    <div className="pdrop-email">{user.email}</div>
                    <div className={`pdrop-role ${roleClass}`}>{user.role}</div>
                  </div>
                  <div className="pdrop-section">
                    <a
                      href="/account"
                      className="pdrop-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="pdrop-ico">
                        <Ico.User />
                      </span>{" "}
                      Account Settings
                    </a>
                    <a
                      href="/following"
                      className="pdrop-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="pdrop-ico">
                        <Ico.Chevron />
                      </span>{" "}
                      Following
                    </a>
                    {user.role === "SELLER" && (
                      <a
                        href="/seller/profile"
                        className="pdrop-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span className="pdrop-ico">
                          <Ico.Store />
                        </span>{" "}
                        Store Profile
                      </a>
                    )}
                    {user.role === "ADMIN" && (
                      <a
                        href="/admin/sellers"
                        className="pdrop-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span className="pdrop-ico">
                          <Ico.Settings />
                        </span>{" "}
                        Admin Panel
                      </a>
                    )}
                  </div>
                  <div className="pdrop-divider" />
                  <div className="pdrop-section">
                    <button
                      className="pdrop-item pdrop-signout"
                      onClick={handleSignOut}
                    >
                      <span className="pdrop-ico">
                        <Ico.SignOut />
                      </span>{" "}
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="nav-bell-btn"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <a href="/login" className="nav-link" style={{ fontSize: 12 }}>
                Log In
              </a>
              <a href="/signup" className="nav-link" style={{ fontSize: 12 }}>
                Sign Up
              </a>
            </div>
          )}

          {/* Hamburger */}
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
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <div
          className="nav-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="nav-drawer-panel">
          <div className="drawer-topbar">
            <a href="/" className="nav-brand">
              <img src={LOGO_URL} alt="Yog Fashion" className="nav-logo-img" />
            </a>
            <button
              className="drawer-close-btn"
              onClick={() => setDrawerOpen(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav links — no search, no filter chips */}
          <div className="drawer-links">
            {MOBILE_LINKS.map((l) => (
              <a
                key={l}
                href={l === "Stores" ? "/stores" : `/${l.toLowerCase()}`}
                className="drawer-link"
                onClick={() => setDrawerOpen(false)}
              >
                <span>{l}</span>
                <span className="drawer-link-right">
                  <Ico.Chevron />
                </span>
              </a>
            ))}
            <div className="drawer-divider" />
            <a
              href={
                user?.role === "SELLER" || user?.role === "ADMIN"
                  ? "/seller/dashboard"
                  : "/seller/apply"
              }
              className="drawer-link sell"
              onClick={() => setDrawerOpen(false)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Ico.Tag /> Sell on Yog
              </span>
              <Ico.Chevron />
            </a>
            <div className="drawer-divider" />

            {/* Profile row */}
            {user ? (
              <>
                <a
                  href="/account"
                  className="drawer-profile-row"
                  onClick={() => setDrawerOpen(false)}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#1a1714",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        user.name[0].toUpperCase()
                      )}
                    </div>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: "#1a1714",
                          letterSpacing: "-0.03em",
                          lineHeight: 1.1,
                        }}
                      >
                        {user.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#9e9890",
                          fontWeight: 400,
                        }}
                      >
                        {user.email}
                      </span>
                    </span>
                  </span>
                  <Ico.Chevron />
                </a>

                <div style={{ padding: "0 12px 4px" }}>
                  <a
                    href="/account"
                    className="pdrop-item"
                    onClick={() => setDrawerOpen(false)}
                    style={{ borderRadius: 10 }}
                  >
                    <span className="pdrop-ico">
                      <Ico.User />
                    </span>{" "}
                    Account Settings
                  </a>
                  <a
                    href="/following"
                    className="pdrop-item"
                    onClick={() => setDrawerOpen(false)}
                    style={{ borderRadius: 10 }}
                  >
                    <span className="pdrop-ico">
                      <Ico.Chevron />
                    </span>{" "}
                    Following
                  </a>
                  {user.role === "SELLER" && (
                    <a
                      href="/seller/profile"
                      className="pdrop-item"
                      onClick={() => setDrawerOpen(false)}
                      style={{ borderRadius: 10 }}
                    >
                      <span className="pdrop-ico">
                        <Ico.Store />
                      </span>{" "}
                      Store Profile
                    </a>
                  )}
                  {user.role === "ADMIN" && (
                    <a
                      href="/admin/sellers"
                      className="pdrop-item"
                      onClick={() => setDrawerOpen(false)}
                      style={{ borderRadius: 10 }}
                    >
                      <span className="pdrop-ico">
                        <Ico.Settings />
                      </span>{" "}
                      Admin Panel
                    </a>
                  )}
                  <div
                    style={{
                      height: 1,
                      background: "#ede9e3",
                      margin: "4px 0",
                    }}
                  />
                  <button
                    className="pdrop-item pdrop-signout"
                    onClick={() => {
                      handleSignOut();
                      setDrawerOpen(false);
                    }}
                    style={{ borderRadius: 10, width: "100%" }}
                  >
                    <span className="pdrop-ico">
                      <Ico.SignOut />
                    </span>{" "}
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", gap: 10, padding: "12px 12px" }}>
                <a
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "13px",
                    borderRadius: 12,
                    border: "1.5px solid #e8e4de",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1714",
                    textDecoration: "none",
                    background: "#fff",
                  }}
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "13px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    textDecoration: "none",
                    background: "#1a1714",
                  }}
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Center + Toast */}
      <>
        {showNotifications && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9997,
              backdropFilter: "blur(4px) saturate(140%)",
              WebkitBackdropFilter: "blur(12px) saturate(140%)",
              background: "rgba(246,245,243,0.15)",
              transition: "all 0.3s ease",
            }}
            onClick={() => setShowNotifications(false)}
          />
        )}
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </>
      {toastNotification && (
        <NotificationToast
          notification={toastNotification}
          onClose={() => setToastNotification(null)}
        />
      )}
    </div>
  );
}
