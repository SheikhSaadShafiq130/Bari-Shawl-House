/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  Rows3,
  Heart,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  FabricMaterial,
  ProductColorOption,
} from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORY_INFO, getProductColors } from '../data/products';

interface ShopViewProps {
  products: Product[];
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onQuickView: (product: Product, selectedColor?: ProductColorOption) => void;
  onAddToCart: (product: Product, quantity?: number, selectedColor?: ProductColorOption) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  onlyWishlistFilter?: boolean;
  onToggleWishlistFilter?: (val: boolean) => void;
  lang: 'en' | 'ur';
}

const COLOR_FILTERS = [
  { id: 'all', label: 'All Colors', hex: 'transparent' },
  { id: 'black', label: 'Black', hex: '#18181B', keywords: ['black', 'obsidian'] },
  { id: 'white', label: 'Off-White / Cream', hex: '#F5F2EB', keywords: ['white', 'cream', 'ivory'] },
  { id: 'brown', label: 'Camel / Brown', hex: '#B88B58', keywords: ['camel', 'brown', 'walnut', 'sand', 'fawn', 'chocolate'] },
  { id: 'red', label: 'Crimson / Maroon', hex: '#991B1B', keywords: ['crimson', 'red', 'maroon', 'burgundy', 'ruby', 'plum', 'rose'] },
  { id: 'green', label: 'Emerald / Green', hex: '#065F46', keywords: ['green', 'emerald', 'olive', 'mint', 'teal'] },
  { id: 'grey', label: 'Charcoal / Navy', hex: '#374151', keywords: ['charcoal', 'grey', 'slate', 'navy', 'blue', 'indigo'] },
  { id: 'gold', label: 'Mustard / Gold', hex: '#B45309', keywords: ['mustard', 'gold', 'amber', 'rust'] },
];

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  wishlistIds = [],
  onToggleWishlist,
  onlyWishlistFilter = false,
  onToggleWishlistFilter,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedColorFamily, setSelectedColorFamily] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-2500' | '2500-5000' | 'above-5000'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>(
    'featured'
  );
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileTwoCol, setMobileTwoCol] = useState(false);
  const isUrdu = lang === 'ur';

  const materials: FabricMaterial[] = [
    'Pure Wool',
    'Royal Velvet',
    'Pashmina Blend',
    'Soft Acrylic',
    'Fine Cotton',
    'Silk Blend',
    'Swati Wool',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (onlyWishlistFilter && !wishlistIds.includes(p.id)) {
          return false;
        }
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        if (selectedMaterial !== 'all' && p.material !== selectedMaterial) {
          return false;
        }
        if (selectedColorFamily !== 'all') {
          const family = COLOR_FILTERS.find((cf) => cf.id === selectedColorFamily);
          if (family && family.keywords) {
            const allProdColors = getProductColors(p)
              .map((c) => c.name.toLowerCase())
              .join(' ');
            const hasMatch = family.keywords.some((kw) => allProdColors.includes(kw));
            if (!hasMatch) return false;
          }
        }
        if (priceFilter === 'under-2500' && p.price >= 2500) {
          return false;
        }
        if (priceFilter === '2500-5000' && (p.price < 2500 || p.price > 5000)) {
          return false;
        }
        if (priceFilter === 'above-5000' && p.price <= 5000) {
          return false;
        }
        if (onlyInStock && !p.inStock) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const allProdColors = getProductColors(p)
            .map((c) => c.name.toLowerCase())
            .join(' ');
          const matchName = p.name.toLowerCase().includes(q);
          const matchUrdu = p.nameUrdu.includes(q);
          const matchCode = p.code.toLowerCase().includes(q);
          const matchMaterial = p.material.toLowerCase().includes(q);
          const matchColor = p.color.toLowerCase().includes(q) || allProdColors.includes(q);
          const matchStyle = p.style.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (
            !matchName &&
            !matchUrdu &&
            !matchCode &&
            !matchMaterial &&
            !matchColor &&
            !matchStyle &&
            !matchDesc
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    onlyWishlistFilter,
    wishlistIds,
    activeCategory,
    selectedMaterial,
    selectedColorFamily,
    priceFilter,
    onlyInStock,
    searchQuery,
    sortBy,
  ]);

  const activeCategoryMeta = CATEGORY_INFO.find((c) => c.id === activeCategory);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMaterial('all');
    setSelectedColorFamily('all');
    setPriceFilter('all');
    setOnlyInStock(false);
    setSortBy('featured');
    if (onToggleWishlistFilter) onToggleWishlistFilter(false);
    onSelectCategory('all');
  };

  const activeFilterCount =
    (selectedMaterial !== 'all' ? 1 : 0) +
    (selectedColorFamily !== 'all' ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyWishlistFilter ? 1 : 0) +
    (sortBy !== 'featured' ? 1 : 0);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    activeFilterCount > 0 ||
    activeCategory !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-4 sm:space-y-6">
      {/* Page Title, Count & Mobile Grid Layout Toggle */}
      <div className="border-b border-[#C8BFA8] pb-4 sm:pb-5 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div>
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
            Bari Shawl House · Catalog
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
            {onlyWishlistFilter
              ? isUrdu
                ? 'آپ کی پسندیدہ شالیں (Saved)'
                : 'Your Saved Shawls (Wishlist)'
              : isUrdu
              ? activeCategoryMeta?.nameUrdu
              : activeCategoryMeta?.name || 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1 max-w-2xl font-medium">
            {onlyWishlistFilter
              ? 'Compare your shortlisted shawls, select your favorite color, and order directly.'
              : activeCategoryMeta?.description}
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="text-xs text-stone-700 font-mono tabular-nums">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> of{' '}
            {products.length} items
          </div>

          {/* Mobile 1-Col vs 2-Col View Switcher */}
          <div className="flex sm:hidden items-center bg-[#FDFBF7] border border-[#CFC6B8] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setMobileTwoCol(false)}
              className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                !mobileTwoCol ? 'bg-rose-700 text-white' : 'text-stone-700'
              }`}
              aria-label="Large 1-column mobile view"
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span>Large</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTwoCol(true)}
              className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                mobileTwoCol ? 'bg-rose-700 text-white' : 'text-stone-700'
              }`}
              aria-label="Compact 2-column mobile grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>2-Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category + Wishlist Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
        {CATEGORY_INFO.map((cat) => {
          const isSelected = !onlyWishlistFilter && activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (onToggleWishlistFilter) onToggleWishlistFilter(false);
                onSelectCategory(cat.id as ProductCategory);
              }}
              className={`snap-start min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-rose-700 text-white shadow-xs font-bold'
                  : 'bg-[#FDFBF7] border border-[#CFC6B8] hover:bg-white hover:text-rose-700 hover:border-rose-400 text-stone-800'
              }`}
            >
              {isUrdu ? cat.nameUrdu : cat.name}
            </button>
          );
        })}

        {onToggleWishlistFilter && (
          <button
            type="button"
            onClick={() => onToggleWishlistFilter(!onlyWishlistFilter)}
            className={`snap-start min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
              onlyWishlistFilter
                ? 'bg-rose-700 text-white shadow-xs font-bold'
                : 'bg-[#FDFBF7] border border-[#CFC6B8] hover:bg-white text-stone-800'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                onlyWishlistFilter ? 'fill-white text-white' : 'text-rose-700'
              }`}
            />
            <span>Saved ({wishlistIds.length})</span>
          </button>
        )}
      </div>

      {/* Interactive Color Swatch Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-bold text-stone-700 shrink-0 mr-1">
          {isUrdu ? 'رنگ کے مطابق:' : 'Filter by Color:'}
        </span>
        {COLOR_FILTERS.map((cf) => {
          const isSelected = selectedColorFamily === cf.id;
          return (
            <button
              key={cf.id}
              type="button"
              onClick={() => setSelectedColorFamily(cf.id)}
              className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#1E1B24] text-white border-[#1E1B24] shadow-2xs'
                  : 'bg-[#FDFBF7] text-stone-800 border-[#CFC6B8] hover:border-stone-500'
              }`}
            >
              {cf.id !== 'all' && (
                <span
                  className="w-3.5 h-3.5 rounded-full border border-stone-400 shrink-0"
                  style={{ backgroundColor: cf.hex }}
                />
              )}
              <span>{cf.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-[#FDFBF7] p-3 sm:p-4 rounded-2xl border border-[#CFC6B8] shadow-xs space-y-3">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                isUrdu
                  ? 'نام، رنگ یا کوڈ سے تلاش کریں...'
                  : 'Search wool, velvet, color, code...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[44px] w-full pl-9 pr-3 py-2 text-base bg-white border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
              mobileFiltersOpen || activeFilterCount > 0
                ? 'bg-rose-700 text-white border-rose-700'
                : 'bg-[#EFEAE1] text-stone-800 border-[#C8BFA8]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isUrdu ? 'فلٹر' : 'Filter'}</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-rose-700 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div
          className={`${
            mobileFiltersOpen ? 'grid' : 'hidden lg:grid'
          } grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E2DACB]`}
        >
          {/* Desktop Search Input */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, color, wool, velvet, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[42px] w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700"
            />
          </div>

          {/* Fabric Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="min-h-[44px] lg:min-h-[42px] w-full px-3 py-2 text-base lg:text-xs border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700 bg-white"
            >
              <option value="all">All Fabrics (Wool, Velvet, Cotton)</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="lg:col-span-2">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as typeof priceFilter)}
              className="min-h-[44px] lg:min-h-[42px] w-full px-3 py-2 text-base lg:text-xs border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700 bg-white"
            >
              <option value="all">All Prices</option>
              <option value="under-2500">Under Rs. 2,500</option>
              <option value="2500-5000">Rs. 2,500 – Rs. 5,000</option>
              <option value="above-5000">Above Rs. 5,000</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="min-h-[44px] lg:min-h-[42px] w-full px-3 py-2 text-base lg:text-xs border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700 bg-white font-medium"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Sort: New Arrivals</option>
            </select>
          </div>

          {/* In Stock & Reset */}
          <div className="lg:col-span-1 flex items-center justify-between lg:justify-end gap-2 text-xs pt-1 sm:pt-0">
            <label className="min-h-[44px] lg:min-h-[36px] flex items-center gap-2 cursor-pointer text-stone-800 font-semibold whitespace-nowrap">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-rose-700"
              />
              <span>In Stock</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="min-h-[44px] lg:min-h-[36px] px-2.5 text-stone-700 hover:text-rose-700 flex items-center gap-1 font-semibold"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="lg:hidden">Reset All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#FDFBF7] border border-[#CFC6B8] rounded-2xl p-10 sm:p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-100 mx-auto flex items-center justify-center text-rose-700">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
            No products found matching your filter
          </h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            Try clearing your color/fabric filter or selecting "All Collections" to see our full catalog.
          </p>
          <button
            onClick={resetFilters}
            className="min-h-[44px] px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl mt-2"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div
          className={`grid ${
            mobileTwoCol ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-5'
          } sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              lang={lang}
              compactMobile={mobileTwoCol}
            />
          ))}
        </div>
      )}
    </div>
  );
};
