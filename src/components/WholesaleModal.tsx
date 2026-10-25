/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Building2, Phone } from 'lucide-react';
import { Product } from '../types';
import { SHOP_INFO, buildWhatsAppWholesaleUrl } from '../data/products';

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
  lang: 'en' | 'ur';
}

export const WholesaleModal: React.FC<WholesaleModalProps> = ({
  isOpen,
  onClose,
  preselectedProduct,
  lang,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Multan');
  const [category, setCategory] = useState<string>('gents');
  const [quantity, setQuantity] = useState('12');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    if (preselectedProduct) {
      setCategory(preselectedProduct.category);
      setRequirements(
        `Asking for wholesale price of ${preselectedProduct.name} (${preselectedProduct.code})`
      );
    } else {
      setCategory('gents');
      setRequirements('');
    }
  }, [preselectedProduct, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const isUrdu = lang === 'ur';

  const whatsAppUrl = buildWhatsAppWholesaleUrl({
    businessName: businessName || 'Shopkeeper / Customer',
    contactPerson: contactPerson || 'Valued Buyer',
    phone: phone || 'Not provided',
    city: city || 'Multan',
    category,
    quantity,
    requirements,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wholesale-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92dvh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-y-auto overscroll-contain flex flex-col"
      >
        <div className="bg-slate-50 text-slate-900 border-b border-slate-200 px-5 pb-5 pt-3 sm:p-6 sticky top-0 z-10">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-95 rounded-full bg-white border border-slate-200 hover:bg-slate-100 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-1 pr-10">
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Multan Wholesale Market · Makki Block</span>
          </div>
          <h2 id="wholesale-modal-title" className="font-serif-luxury text-xl sm:text-2xl font-bold text-slate-900 pr-8">
            {isUrdu ? 'ہول سیل ریٹ لسٹ اور بلک آرڈر' : 'Wholesale & Bulk Order Inquiry'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Special wholesale prices for shopkeepers, clothing boutiques, and wedding bulk orders (Minimum 12 pieces).
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-3.5 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shop or Business Name</label>
              <input
                type="text"
                placeholder="e.g. Al-Madina Cloth House"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your City</label>
              <input
                type="text"
                placeholder="e.g. Multan, Lahore, Bahawalpur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 bg-white"
              >
                <option value="gents">1. Gents’ Shawls</option>
                <option value="ladies">2. Ladies’ Shawls</option>
                <option value="bechgana">3. Children’s Shawls (Bechgana)</option>
                <option value="rumaal">4. Rumaal</option>
                <option value="laungi">5. Laungi</option>
                <option value="mixed">Mixed Assorted Variety</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 bg-white"
              >
                <option value="12">12 Pieces (1 Dozen)</option>
                <option value="24">24 Pieces (2 Dozen)</option>
                <option value="50">50 Pieces</option>
                <option value="100+">100+ Pieces (Full Bale)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Details or Questions (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Write any fabric, color, or design details you need..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3.5 py-2 text-base sm:text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
            />
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 -mb-4 sm:mx-0 sm:mb-0 p-3.5 sm:p-0 sm:pt-2 bg-white/95 backdrop-blur-md border-t sm:border-t-0 border-slate-200 space-y-2.5 pb-safe">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="min-h-[48px] w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Send Wholesale Inquiry on WhatsApp ({SHOP_INFO.whatsappDisplay})</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 pt-0.5">
              <Phone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Or call shop directly:</span>
              <a
                href={`tel:${SHOP_INFO.phoneTel}`}
                className="font-mono font-bold text-slate-900 hover:text-rose-600 hover:underline py-1"
              >
                {SHOP_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
