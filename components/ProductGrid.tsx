"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import FilterSidebar from "./FilterSidebar";

interface ProductsCache {
  all: any[];
  men: any[];
  women: any[];
  unisex: any[];
  onSale: any[];
  newArrivals: any[];
  timestamp: number;
}

const CACHE_KEY = "yog_products_cache";
const CACHE_DURATION = 5 * 60 * 1000;

export default function ProductGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedClothingTypes, setSelectedClothingTypes] = useState<string[]>(
    [],
  ); // ✅ NEW
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]); // ✅ NEW
  const [sortBy, setSortBy] = useState("featured");
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);

  const [productsCache, setProductsCache] = useState<ProductsCache>({
    all: [],
    men: [],
    women: [],
    unisex: [],
    onSale: [],
    newArrivals: [],
    timestamp: 0,
  });

  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const hasFetchedRef = useRef(false);

  // ✅ UPDATED EXPANDED SECTIONS
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    clothingType: true,
    occasion: true,
    price: true,
    size: true,
    color: true,
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

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsed: ProductsCache = JSON.parse(cachedData);
          const cacheAge = Date.now() - parsed.timestamp;

          if (cacheAge < CACHE_DURATION) {
            console.log(
              `⚡ Using cached products (${Math.round(cacheAge / 1000)}s old)`,
            );
            setProductsCache(parsed);
            setDisplayedProducts(parsed.all);
            setIsLoadingProducts(false);

            if (cacheAge > 2 * 60 * 1000) {
              console.log("🔄 Refreshing cache in background...");
              preloadAllCategories(true);
            }
            return;
          }
        } catch (error) {
          console.error("Error parsing cache:", error);
        }
      }
    }

    preloadAllCategories(false);
  }, []);

  useEffect(() => {
    filterFromCache();
  }, [
    searchQuery,
    selectedCategory,
    selectedSizes,
    priceRange,
    selectedColors,
    selectedClothingTypes, // ✅ NEW
    selectedOccasions, // ✅ NEW
    sortBy,
    showNewArrivals,
    showOnSale,
    productsCache,
  ]);

  const preloadAllCategories = async (silent = false) => {
    if (!silent) setIsLoadingProducts(true);

    const startTime = performance.now();

    try {
      const [
        allProducts,
        menProducts,
        womenProducts,
        unisexProducts,
        onSaleProducts,
        newProducts,
      ] = await Promise.all([
        fetch("/api/products/public").then((res) => res.json()),
        fetch("/api/products/public?category=men").then((res) => res.json()),
        fetch("/api/products/public?category=women").then((res) => res.json()),
        fetch("/api/products/public?category=unisex").then((res) => res.json()),
        fetch("/api/products/public?isFeatured=true").then((res) => res.json()),
        fetch("/api/products/public?isTrending=true").then((res) => res.json()),
      ]);

      const endTime = performance.now();
      console.log(`✅ Fetched in ${(endTime - startTime).toFixed(0)}ms`);

      const cacheData: ProductsCache = {
        all: allProducts.products || [],
        men: menProducts.products || [],
        women: womenProducts.products || [],
        unisex: unisexProducts.products || [],
        onSale: onSaleProducts.products || [],
        newArrivals: newProducts.products || [],
        timestamp: Date.now(),
      };

      setProductsCache(cacheData);
      setDisplayedProducts(cacheData.all);

      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }

      if (!silent) {
        console.log("💾 Products cached");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      if (!silent) {
        setIsLoadingProducts(false);
      }
    }
  };

  const filterFromCache = () => {
    let filtered = [...productsCache.all];

    if (
      selectedCategory !== "all" &&
      !searchQuery &&
      selectedSizes.length === 0 &&
      selectedColors.length === 0 &&
      selectedClothingTypes.length === 0 &&
      selectedOccasions.length === 0 &&
      !showNewArrivals &&
      !showOnSale
    ) {
      filtered = [
        ...(productsCache[selectedCategory as keyof ProductsCache] as any[]),
      ];
    } else if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (showOnSale) filtered = filtered.filter((p) => p.onSale);
    if (showNewArrivals) filtered = filtered.filter((p) => p.newArrival);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes?.some((size: string) => selectedSizes.includes(size)),
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors?.some((color: string) =>
          selectedColors.includes(color.toLowerCase()),
        ),
      );
    }

    // ✅ NEW: FILTER BY CLOTHING TYPE
    if (selectedClothingTypes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedClothingTypes.includes(p.clothingType),
      );
    }

    // ✅ NEW: FILTER BY OCCASION
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter((p) => selectedOccasions.includes(p.occasion));
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setDisplayedProducts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSizes([]);
    setPriceRange([0, 10000]);
    setSelectedColors([]);
    setSelectedClothingTypes([]); // ✅ NEW
    setSelectedOccasions([]); // ✅ NEW
    setSortBy("featured");
    setShowNewArrivals(false);
    setShowOnSale(false);
  };

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

  // ✅ NEW: TOGGLE CLOTHING TYPE
  const toggleClothingType = (type: string) => {
    setSelectedClothingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // ✅ NEW: TOGGLE OCCASION
  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((o) => o !== occasion)
        : [...prev, occasion],
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ✅ UPDATED: ACTIVE FILTERS COUNT
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    selectedClothingTypes.length +
    selectedOccasions.length +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0) +
    (showNewArrivals ? 1 : 0) +
    (showOnSale ? 1 : 0);

  return (
    <section ref={sectionRef} className="w-full py-20 px-10 bg-white">
      <div className="mx-auto">
        {/* Header */}
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

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedSizes={selectedSizes}
            priceRange={priceRange}
            selectedColors={selectedColors}
            selectedClothingTypes={selectedClothingTypes} // ✅ NEW
            selectedOccasions={selectedOccasions} // ✅ NEW
            showNewArrivals={showNewArrivals}
            showOnSale={showOnSale}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onSizeToggle={toggleSize}
            onPriceChange={setPriceRange}
            onColorToggle={toggleColor}
            onClothingTypeToggle={toggleClothingType} // ✅ NEW
            onOccasionToggle={toggleOccasion} // ✅ NEW
            onNewArrivalsChange={setShowNewArrivals}
            onSaleChange={setShowOnSale}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />

          {/* Products */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <p
                className="text-gray-600"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Showing {displayedProducts.length}{" "}
                {displayedProducts.length === 1 ? "product" : "products"}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} className="relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="relative bg-gray-200 rounded-2xl overflow-hidden mb-4 aspect-[3/4]" />
                    <div className="px-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-5 bg-gray-200 rounded w-24" />
                        <div className="flex gap-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full" />
                          <div className="w-6 h-6 bg-gray-200 rounded-full" />
                          <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {displayedProducts.map((product, index) => (
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
                <p className="text-2xl text-gray-400 mb-4">No products found</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
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

function ProductCard({ product, index, isVisible }: any) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false); // ✅ ADD HOVER STATE

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const firstSize = product.sizes?.[0] || "M";
    const firstColor = product.colors?.[0] || "black";

    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: firstSize,
      color: firstColor,
      quantity: 1,
      maxStock: product.stock || 10,
      sellerId: product.seller?.id || "unknown",
      sellerName: product.seller?.name || "Unknown Seller",
    });

    alert(`✅ Added "${product.title}" to cart!`);
  };

  // ✅ GET IMAGES - Handle both formats
  const allImages = product.allImages || []; // Array of all image URLs
  const primaryImage = allImages[0] || product.image || "";
  const secondaryImage = allImages[1] || primaryImage;
  const hasMultipleImages = secondaryImage && secondaryImage !== primaryImage;

  console.log("Product images:", {
    allImages,
    primaryImage,
    secondaryImage,
    hasMultipleImages,
  }); // DEBUG

  return (
    <a href={`/product/${product.id}`} className="block">
      <div
        className="group relative cursor-pointer will-change-transform"
        onMouseEnter={() => setIsHovered(true)} // ✅ SET HOVER
        onMouseLeave={() => setIsHovered(false)} // ✅ UNSET HOVER
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
          transition: `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
        }}
      >
        <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4 aspect-[3/4]">
          {/* ✅ PRIMARY IMAGE (ALWAYS VISIBLE) */}
          <img
            src={primaryImage}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered && hasMultipleImages ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
          />

          {/* ✅ SECONDARY IMAGE (SHOWS ON HOVER) */}
          {hasMultipleImages && (
            <img
              src={secondaryImage}
              alt={`${product.title} - alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          )}

          {/* Discount Badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold z-10">
              -
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100,
              )}
              %
            </div>
          )}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert("Wishlist feature coming soon!");
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-300 opacity-0 translate-x-5 scale-90 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 z-10"
          >
            <Heart size={18} className="text-gray-800" />
          </button>

          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-full font-semibold text-sm uppercase flex items-center justify-center gap-2 hover:bg-gray-900 transition-all duration-300 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 z-10"
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

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size: string) => (
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

        <div className="mt-3 h-0.5 bg-black rounded-full w-0 group-hover:w-full transition-all duration-400 ease-out" />
      </div>
    </a>
  );
}
