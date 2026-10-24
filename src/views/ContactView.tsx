/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Navigation, CreditCard, Copy, Check } from 'lucide-react';
import { SHOP_INFO } from '../data/products';

interface ContactViewProps {
  lang: 'en' | 'ur';
}

export const ContactView: React.FC<ContactViewProps> = ({ lang }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  const isUrdu = lang === 'ur';

  const copyPaymentDetails = () => {
    const text = `Bari Textile Multan Payment Accounts:
Meezan Bank A/C: ${SHOP_INFO.bankAccountNumber}
JazzCash: ${SHOP_INFO.jazzCash}
EasyPaisa: ${SHOP_INFO.easyPaisa}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const customWhatsAppText = `Assalam-o-Alaikum Bari Textile Multan!
*Customer Inquiry:*
*Name:* ${name || 'Valued Customer'}
*Phone:* ${phone || 'Not provided'}
*Message:* ${message || 'I would like to ask about your shawls.'}`;

  const customWhatsAppUrl = `https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
    customWhatsAppText
  )}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Dukaan No. 44 Makki Block Multan Wholesale Market 14 No Multan'
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10 sm:space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
          {isUrdu ? 'رابطہ اور دکان کا پتہ' : 'Call, WhatsApp, or Visit Us'}
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-950">
          {isUrdu ? 'باری ٹیکسٹائل ملتان سے رابطہ کریں' : 'Contact, Payment & Shop Location'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Call us directly, chat on WhatsApp, check our payment accounts, or visit our shop in Multan Wholesale Market.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Direct Contact & Payment Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Phone Call Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-900 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Shop Phone Number</span>
                <a
                  href={`tel:${SHOP_INFO.phoneTel}`}
                  className="font-mono text-lg font-bold text-slate-950 hover:text-rose-900 transition-colors"
                >
                  {SHOP_INFO.phoneDisplay}
                </a>
              </div>
            </div>
            <a
              href={`tel:${SHOP_INFO.phoneTel}`}
              className="min-h-[42px] flex items-center justify-center w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Tap to Call Shop ({SHOP_INFO.phoneDisplay})
            </a>
          </div>

          {/* WhatsApp Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Shop WhatsApp Number</span>
                <a
                  href={`https://wa.me/${SHOP_INFO.whatsappIntl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-lg font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  {SHOP_INFO.whatsappDisplay}
                </a>
              </div>
            </div>
            <a
              href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
                'Assalam-o-Alaikum Bari Textile Multan! I want to ask about your shawls.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] flex items-center justify-center w-full text-center py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Chat on WhatsApp ({SHOP_INFO.whatsappDisplay})
            </a>
          </div>

          {/* Official Bank, JazzCash & EasyPaisa Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-serif-luxury text-base font-bold text-white">
                  Official Payment Accounts
                </span>
              </div>
              <button
                type="button"
                onClick={copyPaymentDetails}
                className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-lg font-semibold transition-colors"
              >
                {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-lg">
                <span className="text-slate-300 font-sans">Meezan Bank A/C:</span>
                <strong className="text-amber-300">{SHOP_INFO.bankAccountNumber}</strong>
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-lg">
                <span className="text-slate-300 font-sans">JazzCash Number:</span>
                <strong className="text-white">{SHOP_INFO.jazzCash}</strong>
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-lg">
                <span className="text-slate-300 font-sans">EasyPaisa Number:</span>
                <strong className="text-white">{SHOP_INFO.easyPaisa}</strong>
              </div>
            </div>
          </div>

          {/* Shop Address & Opening Hours */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-700 shadow-2xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-900 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Shop Address:</span>
                <p className="font-medium text-slate-800">{SHOP_INFO.address}</p>
                <p className="text-xs text-slate-500 font-urdu mt-1">{SHOP_INFO.addressUrdu}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
              <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Shop Opening Hours:</span>
                <p className="text-slate-700">{SHOP_INFO.timings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map Pin & Quick WhatsApp Message Composer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            {/* Map Visual */}
            <div className="h-60 sm:h-68 bg-slate-100 relative flex items-center justify-center pattern-linen-light overflow-hidden border-b border-slate-200">
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <svg className="w-full h-full text-slate-300" viewBox="0 0 600 300" fill="none" stroke="currentColor">
                  <line x1="0" y1="60" x2="600" y2="60" strokeWidth="3" />
                  <line x1="0" y1="130" x2="600" y2="130" strokeWidth="6" stroke="#cbd5e1" />
                  <line x1="0" y1="210" x2="600" y2="210" strokeWidth="2" />
                  <line x1="140" y1="0" x2="140" y2="300" strokeWidth="3" />
                  <line x1="300" y1="0" x2="300" y2="300" strokeWidth="7" stroke="#cbd5e1" />
                  <line x1="460" y1="0" x2="460" y2="300" strokeWidth="3" />
                  <circle cx="300" cy="130" r="16" fill="#e2e8f0" />
                </svg>
              </div>

              <div className="relative z-10 text-center p-4 max-w-sm">
                <div className="mx-auto w-11 h-11 rounded-full bg-rose-900 text-white flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="mt-2 bg-slate-950/95 text-white px-4 py-3 rounded-xl shadow-lg border border-amber-500/30">
                  <p className="font-serif-luxury font-bold text-base">Bari Textile Multan</p>
                  <p className="text-xs text-amber-400">Dukaan No. 44, Makki Block</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">14 No. Multan Wholesale Market</p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 px-3.5 py-2 bg-white text-slate-900 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 border border-slate-200"
              >
                <Navigation className="w-3.5 h-3.5 text-rose-900" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            {/* Direct Message Form */}
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-slate-950">
                  Write a Message to Our Shop
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Fill in your question below and click the green button to send it straight to our WhatsApp.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="min-h-[42px] w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Phone Number</label>
                    <input
                      type="tel"
                      placeholder="0300-1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="min-h-[42px] w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Question or Order Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ask about price, delivery, colors, or wholesale rates..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                  />
                </div>

                <a
                  href={customWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Message on WhatsApp ({SHOP_INFO.whatsappDisplay})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
