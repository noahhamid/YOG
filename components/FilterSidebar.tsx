"use client";

import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

interface ExpandedSections {
  category: boolean;
  price: boolean;
  size: boolean;
  color: boolean;
  clothingType: boolean;
  occasion: boolean;
  other: boolean;
}

interface FilterSidebarProps {
  // Filter states
  searchQuery: string;
  selectedCategory: string;
  selectedSizes: string[];
  priceRange: [number, number];
  selectedColors: string[];
  selectedClothingTypes: string[];
  selectedOccasions: string[];
  showNewArrivals: boolean;
  showOnSale: boolean;

  // Handlers
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSizeToggle: (size: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onColorToggle: (color: string) => void;
  onClothingTypeToggle: (type: string) => void;
  onOccasionToggle: (occasion: string) => void;
  onNewArrivalsChange: (value: boolean) => void;
  onSaleChange: (value: boolean) => void;
  onClearFilters: () => void;

  // UI state
  activeFiltersCount: number;
  expandedSections: ExpandedSections;
  onToggleSection: (section: keyof ExpandedSections) => void;
}

export default function FilterSidebar({
  searchQuery,
  selectedCategory,
  selectedSizes,
  priceRange,
  selectedColors,
  selectedClothingTypes,
  selectedOccasions,
  showNewArrivals,
  showOnSale,
  onSearchChange,
  onCategoryChange,
  onSizeToggle,
  onPriceChange,
  onColorToggle,
  onClothingTypeToggle,
  onOccasionToggle,
  onNewArrivalsChange,
  onSaleChange,
  onClearFilters,
  activeFiltersCount,
  expandedSections,
  onToggleSection,
}: FilterSidebarProps) {
  const categories = [
    { value: "all", label: "All Items" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "unisex", label: "Unisex" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];

  const colors = [
    { value: "black", label: "Black", hex: "#000000" },
    { value: "white", label: "White", hex: "#FFFFFF" },
    { value: "gray", label: "Gray", hex: "#9CA3AF" },
    { value: "blue", label: "Blue", hex: "#3B82F6" },
    { value: "red", label: "Red", hex: "#EF4444" },
    { value: "green", label: "Green", hex: "#10B981" },
    { value: "khaki", label: "Khaki", hex: "#C4B5A0" },
  ];

  const clothingTypes = [
    { value: "TOP", label: "Tops" },
    { value: "BOTTOM", label: "Bottoms" },
    { value: "DRESS", label: "Dresses" },
    { value: "OUTERWEAR", label: "Outerwear" },
    { value: "UNDERWEAR", label: "Underwear" },
    { value: "SHOES", label: "Shoes" },
    { value: "ACCESSORIES", label: "Accessories" },
    { value: "ACTIVEWEAR", label: "Activewear" },
  ];

  const occasions = [
    { value: "CASUAL", label: "Casual" },
    { value: "FORMAL", label: "Formal" },
    { value: "SPORTSWEAR", label: "Sportswear" },
    { value: "STREETWEAR", label: "Streetwear" },
    { value: "PARTY", label: "Party" },
    { value: "WORKWEAR", label: "Workwear" },
    { value: "LOUNGEWEAR", label: "Loungewear" },
  ];

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>
        </div>

        {/* Clear All Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
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
            onClick={() => onToggleSection("category")}
            className="w-full flex items-center justify-between mb-3"
          >
            <h4
              className="font-semibold text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Gender
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
                    onChange={(e) => onCategoryChange(e.target.value)}
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

        {/* Clothing Type Filter */}
        <div className="mb-6 pb-6 border-b border-gray-300">
          <button
            onClick={() => onToggleSection("clothingType")}
            className="w-full flex items-center justify-between mb-3"
          >
            <h4
              className="font-semibold text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Type
            </h4>
            {expandedSections.clothingType ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {expandedSections.clothingType && (
            <div className="space-y-2">
              {clothingTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedClothingTypes.includes(type.value)}
                    onChange={() => onClothingTypeToggle(type.value)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Occasion Filter */}
        <div className="mb-6 pb-6 border-b border-gray-300">
          <button
            onClick={() => onToggleSection("occasion")}
            className="w-full flex items-center justify-between mb-3"
          >
            <h4
              className="font-semibold text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Occasion
            </h4>
            {expandedSections.occasion ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {expandedSections.occasion && (
            <div className="space-y-2">
              {occasions.map((occasion) => (
                <label
                  key={occasion.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedOccasions.includes(occasion.value)}
                    onChange={() => onOccasionToggle(occasion.value)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {occasion.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-6 pb-6 border-b border-gray-300">
          <button
            onClick={() => onToggleSection("price")}
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
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange([priceRange[0], parseInt(e.target.value)])
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
            onClick={() => onToggleSection("size")}
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
                  onClick={() => onSizeToggle(size)}
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
            onClick={() => onToggleSection("color")}
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
                  onClick={() => onColorToggle(color.value)}
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

        {/* Other Filters */}
        <div>
          <button
            onClick={() => onToggleSection("other")}
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
                  onChange={(e) => onNewArrivalsChange(e.target.checked)}
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
                  onChange={(e) => onSaleChange(e.target.checked)}
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
  );
}
