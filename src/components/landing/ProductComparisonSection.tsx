'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Zap,
} from 'lucide-react';

interface ComparisonMatchup {
  title: string;
  category: string;
  productA: {
    name: string;
    brand: string;
    image: string;
    fbsScore: number;
    fbsLabel: string;
    proteinG: number;
    addedSugarG: number;
    satFatG: number;
    additivesCount: number;
    proteinPer10INR: number;
    verdict: string;
    isWinner: boolean;
  };
  productB: {
    name: string;
    brand: string;
    image: string;
    fbsScore: number;
    fbsLabel: string;
    proteinG: number;
    addedSugarG: number;
    satFatG: number;
    additivesCount: number;
    proteinPer10INR: number;
    verdict: string;
    isWinner: boolean;
  };
}

const COMPARISON_MATCHUPS: ComparisonMatchup[] = [
  {
    title: 'Breakfast Showdown: Whole Rolled Oats vs Sugar Flakes',
    category: 'Breakfast Cereals',
    productA: {
      name: '100% Whole Rolled Oats',
      brand: 'Quaker',
      image: '/products/quaker-multigrain-oats.webp',
      fbsScore: 9.2,
      fbsLabel: 'Exemplary',
      proteinG: 11.8,
      addedSugarG: 0.0,
      satFatG: 1.6,
      additivesCount: 0,
      proteinPer10INR: 18.2,
      verdict: '100% intact whole grain with zero added sucrose and rich soluble beta-glucan.',
      isWinner: true,
    },
    productB: {
      name: 'Refined Chocolate Cereal Flakes',
      brand: 'Commercial Brand',
      image: '/products/orion-orion-choco-pie-chocolate-coated-soft-biscuit-13.webp',
      fbsScore: 3.2,
      fbsLabel: 'Caution',
      proteinG: 5.5,
      addedSugarG: 29.0,
      satFatG: 3.5,
      additivesCount: 6,
      proteinPer10INR: 3.1,
      verdict: 'Over 29% sugar by weight; refined corn flour causes rapid insulin spikes in children.',
      isWinner: false,
    },
  },
  {
    title: 'Beverage Showdown: Cold-Pressed Citrus vs Reconstituted Fruit Drink',
    category: 'Fruit Juices',
    productA: {
      name: 'Cold-Pressed 100% Orange Juice',
      brand: 'Raw Pressery',
      image: '/products/raw-pressery-cold-pressed-orange-juice.webp',
      fbsScore: 7.4,
      fbsLabel: 'Good',
      proteinG: 0.9,
      addedSugarG: 0.0,
      satFatG: 0.1,
      additivesCount: 0,
      proteinPer10INR: 1.2,
      verdict: 'Zero added table sugar, cold-pasteurized with intact native ascorbic acid.',
      isWinner: true,
    },
    productB: {
      name: 'Commercial Mango Fruit Beverage',
      brand: 'Frooti',
      image: '/products/frooti-mango-drink-family-pack.webp',
      fbsScore: 1.6,
      fbsLabel: 'Avoid / UPF',
      proteinG: 0.1,
      addedSugarG: 13.5,
      satFatG: 0.0,
      additivesCount: 4,
      proteinPer10INR: 0.1,
      verdict: 'Only 15% mango pulp; remainder is water, industrial sugar syrup, acidity regulators, and artificial colors.',
      isWinner: false,
    },
  },
  {
    title: 'Snack Showdown: Roasted Jowar Millets vs Fried Potato Wafers',
    category: 'Healthy Snacks',
    productA: {
      name: 'Roasted Jowar Puffs (Himalayan Salt)',
      brand: 'Mille',
      image: '/products/mille-mille-jowar-puffs-258.webp',
      fbsScore: 7.4,
      fbsLabel: 'Good',
      proteinG: 8.4,
      addedSugarG: 0.0,
      satFatG: 2.1,
      additivesCount: 0,
      proteinPer10INR: 7.5,
      verdict: 'Roasted ancient grain sorghum puffs, gluten-free, high prebiotic fibre.',
      isWinner: true,
    },
    productB: {
      name: 'Classic Salted Potato Wafers',
      brand: 'Commercial Chips',
      image: '/products/let-s-try-let-s-try-potato-wafers-260.webp',
      fbsScore: 3.8,
      fbsLabel: 'Caution',
      proteinG: 6.2,
      addedSugarG: 0.5,
      satFatG: 14.5,
      additivesCount: 2,
      proteinPer10INR: 1.8,
      verdict: 'Deep fried in refined palm oil delivering over 14g saturated fat per 100g.',
      isWinner: false,
    },
  },
];

