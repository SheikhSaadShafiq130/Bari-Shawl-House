/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Product, ProductCategory, FabricMaterial } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORY_INFO } from '../data/products';

interface ShopViewProps {
  products: Product[];
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  lang: 'en' | 'ur';
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-2500' | '2500-5000' | 'above-5000'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
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
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        if (selectedMaterial !== 'all' && p.material !== selectedMaterial) {
          return false;
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
          const matchName = p.name.toLowerCase().includes(q);
          const matchUrdu = p.nameUrdu.includes(q);
          const matchCode = p.code.toLowerCase().includes(q);
          const matchMaterial = p.material.toLowerCase().includes(q);
          const matchColor = p.color.toLowerCase().includes(q);
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
  }, [products, activeCategory, selectedMaterial, priceFilter, onlyInStock, searchQuery, sortBy]);

  const activeCategoryMeta = CATEGORY_INFO.find((c) => c.id === activeCategory);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMaterial('all');
    setPriceFilter('all');
    setOnlyInStock(false);
    setSortBy('featured');
    onSelectCategory('all');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedMaterial !== 'all' ||
    priceFilter !== 'all' ||
    onlyInStock ||
    activeCategory !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* Page Title & Count */}
      <div className="border-b border-stone-200 pb-4 sm:pb-5 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div>
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
            Bari Textile Multan · Catalog
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            {isUrdu ? activeCategoryMeta?.nameUrdu : activeCategoryMeta?.name || 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {activeCategoryMeta?.description}
          </p>
        </div>

        <div className="text-xs text-stone-600 font-mono tabular-nums">
          Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
          {products.length} products
        </div>
      </div>

      {/* Category Filter Buttons (Touch Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORY_INFO.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-rose-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 hover:bg-stone-100 text-slate-700'
              }`}
            >
              {isUrdu ? cat.nameUrdu : cat.name}
            </button>
          );
        })}
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-2 lg:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, color, wool, velvet, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[42px] w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800"
            />
          </div>

          {/* Fabric Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="min-h-[42px] w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 bg-white"
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
              className="min-h-[42px] w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 bg-white"
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
              className="min-h-[42px] w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 bg-white font-medium"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Sort: New Arrivals</option>
            </select>
          </div>

          {/* In Stock & Reset */}
          <div className="lg:col-span-1 flex items-center justify-between lg:justify-end gap-2 text-xs pt-1 sm:pt-0">
            <label className="min-h-[36px] flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium whitespace-nowrap">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-rose-800"
              />
              <span>In Stock</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="min-h-[36px] px-2 text-stone-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="lg:hidden">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-10 sm:p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
            No products found matching your search
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try clearing your search or selecting "All Products" to see our full collection.
          </p>
          <button
            onClick={resetFilters}
            className="min-h-[42px] px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl mt-2"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
};
