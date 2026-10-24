/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ShoppingBag, Phone, Check } from 'lucide-react';
import { Product } from '../types';
import { TextileImage } from './TextileImage';
import { buildWhatsAppProductUrl, SHOP_INFO } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenWholesaleForProduct: (product: Product) => void;
  lang: 'en' | 'ur';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenWholesaleForProduct,
  lang,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [product?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;
  const isUrdu = lang === 'ur';

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const whatsAppUrl = buildWhatsAppProductUrl(product, quantity);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92dvh] sm:max-h-[90dvh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-y-auto border border-stone-200 flex flex-col"
      >
        {/* Mobile Top Sticky Header Bar for Easy One-Handed Closing */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-stone-200 md:hidden">
          <span className="font-mono text-xs font-bold text-stone-600">{product.code}</span>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-700 hover:text-stone-900 bg-stone-100 rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Close Button */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 z-20 min-h-[40px] min-w-[40px] items-center justify-center text-stone-600 hover:text-stone-900 bg-white/90 hover:bg-white rounded-full shadow-xs transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Product Image & Quick Specs */}
          <div className="bg-stone-100 flex flex-col justify-between p-4 sm:p-6 border-b md:border-b-0 md:border-r border-stone-200">
            <div className="rounded-xl overflow-hidden border border-stone-200 bg-white">
              <TextileImage product={product} aspect="4/3" showOverlayCode={true} />
            </div>

            <div className="mt-4 bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 gap-2">
                <span className="text-stone-500">Item Code:</span>
                <span className="font-mono font-bold text-stone-900">{product.code}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 gap-2">
                <span className="text-stone-500">Material / Fabric:</span>
                <span className="font-semibold text-stone-900 text-right">{product.material}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 gap-2">
                <span className="text-stone-500">Size / Length:</span>
                <span className="font-mono text-stone-900 text-right">{product.dimensions}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-500">Color:</span>
                <span className="font-medium text-stone-900 flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                    style={{ backgroundColor: product.colorHex }}
                  />
                  {product.color}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Purchase Details */}
          <div className="p-5 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium">
                <span className="text-rose-800 font-semibold">{product.style}</span>
                <span aria-hidden="true">·</span>
                <span>{product.inStock ? 'In Stock at Shop' : 'Available on Order'}</span>
              </div>

              {/* Product Title */}
              <div>
                <h2
                  id="product-modal-title"
                  className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 leading-tight"
                >
                  {isUrdu ? product.nameUrdu : product.name}
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {isUrdu ? product.name : product.nameUrdu}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2 border-t border-stone-100">
                <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-slate-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="font-mono tabular-nums text-sm text-stone-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description & Wash Care */}
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p>{isUrdu ? product.descriptionUrdu : product.description}</p>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600">
                  <strong className="text-slate-900">Wash & Care: </strong>
                  {product.care}
                </div>
              </div>

              {/* Touch-Friendly Quantity Selector */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="min-h-[40px] min-w-[40px] bg-stone-100 hover:bg-stone-200 text-slate-800 text-sm font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-mono tabular-nums font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="min-h-[40px] min-w-[40px] bg-stone-100 hover:bg-stone-200 text-slate-800 text-sm font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-stone-600 font-mono tabular-nums">
                  Total: <strong>Rs. {(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-6 mt-6 border-t border-stone-200">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Order on WhatsApp ({SHOP_INFO.whatsappDisplay})</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    added
                      ? 'bg-rose-900 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {added ? <Check className="w-4 h-4 text-amber-400" /> : <ShoppingBag className="w-4 h-4 text-amber-400" />}
                  <span>{added ? 'Added to Bag' : 'Add to Shopping Bag'}</span>
                </button>

                <a
                  href={`tel:${SHOP_INFO.phoneTel}`}
                  className="min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-800 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-rose-800" />
                  <span>Call {SHOP_INFO.phoneDisplay}</span>
                </a>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWholesaleForProduct(product);
                  }}
                  className="text-xs text-rose-800 hover:text-rose-950 font-semibold underline py-1"
                >
                  Need 12+ pieces for your shop or a wedding? Click for Wholesale Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
