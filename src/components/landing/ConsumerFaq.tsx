'use client';

import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export default function ConsumerFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'How is the Food Benefit Score (FBS) calculated?',
      a: 'The FBS starts from a neutral baseline on a 0.0 to 10.0 scale. It mathematically awards points for high-quality protein, intact dietary fibre, and whole-grain density, while deducting points for free and added sugars, saturated fats, excessive sodium, and industrial ultra-processed additives (INS 621, maltodextrin, emulsifiers, artificial sweeteners).',
    },
    {
      q: 'Do FMCG food companies pay for audit ratings?',
      a: 'Absolutely not. WiseFoodies accepts zero brand sponsorships, zero advertising revenue from packaged food companies, and zero paid listing privileges. Our algorithmic Food Benefit Score evaluates products purely based on declared packaging disclosures and independent laboratory standards.',
    },
    {
      q: 'What is the ₹10 Test (Nutrition Per Paisa)?',
      a: 'Nutrition Per Paisa evaluates how many grams of real protein and intact dietary fibre you extract per ₹10 spent. It exposes high-priced "health foods" that cost 5x more while delivering less nutrition than standard whole Indian staples like rolled oats or roasted chana.',
    },
    {
      q: 'How does the in-store Barcode Scanner work?',
      a: 'Our browser-based barcode scanner accesses your device camera securely without requiring any app download. It scans the standard EAN-13 barcode on Indian packaged food and immediately matches it against our 852+ audited product database to display the Food Benefit Score right in the supermarket aisle.',
    },
    {
      q: 'Are cooked Indian foods included in the database?',
      a: 'Yes. Beyond our 852 Indian packaged products, WiseFoodies integrates over 8,500+ cooked Indian recipes and regional dishes benchmarked directly from the Indian Food Composition Tables (IFCT) published by the National Institute of Nutrition (ICMR-NIN), Hyderabad.',
    },
  ];

  return (
    <section className="container max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl bg-surface-container-lowest p-6 sm:p-10 border border-outline-variant/40 shadow-xs space-y-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-primary-fixed text-on-primary-fixed border border-primary/10">
            <span className="material-symbols-outlined text-sm">quiz</span>
            <span>TRANSPARENCY &amp; METHODOLOGY</span>
          </div>
          <h2 className="font-headline-md text-2xl sm:text-3xl text-primary font-serif">
            Frequently Asked Questions
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant max-w-xl">
            Everything you need to know about our independent ratings, forensic methodology, and scientific independence.
          </p>
        </div>

        <div className="divide-y divide-outline-variant/20 border-t border-b border-outline-variant/20">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="font-headline-sm text-sm sm:text-base text-primary group-hover:text-primary-container transition-colors">
                    {faq.q}
                  </span>
                  <span
                    className={`material-symbols-outlined text-on-surface-variant text-xl transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <p className="font-body-md text-sm text-on-surface-variant pt-3 leading-relaxed animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
