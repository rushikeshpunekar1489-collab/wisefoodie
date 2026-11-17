'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Coins,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface NutrientMetric {
  name: string;
  amount: number;
  unit: string;
  rdaTarget: number;
  rdaPercent: number;
  isHarmfulExceed: boolean;
  scientificContext: string;
}

interface ProductNutritionProfile {
  name: string;
  brand: string;
  servingDesc: string;
  priceINR: number;
  packWeightG: number;
  proteinPer10INR: number;
  fibrePer10INR: number;
  metrics: NutrientMetric[];
}

const SAMPLE_PROFILES: ProductNutritionProfile[] = [
  {
    name: '100% Whole Rolled Oats',
    brand: 'Quaker',
    servingDesc: 'Per 100g serving',
    priceINR: 65,
    packWeightG: 400,
    proteinPer10INR: 18.2,
    fibrePer10INR: 16.2,
    metrics: [
      { name: 'Calories', amount: 389, unit: 'kcal', rdaTarget: 2000, rdaPercent: 19.5, isHarmfulExceed: false, scientificContext: 'Sustained energy from complex slow-burning carbohydrates.' },
      { name: 'Protein', amount: 11.8, unit: 'g', rdaTarget: 54, rdaPercent: 21.9, isHarmfulExceed: false, scientificContext: 'Essential amino acids for muscle and tissue repair.' },
      { name: 'Carbohydrates', amount: 62.8, unit: 'g', rdaTarget: 130, rdaPercent: 48.3, isHarmfulExceed: false, scientificContext: 'Complex starches; high satiety index.' },
      { name: 'Total Sugar', amount: 0.9, unit: 'g', rdaTarget: 50, rdaPercent: 1.8, isHarmfulExceed: false, scientificContext: 'Naturally occurring in whole grains.' },
      { name: 'Added Sugar', amount: 0.0, unit: 'g', rdaTarget: 25, rdaPercent: 0.0, isHarmfulExceed: true, scientificContext: '0% added sucrose; zero glycemic spikes.' },
      { name: 'Total Fat', amount: 8.5, unit: 'g', rdaTarget: 67, rdaPercent: 12.7, isHarmfulExceed: false, scientificContext: 'Predominantly healthy mono- & polyunsaturated fats.' },
      { name: 'Saturated Fat', amount: 1.6, unit: 'g', rdaTarget: 22, rdaPercent: 7.3, isHarmfulExceed: true, scientificContext: 'Minimal saturated fat.' },
      { name: 'Dietary Fibre', amount: 10.5, unit: 'g', rdaTarget: 30, rdaPercent: 35.0, isHarmfulExceed: false, scientificContext: 'Rich in soluble beta-glucan; lowers blood LDL.' },
      { name: 'Sodium', amount: 4.0, unit: 'mg', rdaTarget: 2000, rdaPercent: 0.2, isHarmfulExceed: true, scientificContext: 'Virtually sodium-free.' },
    ],
  },
  {
    name: 'Good Day Butter Cookies',
    brand: 'Britannia',
    servingDesc: 'Per 100g serving',
    priceINR: 30,
    packWeightG: 120,
    proteinPer10INR: 2.7,
    fibrePer10INR: 0.5,
    metrics: [
      { name: 'Calories', amount: 489, unit: 'kcal', rdaTarget: 2000, rdaPercent: 24.5, isHarmfulExceed: false, scientificContext: 'High calorie density from refined maida and fats.' },
      { name: 'Protein', amount: 6.8, unit: 'g', rdaTarget: 54, rdaPercent: 12.6, isHarmfulExceed: false, scientificContext: 'Mainly wheat gluten without balanced amino acids.' },
      { name: 'Carbohydrates', amount: 68.0, unit: 'g', rdaTarget: 130, rdaPercent: 52.3, isHarmfulExceed: false, scientificContext: 'High glycemic impact from refined flour and sugar.' },
      { name: 'Total Sugar', amount: 23.5, unit: 'g', rdaTarget: 50, rdaPercent: 47.0, isHarmfulExceed: false, scientificContext: 'Nearly one-fourth of cookie weight is pure sugar.' },
      { name: 'Added Sugar', amount: 22.5, unit: 'g', rdaTarget: 25, rdaPercent: 90.0, isHarmfulExceed: true, scientificContext: 'Exceeds 90% of entire adult daily added sugar limit!' },
      { name: 'Total Fat', amount: 21.0, unit: 'g', rdaTarget: 67, rdaPercent: 31.3, isHarmfulExceed: false, scientificContext: 'Heavy palm oil shortening.' },
      { name: 'Saturated Fat', amount: 11.2, unit: 'g', rdaTarget: 22, rdaPercent: 50.9, isHarmfulExceed: true, scientificContext: 'Palm oil saturation delivers over 50% daily allowance.' },
      { name: 'Dietary Fibre', amount: 1.2, unit: 'g', rdaTarget: 30, rdaPercent: 4.0, isHarmfulExceed: false, scientificContext: 'Refining bran away leaves negligible fiber.' },
      { name: 'Sodium', amount: 310, unit: 'mg', rdaTarget: 2000, rdaPercent: 15.5, isHarmfulExceed: true, scientificContext: 'Added leavening agents and salt.' },
    ],
  },
  {
    name: '2-Minute Masala Instant Noodles',
    brand: 'Maggi',
    servingDesc: 'Per 70g single cake',
    priceINR: 14,
    packWeightG: 70,
    proteinPer10INR: 4.0,
    fibrePer10INR: 1.1,
    metrics: [
      { name: 'Calories', amount: 299, unit: 'kcal', rdaTarget: 2000, rdaPercent: 15.0, isHarmfulExceed: false, scientificContext: 'Quick caloric rush from deep-fried refined starch.' },
      { name: 'Protein', amount: 5.6, unit: 'g', rdaTarget: 54, rdaPercent: 10.4, isHarmfulExceed: false, scientificContext: 'Trace plant protein from refined flour and gluten.' },
      { name: 'Carbohydrates', amount: 43.8, unit: 'g', rdaTarget: 130, rdaPercent: 33.7, isHarmfulExceed: false, scientificContext: 'Fast digesting starch.' },
      { name: 'Total Sugar', amount: 1.6, unit: 'g', rdaTarget: 50, rdaPercent: 3.2, isHarmfulExceed: false, scientificContext: 'Low sugar profile.' },
      { name: 'Added Sugar', amount: 0.8, unit: 'g', rdaTarget: 25, rdaPercent: 3.2, isHarmfulExceed: true, scientificContext: 'Minor seasoning sugars.' },
      { name: 'Total Fat', amount: 11.0, unit: 'g', rdaTarget: 67, rdaPercent: 16.4, isHarmfulExceed: false, scientificContext: 'Flash-fried in commercial palm oil.' },
      { name: 'Saturated Fat', amount: 5.1, unit: 'g', rdaTarget: 22, rdaPercent: 23.2, isHarmfulExceed: true, scientificContext: 'Elevated saturated fat from frying oil.' },
      { name: 'Dietary Fibre', amount: 1.5, unit: 'g', rdaTarget: 30, rdaPercent: 5.0, isHarmfulExceed: false, scientificContext: 'Minimal intact dietary fibre.' },
      { name: 'Sodium', amount: 861, unit: 'mg', rdaTarget: 2000, rdaPercent: 43.1, isHarmfulExceed: true, scientificContext: 'Severe sodium load from salt and flavor enhancers.' },
    ],
  },
];

