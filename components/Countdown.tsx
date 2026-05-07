"use client";

import { useEffect, useState, useRef } from "react";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'Sora', sans-serif; }

  @keyframes cd-grain {
    0%,100%{transform:translate(0,0)} 20%{transform:translate(-1px,2px)}
    40%{transform:translate(2px,-1px)} 60%{transform:translate(-2px,1px)} 80%{transform:translate(1px,-2px)}
  }
  @keyframes cd-word-in {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cd-pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.25; }
  }

  .cd-grain { animation: cd-grain 0.5s steps(1) infinite; }
  .cd-pulse { animation: cd-pulse 1.1s ease-in-out infinite; }

  /* ── Root ── */
  .cd-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100svh - 20px);
    max-height: calc(100svh - 20px);
    overflow: hidden;
    background: #f6f5f3;
    position: relative;
  }

  /* ── Body ── */
  .cd-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 20px;
    width: 100%;
    max-width: 900px;
    z-index: 10;
  }

  /* ── Eyebrow ── */
  .cd-eyebrow {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px;
  }
  .cd-eyebrow-line  { width: 24px; height: 1.5px; background: #9e9890; }
  .cd-eyebrow-text  { font-size: 11px; font-weight: 700; color: #9e9890; text-transform: uppercase; letter-spacing: 1.2px; }

  /* ── Headline ── */
  .cd-h1 {
    font-size: clamp(36px, 5.5vw, 80px);
    font-weight: 800;
    color: #1a1714;
    line-height: 1;
    letter-spacing: -0.04em;
    margin: 0 0 10px;
  }
  .cd-h1 em {
    font-style: normal;
    color: #9e9890;
    font-weight: 300;
  }

  /* ── Sub ── */
  .cd-sub {
    font-size: 13px;
    color: #9e9890;
    line-height: 1.65;
    max-width: 360px;
    margin: 0 0 44px;
  }

  /* ── Timer ── */
  .cd-timer {
    display: flex;
    align-items: flex-start;
    gap: 0;
  }
  .cd-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: clamp(72px, 14vw, 120px);
  }
  .cd-num {
    font-size: clamp(48px, 10vw, 104px);
    font-weight: 800;
    color: #1a1714;
    letter-spacing: -0.05em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cd-label {
    font-size: 10px;
    font-weight: 700;
    color: #9e9890;
    text-transform: uppercase;
    letter-spacing: 1.1px;
    margin-top: 8px;
  }
  .cd-sep {
    font-size: clamp(40px, 9vw, 88px);
    font-weight: 300;
    color: #ccc9c4;
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 0 2px;
    align-self: flex-start;
  }

  /* ── Divider ── */
  .cd-divider {
    width: 100%;
    max-width: 500px;
    height: 1px;
    background: #e8e4de;
    margin: 36px 0 24px;
  }

  /* ── Target row ── */
  .cd-target-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cd-target-dot  { width: 6px; height: 6px; border-radius: 50%; background: #1a1714; flex-shrink: 0; }
  .cd-target-text { font-size: 11px; font-weight: 600; color: #9e9890; text-transform: uppercase; letter-spacing: 1px; }

  /* ── Fade-in helper ── */
  .cd-fade {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .cd-fade.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .cd-sub  { font-size: 12px; max-width: 280px; margin-bottom: 32px; }
    .cd-sep  { margin: 0; }
    .cd-divider { margin: 28px 0 20px; }
  }
  @media (max-width: 340px) {
    .cd-sub { font-size: 11px; }
  }
`;

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function getNextMonday6pm(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 6=Sat
  const daysUntilMonday = (8 - day) % 7 || 7;
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilMonday);
  target.setHours(18, 0, 0, 0);
  return target;
}

// ── Hard-code your launch date here if needed ──
// e.g. const TARGET = new Date("2025-05-12T18:00:00+03:00");
const TARGET = getNextMonday6pm();

export default function Countdown() {
  const [stage, setStage] = useState(0);
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    }
    tick();
    rafRef.current = setInterval(tick, 1000);
    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
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

  return (
    <>
      <style>{KEYFRAMES}</style>

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
          {/* Eyebrow */}
          <div className="cd-eyebrow" style={fade(0.05)}>
            <div className="cd-eyebrow-line" />
            <span className="cd-eyebrow-text">Yog Fashion · Ethiopia</span>
            <div className="cd-eyebrow-line" />
          </div>

          {/* Headline */}
          <h1 className="cd-h1" style={fade(0.18)}>
            We launch <em>Monday.</em>
          </h1>

          {/* Sub */}
          <p className="cd-sub" style={fade(0.3)}>
            A curated marketplace of verified Ethiopian fashion sellers —
            streetwear, formal, activewear and more, delivered to your door.
          </p>

          {/* Timer */}
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

          {/* Divider */}
          <div className="cd-divider" style={fade(0.56)} />

          {/* Target label */}
          <div className="cd-target-row" style={fade(0.64)}>
            <div className="cd-target-dot" />
            <div className="cd-target-text">Launching · {targetLabel} EAT</div>
          </div>
        </div>
      </div>
    </>
  );
}