export default function ProductComparisonSection() {
  const [selectedMatchupIndex, setSelectedMatchupIndex] = useState(0);
  const activeMatchup = COMPARISON_MATCHUPS[selectedMatchupIndex];

  return (
    <section className="relative overflow-hidden bg-[#FFFBF2] text-[#14211A] py-16 sm:py-24 border-b border-[#14211A]/10 font-sans">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Top Eyebrow & Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#14211A]/10 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#14532D] text-xs font-bold uppercase tracking-wider border border-[#16A34A]/20">
              <Scale className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>HEAD-TO-HEAD SCIENTIFIC SHOWDOWN</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14211A] tracking-tight leading-tight">
              Compare Before You Choose
            </h2>
            <p className="font-body-md text-sm sm:text-base text-[#14211A]/75 leading-relaxed">
              Two products on the same shelf can look identical from the front, yet have radically different health consequences. See our side-by-side scientific comparison matrix.
            </p>
          </div>

          <Link
            href="/compare"
            className="px-5 py-2.5 rounded-full border border-[#14211A]/20 bg-white text-[#14211A] text-xs font-bold uppercase tracking-wider hover:bg-[#14211A] hover:text-white transition-all inline-flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <span>Compare Any 2 to 4 Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Matchup Tabs */}
        <div className="flex flex-wrap gap-2">
          {COMPARISON_MATCHUPS.map((m, idx) => (
            <button
              key={m.title}
              type="button"
              onClick={() => setSelectedMatchupIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedMatchupIndex === idx
                  ? 'bg-[#14211A] text-white shadow-xs'
                  : 'bg-white border border-[#14211A]/12 text-[#14211A]/80 hover:bg-white/90'
              }`}
            >
              {m.category} Showdown
            </button>
          ))}
        </div>

        {/* Head-to-Head Comparison Arena */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#14211A]/10 shadow-[0_8px_30px_rgba(20,33,26,0.06)] space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A]">
              AUDITED MATCHUP
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-serif text-[#14211A]">
              {activeMatchup.title}
            </h3>
          </div>

          {/* Dual Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* VS Badge in Center (Desktop) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#14211A] text-white items-center justify-center font-black text-sm z-20 shadow-md border-4 border-white">
              VS
            </div>

            {/* Product A (Usually the Clean Winner) */}
            <div
              className={`rounded-3xl p-6 sm:p-7 border flex flex-col justify-between space-y-6 transition-all ${
                activeMatchup.productA.isWinner
                  ? 'bg-[#F0FDF4] border-[#16A34A]/30 shadow-sm'
                  : 'bg-[#FFFBF2] border-[#14211A]/10'
              }`}
            >
              <div className="space-y-4">
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#14211A]/60">
                    Option A • {activeMatchup.productA.brand}
                  </span>
                  {activeMatchup.productA.isWinner && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#16A34A] text-white text-xs font-black uppercase tracking-wider shadow-2xs">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Wise Choice</span>
                    </span>
                  )}
                </div>

                {/* Image & Title */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-white rounded-2xl p-2 border border-[#14211A]/10 shrink-0 flex items-center justify-center">
                    <Image
                      src={activeMatchup.productA.image}
                      alt={activeMatchup.productA.name}
                      width={64}
                      height={64}
                      className="object-contain max-h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#14211A] leading-snug">
                      {activeMatchup.productA.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#16A34A] text-white text-xs font-black">
                        FBS {activeMatchup.productA.fbsScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#16A34A] font-bold">
                        {activeMatchup.productA.fbsLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="bg-white/80 rounded-2xl p-4 border border-[#14211A]/8 space-y-2.5 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Protein per 100g</span>
                    <strong className="font-bold text-emerald-800">
                      {activeMatchup.productA.proteinG}g
                    </strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Added Sugar per 100g</span>
                    <strong className="font-bold text-emerald-800">
                      {activeMatchup.productA.addedSugarG}g
                    </strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Saturated Fat per 100g</span>
                    <strong className="font-bold text-[#14211A]">
                      {activeMatchup.productA.satFatG}g
                    </strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Chemical Additives</span>
                    <strong className="font-bold text-emerald-800">
                      {activeMatchup.productA.additivesCount} additives
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#14211A]/70">Protein per ₹10 (Yield)</span>
                    <strong className="font-black text-emerald-800 text-sm">
                      {activeMatchup.productA.proteinPer10INR}g
                    </strong>
                  </div>
                </div>
              </div>

              {/* Verdict Summary */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#16A34A]/20 text-xs text-emerald-950 leading-relaxed">
                <strong className="block text-emerald-800 uppercase text-[10px] font-bold mb-0.5">
                  Scientific Assessment:
                </strong>
                {activeMatchup.productA.verdict}
              </div>
            </div>

            {/* Product B (The Comparison Contrast) */}
            <div
              className={`rounded-3xl p-6 sm:p-7 border flex flex-col justify-between space-y-6 transition-all ${
                activeMatchup.productB.isWinner
                  ? 'bg-[#F0FDF4] border-[#16A34A]/30 shadow-sm'
                  : 'bg-[#FFF7ED] border-[#F97316]/20'
              }`}
            >
              <div className="space-y-4">
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#14211A]/60">
                    Option B • {activeMatchup.productB.brand}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Cautionary Option</span>
                  </span>
                </div>

                {/* Image & Title */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-white rounded-2xl p-2 border border-[#14211A]/10 shrink-0 flex items-center justify-center">
                    <Image
                      src={activeMatchup.productB.image}
                      alt={activeMatchup.productB.name}
                      width={64}
                      height={64}
                      className="object-contain max-h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#14211A] leading-snug">
                      {activeMatchup.productB.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#DC2626] text-white text-xs font-black">
                        FBS {activeMatchup.productB.fbsScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-rose-700 font-bold">
                        {activeMatchup.productB.fbsLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="bg-white/80 rounded-2xl p-4 border border-[#14211A]/8 space-y-2.5 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Protein per 100g</span>
                    <strong className="font-bold text-[#14211A]">
                      {activeMatchup.productB.proteinG}g
                    </strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Added Sugar per 100g</span>
                    <strong className="font-bold text-rose-700">
                      {activeMatchup.productB.addedSugarG}g (High)
                    </strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Saturated Fat per 100g</span>
                    <strong className="font-bold text-rose-700">
                      {activeMatchup.productB.satFatG}g
                    </strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-[#14211A]/8">
                    <span className="text-[#14211A]/70">Chemical Additives</span>
                    <strong className="font-bold text-rose-700">
                      {activeMatchup.productB.additivesCount} additives
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#14211A]/70">Protein per ₹10 (Yield)</span>
                    <strong className="font-black text-rose-700 text-sm">
                      {activeMatchup.productB.proteinPer10INR}g (Low Value)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Verdict Summary */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-200 text-xs text-rose-950 leading-relaxed">
                <strong className="block text-rose-800 uppercase text-[10px] font-bold mb-0.5">
                  Scientific Assessment:
                </strong>
                {activeMatchup.productB.verdict}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