export default function NutritionAnalysisSection() {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const activeProfile = SAMPLE_PROFILES[selectedProfileIndex];

  return (
    <section className="relative overflow-hidden bg-[#FFFBF2] dark:bg-[#0D1511] text-[#14211A] dark:text-[#EAF5EE] py-16 sm:py-24 border-b border-[#14211A]/10 dark:border-white/10 font-sans transition-colors duration-300">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Top Eyebrow & Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#14211A]/10 dark:border-white/10 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#14532D] dark:text-[#68DBA9] text-xs font-bold uppercase tracking-wider border border-[#16A34A]/20">
              <BarChart3 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>ICMR-NIN 2024 NUTRITION BENCHMARK</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14211A] dark:text-[#EAF5EE] tracking-tight leading-tight">
              Nutrition Analysis &amp; Reference Graphs
            </h2>
            <p className="font-body-md text-sm sm:text-base text-[#14211A]/75 dark:text-[#EAF5EE]/75 leading-relaxed">
              Understand the actual nutritional contribution of packaged food. Every nutrient is benchmarked against the official Indian Council of Medical Research (ICMR-NIN) Recommended Dietary Allowances for adult health.
            </p>
          </div>

          {/* Product Switcher Buttons */}
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            {SAMPLE_PROFILES.map((p, idx) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedProfileIndex(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedProfileIndex === idx
                    ? 'bg-[#14211A] dark:bg-[#16A34A] text-white shadow-xs'
                    : 'bg-white dark:bg-[#1B2823] border border-[#14211A]/12 dark:border-white/10 text-[#14211A]/80 dark:text-[#EAF5EE]/80 hover:bg-white/90 dark:hover:bg-[#22322C]'
                }`}
              >
                {p.brand} ({p.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* 9 HORIZONTAL NUTRITIONAL REFERENCE GRAPHS */}
        <div className="bg-white dark:bg-[#141F1A] rounded-3xl p-6 sm:p-10 border border-[#14211A]/10 dark:border-white/10 shadow-[0_8px_30px_rgba(20,33,26,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#14211A]/8 dark:border-white/10">
            <div>
              <h3 className="font-bold text-lg text-[#14211A] dark:text-[#EAF5EE]">
                {activeProfile.name} • <span className="text-[#16A34A] dark:text-[#34D399]">{activeProfile.brand}</span>
              </h3>
              <p className="text-xs text-[#14211A]/60 dark:text-[#EAF5EE]/60">{activeProfile.servingDesc} vs Official Daily RDA Ceiling</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <span>Beneficial Nutrient</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                <span>Limit / Ceiling Warning</span>
              </div>
            </div>
          </div>

          {/* Graphs Grid */}
          <div className="space-y-4">
            {activeProfile.metrics.map((metric) => {
              const clampedPercent = Math.min(100, metric.rdaPercent);
              const isOverLimit = metric.isHarmfulExceed && metric.rdaPercent >= 35;

              return (
                <div key={metric.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#14211A] flex items-center gap-1.5">
                      <span>{metric.name}</span>
                      {isOverLimit && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold uppercase">
                          High
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold tabular-nums text-[#14211A]">
                        {metric.amount}
                        {metric.unit}
                      </span>
                      <span className="text-[11px] text-[#14211A]/50">
                        ({metric.rdaPercent.toFixed(1)}% of {metric.rdaTarget}
                        {metric.unit} RDA)
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Track */}
                  <div className="relative w-full h-3.5 bg-[#FFFBF2] dark:bg-[#1C2A24] rounded-full overflow-hidden border border-[#14211A]/10 dark:border-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: isAnimated ? `${clampedPercent}%` : '0%',
                        backgroundColor: isOverLimit
                          ? '#DC2626'
                          : metric.isHarmfulExceed
                          ? '#F97316'
                          : '#16A34A',
                      }}
                    />
                  </div>

                  <p className="text-[10px] text-[#14211A]/60 dark:text-[#EAF5EE]/60 leading-tight">
                    {metric.scientificContext}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* NUTRITION PER PAISA VALUE INTELLIGENCE (THE ₹10 VALUE TEST) */}
        <div className="bg-[#14211A] dark:bg-[#141F1A] text-white rounded-3xl p-6 sm:p-10 border border-[#14211A] dark:border-white/15 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFB703] text-[#14211A]">
                <Coins className="w-3.5 h-3.5" />
                <span>VALUE INTELLIGENCE • THE ₹10 TEST</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">
                How Much Real Nutrition Does ₹10 Truly Buy?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                Shiny gold foil, foreign fonts, and celebrity endorsements inflate packaged food prices. We calculate grams of actual protein and intact fibre delivered per 10 rupees spent.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs text-white/90 text-right">
              <span className="text-[10px] uppercase font-bold text-[#FFB703] block">Formula</span>
              <span>(Grams / Pack) ÷ (Price INR) × 10</span>
            </div>
          </div>

          {/* Comparative Horizontal Bars: Oats vs Biscuits vs Snacks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFB703]">
                ₹10 PROTEIN YIELD COMPARISON
              </span>

              {/* Item 1: Rolled Oats */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Whole Rolled Oats (₹65 / 400g)</span>
                  </span>
                  <span className="font-black text-emerald-400 tabular-nums text-sm">
                    18.2g Protein
                  </span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: isAnimated ? '100%' : '0%' }}
                  />
                </div>
                <span className="text-[11px] text-white/60">Delivers high-protein value per rupee.</span>
              </div>

              {/* Item 2: Roasted Jowar Puffs */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mille Roasted Jowar Puffs (₹40 / 80g)</span>
                  </span>
                  <span className="font-bold text-emerald-300 tabular-nums">
                    7.5g Protein
                  </span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22C55E] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: isAnimated ? '41%' : '0%' }}
                  />
                </div>
              </div>

              {/* Item 3: Commercial Biscuits */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white/80 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Commercial Butter Cookies (₹30 / 120g)</span>
                  </span>
                  <span className="font-bold text-rose-400 tabular-nums">
                    1.1g Protein
                  </span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#DC2626] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: isAnimated ? '6%' : '0%' }}
                  />
                </div>
                <span className="text-[11px] text-rose-300/80">
                  You pay mostly for refined maida, sugar and palm oil.
                </span>
              </div>
            </div>

            {/* Explanatory Editorial Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFB703]">
                The Grocery Aisles Paradox
              </span>
              <h4 className="font-display text-xl font-bold text-white">
                Why &ldquo;Convenient&rdquo; Food Costs 16x More Per Gram of Protein
              </h4>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                A ₹450 designer granola or artisan cookie bar often provides less intact dietary fibre and bioavailable protein per ₹10 than a simple bag of whole rolled oats or roasted chana. WiseFoodies strips away marketing promises so you can vote with your wallet for real health.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white">
                  ₹/g Pure Protein
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white">
                  ₹/g Intact Fibre
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white">
                  Sugar Cost Ratio
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
