/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  ShoppingBag,
  Phone,
  Check,
  ZoomIn,
  ZoomOut,
  Heart,
  Star,
  Ruler,
  Truck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Product,
  ProductColorOption,
  ProductReview,
  StudioAngleMode,
} from '../types';
import { TextileImage } from './TextileImage';
import {
  buildWhatsAppProductUrl,
  SHOP_INFO,
  getProductColors,
  INITIAL_REVIEWS,
  DEFAULT_PRODUCT_REVIEWS,
} from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  initialColor?: ProductColorOption;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedColor?: ProductColorOption
  ) => void;
  onOpenWholesaleForProduct: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  lang: 'en' | 'ur';
}

const GALLERY_ANGLES: {
  mode: StudioAngleMode;
  labelEn: string;
  labelUr: string;
  shortEn: string;
}[] = [
  {
    mode: 'full',
    labelEn: '1. Full Shawl & Pallu',
    labelUr: '1. مکمل شال اور پلو',
    shortEn: '1. Shawl',
  },
  {
    mode: 'wearing',
    labelEn: '2. Shoulder Drape & Fall',
    labelUr: '2. پہننے کا انداز',
    shortEn: '2. Wearing',
  },
  {
    mode: 'arm-drape',
    labelEn: '3. Folded Arm Drape',
    labelUr: '3. بازو پر تہہ شدہ',
    shortEn: '3. On Arm',
  },
  {
    mode: 'macro-zoom',
    labelEn: '4. 2.2× Border & Weave Zoom',
    labelUr: '4. بارڈر اور کڑھائی زوم',
    shortEn: '4. Zoom',
  },
];

const DELIVERY_CITIES: Record<string, string> = {
  Multan: 'Same-Day / 24 Hours (Local Rider or Shop Pickup)',
  Lahore: '1 – 2 Working Days via TCS / Leopards',
  Islamabad: '2 – 3 Working Days via TCS / Leopards',
  Rawalpindi: '2 – 3 Working Days via TCS / Leopards',
  Karachi: '2 – 4 Working Days via TCS / Leopards',
  Faisalabad: '1 – 2 Working Days via TCS / Leopards',
  Bahawalpur: '1 – 2 Working Days via Daewoo / TCS',
  Peshawar: '2 – 3 Working Days via TCS / Leopards',
};

