'use client';

import React from 'react';
import type { IndianFoodItem } from '@/types/nutrition-db';
import { Droplet, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface OilFatBreakdownCardProps {
  food: IndianFoodItem;
  quantityGrams: number;
}

export default function OilFatBreakdownCard({ food, quantityGrams }: OilFatBreakdownCardProps) {
  const { oilBreakdown, nutrientsPer100g, servingInfo, foodType } = food;

  // Ratio based on custom selected quantity vs standard 100g
  const multiplier = quantityGrams / 100;
  const servingWeight = servingInfo.servingWeightG || 100;
  const servingRatio = quantityGrams / servingWeight;

  // Scale total fats for selected quantity
  const scaleNutrient = (val: number | null) => {
    if (val === null || val === undefined) return null;
    return Math.round(val * multiplier * 10) / 10;
  };

  const totalFatG = scaleNutrient(nutrientsPer100g.fatG);
  const sfaMg = scaleNutrient(nutrientsPer100g.sfaMg);
  const mufaMg = scaleNutrient(nutrientsPer100g.mufaMg);
  const pufaMg = scaleNutrient(nutrientsPer100g.pufaMg);

  // Scaled oil if available
  const scaledOilG = oilBreakdown?.available && oilBreakdown.oilPerServingG !== null
    ? Math.round(oilBreakdown.oilPerServingG * servingRatio * 10) / 10
    : null;

  const scaledOilCals = scaledOilG !== null ? Math.round(scaledOilG * 9.0) : null;

  return (
    <div className="card-chunky bg-white p-5 sm:p-6 space-y-4 border-2 border-[var(--ink)]">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900">
            <Droplet className="w-5 h-5 fill-amber-500 text-amber-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[var(--ink)]">
              Oil & Cooking Fat Breakdown
            </h3>
            <p className="text-xs text-stone-500">
              Added cooking oils vs total intrinsic dietary fats
            </p>
          </div>
        </div>

        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[var(--surface-alt)] border border-stone-300">
          For {quantityGrams}g portion
        </span>
      </div>

      {oilBreakdown?.available ? (
        <div className="space-y-4">
          {/* Added Oil Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border-2 border-amber-300 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                Estimated Added Oil
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-950">
                {scaledOilG} <span className="text-xs font-bold">grams</span>
              </div>
              <span className="text-[11px] text-amber-800">
                ~{(scaledOilG! / 5).toFixed(1)} teaspoons in this portion
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50/70 border-2 border-orange-300 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-800 block">
                Oil Caloric Contribution
              </span>
              <div className="text-xl sm:text-2xl font-black text-orange-950">
                {scaledOilCals} <span className="text-xs font-bold">kcal</span>
              </div>
              <span className="text-[11px] text-orange-800">
                Calculated at standard 9 kcal / gram
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border-2 border-stone-300 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-700 block">
                Identified Oil Types
              </span>
              <div className="text-sm font-extrabold text-[var(--ink)] line-clamp-2">
                {oilBreakdown.oilTypes.join(', ') || 'Cooking oil / ghee'}
              </div>
              <span className="text-[11px] text-stone-500">
                From source recipe ingredients
              </span>
            </div>
          </div>

          {/* Full Recipe Provenance Details */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-stone-700 font-bold">
              <span>Full Recipe Total Oil:</span>
              <span>{oilBreakdown.totalRecipeOilG} g across {servingInfo.noOfServingsInRecipe} servings</span>
            </div>
            {oilBreakdown.oilItems && oilBreakdown.oilItems.length > 0 && (
              <div className="pt-1 border-t border-stone-200 text-[11px] text-stone-600">
                <span className="font-bold">Original recipe entry: </span>
                {oilBreakdown.oilItems.map((o: any, idx: number) => (
                  <span key={idx}>
                    {o.name} ({o.raw_amount} {o.raw_unit} ≈ {o.grams}g)
                    {idx < oilBreakdown.oilItems.length - 1 ? '; ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-stone-50 border-2 border-dashed border-stone-300 text-xs text-stone-600 space-y-1">
          <div className="flex items-center gap-2 font-bold text-stone-800">
            <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
            <span>Oil quantity not available in source recipe.</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-500">
            {foodType === 'raw'
              ? 'This is a raw/unprepared single food ingredient from ICMR-NIN. It contains natural intrinsic fats only, with no added cooking oil.'
              : 'The source documentation for this prepared recipe does not list separate cooking oil measurements. Total dietary fat is displayed below without fabricating added oil values.'}
          </p>
        </div>
      )}

      {/* Fatty Acid Composition Spectrum */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
          Dietary Fatty Acid Composition ({quantityGrams}g portion)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold block">Total Fat</span>
            <span className="text-base font-black text-[var(--ink)] block mt-0.5">
              {totalFatG !== null ? `${totalFatG}g` : 'Data not available'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold block">Saturated Fat (SFA)</span>
            <span className="text-base font-black text-[var(--ink)] block mt-0.5">
              {sfaMg !== null ? `${(sfaMg / 1000).toFixed(2)}g` : 'Data not available'}
            </span>
            {sfaMg !== null && <span className="text-[9px] text-stone-400">{sfaMg} mg</span>}
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold block">MUFA</span>
            <span className="text-base font-black text-[var(--ink)] block mt-0.5">
              {mufaMg !== null ? `${(mufaMg / 1000).toFixed(2)}g` : 'Data not available'}
            </span>
            {mufaMg !== null && <span className="text-[9px] text-stone-400">{mufaMg} mg</span>}
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold block">PUFA</span>
            <span className="text-base font-black text-[var(--ink)] block mt-0.5">
              {pufaMg !== null ? `${(pufaMg / 1000).toFixed(2)}g` : 'Data not available'}
            </span>
            {pufaMg !== null && <span className="text-[9px] text-stone-400">{pufaMg} mg</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
