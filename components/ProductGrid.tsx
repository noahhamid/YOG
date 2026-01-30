"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const products = [
    {
      id: 1,
      title: "Classic White Tee",
      description: "Premium cotton essential",
      price: "800 ETB",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    },
    {
      id: 2,
      title: "Black Denim Jacket",
      description: "Timeless streetwear staple",
      price: "2,500 ETB",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    },
    {
      id: 3,
      title: "Cargo Pants",
      description: "Urban utility meets comfort",
      price: "1,800 ETB",
      image:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    },
    {
      id: 4,
      title: "Oversized Hoodie",
      description: "Cozy streetwear essential",
      price: "1,500 ETB",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    },
    {
      id: 5,
      title: "Slim Fit Joggers",
      description: "Athleisure perfection",
      price: "1,200 ETB",
      image:
        "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=80",
    },
    {
      id: 6,
      title: "Graphic Print Tee",
      description: "Bold statement piece",
      price: "900 ETB",
      image:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    },
    {
      id: 7,
      title: "Bomber Jacket",
      description: "Aviation-inspired style",
      price: "2,800 ETB",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    },
    {
      id: 8,
      title: "Track Pants",
      description: "Retro athletic vibes",
      price: "1,400 ETB",
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    },
    {
      id: 9,
      title: "Flannel Shirt",
      description: "Casual layering essential",
      price: "1,600 ETB",
      image:
        "https://images.unsplash.com/photo-1598032895325-d62e2f7a4b11?w=800&q=80",
    },
    {
      id: 10,
      title: "Distressed Jeans",
      description: "Edgy denim classic",
      price: "2,000 ETB",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
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
              fontFamily: "'Montserrat', 'Helvetica Neue', 'Arial', sans-serif",
              letterSpacing: "0.08em",
              fontWeight: 300,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s ease-out",
            }}
          >
            Featured Products
          </h2>
          <p
            className="text-gray-600 text-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease-out 0.2s",
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

function ProductCard({ product, index, isVisible }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        transition: `all 0.6s ease-out ${index * 0.08}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4 aspect-[3/4]">
        {/* Product Image */}
        <div
          className="absolute inset-0 bg-gray-200 bg-cover bg-center transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url(${product.image})`,
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-black/20 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Wishlist Button */}
          <button
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered
                ? "translateX(0) scale(1)"
                : "translateX(20px) scale(0.8)",
              transition: "all 0.4s ease-out",
            }}
          >
            <Heart size={18} className="text-gray-800" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-full font-semibold text-sm uppercase flex items-center justify-center gap-2 hover:bg-gray-900 transition-all duration-300"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.05em",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.4s ease-out 0.1s",
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
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.03em",
          }}
        >
          {product.title}
        </h3>
        <p
          className="text-gray-500 text-sm mb-2"
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-black font-bold text-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {product.price}
          </span>

          {/* Size Indicator */}
          <div className="flex gap-1">
            {["S", "M", "L"].map((size) => (
              <span
                key={size}
                className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 border border-gray-300 rounded-full hover:border-black hover:text-black transition-all duration-200"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "10px",
                }}
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div
        className="mt-3 h-0.5 bg-black rounded-full transition-all duration-400 ease-out"
        style={{
          width: isHovered ? "100%" : "0%",
        }}
      />
    </div>
  );
}
