/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, MessageCircle, MapPin, Lock } from 'lucide-react';
import { SHOP_INFO } from '../data/products';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectView: (view: string) => void;
  onOpenAdmin: () => void;
  onOpenWholesale: () => void;
  lang: 'en' | 'ur';
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectView,
  onOpenAdmin,
  onOpenWholesale,
}) => {
  return (
    <footer className="bg-[#1B181F] text-stone-300 border-t border-stone-800 text-xs pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Shop Identity & Contact */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-serif-luxury text-2xl font-bold text-white tracking-wide block">
              Bari Shawl House
            </span>
            <p className="text-amber-400 font-urdu text-base -mt-1 block font-semibold">
              {SHOP_INFO.nameUrdu}
            </p>
            <p className="text-stone-300 leading-relaxed text-xs max-w-sm">
              Trusted shop in Multan Wholesale Market for pure wool gents’ shawls, embroidered velvet ladies’ shawls, soft children’s shawls (Bechgana), cotton rumaal, and traditional Multani laungi.
            </p>

            <div className="pt-2 space-y-2 text-stone-200 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{SHOP_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${SHOP_INFO.phoneTel}`}
                  className="hover:text-amber-300 transition-colors font-mono font-semibold"
                >
                  Phone / JazzCash / EasyPaisa: {SHOP_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${SHOP_INFO.whatsappIntl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors font-mono font-semibold text-emerald-400"
                >
                  WhatsApp: {SHOP_INFO.whatsappDisplay}
                </a>
              </div>
            </div>
          </div>

          {/* 5 Product Categories */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white tracking-wide">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('gents');
                    onSelectView('shop');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  1. Gents’ Shawls
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('ladies');
                    onSelectView('shop');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  2. Ladies’ Shawls
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('bechgana');
                    onSelectView('shop');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  3. Children’s Shawls (Bechgana)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('rumaal');
                    onSelectView('shop');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  4. Rumaal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('laungi');
                    onSelectView('shop');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  5. Laungi
                </button>
              </li>
            </ul>
          </div>

          {/* Helpful Pages */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white tracking-wide">
              Helpful Links
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li>
                <button
                  onClick={() => onSelectView('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Bari Shawl House
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact &amp; Shop Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Common Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWholesale}
                  className="hover:text-amber-300 transition-colors text-amber-400 font-semibold"
                >
                  Wholesale Bulk Inquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('handover')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Owner Guide &amp; Checklist
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Hours, Payment Accounts & Delivery */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white tracking-wide">
              Payment &amp; Delivery
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-700/80 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-400">Meezan Bank:</span>
                <span className="font-mono font-bold text-amber-400">
                  {SHOP_INFO.bankAccountNumber}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-400">JazzCash:</span>
                <span className="font-mono font-bold text-stone-100">
                  {SHOP_INFO.jazzCashDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-400">EasyPaisa:</span>
                <span className="font-mono font-bold text-stone-100">
                  {SHOP_INFO.easyPaisaDisplay}
                </span>
              </div>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              {SHOP_INFO.timings}. Cash on Delivery (COD) available across Pakistan.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Bari Shawl House, Multan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectView('handover')}
              className="hover:text-white transition-colors"
            >
              Owner Guide
            </button>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-stone-300 hover:text-amber-400 transition-colors font-medium"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Admin (Password Protected)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
