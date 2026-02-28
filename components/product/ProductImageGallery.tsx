"use client";

import { useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex gap-3">
      {/* ✅ THUMBNAILS ON LEFT */}
      <div className="flex flex-col gap-2 w-20">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              currentIndex === i
                ? "border-black"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img
              src={img}
              alt={`${title} ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* ✅ MAIN IMAGE (NO ARROWS) */}
      <div
        className="relative flex-1 aspect-square bg-gray-100 rounded-xl overflow-hidden"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <div
          className={`w-full h-full transition-transform duration-100 ${isZoomed ? "scale-150" : "scale-100"}`}
          style={{
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            cursor: isZoomed ? "zoom-out" : "zoom-in",
          }}
        >
          <img
            src={images[currentIndex]}
            alt={title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold z-10">
            -{discount}%
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
