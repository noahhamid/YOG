"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [animationStage, setAnimationStage] = useState(0);
  const [centerIndex, setCenterIndex] = useState(2); // Start with middle image (index 2)

  useEffect(() => {
    // Stage 0: Initial load with big middle image (0-500ms)
    const timer1 = setTimeout(() => setAnimationStage(1), 500);

    // Stage 1: Middle image scales down AND side images start sliding in (500-1500ms)
    const timer2 = setTimeout(() => setAnimationStage(2), 1500);

    // Stage 2: Text appears word by word (1500ms+)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // High-quality fashion/workout images
  const demoImages = [
    "https://i.pinimg.com/736x/20/c6/59/20c65924540dfb04f838becaa011024f.jpg",
    "https://i.pinimg.com/736x/60/0a/dd/600add9cd7c693096eb36e0f4816fb3f.jpg",
    "https://i.pinimg.com/736x/ab/bb/f3/abbbf3e25662109c77967649cff0f65e.jpg",
    "https://i.pinimg.com/1200x/e9/3a/72/e93a72d23920a6cda792be63b7df8879.jpg",
    "https://i.pinimg.com/736x/9e/08/02/9e080294c3e98b72af065936d7354819.jpg",
  ];

  const handlePrev = () => {
    setCenterIndex((prev) => (prev === 0 ? demoImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCenterIndex((prev) => (prev === demoImages.length - 1 ? 0 : prev + 1));
  };

  // Calculate position of each image relative to center
  const getImagePosition = (imageIndex: number) => {
    const diff = imageIndex - centerIndex;
    if (diff > 2) return diff - demoImages.length;
    if (diff < -2) return diff + demoImages.length;
    return diff;
  };

  // Split text into words for animation
  const words = "gear up every season every workout".split(" ");

  return (
    <div className="flex flex-col items-center overflow-hidden pt-25">
      {/* Text Section - Hidden until stage 2 */}
      <div className="flex flex-col items-center justify-center text-center">
        <p
          className="text-black font-light uppercase leading-[1.1] text-[68px] max-w-2/3 mx-auto"
          style={{
            fontFamily: "'Montserrat', 'Helvetica Neue', 'Arial', sans-serif",
            letterSpacing: "0.08em",
            fontWeight: 300,
          }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="inline-block mr-4"
              style={{
                opacity: animationStage >= 2 ? 1 : 0,
                transform:
                  animationStage >= 2 ? "translateY(0)" : "translateY(50px)",
                transition: "all 0.4s ease-out",
                transitionDelay:
                  animationStage >= 2 ? `${index * 0.08}s` : "0s",
              }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Buttons - Fade in after text */}
        <div
          className="mt-5 flex flex-col sm:flex-row justify-center gap-4"
          style={{
            opacity: animationStage >= 2 ? 1 : 0,
            transform:
              animationStage >= 2 ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease-out",
            transitionDelay:
              animationStage >= 2 ? `${words.length * 0.08 + 0.2}s` : "0s",
          }}
        >
          <a
            href="/shop"
            className="px-5 py-[13px] bg-black text-white text-[12px] font-semibold uppercase rounded-full hover:bg-gray-800 transition-colors"
          >
            Shop Now
          </a>
          <a
            href="/explore"
            className="px-5 py-[13px] border bg-white border-none text-black text-[12px] font-semibold uppercase rounded-full hover:bg-gray-100 transition-colors"
          >
            Explore More
          </a>
        </div>
      </div>

      {/* Showcase Section with Curved Layout */}
      <div className="w-full flex-shrink-0 pt-3 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative" style={{ height: "400px" }}>
            <div className="flex justify-center items-end h-full absolute bottom-0 left-0 right-0">
              {demoImages.map((url, imageIndex) => {
                const position = getImagePosition(imageIndex);
                const isMiddle = position === 0;
                const isVisible = Math.abs(position) <= 2;

                // Default sizing based on position - SYMMETRIC for outer images
                const distanceFromMiddle = Math.abs(position);
                const heightPercentage = 1 - distanceFromMiddle * 0.05;
                const maxHeight = 350;
                const imageHeight = maxHeight * heightPercentage;

                // Rotation based on position - SYMMETRIC
                const maxRotation = 8;
                const rotation = position * (maxRotation / 2);

                // Push down based on rotation - SYMMETRIC
                const width = 275;
                const pushDown =
                  Math.abs(rotation) *
                  (width / 10) *
                  Math.sin((Math.abs(rotation) * Math.PI) / 180);

                // Animation logic
                let scale = 1;
                let translateX = `${position * 300}px`;
                let translateY = `${pushDown}px`;
                let opacity = isVisible ? 1 : 0;
                let height = `${imageHeight}px`;
                let widthStyle = "275px";

                if (isMiddle) {
                  // Middle image: starts HUGE in both width and height to cover text area
                  if (animationStage === 0) {
                    widthStyle = "650px";
                    height = "700px";
                    translateY = "-450px";
                    translateX = "0px";
                    scale = 1;
                  } else if (animationStage >= 1) {
                    widthStyle = "300px";
                    height = `${imageHeight}px`;
                    translateY = `${pushDown}px`;
                    translateX = "0px";
                    scale = 1;
                  }
                } else {
                  // Side images: start sliding in when middle image starts scaling down (stage 1)
                  if (animationStage < 1) {
                    opacity = 0;
                    if (position < 0) {
                      translateX = "-1000px";
                    } else if (position > 0) {
                      translateX = "1000px";
                    }
                  }
                }

                const transform = `translateX(${translateX}) translateY(${translateY}) rotate(${rotation}deg) scale(${scale})`;

                return (
                  <div
                    key={imageIndex}
                    className="flex-shrink-0 overflow-hidden shadow-lg absolute left-1/2 -translate-x-1/2"
                    style={{
                      width: widthStyle,
                      height: height,
                      borderRadius: "9999px 9999px 0 0",
                      transform: transform,
                      transformOrigin: "bottom center",
                      opacity: opacity,
                      transition: "all 0.8s ease-in-out",
                      pointerEvents: isVisible ? "auto" : "none",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Showcase ${imageIndex}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                );
              })}
            </div>

            {/* Left Arrow - Animated from bottom */}
            <button
              onClick={handlePrev}
              className="absolute left-35 bottom-12 z-30 bg-[#000000c5] hover:bg-[#000000db] p-4 rounded-full transition-all border border-black/20 cursor-pointer"
              style={{
                transform:
                  animationStage >= 2
                    ? "rotate(-8deg) translateY(0)"
                    : "rotate(-8deg) translateY(100px)",
                opacity: animationStage >= 2 ? 1 : 0,
                transition: "all 0.6s ease-out",
                transitionDelay: animationStage >= 2 ? "0.3s" : "0s",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft
                size={32}
                strokeWidth={2.5}
                className="text-[#d7d4d4]"
              />
            </button>

            {/* Right Arrow - Animated from bottom */}
            <button
              onClick={handleNext}
              className="absolute right-30 bottom-12 z-30 bg-[#000000c5] hover:bg-[#000000db] p-4 rounded-full transition-all border border-black/20 cursor-pointer"
              style={{
                transform:
                  animationStage >= 2
                    ? "rotate(8deg) translateY(0)"
                    : "rotate(8deg) translateY(100px)",
                opacity: animationStage >= 2 ? 1 : 0,
                transition: "all 0.6s ease-out",
                transitionDelay: animationStage >= 2 ? "0.4s" : "0s",
              }}
              aria-label="Next image"
            >
              <ChevronRight
                size={32}
                strokeWidth={2.5}
                className="text-[#d7d4d4]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
