"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Accordion states for filters
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    brand: true,
    other: true,
  });

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

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [
    searchQuery,
    selectedCategory,
    selectedSizes,
    priceRange,
    selectedColors,
    selectedBrands,
    sortBy,
    showNewArrivals,
    showOnSale,
  ]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
      if (selectedSizes.length > 0)
        params.append("sizes", selectedSizes.join(","));
      if (selectedColors.length > 0)
        params.append("colors", selectedColors.join(","));
      if (selectedBrands.length > 0)
        params.append("brands", selectedBrands.join(","));
      params.append("sortBy", sortBy);
      if (showNewArrivals) params.append("isTrending", "true");
      if (showOnSale) params.append("isFeatured", "true");

      const response = await fetch(`/api/products/public?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);

        // Extract unique brands
        const brands = [
          ...new Set(data.products.map((p: any) => p.brand).filter(Boolean)),
        ];
        setAvailableBrands(brands as string[]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const categories = [
    { value: "all", label: "All Items" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "unisex", label: "Unisex" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const colors = [
    { value: "black", label: "Black", hex: "#000000" },
    { value: "white", label: "White", hex: "#FFFFFF" },
    { value: "gray", label: "Gray", hex: "#9CA3AF" },
    { value: "blue", label: "Blue", hex: "#3B82F6" },
    { value: "red", label: "Red", hex: "#EF4444" },
    { value: "green", label: "Green", hex: "#10B981" },
    { value: "khaki", label: "Khaki", hex: "#C4B5A0" },
  ];

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSizes([]);
    setPriceRange([0, 5000]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSortBy("featured");
    setShowNewArrivals(false);
    setShowOnSale(false);
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    selectedBrands.length +
    (priceRange[0] !== 0 || priceRange[1] !== 5000 ? 1 : 0) +
    (showNewArrivals ? 1 : 0) +
    (showOnSale ? 1 : 0);

  return (
    <section ref={sectionRef} className="w-full py-20 px-10 bg-white">
      <div className="mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
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

        {/* Main Layout: Sidebar + Products */}
        <div className="flex gap-6">
          {/* LEFT SIDEBAR - FIXED/STICKY FILTERS */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24 bg-gray-50 rounded-2xl p-5 border border-gray-200 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              </div>

              {/* Clear All Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <X size={16} />
                  Clear All ({activeFiltersCount})
                </button>
              )}

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("category")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h4
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Category
                  </h4>
                  {expandedSections.category ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedSections.category && (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={selectedCategory === category.value}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                        <span
                          className="text-sm"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("price")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h4
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Price Range
                  </h4>
                  {expandedSections.price ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedSections.price && (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-black"
                    />
                    <div
                      className="flex items-center justify-between text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <span className="text-gray-600">0 ETB</span>
                      <span className="font-semibold">
                        {priceRange[1].toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("size")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h4
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Size
                  </h4>
                  {expandedSections.size ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedSections.size && (
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          selectedSizes.includes(size)
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:border-black"
                        }`}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("color")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h4
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Color
                  </h4>
                  {expandedSections.color ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedSections.color && (
                  <div className="flex flex-wrap gap-1.5">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => toggleColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColors.includes(color.value)
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
                        title={color.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <button
                  onClick={() => toggleSection("brand")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h4
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Brand
                  </h4>
                  {expandedSections.brand ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedSections.brand && (
                  <div className="space-y-2">
                    {availableBrands.length > 0 ? (
                      availableBrands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                          />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {brand}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No brands available
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Other Filters */}
              <div>
                <button
                  onClick={() => toggleSection("other")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h4
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Other Filters
                  </h4>
                  {expandedSections.other ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedSections.other && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showNewArrivals}
                        onChange={(e) => setShowNewArrivals(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      />
                      <span
                        className="text-sm"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        New Arrivals
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnSale}
                        onChange={(e) => setShowOnSale(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      />
                      <span
                        className="text-sm"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        On Sale
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PRODUCTS */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <p
                className="text-gray-600"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Showing {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {/* Product Grid */}
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : products.length > 0 ? (
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
            ) : (
              <div className="text-center py-20">
                <p
                  className="text-2xl text-gray-400 mb-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  No products found
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    sizes?: string[];
    colors?: string[];
    compareAtPrice?: number | null;
    brand?: string;
    seller?: {
      id: string;
      name: string;
      slug: string;
    };
    stock?: number;
  };
  index: number;
  isVisible: boolean;
}

function ProductCard({ product, index, isVisible }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get first available size or default to M
    const firstSize =
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M";

    // Get first available color or default to black
    const firstColor =
      product.colors && product.colors.length > 0 ? product.colors[0] : "black";

    addToCart({
      id: `${product.id}-${firstSize}-${firstColor}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: firstSize,
      color: firstColor,
      maxStock: product.stock || 10,
      sellerId: product.seller?.id || "unknown",
      sellerName: product.seller?.name || "Unknown Seller",
    });

    // Show success feedback
    alert(
      `✅ Added "${product.title}" to cart!\nSize: ${firstSize} • Color: ${firstColor}`,
    );
  };

  return (
    <Link href={`/product/${product.id}`}>
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
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Discount Badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              -
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100,
              )}
              %
            </div>
          )}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert("Wishlist feature coming soon!");
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-300 opacity-0 translate-x-5 scale-90 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className="text-gray-800" />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
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
            className="text-gray-900 font-semibold text-base mb-1 uppercase line-clamp-1"
            style={{
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            {product.title}
          </h3>
          <p
            className="text-gray-500 text-sm mb-2 line-clamp-1"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
            }}
          >
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className="text-black font-bold text-lg"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                }}
              >
                {product.price.toLocaleString()}{" "}
                <span className="text-sm font-normal">ETB</span>
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.compareAtPrice.toLocaleString()} ETB
                  </span>
                )}
            </div>

            {/* Size Indicator */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size) => (
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
            )}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="mt-3 h-0.5 bg-black rounded-full w-0 group-hover:w-full transition-all duration-400 ease-out" />
      </div>
    </Link>
  );
}
