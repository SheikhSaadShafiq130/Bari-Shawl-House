/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { TextileImage } from './TextileImage';
import { buildWhatsAppProductUrl } from '../data/products';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  lang: 'en' | 'ur';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  lang,
}) => {
  const [added, setAdded] = useState(false);
  const isUrdu = lang === 'ur';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const whatsAppUrl = buildWhatsAppProductUrl(product, 1);

  return (
    <article
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white border border-slate-200/90 hover:border-rose-900/40 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative overflow-hidden bg-slate-100">
        <TextileImage product={product} aspect="4/3" />

        {/* Subtle maximum 1 text tag per card */}
        {(product.featured || product.isNew) && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-slate-950/90 text-amber-300 border border-amber-400/30 text-[10px] px-2.5 py-0.5 rounded-xs font-semibold tracking-wide backdrop-blur-xs">
              {product.isNew ? (isUrdu ? 'نیا ڈیزائن' : 'New Arrival') : isUrdu ? 'مقبول انتخاب' : 'Popular Choice'}
            </span>
          </div>
        )}
      </div>

      {/* Product Details Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3.5">
        <div className="min-w-0">
          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 truncate">
            <span className="shrink-0 font-medium text-slate-700">{product.material}</span>
            <span aria-hidden="true">·</span>
            <span className="shrink-0 text-emerald-700 font-medium">
              {product.inStock ? (isUrdu ? 'دستیاب ہے' : 'In Stock') : isUrdu ? 'آرڈر پر تیار' : 'On Order'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.dimensions.split('(')[0].trim()}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-slate-950 group-hover:text-rose-900 transition-colors line-clamp-1">
            {isUrdu ? product.nameUrdu : product.name}
          </h3>

          {/* Simple 2-line Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
            {isUrdu ? product.descriptionUrdu : product.description}
          </p>
        </div>

        {/* Price & Touch-Friendly Action Buttons */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="font-mono tabular-nums text-base sm:text-lg font-bold text-rose-950 whitespace-nowrap">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono tabular-nums text-xs text-slate-400 line-through whitespace-nowrap">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-rose-900 font-semibold group-hover:underline whitespace-nowrap shrink-0">
              {isUrdu ? 'تفصیل دیکھیں' : 'View Details'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className={`min-h-[42px] py-2 px-2.5 sm:px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                added
                  ? 'bg-rose-900 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.98]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{isUrdu ? 'شامل ہو گیا' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isUrdu ? 'بیگ میں ڈالیں' : 'Add to Bag'}</span>
                </>
              )}
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="min-h-[42px] py-2 px-2.5 sm:px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{isUrdu ? 'واٹس ایپ آرڈر' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
