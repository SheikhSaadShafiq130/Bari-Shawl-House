/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Check, Heart, Star } from 'lucide-react';
import { Product, ProductColorOption, StudioAngleMode } from '../types';
import { TextileImage } from './TextileImage';
import { buildWhatsAppProductUrl, getProductColors } from '../data/products';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product, selectedColor?: ProductColorOption) => void;
  onAddToCart: (product: Product, quantity?: number, selectedColor?: ProductColorOption) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  lang: 'en' | 'ur';
  compactMobile?: boolean;
}

const CARD_ANGLES: { mode: StudioAngleMode; label: string }[] = [
  { mode: 'full', label: '1. Shawl' },
  { mode: 'wearing', label: '2. Wearing' },
  { mode: 'arm-drape', label: '3. On Arm' },
  { mode: 'macro-zoom', label: '4. Zoom' },
];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  lang,
  compactMobile = false,
}) => {
  const availableColors = getProductColors(product);
  const [selectedColor, setSelectedColor] = useState<ProductColorOption>(availableColors[0]);
  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const isUrdu = lang === 'ur';

  const currentColor =
    availableColors.find((c) => c.name === selectedColor?.name) || availableColors[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1, currentColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const whatsAppUrl = buildWhatsAppProductUrl(product, 1, currentColor);

  const customAngleImg =
    activeAngleIdx > 0 && product.galleryImages?.[activeAngleIdx - 1]
      ? product.galleryImages[activeAngleIdx - 1]
      : undefined;

  return (
    <article
      onClick={() => onQuickView(product, currentColor)}
      className="group relative flex flex-col bg-[#FDFBF7] border border-[#CFC6B8] hover:border-rose-600 active:border-rose-700 rounded-2xl overflow-hidden shadow-xs hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Area (Uncluttered Full Visibility) */}
      <div className="relative overflow-hidden bg-[#E6DFD3]">
        <TextileImage
          product={product}
          aspect="4/3"
          viewMode={CARD_ANGLES[activeAngleIdx].mode}
          selectedColor={currentColor}
          customOverrideImage={customAngleImg}
        />

        {/* Maximum 1 subtle text tag per card */}
        {(product.featured || product.isNew) && activeAngleIdx === 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-[#1E1B24]/88 text-amber-300 border border-amber-400/30 text-[10px] px-2.5 py-0.5 rounded-xs font-bold tracking-wide shadow-xs backdrop-blur-xs">
              {product.isNew
                ? isUrdu
                  ? 'نیا ڈیزائن'
                  : 'New Arrival'
                : isUrdu
                ? 'مقبول انتخاب'
                : 'Popular'}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center border shadow-xs transition-transform active:scale-90 ${
              isWishlisted
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white/90 hover:bg-white border-stone-300 text-stone-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        )}
      </div>

      {/* Clean Segmented 4-Photo Angle Switcher Bar Below Image */}
      {!compactMobile && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="grid grid-cols-4 bg-[#EFEAE1] border-y border-[#DED6C8] p-1 gap-1"
        >
          {CARD_ANGLES.map((ang, idx) => (
            <button
              key={ang.mode}
              type="button"
              onClick={() => setActiveAngleIdx(idx)}
              className={`py-1 px-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap truncate ${
                activeAngleIdx === idx
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {ang.label}
            </button>
          ))}
        </div>
      )}

      {/* Product Details Area */}
      <div
        className={`${
          compactMobile ? 'p-2.5 sm:p-5 gap-2.5 sm:gap-3' : 'p-4 sm:p-5 gap-3'
        } flex flex-col flex-1 justify-between`}
      >
        <div className="min-w-0">
          {/* Clean Unboxed Metadata with Typographic Separators & Rating */}
          <div className="flex items-center justify-between gap-1.5 text-[11px] sm:text-xs text-stone-600 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="shrink-0 font-bold text-stone-800">{product.material}</span>
              <span aria-hidden="true">·</span>
              <span className="shrink-0 text-emerald-800 font-bold">
                {product.inStock ? (isUrdu ? 'دستیاب' : 'In Stock') : isUrdu ? 'آرڈر پر' : 'On Order'}
              </span>
            </div>
            <span className="inline-flex items-center gap-0.5 font-mono tabular-nums font-bold text-stone-800 shrink-0">
              <span>{product.rating || 4.9}</span>
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            </span>
          </div>

          {/* Product Name */}
          <h3
            className={`font-serif-luxury ${
              compactMobile
                ? 'text-sm sm:text-xl line-clamp-2 sm:line-clamp-1'
                : 'text-lg sm:text-xl line-clamp-1'
            } font-bold text-stone-900 group-hover:text-rose-700 transition-colors leading-snug`}
          >
            {isUrdu ? product.nameUrdu : product.name}
          </h3>

          {/* Interactive Color Swatch Selector on Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2.5 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableColors.slice(0, 5).map((colOpt) => {
                const isSelected =
                  colOpt.name === currentColor.name && colOpt.hex === currentColor.hex;
                return (
                  <button
                    key={`${colOpt.name}-${colOpt.hex}`}
                    type="button"
                    onClick={() => setSelectedColor(colOpt)}
                    title={`Select color: ${colOpt.name}`}
                    aria-label={`Select color ${colOpt.name}`}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      isSelected
                        ? 'ring-2 ring-rose-700 ring-offset-1 scale-110 border-stone-900'
                        : 'border-stone-400 hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: colOpt.hex }}
                  />
                );
              })}
            </div>
            <span className="text-[11px] text-stone-600 font-medium truncate">
              {isUrdu && currentColor.nameUrdu ? currentColor.nameUrdu : currentColor.name}
            </span>
          </div>
        </div>

        {/* Price & Touch-Friendly Action Buttons */}
        <div className="pt-2.5 sm:pt-3 border-t border-[#E6DFD3] space-y-2.5 sm:space-y-3">
          <div className="flex items-baseline justify-between gap-1.5">
            <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
              <span
                className={`font-mono tabular-nums ${
                  compactMobile ? 'text-sm sm:text-lg' : 'text-base sm:text-lg'
                } font-bold text-stone-900 whitespace-nowrap`}
              >
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono tabular-nums text-[11px] sm:text-xs text-stone-400 line-through whitespace-nowrap">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span
              className={`text-xs text-rose-700 font-bold group-hover:underline whitespace-nowrap shrink-0 ${
                compactMobile ? 'hidden sm:inline' : ''
              }`}
            >
              {isUrdu ? 'تفصیل اور تصاویر' : 'Open Shawl View →'}
            </span>
          </div>

          <div
            className={`grid ${
              compactMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'
            } gap-2`}
          >
            <button
              type="button"
              onClick={handleAdd}
              className={`min-h-[42px] py-2 px-2.5 sm:px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-rose-700 hover:bg-rose-800 text-white active:scale-[0.97]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>{isUrdu ? 'شامل ہو گیا' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-white shrink-0" />
                  <span>{isUrdu ? 'بیگ میں ڈالیں' : 'Add to Bag'}</span>
                </>
              )}
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="min-h-[42px] py-2 px-2.5 sm:px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.97] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>{isUrdu ? 'واٹس ایپ آرڈر' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
