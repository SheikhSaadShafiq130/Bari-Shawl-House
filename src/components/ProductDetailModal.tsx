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
  Sparkles,
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
    shortEn: 'Full Shawl',
  },
  {
    mode: 'wearing',
    labelEn: '2. Wearing / Shoulder Drape',
    labelUr: '2. پہننے کا انداز',
    shortEn: 'Wearing View',
  },
  {
    mode: 'arm-drape',
    labelEn: '3. Hanging on Forearm',
    labelUr: '3. بازو پر لٹکائے ہوئے',
    shortEn: 'On Arm',
  },
  {
    mode: 'macro-zoom',
    labelEn: '4. Border & Bumble Close-Up',
    labelUr: '4. بارڈر اور جھالر زوم',
    shortEn: 'Border Zoom',
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
    setTimeout(() => setAdded(false), 1500);
  };

  const whatsAppUrl = buildWhatsAppProductUrl(product, quantity, currentColor);

  const productReviews = [
    ...(customReviewsMap[product.id] || []),
    ...(INITIAL_REVIEWS[product.id] || DEFAULT_PRODUCT_REVIEWS),
  ];

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
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[94dvh] sm:max-h-[92dvh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-y-auto overscroll-contain border border-[#C8BFA8] flex flex-col"
      >
        {/* Mobile Top Sticky Header Bar with Sheet Handle */}
        <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D6CEC0] md:hidden">
          <div className="w-10 h-1.5 bg-stone-400 rounded-full mx-auto mt-2.5 mb-1" />
          <div className="flex items-center justify-between px-4 pb-2.5 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                {product.code}
              </span>
              <span className="text-xs font-semibold text-stone-700 truncate">
                {product.material}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`min-h-[42px] min-w-[42px] flex items-center justify-center rounded-full border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white border-stone-300 text-stone-600'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              )}
              <button
                onClick={onClose}
                className="min-h-[42px] min-w-[42px] -mr-1 flex items-center justify-center text-stone-700 hover:text-stone-900 active:scale-95 bg-stone-200/80 rounded-full transition-transform"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Close & Wishlist Buttons */}
        <div className="hidden md:flex absolute top-4 right-4 z-30 items-center gap-2">
          {onToggleWishlist && (
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className={`min-h-[44px] px-3.5 flex items-center gap-1.5 text-xs font-bold rounded-full border shadow-xs transition-colors ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white/95 hover:bg-stone-100 border-stone-300 text-stone-700'
              }`}
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-700 hover:text-stone-950 bg-white/95 hover:bg-stone-100 border border-stone-300 rounded-full shadow-xs transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* =================================================================
              LEFT COLUMN (7 cols on lg): MYNTRA-STYLE 4-PHOTO STUDIO GALLERY
             ================================================================= */}
          <div className="lg:col-span-7 bg-[#EFEAE1] flex flex-col justify-between p-3.5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#D6CEC0]">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {/* Myntra Vertical Thumbnail Rail (Desktop/Tablet) & Horizontal Strip (Mobile) */}
              <div className="grid grid-cols-4 sm:flex sm:flex-col gap-2 sm:w-22 shrink-0">
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
                          ? 'border-rose-700 ring-2 ring-rose-700/25 shadow-sm'
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
                        className={`block w-full text-center text-[10px] font-bold py-1 px-1 truncate ${
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

              {/* Main Interactive Myntra Stage */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="relative rounded-2xl overflow-hidden border border-[#C8BFA8] bg-white shadow-sm">
                  <div
                    onClick={() => setZoomed(!zoomed)}
                    className={`transition-transform duration-300 cursor-zoom-in ${
                      zoomed ? 'scale-135 origin-center cursor-zoom-out' : ''
                    }`}
                  >
                    <TextileImage
                      product={product}
                      aspect="4/3"
                      showOverlayCode={activeAngleIdx === 0}
                      viewMode={currentAngle.mode}
                      selectedColor={currentColor}
                      customOverrideImage={customGalleryOverride}
                    />
                  </div>

                  {/* Prev / Next Photo Arrows */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAngleIdx(
                        (prev) => (prev - 1 + GALLERY_ANGLES.length) % GALLERY_ANGLES.length
                      );
                      setZoomed(false);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-900 border border-stone-300 shadow-sm flex items-center justify-center active:scale-95"
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
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-900 border border-stone-300 shadow-sm flex items-center justify-center active:scale-95"
                    aria-label="Next angle photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Zoom Button */}
                  <button
                    type="button"
                    onClick={() => setZoomed(!zoomed)}
                    className="absolute bottom-2.5 right-2.5 z-10 min-h-[36px] px-3 py-1 bg-white/95 text-stone-900 text-[11px] font-bold rounded-lg shadow-xs backdrop-blur-xs flex items-center gap-1.5 border border-stone-300 active:scale-95"
                  >
                    {zoomed ? (
                      <>
                        <ZoomOut className="w-3.5 h-3.5 text-rose-700" />
                        <span>Reset Zoom</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="w-3.5 h-3.5 text-rose-700" />
                        <span>Tap to Zoom</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Active Angle Caption Strip */}
                <div className="mt-2.5 flex items-center justify-between gap-2 px-1 text-xs text-stone-700">
                  <span className="font-bold text-stone-900">
                    {isUrdu ? currentAngle.labelUr : currentAngle.labelEn}
                  </span>
                  <span className="font-mono text-[11px] text-stone-600">
                    Photo {activeAngleIdx + 1} of 4
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Authenticity & Specification Summary Strip */}
            <div className="mt-4 bg-[#FAF7F2] rounded-xl p-3.5 border border-[#C8BFA8] grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">Item Code</span>
                <span className="font-mono font-bold text-stone-900">{product.code}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Fabric</span>
                <span className="font-bold text-stone-900">{product.material}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Dimensions</span>
                <span className="font-mono font-semibold text-stone-900">
                  {product.dimensions.split('(')[0].trim()}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Selected Color</span>
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

          {/* =================================================================
              RIGHT COLUMN (5 cols on lg): CONTIGUOUS PURCHASE MODULE & TABS
             ================================================================= */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between bg-[#FAF7F2]">
            <div className="space-y-4">
              {/* Brand, Stock & Myntra-Style Rating Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                  <span>Bari Shawl House</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-800">
                    {product.inStock ? 'In Stock' : 'On Order'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveInfoTab('reviews')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#C8BFA8] text-xs font-bold text-stone-900 hover:border-rose-600 transition-colors"
                >
                  <span>{product.rating || 4.9}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-stone-400">|</span>
                  <span className="text-stone-600 font-medium">
                    {productReviews.length + (product.reviewCount || 28)} Ratings
                  </span>
                </button>
              </div>

              {/* Product Title */}
              <div>
                <h2
                  id="product-modal-title"
                  className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 leading-tight"
                >
                  {isUrdu ? product.nameUrdu : product.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
                  {isUrdu ? product.name : product.nameUrdu}
                </p>
              </div>

              {/* Price & Discount */}
              <div className="flex flex-wrap items-baseline gap-2.5 pt-2 border-t border-[#DED6C8]">
                <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-stone-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="font-mono tabular-nums text-sm text-stone-400 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* =============================================================
                  USER-SELECTABLE COLOR SWATCHES (Myntra Style)
                 ============================================================= */}
              <div className="p-3.5 bg-white rounded-xl border border-[#CFC6B8] space-y-2.5">
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

                <div className="flex flex-wrap items-center gap-2.5">
                  {availableColors.map((colOption) => {
                    const isSelected =
                      colOption.name === currentColor.name &&
                      colOption.hex === currentColor.hex;
                    return (
                      <button
                        key={`${colOption.name}-${colOption.hex}`}
                        type="button"
                        onClick={() => setSelectedColor(colOption)}
                        className={`min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-rose-50/90 border-rose-700 text-stone-950 ring-2 ring-rose-700/20 font-bold shadow-2xs'
                            : 'bg-[#FAF7F2] border-[#CFC6B8] text-stone-700 hover:border-stone-500'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-stone-400 flex items-center justify-center shrink-0 shadow-2xs"
                          style={{ backgroundColor: colOption.hex }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-3 h-3 ${
                                ['#F5F2EB', '#EAE0C8', '#F3EFE6', '#F8FAFC', '#FBCFE8', '#D1FAE5'].includes(
                                  colOption.hex.toUpperCase()
                                )
                                  ? 'text-stone-900'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </span>
                        <span>
                          {isUrdu && colOption.nameUrdu ? colOption.nameUrdu : colOption.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Bundle Savings Box */}
              <div className="p-3 bg-[#EFEAE1] rounded-xl border border-[#CFC6B8] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-800">Quantity:</span>
                  <div className="flex items-center border border-[#BFB5A2] rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="min-h-[40px] min-w-[40px] bg-stone-100 hover:bg-stone-200 text-stone-900 text-base font-bold flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-mono tabular-nums font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="min-h-[40px] min-w-[40px] bg-stone-100 hover:bg-stone-200 text-stone-900 text-base font-bold flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-800 font-mono tabular-nums">
                    Total:{' '}
                    <strong className="text-rose-700 text-sm">
                      Rs. {(product.price * quantity).toLocaleString()}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-semibold pt-1 border-t border-[#DED6C8]">
                  <Sparkles className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                  <span>
                    Family Bundle Offer: Buy 2+ shawls for 5% OFF · Buy 4+ for 10% OFF in Bag!
                  </span>
                </div>
              </div>

              {/* =============================================================
                  3 INTERACTIVE PRODUCT TABS: DETAILS / SIZE GUIDE / REVIEWS
                 ============================================================= */}
              <div className="bg-white rounded-xl border border-[#CFC6B8] overflow-hidden">
                <div className="grid grid-cols-3 border-b border-[#E6DFD3] bg-[#F5F0E6] text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('details')}
                    className={`py-2.5 px-2 text-center transition-colors ${
                      activeInfoTab === 'details'
                        ? 'bg-white text-rose-700 border-b-2 border-rose-700'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Details &amp; Care
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('size-guide')}
                    className={`py-2.5 px-2 text-center transition-colors flex items-center justify-center gap-1 ${
                      activeInfoTab === 'size-guide'
                        ? 'bg-white text-rose-700 border-b-2 border-rose-700'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5 shrink-0" />
                    <span>Size Guide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('reviews')}
                    className={`py-2.5 px-2 text-center transition-colors ${
                      activeInfoTab === 'reviews'
                        ? 'bg-white text-rose-700 border-b-2 border-rose-700'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                <div className="p-3.5 text-xs text-stone-700 space-y-2.5 max-h-56 overflow-y-auto">
                  {activeInfoTab === 'details' && (
                    <>
                      <p className="leading-relaxed">
                        {isUrdu ? product.descriptionUrdu : product.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E6DFD3]">
                          <span className="text-stone-500 block">Weave &amp; Border:</span>
                          <strong className="text-stone-900">{product.style}</strong>
                        </div>
                        <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E6DFD3]">
                          <span className="text-stone-500 block">Warmth &amp; Weight:</span>
                          <strong className="text-stone-900">
                            {product.warmthLevel || 'Heavy Winter'} ({product.weightGrams || 650}g)
                          </strong>
                        </div>
                      </div>
                      <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E6DFD3] text-[11px]">
                        <strong className="text-stone-900">Wash &amp; Care: </strong>
                        {product.care}
                      </div>

                      {/* City Delivery Estimator */}
                      <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Check City Delivery Time:</span>
                          </span>
                          <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-2 py-1 rounded border border-emerald-300 bg-white text-stone-900 font-semibold text-[11px]"
                          >
                            {Object.keys(DELIVERY_CITIES).map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-[11px] text-emerald-900 font-medium">
                          {DELIVERY_CITIES[selectedCity]} · Cash on Delivery Available
                        </p>
                      </div>
                    </>
                  )}

                  {activeInfoTab === 'size-guide' && (
                    <div className="space-y-2.5">
                      <p className="font-bold text-stone-900">
                        Bari Shawl House Standard Measurement Chart:
                      </p>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between p-2 rounded bg-[#FAF7F2] border border-[#E6DFD3]">
                          <span className="font-bold text-stone-900">Gents Full Lohi / Shawl:</span>
                          <span className="font-mono text-rose-700 font-bold">
                            2.55 × 1.38m (100 × 54 in)
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-[#FAF7F2] border border-[#E6DFD3]">
                          <span className="font-bold text-stone-900">Ladies Bridal / Formal:</span>
                          <span className="font-mono text-rose-700 font-bold">
                            2.50 × 1.35m (98 × 53 in)
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-[#FAF7F2] border border-[#E6DFD3]">
                          <span className="font-bold text-stone-900">Bechgana (Youth &lt;16 yrs):</span>
                          <span className="font-mono text-rose-700 font-bold">
                            2.10 × 1.10m (82 × 43 in)
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-[#FAF7F2] border border-[#E6DFD3]">
                          <span className="font-bold text-stone-900">Multani Rumaal Square:</span>
                          <span className="font-mono text-rose-700 font-bold">
                            1.40 × 1.40m (55 × 55 in)
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        All shawls include an additional 3-inch hand-knotted bumble tassel fringe on both designing ends.
                      </p>
                    </div>
                  )}

                  {activeInfoTab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {productReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E6DFD3] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900">
                                {rev.author}{' '}
                                <span className="text-stone-500 font-normal">({rev.city})</span>
                              </span>
                              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
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

                      {/* Write a Review Mini-Form */}
                      <form
                        onSubmit={handleReviewSubmit}
                        className="pt-2 border-t border-[#E6DFD3] space-y-2"
                      >
                        <span className="font-bold text-stone-900 block">
                          Write a Customer Review:
                        </span>
                        {reviewSubmitted && (
                          <p className="text-emerald-700 font-bold text-[11px]">
                            Thank you! Your review has been added.
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
                          placeholder="Share your feedback on fabric quality and color..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-[#C8BFA8] rounded-lg bg-white text-xs"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-[11px]"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWholesaleForProduct(product);
                  }}
                  className="w-full text-xs text-rose-700 hover:text-rose-800 font-bold underline py-1 text-left sm:text-center"
                >
                  Need 12+ pieces for your shop or a wedding? Tap for Wholesale Rates
                </button>
              </div>
            </div>

            {/* Sticky Bottom Action Bar on Mobile / Contiguous CTA on Desktop */}
            <div className="sticky bottom-0 z-20 -mx-4 -mb-4 sm:mx-0 sm:mb-0 p-3.5 sm:p-0 sm:pt-4 sm:mt-4 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#D6CEC0] space-y-2 pb-safe">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>
                  Order "{currentColor.name}" on WhatsApp ({SHOP_INFO.whatsappDisplay})
                </span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`min-h-[46px] py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
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
                  <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>

                <a
                  href={`tel:${SHOP_INFO.phoneTel}`}
                  className="min-h-[46px] py-2.5 px-3 rounded-xl font-bold text-xs text-stone-900 bg-white hover:bg-stone-100 border border-[#C8BFA8] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-rose-700 shrink-0" />
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
