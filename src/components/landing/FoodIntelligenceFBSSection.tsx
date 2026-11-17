'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Sliders,
} from 'lucide-react';
import FBSVitalityLiquidCapsule, { FBS_TIERS, getFBSTier } from '@/components/FBSVitalityLiquidCapsule';

interface FoodArchetype {
  name: string;
  category: string;
  score: number;
  badge: string;
  positives: string[];
  negatives: string[];
}

const ARCHETYPES: FoodArchetype[] = [
  {
    name: '100% Whole Rolled Oats',
    category: 'Breakfast Cereals',
    score: 9.2,
    badge: 'Exemplary Choice',
    positives: ['+1.5 pts: 11.8g clean plant protein', '+1.5 pts: 10.5g beta-glucan soluble fibre', '+1.0 pt: 100% unrefined whole grain'],
    negatives: ['0 penalties: Zero added sugar, zero sodium, zero processing additives'],
  },
  {
    name: 'Pasteurised Toned Milk',
    category: 'Dairy',
    score: 7.2,
    badge: 'Good Choice',
    positives: ['+1.2 pts: Complete biological protein (3.1g/100ml)', '+0.5 pt: Natural bioavailable calcium & vitamins A/D'],
    negatives: ['-0.5 pt: Saturated milk fat (3.0g/100ml)'],
  },
  {
    name: 'Digestive High-Fibre Biscuit',
    category: 'Biscuits',
    score: 5.6,
    badge: 'Moderate',
    positives: ['+0.8 pt: Moderate dietary wheat fibre (6.0g)', '+0.5 pt: Whole wheat flour present'],
    negatives: ['-1.0 pt: 16.5g added sugar per 100g', '-0.7 pt: Refined palm oil shortening'],
  },
  {
    name: 'Commercial Butter Cookie',
    category: 'Biscuits & Cookies',
    score: 3.0,
    badge: 'Caution',
    positives: ['+0.4 pt: Trace protein from wheat gluten'],
    negatives: ['-1.5 pts: 22.5g added refined sucrose', '-1.0 pt: Refined maida flour base', '-0.5 pt: Palm oil shortening with synthetic emulsifiers'],
  },
  {
    name: 'Instant Fried Masala Noodles',
    category: 'Instant Food',
    score: 2.2,
    badge: 'Avoid / UPF',
    positives: ['Convenience only; minimal intact micronutrients'],
    negatives: ['-1.5 pts: 1,230mg extreme sodium (>61% adult RDA)', '-1.0 pt: Flash-fried in industrial palm oil', '-0.5 pt: Synthetic flavor enhancers (INS 635) & thickeners'],
  },
];

