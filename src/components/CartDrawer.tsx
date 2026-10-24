/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';
import { CartItem, OrderForm } from '../types';
import { SHOP_INFO, buildWhatsAppCartUrl } from '../data/products';
import { TextileImage } from './TextileImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
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
  const subtotal = activeItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `BSH-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrderId(orderId);
    setOrderedSnapshot([...items]);
    onClearCart();
    setStep('success');
  };

  const copyBankDetails = () => {
    const text = `Bari Textile Multan Payment Accounts:
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
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-l border-slate-200"
      >
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 id="cart-title" className="font-serif-luxury text-xl font-bold text-white">
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
            className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length === 0 && step !== 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif-luxury text-xl font-bold text-slate-900">
                {isUrdu ? 'آپ کا شاپنگ بیگ خالی ہے' : 'Your shopping bag is empty'}
              </p>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {isUrdu
                  ? 'ہماری دکان کی مردانہ، زنانی اور بچگانہ شالیں دیکھیں اور پسندیدہ آئٹم منتخب کریں۔'
                  : 'Browse our Gents, Ladies, and Children shawls, Rumaal, and Laungi to add items to your bag.'}
              </p>
              <button
                onClick={handleCloseDrawer}
                className="mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-xl shadow-xs transition-colors"
              >
                {isUrdu ? 'شالیں دیکھیں' : 'Browse Products'}
              </button>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Free Delivery Notice */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-2">
                <span className="font-medium">
                  {subtotal >= 5000
                    ? 'You unlocked FREE Delivery anywhere in Pakistan!'
                    : `Add Rs. ${(5000 - subtotal).toLocaleString()} more for FREE Delivery across Pakistan.`}
                </span>
                <span className="font-mono font-bold text-rose-900 shrink-0">
                  {subtotal >= 5000 ? 'FREE' : 'Rs. 250'}
                </span>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3.5">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <TextileImage product={item.product} aspect="1/1" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {isUrdu ? item.product.nameUrdu : item.product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {item.product.code} · {item.product.material}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-mono tabular-nums font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2.5 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono tabular-nums text-xs sm:text-sm font-bold text-slate-900">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : step === 'checkout' ? (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Home Delivery Across Pakistan</span>
                <p className="text-xs text-slate-600">
                  Your parcel will be packed and sent from Dukaan No. 44, Makki Block, Multan Wholesale Market.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="min-h-[42px] w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="min-h-[42px] w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="min-h-[42px] w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 bg-white"
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
                <label className="block font-semibold text-slate-800 mb-1">Full Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House / Shop No, Street, Area, Nearby Landmark"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">Choose Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-300 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                      className="mt-0.5 text-rose-900"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-slate-600">
                        Pay cash to the courier rider when you receive your parcel at home.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-300 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'bank_transfer'}
                      onChange={() => setForm({ ...form, paymentMethod: 'bank_transfer' })}
                      className="mt-0.5 text-rose-900"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Meezan Bank / JazzCash / EasyPaisa</span>
                      <span className="text-xs text-slate-600">
                        Transfer payment to our official Meezan Bank, JazzCash, or EasyPaisa account.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-300 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'whatsapp'}
                      onChange={() => setForm({ ...form, paymentMethod: 'whatsapp' })}
                      className="mt-0.5 text-rose-900"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Confirm on WhatsApp with Shop Owner</span>
                      <span className="text-xs text-slate-600">
                        Talk directly with our shop on WhatsApp ({SHOP_INFO.whatsappDisplay}) to confirm payment and delivery.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {form.paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-400">Official Shop Payment Accounts</span>
                    <button
                      type="button"
                      onClick={copyBankDetails}
                      className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-md font-semibold transition-colors"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{copiedBank ? 'Copied!' : 'Copy Numbers'}</span>
                    </button>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Meezan Bank A/C:</span>
                      <strong className="text-white">{SHOP_INFO.bankAccountNumber}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">JazzCash Number:</span>
                      <strong className="text-amber-300">{SHOP_INFO.jazzCash}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">EasyPaisa Number:</span>
                      <strong className="text-emerald-300">{SHOP_INFO.easyPaisa}</strong>
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-300 pt-1">
                    After sending payment, share your screenshot on WhatsApp ({SHOP_INFO.whatsappDisplay}).
                  </p>
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
                <span className="text-xs font-mono font-bold text-rose-900 bg-rose-50 px-3 py-1 rounded border border-rose-200">
                  Order Number: {lastOrderId}
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-slate-900 mt-2">
                  Your Order Details Are Ready!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
                  Click the green WhatsApp button below to send this order directly to Bari Textile Multan ({SHOP_INFO.whatsappDisplay}) for fast dispatch.
                </p>
              </div>

              <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-semibold text-slate-900">{form.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-900">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">City & Address:</span>
                  <span className="font-medium text-slate-900 text-right max-w-[60%]">
                    {form.address}, {form.city}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                  <span>Total Amount:</span>
                  <span className="font-mono tabular-nums text-rose-900">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {form.paymentMethod === 'bank_transfer' && (
                <div className="w-full bg-slate-900 text-white rounded-xl p-3.5 text-xs text-left space-y-1 font-mono">
                  <p className="text-amber-400 font-sans font-bold mb-1">Payment Accounts:</p>
                  <p>Meezan Bank A/C: {SHOP_INFO.bankAccountNumber}</p>
                  <p>JazzCash: {SHOP_INFO.jazzCash}</p>
                  <p>EasyPaisa: {SHOP_INFO.easyPaisa}</p>
                </div>
              )}

              <a
                href={buildWhatsAppCartUrl(orderedSnapshot, {
                  fullName: form.fullName,
                  phone: form.phone,
                  city: form.city,
                  address: form.address,
                  paymentMethod: form.paymentMethod,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Order on WhatsApp ({SHOP_INFO.whatsappDisplay})</span>
              </a>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium underline pt-1"
              >
                Return to Shop
              </button>
            </div>
          )}
        </div>

        {/* Footer Totals & Buttons */}
        {items.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Total:</span>
                <span className="font-mono tabular-nums font-medium">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges:</span>
                <span className="font-mono tabular-nums font-medium">
                  {shippingFee === 0 ? 'FREE Delivery' : 'Rs. 250'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-base text-rose-900">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={buildWhatsAppCartUrl(items)}
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
                  className="min-h-[44px] py-2.5 px-3 bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
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
                  className="min-h-[44px] py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="min-h-[44px] py-2.5 px-3 bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
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
