'use client';

import React from 'react';
import type { PackagedFoodItem } from '@/types/packaged-food';

interface Props {
  product: PackagedFoodItem;
  className?: string;
}

export default function IndianNutritionFacts({ product, className = '' }: Props) {
  const formatVal = (val: number | null | undefined, unit: string) => {
    if (val === null || val === undefined) {
      return <span className="text-on-surface-variant/60 font-normal italic text-xs">Not declared</span>;
    }
    return (
      <span className="font-bold text-primary tabular-nums">
        {val} <span className="font-normal text-xs text-on-surface-variant">{unit}</span>
      </span>
    );
  };

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
      <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
        <div>
          <span className="font-headline-sm text-sm text-primary block">Calories / Energy</span>
          <span className="font-label-caps text-[0.625rem] text-on-surface-variant">Metabolic yield</span>
        </div>
        <div className="text-right">
          <span className="font-display text-2xl font-bold text-primary tabular-nums">
            {product.caloriesKcal ?? '—'}
          </span>
          <span className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold">kcal</span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-outline-variant/15 text-xs">
        <div className="flex items-center justify-between py-2">
          <span className="font-body-md text-on-surface font-semibold">Total Carbohydrates</span>
          {formatVal(product.carbohydratesG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-4 bg-surface-container-low/30">
          <span className="font-body-md text-on-surface-variant">Dietary Fibre</span>
          {formatVal(product.dietaryFiberG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-4 bg-surface-container-low/30">
          <span className="font-body-md text-on-surface-variant">Total Sugars</span>
          {formatVal(product.sugarG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="font-body-md text-on-surface font-semibold">Protein</span>
          {formatVal(product.proteinG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="font-body-md text-on-surface font-semibold">Total Fat</span>
          {formatVal(product.totalFatG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-4 bg-surface-container-low/30">
          <span className="font-body-md text-on-surface-variant">Saturated Fat</span>
          {formatVal(product.saturatedFatG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-4 bg-surface-container-low/30">
          <span className="font-body-md text-on-surface-variant">Trans Fat</span>
          {formatVal(product.transFatG, 'g')}
        </div>

        <div className="flex items-center justify-between py-2 pl-4 bg-surface-container-low/30">
          <span className="font-body-md text-on-surface-variant">Cholesterol</span>
          {formatVal(product.cholesterolMg, 'mg')}
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="font-body-md text-on-surface font-semibold">Sodium</span>
          {formatVal(product.sodiumMg, 'mg')}
        </div>

        {(product.calciumMg !== null || product.ironMg !== null || product.vitamin !== null) && (
          <div className="pt-2 border-t border-outline-variant/30 space-y-1.5">
            <span className="font-label-caps text-[0.625rem] text-primary uppercase font-bold block">
              Micronutrients Declared
            </span>
            {product.calciumMg !== null && (
              <div className="flex items-center justify-between py-1">
                <span className="font-body-md text-on-surface-variant">Calcium</span>
                {formatVal(product.calciumMg, 'mg')}
              </div>
            )}
            {product.ironMg !== null && (
              <div className="flex items-center justify-between py-1">
                <span className="font-body-md text-on-surface-variant">Iron</span>
                {formatVal(product.ironMg, 'mg')}
              </div>
            )}
            {product.vitamin && (
              <div className="flex items-center justify-between py-1">
                <span className="font-body-md text-on-surface-variant">Vitamins</span>
                <span className="font-bold text-primary">{product.vitamin}</span>
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
