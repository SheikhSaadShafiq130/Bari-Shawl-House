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
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92dvh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-300 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-slate-950 text-white p-5 sm:p-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1 pr-10">
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Multan Wholesale Market · Makki Block</span>
          </div>
          <h2 id="wholesale-modal-title" className="font-serif-luxury text-xl sm:text-2xl font-bold pr-8">
            {isUrdu ? 'ہول سیل ریٹ لسٹ اور بلک آرڈر' : 'Wholesale & Bulk Order Inquiry'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Special wholesale prices for shopkeepers, clothing boutiques, and wedding bulk orders (Minimum 12 pieces).
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Shop or Business Name</label>
              <input
                type="text"
                placeholder="e.g. Al-Madina Cloth House"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Your City</label>
              <input
                type="text"
                placeholder="e.g. Multan, Lahore, Bahawalpur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 bg-white"
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
              <label className="block font-semibold text-stone-700 mb-1">Estimated Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 bg-white"
              >
                <option value="12">12 Pieces (1 Dozen)</option>
                <option value="24">24 Pieces (2 Dozen)</option>
                <option value="50">50 Pieces</option>
                <option value="100+">100+ Pieces (Full Bale)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Details or Questions (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Write any fabric, color, or design details you need..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="min-h-[46px] w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Send Wholesale Inquiry on WhatsApp ({SHOP_INFO.whatsappDisplay})</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-600 pt-1">
              <Phone className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>Or call shop directly:</span>
              <a
                href={`tel:${SHOP_INFO.phoneTel}`}
                className="font-mono font-bold text-stone-900 hover:underline"
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
