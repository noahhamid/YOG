"use client";
import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  .pg-wrap { display:flex; gap:12px; font-family:'Sora',sans-serif; }
  .pg-thumbs { display:flex; flex-direction:column; gap:8px; width:76px; flex-shrink:0; }
  .pg-thumb {
    width:76px; height:76px; border-radius:10px; overflow:hidden;
    border:1.5px solid #e8e4de; cursor:pointer; transition:all 0.15s;
    flex-shrink:0; background:#f5f3f0;
  }
  .pg-thumb:hover { border-color:#9e9890; }
  .pg-thumb.active { border-color:#1a1714; border-width:2px; }
  .pg-thumb img { width:100%; height:100%; object-fit:cover; }
  .pg-main {
    flex:1; aspect-ratio:1; border-radius:16px; overflow:hidden;
    background:#f5f3f0; position:relative; border:1px solid #e8e4de;
  }
  .pg-main-img {
    width:100%; height:100%; transition:transform 0.1s;
  }
  .pg-main-img img { width:100%; height:100%; object-fit:cover; display:block; user-select:none; }
  .pg-discount {
    position:absolute; top:14px; left:14px; z-index:10;
    background:#dc2626; color:#fff; padding:4px 10px;
    border-radius:20px; font-size:11px; font-weight:700; letter-spacing:0.3px;
  }
  .pg-counter {
    position:absolute; bottom:14px; right:14px;
    background:rgba(26,23,20,0.72); color:#fff;
    padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600;
    backdrop-filter:blur(4px);
  }
  .pg-dots {
    position:absolute; bottom:14px; left:50%; transform:translateX(-50%);
    display:flex; gap:5px;
  }
  .pg-dot {
    width:6px; height:6px; border-radius:50%;
    background:rgba(255,255,255,0.45); transition:all 0.15s; cursor:pointer;
  }
  .pg-dot.active { background:#fff; width:18px; border-radius:3px; }
`;

interface Props {
  images: string[];
  title: string;
  discount: number;
}

export default function ProductImageGallery({
  images,
  title,
  discount,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pg-wrap">
        {/* Thumbnails */}
        <div className="pg-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`pg-thumb ${current === i ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            >
              <img src={img} alt={`${title} ${i + 1}`} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div
          className="pg-main"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <div
            className="pg-main-img"
            style={{
              transform: zoomed ? "scale(1.55)" : "scale(1)",
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              cursor: zoomed ? "zoom-out" : "zoom-in",
            }}
          >
            <img src={images[current]} alt={title} draggable={false} />
          </div>

          {discount > 0 && <div className="pg-discount">−{discount}%</div>}

          <div className="pg-counter">
            {current + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <div className="pg-dots">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`pg-dot ${current === i ? "active" : ""}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
