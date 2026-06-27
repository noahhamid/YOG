"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import ProductGrid from "@/components/ProductGrid";

// ── Hard-code your exact launch datetime here (EAT = UTC+3) ──
const TARGET = new Date("2026-06-27T22:00:00+03:00");

const LOGO_URL =
  "https://res.cloudinary.com/ddfozmzv0/image/upload/v1774012277/edited-photo_ojra9c.png";

// ─────────────────────────────────────────────────────────────
// Confetti particle system
// ─────────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#1a1714",
  "#1a1714",
  "#c9a84c",
  "#e8c55a",
  "#f0d060",
  "#9e9890",
  "#ccc9c4",
  "#3a3530",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  shape: "rect" | "circle" | "line";
  drag: number;
};

function makeParticles(count: number, W: number, H: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const origin = [0.2, 0.5, 0.8][i % 3];
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const speed = 14 + Math.random() * 14;
    const shape: Particle["shape"] =
      Math.random() < 0.5 ? "rect" : Math.random() < 0.7 ? "circle" : "line";
    return {
      x: W * origin + (Math.random() - 0.5) * 60,
      y: H + 10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      width: shape === "line" ? 2 + Math.random() * 2 : 6 + Math.random() * 8,
      height:
        shape === "line"
          ? 14 + Math.random() * 18
          : shape === "circle"
            ? 0
            : 5 + Math.random() * 6,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      opacity: 1,
      shape,
      drag: 0.97 + Math.random() * 0.015,
    };
  });
}

