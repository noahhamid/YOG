"use client";

import { useState } from "react";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  MessageCircle,
  Store,
  Check,
  Clock,
  Package,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  // Complete products database matching the ProductGrid
  const allProducts = [
    {
      id: 1,
      title: "Essential White Tee",
      brand: "UrbanStyle Co.",
      price: 800,
      originalPrice: 1000,
      discount: 20,
      rating: 4.5,
      reviewCount: 234,
      sold: 890,
      inStock: true,
      stockCount: 25,
      images: [
        "https://i.pinimg.com/1200x/6c/29/4d/6c294de767f1fc184ae4591d38662b49.jpg",
        "https://i.pinimg.com/736x/4f/99/be/4f99be2e372c30cf87d9a16d1f5b209a.jpg",
        "https://i.pinimg.com/1200x/2e/da/3d/2eda3de39d654180908f3d87590ceb1b.jpg",
        "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
      ],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
      ],
      description:
        "Premium organic cotton essential tee. Soft, breathable, and perfect for everyday wear. Classic fit that never goes out of style.",
      features: [
        "100% Organic Cotton",
        "Breathable Fabric",
        "Classic Fit",
        "Reinforced Stitching",
        "Pre-shrunk",
      ],
      specifications: {
        Material: "100% Organic Cotton",
        Weight: "180 GSM",
        Fit: "Classic",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 2,
      title: "Denim Jacket",
      brand: "UrbanStyle Co.",
      price: 2500,
      originalPrice: 3000,
      discount: 17,
      rating: 4.8,
      reviewCount: 256,
      sold: 890,
      inStock: true,
      stockCount: 8,
      images: [
        "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
        "https://i.pinimg.com/1200x/6c/29/4d/6c294de767f1fc184ae4591d38662b49.jpg",
        "https://i.pinimg.com/736x/4f/99/be/4f99be2e372c30cf87d9a16d1f5b209a.jpg",
        "https://i.pinimg.com/736x/ba/2e/de/ba2ede82049f540aace10180acfbd8fa.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: false },
      ],
      colors: [
        { name: "Blue", value: "blue", hex: "#3B82F6" },
        { name: "Black", value: "black", hex: "#000000" },
      ],
      description:
        "Classic denim jacket with a modern streetwear twist. Premium denim fabric with comfortable fit. Perfect for layering.",
      features: [
        "Premium Denim Fabric",
        "Classic Button Closure",
        "Chest Pockets",
        "Adjustable Cuffs",
        "Versatile Design",
      ],
      specifications: {
        Material: "100% Cotton Denim",
        Weight: "12 oz",
        Fit: "Regular",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 3,
      title: "Utility Cargo",
      brand: "UrbanStyle Co.",
      price: 1800,
      originalPrice: 2200,
      discount: 18,
      rating: 4.2,
      reviewCount: 189,
      sold: 567,
      inStock: true,
      stockCount: 22,
      images: [
        "https://i.pinimg.com/736x/d1/7c/8d/d17c8d81022342185ae929271704f535.jpg",
        "https://i.pinimg.com/1200x/8b/e0/3c/8be03c3124b1ebb3a262357a00b87e5d.jpg",
        "https://i.pinimg.com/736x/6f/d7/6b/6fd76b54f6135a206f407700b0ca74b1.jpg",
        "https://i.pinimg.com/1200x/ed/73/47/ed73471bd6bc58afbf67fd11d1de9536.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
        { value: "XXL", available: true },
      ],
      colors: [
        { name: "Khaki", value: "khaki", hex: "#C4B5A0" },
        { name: "Black", value: "black", hex: "#000000" },
      ],
      description:
        "Urban comfort meets functionality. Multiple pockets, durable fabric, and relaxed fit for everyday wear.",
      features: [
        "Multiple Cargo Pockets",
        "Durable Ripstop Fabric",
        "Adjustable Waist",
        "Reinforced Knees",
        "Relaxed Fit",
      ],
      specifications: {
        Material: "65% Cotton, 35% Polyester",
        Weight: "280 GSM",
        Fit: "Relaxed",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 4,
      title: "Oversized Hoodie",
      brand: "UrbanStyle Co.",
      price: 1500,
      originalPrice: 2000,
      discount: 25,
      rating: 4.7,
      reviewCount: 342,
      sold: 1240,
      inStock: true,
      stockCount: 15,
      images: [
        "https://i.pinimg.com/1200x/2e/da/3d/2eda3de39d654180908f3d87590ceb1b.jpg",
        "https://i.pinimg.com/736x/ba/2e/de/ba2ede82049f540aace10180acfbd8fa.jpg",
        "https://i.pinimg.com/1200x/56/b5/02/56b502ad1ab836436d590dc8895ac511.jpg",
        "https://i.pinimg.com/736x/d1/7c/8d/d17c8d81022342185ae929271704f535.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
        { value: "XXL", available: false },
      ],
      colors: [
        { name: "Gray", value: "gray", hex: "#9CA3AF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "White", value: "white", hex: "#FFFFFF" },
      ],
      description:
        "Premium oversized hoodie made from organic cotton. Soft fleece interior, adjustable hood. Perfect for casual wear.",
      features: [
        "100% Organic Cotton",
        "Soft Fleece Interior",
        "Adjustable Drawstring Hood",
        "Kangaroo Pocket",
        "Oversized Fit",
      ],
      specifications: {
        Material: "100% Organic Cotton",
        Weight: "400 GSM",
        Fit: "Oversized",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 5,
      title: "Slim Joggers",
      brand: "UrbanStyle Co.",
      price: 1200,
      originalPrice: 1500,
      discount: 20,
      rating: 4.4,
      reviewCount: 198,
      sold: 678,
      inStock: true,
      stockCount: 18,
      images: [
        "https://i.pinimg.com/1200x/ed/73/47/ed73471bd6bc58afbf67fd11d1de9536.jpg",
        "https://i.pinimg.com/736x/6f/d7/6b/6fd76b54f6135a206f407700b0ca74b1.jpg",
        "https://i.pinimg.com/1200x/8b/e0/3c/8be03c3124b1ebb3a262357a00b87e5d.jpg",
        "https://i.pinimg.com/736x/d1/7c/8d/d17c8d81022342185ae929271704f535.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
      ],
      colors: [
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#9CA3AF" },
      ],
      description:
        "Athletic style joggers with slim fit. Perfect blend of comfort and style for active lifestyle.",
      features: [
        "Elastic Waistband",
        "Tapered Fit",
        "Side Pockets",
        "Ankle Zippers",
        "Breathable Fabric",
      ],
      specifications: {
        Material: "80% Cotton, 20% Polyester",
        Weight: "300 GSM",
        Fit: "Slim Tapered",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 6,
      title: "Graphic Tee",
      brand: "UrbanStyle Co.",
      price: 900,
      originalPrice: 1200,
      discount: 25,
      rating: 4.6,
      reviewCount: 445,
      sold: 1567,
      inStock: true,
      stockCount: 30,
      images: [
        "https://i.pinimg.com/736x/4f/99/be/4f99be2e372c30cf87d9a16d1f5b209a.jpg",
        "https://i.pinimg.com/1200x/6c/29/4d/6c294de767f1fc184ae4591d38662b49.jpg",
        "https://i.pinimg.com/1200x/2e/da/3d/2eda3de39d654180908f3d87590ceb1b.jpg",
        "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
      ],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
      ],
      description:
        "Statement graphic tee with unique design. Premium cotton fabric and bold prints make this a wardrobe essential.",
      features: [
        "Premium Cotton",
        "Unique Graphics",
        "Regular Fit",
        "Durable Print",
        "Comfortable",
      ],
      specifications: {
        Material: "100% Cotton",
        Weight: "200 GSM",
        Fit: "Regular",
        Care: "Machine wash cold, inside out",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 7,
      title: "Bomber Jacket",
      brand: "UrbanStyle Co.",
      price: 2800,
      originalPrice: 3500,
      discount: 20,
      rating: 4.9,
      reviewCount: 312,
      sold: 456,
      inStock: true,
      stockCount: 6,
      images: [
        "https://i.pinimg.com/736x/ba/2e/de/ba2ede82049f540aace10180acfbd8fa.jpg",
        "https://i.pinimg.com/1200x/2e/da/3d/2eda3de39d654180908f3d87590ceb1b.jpg",
        "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
        "https://i.pinimg.com/1200x/56/b5/02/56b502ad1ab836436d590dc8895ac511.jpg",
      ],
      sizes: [
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
      ],
      colors: [
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Green", value: "green", hex: "#10B981" },
      ],
      description:
        "Aviation-inspired bomber jacket with premium construction. Lightweight yet warm, perfect for layering.",
      features: [
        "Ribbed Collar & Cuffs",
        "Zip Pockets",
        "Lightweight Padding",
        "Water Resistant",
        "Classic Design",
      ],
      specifications: {
        Material: "Nylon Shell, Polyester Lining",
        Weight: "350 GSM",
        Fit: "Regular",
        Care: "Dry clean recommended",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 8,
      title: "Track Pants",
      brand: "UrbanStyle Co.",
      price: 1400,
      originalPrice: 1800,
      discount: 22,
      rating: 4.3,
      reviewCount: 267,
      sold: 789,
      inStock: true,
      stockCount: 14,
      images: [
        "https://i.pinimg.com/736x/6f/d7/6b/6fd76b54f6135a206f407700b0ca74b1.jpg",
        "https://i.pinimg.com/1200x/ed/73/47/ed73471bd6bc58afbf67fd11d1de9536.jpg",
        "https://i.pinimg.com/1200x/8b/e0/3c/8be03c3124b1ebb3a262357a00b87e5d.jpg",
        "https://i.pinimg.com/736x/d1/7c/8d/d17c8d81022342185ae929271704f535.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
      ],
      colors: [
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Blue", value: "blue", hex: "#3B82F6" },
      ],
      description:
        "Retro athletic track pants with modern updates. Side stripes and comfortable fit for sports or casual wear.",
      features: [
        "Side Stripe Detail",
        "Elastic Waistband",
        "Zip Pockets",
        "Tapered Leg",
        "Breathable",
      ],
      specifications: {
        Material: "70% Polyester, 30% Cotton",
        Weight: "250 GSM",
        Fit: "Athletic",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 9,
      title: "Flannel Shirt",
      brand: "UrbanStyle Co.",
      price: 1600,
      originalPrice: 2000,
      discount: 20,
      rating: 4.5,
      reviewCount: 223,
      sold: 534,
      inStock: true,
      stockCount: 12,
      images: [
        "https://i.pinimg.com/1200x/56/b5/02/56b502ad1ab836436d590dc8895ac511.jpg",
        "https://i.pinimg.com/736x/ba/2e/de/ba2ede82049f540aace10180acfbd8fa.jpg",
        "https://i.pinimg.com/1200x/2e/da/3d/2eda3de39d654180908f3d87590ceb1b.jpg",
        "https://i.pinimg.com/736x/1b/7a/71/1b7a7199025f67791606841333ef70f5.jpg",
      ],
      sizes: [
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
      ],
      colors: [
        { name: "Red", value: "red", hex: "#EF4444" },
        { name: "Blue", value: "blue", hex: "#3B82F6" },
      ],
      description:
        "Classic flannel shirt perfect for casual layering. Soft brushed cotton with timeless plaid pattern.",
      features: [
        "Brushed Cotton",
        "Button-Down Collar",
        "Chest Pockets",
        "Classic Plaid",
        "Comfortable Fit",
      ],
      specifications: {
        Material: "100% Cotton Flannel",
        Weight: "220 GSM",
        Fit: "Regular",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
    {
      id: 10,
      title: "Baggy Jeans",
      brand: "UrbanStyle Co.",
      price: 2000,
      originalPrice: 2500,
      discount: 20,
      rating: 4.7,
      reviewCount: 398,
      sold: 923,
      inStock: true,
      stockCount: 16,
      images: [
        "https://i.pinimg.com/1200x/8b/e0/3c/8be03c3124b1ebb3a262357a00b87e5d.jpg",
        "https://i.pinimg.com/736x/d1/7c/8d/d17c8d81022342185ae929271704f535.jpg",
        "https://i.pinimg.com/736x/6f/d7/6b/6fd76b54f6135a206f407700b0ca74b1.jpg",
        "https://i.pinimg.com/1200x/ed/73/47/ed73471bd6bc58afbf67fd11d1de9536.jpg",
      ],
      sizes: [
        { value: "S", available: true },
        { value: "M", available: true },
        { value: "L", available: true },
        { value: "XL", available: true },
        { value: "XXL", available: true },
      ],
      colors: [
        { name: "Blue", value: "blue", hex: "#3B82F6" },
        { name: "Black", value: "black", hex: "#000000" },
      ],
      description:
        "Modern baggy jeans with relaxed fit. Premium denim with comfortable wide-leg cut for contemporary style.",
      features: [
        "Wide Leg Cut",
        "Premium Denim",
        "5-Pocket Design",
        "Belt Loops",
        "Relaxed Fit",
      ],
      specifications: {
        Material: "100% Cotton Denim",
        Weight: "14 oz",
        Fit: "Baggy/Relaxed",
        Care: "Machine wash cold",
        Origin: "Made in Ethiopia",
      },
    },
  ];

  // Find the current product by ID
  const product =
    allProducts.find((p) => p.id === parseInt(productId)) || allProducts[0];

  // Set default color when component mounts
  useState(() => {
    if (product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].value);
    }
  });

  const seller = {
    name: "UrbanStyle Official Store",
    rating: 4.8,
    responseRate: 98,
    responseTime: "within hours",
    followers: 12400,
    verified: true,
    joinedDate: "2022",
  };

  const delivery = {
    standard: { days: "3-5", price: 50 },
    express: { days: "1-2", price: 150 },
    freeShippingThreshold: 2000,
  };

  const reviews = [
    {
      id: 1,
      user: "Abebe K.",
      rating: 5,
      date: "2 days ago",
      comment: "Amazing quality! The fabric is so soft and the fit is perfect.",
      verified: true,
      helpful: 24,
    },
    {
      id: 2,
      user: "Sara M.",
      rating: 4,
      date: "1 week ago",
      comment:
        "Good product but runs a bit large. Size down if you want a regular fit.",
      verified: true,
      helpful: 15,
    },
  ];

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const totalPrice = product.price * quantity;
  const deliveryFee =
    totalPrice >= delivery.freeShippingThreshold ? 0 : delivery.standard.price;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={18} />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={18}
                className={isFavorite ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="space-y-3">
            {/* Main Image with Zoom */}
            <div
              className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
              onMouseEnter={() => !isHoveringControls && setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <div
                className={`w-full h-full transition-transform duration-100 ease-out ${isZoomed && !isHoveringControls ? "scale-150" : "scale-100"}`}
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  cursor:
                    isZoomed && !isHoveringControls ? "zoom-out" : "zoom-in",
                  pointerEvents: isHoveringControls ? "none" : "auto",
                }}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold z-10">
                  -{product.discount}%
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onMouseEnter={() => {
                      setIsHoveringControls(true);
                      setIsZoomed(false);
                    }}
                    onMouseLeave={() => setIsHoveringControls(false)}
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:bg-white transition-all z-20"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onMouseEnter={() => {
                      setIsHoveringControls(true);
                      setIsZoomed(false);
                    }}
                    onMouseLeave={() => setIsHoveringControls(false)}
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:bg-white transition-all z-20"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div
                className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs z-10"
                onMouseEnter={() => {
                  setIsHoveringControls(true);
                  setIsZoomed(false);
                }}
                onMouseLeave={() => setIsHoveringControls(false)}
              >
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-4">
            {/* Brand & Title */}
            <div>
              <p
                className="text-gray-600 text-xs mb-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {product.brand}
              </p>
              <h1
                className="text-2xl font-bold text-gray-900 mb-1.5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-600">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="text-gray-600">{product.sold} sold</div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {product.price.toLocaleString()} ETB
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()} ETB
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stockCount} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <h3
                className="font-semibold mb-2 text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Color:{" "}
                <span className="text-gray-600 font-normal">
                  {product.colors.find((c) => c.value === selectedColor)
                    ?.name || "Select"}
                </span>
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? "border-black scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      boxShadow:
                        color.hex === "#FFFFFF"
                          ? "inset 0 0 0 1px #e5e7eb"
                          : "none",
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3
                className="font-semibold mb-2 text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Size:{" "}
                <span className="text-gray-600 font-normal">
                  {selectedSize || "Select a size"}
                </span>
              </h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() =>
                      size.available && setSelectedSize(size.value)
                    }
                    disabled={!size.available}
                    className={`px-5 py-2 rounded-full border-2 font-medium transition-all text-sm ${
                      selectedSize === size.value
                        ? "bg-black text-white border-black"
                        : size.available
                          ? "border-gray-300 hover:border-black"
                          : "border-gray-200 text-gray-300 cursor-not-allowed"
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3
                className="font-semibold mb-2 text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Quantity
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border-2 border-gray-300 rounded-full hover:border-black transition-colors flex items-center justify-center font-bold text-sm"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stockCount, quantity + 1))
                  }
                  className="w-8 h-8 border-2 border-gray-300 rounded-full hover:border-black transition-colors flex items-center justify-center font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                disabled={!selectedSize}
              >
                <Package size={18} />
                Order Now
              </button>
              <button
                className="w-full border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <MessageCircle size={18} />
                Contact Seller
              </button>
            </div>

            {/* Payment Options */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CreditCard
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={22}
                />
                <div>
                  <p
                    className="font-semibold text-green-900 mb-1 text-base"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Pay on Delivery Available
                  </p>
                  <p className="text-sm text-green-700">
                    Cash payment when your order arrives. Inspect before paying.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h3
                className="font-semibold flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Truck size={20} />
                Delivery & Returns
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Clock
                    className="text-gray-400 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <div>
                    <p className="font-medium">
                      Standard Delivery: {delivery.standard.days} business days
                    </p>
                    <p className="text-gray-600">
                      {delivery.standard.price} ETB
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock
                    className="text-gray-400 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <div>
                    <p className="font-medium">
                      Express Delivery: {delivery.express.days} business days
                    </p>
                    <p className="text-gray-600">
                      {delivery.express.price} ETB
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck
                    className="text-green-600 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <p>
                    <span className="font-medium text-green-600">
                      Free delivery
                    </span>{" "}
                    on orders above{" "}
                    {delivery.freeShippingThreshold.toLocaleString()} ETB
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <RefreshCw
                    className="text-gray-400 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <p>7-day return policy for unused items</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Shield className="mx-auto mb-2 text-gray-700" size={24} />
                <p className="text-xs font-medium text-gray-700">
                  Secure Payment
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Check className="mx-auto mb-2 text-gray-700" size={24} />
                <p className="text-xs font-medium text-gray-700">
                  Verified Products
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <RefreshCw className="mx-auto mb-2 text-gray-700" size={24} />
                <p className="text-xs font-medium text-gray-700">
                  Easy Returns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto">
              {["description", "specifications", "seller", "reviews"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-semibold capitalize transition-colors relative whitespace-nowrap text-sm ${
                      activeTab === tab
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="max-w-3xl space-y-4">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {product.description}
                </p>
                <div>
                  <h4
                    className="font-semibold mb-2 text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Key Features:
                  </h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check
                          className="text-green-600 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-3xl">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value], index) => (
                        <tr
                          key={key}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td
                            className="px-3 py-2 font-semibold text-gray-900"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {key}
                          </td>
                          <td className="px-3 py-2 text-gray-700">{value}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "seller" && (
              <div className="max-w-3xl">
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Store size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3
                            className="text-lg font-bold"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {seller.name}
                          </h3>
                          {seller.verified && (
                            <div className="bg-blue-500 text-white p-0.5 rounded-full">
                              <Check size={10} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">
                            {seller.rating}
                          </span>
                          <span className="text-gray-600 text-xs">
                            Store Rating
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Joined {seller.joinedDate} ·{" "}
                          {seller.followers.toLocaleString()} followers
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 border-2 border-black rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm">
                      Follow
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">
                        Response Rate
                      </p>
                      <p className="text-lg font-bold">
                        {seller.responseRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">
                        Response Time
                      </p>
                      <p className="text-lg font-bold capitalize">
                        {seller.responseTime}
                      </p>
                    </div>
                  </div>

                  <button className="w-full bg-black text-white py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm">
                    <MessageCircle size={16} />
                    Chat with Seller
                  </button>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-4xl font-bold">
                        {product.rating}
                      </span>
                      <div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Based on {product.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 border-2 border-black rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm">
                    Write Review
                  </button>
                </div>

                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-sm">
                              {review.user}
                            </p>
                            {review.verified && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 text-sm">
                        {review.comment}
                      </p>
                      <button className="text-xs text-gray-600 hover:text-black">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-10">
          <h2
            className="text-xl font-bold mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(`/product/${item.id}`);
                  setCurrentImageIndex(0);
                  setSelectedSize("");
                  setSelectedColor(item.colors[0]?.value || "");
                  window.scrollTo(0, 0);
                }}
                className="group cursor-pointer text-left"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3
                  className="font-semibold mb-0.5 text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">
                    {item.price.toLocaleString()} ETB
                  </p>
                  <div className="flex items-center gap-0.5 text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:hidden z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Total Price</p>
            <p className="text-lg font-bold">
              {totalPrice.toLocaleString()} ETB
            </p>
          </div>
          <button
            className="flex-1 bg-black text-white py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            disabled={!selectedSize}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