export default function FoodIntelligenceFBSSection() {
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState(0);
  const [customScore, setCustomScore] = useState<number | null>(null);

  const activeArchetype = ARCHETYPES[selectedArchetypeIndex];
  const activeScore = customScore !== null ? customScore : activeArchetype.score;
  const activeTier = getFBSTier(activeScore);

  return (
    <section className="relative overflow-hidden bg-white text-[#14211A] py-16 sm:py-24 border-b border-[#14211A]/10 font-sans">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Top Eyebrow & Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#14211A]/10 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#14532D] text-xs font-bold uppercase tracking-wider border border-[#16A34A]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>THE SCIENTIFIC RATING ENGINE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14211A] tracking-tight leading-tight">
              Food Benefit Score (FBS)
            </h2>
            <p className="font-body-md text-sm sm:text-base text-[#14211A]/75 leading-relaxed">
              WiseFoodies does not rely on marketing buzzwords. Our proprietary FBS algorithm evaluates packaged food on an impartial 0.0 to 10.0 scale, rewarding natural protein, fibre, and whole ingredients while strictly penalizing added sugars, extreme sodium, and ultra-processed additives.
            </p>
          </div>

          <Link
            href="/how-fbs-works"
            className="px-5 py-2.5 rounded-full border border-[#14211A]/20 bg-[#FFFBF2] text-[#14211A] text-xs font-bold uppercase tracking-wider hover:bg-[#14211A] hover:text-white transition-all inline-flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <span>Read 11 Algorithm Factors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* The Signature Liquid Capsule & Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFBF2] rounded-3xl p-6 sm:p-10 border border-[#14211A]/10 shadow-[0_8px_30px_rgba(20,33,26,0.06)]">
          {/* Left Column: Signature Animated FBS Vitality Liquid Capsule */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-6 bg-white/70 rounded-2xl border border-[#14211A]/8 backdrop-blur-sm shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#14211A]/60 mb-4">
              SIGNATURE FBS VITALITY CAPSULE
            </span>

            {/* The Animated Liquid Capsule */}
            <FBSVitalityLiquidCapsule
              score={activeScore}
              size="hero"
              showLabel={true}
              interactive={true}
              onScoreChange={(newScore) => setCustomScore(newScore)}
            />

            <div className="mt-8 w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#14211A]/70">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Interactive Meniscus Slider</span>
                </span>
                <span className="font-bold tabular-nums text-[#14211A]">{activeScore.toFixed(1)} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={activeScore}
                onChange={(e) => setCustomScore(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#14211A]/10 rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
              />
              <p className="text-[10px] text-center text-[#14211A]/50">
                Drag slider to simulate liquid wave dynamics &amp; color transitions
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Archetype Selector & Forensic Factor Audit */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#14211A]/60 uppercase tracking-wider block mb-2">
                1. Select a Real Indian Food Archetype:
              </span>
              <div className="flex flex-wrap gap-2">
                {ARCHETYPES.map((arch, idx) => {
                  const isSelected = selectedArchetypeIndex === idx && customScore === null;
                  return (
                    <button
                      key={arch.name}
                      type="button"
                      onClick={() => {
                        setSelectedArchetypeIndex(idx);
                        setCustomScore(null);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#14211A] text-white shadow-sm scale-[1.02]'
                          : 'bg-white border border-[#14211A]/12 text-[#14211A]/80 hover:bg-white/90'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: getFBSTier(arch.score).color }}
                      />
                      <span>{arch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Forensic Deductions & Boosts for current item */}
            <div className="bg-white rounded-2xl p-5 border border-[#14211A]/10 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#14211A]/8">
                <div>
                  <h3 className="font-bold text-base text-[#14211A]">{activeArchetype.name}</h3>
                  <span className="text-xs text-[#14211A]/60 uppercase tracking-wider">
                    {activeArchetype.category}
                  </span>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-black uppercase text-white shadow-2xs"
                  style={{ backgroundColor: activeTier.color }}
                >
                  {activeTier.name} • {activeScore.toFixed(1)}
                </div>
              </div>

              {/* Nutritional Positive Boosts */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Scientific Positive Boosts:</span>
                </span>
                <ul className="space-y-1 pl-5 list-disc text-xs text-[#14211A]/80">
                  {activeArchetype.positives.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Nutritional Negative Deductions */}
              <div className="space-y-1.5 pt-2 border-t border-[#14211A]/8">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Penalties &amp; Processing Deductions:</span>
                </span>
                <ul className="space-y-1 pl-5 list-disc text-xs text-[#14211A]/80">
                  {activeArchetype.negatives.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Scientific Summary Statement */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">{activeTier.name} Food Standard:</strong> {activeTier.summary}
              </div>
            </div>
          </div>
        </div>

        {/* 5 Distinct FBS Category Tiers Reference Table */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-[#14211A] uppercase tracking-wider">
            Official FBS Classification Spectrum
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {FBS_TIERS.map((tier) => (
              <div
                key={tier.name}
                className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#14211A]/10 space-y-2 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span className="text-xs font-mono font-bold text-[#14211A]/80">
                    {tier.min.toFixed(1)} – {tier.max.toFixed(1)}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#14211A]">{tier.name}</h4>
                <p className="text-[11px] text-[#14211A]/70 leading-relaxed">{tier.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
