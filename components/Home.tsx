"use client";

import { useEffect, useState } from "react";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'Sora', sans-serif; }
  @keyframes hm-grain {
    0%,100%{transform:translate(0,0)} 20%{transform:translate(-1px,2px)}
    40%{transform:translate(2px,-1px)} 60%{transform:translate(-2px,1px)} 80%{transform:translate(1px,-2px)}
  }
  @keyframes hm-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes hm-word-in { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .anim-grain   { animation: hm-grain 0.5s steps(1) infinite; }
  .anim-marquee { animation: hm-marquee 28s linear infinite; }
  .anim-word    { animation: hm-word-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .frame-transition { transition: all 0.72s cubic-bezier(0.4,0,0.2,1); }
`;

const ArrowLeft = () => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const ArrowRight = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
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

const MARQUEE = [
  "Free shipping above 500 ETB",
  "New drops every week",
  "Verified Ethiopian sellers",
  "Secure checkout",
  "500+ styles available",
  "Free shipping above 500 ETB",
  "New drops every week",
  "Verified Ethiopian sellers",
  "Secure checkout",
  "500+ styles available",
];

const HEADLINE = ["Dress", "for every", "moment."];

export default function Home() {
  const [stage, setStage] = useState(0);
  const [center, setCenter] = useState(2);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const update = () => setVh(window.innerHeight);
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
    const iv = setInterval(
      () => setCenter((p) => (p + 1) % IMAGES.length),
      3500,
    );
    return () => clearInterval(iv);
  }, [stage, center]);

  const goPrev = () => setCenter((p) => (p === 0 ? IMAGES.length - 1 : p - 1));
  const goNext = () => setCenter((p) => (p === IMAGES.length - 1 ? 0 : p + 1));

  const getPos = (idx: number) => {
    let d = idx - center;
    if (d > 2) d -= IMAGES.length;
    if (d < -2) d += IMAGES.length;
    return d;
  };

  const fadeUp = (delay: number) => ({
    opacity: stage >= 2 ? 1 : 0,
    transform: stage >= 2 ? "translateY(0)" : "translateY(12px)",
    transition: `all 0.5s ease ${delay}s`,
  });

  const safeVh = vh || 800;

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="flex flex-col items-center h-screen max-h-screen overflow-hidden bg-[#f6f5f3] pt-10">
        {/* Grain */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-35 anim-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Marquee */}
        <div className="w-full overflow-hidden border-b border-[#e8e4de] py-2 bg-[#f6f5f3] relative z-10 shrink-0">
          <div className="flex w-max anim-marquee">
            {MARQUEE.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-7 text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.4px] whitespace-nowrap"
              >
                <span className="w-1 h-1 rounded-full bg-[#e8e4de] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Text block */}
        <div className="flex flex-col items-center text-center pt-10 pb-[5px] px-6 relative z-10 w-full max-w-[900px] shrink-0 border-b border-[#e8e4de]">
          <div
            className="flex items-center gap-2.5 mb-2.5"
            style={fadeUp(0.05)}
          >
            <div className="w-7 h-[1.5px] bg-[#9e9890]" />
            <span className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px]">
              Yog Fashion · Ethiopia
            </span>
            <div className="w-7 h-[1.5px] bg-[#9e9890]" />
          </div>

          <h1 className="text-[clamp(44px,5.5vw,80px)] font-extrabold text-[#1a1714] leading-none tracking-[-3px] mb-2.5 whitespace-nowrap">
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
                          <em className="not-italic text-[#9e9890] font-light tracking-[-2px]">
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

          <p
            className="text-[13px] text-[#9e9890] font-normal leading-relaxed max-w-[400px] mb-2.5"
            style={fadeUp(0.55)}
          >
            Shop verified sellers across Ethiopia — streetwear, formal,
            activewear and more, delivered to your door.
          </p>

          <div
            className="flex gap-2.5 flex-wrap justify-center"
            style={fadeUp(0.68)}
          >
            {/* Shop Now — smooth-scrolls to #shop section below the hero */}
            <button
              onClick={() =>
                document
                  .getElementById("shop")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-1.5 px-[22px] py-[10px] bg-[#1a1714] text-white text-[12px] font-bold rounded-[11px] border-none cursor-pointer transition-all duration-200 hover:bg-[#333] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.14)]"
            >
              Shop Now <ArrowIco />
            </button>
            {/* Explore More — navigates to /stores (all seller stores listing) */}
            <a
              href="/store"
              className="inline-flex items-center gap-1.5 px-5 py-[10px] bg-transparent text-[#1a1714] text-[12px] font-bold border border-[#e8e4de] rounded-[11px] no-underline transition-all duration-200 hover:border-[#1a1714] hover:bg-white"
            >
              Explore More
            </a>
          </div>
        </div>

        {/* Arc carousel */}
        <div className="w-full flex-1 min-h-0 overflow-visible relative z-10">
          <div className="max-w-[1280px] mx-auto px-4 h-full">
            <div className="relative h-full">
              {vh > 0 && (
                <div className="absolute inset-0 flex justify-center items-end">
                  {IMAGES.map((url, idx) => {
                    const pos = getPos(idx);
                    const absDist = Math.abs(pos);
                    const isCenter = pos === 0;
                    const visible = absDist <= 2;

                    const H = Math.round(safeVh * 0.52);
                    const imgH = H * (1 - absDist * 0.05);
                    const W = isCenter
                      ? Math.round(safeVh * 0.38)
                      : Math.round(safeVh * 0.34);
                    const rot = pos * 4;
                    const pushDn =
                      Math.abs(rot) *
                      (W / 10) *
                      Math.sin((Math.abs(rot) * Math.PI) / 180);
                    const gapX = 270;

                    let tX: string = `${pos * gapX}px`;
                    let tY: string = `${pushDn}px`;
                    let imgW: string = `${W}px`;
                    let imgHstr: string = `${imgH}px`;
                    let opacity: number = visible ? 1 : 0;

                    if (isCenter && stage === 0) {
                      opacity = 0;
                      imgW = `${Math.round(safeVh * 0.56)}px`;
                      imgHstr = `${Math.round(safeVh * 0.7)}px`;
                      tY = `${-Math.round(safeVh * 0.42)}px`;
                    } else if (!isCenter && stage < 1) {
                      opacity = 0;
                      tX = pos < 0 ? "-900px" : "900px";
                    }

                    return (
                      <div
                        key={idx}
                        className="shrink-0 overflow-hidden absolute left-1/2 shadow-[0_10px_36px_rgba(0,0,0,0.13)] frame-transition"
                        style={{
                          width: imgW,
                          height: imgHstr,
                          borderRadius: "9999px 9999px 0 0",
                          transform: `translateX(calc(-50% + ${tX})) translateY(${tY}) rotate(${rot}deg)`,
                          transformOrigin: "bottom center",
                          opacity,
                          pointerEvents: visible ? "auto" : "none",
                          cursor: isCenter ? "default" : "pointer",
                        }}
                        onClick={() => !isCenter && setCenter(idx)}
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
              )}

              {/* Arrows */}
              {(["prev", "next"] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={dir === "prev" ? goPrev : goNext}
                  aria-label={dir === "prev" ? "Previous" : "Next"}
                  className={`absolute bottom-4 z-30 cursor-pointer group ${dir === "prev" ? "left-[100px]" : "right-[100px]"}`}
                  style={{
                    transform:
                      stage >= 2
                        ? `rotate(${dir === "prev" ? -8 : 8}deg) translateY(0)`
                        : `rotate(${dir === "prev" ? -8 : 8}deg) translateY(100px)`,
                    opacity: stage >= 2 ? 1 : 0,
                    transition:
                      "transform 0.4s ease 0.6s, opacity 0.4s ease 0.6s",
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.22)]"
                    style={{
                      width: 48,
                      height: 28,
                      borderRadius: 999,
                      background: "rgba(26,23,20,0.78)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(10px)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {dir === "prev" ? <ArrowLeft /> : <ArrowRight />}
                  </div>
                </button>
              ))}

              {/* Dots */}
              <div
                className="absolute bottom-[22px] left-1/2 -translate-x-1/2 flex gap-[7px] z-30"
                style={{
                  opacity: stage >= 2 ? 1 : 0,
                  transition: "opacity 0.4s ease 0.7s",
                }}
              >
                {IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCenter(i)}
                    className="h-[6px] rounded-[3px] border-none cursor-pointer transition-all duration-300"
                    style={{
                      width: i === center ? "20px" : "6px",
                      background:
                        i === center ? "#1a1714" : "rgba(26,23,20,0.18)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
