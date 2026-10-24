/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Phone, MessageCircle, Settings, Menu, X, Globe } from 'lucide-react';
import { SHOP_INFO } from '../data/products';
import { ProductCategory } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  activeView: string;
  onSelectView: (view: string) => void;
  cartCount: number;
  onOpenCart: () => void;
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
    { id: 'about', labelEn: 'About Our Shop', labelUr: 'ہمارے بارے میں', isCategory: false },
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
      {/* Top Utility Bar: Royal Midnight & Gold */}
      <div className="bg-slate-950 text-slate-200 text-xs border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-medium text-amber-400 truncate text-[11px] sm:text-xs">
              {isUrdu
                ? 'دکان نمبر 44، مکی بلاک، 14 نمبر ملتان'
                : 'Dukaan No. 44, Makki Block, 14 No. Multan'}
            </span>
            <span className="hidden md:inline text-slate-600">·</span>
            <a
              href={`tel:${SHOP_INFO.phoneTel}`}
              className="hidden md:inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{SHOP_INFO.phoneDisplay}</span>
            </a>
            <span className="hidden lg:inline text-slate-600">·</span>
            <a
              href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
                'Assalam-o-Alaikum Bari Textile Multan! I have a question about your shawls.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-mono">WhatsApp: {SHOP_INFO.whatsappDisplay}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenWholesale}
              className="hidden sm:inline-flex items-center text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              {isUrdu ? 'ہول سیل ریٹس' : 'Wholesale Inquiry'}
            </button>
            <span className="hidden sm:inline text-slate-600">·</span>
            <button
              onClick={onToggleLang}
              className="inline-flex items-center gap-1 text-slate-100 hover:text-white transition-colors font-medium text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-amber-500/40 whitespace-nowrap shrink-0"
              title="Switch Language (English / Urdu)"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </button>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-200 hover:text-amber-300 transition-colors text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-amber-500/40 whitespace-nowrap shrink-0"
              title="Manage Shop Products"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'ایڈمن' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header: Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-18 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => {
              onSelectView('home');
              onSelectCategory('all');
            }}
            className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-950 hover:text-rose-900 transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            {isUrdu ? 'باری ٹیکسٹائل ملتان' : 'Bari Textile Multan'}
          </button>

          {/* Zone 2: 5 concise single-line text links on Desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {primaryNav.map((link) => {
              const isActive =
                link.isCategory && activeView === 'shop'
                  ? activeCategory === link.cat
                  : !link.isCategory && activeView === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-slate-950 ${
                    isActive ? 'text-rose-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  {isUrdu ? link.labelUr : link.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCart}
              className="min-h-[40px] sm:min-h-[42px] inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="hidden xs:inline sm:inline">{isUrdu ? 'شاپنگ بیگ' : 'Bag'}</span>
              <span className="font-mono tabular-nums text-xs bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-700 hover:text-slate-950 lg:hidden rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Slide-Down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-xl max-h-[80dvh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
              <a
                href={`tel:${SHOP_INFO.phoneTel}`}
                className="min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-slate-900 bg-slate-100 rounded-xl"
              >
                <Phone className="w-4 h-4 text-rose-900 shrink-0" />
                <span>Call {SHOP_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum Bari Textile Multan! I want to ask about shawls.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-white bg-emerald-700 rounded-xl"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp Chat</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {allMobileLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className="min-h-[44px] w-full text-left px-3.5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>{isUrdu ? link.labelUr : link.labelEn}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenWholesale();
                  setMobileMenuOpen(false);
                }}
                className="min-h-[44px] py-2.5 text-xs font-semibold text-rose-950 bg-rose-50 border border-rose-200 rounded-xl text-center"
              >
                Wholesale Rates
              </button>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="min-h-[44px] py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 rounded-xl text-center"
              >
                Owner Admin Panel
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Responsive Touch-Scrollable Category Bar */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
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
                  className={`min-h-[34px] px-3 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {isUrdu ? cat.ur : cat.en}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-300">
            <button
              onClick={() => onSelectView('about')}
              className={`hover:text-white whitespace-nowrap shrink-0 ${
                activeView === 'about' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              {isUrdu ? 'دکان کا تعارف' : 'About Shop'}
            </button>
            <button
              onClick={() => onSelectView('faq')}
              className={`hover:text-white whitespace-nowrap shrink-0 ${
                activeView === 'faq' ? 'text-amber-400 font-semibold' : ''
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
