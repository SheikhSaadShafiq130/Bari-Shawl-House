/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Key, HelpCircle, Lock } from 'lucide-react';

interface OwnerHandoverViewProps {
  onOpenAdmin: () => void;
  lang: 'en' | 'ur';
}

export const OwnerHandoverView: React.FC<OwnerHandoverViewProps> = ({
  onOpenAdmin,
}) => {
  const confirmationPoints = [
    {
      q: '1. Should the website take orders on WhatsApp only, or include a shopping bag and checkout?',
      status: 'Both Included',
      recommendation:
        'Both options are ready! Customers can click "WhatsApp Order" on any shawl to chat directly on 0333-4947829, OR use the Shopping Bag and Checkout for Cash on Delivery and Bank Transfer.',
    },
    {
      q: '2. Which payment methods are offered?',
      status: 'Ready',
      recommendation:
        'Cash on Delivery (COD), Meezan Bank Transfer (A/C: 050560100939410), JazzCash (0313-6752048), EasyPaisa (0313-6752048), and direct WhatsApp order confirmation.',
    },
    {
      q: '3. What are the delivery areas, charges, and delivery times?',
      status: 'Ready',
      recommendation:
        'Delivery to all cities in Pakistan in 2 to 4 days via TCS, Leopards, or Call Courier. Delivery is Rs. 250, and FREE on orders above Rs. 5,000.',
    },
    {
      q: '4. Should prices be shown online, or should customers ask for prices?',
      status: 'Shown Online + Wholesale Option',
      recommendation:
        'Single-piece retail prices are shown clearly in Rupees (PKR), and wholesale buyers can click "Wholesale Inquiry" to ask for bulk prices.',
    },
    {
      q: '5. Should the website be in English, Urdu, or both?',
      status: 'English & Urdu Included',
      recommendation:
        'Both languages are built in! Visitors can switch between English and Urdu (اردو) anytime using the button in the top bar.',
    },
    {
      q: '6. What are the shop opening hours, address, and map location?',
      status: 'Confirmed',
      recommendation:
        'Dukaan No. 44, Makki Block, Multan Wholesale Market, 14 No. Multan. Open Monday to Saturday, 10:00 AM to 9:00 PM (Sunday closed). Google Maps button is included.',
    },
    {
      q: '7. Does the website have a separate option for wholesale buyers?',
      status: 'Included',
      recommendation:
        'Yes! Shopkeepers and wedding buyers can click "Wholesale Inquiry" to request rates for 12, 24, 50, or 100+ pieces.',
    },
    {
      q: '8. How can the shop owner add real product photos, names, and prices?',
      status: 'Password Protected + Live Cloud DB',
      recommendation:
        'Click "Admin" and enter the Shop Admin Password (default: bari786). You can also change the password anytime inside the Admin Panel and sync changes with Google Cloud.',
    },
    {
      q: '9. Domain Name & Hosting',
      status: 'Live & Ready',
      recommendation:
        'The website is live right now on Google Cloud and can also be linked to a custom domain like baritextilemultan.pk or baritextilemultan.com.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
          Project Handover & Owner Guide
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
          Website Checklist & Shop Owner Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Simple guide showing all completed features and how to manage products on the website.
        </p>
      </div>

      {/* Checklist Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-slate-900">
              Completed Website Checklist
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700">
            Ready to Use & Publish
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              All 5 Main Product Categories Ready
            </span>
            <p className="text-slate-600 pl-5 leading-relaxed">
              1. Gents’ Shawls, 2. Ladies’ Shawls, 3. Children’s Shawls (Bechgana), 4. Rumaal, and 5. Laungi.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Phone, WhatsApp & Payment Accounts
            </span>
            <p className="text-slate-600 pl-5 leading-relaxed">
              WhatsApp (0333-4947829), Phone/JazzCash/EasyPaisa (0313-6752048), and Meezan Bank (050560100939410) are active.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Password-Protected Owner Admin Panel
            </span>
            <p className="text-slate-600 pl-5 leading-relaxed">
              Protected with shop password (<strong className="font-mono text-rose-600">bari786</strong>) + Google Cloud sync.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Shop Address & Google Maps Link
            </span>
            <p className="text-slate-600 pl-5 leading-relaxed">
              Dukaan No. 44, Makki Block, Multan Wholesale Market, 14 No. Multan displayed clearly.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-600">
            Want to unlock the Admin Panel with your password and update products right now?
          </span>
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors self-start sm:self-auto flex items-center gap-1.5 shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Open Owner Admin Panel</span>
          </button>
        </div>
      </div>

      {/* 3-Step Guide for Owner (Light Card) */}
      <div className="bg-rose-50/70 text-slate-900 p-6 sm:p-8 rounded-2xl border border-rose-200 space-y-4">
        <div className="flex items-center gap-2 text-rose-600">
          <Key className="w-5 h-5" />
          <h2 className="font-serif-luxury text-xl font-bold text-slate-900">
            How to Update Products & Upload Photos (3 Simple Steps)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="bg-white p-4 rounded-xl space-y-1.5 border border-rose-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Step 1: Enter Admin Password</span>
            <p className="leading-relaxed">
              Click <strong>Admin</strong> in the top bar and enter your password (default: <strong className="font-mono text-rose-600">bari786</strong>).
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl space-y-1.5 border border-rose-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Step 2: Upload Real Photos</span>
            <p className="leading-relaxed">
              Click <strong>Edit</strong> on any item, then click <strong>Upload Photo</strong> to select a photo from your phone or computer.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl space-y-1.5 border border-rose-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Step 3: Save Changes</span>
            <p className="leading-relaxed">
              Update the price, name, or fabric details and click <strong>Save Changes</strong> to publish immediately!
            </p>
          </div>
        </div>
      </div>

      {/* Answers to the 9 Brief Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-rose-600" />
          <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Answers to Project Confirmation Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {confirmationPoints.map((pt, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 space-y-1.5 text-xs shadow-2xs"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-slate-900 text-sm">{pt.q}</h3>
                <span className="text-xs font-mono font-semibold text-emerald-700 shrink-0">
                  {pt.status}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{pt.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