function ConfettiCanvas({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);

    let particles: Particle[] = makeParticles(55, W, H);
    const t1 = setTimeout(() => {
      particles = particles.concat(makeParticles(45, W, H));
    }, 300);
    const t2 = setTimeout(() => {
      particles = particles.concat(makeParticles(40, W, H));
    }, 650);

    const GRAVITY = 0.45;
    const startTime = performance.now();

    function draw(now: number) {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;

      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive++;
        p.vy += GRAVITY;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const elapsed = (now - startTime) / 1000;
        if (elapsed > 1.8) p.opacity = Math.max(0, p.opacity - 0.018);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "line") {
          ctx.lineWidth = p.width;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(0, -p.height / 2);
          ctx.lineTo(0, p.height / 2);
          ctx.stroke();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }
        ctx.restore();
      }

      if (alive > 0) {
        rafRef.current = requestAnimationFrame(draw);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        // prevent canvas from ever causing horizontal scroll
        maxWidth: "100%",
        display: "block",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Pre-launch top bar: logo + Log In / Sign Up only
// ─────────────────────────────────────────────────────────────
const PRE_BAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  .plb-root * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
  .plb-bar {
    position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
    z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    width: calc(100% - 32px); max-width: 1200px;
    padding: 0 10px 0 6px; height: 66px;
    background: rgba(246,245,243,0.88);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(232,228,222,0.9); border-radius: 18px;
    box-shadow: 0 4px 32px rgba(26,23,20,0.08), 0 1px 0 rgba(255,255,255,0.6) inset;
  }
  .plb-brand { display:flex; align-items:center; text-decoration:none; }
  .plb-logo  { height: 58px; width: auto; object-fit: contain; display: block; }
  .plb-auth  { display:flex; align-items:center; gap: 6px; }
  .plb-login {
    padding: 7px 16px; font-size: 12px; font-weight: 600; color: #6b6760;
    text-decoration: none; border-radius: 10px; border: none; background: transparent;
    cursor: pointer; letter-spacing: 0.01em; transition: color .2s, background .2s;
  }
  .plb-login:hover { color: #1a1714; background: rgba(26,23,20,.05); }
  .plb-signup {
    padding: 7px 16px; font-size: 12px; font-weight: 700; color: #f6f5f3;
    text-decoration: none; border-radius: 10px; background: #1a1714;
    cursor: pointer; letter-spacing: 0.01em; transition: opacity .2s;
  }
  .plb-signup:hover { opacity: 0.85; }
  @media (max-width: 768px) { .plb-bar { top: 12px; width: calc(100% - 24px); } }
  @media (max-width: 600px) {
    .plb-bar { height: 56px; top: 10px; width: calc(100% - 20px); border-radius: 16px; }
    .plb-logo { height: 46px; }
    .plb-login, .plb-signup { padding: 6px 12px; font-size: 11px; }
  }
`;

function PreLaunchBar() {
  return (
    <div className="plb-root">
      <style>{PRE_BAR_STYLES}</style>
      <nav className="plb-bar">
        <a href="/" className="plb-brand">
          <img src={LOGO_URL} alt="Yog Fashion" className="plb-logo" />
        </a>
        <div className="plb-auth">
          <a href="/login" className="plb-login">
            Log In
          </a>
          <a href="/signup" className="plb-signup">
            Sign Up
          </a>
        </div>
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Countdown styles
// ─────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'Sora', sans-serif; }

  @keyframes cd-grain {
    0%,100%{transform:translate(0,0)} 20%{transform:translate(-1px,2px)}
    40%{transform:translate(2px,-1px)} 60%{transform:translate(-2px,1px)} 80%{transform:translate(1px,-2px)}
  }
  @keyframes cd-pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }

  .cd-grain { animation: cd-grain 0.5s steps(1) infinite; }
  .cd-pulse { animation: cd-pulse 1.1s ease-in-out infinite; }

  .cd-root {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-height:100svh; overflow:hidden; background:#f6f5f3; position:relative;
  }
  .cd-body {
    display:flex; flex-direction:column; align-items:center;
    text-align:center; padding:0 20px; width:100%; max-width:900px; z-index:10;
  }
  .cd-eyebrow { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .cd-eyebrow-line { width:24px; height:1.5px; background:#9e9890; }
  .cd-eyebrow-text { font-size:11px; font-weight:700; color:#9e9890; text-transform:uppercase; letter-spacing:1.2px; }
  .cd-h1 {
    font-size:clamp(36px,5.5vw,80px); font-weight:800; color:#1a1714;
    line-height:1; letter-spacing:-0.04em; margin:0 0 10px;
  }
  .cd-h1 em { font-style:normal; color:#9e9890; font-weight:300; }
  .cd-sub { font-size:13px; color:#9e9890; line-height:1.65; max-width:360px; margin:0 0 44px; }
  .cd-timer { display:flex; align-items:flex-start; gap:0; }
  .cd-unit  { display:flex; flex-direction:column; align-items:center; min-width:clamp(72px,14vw,120px); }
  .cd-num {
    font-size:clamp(48px,10vw,104px); font-weight:800; color:#1a1714;
    letter-spacing:-0.05em; line-height:1; font-variant-numeric:tabular-nums;
  }
  .cd-label { font-size:10px; font-weight:700; color:#9e9890; text-transform:uppercase; letter-spacing:1.1px; margin-top:8px; }
  .cd-sep {
    font-size:clamp(40px,9vw,88px); font-weight:300; color:#ccc9c4;
    letter-spacing:-0.04em; line-height:1; margin:0 2px; align-self:flex-start;
  }
  .cd-divider { width:100%; max-width:500px; height:1px; background:#e8e4de; margin:36px 0 24px; }
  .cd-target-row { display:flex; align-items:center; gap:10px; }
  .cd-target-dot  { width:6px; height:6px; border-radius:50%; background:#1a1714; flex-shrink:0; }
  .cd-target-text { font-size:11px; font-weight:600; color:#9e9890; text-transform:uppercase; letter-spacing:1px; }

  @media (max-width:640px) {
    .cd-sub { font-size:12px; max-width:280px; margin-bottom:32px; }
    .cd-sep { margin:0; }
    .cd-divider { margin:28px 0 20px; }
  }
  @media (max-width:340px) { .cd-sub { font-size:11px; } }
`;

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export default function Countdown() {
  const alreadyLaunched = Date.now() >= TARGET.getTime();
  // Key includes the target timestamp — changing TARGET auto-resets the flag
  const CONFETTI_KEY = `yog_confetti_${TARGET.getTime()}`;

  const [stage, setStage] = useState(0);
  const [launched, setLaunched] = useState(alreadyLaunched);
  const [showConfetti, setShowConfetti] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedRef = useRef(false);

  // If page loads already past launch, mark confetti seen for this TARGET
  useEffect(() => {
    if (alreadyLaunched) {
      localStorage.setItem(CONFETTI_KEY, "1");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 120);
    const t2 = setTimeout(() => setStage(2), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    function tick() {
      const diff = Math.max(
        0,
        Math.floor((TARGET.getTime() - Date.now()) / 1000),
      );
      setTime({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        mins: Math.floor((diff % 3600) / 60),
        secs: diff % 60,
      });
      if (Date.now() >= TARGET.getTime() && !firedRef.current) {
        firedRef.current = true;
        // Show confetti only if not yet seen for this exact TARGET date
        const alreadySeen = localStorage.getItem(CONFETTI_KEY);
        if (!alreadySeen) {
          localStorage.setItem(CONFETTI_KEY, "1");
          setShowConfetti(true);
        }
        setLaunched(true);
      }
    }
    tick();
    rafRef.current = setInterval(tick, 1000);
    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, []);

  const handleConfettiDone = useCallback(() => {
    setShowConfetti(false);
  }, []);

  const fade = (delay: number) => ({
    opacity: stage >= 2 ? 1 : 0,
    transform: stage >= 2 ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
  });

  const targetLabel = TARGET.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  });

  // ── POST-LAUNCH: exact same JSX as your original page.tsx, zero wrapper ──
  if (launched) {
    return (
      <>
        <style>{`body { overflow-x: hidden; }`}</style>

        {/* Confetti plays over the real site, then self-removes */}
        {showConfetti && <ConfettiCanvas onDone={handleConfettiDone} />}

        <main className="relative bg-gradient-to-b from-gray-400 via-gray-300 to-white mt-5 mx-5 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
            {/* Left diagonal lines */}
            <div
              className="absolute top-1/3 left-0 w-full h-[1px] bg-black origin-left"
              style={{
                transform: "rotate(-15deg)",
                transformOrigin: "50% 50%",
              }}
            />
            <div
              className="absolute top-1/2 left-0 w-full h-[1px] bg-black origin-left"
              style={{
                transform: "rotate(-10deg)",
                transformOrigin: "50% 50%",
              }}
            />
            <div
              className="absolute top-2/3 left-0 w-full h-[1px] bg-black origin-left"
              style={{ transform: "rotate(-5deg)", transformOrigin: "50% 50%" }}
            />
            {/* Right diagonal lines */}
            <div
              className="absolute top-1/3 left-0 w-full h-[1px] bg-black origin-right"
              style={{ transform: "rotate(15deg)", transformOrigin: "50% 50%" }}
            />
            <div
              className="absolute top-1/2 left-0 w-full h-[1px] bg-black origin-right"
              style={{ transform: "rotate(10deg)", transformOrigin: "50% 50%" }}
            />
            <div
              className="absolute top-2/3 left-0 w-full h-[1px] bg-black origin-right"
              style={{ transform: "rotate(5deg)", transformOrigin: "50% 50%" }}
            />
          </div>

          {/* Floating Gradient Orbs */}
          <div
            className="absolute top-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-400/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "4s" }}
          />

          {/* Subtle Noise Texture */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-500/20 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10">
            <Navbar />
            <Home />
          </div>
        </main>

        <section id="shop">
          <ProductGrid />
        </section>
      </>
    );
  }

  // ── PRE-LAUNCH: slim bar + countdown ──
  return (
    <>
      <style>{KEYFRAMES}</style>
      <PreLaunchBar />

      <div className="cd-root">
        {/* Grain overlay */}
        <div
          className="cd-grain"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        <div className="cd-body">
          <div className="cd-eyebrow" style={fade(0.05)}>
            <div className="cd-eyebrow-line" />
            <span className="cd-eyebrow-text">Yog Fashion · Ethiopia</span>
            <div className="cd-eyebrow-line" />
          </div>

          <h1 className="cd-h1" style={fade(0.18)}>
            We launch <em>Monday.</em>
          </h1>

          <p className="cd-sub" style={fade(0.3)}>
            A curated marketplace of verified Ethiopian fashion sellers —
            streetwear, formal, activewear and more, delivered to your door.
          </p>

          <div className="cd-timer" style={fade(0.44)}>
            <div className="cd-unit">
              <div className="cd-num">{pad(time.days)}</div>
              <div className="cd-label">Days</div>
            </div>
            <div className="cd-sep cd-pulse">:</div>
            <div className="cd-unit">
              <div className="cd-num">{pad(time.hours)}</div>
              <div className="cd-label">Hours</div>
            </div>
            <div className="cd-sep cd-pulse">:</div>
            <div className="cd-unit">
              <div className="cd-num">{pad(time.mins)}</div>
              <div className="cd-label">Mins</div>
            </div>
            <div className="cd-sep cd-pulse">:</div>
            <div className="cd-unit">
              <div className="cd-num">{pad(time.secs)}</div>
              <div className="cd-label">Secs</div>
            </div>
          </div>

          <div className="cd-divider" style={fade(0.56)} />

          <div className="cd-target-row" style={fade(0.64)}>
            <div className="cd-target-dot" />
            <div className="cd-target-text">Launching · {targetLabel} EAT</div>
          </div>
        </div>
      </div>
    </>
  );
}
