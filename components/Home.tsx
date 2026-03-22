"use client";

import { useEffect, useState, useRef } from "react";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'Sora', sans-serif; }

  @keyframes hm-grain {
    0%,100%{transform:translate(0,0)} 20%{transform:translate(-1px,2px)}
    40%{transform:translate(2px,-1px)} 60%{transform:translate(-2px,1px)} 80%{transform:translate(1px,-2px)}
  }
  @keyframes hm-word-in { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hm-fade-in  { from{opacity:0} to{opacity:1} }

  .anim-grain { animation: hm-grain 0.5s steps(1) infinite; }
  .anim-word  { animation: hm-word-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .frame-transition { transition: all 0.72s cubic-bezier(0.4,0,0.2,1); }

  .hm-root {
    display: flex; flex-direction: column; align-items: center;
    height: calc(100svh - 20px); max-height: calc(100svh - 20px);
    overflow: hidden; background: #f6f5f3; padding-top: 10px;
  }

  .hm-text {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: 80px 20px 14px; width: 100%; max-width: 900px;
    flex-shrink: 0; border-bottom: 1px solid #e8e4de;
  }
  .hm-eyebrow { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .hm-eyebrow-line { width:24px; height:1.5px; background:#9e9890; }
  .hm-eyebrow-text { font-size:11px; font-weight:700; color:#9e9890; text-transform:uppercase; letter-spacing:1.2px; }
  .hm-h1 {
    font-size: clamp(36px,5.5vw,80px); font-weight:800; color:#1a1714;
    line-height:1; letter-spacing:-0.04em; margin:0 0 10px; white-space:nowrap;
  }
  .hm-sub { font-size:13px; color:#9e9890; line-height:1.65; max-width:380px; margin:0 0 14px; }
  .hm-btns { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
  .hm-btn-primary {
    display:inline-flex; align-items:center; gap:6px;
    padding:10px 22px; background:#1a1714; color:#fff;
    font-size:12px; font-weight:700; border-radius:11px; border:none;
    cursor:pointer; text-decoration:none; transition:all 0.18s;
  }
  .hm-btn-primary:hover { background:#333; transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,0,0,0.14); }
  .hm-btn-ghost {
    display:inline-flex; align-items:center; gap:6px;
    padding:10px 20px; background:transparent; color:#1a1714;
    font-size:12px; font-weight:700; border-radius:11px;
    border:1.5px solid #e8e4de; text-decoration:none; transition:all 0.18s;
  }
  .hm-btn-ghost:hover { border-color:#1a1714; background:#fff; }

  /* ── Desktop arc carousel ── */
  .hm-carousel-area { width:100%; flex:1; min-height:0; overflow:visible; position:relative; }
  .hm-carousel-inner { max-width:1280px; margin:0 auto; padding:0 16px; height:100%; position:relative; }
  .hm-frames { position:absolute; inset:0; display:flex; justify-content:center; align-items:flex-end; }
  .hm-dots {
    position:absolute; bottom:18px; left:50%; transform:translateX(-50%);
    display:flex; gap:7px; z-index:30;
  }
  .hm-dot { height:6px; border-radius:3px; border:none; cursor:pointer; transition:all 0.3s; background:rgba(26,23,20,0.18); }
  .hm-dot.active { width:20px; background:#1a1714; }
  .hm-dot:not(.active) { width:6px; }

  /* ── Mobile single-slide ── */
  .hm-mobile-carousel {
    display: none; position: relative;
    width: 100%; flex: 1; min-height: 0;
    padding-top: 18px;
  }
  .hm-mobile-slide {
    position: absolute;
    left: 50%; transform: translateX(-50%);
    overflow: hidden; border-radius: 9999px 9999px 0 0;
    opacity: 0; transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
    /* default (>400px) */
    bottom: -40px;
  }
  .hm-mobile-slide.active { opacity: 1; }
  .hm-mobile-slide img { width:100%; height:100%; object-fit:cover; object-position:top; display:block; }

  /* ── Responsive ── */
  @media (max-width: 900px) and (min-width: 641px) {
    .hm-text { padding: 90px 24px 12px; }
    .hm-h1   { font-size: clamp(32px, 6vw, 60px); }
    .hm-sub  { font-size: 12px; }
  }

  @media (max-width: 640px) {
    .hm-root { height: calc(100svh - 20px); max-height: calc(100svh - 20px); overflow: hidden; }
    .hm-text { padding: 82px 18px 12px; border-bottom: 1px solid #e8e4de; }
    .hm-h1   { font-size: clamp(28px, 9vw, 46px); white-space: normal; }
    .hm-sub  { font-size: 12px; max-width: 280px; }
    .hm-btn-primary, .hm-btn-ghost { padding: 9px 16px; font-size: 11px; }
    .hm-carousel-area   { display: none; }
    .hm-mobile-carousel { display: block; }
  }

  /* 320px */
  @media (max-width: 340px) {
    .hm-text { padding: 76px 14px 10px; }
    .hm-h1   { font-size: clamp(26px, 10vw, 40px); }
    .hm-btns { gap: 8px; }
    .hm-btn-primary, .hm-btn-ghost { padding: 8px 14px; font-size: 10px; }
    .hm-mobile-slide { bottom: -20px; }
  }

  /* 375px */
  @media (min-width: 341px) and (max-width: 400px) {
    .hm-text { padding: 76px 14px 10px; }
    .hm-h1   { font-size: clamp(26px, 10vw, 40px); }
    .hm-btns { gap: 8px; }
    .hm-btn-primary, .hm-btn-ghost { padding: 8px 14px; font-size: 10px; }
    .hm-mobile-slide { bottom: -30px; }
  }

  /* 425px and above mobile — -40px already set as default above 400px */
`;

const ArrowIco = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IMAGES = [
  "https://i.pinimg.com/736x/20/c6/59/20c65924540dfb04f838becaa011024f.jpg",
  "https://i.pinimg.com/736x/60/0a/dd/600add9cd7c693096eb36e0f4816fb3f.jpg",
  "https://i.pinimg.com/736x/ab/bb/f3/abbbf3e25662109c77967649cff0f65e.jpg",
  "https://i.pinimg.com/1200x/e9/3a/72/e93a72d23920a6cda792be63b7df8879.jpg",
  "https://i.pinimg.com/736x/9e/08/02/9e080294c3e98b72af065936d7354819.jpg",
];

const HEADLINE = ["Dress", "for every", "moment."];

export default function Home() {
  const [stage, setStage] = useState(0);
  const [center, setCenter] = useState(2);
  const [vh, setVh] = useState(0);
  const [vw, setVw] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      setVh(window.innerHeight);
      setVw(window.innerWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 120);
    const t2 = setTimeout(() => setStage(2), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (stage < 2) return;
    timerRef.current = setInterval(
      () => setCenter((p) => (p + 1) % IMAGES.length),
      3500,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  const getPos = (idx: number) => {
    let d = idx - center;
    if (d > 2) d -= IMAGES.length;
    if (d < -2) d += IMAGES.length;
    return d;
  };

  const handleDot = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCenter(i);
    timerRef.current = setInterval(
      () => setCenter((p) => (p + 1) % IMAGES.length),
      3500,
    );
  };

  const fadeUp = (delay: number) => ({
    opacity: stage >= 2 ? 1 : 0,
    transform: stage >= 2 ? "translateY(0)" : "translateY(12px)",
    transition: `all 0.5s ease ${delay}s`,
  });

  const safeVh = vh || 800;
  const safeVw = vw || 1200;
  const isMobile = vw > 0 && vw < 641;

  const H = Math.round(safeVh * 0.5);
  const gapX = 290;

  const mobileW = Math.round(safeVw * 0.72);
  // ✅ 425px+ gets taller image to show more content, smaller screens stay compact
  const mobileH = Math.round(safeVh * 0.52);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="hm-root">
        {/* Grain */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-35 anim-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Text block */}
        <div className="hm-text" style={{ zIndex: 10 }}>
          <div className="hm-eyebrow" style={fadeUp(0.05)}>
            <div className="hm-eyebrow-line" />
            <span className="hm-eyebrow-text">Yog Fashion · Ethiopia</span>
            <div className="hm-eyebrow-line" />
          </div>

          <h1 className="hm-h1">
            {HEADLINE.map((line, li) => (
              <span
                key={li}
                style={{ marginRight: li < HEADLINE.length - 1 ? "0.22em" : 0 }}
              >
                {line.split(" ").map((word, wi, arr) => {
                  const delay = stage >= 2 ? (li * 3 + wi) * 0.08 + 0.1 : 0;
                  return (
                    <span
                      key={wi}
                      style={{
                        marginRight: wi < arr.length - 1 ? "0.22em" : 0,
                      }}
                    >
                      <span
                        className="inline-block opacity-0 anim-word"
                        style={{
                          animationDelay: `${delay}s`,
                          animationPlayState: stage >= 2 ? "running" : "paused",
                        }}
                      >
                        {li === 1 ? (
                          <em
                            style={{
                              fontStyle: "normal",
                              color: "#9e9890",
                              fontWeight: 300,
                              letterSpacing: "-0.04em",
                            }}
                          >
                            {word}
                          </em>
                        ) : (
                          word
                        )}
                      </span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <p className="hm-sub" style={fadeUp(0.55)}>
            Shop verified sellers across Ethiopia — streetwear, formal,
            activewear and more, delivered to your door.
          </p>

          <div className="hm-btns" style={fadeUp(0.68)}>
            <button
              className="hm-btn-primary"
              onClick={() =>
                document
                  .getElementById("shop")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Shop Now <ArrowIco />
            </button>
            <a href="/stores" className="hm-btn-ghost">
              Explore Stores
            </a>
          </div>
        </div>

        {/* Desktop arc carousel */}
        <div className="hm-carousel-area" style={{ zIndex: 10 }}>
          <div className="hm-carousel-inner">
            <div className="hm-frames">
              {vh > 0 &&
                !isMobile &&
                IMAGES.map((url, idx) => {
                  const pos = getPos(idx);
                  const absDist = Math.abs(pos);
                  const isC = pos === 0;
                  const visible = absDist <= 2;
                  const imgH = H * (1 - absDist * 0.04);
                  const W = isC
                    ? Math.round(safeVh * 0.4)
                    : Math.round(safeVh * 0.37);
                  const rot = pos * 4;
                  const pushDn =
                    Math.abs(rot) *
                    (W / 10) *
                    Math.sin((Math.abs(rot) * Math.PI) / 180);

                  let tX = `${pos * gapX}px`;
                  let tY = `${pushDn}px`;
                  let imgW = `${W}px`;
                  let imgHstr = `${imgH}px`;
                  let opacity = visible ? 1 : 0;

                  if (isC && stage === 0) {
                    opacity = 0;
                    imgW = `${Math.round(safeVh * 0.44)}px`;
                    imgHstr = `${Math.round(safeVh * 0.56)}px`;
                    tY = `${-Math.round(safeVh * 0.34)}px`;
                  } else if (!isC && stage < 1) {
                    opacity = 0;
                    tX = pos < 0 ? "-900px" : "900px";
                  }

                  return (
                    <div
                      key={idx}
                      className="shrink-0 overflow-hidden absolute left-1/2 frame-transition"
                      style={{
                        width: imgW,
                        height: imgHstr,
                        borderRadius: "9999px 9999px 0 0",
                        transform: `translateX(calc(-50% + ${tX})) translateY(${tY}) rotate(${rot}deg)`,
                        transformOrigin: "bottom center",
                        opacity,
                        boxShadow: isC
                          ? "0 14px 48px rgba(0,0,0,0.18)"
                          : "0 8px 28px rgba(0,0,0,0.10)",
                        pointerEvents: "none",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Look ${idx + 1}`}
                        className="w-full h-full object-cover object-top block"
                      />
                    </div>
                  );
                })}
            </div>

            {!isMobile && (
              <div
                className="hm-dots"
                style={{
                  opacity: stage >= 2 ? 1 : 0,
                  transition: "opacity 0.4s ease 0.7s",
                }}
              >
                {IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`hm-dot${i === center ? " active" : ""}`}
                    onClick={() => handleDot(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile single-image carousel */}
        <div className="hm-mobile-carousel" style={{ zIndex: 10 }}>
          {vh > 0 &&
            IMAGES.map((url, idx) => (
              <div
                key={idx}
                className={`hm-mobile-slide${idx === center ? " active" : ""}`}
                style={{
                  width: `${mobileW}px`,
                  height: `${mobileH}px`,
                  ...(idx === center && stage === 0 ? { opacity: 0 } : {}),
                }}
              >
                <img src={url} alt={`Look ${idx + 1}`} />
              </div>
            ))}

          <div
            className="hm-dots"
            style={{
              opacity: stage >= 2 ? 1 : 0,
              transition: "opacity 0.4s ease 0.7s",
            }}
          >
            {IMAGES.map((_, i) => (
              <button
                key={i}
                className={`hm-dot${i === center ? " active" : ""}`}
                onClick={() => handleDot(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
