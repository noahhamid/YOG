"use client";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

  .fs-wrap {
    width:232px; flex-shrink:0; font-family:'Sora',sans-serif;
  }
  .fs-inner {
    background:#fff; border:1px solid #e8e4de; border-radius:16px;
    max-height:calc(100vh - 56px); overflow-y:auto;
    scrollbar-width:thin; scrollbar-color:#e8e4de transparent;
  }
  .fs-inner::-webkit-scrollbar { width:4px; }
  .fs-inner::-webkit-scrollbar-track { background:transparent; }
  .fs-inner::-webkit-scrollbar-thumb { background:#e8e4de; border-radius:4px; }

  /* ── Search ── */
  .fs-search-wrap {
    padding:14px 14px 0;
  }
  .fs-search {
    position:relative; display:flex; align-items:center;
  }
  .fs-search-ico {
    position:absolute; left:11px; color:#9e9890; pointer-events:none;
    display:flex; align-items:center;
  }
  .fs-search-input {
    width:100%; padding:9px 34px 9px 34px;
    border:1.5px solid #e8e4de; border-radius:10px;
    font-family:'Sora',sans-serif; font-size:12px; font-weight:500;
    color:#1a1714; background:#f6f5f3; outline:none;
    transition:border-color 0.15s, background 0.15s;
    box-sizing:border-box;
  }
  .fs-search-input::placeholder { color:#c4bfb8; }
  .fs-search-input:focus { border-color:#1a1714; background:#fff; }
  .fs-search-clear {
    position:absolute; right:9px;
    width:18px; height:18px; border-radius:50%; border:none;
    background:#d1cdc7; color:#fff; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background 0.15s;
  }
  .fs-search-clear:hover { background:#9e9890; }

  /* ── Clear banner ── */
  .fs-clear-banner {
    margin:10px 14px 0;
    display:flex; align-items:center; justify-content:space-between;
    background:#f6f5f3; border:1px solid #e8e4de; border-radius:9px;
    padding:8px 12px;
  }
  .fs-clear-label { font-size:11px; font-weight:700; color:#9e9890; }
  .fs-clear-label strong { color:#1a1714; }
  .fs-clear-btn {
    font-size:11px; font-weight:700; color:#1a1714; background:none;
    border:none; cursor:pointer; padding:0; font-family:'Sora',sans-serif;
    transition:color 0.15s;
  }
  .fs-clear-btn:hover { color:#dc2626; }

  /* ── Section ── */
  .fs-section { border-bottom:1px solid #f0ede8; }
  .fs-section:last-child { border-bottom:none; }
  .fs-section-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:13px 14px; cursor:pointer; background:none; border:none;
    width:100%; text-align:left; transition:background 0.12s; border-radius:0;
  }
  .fs-section-header:hover { background:#faf9f8; }
  .fs-section-title { font-size:12px; font-weight:800; color:#1a1714; letter-spacing:0.2px; text-transform:uppercase; }
  .fs-chevron { color:#9e9890; display:flex; align-items:center; transition:transform 0.18s; }
  .fs-chevron.open { transform:rotate(180deg); }
  .fs-section-body { padding:0 14px 14px; }

  /* ── Category radios ── */
  .fs-radio-list { display:flex; flex-direction:column; gap:6px; }
  .fs-radio-item { display:flex; align-items:center; gap:9px; cursor:pointer; }
  .fs-radio-input { display:none; }
  .fs-radio-dot {
    width:16px; height:16px; border-radius:50%;
    border:1.5px solid #e8e4de; background:#fff;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:border-color 0.15s;
  }
  .fs-radio-dot::after {
    content:''; width:7px; height:7px; border-radius:50%;
    background:#1a1714; transform:scale(0); transition:transform 0.15s;
  }
  .fs-radio-input:checked + .fs-radio-dot { border-color:#1a1714; }
  .fs-radio-input:checked + .fs-radio-dot::after { transform:scale(1); }
  .fs-radio-label { font-size:13px; font-weight:500; color:#4a4540; transition:color 0.12s; }
  .fs-radio-item:hover .fs-radio-dot { border-color:#9e9890; }
  .fs-radio-item:hover .fs-radio-label { color:#1a1714; }

  /* ── Checkboxes ── */
  .fs-check-list { display:flex; flex-direction:column; gap:6px; }
  .fs-check-item { display:flex; align-items:center; gap:9px; cursor:pointer; }
  .fs-check-input { display:none; }
  .fs-check-box {
    width:16px; height:16px; border-radius:4px;
    border:1.5px solid #e8e4de; background:#fff; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.15s;
  }
  .fs-check-box svg { opacity:0; transition:opacity 0.12s; }
  .fs-check-input:checked + .fs-check-box {
    background:#1a1714; border-color:#1a1714;
  }
  .fs-check-input:checked + .fs-check-box svg { opacity:1; }
  .fs-check-label { font-size:13px; font-weight:500; color:#4a4540; transition:color 0.12s; }
  .fs-check-item:hover .fs-check-box { border-color:#9e9890; }
  .fs-check-item:hover .fs-check-label { color:#1a1714; }

  /* ── Price range ── */
  .fs-price-nums {
    display:flex; justify-content:space-between;
    font-size:12px; font-weight:600; color:#1a1714;
    margin-bottom:10px;
  }
  .fs-price-muted { color:#9e9890; font-weight:500; }
  .fs-range {
    -webkit-appearance:none; appearance:none;
    width:100%; height:4px; border-radius:4px;
    background:linear-gradient(to right, #1a1714 0%, #1a1714 var(--pct,50%), #e8e4de var(--pct,50%), #e8e4de 100%);
    outline:none; cursor:pointer;
  }
  .fs-range::-webkit-slider-thumb {
    -webkit-appearance:none; appearance:none;
    width:16px; height:16px; border-radius:50%;
    background:#1a1714; cursor:pointer;
    box-shadow:0 1px 4px rgba(0,0,0,0.22);
    transition:transform 0.12s;
  }
  .fs-range::-webkit-slider-thumb:hover { transform:scale(1.2); }
  .fs-range::-moz-range-thumb {
    width:16px; height:16px; border-radius:50%;
    background:#1a1714; cursor:pointer; border:none;
    box-shadow:0 1px 4px rgba(0,0,0,0.22);
  }

  /* ── Size pills ── */
  .fs-size-grid { display:flex; flex-wrap:wrap; gap:6px; }
  .fs-size-pill {
    padding:6px 12px; border-radius:7px;
    border:1.5px solid #e8e4de; background:#fff;
    font-size:11px; font-weight:700; color:#4a4540;
    cursor:pointer; font-family:'Sora',sans-serif;
    transition:all 0.15s;
  }
  .fs-size-pill:hover { border-color:#9e9890; color:#1a1714; }
  .fs-size-pill.active { background:#1a1714; color:#fff; border-color:#1a1714; }

  /* ── Color swatches ── */
  .fs-color-grid { display:flex; flex-wrap:wrap; gap:8px; }
  .fs-color-swatch {
    width:26px; height:26px; border-radius:50%;
    border:2px solid #e8e4de; cursor:pointer;
    transition:all 0.15s; position:relative;
  }
  .fs-color-swatch:hover { transform:scale(1.1); border-color:#9e9890; }
  .fs-color-swatch.active {
    border-color:#1a1714; border-width:2.5px;
    box-shadow:0 0 0 2.5px rgba(26,23,20,0.14);
  }
  .fs-color-swatch.white-swatch { box-shadow:inset 0 0 0 1px #e8e4de; }
  .fs-color-swatch.white-swatch.active { box-shadow:inset 0 0 0 1px #e8e4de, 0 0 0 2.5px rgba(26,23,20,0.14); }

  /* ── Toggle switch (New Arrivals / On Sale) ── */
  .fs-toggle-list { display:flex; flex-direction:column; gap:10px; }
  .fs-toggle-item { display:flex; align-items:center; justify-content:space-between; gap:10px; cursor:pointer; }
  .fs-toggle-label { font-size:13px; font-weight:500; color:#4a4540; }
  .fs-toggle-input { display:none; }
  .fs-toggle-track {
    width:34px; height:19px; border-radius:10px;
    background:#e8e4de; flex-shrink:0; position:relative;
    transition:background 0.18s; cursor:pointer;
  }
  .fs-toggle-track::after {
    content:''; position:absolute; top:2.5px; left:2.5px;
    width:14px; height:14px; border-radius:50%;
    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.2);
    transition:transform 0.18s;
  }
  .fs-toggle-input:checked ~ .fs-toggle-track { background:#1a1714; }
  .fs-toggle-input:checked ~ .fs-toggle-track::after { transform:translateX(15px); }
`;

const ChevIco = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const SearchIco = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const XIco = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIco = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fs-section">
      <button className="fs-section-header" onClick={onToggle}>
        <span className="fs-section-title">{title}</span>
        <span className={`fs-chevron${isOpen ? " open" : ""}`}>
          <ChevIco />
        </span>
      </button>
      {isOpen && <div className="fs-section-body">{children}</div>}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
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
  searchQuery: string;
  selectedCategory: string;
  selectedSizes: string[];
  priceRange: [number, number];
  selectedColors: string[];
  selectedClothingTypes: string[];
  selectedOccasions: string[];
  showNewArrivals: boolean;
  showOnSale: boolean;
  hideCategoryFilter?: boolean;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSizeToggle: (s: string) => void;
  onPriceChange: (r: [number, number]) => void;
  onColorToggle: (c: string) => void;
  onClothingTypeToggle: (t: string) => void;
  onOccasionToggle: (o: string) => void;
  onNewArrivalsChange: (v: boolean) => void;
  onSaleChange: (v: boolean) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  expandedSections: ExpandedSections;
  onToggleSection: (s: keyof ExpandedSections) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "all", label: "All Items" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];
const COLORS = [
  { value: "black", label: "Black", hex: "#1a1714" },
  { value: "white", label: "White", hex: "#FFFFFF" },
  { value: "gray", label: "Gray", hex: "#9CA3AF" },
  { value: "blue", label: "Blue", hex: "#3B82F6" },
  { value: "red", label: "Red", hex: "#EF4444" },
  { value: "green", label: "Green", hex: "#10B981" },
  { value: "khaki", label: "Khaki", hex: "#C4B5A0" },
];
const TYPES = [
  { value: "TOP", label: "Tops" },
  { value: "BOTTOM", label: "Bottoms" },
  { value: "DRESS", label: "Dresses" },
  { value: "OUTERWEAR", label: "Outerwear" },
  { value: "UNDERWEAR", label: "Underwear" },
  { value: "SHOES", label: "Shoes" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "ACTIVEWEAR", label: "Activewear" },
];
const OCCASIONS = [
  { value: "CASUAL", label: "Casual" },
  { value: "FORMAL", label: "Formal" },
  { value: "SPORTSWEAR", label: "Sportswear" },
  { value: "STREETWEAR", label: "Streetwear" },
  { value: "PARTY", label: "Party" },
  { value: "WORKWEAR", label: "Workwear" },
  { value: "LOUNGEWEAR", label: "Loungewear" },
];

// ─── Component ────────────────────────────────────────────────────────────────
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
  hideCategoryFilter = false,
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
  // Dynamic gradient for range input
  const rangePct = Math.round((priceRange[1] / 10000) * 100);

  return (
    <>
      <style>{CSS}</style>
      <div className="fs-wrap">
        <div className="fs-inner">
          {/* Search */}
          <div className="fs-search-wrap">
            <div className="fs-search">
              <span className="fs-search-ico">
                <SearchIco />
              </span>
              <input
                className="fs-search-input"
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="fs-search-clear"
                  onClick={() => onSearchChange("")}
                >
                  <XIco />
                </button>
              )}
            </div>
          </div>

          {/* Active filters banner */}
          {activeFiltersCount > 0 && (
            <div className="fs-clear-banner">
              <span className="fs-clear-label">
                <strong>{activeFiltersCount}</strong> filter
                {activeFiltersCount !== 1 ? "s" : ""} active
              </span>
              <button className="fs-clear-btn" onClick={onClearFilters}>
                Clear all
              </button>
            </div>
          )}

          {/* Spacer after search */}
          <div style={{ height: 10 }} />

          {/* Gender */}
          {!hideCategoryFilter && (
            <Section
              title="Gender"
              isOpen={expandedSections.category}
              onToggle={() => onToggleSection("category")}
            >
              <div className="fs-radio-list">
                {CATEGORIES.map((cat) => (
                  <label key={cat.value} className="fs-radio-item">
                    <input
                      className="fs-radio-input"
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={(e) => onCategoryChange(e.target.value)}
                    />
                    <span className="fs-radio-dot" />
                    <span className="fs-radio-label">{cat.label}</span>
                  </label>
                ))}
              </div>
            </Section>
          )}

          {/* Type */}
          <Section
            title="Type"
            isOpen={expandedSections.clothingType}
            onToggle={() => onToggleSection("clothingType")}
          >
            <div className="fs-check-list">
              {TYPES.map((t) => (
                <label key={t.value} className="fs-check-item">
                  <input
                    className="fs-check-input"
                    type="checkbox"
                    checked={selectedClothingTypes.includes(t.value)}
                    onChange={() => onClothingTypeToggle(t.value)}
                  />
                  <span className="fs-check-box">
                    <CheckIco />
                  </span>
                  <span className="fs-check-label">{t.label}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Occasion */}
          <Section
            title="Occasion"
            isOpen={expandedSections.occasion}
            onToggle={() => onToggleSection("occasion")}
          >
            <div className="fs-check-list">
              {OCCASIONS.map((o) => (
                <label key={o.value} className="fs-check-item">
                  <input
                    className="fs-check-input"
                    type="checkbox"
                    checked={selectedOccasions.includes(o.value)}
                    onChange={() => onOccasionToggle(o.value)}
                  />
                  <span className="fs-check-box">
                    <CheckIco />
                  </span>
                  <span className="fs-check-label">{o.label}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Price */}
          <Section
            title="Price"
            isOpen={expandedSections.price}
            onToggle={() => onToggleSection("price")}
          >
            <div className="fs-price-nums">
              <span className="fs-price-muted">0 ETB</span>
              <span>{priceRange[1].toLocaleString()} ETB</span>
            </div>
            <input
              className="fs-range"
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange[1]}
              style={{ "--pct": `${rangePct}%` } as React.CSSProperties}
              onChange={(e) =>
                onPriceChange([priceRange[0], parseInt(e.target.value)])
              }
            />
          </Section>

          {/* Size */}
          <Section
            title="Size"
            isOpen={expandedSections.size}
            onToggle={() => onToggleSection("size")}
          >
            <div className="fs-size-grid">
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={`fs-size-pill${selectedSizes.includes(s) ? " active" : ""}`}
                  onClick={() => onSizeToggle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>

          {/* Color */}
          <Section
            title="Color"
            isOpen={expandedSections.color}
            onToggle={() => onToggleSection("color")}
          >
            <div className="fs-color-grid">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.label}
                  className={`fs-color-swatch${selectedColors.includes(c.value) ? " active" : ""}${c.value === "white" ? " white-swatch" : ""}`}
                  style={{ background: c.hex }}
                  onClick={() => onColorToggle(c.value)}
                />
              ))}
            </div>
          </Section>

          {/* Other */}
          <Section
            title="Other"
            isOpen={expandedSections.other}
            onToggle={() => onToggleSection("other")}
          >
            <div className="fs-toggle-list">
              <label className="fs-toggle-item">
                <span className="fs-toggle-label">New Arrivals</span>
                <span
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="fs-toggle-input"
                    type="checkbox"
                    checked={showNewArrivals}
                    onChange={(e) => onNewArrivalsChange(e.target.checked)}
                  />
                  <span
                    className="fs-toggle-track"
                    onClick={() => onNewArrivalsChange(!showNewArrivals)}
                  />
                </span>
              </label>
              <label className="fs-toggle-item">
                <span className="fs-toggle-label">On Sale</span>
                <span
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="fs-toggle-input"
                    type="checkbox"
                    checked={showOnSale}
                    onChange={(e) => onSaleChange(e.target.checked)}
                  />
                  <span
                    className="fs-toggle-track"
                    onClick={() => onSaleChange(!showOnSale)}
                  />
                </span>
              </label>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
