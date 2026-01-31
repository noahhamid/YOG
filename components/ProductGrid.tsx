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
    {
      id: 9,
      title: "Flannel Shirt",
      description: "Casual layering",
      price: "1,600",
      image:
        "https://i.pinimg.com/1200x/56/b5/02/56b502ad1ab836436d590dc8895ac511.jpg",
    },
    {
      id: 10,
      title: "baggy Jeans",
      description: "Modern denim",
      price: "2,000",
      image:
        "https://i.pinimg.com/1200x/8b/e0/3c/8be03c3124b1ebb3a262357a00b87e5d.jpg",
    },
  ];

  return (
    <section ref={sectionRef} className="w-full py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-black font-light uppercase text-[56px] mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.08em",
              fontWeight: 300,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Featured Products
          </h2>
          <p
            className="text-gray-600 text-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
            }}
          >
            Curated pieces for your unique style
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
  return (
    <div
      className="group relative cursor-pointer will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
      }}
    >
      {/* Product Image Container */}
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4 aspect-[3/4]">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Wishlist Button */}
          <button
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-300 opacity-0 translate-x-5 scale-90 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className="text-gray-800" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-full font-semibold text-sm uppercase flex items-center justify-center gap-2 hover:bg-gray-900 transition-all duration-300 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0"
          style={{
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.08em",
            fontWeight: 600,
          }}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>

      {/* Product Info */}
      <div className="px-1">
        <h3
          className="text-gray-900 font-semibold text-base mb-1 uppercase"
          style={{
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.05em",
            fontWeight: 600,
          }}
        >
          {product.title}
        </h3>
        <p
          className="text-gray-500 text-sm mb-2"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
          }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-black font-bold text-lg"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
            }}
          >
            {product.price} <span className="text-sm font-normal">ETB</span>
          </span>

          {/* Size Indicator */}
          <div className="flex gap-1">
            {["S", "M", "L"].map((size) => (
              <span
                key={size}
                className="w-6 h-6 flex items-center justify-center text-gray-400 border border-gray-300 rounded-full hover:border-black hover:text-black transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="mt-3 h-0.5 bg-black rounded-full w-0 group-hover:w-full transition-all duration-400 ease-out" />
    </div>
  );
}
