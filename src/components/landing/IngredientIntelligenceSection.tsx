'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ForensicIngredient {
  name: string;
  insCode?: string;
  category: 'additive' | 'fat' | 'sugar' | 'whole';
  categoryLabel: string;
  purpose: string;
  quality: 'exemplary' | 'moderate' | 'caution' | 'avoid';
  qualityLabel: string;
  foundIn: string;
  benefits: string;
  concerns: string;
}

const FORENSIC_INGREDIENTS: ForensicIngredient[] = [
  {
    name: 'Refined Palm Oil (Palmolein)',
    category: 'fat',
    categoryLabel: 'Industrial Fat',
    purpose: 'Cheapest industrial shortening and frying fat; grants long ambient shelf life without turning rancid.',
    quality: 'avoid',
    qualityLabel: 'High Risk',
    foundIn: 'Instant noodles, potato chips, commercial biscuits, namkeen',
    benefits: 'Zero cholesterol; highly stable under commercial high-heat frying.',
    concerns: 'Up to 50% saturated palmitic acid. Strongly linked in clinical cardiology to elevated ApoB and arterial stiffening.',
  },
  {
    name: 'Caramel IV (Sulphite Ammonia)',
    insCode: 'INS 150d',
    category: 'additive',
    categoryLabel: 'Chemical Colorant',
    purpose: 'Provides deep dark brown color to simulate whole grain or rich chocolate appearance.',
    quality: 'caution',
    qualityLabel: 'Caution',
    foundIn: 'Commercial "Brown" bread, cola drinks, barbecue sauces, cake mixes',
    benefits: 'Visual browning stability only; zero nutritive value.',
    concerns: 'Synthesized with ammonia and sulphites; produces 4-methylimidazole (4-MeI) byproduct monitored by international food safety bodies.',
  },
  {
    name: 'Invert Sugar Syrup / Maltodextrin',
    category: 'sugar',
    categoryLabel: 'Hidden Sugar',
    purpose: 'Bulking sweetener and moisture-retention agent that prevents sugar recrystallization.',
    quality: 'avoid',
    qualityLabel: 'High Sugar',
    foundIn: 'Flavored yogurts, breakfast cereals, glucose biscuits, energy bars',
    benefits: 'Instant glucose surge for extreme endurance athletics only.',
    concerns: 'Glycemic Index exceeding 100—higher than pure table sugar. Absorbs almost instantly, spiking insulin and promoting visceral fat deposition.',
  },
  {
    name: 'Disodium 5-Ribonucleotides',
    insCode: 'INS 635 / 627+631',
    category: 'additive',
    categoryLabel: 'Flavour Enhancer',
    purpose: 'Synergistic umami compound multiplying the sensation of saltiness and savory richness.',
    quality: 'caution',
    qualityLabel: 'Caution',
    foundIn: 'Instant noodle tastemakers, flavored potato wafers, canned soups',
    benefits: 'Allows manufacturers to reduce pure table salt while boosting intense tongue flavor.',
    concerns: 'Can trigger pseudo-allergic sensitivities or gout flare-ups; engineered to create hyper-palatability and overeating cycles.',
  },
  {
    name: 'Mono & Diglycerides of Fatty Acids',
    insCode: 'INS 471',
    category: 'additive',
    categoryLabel: 'Synthetic Emulsifier',
    purpose: 'Binds oils and moisture together so packaged foods remain soft and crumb-free for weeks.',
    quality: 'moderate',
    qualityLabel: 'Moderate',
    foundIn: 'Packaged breads, soft cakes, margarine, peanut butter spreads',
    benefits: 'Prevents oil separation and moisture staling.',
    concerns: 'Recent microbiome studies indicate synthetic emulsifiers may thin the protective intestinal mucus layer.',
  },
  {
    name: '100% Whole Grain Rolled Oats',
    category: 'whole',
    categoryLabel: 'Clean Whole Food',
    purpose: 'Intact unrefined cereal grain maintaining original oat bran, endosperm, and germ.',
    quality: 'exemplary',
    qualityLabel: 'Exemplary',
    foundIn: 'Plain rolled oats, unsweetened muesli',
    benefits: 'Rich in beta-glucan soluble fibre proven to bind intestinal bile acids and reduce LDL blood cholesterol. High satiety.',
    concerns: 'None. Clean, unprocessed whole grain.',
  },
];

