import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import ProductGrid from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Background Effects */}
      <main className="relative bg-gradient-to-b from-gray-400 via-gray-300 to-white mt-5 mx-5 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
          {/* Left diagonal lines */}
          <div
            className="absolute top-1/3 left-0 w-full h-[1px] bg-black origin-left"
            style={{ transform: "rotate(-15deg)", transformOrigin: "50% 50%" }}
          />
          <div
            className="absolute top-1/2 left-0 w-full h-[1px] bg-black origin-left"
            style={{ transform: "rotate(-10deg)", transformOrigin: "50% 50%" }}
          />
          <div
            className="absolute top-2/3 left-0 w-full h-[1px] bg-black origin-left"
            style={{ transform: "rotate(-5deg)", transformOrigin: "50% 50%" }}
          />

          {/* Right diagonal lines */}
          <div
            className="absolute top-1/3 left-0 w-full h-[1px] bg-black origin-right"
            style={{ transform: "rotate(15deg)", transformOrigin: "50% 50%" }}
          />
          <div
            className="absolute top-1/2 left-0 w-full h-[1px] bg-black origin-right"
            style={{ transform: "rotate(10deg)", transformOrigin: "50% 50%" }}
          />
          <div
            className="absolute top-2/3 left-0 w-full h-[1px] bg-black origin-right"
            style={{ transform: "rotate(5deg)", transformOrigin: "50% 50%" }}
          />
        </div>

        {/* Floating Gradient Orbs */}
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />

        {/* Subtle Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Radial Gradient Overlay - darker at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-500/20 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <Home />
        </div>
      </main>

      {/* Shop By Style Section - Outside the gradient background */}
      <ProductGrid />
    </>
  );
}
