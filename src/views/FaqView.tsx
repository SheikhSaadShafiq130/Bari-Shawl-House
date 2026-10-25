/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { SHOP_INFO } from '../data/products';

interface FaqViewProps {
  lang: 'en' | 'ur';
}

export const FaqView: React.FC<FaqViewProps> = ({ lang }) => {
  const isUrdu = lang === 'ur';

  const faqs = [
    {
      q: 'How can I place an order?',
      qUrdu: 'شال کا آرڈر کیسے کیا جائے؟',
      a: 'Ordering is very easy. You can click the green "WhatsApp Order" button on any shawl to chat directly with our shop (0333-4947829), OR click "Add to Bag" to place a Cash on Delivery order online.',
      aUrdu: 'آرڈر کرنا بہت آسان ہے۔ کسی بھی شال پر "واٹس ایپ آرڈر" کا بٹن دبائیں یا "بیگ میں ڈالیں" پر کلک کر کے کیش آن ڈیلیوری آرڈر کریں۔',
    },
    {
      q: 'Do you deliver to all cities in Pakistan? What are the charges?',
      qUrdu: 'کیا پورے پاکستان میں ڈیلیوری ہے اور چارجز کیا ہیں؟',
      a: 'Yes, we send parcels to all cities and towns in Pakistan through TCS, Leopards, and Call Courier (2 to 4 days). Delivery is FREE on orders above Rs. 5,000. Below Rs. 5,000, delivery is Rs. 250.',
      aUrdu: 'جی ہاں، ٹی سی ایس اور لیپرڈز کے ذریعے پورے پاکستان میں 2 سے 4 دن میں ڈیلیوری ہوتی ہے۔ 5000 روپے سے زائد کے آرڈر پر فری ڈیلیوری ہے، ورنہ 250 روپے چارجز ہیں۔',
    },
    {
      q: 'Can I pay Cash on Delivery (COD) or via JazzCash / EasyPaisa / Bank Transfer?',
      qUrdu: 'کیا کیش آن ڈیلیوری، جیز کیش، ایزی پیسہ اور بینک ٹرانسفر کی سہولت موجود ہے؟',
      a: 'Yes! You can pay cash to the courier rider on delivery, OR send advance payment via Meezan Bank (A/C: 050560100939410), JazzCash (0313-6752048), or EasyPaisa (0313-6752048).',
      aUrdu: 'جی ہاں، پارسل گھر پہنچنے پر نقد ادائیگی کریں یا میزان بینک (050560100939410)، جیز کیش اور ایزی پیسہ (0313-6752048) کے ذریعے ادائیگی کریں۔',
    },
    {
      q: 'Do you give wholesale prices for shopkeepers and wedding orders?',
      qUrdu: 'کیا دکانداروں اور شادی بیاہ کے لیے ہول سیل ریٹ ملے گا؟',
      a: 'Yes, our shop is located in Multan Wholesale Market (Dukaan No. 44, Makki Block). If you need 12 pieces or more, click "Wholesale Inquiry" in the top bar or message us on WhatsApp for wholesale rates.',
      aUrdu: 'جی بالکل! کم از کم 12 پیس لینے پر دکانداروں اور شادی بیاہ کی تقاریب کے لیے خصوصی ہول سیل ریٹس دیے جاتے ہیں۔',
    },
    {
      q: 'Where is your shop located if I want to visit in person?',
      qUrdu: 'ملتان میں آپ کی دکان کہاں واقع ہے؟',
      a: 'Our shop address is: Dukaan No. 44, Makki Block, Multan Wholesale Market, 14 No. Multan. We are open Monday to Saturday from 10:00 AM to 9:00 PM.',
      aUrdu: 'ہماری دکان کا پتہ: دکان نمبر 44، مکی بلاک، ملتان ہول سیل مارکیٹ، 14 نمبر ملتان۔ پیر تا ہفتہ صبح 10 تا رات 9 بجے۔',
    },
    {
      q: 'How do I wash wool and velvet shawls?',
      qUrdu: 'مخمل اور اونی شالوں کو کیسے دھویا جائے؟',
      a: 'Embroidered velvet shawls and pure wool shawls should be dry-cleaned so the embroidery and wool stay new. Acrylic shawls, cotton rumaal, and laungi can be washed gently at home.',
      aUrdu: 'کڑھائی والی مخمل اور خالص اونی شالوں کے لیے ڈرائی کلیننگ بہترین ہے۔ کاٹن کے رومال اور لونگی گھر پر دھوئے جا سکتے ہیں۔',
    },
    {
      q: 'What if I receive a damaged or wrong item?',
      qUrdu: 'اگر پارسل میں کوئی مسئلہ ہو تو تبدیلی کیسے ہو گی؟',
      a: 'If there is any defect or mistake in your parcel, message us on WhatsApp (0333-4947829) within 2 days of receiving it. We will happily exchange it or return your money.',
      aUrdu: 'پارسل ملنے کے 2 دن کے اندر ہمارے واٹس ایپ نمبر پر رابطہ کریں، ہم فوری شال تبدیل کر دیں گے یا رقم واپس کر دیں گے۔',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
          {isUrdu ? 'عام پوچھے جانے والے سوالات' : 'Helpful Information'}
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900">
          {isUrdu ? 'سوالات اور جوابات (FAQ)' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-700 font-medium">
          Simple answers about ordering, home delivery, payment accounts, and fabric care.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#FDFBF7] border border-[#CFC6B8] rounded-xl overflow-hidden transition-colors shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white transition-colors"
              >
                <div className="space-y-0.5">
                  <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
                    {faq.q}
                  </h2>
                  <p className="text-xs text-stone-600 font-urdu">{faq.qUrdu}</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-rose-700' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[#E6DFD3] text-xs sm:text-sm text-stone-800 space-y-2 leading-relaxed bg-[#EFEAE1]/70">
                  <p>{faq.a}</p>
                  <p className="text-xs text-stone-700 font-urdu pt-1">{faq.aUrdu}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#1E1B24] text-stone-100 p-6 rounded-2xl border border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="font-serif-luxury text-xl font-bold text-white">
            Still have a question?
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Message us directly on WhatsApp and we will reply right away.
          </p>
        </div>
        <a
          href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
            'Assalam-o-Alaikum Bari Shawl House! I have a question.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp ({SHOP_INFO.whatsappDisplay})</span>
        </a>
      </div>
    </div>
  );
};