export default function IngredientIntelligenceSection() {
  const [filter, setFilter] = useState<'all' | 'additive' | 'fat' | 'sugar' | 'whole'>('all');

  const filtered =
    filter === 'all'
      ? FORENSIC_INGREDIENTS
      : FORENSIC_INGREDIENTS.filter((item) => item.category === filter);

  const getQualityClasses = (quality: ForensicIngredient['quality']) => {
    switch (quality) {
      case 'exemplary':
        return {
          box: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300',
          badge: 'bg-[#16A34A] text-white',
        };
      case 'moderate':
        return {
          box: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300',
          badge: 'bg-[#FFB703] text-[#14211A]',
        };
      case 'caution':
        return {
          box: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/40 text-orange-800 dark:text-orange-300',
          badge: 'bg-[#F97316] text-white',
        };
      case 'avoid':
        return {
          box: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300',
          badge: 'bg-[#DC2626] text-white',
        };
    }
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0D1511] text-[#14211A] dark:text-[#EAF5EE] py-16 sm:py-24 border-b border-[#14211A]/10 dark:border-white/10 font-sans transition-colors duration-300">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Top Eyebrow & Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#14211A]/10 dark:border-white/10 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#14532D] dark:text-[#68DBA9] text-xs font-bold uppercase tracking-wider border border-[#16A34A]/20">
              <FileSearch className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>FORENSIC INGREDIENT INTELLIGENCE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14211A] dark:text-[#EAF5EE] tracking-tight leading-tight">
              Decode The Back of The Box
            </h2>
            <p className="font-body-md text-sm sm:text-base text-[#14211A]/75 dark:text-[#EAF5EE]/75 leading-relaxed">
              Food companies use complex INS codes and obscure chemical aliases to obscure palm oil, synthetic emulsifiers, and hidden sugars. WiseFoodies translates every ingredient into clear, transparent human language.
            </p>
          </div>

          <Link
            href="/search"
            className="px-5 py-2.5 rounded-full border border-[#14211A]/20 dark:border-white/20 bg-[#FFFBF2] dark:bg-[#141F1A] text-[#14211A] dark:text-[#EAF5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#14211A] dark:hover:bg-[#16A34A] hover:text-white transition-all inline-flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <span>Search Any Ingredient</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#14211A]/60 dark:text-[#EAF5EE]/60 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Ingredients:</span>
          </span>
          {[
            { id: 'all', label: 'All Audited' },
            { id: 'fat', label: 'Industrial Fats & Palm Oil' },
            { id: 'sugar', label: 'Hidden Sugars' },
            { id: 'additive', label: 'INS Codes & Chemical Additives' },
            { id: 'whole', label: 'Whole Clean Foods' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilter(btn.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === btn.id
                  ? 'bg-[#14211A] dark:bg-[#16A34A] text-white shadow-2xs'
                  : 'bg-[#FFFBF2] dark:bg-[#141F1A] border border-[#14211A]/10 dark:border-white/10 text-[#14211A]/80 dark:text-[#EAF5EE]/80 hover:bg-white dark:hover:bg-[#1B2823]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Forensic Ingredient Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const styling = getQualityClasses(item.quality);
            return (
              <div
                key={item.name}
                className="bg-[#FFFBF2] dark:bg-[#141F1A] rounded-3xl p-6 border border-[#14211A]/10 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(20,33,26,0.05)] hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Card Top: Category + Risk Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#14211A]/60 dark:text-[#EAF5EE]/60 uppercase tracking-wider">
                      {item.categoryLabel}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-2xs ${styling.badge}`}
                    >
                      {item.qualityLabel}
                    </span>
                  </div>

                  {/* Name & Code */}
                  <div>
                    <h3 className="font-bold text-lg text-[#14211A] dark:text-[#EAF5EE] leading-snug">
                      {item.name}
                    </h3>
                    {item.insCode && (
                      <span className="font-mono text-xs font-semibold text-[#14211A]/50 dark:text-[#EAF5EE]/50 block mt-0.5">
                        Code: {item.insCode}
                      </span>
                    )}
                  </div>

                  {/* Purpose */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#14211A]/60 dark:text-[#EAF5EE]/60 uppercase tracking-wider">
                      Why Food Companies Use It:
                    </span>
                    <p className="text-xs text-[#14211A]/80 dark:text-[#EAF5EE]/80 leading-relaxed">{item.purpose}</p>
                  </div>

                  {/* Concerns or Benefits */}
                  <div
                    className={`p-3 rounded-2xl border text-xs leading-relaxed space-y-1 ${styling.box}`}
                  >
                    <span className="font-bold uppercase text-[10px] block opacity-80">
                      Scientific Verdict:
                    </span>
                    <p className="font-medium">{item.concerns || item.benefits}</p>
                  </div>
                </div>

                {/* Common Products */}
                <div className="pt-3 border-t border-[#14211A]/8 dark:border-white/10 text-[11px] text-[#14211A]/60 dark:text-[#EAF5EE]/60">
                  <strong className="text-[#14211A] dark:text-[#EAF5EE] font-semibold">Commonly found in:</strong>{' '}
                  {item.foundIn}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