const STORAGE_KEY_CUSTOM_REVIEWS = 'bari_shawl_house_custom_reviews_v1';

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColor,
  onClose,
  onAddToCart,
  onOpenWholesaleForProduct,
  isWishlisted = false,
  onToggleWishlist,
  lang,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColorOption | undefined>(
    initialColor
  );
  const [activeInfoTab, setActiveInfoTab] = useState<'details' | 'size-guide' | 'reviews'>(
    'details'
  );
  const [selectedCity, setSelectedCity] = useState('Multan');

  // Customer review form state
  const [customReviewsMap, setCustomReviewsMap] = useState<Record<string, ProductReview[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('Multan');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setAdded(false);
    setZoomed(false);
    setActiveAngleIdx(0);
    setActiveInfoTab('details');
    const colors = getProductColors(product);
    setSelectedColor(initialColor || colors[0]);
  }, [product?.id, initialColor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setActiveAngleIdx((prev) => (prev - 1 + GALLERY_ANGLES.length) % GALLERY_ANGLES.length);
        setZoomed(false);
      }
      if (e.key === 'ArrowRight') {
        setActiveAngleIdx((prev) => (prev + 1) % GALLERY_ANGLES.length);
        setZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;
  const isUrdu = lang === 'ur';

  const availableColors = getProductColors(product);
  const currentColor = selectedColor || availableColors[0];
  const currentAngle = GALLERY_ANGLES[activeAngleIdx] || GALLERY_ANGLES[0];

  const customGalleryOverride =
    activeAngleIdx > 0 &&
    product.galleryImages &&
    product.galleryImages[activeAngleIdx - 1]
      ? product.galleryImages[activeAngleIdx - 1]
      : undefined;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, currentColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const whatsAppUrl = buildWhatsAppProductUrl(product, quantity, currentColor);

  const productReviews = [
    ...(customReviewsMap[product.id] || []),
    ...(INITIAL_REVIEWS[product.id] || DEFAULT_PRODUCT_REVIEWS),
  ];

  // Live bundle discount preview calculation
  const rawTotal = product.price * quantity;
  const bundleDiscountRate = quantity >= 4 ? 0.1 : quantity >= 2 ? 0.05 : 0;
  const discountedTotal = Math.round(rawTotal * (1 - bundleDiscountRate));

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      city: newReviewCity,
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verifiedColor: currentColor.name,
    };
    const updated = {
      ...customReviewsMap,
      [product.id]: [newRev, ...(customReviewsMap[product.id] || [])],
    };
    setCustomReviewsMap(updated);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_REVIEWS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[94dvh] sm:max-h-[90dvh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-[#C8BFA8] flex flex-col"
      >
        {/* =====================================================================
            DEDICATED TOP HEADER BAR (Zero Overlap on Both Mobile & Desktop)
           ===================================================================== */}
        <div className="shrink-0 bg-[#FAF7F2] border-b border-[#DED6C8] px-4 sm:px-6 pt-2 pb-2.5 sm:py-3 flex flex-col">
          {/* Mobile Pull Handle */}
          <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-2 sm:hidden" />

          <div className="flex items-center justify-between gap-3">
            {/* Left Metadata Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <span className="font-bold text-rose-800 whitespace-nowrap">
                {isUrdu ? 'باری شال ہاؤس' : 'Bari Shawl House'}
              </span>
              <span className="text-stone-400" aria-hidden="true">
                ·
              </span>
              <span className="font-mono font-bold text-stone-900 whitespace-nowrap">
                {product.code}
              </span>
              <span className="hidden xs:inline text-stone-400" aria-hidden="true">
                ·
              </span>
              <span className="hidden xs:inline font-semibold text-stone-700 truncate">
                {product.material}
              </span>
              <span className="hidden sm:inline text-stone-400" aria-hidden="true">
                ·
              </span>
              <span className="hidden sm:inline font-bold text-emerald-800 whitespace-nowrap">
                {product.inStock ? 'In Stock' : 'On Order'}
              </span>
            </div>

            {/* Right Actions: Wishlist & Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`min-h-[38px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-xl border transition-colors whitespace-nowrap ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white hover:bg-stone-100 border-[#CFC6B8] text-stone-700'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 shrink-0 ${
                      isWishlisted ? 'fill-rose-600 text-rose-600' : ''
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {isWishlisted ? 'Saved' : 'Save'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="min-h-[38px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-100 border border-[#CFC6B8] rounded-xl transition-colors whitespace-nowrap"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">{isUrdu ? 'بند کریں' : 'Close'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            MAIN 2-COLUMN BODY (Clean Split with Independent Desktop Scroll)
           ===================================================================== */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* -------------------------------------------------------------------
              LEFT COLUMN (7 cols on lg): MYNTRA-STYLE 4-ANGLE STUDIO GALLERY
             ------------------------------------------------------------------- */}
          <div className="lg:col-span-7 bg-[#EFEAE1] p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-[#D6CEC0]">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {/* Vertical Thumbnail Rail (Tablet/Desktop) & 4-Grid (Mobile) */}
              <div className="grid grid-cols-4 sm:flex sm:flex-col gap-2 sm:w-20 shrink-0">
                {GALLERY_ANGLES.map((angle, idx) => {
                  const isSelected = activeAngleIdx === idx;
                  const customThumb =
                    idx > 0 && product.galleryImages?.[idx - 1]
                      ? product.galleryImages[idx - 1]
                      : undefined;
                  return (
                    <button
                      key={angle.mode}
                      type="button"
                      onClick={() => {
                        setActiveAngleIdx(idx);
                        setZoomed(false);
                      }}
                      className={`group relative rounded-xl overflow-hidden border-2 transition-all text-left flex flex-col bg-white ${
                        isSelected
                          ? 'border-rose-700 ring-2 ring-rose-700/20 shadow-xs'
                          : 'border-[#CFC6B8] opacity-80 hover:opacity-100 hover:border-stone-500'
                      }`}
                    >
                      <TextileImage
                        product={product}
                        aspect="1/1"
                        viewMode={angle.mode}
                        selectedColor={currentColor}
                        customOverrideImage={customThumb}
                      />
                      <span
                        className={`block w-full text-center text-[10px] font-bold py-1 px-0.5 truncate ${
                          isSelected
                            ? 'bg-rose-700 text-white'
                            : 'bg-[#FAF7F2] text-stone-800'
                        }`}
                      >
                        {angle.shortEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Main Interactive Studio Stage */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="relative rounded-2xl overflow-hidden border border-[#C8BFA8] bg-white shadow-sm">
                  <div
                    onClick={() => setZoomed(!zoomed)}
                    className={`transition-transform duration-300 ${
                      zoomed
                        ? 'scale-150 origin-center cursor-zoom-out'
                        : 'cursor-zoom-in'
                    }`}
                  >
                    <TextileImage
                      product={product}
                      aspect="4/3"
                      showOverlayCode={!zoomed}
                      viewMode={currentAngle.mode}
                      selectedColor={currentColor}
                      customOverrideImage={customGalleryOverride}
                    />
                  </div>

                  {/* Prev / Next Photo Arrows (Hidden while zoomed for clean inspection) */}
                  {!zoomed && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAngleIdx(
                            (prev) =>
                              (prev - 1 + GALLERY_ANGLES.length) % GALLERY_ANGLES.length
                          );
                          setZoomed(false);
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-900 border border-stone-300 shadow-xs flex items-center justify-center active:scale-95 transition-transform"
                        aria-label="Previous angle photo"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAngleIdx((prev) => (prev + 1) % GALLERY_ANGLES.length);
                          setZoomed(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-900 border border-stone-300 shadow-xs flex items-center justify-center active:scale-95 transition-transform"
                        aria-label="Next angle photo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Zoom Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setZoomed(!zoomed)}
                    className="absolute bottom-2.5 right-2.5 z-10 min-h-[34px] px-3 py-1 bg-white/95 hover:bg-white text-stone-900 text-[11px] font-bold rounded-lg shadow-xs backdrop-blur-xs flex items-center gap-1.5 border border-stone-300 active:scale-95"
                  >
                    {zoomed ? (
                      <>
                        <ZoomOut className="w-3.5 h-3.5 text-rose-700" />
                        <span>Reset Zoom</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="w-3.5 h-3.5 text-rose-700" />
                        <span>Zoom Weave</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Active Angle Title & Photo Counter */}
                <div className="mt-2.5 flex items-center justify-between gap-2 px-1 text-xs">
                  <span className="font-bold text-stone-900 truncate">
                    {isUrdu ? currentAngle.labelUr : currentAngle.labelEn}
                  </span>
                  <span className="font-mono tabular-nums text-[11px] text-stone-600 shrink-0">
                    Angle {activeAngleIdx + 1} of 4
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Unboxed Specification Strip Below Gallery */}
            <div className="mt-4 pt-3.5 border-t border-[#D6CEC0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">Dimensions</span>
                <span className="font-mono tabular-nums font-bold text-stone-900">
                  {product.dimensions.split('(')[0].trim()}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Fabric Quality</span>
                <span className="font-bold text-stone-900">{product.material}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Weight &amp; Warmth</span>
                <span className="font-mono tabular-nums font-bold text-stone-900">
                  {product.weightGrams || 650}g · {product.warmthLevel?.split(' ')[0] || 'Winter'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Active Color</span>
                <span className="font-bold text-rose-700 flex items-center gap-1.5 truncate">
                  <span
                    className="w-3 h-3 rounded-full border border-stone-400 shrink-0"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <span className="truncate">{currentColor.name}</span>
                </span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              RIGHT COLUMN (5 cols on lg): CONTIGUOUS PURCHASE MODULE & DETAILS
             ------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF7F2] lg:overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-5">
              {/* 1. Product Title, Urdu Subtitle & Rating Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                    {product.style}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('reviews')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-rose-700 transition-colors shrink-0"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-mono tabular-nums">{product.rating || 4.9}</span>
                    <span className="text-stone-400">·</span>
                    <span className="underline text-stone-600">
                      {productReviews.length + (product.reviewCount || 28)} Reviews
                    </span>
                  </button>
                </div>

                <h2
                  id="product-modal-title"
                  className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 leading-tight"
                >
                  {isUrdu ? product.nameUrdu : product.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  {isUrdu ? product.name : product.nameUrdu}
                </p>

                {/* Price & Savings Row */}
                <div className="flex flex-wrap items-baseline gap-2.5 pt-2">
                  <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-stone-900">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="font-mono tabular-nums text-sm text-stone-400 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 2. User-Selectable Color Swatches (Clean Hairline Section) */}
              <div className="pt-4 border-t border-[#E2DACB] space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-stone-900 uppercase tracking-wide">
                    {isUrdu ? 'رنگ منتخب کریں:' : 'Select Available Color:'}
                  </span>
                  <span className="font-bold text-rose-700">
                    {isUrdu && currentColor.nameUrdu
                      ? currentColor.nameUrdu
                      : currentColor.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {availableColors.map((colOption) => {
                    const isSelected =
                      colOption.name === currentColor.name &&
                      colOption.hex === currentColor.hex;
                    return (
                      <button
                        key={`${colOption.name}-${colOption.hex}`}
                        type="button"
                        onClick={() => setSelectedColor(colOption)}
                        className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-white border-rose-700 text-stone-950 ring-2 ring-rose-700/20 font-bold shadow-2xs'
                            : 'bg-white/70 border-[#CFC6B8] text-stone-700 hover:bg-white hover:border-stone-500'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-stone-400 flex items-center justify-center shrink-0"
                          style={{ backgroundColor: colOption.hex }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-2.5 h-2.5 ${
                                [
                                  '#F5F2EB',
                                  '#EAE0C8',
                                  '#F3EFE6',
                                  '#F8FAFC',
                                  '#FBCFE8',
                                  '#D1FAE5',
                                ].includes(colOption.hex.toUpperCase())
                                  ? 'text-stone-900'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </span>
                        <span>
                          {isUrdu && colOption.nameUrdu
                            ? colOption.nameUrdu
                            : colOption.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Quantity Stepper & Live Bundle Savings */}
              <div className="pt-4 border-t border-[#E2DACB] space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      {isUrdu ? 'تعداد:' : 'Quantity:'}
                    </span>
                    <div className="inline-flex items-center border border-[#BFB5A2] rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="min-h-[38px] min-w-[38px] bg-stone-100 hover:bg-stone-200 text-stone-900 text-base font-bold flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1 text-sm font-mono tabular-nums font-bold text-stone-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="min-h-[38px] min-w-[38px] bg-stone-100 hover:bg-stone-200 text-stone-900 text-base font-bold flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <span className="text-[11px] text-stone-500 block">Subtotal</span>
                    <div className="flex items-baseline justify-end gap-1.5">
                      {bundleDiscountRate > 0 && (
                        <span className="text-xs text-stone-400 line-through">
                          Rs. {rawTotal.toLocaleString()}
                        </span>
                      )}
                      <strong className="text-rose-700 text-base font-bold">
                        Rs. {discountedTotal.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bundle Tier Status */}
                <div className="flex items-center justify-between text-[11px] text-stone-700 bg-[#EFEAE1] px-3 py-2 rounded-lg">
                  <span>
                    {bundleDiscountRate === 0.1
                      ? '✓ 10% Family Bundle Discount Applied!'
                      : bundleDiscountRate === 0.05
                      ? '✓ 5% Bundle Discount Applied! (Add 4+ for 10% OFF)'
                      : 'Bundle Offer: Buy 2+ for 5% OFF · Buy 4+ for 10% OFF'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWholesaleForProduct(product);
                    }}
                    className="font-bold text-rose-700 hover:underline shrink-0 ml-2"
                  >
                    12+ Wholesale?
                  </button>
                </div>
              </div>

              {/* 4. Clean Unboxed Segmented Tabs (Zero Inner Scrollbar!) */}
              <div className="pt-4 border-t border-[#E2DACB] space-y-3">
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#EFEAE1] rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('details')}
                    className={`py-2 px-2 rounded-lg text-center transition-all whitespace-nowrap ${
                      activeInfoTab === 'details'
                        ? 'bg-white text-rose-700 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Overview &amp; Care
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('size-guide')}
                    className={`py-2 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                      activeInfoTab === 'size-guide'
                        ? 'bg-white text-rose-700 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5 shrink-0" />
                    <span>Size Guide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('reviews')}
                    className={`py-2 px-2 rounded-lg text-center transition-all whitespace-nowrap ${
                      activeInfoTab === 'reviews'
                        ? 'bg-white text-rose-700 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                {/* Tab Panel Content (Flows naturally without nested scrollbar) */}
                <div className="text-xs text-stone-700 space-y-3 pt-1">
                  {activeInfoTab === 'details' && (
                    <>
                      <p className="leading-relaxed text-stone-800">
                        {isUrdu ? product.descriptionUrdu : product.description}
                      </p>

                      <div className="py-2.5 border-y border-[#E2DACB] space-y-1.5 text-[11px]">
                        <div className="flex justify-between gap-2">
                          <span className="text-stone-500">Weave &amp; Craft:</span>
                          <strong className="text-stone-900 text-right">{product.style}</strong>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-stone-500">Full Dimensions:</span>
                          <strong className="text-stone-900 font-mono text-right">
                            {product.dimensions}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-stone-500">Wash &amp; Care:</span>
                          <strong className="text-stone-900 text-right">{product.care}</strong>
                        </div>
                      </div>

                      {/* City Delivery Estimator */}
                      <div className="flex flex-col gap-1.5 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>Estimated Delivery to:</span>
                          </span>
                          <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-[#C8BFA8] bg-white text-stone-900 font-bold text-xs focus:outline-none focus:border-rose-700"
                          >
                            {Object.keys(DELIVERY_CITIES).map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-semibold">
                          ✓ {DELIVERY_CITIES[selectedCity]} · Cash on Delivery Available
                        </p>
                      </div>
                    </>
                  )}

                  {activeInfoTab === 'size-guide' && (
                    <div className="space-y-2.5">
                      <p className="font-bold text-stone-900">
                        Bari Shawl House Standard Measurement Chart:
                      </p>
                      <div className="divide-y divide-[#E2DACB] border-y border-[#E2DACB] text-[11px]">
                        <div className="flex justify-between py-2">
                          <span className="font-semibold text-stone-800">Gents Full Lohi / Shawl</span>
                          <span className="font-mono tabular-nums text-rose-700 font-bold">
                            2.55 × 1.38m (100 × 54 in)
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="font-semibold text-stone-800">Ladies Bridal / Formal</span>
                          <span className="font-mono tabular-nums text-rose-700 font-bold">
                            2.50 × 1.35m (98 × 53 in)
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="font-semibold text-stone-800">Bechgana (Youth &lt;16 yrs)</span>
                          <span className="font-mono tabular-nums text-rose-700 font-bold">
                            2.10 × 1.10m (82 × 43 in)
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="font-semibold text-stone-800">Multani Rumaal Square</span>
                          <span className="font-mono tabular-nums text-rose-700 font-bold">
                            1.40 × 1.40m (55 × 55 in)
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        All shawls include an additional 3-inch hand-knotted bumble tassel fringe on both ends.
                      </p>
                    </div>
                  )}

                  {activeInfoTab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="divide-y divide-[#E2DACB] border-y border-[#E2DACB]">
                        {productReviews.map((rev) => (
                          <div key={rev.id} className="py-2.5 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900">
                                {rev.author}{' '}
                                <span className="text-stone-500 font-normal">({rev.city})</span>
                              </span>
                              <span className="flex items-center gap-0.5 text-amber-500">
                                {Array.from({ length: rev.rating }).map((_, idx) => (
                                  <Star key={idx} className="w-3 h-3 fill-amber-500" />
                                ))}
                              </span>
                            </div>
                            {rev.verifiedColor && (
                              <span className="text-[10px] text-emerald-800 font-semibold block">
                                ✓ Verified Purchase · Color: {rev.verifiedColor}
                              </span>
                            )}
                            <p className="text-stone-700 text-[11px] leading-relaxed">
                              {rev.comment}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Write a Review Form */}
                      <form onSubmit={handleReviewSubmit} className="space-y-2 pt-1">
                        <span className="font-bold text-stone-900 block">
                          Add Your Review:
                        </span>
                        {reviewSubmitted && (
                          <p className="text-emerald-700 font-bold text-[11px]">
                            Thank you! Your review has been published.
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            className="px-2.5 py-1.5 border border-[#C8BFA8] rounded-lg bg-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Your City"
                            value={newReviewCity}
                            onChange={(e) => setNewReviewCity(e.target.value)}
                            className="px-2.5 py-1.5 border border-[#C8BFA8] rounded-lg bg-white text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold">Rating:</span>
                          {[5, 4, 3].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setNewReviewRating(r)}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                                newReviewRating === r
                                  ? 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-white text-stone-700 border-stone-300'
                              }`}
                            >
                              {r} ★
                            </button>
                          ))}
                        </div>
                        <textarea
                          rows={2}
                          required
                          placeholder="Share your feedback on wool softness and color..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-[#C8BFA8] rounded-lg bg-white text-xs"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-xs"
                        >
                          Post Review
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================================
                STICKY BOTTOM PURCHASE BAR (Clean, Contiguous & Responsive)
               ================================================================= */}
            <div className="sticky bottom-0 z-20 p-3.5 sm:px-6 sm:py-4 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#DED6C8] space-y-2 pb-safe">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`min-h-[46px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-xs whitespace-nowrap ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-rose-700 hover:bg-rose-800 text-white'
                  }`}
                >
                  {added ? (
                    <Check className="w-4 h-4 text-white shrink-0" />
                  ) : (
                    <ShoppingBag className="w-4 h-4 text-white shrink-0" />
                  )}
                  <span>
                    {added
                      ? 'Added to Bag ✓'
                      : `${isUrdu ? 'بیگ میں ڈالیں' : 'Add to Bag'} · Rs. ${discountedTotal.toLocaleString()}`}
                  </span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{isUrdu ? 'واٹس ایپ آرڈر' : 'Order on WhatsApp'}</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-600 pt-0.5 px-0.5">
                <span>
                  Selected: <strong className="text-stone-900">{currentColor.name}</strong>
                </span>
                <a
                  href={`tel:${SHOP_INFO.phoneTel}`}
                  className="inline-flex items-center gap-1 font-bold text-stone-800 hover:text-rose-700"
                >
                  <Phone className="w-3 h-3 text-rose-700" />
                  <span>Call {SHOP_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
