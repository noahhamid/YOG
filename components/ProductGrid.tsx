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
  trending: any[];
  timestamp: number;
  productCount: number;
}

const CACHE_KEY = "yog_products_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const AUTO_REFRESH_INTERVAL = 3 * 60 * 1000; // ✅ 3 MINUTES AUTO-REFRESH

interface ProductGridProps {
  initialCategory?: string;
  showTrendingOnly?: boolean;
}

export default function ProductGrid({
  initialCategory = "all",
  showTrendingOnly = false,
}: ProductGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedClothingTypes, setSelectedClothingTypes] = useState<string[]>(
    [],
  );
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
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
    trending: [],
    timestamp: 0,
    productCount: 0,
  });

  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const hasFetchedRef = useRef(false);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null); // ✅ TRACK INTERVAL

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

  // ✅ INITIAL LOAD + SETUP AUTO-REFRESH
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

            if (showTrendingOnly) {
              setDisplayedProducts(parsed.trending);
            } else if (initialCategory === "all") {
              setDisplayedProducts(parsed.all);
            } else {
              setDisplayedProducts(
                (parsed[initialCategory as keyof ProductsCache] as any[]) || [],
              );
            }

            setIsLoadingProducts(false);

            // ✅ CHECK FOR NEW PRODUCTS IMMEDIATELY
            checkForNewProducts(parsed.productCount);

            // ✅ SETUP AUTO-REFRESH EVERY 3 MINUTES
            autoRefreshIntervalRef.current = setInterval(() => {
              console.log("🔄 Auto-refresh: Checking for new products...");
              checkForNewProducts(parsed.productCount);
            }, AUTO_REFRESH_INTERVAL);

            return;
          } else {
            console.log("🕐 Cache expired, fetching fresh data...");
          }
        } catch (error) {
          console.error("Error parsing cache:", error);
        }
      }
    }

    preloadAllCategories(false);

    // ✅ CLEANUP INTERVAL ON UNMOUNT
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    filterFromCache();
  }, [
    searchQuery,
    selectedCategory,
    selectedSizes,
    priceRange,
    selectedColors,
    selectedClothingTypes,
    selectedOccasions,
    sortBy,
    showNewArrivals,
    showOnSale,
    productsCache,
  ]);

  // ✅ CHECK FOR NEW PRODUCTS (SILENT)
  const checkForNewProducts = async (cachedCount: number) => {
    try {
      const res = await fetch("/api/products/public");
      const data = await res.json();
      const currentCount = data.products?.length || 0;

      if (currentCount !== cachedCount) {
        console.log(
          `🔔 New products detected! (${cachedCount} → ${currentCount})`,
        );
        console.log("🗑️ Invalidating cache and refreshing...");
        localStorage.removeItem(CACHE_KEY);

        // ✅ REFRESH SILENTLY WITHOUT LOADING SPINNER
        await preloadAllCategories(true);
      }
    } catch (error) {
      console.error("Error checking for new products:", error);
    }
  };

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
        trendingProducts,
      ] = await Promise.all([
        fetch("/api/products/public").then((res) => res.json()),
        fetch("/api/products/public?category=men").then((res) => res.json()),
        fetch("/api/products/public?category=women").then((res) => res.json()),
        fetch("/api/products/public?category=unisex").then((res) => res.json()),
        fetch("/api/products/public?isFeatured=true").then((res) => res.json()),
        fetch("/api/products/public?isTrending=true").then((res) => res.json()),
        fetch("/api/products/trending").then((res) => res.json()),
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
        trending: trendingProducts.products || [],
        timestamp: Date.now(),
        productCount: allProducts.products?.length || 0,
      };

      setProductsCache(cacheData);

      if (showTrendingOnly) {
        setDisplayedProducts(cacheData.trending);
      } else if (initialCategory === "all") {
        setDisplayedProducts(cacheData.all);
      } else {
        setDisplayedProducts(
          (cacheData[initialCategory as keyof ProductsCache] as any[]) || [],
        );
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }

      if (!silent) {
        console.log(`💾 Products cached (${cacheData.productCount} products)`);
      } else {
        console.log(
          `🔄 Cache refreshed silently (${cacheData.productCount} products)`,
        );
      }

      // ✅ UPDATE INTERVAL AFTER REFRESH
      if (silent && autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = setInterval(() => {
          console.log("🔄 Auto-refresh: Checking for new products...");
          checkForNewProducts(cacheData.productCount);
        }, AUTO_REFRESH_INTERVAL);
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
    if (showTrendingOnly) {
      let filtered = [...productsCache.trending];

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

      if (selectedClothingTypes.length > 0) {
        filtered = filtered.filter((p) =>
          selectedClothingTypes.includes(p.clothingType),
        );
      }

      if (selectedOccasions.length > 0) {
        filtered = filtered.filter((p) =>
          selectedOccasions.includes(p.occasion),
        );
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
        default:
          filtered.sort(
            (a, b) => (b.trendingScore || 0) - (a.trendingScore || 0),
          );
      }

      setDisplayedProducts(filtered);
      return;
    }

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

    if (selectedClothingTypes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedClothingTypes.includes(p.clothingType),
      );
    }

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
    if (!showTrendingOnly) {
      setSelectedCategory(initialCategory);
    }
    setSelectedSizes([]);
    setPriceRange([0, 10000]);
    setSelectedColors([]);
    setSelectedClothingTypes([]);
    setSelectedOccasions([]);
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

  const toggleClothingType = (type: string) => {
    setSelectedClothingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

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

  const activeFiltersCount =
    (selectedCategory !== initialCategory && !showTrendingOnly ? 1 : 0) +
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
        <div className="flex gap-6">
          <FilterSidebar
            searchQuery={searchQuery}
            selectedCategory={showTrendingOnly ? "all" : selectedCategory}
            selectedSizes={selectedSizes}
            priceRange={priceRange}
            selectedColors={selectedColors}
            selectedClothingTypes={selectedClothingTypes}
            selectedOccasions={selectedOccasions}
            showNewArrivals={showNewArrivals}
            showOnSale={showOnSale}
            onSearchChange={setSearchQuery}
            onCategoryChange={showTrendingOnly ? () => {} : setSelectedCategory}
            onSizeToggle={toggleSize}
            onPriceChange={setPriceRange}
            onColorToggle={toggleColor}
            onClothingTypeToggle={toggleClothingType}
            onOccasionToggle={toggleOccasion}
            onNewArrivalsChange={setShowNewArrivals}
            onSaleChange={setShowOnSale}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            hideCategoryFilter={showTrendingOnly}
          />

          <div className="flex-1">
            {/* ✅ REMOVED REFRESH BUTTON */}
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
  const [isHovered, setIsHovered] = useState(false);

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

  const allImages = product.allImages || [];
  const primaryImage = allImages[0] || product.image || "";
  const secondaryImage = allImages[1] || primaryImage;
  const hasMultipleImages = secondaryImage && secondaryImage !== primaryImage;

  return (
    <a href={`/product/${product.id}`} className="block">
      <div
        className="group relative cursor-pointer will-change-transform"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
          transition: `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
        }}
      >
        <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4 aspect-[3/4]">
          <img
            src={primaryImage}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered && hasMultipleImages ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
          />

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
