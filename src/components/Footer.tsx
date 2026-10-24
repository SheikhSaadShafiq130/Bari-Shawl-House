/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, MessageCircle, MapPin, Settings } from 'lucide-react';
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
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Shop Identity & Contact */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-serif-luxury text-2xl font-bold text-white tracking-wide block">
              Bari Textile Multan
            </span>
            <p className="text-amber-400 font-urdu text-base -mt-1 block">
              {SHOP_INFO.nameUrdu}
            </p>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Trusted shop in Multan Wholesale Market for pure wool gents’ shawls, embroidered velvet ladies’ shawls, soft children’s shawls (Bechgana), cotton rumaal, and traditional Multani laungi.
            </p>

            <div className="pt-2 space-y-2 text-slate-300 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{SHOP_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${SHOP_INFO.phoneTel}`} className="hover:text-white transition-colors font-mono">
                  Phone / JazzCash / EasyPaisa: {SHOP_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${SHOP_INFO.whatsappIntl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors font-mono"
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
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('gents');
                    onSelectView('shop');
                  }}
                  className="hover:text-white transition-colors text-left"
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
                  className="hover:text-white transition-colors text-left"
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
                  className="hover:text-white transition-colors text-left"
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
                  className="hover:text-white transition-colors text-left"
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
                  className="hover:text-white transition-colors text-left"
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
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onSelectView('about')} className="hover:text-white transition-colors">
                  About Bari Textile Multan
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('contact')} className="hover:text-white transition-colors">
                  Contact & Shop Map
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('faq')} className="hover:text-white transition-colors">
                  Common Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={onOpenWholesale} className="hover:text-white transition-colors text-amber-400 font-semibold">
                  Wholesale Bulk Inquiry
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('handover')} className="hover:text-white transition-colors">
                  Owner Guide & Checklist
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Hours, Payment Accounts & Delivery */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white tracking-wide">
              Payment & Delivery
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Meezan Bank:</span>
                <span className="font-mono font-bold text-amber-400">{SHOP_INFO.bankAccountNumber}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">JazzCash:</span>
                <span className="font-mono font-bold text-white">{SHOP_INFO.jazzCashDisplay}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">EasyPaisa:</span>
                <span className="font-mono font-bold text-white">{SHOP_INFO.easyPaisaDisplay}</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {SHOP_INFO.timings}. Cash on Delivery (COD) available across Pakistan.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bari Textile Multan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectView('handover')}
              className="hover:text-slate-300 transition-colors"
            >
              Owner Guide
            </button>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Owner Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
