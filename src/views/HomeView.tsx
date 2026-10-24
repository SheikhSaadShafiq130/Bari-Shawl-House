/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, MessageCircle, Phone, MapPin, Clock, CreditCard } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SHOP_INFO, CATEGORY_INFO } from '../data/products';
import { TextileImage } from '../components/TextileImage';

interface HomeViewProps {
  products: Product[];
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectView: (view: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenWholesale: () => void;
  lang: 'en' | 'ur';
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectCategory,
  onSelectView,
  onQuickView,
  onAddToCart,
  onOpenWholesale,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  const featuredProducts = products.filter((p) => p.featured).slice(0, 10);
  const heroSampleProduct = products.find((p) => p.id === 'bsh-l-01') || products[0];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-16">
      {/* 1. Storefront Hero Section: Dashing Royal Midnight, Crimson & Burnished Gold */}
      <section className="relative overflow-hidden text-white pattern-multan-craft border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-18 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Shop Identity & Main Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
            {/* Unboxed Clean Text Kicker */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-semibold text-amber-400">
              <span>Bari Textile Multan</span>
              <span aria-hidden="true">·</span>
              <span>Makki Block, 14 No. Multan Wholesale Market</span>
            </div>

            <div className="space-y-3">
              <h1
                className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                {isUrdu
                  ? 'ملتان کی معیاری شالیں، رومال اور روایتی لونگی'
                  : 'Quality Winter Shawls, Rumaal & Laungi from Multan'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                {isUrdu
                  ? 'باری ٹیکسٹائل ملتان میں خوش آمدید۔ مردانہ اون، زنانی مخمل کڑھائی، بچگانہ شالیں، ملتانی رومال اور لونگی مناسب ہول سیل اور ریٹیل قیمت پر۔ پورے پاکستان میں ہوم ڈیلیوری دستیاب ہے۔'
                  : 'Welcome to Bari Textile Multan. Browse our collection of warm pure wool gents’ shawls, embroidered velvet ladies’ shawls, soft children’s shawls (Bechgana), cotton rumaal, and traditional Multani laungi.'}
              </p>
            </div>

            {/* Responsive Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSelectView('shop');
                }}
                className="min-h-[46px] px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>{isUrdu ? 'تمام ورائٹی دیکھیں' : 'Shop All Products'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum Bari Textile Multan! I want to see your shawls and ask about prices.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isUrdu ? 'واٹس ایپ آرڈر' : `WhatsApp (${SHOP_INFO.whatsappDisplay})`}</span>
              </a>

              <a
                href={`tel:${SHOP_INFO.phoneTel}`}
                className="min-h-[46px] px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-100 text-xs sm:text-sm font-medium rounded-xl border border-amber-500/30 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Call {SHOP_INFO.phoneDisplay}</span>
              </a>
            </div>

            {/* Key Shop Facts */}
            <div className="pt-5 sm:pt-6 border-t border-slate-800/90 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
              <div className="flex sm:block items-center justify-between">
                <p className="font-bold text-amber-400 text-sm sm:text-base">5 Categories</p>
                <p className="text-slate-300 sm:mt-0.5">Gents, Ladies, Kids, Rumaal & Laungi</p>
              </div>
              <div className="flex sm:block items-center justify-between">
                <p className="font-bold text-amber-400 text-sm sm:text-base">Easy Payments</p>
                <p className="text-slate-300 sm:mt-0.5">COD, Meezan Bank, JazzCash & EasyPaisa</p>
              </div>
              <div className="flex sm:block items-center justify-between">
                <p className="font-bold text-amber-400 text-sm sm:text-base">Wholesale & Retail</p>
                <p className="text-slate-300 sm:mt-0.5">Dukaan No. 44, Makki Block</p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Product Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-md bg-slate-900/95 rounded-2xl p-3.5 sm:p-4 border border-amber-500/30 shadow-2xl flex flex-col justify-between">
              <div
                onClick={() => onQuickView(heroSampleProduct)}
                className="rounded-xl overflow-hidden cursor-pointer group"
              >
                <TextileImage product={heroSampleProduct} aspect="4/3" showOverlayCode={true} />
              </div>

              <div className="pt-3.5 mt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] text-amber-400 font-semibold block">
                    Featured Bridal & Party Wear
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white font-serif-luxury truncate">
                    {isUrdu ? heroSampleProduct.nameUrdu : heroSampleProduct.name}
                  </h2>
                  <p className="text-xs text-slate-300 font-mono tabular-nums mt-0.5">
                    Rs. {heroSampleProduct.price.toLocaleString()} · {heroSampleProduct.material}
                  </p>
                </div>
                <button
                  onClick={() => onQuickView(heroSampleProduct)}
                  className="min-h-[38px] px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  View Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Five Main Shopping Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block mb-1">
              {isUrdu ? 'ہماری 5 بنیادی کیٹیگریز' : 'Our 5 Main Shopping Sections'}
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950">
              {isUrdu ? 'کیٹیگری کے مطابق خریداری کریں' : 'Browse by Category'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Tap any section below to view available colors, fabrics (wool, velvet, acrylic, cotton), and prices.
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
                className={`group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-rose-900/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="overflow-hidden bg-slate-100">
                  {sample && <TextileImage product={sample} aspect="4/3" />}
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 block mb-0.5">
                      0{idx + 1}. Category
                    </span>
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-slate-950 group-hover:text-rose-900 transition-colors leading-snug">
                      {isUrdu ? cat.nameUrdu : cat.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2.5 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-900">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block mb-1">
              Popular Items Ready in Stock
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950">
              {isUrdu ? 'مقبول شالیں اور نئی ورائٹی' : 'Featured Shawls & New Arrivals'}
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectView('shop');
            }}
            className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* 4. Shop Location, Payment Accounts & Direct Contact Section */}
      <section className="bg-slate-900 text-white border-y border-slate-800 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Left Info Box */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Trusted Shop in Multan Wholesale Market
                </span>
                <h2
                  className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {isUrdu
                    ? 'ملتان ہول سیل مارکیٹ سے براہ راست خریداری'
                    : 'Direct from Dukaan No. 44, Makki Block, Multan'}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Bari Textile Multan is located at 14 No. Multan Wholesale Market. We supply both single-piece home delivery orders and bulk wholesale orders for shopkeepers, clothing stores, and wedding families across Pakistan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-white text-sm">Official Payment Accounts</span>
                  </div>
                  <p className="text-slate-300 font-mono text-xs">
                    Meezan Bank A/C: <strong className="text-white">{SHOP_INFO.bankAccountNumber}</strong>
                  </p>
                  <p className="text-slate-300 font-mono text-xs">
                    JazzCash & EasyPaisa: <strong className="text-amber-300">{SHOP_INFO.jazzCashDisplay}</strong>
                  </p>
                </div>

                <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1.5">
                  <span className="font-bold text-white text-sm block">Wholesale & Retail Supply</span>
                  <p className="text-slate-300 leading-relaxed">
                    Order single pieces with Cash on Delivery (COD) or request wholesale rates for 12+ pieces.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={onOpenWholesale}
                  className="min-h-[44px] px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  Ask for Wholesale Price List
                </button>
                <button
                  onClick={() => onSelectView('contact')}
                  className="min-h-[44px] px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  View Shop Map & Timings
                </button>
              </div>
            </div>

            {/* Right Contact Card */}
            <div className="lg:col-span-5 bg-white text-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-900">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-950">
                    Visit or Call Our Shop
                  </h3>
                </div>

                <div className="text-xs text-slate-600 space-y-3 pt-1">
                  <div>
                    <span className="font-semibold text-slate-900 block">Shop Address:</span>
                    <p className="text-slate-800 mt-0.5">{SHOP_INFO.address}</p>
                    <p className="text-slate-500 font-urdu mt-0.5">{SHOP_INFO.addressUrdu}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 block">Opening Hours:</span>
                      <p className="mt-0.5">{SHOP_INFO.timings}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${SHOP_INFO.phoneTel}`}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 block transition-colors"
                    >
                      <span className="text-slate-500 block text-[11px]">Phone / JazzCash:</span>
                      <span className="font-mono font-bold text-slate-950 text-sm">
                        {SHOP_INFO.phoneDisplay}
                      </span>
                    </a>
                    <a
                      href={`https://wa.me/${SHOP_INFO.whatsappIntl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-200 block transition-colors"
                    >
                      <span className="text-emerald-800 block text-[11px]">WhatsApp:</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm">
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
                className="min-h-[44px] flex items-center justify-center w-full text-center py-2.5 bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl transition-colors"
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
