/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { CartItem, OrderForm, ProductColorOption } from '../types';
import { SHOP_INFO, buildWhatsAppCartUrl, getProductColors } from '../data/products';
import { TextileImage } from './TextileImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, colorName: string | undefined, quantity: number) => void;
  onUpdateColor?: (
    productId: string,
    oldColorName: string | undefined,
    newColor: ProductColorOption
  ) => void;
  onRemoveItem: (productId: string, colorName?: string) => void;
  onClearCart: () => void;
  lang: 'en' | 'ur';
}

const CITIES = [
  'Multan',
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Bahawalpur',
  'Muzaffargarh',
  'Khanewal',
  'Vehari',
  'Dera Ghazi Khan',
  'Rahim Yar Khan',
  'Sahiwal',
  'Sargodha',
  'Gujranwala',
  'Sialkot',
  'Peshawar',
  'Quetta',
  'Other City',
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateColor,
  onRemoveItem,
  onClearCart,
  lang,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [copiedBank, setCopiedBank] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [orderedSnapshot, setOrderedSnapshot] = useState<CartItem[]>([]);

  const [form, setForm] = useState<OrderForm>({
    fullName: '',
    phone: '',
    whatsapp: '',
    city: 'Multan',
    address: '',
    paymentMethod: 'cod',
    notes: '',
  });

  if (!isOpen) return null;

  const isUrdu = lang === 'ur';
  const activeItems = step === 'success' ? orderedSnapshot : items;
  const totalQty = activeItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = activeItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Automatic Family & Wedding Bundle Discount (2+ items = 5% off, 4+ items = 10% off)
  const discountRate = totalQty >= 4 ? 0.1 : totalQty >= 2 ? 0.05 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee = afterDiscount >= 5000 || afterDiscount === 0 ? 0 : 250;
  const grandTotal = afterDiscount + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `BSH-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrderId(orderId);
    setOrderedSnapshot([...items]);
    onClearCart();
    setStep('success');
  };

  const copyBankDetails = () => {
    const text = `Bari Shawl House Payment Accounts:
Meezan Bank A/C: ${SHOP_INFO.bankAccountNumber}
JazzCash: ${SHOP_INFO.jazzCash}
EasyPaisa: ${SHOP_INFO.easyPaisa}
WhatsApp for Receipt: ${SHOP_INFO.whatsapp}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleCloseDrawer = () => {
    if (step === 'success') {
      setStep('cart');
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      onClick={handleCloseDrawer}
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex items-end sm:items-stretch justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FAF7F2] h-[92dvh] sm:h-full rounded-t-3xl sm:rounded-none flex flex-col shadow-2xl border-t sm:border-t-0 sm:border-l border-[#C8BFA8] overflow-hidden"
      >
        {/* Top Bar */}
        <div className="bg-[#EFEAE1] text-stone-900 border-b border-[#CFC6B8]">
          <div className="w-10 h-1.5 bg-stone-400 rounded-full mx-auto mt-2.5 sm:hidden" />
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-rose-700" />
              <h2 id="cart-title" className="font-serif-luxury text-xl font-bold text-stone-900">
                {step === 'cart'
                  ? isUrdu
                    ? 'آپ کا شاپنگ بیگ'
                    : 'Your Shopping Bag'
                  : step === 'checkout'
                  ? isUrdu
                    ? 'ڈیلیوری اور ادائیگی'
                    : 'Delivery & Payment Details'
                  : isUrdu
                  ? 'آرڈر مکمل ہو گیا'
                  : 'Order Saved'}
              </h2>
            </div>
            <button
              onClick={handleCloseDrawer}
              className="min-h-[44px] min-w-[44px] -mr-1 flex items-center justify-center text-stone-600 hover:text-stone-900 active:scale-95 rounded-xl hover:bg-stone-200/70 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
          {items.length === 0 && step !== 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif-luxury text-xl font-bold text-stone-900">
                {isUrdu ? 'آپ کا شاپنگ بیگ خالی ہے' : 'Your shopping bag is empty'}
              </p>
              <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                {isUrdu
                  ? 'باری شال ہاؤس کی مردانہ، زنانی اور بچگانہ شالیں دیکھیں اور پسندیدہ رنگ منتخب کریں۔'
                  : 'Browse Bari Shawl House Gents, Ladies, and Children shawls, Rumaal, and Laungi to add items to your bag.'}
              </p>
              <button
                onClick={handleCloseDrawer}
                className="min-h-[44px] mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 active:scale-95 rounded-xl shadow-xs transition-all"
              >
                {isUrdu ? 'شالیں دیکھیں' : 'Browse Products'}
              </button>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Free Delivery & Bundle Savings Banner */}
              <div className="p-3.5 bg-white rounded-xl border border-[#CFC6B8] text-xs space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-stone-800">
                  <span className="font-semibold">
                    {afterDiscount >= 5000
                      ? '✓ You unlocked FREE Delivery anywhere in Pakistan!'
                      : `Add Rs. ${(5000 - afterDiscount).toLocaleString()} more for FREE Delivery.`}
                  </span>
                  <span className="font-mono font-bold text-rose-700 shrink-0">
                    {afterDiscount >= 5000 ? 'FREE' : 'Rs. 250'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold pt-1 border-t border-[#E6DFD3]">
                  <Sparkles className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                  <span>
                    {totalQty >= 4
                      ? '10% Family & Wedding Bundle Discount Applied!'
                      : totalQty >= 2
                      ? '5% Bundle Discount Applied! (Add 4+ items for 10% OFF)'
                      : 'Add 1 more shawl to unlock 5% Family Bundle Discount!'}
                  </span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3 divide-y divide-[#DED6C8]">
                {items.map((item) => {
                  const chosenColor = item.selectedColor || {
                    name: item.product.color,
                    hex: item.product.colorHex,
                  };
                  const productColors = getProductColors(item.product);
                  const itemKey = `${item.product.id}-${chosenColor.name}`;

                  return (
                    <div key={itemKey} className="pt-3 first:pt-0 flex gap-3.5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#C8BFA8] bg-white">
                        <TextileImage
                          product={item.product}
                          aspect="1/1"
                          selectedColor={chosenColor}
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                              {isUrdu ? item.product.nameUrdu : item.product.name}
                            </h4>
                            <p className="text-[11px] text-stone-600 font-mono">
                              {item.product.code} · {item.product.material}
                            </p>

                            {/* Selected Color Display & Quick Switcher */}
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span
                                className="w-3 h-3 rounded-full border border-stone-400 shrink-0"
                                style={{ backgroundColor: chosenColor.hex }}
                              />
                              {onUpdateColor && productColors.length > 1 ? (
                                <select
                                  value={chosenColor.name}
                                  onChange={(e) => {
                                    const found = productColors.find(
                                      (c) => c.name === e.target.value
                                    );
                                    if (found) {
                                      onUpdateColor(
                                        item.product.id,
                                        item.selectedColor?.name,
                                        found
                                      );
                                    }
                                  }}
                                  className="text-[11px] font-semibold text-stone-800 bg-white border border-[#C8BFA8] rounded px-1.5 py-0.5"
                                  aria-label="Change item color"
                                >
                                  {productColors.map((col) => (
                                    <option key={col.name} value={col.name}>
                                      Color: {col.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="text-[11px] font-semibold text-stone-800">
                                  Color: {chosenColor.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              onRemoveItem(item.product.id, item.selectedColor?.name)
                            }
                            className="min-h-[36px] min-w-[36px] -mr-1 -mt-1 flex items-center justify-center text-stone-400 hover:text-red-600 active:scale-95 transition-all rounded-lg hover:bg-red-50"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-[#C8BFA8] rounded-xl overflow-hidden bg-white">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.selectedColor?.name,
                                  item.quantity - 1
                                )
                              }
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-sm font-bold text-stone-800 hover:bg-stone-100"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-3 py-0.5 text-xs font-mono tabular-nums font-bold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.selectedColor?.name,
                                  item.quantity + 1
                                )
                              }
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-sm font-bold text-stone-800 hover:bg-stone-100"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-mono tabular-nums text-xs sm:text-sm font-bold text-stone-900">
                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : step === 'checkout' ? (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-[#CFC6B8] text-stone-700">
                <span className="font-bold text-stone-900 block mb-0.5">
                  Home Delivery Across Pakistan · Bari Shawl House
                </span>
                <p className="text-xs text-stone-600">
                  Your parcel will be packed and dispatched from Dukaan No. 44, Makki Block, Multan Wholesale Market.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs bg-white border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs bg-white border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="min-h-[44px] w-full px-3.5 py-2 text-base sm:text-xs border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700 bg-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Full Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House / Shop No, Street, Area, Nearby Landmark"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-base sm:text-xs bg-white border border-[#C8BFA8] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Choose Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#CFC6B8] cursor-pointer hover:border-rose-500">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                      className="mt-0.5 text-rose-700"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-stone-600">
                        Pay cash to the courier rider when you receive your parcel at home.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#CFC6B8] cursor-pointer hover:border-rose-500">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'bank_transfer'}
                      onChange={() => setForm({ ...form, paymentMethod: 'bank_transfer' })}
                      className="mt-0.5 text-rose-700"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Meezan Bank / JazzCash / EasyPaisa
                      </span>
                      <span className="text-xs text-stone-600">
                        Transfer payment to our official Meezan Bank, JazzCash, or EasyPaisa account.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#CFC6B8] cursor-pointer hover:border-rose-500">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'whatsapp'}
                      onChange={() => setForm({ ...form, paymentMethod: 'whatsapp' })}
                      className="mt-0.5 text-rose-700"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Confirm on WhatsApp with Shop Owner
                      </span>
                      <span className="text-xs text-stone-600">
                        Talk directly with Bari Shawl House on WhatsApp ({SHOP_INFO.whatsappDisplay}).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {form.paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 bg-white text-stone-800 rounded-xl border border-[#CFC6B8] text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-[#E6DFD3] pb-2">
                    <span className="font-bold text-rose-700">Official Shop Payment Accounts</span>
                    <button
                      type="button"
                      onClick={copyBankDetails}
                      className="flex items-center gap-1 text-xs bg-[#FAF7F2] hover:bg-stone-200 text-stone-800 border border-[#C8BFA8] px-2.5 py-1 rounded-md font-semibold transition-colors"
                    >
                      {copiedBank ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-rose-700" />
                      )}
                      <span>{copiedBank ? 'Copied!' : 'Copy Numbers'}</span>
                    </button>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <p className="flex justify-between">
                      <span className="text-stone-500">Meezan Bank A/C:</span>
                      <strong className="text-stone-900">{SHOP_INFO.bankAccountNumber}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-stone-500">JazzCash Number:</span>
                      <strong className="text-rose-700">{SHOP_INFO.jazzCash}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-stone-500">EasyPaisa Number:</span>
                      <strong className="text-emerald-700">{SHOP_INFO.easyPaisa}</strong>
                    </p>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Order Confirmation Step */
            <div className="py-4 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded border border-rose-200">
                  Order Number: {lastOrderId}
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 mt-2">
                  Your Order Details Are Ready!
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm leading-relaxed">
                  Click the green WhatsApp button below to send this order directly to Bari Shawl House ({SHOP_INFO.whatsappDisplay}) for fast dispatch.
                </p>
              </div>

              <div className="w-full bg-white rounded-xl p-4 border border-[#CFC6B8] text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Customer Name:</span>
                  <span className="font-semibold text-stone-900">{form.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-mono text-stone-900">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">City &amp; Address:</span>
                  <span className="font-medium text-stone-900 text-right max-w-[60%]">
                    {form.address}, {form.city}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E6DFD3] space-y-1">
                  {orderedSnapshot.map((it, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-stone-700">
                      <span>
                        {it.product.name} ({it.selectedColor?.name || it.product.color}) ×{' '}
                        {it.quantity}
                      </span>
                      <span className="font-mono font-semibold">
                        Rs. {(it.product.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-[#E6DFD3] pt-2 font-bold text-sm">
                  <span>Total Amount:</span>
                  <span className="font-mono tabular-nums text-rose-700">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <a
                href={buildWhatsAppCartUrl(
                  orderedSnapshot,
                  {
                    fullName: form.fullName,
                    phone: form.phone,
                    city: form.city,
                    address: form.address,
                    paymentMethod: form.paymentMethod,
                  },
                  discountAmount
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Order on WhatsApp ({SHOP_INFO.whatsappDisplay})</span>
              </a>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium underline pt-1"
              >
                Return to Shop
              </button>
            </div>
          )}
        </div>

        {/* Footer Totals & Buttons */}
        {items.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-[#CFC6B8] bg-[#EFEAE1] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-700">
                <span>Items Subtotal ({totalQty} items):</span>
                <span className="font-mono tabular-nums font-medium">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Bundle Discount ({Math.round(discountRate * 100)}% OFF):</span>
                  <span className="font-mono tabular-nums">
                    -Rs. {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-stone-700">
                <span>Delivery Charges:</span>
                <span className="font-mono tabular-nums font-medium">
                  {shippingFee === 0 ? 'FREE Delivery' : 'Rs. 250'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-[#C8BFA8]">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-base text-rose-700">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={buildWhatsAppCartUrl(items, undefined, discountAmount)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="min-h-[44px] py-2.5 px-3 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="min-h-[44px] py-2.5 px-3 bg-white hover:bg-stone-100 border border-[#C8BFA8] text-stone-800 font-semibold text-xs rounded-xl transition-colors"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="min-h-[44px] py-2.5 px-3 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Confirm Order</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
