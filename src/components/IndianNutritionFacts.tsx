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
      return <span className="text-stone-400 font-normal italic">Not declared</span>;
    }
    return (
      <span className="font-bold text-stone-900 dark:text-stone-100">
        {val} <span className="font-semibold text-xs text-stone-500">{unit}</span>
      </span>
    );
  };

  return (
    <div className={`border-2 border-stone-900 bg-white dark:bg-stone-900 p-5 rounded-2xl shadow-[4px_4px_0px_var(--ink)] ${className}`}>
      {/* Header */}
      <div className="border-b-4 border-stone-900 pb-2 mb-3">
        <h3 className="font-display font-black text-2xl tracking-tight text-stone-900 dark:text-stone-50 uppercase">
          Nutrition Facts
        </h3>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          As declared on packaging label
        </p>
      </div>

      {/* Serving Size */}
      <div className="border-b-2 border-stone-800 pb-2 mb-2 flex justify-between items-baseline text-sm">
        <span className="font-bold text-stone-800 dark:text-stone-200">Serving Size</span>
        <span className="font-extrabold text-stone-900 dark:text-stone-100">
          {product.servingSizeG !== null ? `${product.servingSizeG} g` : 'Per 100g / Pack'}
        </span>
      </div>

      {/* Calories */}
      <div className="border-b-4 border-stone-900 py-2.5 flex justify-between items-baseline">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 block">
            Energy
          </span>
          <span className="font-display font-black text-3xl text-stone-900 dark:text-stone-50">
            {product.caloriesKcal !== null ? product.caloriesKcal : '—'}
          </span>
          <span className="text-xs font-bold text-stone-500 ml-1">kcal</span>
        </div>
        {product.caloriesKcal === null && (
          <span className="text-xs text-stone-400 italic font-medium">Not declared</span>
        )}
      </div>

      {/* Nutrients List */}
      <div className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
        {/* Protein */}
        <div className="py-2 flex justify-between items-center">
          <span className="font-bold text-stone-900 dark:text-stone-100">Protein</span>
          {formatVal(product.proteinG, 'g')}
        </div>

        {/* Carbohydrates */}
        <div className="py-2 flex justify-between items-center">
          <span className="font-bold text-stone-900 dark:text-stone-100">Carbohydrates</span>
          {formatVal(product.carbohydratesG, 'g')}
        </div>

        {/* Sugar (indented) */}
        <div className="py-2 pl-4 flex justify-between items-center text-xs">
          <span className="font-medium text-stone-700 dark:text-stone-300">Total Sugar</span>
          {formatVal(product.sugarG, 'g')}
        </div>

        {/* Total Fat */}
        <div className="py-2 flex justify-between items-center">
          <span className="font-bold text-stone-900 dark:text-stone-100">Total Fat</span>
          {formatVal(product.totalFatG, 'g')}
        </div>

        {/* Saturated Fat (indented) */}
        <div className="py-2 pl-4 flex justify-between items-center text-xs">
          <span className="font-medium text-stone-700 dark:text-stone-300">Saturated Fat</span>
          {formatVal(product.saturatedFatG, 'g')}
        </div>

        {/* Trans Fat (indented) */}
        <div className="py-2 pl-4 flex justify-between items-center text-xs">
          <span className="font-medium text-stone-700 dark:text-stone-300">Trans Fat</span>
          {formatVal(product.transFatG, 'g')}
        </div>

        {/* Dietary Fiber */}
        <div className="py-2 flex justify-between items-center">
          <span className="font-bold text-stone-900 dark:text-stone-100">Dietary Fiber</span>
          {formatVal(product.dietaryFiberG, 'g')}
        </div>

        {/* Sodium */}
        <div className="py-2 flex justify-between items-center">
          <span className="font-bold text-stone-900 dark:text-stone-100">Sodium</span>
          {formatVal(product.sodiumMg, 'mg')}
        </div>

        {/* Cholesterol */}
        <div className="py-2 flex justify-between items-center">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Cholesterol</span>
          {formatVal(product.cholesterolMg, 'mg')}
        </div>

        {/* Micronutrients */}
        <div className="py-2 flex justify-between items-center">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Calcium</span>
          {formatVal(product.calciumMg, 'mg')}
        </div>

        <div className="py-2 flex justify-between items-center">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Iron</span>
          {formatVal(product.ironMg, 'mg')}
        </div>

        {product.vitamin && product.vitamin !== '0' && (
          <div className="py-2 flex justify-between items-center">
            <span className="font-semibold text-stone-700 dark:text-stone-300">Vitamins</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{product.vitamin}</span>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="border-t-2 border-stone-800 pt-3 mt-3 text-[11px] text-stone-500 leading-relaxed">
        * Values are sourced directly from packaging declaration ({product.sourceOfData || 'Retail scan'}).
        Missing values denote unlisted label fields, not zero content.
      </div>
    </div>
  );
}
