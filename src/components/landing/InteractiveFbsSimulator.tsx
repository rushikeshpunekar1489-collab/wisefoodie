'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';

export default function InteractiveFbsSimulator() {
  const [proteinG, setProteinG] = useState<number>(8);
  const [fiberG, setFiberG] = useState<number>(4);
  const [sugarG, setSugarG] = useState<number>(6);
  const [satFatG, setSatFatG] = useState<number>(3);
  const [hasIndustrialAdditives, setHasIndustrialAdditives] = useState<boolean>(false);

  const computeScore = () => {
    let score = 6.0;
    score += Math.min(2.5, (proteinG / 10) * 0.8);
    score += Math.min(2.0, (fiberG / 5) * 0.7);
    score -= (sugarG / 10) * 0.9;
    score -= (satFatG / 5) * 0.7;
    if (hasIndustrialAdditives) {
      score -= 1.2;
    }
    return Math.max(1.0, Math.min(10.0, score));
  };

  const currentScore = computeScore();

  return (
    <section className="container max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl bg-surface-container-lowest p-6 sm:p-10 border border-outline-variant/40 shadow-xs space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-primary-fixed text-on-primary-fixed border border-primary/10">
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>ALGORITHMIC TRANSPARENCY</span>
            </div>
            <h2 className="font-headline-md text-2xl sm:text-3xl text-primary font-serif">
              Live FBS Simulator
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant max-w-xl">
              Adjust the nutrition sliders below. Watch how the Food Benefit Score shifts in real-time as sugars, fats, and chemical UPF markers fluctuate.
            </p>
          </div>

          <Link
            href="/how-fbs-works"
            className="px-4 py-2 rounded-full border border-primary/20 bg-surface-container-low text-primary font-label-caps text-xs uppercase font-bold hover:bg-primary-fixed transition-colors self-start sm:self-auto inline-flex items-center gap-1"
          >
            <span>Full Scientific Formula</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Area */}
          <div className="lg:col-span-7 space-y-5">
            {/* Protein Slider */}
            <div className="space-y-1.5 p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-label-lg font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">fitness_center</span>
                  <span>Intact Protein (per 100g)</span>
                </span>
                <span className="font-display text-sm font-bold text-primary tabular-nums">
                  {proteinG}g
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={proteinG}
                onChange={(e) => setProteinG(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Fiber Slider */}
            <div className="space-y-1.5 p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-label-lg font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">grain</span>
                  <span>Dietary Fibre (per 100g)</span>
                </span>
                <span className="font-display text-sm font-bold text-primary tabular-nums">
                  {fiberG}g
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={fiberG}
                onChange={(e) => setFiberG(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Sugar Slider */}
            <div className="space-y-1.5 p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-label-lg font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-error text-sm">water_drop</span>
                  <span>Free / Added Sugar (per 100g)</span>
                </span>
                <span className="font-display text-sm font-bold text-error tabular-nums">
                  {sugarG}g
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={sugarG}
                onChange={(e) => setSugarG(Number(e.target.value))}
                className="w-full accent-error cursor-pointer"
              />
            </div>

            {/* Saturated Fat Slider */}
            <div className="space-y-1.5 p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-label-lg font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-sm">opacity</span>
                  <span>Saturated Fat / Palm Oil (per 100g)</span>
                </span>
                <span className="font-display text-sm font-bold text-secondary tabular-nums">
                  {satFatG}g
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={satFatG}
                onChange={(e) => setSatFatG(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
            </div>

            {/* Chemical Additives Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-lg">science</span>
                <div>
                  <div className="font-label-lg text-xs text-primary font-bold">
                    Ultra-Processed Food Markers (UPF)
                  </div>
                  <div className="font-body-sm text-[0.6875rem] text-on-surface-variant">
                    Emulsifier 471, INS 621 (MSG), Artificial Flavours, Maltodextrin
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasIndustrialAdditives(!hasIndustrialAdditives)}
                className={`px-3 py-1.5 rounded-full font-label-caps text-xs font-bold transition-all ${
                  hasIndustrialAdditives
                    ? 'bg-error text-on-error shadow-2xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {hasIndustrialAdditives ? 'Detected (-1.2)' : 'Clean'}
              </button>
            </div>
          </div>

          {/* Live Result Pillar */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center space-y-4">
            <span className="font-label-caps text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              DYNAMIC VITALITY CAPSULE
            </span>

            <FBSVitalityCapsule score={currentScore} size="lg" orientation="vertical" />

            <div className="text-xs text-on-surface-variant max-w-xs space-y-1">
              <p className="font-body-sm">
                Score dynamically calculated from 1.0 (UPF Hazard) to 10.0 (Pure Unadulterated Nutrition).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
