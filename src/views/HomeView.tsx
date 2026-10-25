/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  LayoutGrid,
  Rows3,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  ProductColorOption,
  StudioAngleMode,
} from '../types';
import { ProductCard } from '../components/ProductCard';
import { SHOP_INFO, CATEGORY_INFO } from '../data/products';
import { TextileImage } from '../components/TextileImage';

interface HomeViewProps {
  products: Product[];
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectView: (view: string) => void;
  onQuickView: (product: Product, selectedColor?: ProductColorOption) => void;
  onAddToCart: (product: Product, quantity?: number, selectedColor?: ProductColorOption) => void;
  onOpenWholesale: () => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  lang: 'en' | 'ur';
}

const HERO_ANGLES: { mode: StudioAngleMode; label: string }[] = [
  { mode: 'full', label: '1. Shawl' },
  { mode: 'wearing', label: '2. Wearing' },
  { mode: 'arm-drape', label: '3. On Arm' },
  { mode: 'macro-zoom', label: '4. Border' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectCategory,
  onSelectView,
  onQuickView,
  onAddToCart,
  onOpenWholesale,
  wishlistIds = [],
  onToggleWishlist,
  lang,
}) => {
  const [mobileTwoCol, setMobileTwoCol] = useState(false);
  const [heroAngleIdx, setHeroAngleIdx] = useState(0);
  const isUrdu = lang === 'ur';

  const featuredProducts = products.filter((p) => p.featured).slice(0, 10);
  const heroSampleProduct = products.find((p) => p.id === 'bsh-l-01') || products[0];

  return (
    <div className="space-y-10 sm:space-y-16 pb-10 sm:pb-16">
      {/* 1. Storefront Hero Section: Warm Cashmere & Sandstone Editorial Showcase */}
      <section className="relative overflow-hidden text-stone-900 pattern-multan-craft border-b border-[#C8BFA8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 lg:py-18 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-stretch">
          {/* Left Column: Shop Identity & Main Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6">
            {/* Unboxed Clean Text Kicker */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-bold text-rose-800">
              <span>Bari Shawl House</span>
              <span aria-hidden="true">·</span>
              <span>Makki Block, 14 No. Multan Wholesale Market</span>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <h1
                className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-stone-900 leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                {isUrdu
                  ? 'باری شال ہاؤس ملتان · معیاری شالیں، رومال اور لونگی'
                  : 'Bari Shawl House — Winter Shawls, Rumaal & Laungi'}
              </h1>
              <p className="text-stone-700 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed font-medium">
                {isUrdu
                  ? 'باری شال ہاؤس ملتان میں خوش آمدید۔ ہر شال کے دستیاب رنگ منتخب کریں اور منٹرا سٹائل میں 4 مختلف زاویوں (پہنے ہوئے، بازو پر اور بارڈر زوم) سے تصاویر دیکھیں۔ پورے پاکستان میں ہوم ڈیلیوری دستیاب ہے۔'
                  : 'Welcome to Bari Shawl House, Multan. Choose your favorite available colors on every shawl and inspect 4 studio views (Full Shawl, Model Wearing, Hanging on Arm & Border Close-Up). Cash on Delivery across Pakistan.'}
              </p>
            </div>

            {/* Responsive Action Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSelectView('shop');
                }}
                className="col-span-2 sm:col-span-1 min-h-[48px] px-6 py-3 bg-rose-700 hover:bg-rose-800 active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>{isUrdu ? 'تمام ورائٹی دیکھیں' : 'Shop All Products'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum Bari Shawl House! I want to see your shawls and ask about prices.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] px-4 sm:px-5 py-2.5 sm:py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isUrdu ? 'واٹس ایپ' : 'WhatsApp'}</span>
              </a>

              <a
                href={`tel:${SHOP_INFO.phoneTel}`}
                className="min-h-[46px] px-4 py-2.5 sm:py-3 bg-[#FAF7F2] hover:bg-white active:scale-[0.98] text-stone-900 text-xs sm:text-sm font-semibold rounded-xl border border-[#BFB5A2] shadow-2xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{SHOP_INFO.phoneDisplay}</span>
              </a>
            </div>

            {/* Key Shop Facts */}
            <div className="pt-4 sm:pt-6 border-t border-[#C8BFA8] grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs">
              <div className="flex sm:block items-center justify-between">
                <p className="font-bold text-rose-800 text-xs sm:text-base">
                  4 Studio Views &amp; Colors
                </p>
                <p className="text-stone-700 sm:mt-0.5 font-medium">
                  Wearing, Arm Drape &amp; Color Swatches
                </p>
              </div>
              <div className="flex sm:block items-center justify-between">
                <p className="font-bold text-rose-800 text-xs sm:text-base">
                  Bundle Discounts
                </p>
                <p className="text-stone-700 sm:mt-0.5 font-medium">
                  Buy 2+ Save 5% · Buy 4+ Save 10%
                </p>
              </div>
              <div className="flex sm:block items-center justify-between">
                <p className="font-bold text-rose-800 text-xs sm:text-base">
                  Wholesale &amp; Retail
                </p>
                <p className="text-stone-700 sm:mt-0.5 font-medium">
                  Dukaan No. 44, Makki Block
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Product Showcase with Interactive 4-Angle Switcher */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-md bg-[#1E1B24] text-stone-100 rounded-2xl p-3.5 sm:p-4 border border-stone-700 shadow-2xl flex flex-col justify-between space-y-3">
              <div
                onClick={() => onQuickView(heroSampleProduct)}
                className="rounded-xl overflow-hidden cursor-pointer group border border-stone-700/80 bg-[#282430]"
              >
                <TextileImage
                  product={heroSampleProduct}
                  aspect="4/3"
                  showOverlayCode={heroAngleIdx === 0}
                  viewMode={HERO_ANGLES[heroAngleIdx].mode}
                />
              </div>

              {/* 4-Photo Angle Selector Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {HERO_ANGLES.map((ang, idx) => (
                  <button
                    key={ang.mode}
                    type="button"
                    onClick={() => setHeroAngleIdx(idx)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                      heroAngleIdx === idx
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                    }`}
                  >
                    {ang.label}
                  </button>
                ))}
              </div>

              <div className="pt-2.5 border-t border-stone-700/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] text-amber-400 font-bold block">
                    Tap Any Angle Above or Open Full 4-Photo View
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white font-serif-luxury truncate">
                    {isUrdu ? heroSampleProduct.nameUrdu : heroSampleProduct.name}
                  </h2>
                  <p className="text-xs text-stone-300 font-mono tabular-nums mt-0.5 font-semibold">
                    Rs. {heroSampleProduct.price.toLocaleString()} · 5 Colors Available
                  </p>
                </div>
                <button
                  onClick={() => onQuickView(heroSampleProduct)}
                  className="min-h-[42px] px-3.5 py-2 bg-rose-700 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs"
                >
                  4 Photos &amp; Colors
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Five Main Shopping Categories */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
          <div>
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
              {isUrdu ? 'ہماری 5 بنیادی کیٹیگریز' : 'Our 5 Main Shopping Sections'}
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              {isUrdu ? 'کیٹیگری کے مطابق خریداری کریں' : 'Browse by Category'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 max-w-md font-medium">
            Tap any section below to view available colors, 4-angle studio photos, fabrics, and prices.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORY_INFO.filter((c) => c.id !== 'all').map((cat, idx) => {
            const sample = products.find((p) => p.category === cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id as ProductCategory);
                  onSelectView('shop');
                }}
                className={`group bg-[#FDFBF7] border border-[#CFC6B8] rounded-2xl overflow-hidden hover:border-rose-600 active:scale-[0.99] shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="overflow-hidden bg-[#E6DFD3] border-b border-[#DED6C8]">
                  {sample && <TextileImage product={sample} aspect="4/3" />}
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 font-semibold block mb-0.5">
                      0{idx + 1}. Category
                    </span>
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-900 group-hover:text-rose-700 transition-colors leading-snug">
                      {isUrdu ? cat.nameUrdu : cat.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2.5 sm:pt-3 mt-2 sm:mt-3 border-t border-[#E6DFD3] flex items-center justify-between text-xs font-bold text-rose-700">
                    <span>{isUrdu ? 'ورائٹی دیکھیں' : 'Open Section'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
          <div>
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
              Select Colors &amp; View 4 Studio Photos on Every Shawl
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              {isUrdu ? 'مقبول شالیں اور نئی ورائٹی' : 'Featured Shawls & New Arrivals'}
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {/* Mobile 1-Col vs 2-Col Switcher */}
            <div className="flex sm:hidden items-center bg-[#FDFBF7] border border-[#CFC6B8] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setMobileTwoCol(false)}
                className={`min-h-[38px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  !mobileTwoCol ? 'bg-rose-700 text-white' : 'text-stone-700'
                }`}
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span>Large</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTwoCol(true)}
                className={`min-h-[38px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  mobileTwoCol ? 'bg-rose-700 text-white' : 'text-stone-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>2-Grid</span>
              </button>
            </div>

            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectView('shop');
              }}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              <span>View All {products.length} Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          className={`grid ${
            mobileTwoCol ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-5'
          } sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8`}
        >
          {featuredProducts.map((product) => (
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
      </section>

      {/* 4. Shop Location, Payment Accounts & Direct Contact Section */}
      <section className="pattern-royal-banner text-stone-900 border-y border-[#C6BBA6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Left Info Box */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Trusted Shop in Multan Wholesale Market
                </span>
                <h2
                  className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {isUrdu
                    ? 'باری شال ہاؤس · ملتان ہول سیل مارکیٹ سے براہ راست خریداری'
                    : 'Bari Shawl House · Dukaan No. 44, Makki Block, Multan'}
                </h2>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                  Bari Shawl House is located at 14 No. Multan Wholesale Market. We supply both single-piece home delivery orders and bulk wholesale orders for shopkeepers, clothing stores, and wedding families across Pakistan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#C8BFA8] shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-700">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-stone-900 text-sm">
                      Official Payment Accounts
                    </span>
                  </div>
                  <p className="text-stone-700 font-mono text-xs">
                    Meezan Bank A/C:{' '}
                    <strong className="text-stone-900">{SHOP_INFO.bankAccountNumber}</strong>
                  </p>
                  <p className="text-stone-700 font-mono text-xs">
                    JazzCash &amp; EasyPaisa:{' '}
                    <strong className="text-rose-700">{SHOP_INFO.jazzCashDisplay}</strong>
                  </p>
                </div>

                <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#C8BFA8] shadow-2xs space-y-1.5">
                  <span className="font-bold text-stone-900 text-sm block">
                    Wholesale &amp; Retail Supply
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    Order single pieces with Cash on Delivery (COD) or request wholesale rates for 12+ pieces.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={onOpenWholesale}
                  className="min-h-[44px] px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  Ask for Wholesale Price List
                </button>
                <button
                  onClick={() => onSelectView('contact')}
                  className="min-h-[44px] px-4 py-2.5 bg-[#FDFBF7] hover:bg-white text-stone-900 border border-[#C8BFA8] text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  View Shop Map &amp; Timings
                </button>
              </div>
            </div>

            {/* Right Contact Card: Grounded Deep Charcoal-Plum Showcase Card */}
            <div className="lg:col-span-5 bg-[#1E1B24] text-stone-100 p-5 sm:p-6 rounded-2xl border border-stone-700 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <h3 className="font-serif-luxury text-xl font-bold text-white">
                    Visit or Call Bari Shawl House
                  </h3>
                </div>

                <div className="text-xs text-stone-300 space-y-3 pt-1">
                  <div>
                    <span className="font-semibold text-amber-300 block">Shop Address:</span>
                    <p className="text-stone-100 mt-0.5 font-medium">{SHOP_INFO.address}</p>
                    <p className="text-stone-300 font-urdu mt-0.5">{SHOP_INFO.addressUrdu}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-700/80 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300 block">Opening Hours:</span>
                      <p className="mt-0.5 text-stone-200">{SHOP_INFO.timings}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-700/80 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${SHOP_INFO.phoneTel}`}
                      className="p-2.5 bg-stone-800/90 hover:bg-stone-800 rounded-xl border border-stone-700 block transition-colors"
                    >
                      <span className="text-stone-400 block text-[11px]">Phone / JazzCash:</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {SHOP_INFO.phoneDisplay}
                      </span>
                    </a>
                    <a
                      href={`https://wa.me/${SHOP_INFO.whatsappIntl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-emerald-950/70 hover:bg-emerald-900/70 rounded-xl border border-emerald-700/60 block transition-colors"
                    >
                      <span className="text-emerald-300 block text-[11px]">WhatsApp:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {SHOP_INFO.whatsappDisplay}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  'Multan Wholesale Market Makki Block 14 No Multan'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center justify-center w-full text-center py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Open Shop Location in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
