/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AboutViewProps {
  onSelectView: (view: string) => void;
  onOpenWholesale: () => void;
  lang: 'en' | 'ur';
}

export const AboutView: React.FC<AboutViewProps> = ({
  onSelectView,
  onOpenWholesale,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-14">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
          Dukaan No. 44, Makki Block · 14 No. Multan Wholesale Market
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
          {isUrdu ? 'باری شال ہاؤس ملتان کا تعارف' : 'About Bari Shawl House'}
        </h1>
        <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
          {isUrdu
            ? 'ملتان ہول سیل مارکیٹ کے مکی بلاک میں واقع باری شال ہاؤس، پورے پاکستان کے گاہکوں اور دکانداروں کے لیے معیاری شالوں کا بااعتماد مرکز ہے۔'
            : 'Located in the heart of Multan Wholesale Market, Bari Shawl House provides high-quality shawls, rumaal, and laungi at fair wholesale and retail prices across Pakistan.'}
        </p>
      </div>

      {/* Main Story Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch bg-[#FDFBF7] p-6 sm:p-10 rounded-2xl border border-[#CFC6B8] shadow-xs">
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
            Our Multan Shop Story
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
            Quality Fabrics You Can Trust
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Multan is famous across Pakistan for its rich handloom cloth, warm winter shawls, and detailed embroidery work. From our shop at Dukaan No. 44, Makki Block, 14 No. Multan, we work directly with skilled weavers and embroidery makers.
          </p>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Whether you need a warm pure wool shawl for winter mornings, a velvet embroidered shawl for a family wedding, a soft shawl for children, or traditional Multani rumaal and laungi, we check every single piece before sending it to you.
          </p>
        </div>

        <div className="bg-[#EFEAE1] text-stone-800 p-6 sm:p-8 rounded-xl border border-[#CFC6B8] space-y-4 flex flex-col justify-center">
          <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
            Our 5 Main Product Sections
          </h3>
          <ul className="space-y-3 text-xs leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-rose-700 font-bold">01.</span>
              <span>
                <strong className="text-stone-900">Gents’ Shawls:</strong> Warm sheep wool, Swati woven borders, Pashmina-touch, and soft daily winter wraps for men.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-rose-700 font-bold">02.</span>
              <span>
                <strong className="text-stone-900">Ladies’ Shawls:</strong> Bridal and party wear velvet shawls, Kashmiri floral wool shawls, and soft washable daily shawls.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-rose-700 font-bold">03.</span>
              <span>
                <strong className="text-stone-900">Children’s Shawls (Bechgana):</strong> Soft, non-itchy warm shawls sized specially for boys and girls under 15–16 years.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-rose-700 font-bold">04.</span>
              <span>
                <strong className="text-stone-900">Rumaal:</strong> Traditional Multani checkered cotton rumaal and clean white prayer rumaal.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-rose-700 font-bold">05.</span>
              <span>
                <strong className="text-stone-900">Laungi:</strong> Authentic Multani handloom multicolor festive laungis and comfortable daily cotton laungis.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Simple Fabric Guide */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
            Our Fabrics Explained Simply
          </h2>
          <p className="text-xs text-stone-700 mt-1 font-medium">
            We clearly mention the exact fabric on every product so you know what you are buying:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#FDFBF7] rounded-xl border border-[#CFC6B8] space-y-2 shadow-xs">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
              Pure Wool & Swati Wool
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Made from natural wool thread. Keeps you very warm in cold December and January weather and lasts for many years.
            </p>
          </div>

          <div className="p-5 bg-[#FDFBF7] rounded-xl border border-[#CFC6B8] space-y-2 shadow-xs">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
              Royal Micro-Velvet
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Thick, smooth velvet with golden tilla and thread embroidery. The best choice for weddings, bridal gifts, and formal parties.
            </p>
          </div>

          <div className="p-5 bg-[#FDFBF7] rounded-xl border border-[#CFC6B8] space-y-2 shadow-xs">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
              Soft Acrylic & Pure Cotton
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Acrylic shawls are lightweight, soft on skin, and easy to wash at home. Our Rumaal and Laungi use 100% pure Multani cotton.
            </p>
          </div>
        </div>
      </div>

      {/* Wholesale & Contact Banner (Grounded Regal Callout Card) */}
      <div className="bg-[#1E1B24] text-stone-100 p-6 sm:p-8 rounded-2xl border border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1.5">
          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
            Wholesale Supply for Shops & Weddings
          </h3>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            If you run a clothing shop, online store, or want shawls in bulk for wedding guests, contact us for our Multan Wholesale Market rates.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenWholesale}
            className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-xs"
          >
            Get Wholesale Rates
          </button>
          <button
            onClick={() => onSelectView('contact')}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-600 font-semibold text-xs rounded-xl transition-colors whitespace-nowrap"
          >
            Contact Shop
          </button>
        </div>
      </div>
    </div>
  );
};
