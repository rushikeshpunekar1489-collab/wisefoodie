'use client';

import React, { useEffect, useState, useMemo } from 'react';

export interface RDABarsProps {
  servingSizeG?: number | null;
  per100g?: {
    energyKcal?: number | null;
    caloriesKcal?: number | null;
    proteinG?: number | null;
    carbsG?: number | null;
    carbohydratesG?: number | null;
    totalSugarG?: number | null;
    sugarG?: number | null;
    addedSugarG?: number | null;
    fatG?: number | null;
    totalFatG?: number | null;
    satFatG?: number | null;
    saturatedFatG?: number | null;
    sodiumMg?: number | null;
    fibreG?: number | null;
    dietaryFiberG?: number | null;
  } | null;
  hideCardWrapper?: boolean;
  className?: string;
}

interface NutrientRDA {
  name: string;
  val: number;
  rda: number;
  unit: string;
  harmful: boolean;
  desc: string;
}

export default function RDABars({
  servingSizeG,
  per100g,
  hideCardWrapper = false,
  className = '',
}: RDABarsProps) {
  const [animated, setAnimated] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [mode, setMode] = useState<'100g' | 'serving'>('100g');

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const hasServing = Boolean(servingSizeG && servingSizeG > 0 && servingSizeG !== 100);
  const servingMultiplier = mode === 'serving' && servingSizeG ? servingSizeG / 100 : 1;

  // Extract raw 100g values supporting both Product and PackagedFoodItem schemas
  const rawCalories = per100g?.energyKcal ?? per100g?.caloriesKcal ?? null;
  const rawProtein = per100g?.proteinG ?? null;
  const rawFibre = per100g?.fibreG ?? per100g?.dietaryFiberG ?? null;
  const rawSugar = per100g?.addedSugarG ?? per100g?.totalSugarG ?? per100g?.sugarG ?? null;
  const rawSatFat = per100g?.satFatG ?? per100g?.saturatedFatG ?? null;
  const rawSodium = per100g?.sodiumMg ?? null;

  const nutrients: NutrientRDA[] = useMemo(() => {
    const items: Array<NutrientRDA | null> = [
      rawCalories !== null
        ? {
            name: 'Calories',
            val: Math.round(rawCalories * servingMultiplier),
            rda: 2000,
            unit: 'kcal',
            harmful: false,
            desc: 'Based on 2,000 kcal standard daily energy allowance (ICMR-NIN 2024 for Indian adults).',
          }
        : null,
      rawProtein !== null
        ? {
            name: 'Protein',
            val: Math.round(rawProtein * servingMultiplier * 10) / 10,
            rda: 54,
            unit: 'g',
            harmful: false,
            desc: 'RDA: 54g/day for reference Indian adults (approx. 0.83 - 1.0g per kg body weight).',
          }
        : null,
      rawFibre !== null
        ? {
            name: 'Dietary Fibre',
            val: Math.round(rawFibre * servingMultiplier * 10) / 10,
            rda: 30,
            unit: 'g',
            harmful: false,
            desc: 'RDA: Minimum 30g daily for optimal gut microbiome, satiety, and cardiovascular health.',
          }
        : null,
      rawSugar !== null
        ? {
            name: 'Total Sugars',
            val: Math.round(rawSugar * servingMultiplier * 10) / 10,
            rda: 25,
            unit: 'g',
            harmful: true,
            desc: 'WHO & ICMR-NIN safe upper limit: max 25g free sugars (approx. 5-6 teaspoons) per day.',
          }
        : null,
      rawSatFat !== null
        ? {
            name: 'Saturated Fat',
            val: Math.round(rawSatFat * servingMultiplier * 10) / 10,
            rda: 22,
            unit: 'g',
            harmful: true,
            desc: 'Upper limit: max 22g daily (<10% of total dietary energy intake).',
          }
        : null,
      rawSodium !== null
        ? {
            name: 'Sodium',
            val: Math.round(rawSodium * servingMultiplier),
            rda: 2000,
            unit: 'mg',
            harmful: true,
            desc: 'Safe limit: 2,000mg sodium daily (equivalent to 5g of total dietary table salt).',
          }
        : null,
    ];

    return items.filter((n): n is NutrientRDA => n !== null);
  }, [rawCalories, rawProtein, rawFibre, rawSugar, rawSatFat, rawSodium, servingMultiplier]);

  const content = (
    <div className="w-full space-y-4">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-primary text-base">bar_chart</span>
            <span className="font-label-caps text-[0.625rem] text-primary font-bold uppercase tracking-wider">
              Clinical ICMR-NIN 2024 Reference
            </span>
          </div>
          <h4 className="font-headline-sm text-base text-primary font-serif">
            RDA Daily Contribution Graph
          </h4>
        </div>

        {/* Serving Size Segmented Toggle */}
        {hasServing ? (
          <div
            role="radiogroup"
            aria-label="RDA calculation basis"
            className="inline-flex p-0.5 bg-surface-container rounded-full border border-outline-variant/40 self-start sm:self-auto text-xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={mode === '100g'}
              onClick={() => setMode('100g')}
              className={`py-1 px-3 rounded-full font-label-caps text-xs uppercase font-bold transition-all ${
                mode === '100g'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Per 100g
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'serving'}
              onClick={() => setMode('serving')}
              className={`py-1 px-3 rounded-full font-label-caps text-xs uppercase font-bold transition-all ${
                mode === 'serving'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Pack Serving ({servingSizeG}g)
            </button>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-[0.625rem] uppercase font-bold border border-outline-variant/30 self-start sm:self-auto">
            <span>Per 100g Baseline</span>
          </span>
        )}
      </div>

      {/* Nutrient Progress Bars */}
      {nutrients.length > 0 ? (
        <div className="space-y-4">
          {nutrients.map((n) => {
            const pct = Math.round((n.val / n.rda) * 100);
            const clampedWidth = Math.min(100, Math.max(3, pct));
            const barWidth = animated ? `${clampedWidth}%` : '0%';

            // Determine status and badge styling
            let badgeBg = 'bg-primary-fixed text-on-primary-fixed';
            let badgeText = `${pct}% RDA`;
            let barColor = '#16a34a'; // Vibrant Leaf Green

            if (n.harmful) {
              if (pct > 100) {
                badgeBg = 'bg-error text-on-error';
                badgeText = `${pct}% RDA (Exceeds Limit!)`;
                barColor = '#ba1a1a';
              } else if (pct > 40) {
                badgeBg = 'bg-error-container text-on-error-container';
                badgeText = `${pct}% RDA (High)`;
                barColor = '#dc2626';
              } else if (pct > 20) {
                badgeBg = 'bg-secondary-fixed text-on-secondary-fixed';
                badgeText = `${pct}% RDA (Moderate)`;
                barColor = '#fc9022';
              } else {
                badgeBg = 'bg-surface-container text-on-surface';
                badgeText = `${pct}% RDA (Low)`;
                barColor = '#16a34a';
              }
            } else {
              if (pct >= 30) {
                badgeText = `${pct}% RDA (High Source)`;
              }
            }

            const isTooltipOpen = activeTooltip === n.name;

            return (
              <div
                key={n.name}
                className="group cursor-pointer rounded-lg p-2 -mx-2 hover:bg-surface-container-low/60 transition-colors"
                onClick={() => setActiveTooltip(isTooltipOpen ? null : n.name)}
                title="Tap to view clinical reference explanation"
              >
                {/* Metric Label Row */}
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-on-surface mb-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 truncate min-w-0">
                    <span className="text-primary font-bold truncate">{n.name}</span>
                    <span className="text-on-surface-variant font-normal text-xs shrink-0">
                      ({n.val} {n.unit})
                    </span>
                  </div>

                  {/* Percentage Pill */}
                  <span
                    className={`font-label-caps text-[0.625rem] font-bold px-2 py-0.5 rounded-full shrink-0 tabular-nums ${badgeBg}`}
                  >
                    {badgeText}
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="relative h-2.5 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: barWidth,
                      backgroundColor: barColor,
                    }}
                  />
                  {/* Subtle 100% boundary marker */}
                  <div
                    className="absolute top-0 bottom-0 right-0 w-0.5 bg-outline/30 pointer-events-none"
                    title="100% Daily Limit"
                  />
                </div>

                {/* Expandable Clinical Guidance Note */}
                {isTooltipOpen && (
                  <div className="mt-2 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface font-medium space-y-1 animate-in fade-in duration-200 shadow-2xs">
                    <div className="flex items-center gap-1 text-primary font-bold font-label-caps text-[0.65rem] uppercase">
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span>Clinical Benchmark (ICMR-NIN)</span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant text-center">
          Nutritional facts not sufficiently declared on packaging to calculate ICMR-NIN RDA.
        </div>
      )}

      {/* Footer Benchmark Caption */}
      <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[0.65rem] text-on-surface-variant/70 font-label-caps">
        <span>Tap any nutrient row for medical guidance</span>
        <span>ICMR-NIN 2024 Standard</span>
      </div>
    </div>
  );

  if (hideCardWrapper) {
    return content;
  }

  return (
    <div
      className={`rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 sm:p-6 shadow-xs ${className}`}
    >
      {content}
    </div>
  );
}
