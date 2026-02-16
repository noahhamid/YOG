"use client";
import { X } from "lucide-react";

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
import Link from "next/link";

interface ProductDetailClientProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    discount: number;
    brand: string;
    images: string[];
    sizes: Array<{ value: string; available: boolean }>;
    colors: Array<{ name: string; value: string; hex: string }>;
    variants: Array<{
      size: string;
      color: string;
      quantity: number;
      available: boolean;
    }>;
    totalStock: number;
    inStock: boolean;
    rating: number;
    reviewCount: number;
    sold: number;
    seller: {
      id: string;
      name: string;
      slug: string | null;
      verified: boolean;
      followers: number;
      location: string;
      instagram: string | null;
      rating: number;
      responseRate: number;
      responseTime: string;
      joinedDate: string;
    };
  };
  relatedProducts: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    images: string[];
    rating: number;
  }>;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.value || "",
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    deliveryMethod: "delivery",
    address: "",
  });

  const delivery = {
    standard: { days: "3-5", price: 50 },
    express: { days: "1-2", price: 150 },
    freeShippingThreshold: 2000,
  };

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

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    // Here you would typically send the order to your API
    alert(
      `Order placed!\nProduct: ${product.title}\nSize: ${selectedSize}\nColor: ${selectedColor}\nQuantity: ${quantity}\nName: ${orderForm.name}\nPhone: ${orderForm.phone}\nMethod: ${orderForm.deliveryMethod}\n${orderForm.deliveryMethod === "delivery" ? `Address: ${orderForm.address}` : "Meet-up location will be confirmed"}`,
    );

    setShowOrderModal(false);
    setOrderForm({
      name: "",
      phone: "",
      deliveryMethod: "delivery",
      address: "",
    });
  };

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
            {/* Seller Info - Prominent */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center shadow-md">
                    <Store size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3
                        className="font-bold text-base"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {product.seller.name}
                      </h3>
                      {product.seller.verified && (
                        <div className="bg-blue-500 text-white p-1 rounded-full">
                          <Check size={10} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">
                        {product.seller.rating}
                      </span>
                      <span className="text-gray-600 text-xs">
                        Store Rating
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Joined {product.seller.joinedDate} ·{" "}
                      {product.seller.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                {product.seller.slug && (
                  <Link href={`/store/${product.seller.slug}`}>
                    <button
                      className="px-4 py-1.5 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-white transition-all text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      View Store
                    </button>
                  </Link>
                )}
              </div>
            </div>

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
                {product.sold > 0 && (
                  <div className="text-gray-600">{product.sold} sold</div>
                )}
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
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.compareAtPrice.toLocaleString()} ETB
                  </span>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    In Stock ({product.totalStock} available)
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
            {product.colors.length > 0 && (
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
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
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
            )}

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
                    setQuantity(Math.min(product.totalStock, quantity + 1))
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
                onClick={() => setShowOrderModal(true)}
                disabled={!product.inStock || !selectedSize}
                className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
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
              {["description", "seller"].map((tab) => (
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
              ))}
            </div>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {product.description}
                </p>
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
                            {product.seller.name}
                          </h3>
                          {product.seller.verified && (
                            <div className="bg-blue-500 text-white p-0.5 rounded-full">
                              <Check size={10} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">
                            {product.seller.rating}
                          </span>
                          <span className="text-gray-600 text-xs">
                            Store Rating
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Joined {product.seller.joinedDate} ·{" "}
                          {product.seller.followers.toLocaleString()} followers
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          📍 {product.seller.location}
                        </p>
                      </div>
                    </div>
                    {product.seller.slug && (
                      <Link href={`/store/${product.seller.slug}`}>
                        <button className="px-4 py-1.5 border-2 border-black rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm">
                          Visit Store
                        </button>
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">
                        Response Rate
                      </p>
                      <p className="text-lg font-bold">
                        {product.seller.responseRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">
                        Response Time
                      </p>
                      <p className="text-lg font-bold capitalize">
                        {product.seller.responseTime}
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
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={item.images[0] || "https://via.placeholder.com/400"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3
                    className="font-semibold mb-0.5 text-sm line-clamp-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="font-bold text-sm">
                        {item.price.toLocaleString()} ETB
                      </p>
                      {item.compareAtPrice &&
                        item.compareAtPrice > item.price && (
                          <p className="text-xs text-gray-400 line-through">
                            {item.compareAtPrice.toLocaleString()} ETB
                          </p>
                        )}
                    </div>
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Place Order
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex gap-3">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {selectedSize && `Size: ${selectedSize}`}
                    {selectedSize && selectedColor && " • "}
                    {selectedColor &&
                      `Color: ${product.colors.find((c) => c.value === selectedColor)?.name}`}
                  </p>
                  <p className="font-bold">
                    {(product.price * quantity).toLocaleString()} ETB
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={orderForm.name}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>

              {/* Phone Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={orderForm.phone}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, phone: e.target.value })
                  }
                  placeholder="+251 9XX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>

              {/* Delivery Method */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setOrderForm({ ...orderForm, deliveryMethod: "delivery" })
                    }
                    className={`p-4 border-2 rounded-lg transition-all ${
                      orderForm.deliveryMethod === "delivery"
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Truck className="mx-auto mb-2" size={24} />
                    <p className="font-semibold text-sm">Delivery</p>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOrderForm({ ...orderForm, deliveryMethod: "meetup" })
                    }
                    className={`p-4 border-2 rounded-lg transition-all ${
                      orderForm.deliveryMethod === "meetup"
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Store className="mx-auto mb-2" size={24} />
                    <p className="font-semibold text-sm">Meet-up</p>
                  </button>
                </div>
              </div>

              {/* Address (only for delivery) */}
              {orderForm.deliveryMethod === "delivery" && (
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Delivery Address
                  </label>
                  <textarea
                    required
                    value={orderForm.address}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, address: e.target.value })
                    }
                    placeholder="Enter your full address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-all"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Submit Order
              </button>

              <p className="text-xs text-gray-600 text-center">
                No payment required now. Pay when you receive your order.
              </p>
            </form>
          </div>
        </div>
      )}

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
            onClick={() => setShowOrderModal(true)}
            disabled={!product.inStock || !selectedSize}
            className="flex-1 bg-black text-white py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm disabled:bg-gray-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
