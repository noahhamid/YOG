"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
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

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold z-10">
            -{discount}%
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex(
                  (currentIndex - 1 + images.length) % images.length,
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % images.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow-lg hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
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
    </div>
  );
}
