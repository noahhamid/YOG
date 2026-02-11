"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "100px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const products = [
    {
      id: 1,
      title: "Essential White Tee",
      description: "Premium organic cotton",
      price: "800",
      image:
        "https://i.pinimg.com/1200x/6c/29/4d/6c294de767f1fc184ae4591d38662b49.jpg",
    },
    {
      id: 2,
      title: "Denim Jacket",
      description: "Classic streetwear",
      price: "2,500",
      image:
        "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
    },
    {
      id: 3,
      title: "Utility Cargo",
      description: "Urban comfort",
      price: "1,800",
      image:
        "https://i.pinimg.com/736x/d1/7c/8d/d17c8d81022342185ae929271704f535.jpg",
    },
    {
      id: 4,
      title: "Oversized Hoodie",
      description: "Cozy essential",
      price: "1,500",
      image:
        "https://i.pinimg.com/1200x/2e/da/3d/2eda3de39d654180908f3d87590ceb1b.jpg",
    },
    {
      id: 5,
      title: "Slim Joggers",
      description: "Athletic style",
      price: "1,200",
      image:
        "https://i.pinimg.com/1200x/ed/73/47/ed73471bd6bc58afbf67fd11d1de9536.jpg",
    },
    {
      id: 6,
      title: "Graphic Tee",
      description: "Statement piece",
      price: "900",
      image:
        "https://i.pinimg.com/736x/4f/99/be/4f99be2e372c30cf87d9a16d1f5b209a.jpg",
    },
    {
      id: 7,
      title: "Bomber Jacket",
      description: "Aviation inspired",
      price: "2,800",
      image:
        "https://i.pinimg.com/736x/ba/2e/de/ba2ede82049f540aace10180acfbd8fa.jpg",
    },
    {
      id: 8,
      title: "Track Pants",
      description: "Retro athletic",
      price: "1,400",
      image:
        "https://i.pinimg.com/736x/6f/d7/6b/6fd76b54f6135a206f407700b0ca74b1.jpg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 px-4 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-black font-light uppercase text-[64px] mb-4 tracking-tight"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Featured Collection
          </h2>
          <p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontWeight: 400,
              fontSize: "20px",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
            }}
          >
            Handpicked pieces that define contemporary Ethiopian style
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
  };
  index: number;
  isVisible: boolean;
}

function ProductCard({ product, index, isVisible }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group relative cursor-pointer will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(60px)",
        transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`,
      }}
    >
      {/* White Card Container with subtle border */}
      <div
        className="bg-white rounded-3xl p-3 transition-all duration-500 relative overflow-hidden"
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)",
        }}
      >
        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 50%)",
          }}
        />

        {/* Product Image Container */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4 aspect-square">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            style={{
              filter: "saturate(0.95) contrast(1.05)",
            }}
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                isLiked
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-gray-700 group-hover:stroke-red-500"
              }`}
              strokeWidth={2}
            />
          </button>

          {/* Quick Add Button - Slides up on hover */}
          <button
            className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm text-white py-4 font-medium text-sm uppercase flex items-center justify-center gap-2.5 transition-all duration-500 hover:bg-black"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.1em",
              fontWeight: 600,
              transform: "translateY(100%)",
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.closest(".group:hover")) {
                e.currentTarget.style.transform = "translateY(100%)";
                e.currentTarget.style.opacity = "0";
              }
            }}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            Quick Add
          </button>
        </div>

        {/* Product Info */}
        <div className="px-2 space-y-3 relative z-10">
          {/* Title */}
          <h3
            className="text-gray-900 font-medium text-lg leading-tight tracking-tight"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            {product.title}
          </h3>

          {/* Description */}
          <p
            className="text-gray-500 text-sm leading-relaxed"
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontWeight: 400,
            }}
          >
            {product.description}
          </p>

          {/* Rating Stars */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 transition-colors ${
                  star <= 4
                    ? "fill-amber-400 stroke-amber-400"
                    : "fill-gray-200 stroke-gray-200"
                }`}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span
              className="text-xs text-gray-400 ml-1"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              4.0
            </span>
          </div>

          {/* Price and Sizes */}
          <div className="flex items-end justify-between pt-2">
            <div>
              <span
                className="text-black font-bold text-2xl tracking-tight"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                {product.price}
              </span>
              <span
                className="text-gray-500 text-sm font-normal ml-1"
                style={{
                  fontFamily: "'Crimson Pro', serif",
                }}
              >
                ETB
              </span>
            </div>

            {/* Size Options */}
            <div className="flex gap-1.5">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all duration-300 cursor-pointer border border-gray-200 hover:border-black"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle bottom accent that grows on hover */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-black to-transparent transition-all duration-500"
          style={{
            width: "0%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = "80%";
          }}
        />
      </div>
    </div>
  );
}
