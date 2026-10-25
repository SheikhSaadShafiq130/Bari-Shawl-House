/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  Settings,
  Menu,
  X,
  Globe,
  Lock,
  Heart,
} from 'lucide-react';
import { SHOP_INFO } from '../data/products';
import { ProductCategory } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  activeView: string;
  onSelectView: (view: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  lang: 'en' | 'ur';
  onToggleLang: () => void;
  onOpenAdmin: () => void;
  onOpenWholesale: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  activeView,
  onSelectView,
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  lang,
  onToggleLang,
  onOpenAdmin,
  onOpenWholesale,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isUrdu = lang === 'ur';

  const primaryNav = [
    { id: 'home', labelEn: 'Home', labelUr: 'ہوم', isCategory: false },
    { id: 'all', labelEn: 'All Products', labelUr: 'تمام شالیں', isCategory: true, cat: 'all' as ProductCategory },
    { id: 'gents', labelEn: "Gents’ Shawls", labelUr: 'مردانہ شالیں', isCategory: true, cat: 'gents' as ProductCategory },
    { id: 'ladies', labelEn: "Ladies’ Shawls", labelUr: 'زنانی شالیں', isCategory: true, cat: 'ladies' as ProductCategory },
    { id: 'contact', labelEn: 'Contact & Map', labelUr: 'رابطہ و نقشہ', isCategory: false },
  ];

  const allMobileLinks = [
    { id: 'home', labelEn: 'Home', labelUr: 'ہوم', isCategory: false },
    { id: 'all', labelEn: 'All Products', labelUr: 'تمام ورائٹی', isCategory: true, cat: 'all' as ProductCategory },
    { id: 'gents', labelEn: "1. Gents’ Shawls", labelUr: '1. مردانہ شالیں', isCategory: true, cat: 'gents' as ProductCategory },
    { id: 'ladies', labelEn: "2. Ladies’ Shawls", labelUr: '2. زنانی شالیں', isCategory: true, cat: 'ladies' as ProductCategory },
    { id: 'bechgana', labelEn: "3. Children’s Shawls (Bechgana)", labelUr: '3. بچگانہ شالیں', isCategory: true, cat: 'bechgana' as ProductCategory },
    { id: 'rumaal', labelEn: '4. Rumaal', labelUr: '4. رومال', isCategory: true, cat: 'rumaal' as ProductCategory },
    { id: 'laungi', labelEn: '5. Laungi', labelUr: '5. ملتانی لونگی', isCategory: true, cat: 'laungi' as ProductCategory },
    { id: 'about', labelEn: 'About Bari Shawl House', labelUr: 'ہمارے بارے میں', isCategory: false },
    { id: 'faq', labelEn: 'Common Questions (FAQ)', labelUr: 'عام سوالات', isCategory: false },
    { id: 'contact', labelEn: 'Contact & Shop Address', labelUr: 'رابطہ اور پتہ', isCategory: false },
    { id: 'handover', labelEn: 'Owner Guide & Checklist', labelUr: 'اونر گائیڈ', isCategory: false },
  ];

  const handleNavClick = (item: { id: string; isCategory?: boolean; cat?: ProductCategory }) => {
    if (item.isCategory && item.cat) {
      onSelectCategory(item.cat);
      onSelectView('shop');
    } else {
      onSelectView(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Utility Bar: Grounded Deep Charcoal-Plum Retail Strip */}
      <div className="bg-[#1E1B24] text-stone-200 text-xs border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-semibold text-amber-400 truncate text-[11px] sm:text-xs">
              {isUrdu
                ? 'باری شال ہاؤس · دکان نمبر 44، مکی بلاک، 14 نمبر ملتان'
                : 'Bari Shawl House · Dukaan No. 44, Makki Block, 14 No. Multan'}
            </span>
            <span className="hidden md:inline text-stone-600">·</span>
            <a
              href={`tel:${SHOP_INFO.phoneTel}`}
              className="hidden md:inline-flex items-center gap-1.5 text-stone-200 hover:text-white transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{SHOP_INFO.phoneDisplay}</span>
            </a>
            <span className="hidden lg:inline text-stone-600">·</span>
            <a
              href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
                'Assalam-o-Alaikum Bari Shawl House! I have a question about your shawls.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-mono">WhatsApp: {SHOP_INFO.whatsappDisplay}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenWholesale}
              className="hidden sm:inline-flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              {isUrdu ? 'ہول سیل ریٹس' : 'Wholesale Inquiry'}
            </button>
            <span className="hidden sm:inline text-stone-600">·</span>
            <button
              onClick={onToggleLang}
              className="inline-flex items-center gap-1 text-stone-100 hover:text-white transition-colors font-semibold text-xs px-2.5 py-1 rounded-md bg-stone-800/90 border border-stone-700 hover:border-amber-400/60 whitespace-nowrap shrink-0"
              title="Switch Language (English / Urdu)"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </button>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-stone-100 hover:text-amber-300 transition-colors font-semibold text-xs px-2.5 py-1 rounded-md bg-stone-800/90 border border-stone-700 hover:border-amber-400/60 whitespace-nowrap shrink-0"
              title="Password Protected Owner Admin Panel"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{isUrdu ? 'ایڈمن' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header: Warm Ivory Retail App Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#CFC6B8] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-18 flex items-center justify-between gap-2 sm:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => {
              onSelectView('home');
              onSelectCategory('all');
            }}
            className="min-h-[44px] flex items-center font-serif-luxury text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-stone-900 hover:text-rose-700 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 focus:outline-none"
          >
            {isUrdu ? 'باری شال ہاؤس' : 'Bari Shawl House'}
          </button>

          {/* Zone 2: 5 concise single-line text links on Desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            {primaryNav.map((link) => {
              const isActive =
                link.isCategory && activeView === 'shop'
                  ? activeCategory === link.cat
                  : !link.isCategory && activeView === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 ${
                    isActive ? 'text-rose-700 font-bold' : 'text-stone-700'
                  }`}
                >
                  {isUrdu ? link.labelUr : link.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Wishlist + Quick Lang Toggle (Mobile) + Primary Bag Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenWishlist && (
              <button
                onClick={onOpenWishlist}
                className="min-h-[44px] px-2.5 sm:px-3 inline-flex items-center justify-center gap-1.5 text-stone-800 hover:text-rose-700 hover:bg-rose-50/60 active:scale-95 transition-all font-semibold text-xs rounded-xl border border-[#CFC6B8] bg-white whitespace-nowrap shrink-0"
                aria-label="View Saved Wishlist Items"
                title="Saved Items (Wishlist)"
              >
                <Heart
                  className={`w-4 h-4 shrink-0 ${
                    wishlistCount > 0 ? 'fill-rose-600 text-rose-600' : 'text-stone-700'
                  }`}
                />
                <span className="hidden md:inline">{isUrdu ? 'پسندیدہ' : 'Saved'}</span>
                {wishlistCount > 0 && (
                  <span className="font-mono text-[11px] font-bold text-rose-700">
                    ({wishlistCount})
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onToggleLang}
              className="lg:hidden min-h-[44px] px-2.5 inline-flex items-center justify-center gap-1 text-stone-800 hover:bg-stone-200/70 active:scale-95 transition-all font-semibold text-xs rounded-xl border border-[#CFC6B8] bg-white whitespace-nowrap shrink-0"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-rose-700 shrink-0" />
              <span>{lang === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            <button
              onClick={onOpenCart}
              className="min-h-[44px] inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 active:scale-95 rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-white shrink-0" />
              <span className="hidden sm:inline">{isUrdu ? 'شاپنگ بیگ' : 'Bag'}</span>
              <span className="font-mono tabular-nums text-xs bg-white text-rose-700 font-bold px-1.5 py-0.5 rounded">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-800 hover:text-stone-950 active:scale-95 lg:hidden rounded-xl bg-white hover:bg-stone-100 border border-[#CFC6B8] transition-all"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Slide-Down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-t border-[#CFC6B8] px-4 py-4 space-y-3 shadow-2xl max-h-[82dvh] overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-2 gap-2.5 pb-3 border-b border-[#D8D0C2]">
              <a
                href={`tel:${SHOP_INFO.phoneTel}`}
                className="min-h-[48px] flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-stone-900 bg-white active:bg-stone-100 rounded-xl border border-[#CFC6B8]"
              >
                <Phone className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Call {SHOP_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum Bari Shawl House! I want to ask about shawls.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-white bg-emerald-700 active:bg-emerald-800 rounded-xl"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp Chat</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {allMobileLinks.map((link) => {
                const isCurrent =
                  link.isCategory && activeView === 'shop'
                    ? activeCategory === link.cat
                    : !link.isCategory && activeView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link)}
                    className={`min-h-[46px] w-full text-left px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-between ${
                      isCurrent
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'text-stone-800 hover:bg-stone-200/70 active:bg-stone-300/60'
                    }`}
                  >
                    <span>{isUrdu ? link.labelUr : link.labelEn}</span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#D8D0C2] grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onOpenWholesale();
                  setMobileMenuOpen(false);
                }}
                className="min-h-[46px] py-2.5 px-3 text-xs font-bold text-rose-800 bg-rose-100/80 border border-rose-300 active:bg-rose-200 rounded-xl text-center"
              >
                {isUrdu ? 'ہول سیل ریٹس' : 'Wholesale Rates'}
              </button>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="min-h-[46px] py-2.5 px-3 text-xs font-bold text-stone-800 bg-white border border-[#CFC6B8] active:bg-stone-100 rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-rose-700" />
                <span>{isUrdu ? 'اونر ایڈمن پینل' : 'Owner Admin Panel'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Responsive Touch-Scrollable Category Bar: Warm Sandstone Surface */}
      <div className="bg-[#DFD7C8] text-stone-800 border-b border-[#C8BFA8]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory py-0.5 w-full md:w-auto">
            {[
              { id: 'all', en: 'All Items', ur: 'تمام ورائٹی' },
              { id: 'gents', en: "1. Gents’ Shawls", ur: 'مردانہ شالیں' },
              { id: 'ladies', en: "2. Ladies’ Shawls", ur: 'زنانی شالیں' },
              { id: 'bechgana', en: "3. Children’s (Bechgana)", ur: 'بچگانہ شالیں' },
              { id: 'rumaal', en: '4. Rumaal', ur: 'رومال' },
              { id: 'laungi', en: '5. Laungi', ur: 'ملتانی لونگی' },
            ].map((cat) => {
              const isSelected = activeView === 'shop' && activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id as ProductCategory);
                    onSelectView('shop');
                  }}
                  className={`snap-start min-h-[40px] px-3.5 py-1.5 rounded-xl font-semibold transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-rose-700 text-white shadow-xs font-bold'
                      : 'bg-[#FAF7F2] text-stone-800 hover:bg-white hover:text-rose-700 border border-[#C6BBA6] hover:border-rose-400'
                  }`}
                >
                  {isUrdu ? cat.ur : cat.en}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-stone-800">
            <button
              onClick={() => onSelectView('about')}
              className={`min-h-[36px] px-2 hover:text-rose-700 whitespace-nowrap shrink-0 font-semibold ${
                activeView === 'about' ? 'text-rose-700 font-bold' : ''
              }`}
            >
              {isUrdu ? 'دکان کا تعارف' : 'About Shop'}
            </button>
            <button
              onClick={() => onSelectView('faq')}
              className={`min-h-[36px] px-2 hover:text-rose-700 whitespace-nowrap shrink-0 font-semibold ${
                activeView === 'faq' ? 'text-rose-700 font-bold' : ''
              }`}
            >
              {isUrdu ? 'سوالات' : 'FAQs'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
