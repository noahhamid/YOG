"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ShopByStyle() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing after first trigger
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const styles = [
    {
      title: "Streetwear",
      description: "Urban vibes meet Ethiopian culture",
      image:
        "https://i.pinimg.com/736x/8e/3d/4a/8e3d4a5c8f5e8f8e8e8e8e8e8e8e8e8e.jpg",
      color: "#FF6B35",
    },
    {
      title: "Traditional",
      description: "Celebrate heritage with modern twist",
      image:
        "https://i.pinimg.com/736x/5a/2e/9d/5a2e9d5f5e5e5e5e5e5e5e5e5e5e5e5e.jpg",
      color: "#4ECDC4",
    },
    {
      title: "Casual",
      description: "Everyday comfort, effortless style",
      image:
        "https://i.pinimg.com/736x/1c/4b/3a/1c4b3a8d8d8d8d8d8d8d8d8d8d8d8d8d.jpg",
      color: "#FFD93D",
    },
    {
      title: "Formal",
      description: "Elegance for every occasion",
      image:
        "https://i.pinimg.com/736x/7f/9e/2c/7f9e2c6b6b6b6b6b6b6b6b6b6b6b6b6b.jpg",
      color: "#6C5CE7",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 px-4 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Animation */}
        <div className="text-center mb-16">
          <h2
            className="text-black font-light uppercase text-[56px] mb-4"
            style={{
              fontFamily: "'Montserrat', 'Helvetica Neue', 'Arial', sans-serif",
              letterSpacing: "0.08em",
              fontWeight: 300,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s ease-out",
            }}
          >
            Shop by Style
          </h2>
          <p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease-out 0.2s",
            }}
          >
            Discover your perfect look from our curated collections
          </p>
        </div>

        {/* Style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {styles.map((style, index) => (
            <StyleCard
              key={style.title}
              style={style}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StyleCard({ style, index, isVisible }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(60px)",
        transition: `all 0.7s ease-out ${index * 0.15}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-lg"
        style={{
          height: "450px",
          transform: isHovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${style.image})`,
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.7s ease-out",
          }}
        />

        {/* Overlay Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${style.color}f0 0%, ${style.color}80 40%, transparent 100%)`,
            opacity: isHovered ? 1 : 0.9,
            transition: "opacity 0.5s ease-out",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3
            className="text-white font-semibold uppercase text-2xl mb-2"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.05em",
              transform: isHovered ? "translateY(-10px)" : "translateY(0)",
              transition: "transform 0.4s ease-out",
            }}
          >
            {style.title}
          </h3>
          <p
            className="text-white/90 text-sm mb-4"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              opacity: isHovered ? 1 : 0.8,
              transform: isHovered ? "translateY(-8px)" : "translateY(0)",
              transition: "all 0.4s ease-out",
            }}
          >
            {style.description}
          </p>

          {/* Shop Now Button */}
          <button
            className="flex items-center gap-2 text-white font-semibold text-sm uppercase bg-black/30 backdrop-blur-sm px-5 py-3 rounded-full self-start"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              opacity: isHovered ? 1 : 0,
              transform: isHovered
                ? "translateY(-5px) translateX(0)"
                : "translateY(20px) translateX(-20px)",
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            Shop Now
            <ArrowRight
              size={16}
              style={{
                transform: isHovered ? "translateX(5px)" : "translateX(0)",
                transition: "transform 0.3s ease-out",
              }}
            />
          </button>
        </div>

        {/* Decorative Corner Element */}
        <div
          className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-white/40"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered
              ? "scale(1) rotate(0deg)"
              : "scale(0) rotate(180deg)",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>

      {/* Bottom Label */}
      <div
        className="mt-4 text-center"
        style={{
          opacity: isHovered ? 0.6 : 1,
          transition: "opacity 0.3s ease-out",
        }}
      >
        <div
          className="w-12 h-1 mx-auto rounded-full"
          style={{
            backgroundColor: style.color,
            transform: isHovered ? "scaleX(1.5)" : "scaleX(1)",
            transition: "transform 0.4s ease-out",
          }}
        />
      </div>
    </div>
  );
}
