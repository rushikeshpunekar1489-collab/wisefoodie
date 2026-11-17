'use client';

import React from 'react';
import type { PackagedFoodItem } from '@/types/packaged-food';

interface Props {
  product: PackagedFoodItem;
  className?: string;
}

export default function IndianNutritionFacts({ product, className = '' }: Props) {
  const formatVal = (val: number | null | undefined, unit: string, rda?: number, isHarmful = false) => {
    if (val === null || val === undefined) {
      return <span className="text-on-surface-variant/60 font-normal italic text-xs">Not declared</span>;
    }
    const pct = rda ? Math.round((val / rda) * 100) : null;

    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-bold text-primary tabular-nums">
          {val} <span className="font-normal text-xs text-on-surface-variant">{unit}</span>
        </span>
        {pct !== null && (
          <span
            className={`font-label-caps text-[0.625rem] px-1.5 py-0.5 rounded-full font-bold tabular-nums shrink-0 ${
              isHarmful && pct > 40
                ? 'bg-error-container text-on-error-container'
                : isHarmful && pct > 20
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            {pct}% RDA
          </span>
        )}
      </div>
    );
  };

  const calPct = product.caloriesKcal ? Math.round((product.caloriesKcal / 2000) * 100) : null;

  return (
    <div className={`rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 sm:p-6 shadow-xs ${className}`}>
      {/* Header */}
      <div className="border-b-2 border-primary/20 pb-2 mb-3">
        <span className="font-label-caps text-[0.625rem] text-primary uppercase font-bold tracking-wider block">
          ICMR-NIN &amp; FSSAI STANDARDS
        </span>
        <h3 className="font-headline-md text-xl sm:text-2xl text-primary font-serif">
          Nutrition Facts
        </h3>
        <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
          Per 100g serving base {product.servingSizeG ? `(Pack serving: ${product.servingSizeG}g)` : ''}
        </p>
      </div>

      {/* Energy Hero */}
      <div className="flex items-center justify-between py-2.5 border-b border-outline-variant/20">
        <div>
          <span className="font-headline-sm text-sm text-primary block">Calories / Energy</span>
          <span className="font-label-caps text-[0.625rem] text-on-surface-variant">Metabolic yield</span>
        </div>
        <div className="text-right flex items-center gap-2">
          <div>
            <span className="font-display text-2xl font-bold text-primary tabular-nums">
              {product.caloriesKcal ?? '—'}
            </span>
            <span className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold">kcal</span>
          </div>
          {calPct !== null && (
            <span className="font-label-caps text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface tabular-nums">
              {calPct}% RDA
            </span>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-outline-variant/15 text-xs">
        <div className="flex items-center justify-between py-2 gap-2">
          <span className="font-body-md text-on-surface font-semibold truncate">Total Carbohydrates</span>
          {formatVal(product.carbohydratesG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-3 bg-surface-container-low/30 gap-2">
          <span className="font-body-md text-on-surface-variant truncate">Dietary Fibre</span>
          {formatVal(product.dietaryFiberG, 'g', 30, false)}
        </div>

        <div className="flex items-center justify-between py-2 pl-3 bg-surface-container-low/30 gap-2">
          <span className="font-body-md text-on-surface-variant truncate">Total Sugars</span>
          {formatVal(product.sugarG, 'g', 25, true)}
        </div>

        <div className="flex items-center justify-between py-2 gap-2">
          <span className="font-body-md text-on-surface font-semibold truncate">Protein</span>
          {formatVal(product.proteinG, 'g', 54, false)}
        </div>

        <div className="flex items-center justify-between py-2 gap-2">
          <span className="font-body-md text-on-surface font-semibold truncate">Total Fat</span>
          {formatVal(product.totalFatG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-3 bg-surface-container-low/30 gap-2">
          <span className="font-body-md text-on-surface-variant truncate">Saturated Fat</span>
          {formatVal(product.saturatedFatG, 'g', 22, true)}
        </div>

        <div className="flex items-center justify-between py-2 pl-3 bg-surface-container-low/30 gap-2">
          <span className="font-body-md text-on-surface-variant truncate">Trans Fat</span>
          {formatVal(product.transFatG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-3 bg-surface-container-low/30 gap-2">
          <span className="font-body-md text-on-surface-variant truncate">Cholesterol</span>
          {formatVal(product.cholesterolMg, 'mg')}
        </div>

        <div className="flex items-center justify-between py-2 gap-2">
          <span className="font-body-md text-on-surface font-semibold truncate">Sodium</span>
          {formatVal(product.sodiumMg, 'mg', 2000, true)}
        </div>

        {(product.calciumMg !== null || product.ironMg !== null || product.vitamin !== null) && (
          <div className="pt-2 border-t border-outline-variant/30 space-y-1.5">
            <span className="font-label-caps text-[0.625rem] text-primary uppercase font-bold block">
              Micronutrients Declared
            </span>
            {product.calciumMg !== null && (
              <div className="flex items-center justify-between py-1 gap-2">
                <span className="font-body-md text-on-surface-variant truncate">Calcium</span>
                {formatVal(product.calciumMg, 'mg', 1000)}
              </div>
            )}
            {product.ironMg !== null && (
              <div className="flex items-center justify-between py-1 gap-2">
                <span className="font-body-md text-on-surface-variant truncate">Iron</span>
                {formatVal(product.ironMg, 'mg', 19)}
              </div>
            )}
            {product.vitamin && (
              <div className="flex items-center justify-between py-1 gap-2">
                <span className="font-body-md text-on-surface-variant truncate">Vitamins</span>
                <span className="font-bold text-primary truncate">{product.vitamin}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-outline-variant/20 text-[0.6875rem] text-on-surface-variant/70 leading-relaxed font-body-sm">
        Benchmarked against ICMR-NIN 2024 Reference Daily Allowances (RDA) for Indian adults (2,000 kcal baseline).
      </div>
    </div>
  );
}
