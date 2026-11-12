'use client';

import React, { useState, useMemo } from 'react';
import type { IndianFoodItem } from '@/types/nutrition-db';
import OilFatBreakdownCard from './OilFatBreakdownCard';
import {
  X,
  Scale,
  Flame,
  ChefHat,
  Sparkles,
  Info,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface FoodDetailModalProps {
  food: IndianFoodItem | null;
  onClose: () => void;
}

export default function FoodDetailModal({ food, onClose }: FoodDetailModalProps) {
  if (!food) return null;

  const defaultServingWeight = food.servingInfo?.servingWeightG || 100;
  const [portionMode, setPortionMode] = useState<'100g' | 'serving' | 'custom'>('100g');
  const [customGrams, setCustomGrams] = useState<number>(defaultServingWeight);

  // Active grams based on portion selection
  const activeGrams = useMemo(() => {
    if (portionMode === '100g') return 100;
    if (portionMode === 'serving') return defaultServingWeight;
    return Math.max(1, customGrams || 100);
  }, [portionMode, defaultServingWeight, customGrams]);

  const multiplier = activeGrams / 100;

  // Helper to scale nutrient or return fallback text
  const formatNutrient = (
    val: number | null | undefined,
    unit: string,
    precision = 1
  ): { text: string; available: boolean } => {
    if (val === null || val === undefined) {
      return { text: 'Data not available in source', available: false };
    }
    const scaled = Math.round(val * multiplier * Math.pow(10, precision)) / Math.pow(10, precision);
    return { text: `${scaled} ${unit}`, available: true };
  };

  const calories = formatNutrient(food.nutrientsPer100g.energyKcal, 'kcal', 0);
  const protein = formatNutrient(food.nutrientsPer100g.proteinG, 'g', 1);
  const carbs = formatNutrient(food.nutrientsPer100g.carbG, 'g', 1);
  const fat = formatNutrient(food.nutrientsPer100g.fatG, 'g', 1);
  const fiber = formatNutrient(food.nutrientsPer100g.fibreG, 'g', 1);
  const sugar = formatNutrient(food.nutrientsPer100g.freeSugarG, 'g', 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border-3 border-[var(--ink)] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative space-y-6 p-5 sm:p-8">
        {/* Sticky Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 btn-chunky p-2 rounded-full! border-2! w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center z-10"
          aria-label="Close food details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Food Header & Badges */}
        <div className="space-y-2 pr-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border border-[var(--ink)] ${
              food.foodType === 'cooked' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {food.foodType === 'cooked' ? '🍲 Cooked Recipe' : '🌱 Raw Single Food'}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--surface-alt)] border border-stone-300 text-stone-700">
              {food.foodGroup || food.category}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 border border-stone-200 text-stone-600">
              Code: {food.code}
            </span>
          </div>

          <h2 className="t-h2 text-[var(--ink)] pt-1">
            {food.name}
          </h2>

          {food.nameLocal && (
            <p className="text-sm font-bold text-emerald-800">
              Alternate / Regional name: <span className="text-[var(--ink)]">{food.nameLocal}</span>
            </p>
          )}

          <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
            <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Source: <strong className="text-stone-700">{food.provenance}</strong></span>
          </div>
        </div>

        {/* Quantity / Serving Selector */}
        <div className="card-chunky bg-[var(--surface-alt)] p-4 sm:p-5 space-y-3 border-2 border-[var(--ink)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                Serving Quantity Selector
              </span>
              <p className="text-xs text-stone-500">
                Nutrients automatically scale to your selected portion weight.
              </p>
            </div>

            <div className="text-xs font-black px-3 py-1 rounded-xl bg-white border border-[var(--ink)] self-start sm:self-auto text-emerald-900">
              Current: {activeGrams}g portion
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setPortionMode('100g')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                portionMode === '100g'
                  ? 'border-[var(--ink)] bg-white shadow-2xs font-extrabold'
                  : 'border-stone-200 bg-white/70 text-stone-600'
              }`}
            >
              <span className="text-xs font-bold block">Standard 100g</span>
              <span className="text-sm font-black text-[var(--ink)]">100 grams</span>
            </button>

            <button
              type="button"
              onClick={() => setPortionMode('serving')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                portionMode === 'serving'
                  ? 'border-[var(--ink)] bg-white shadow-2xs font-extrabold'
                  : 'border-stone-200 bg-white/70 text-stone-600'
              }`}
            >
              <span className="text-xs font-bold block">Source Serving</span>
              <span className="text-sm font-black text-[var(--ink)]">
                {food.servingInfo.servingLabel || `1 portion (${defaultServingWeight}g)`}
              </span>
            </button>

            <div
              className={`p-2.5 rounded-xl border-2 transition-all ${
                portionMode === 'custom'
                  ? 'border-[var(--ink)] bg-white shadow-2xs'
                  : 'border-stone-200 bg-white/70 text-stone-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Custom Grams</span>
                <button
                  type="button"
                  onClick={() => setPortionMode('custom')}
                  className="text-[10px] font-black text-emerald-700 underline"
                >
                  Set custom
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="2000"
                  step="5"
                  value={customGrams}
                  onFocus={() => setPortionMode('custom')}
                  onChange={(e) => {
                    setPortionMode('custom');
                    setCustomGrams(Math.max(1, Number(e.target.value)));
                  }}
                  className="w-full px-2.5 py-1 rounded-lg border border-stone-300 font-black text-sm bg-white text-[var(--ink)]"
                />
                <span className="absolute right-2.5 top-1 text-xs font-bold text-stone-400">g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Macros Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Energy</span>
            <span className="text-xl sm:text-2xl font-black text-amber-950 block mt-0.5">
              {calories.available ? calories.text : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-300">
            <span className="text-[10px] uppercase font-bold text-blue-800 block">Protein</span>
            <span className="text-xl sm:text-2xl font-black text-blue-950 block mt-0.5">
              {protein.available ? protein.text : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Carbohydrates</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-950 block mt-0.5">
              {carbs.available ? carbs.text : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300">
            <span className="text-[10px] uppercase font-bold text-rose-800 block">Total Fat</span>
            <span className="text-xl sm:text-2xl font-black text-rose-950 block mt-0.5">
              {fat.available ? fat.text : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border-2 border-purple-300 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-purple-800 block">Dietary Fiber</span>
            <span className="text-xl sm:text-2xl font-black text-purple-950 block mt-0.5">
              {fiber.available ? fiber.text : 'N/A'}
            </span>
          </div>
        </div>

        {/* Oil and Cooking Fat Breakdown Card */}
        <OilFatBreakdownCard food={food} quantityGrams={activeGrams} />

        {/* Detailed Micronutrient & Mineral Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[var(--ink)]">
              Complete Nutritional Profile ({activeGrams}g portion)
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Source verified measurements
            </span>
          </div>

          <div className="border-2 border-[var(--ink)] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--surface-alt)] border-b-2 border-[var(--ink)] font-extrabold text-stone-700 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Nutrient</th>
                  <th className="py-2.5 px-4 text-right">Amount in {activeGrams}g</th>
                  <th className="py-2.5 px-4 text-right hidden sm:table-cell">Standard per 100g</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium text-stone-800 bg-white">
                {[
                  { label: 'Energy (Calories)', unit: 'kcal', val: food.nutrientsPer100g.energyKcal, prec: 0 },
                  { label: 'Energy (Kilojoules)', unit: 'kJ', val: food.nutrientsPer100g.energyKj, prec: 0 },
                  { label: 'Protein', unit: 'g', val: food.nutrientsPer100g.proteinG, prec: 1 },
                  { label: 'Total Carbohydrates', unit: 'g', val: food.nutrientsPer100g.carbG, prec: 1 },
                  { label: 'Dietary Fiber', unit: 'g', val: food.nutrientsPer100g.fibreG, prec: 1 },
                  { label: 'Free Sugars', unit: 'g', val: food.nutrientsPer100g.freeSugarG, prec: 1 },
                  { label: 'Total Fat', unit: 'g', val: food.nutrientsPer100g.fatG, prec: 1 },
                  { label: 'Saturated Fatty Acids (SFA)', unit: 'mg', val: food.nutrientsPer100g.sfaMg, prec: 1 },
                  { label: 'Monounsaturated Fatty Acids (MUFA)', unit: 'mg', val: food.nutrientsPer100g.mufaMg, prec: 1 },
                  { label: 'Polyunsaturated Fatty Acids (PUFA)', unit: 'mg', val: food.nutrientsPer100g.pufaMg, prec: 1 },
                  { label: 'Cholesterol', unit: 'mg', val: food.nutrientsPer100g.cholesterolMg, prec: 1 },
                  { label: 'Calcium', unit: 'mg', val: food.nutrientsPer100g.calciumMg, prec: 1 },
                  { label: 'Iron', unit: 'mg', val: food.nutrientsPer100g.ironMg, prec: 2 },
                  { label: 'Sodium', unit: 'mg', val: food.nutrientsPer100g.sodiumMg, prec: 1 },
                  { label: 'Potassium', unit: 'mg', val: food.nutrientsPer100g.potassiumMg, prec: 1 },
                  { label: 'Phosphorus', unit: 'mg', val: food.nutrientsPer100g.phosphorusMg, prec: 1 },
                  { label: 'Magnesium', unit: 'mg', val: food.nutrientsPer100g.magnesiumMg, prec: 1 },
                  { label: 'Zinc', unit: 'mg', val: food.nutrientsPer100g.zincMg, prec: 2 },
                  { label: 'Copper', unit: 'mg', val: food.nutrientsPer100g.copperMg, prec: 2 },
                  { label: 'Selenium', unit: 'µg', val: food.nutrientsPer100g.seleniumUg, prec: 1 },
                  { label: 'Vitamin A', unit: 'µg', val: food.nutrientsPer100g.vitaUg, prec: 1 },
                  { label: 'Vitamin C', unit: 'mg', val: food.nutrientsPer100g.vitcMg, prec: 1 },
                  { label: 'Vitamin E', unit: 'mg', val: food.nutrientsPer100g.viteMg, prec: 2 },
                  { label: 'Thiamine (Vitamin B1)', unit: 'mg', val: food.nutrientsPer100g.vitb1Mg, prec: 2 },
                  { label: 'Riboflavin (Vitamin B2)', unit: 'mg', val: food.nutrientsPer100g.vitb2Mg, prec: 2 },
                  { label: 'Niacin (Vitamin B3)', unit: 'mg', val: food.nutrientsPer100g.vitb3Mg, prec: 2 },
                  { label: 'Vitamin B6', unit: 'mg', val: food.nutrientsPer100g.vitb6Mg, prec: 2 },
                  { label: 'Folate (Vitamin B9)', unit: 'µg', val: food.nutrientsPer100g.folateUg, prec: 1 },
                  { label: 'Carotenoids', unit: 'µg', val: food.nutrientsPer100g.carotenoidsUg, prec: 1 },
                ].map((row, idx) => {
                  const currentScaled = formatNutrient(row.val, row.unit, row.prec);
                  const per100gFormatted = row.val !== null && row.val !== undefined ? `${row.val} ${row.unit}` : 'N/A';
                  return (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-2 px-4 font-bold text-stone-800">{row.label}</td>
                      <td className="py-2 px-4 text-right">
                        {currentScaled.available ? (
                          <span className="font-extrabold text-[var(--ink)]">{currentScaled.text}</span>
                        ) : (
                          <span className="text-stone-400 italic">Data not available in source</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-right text-stone-500 hidden sm:table-cell">
                        {per100gFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recipe Ingredients (if cooked dish) */}
        {food.ingredients && food.ingredients.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 font-extrabold text-sm text-[var(--ink)]">
              <ChefHat className="w-4 h-4 text-emerald-700" />
              <span>Source Recipe Ingredients ({food.ingredients.length} items)</span>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border border-stone-200 flex flex-wrap gap-2 text-xs">
              {food.ingredients.map((ing: any, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 font-medium text-stone-800 shadow-2xs"
                >
                  <strong className="text-[var(--ink)]">{ing.name}</strong>: {ing.amount} {ing.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Provenance and Citation Footer */}
        <div className="p-4 rounded-xl bg-stone-100 text-stone-600 text-xs space-y-1">
          <p className="font-extrabold text-stone-800">Source Provenance & Data Rights:</p>
          <p>{food.provenance}</p>
          <p className="text-[11px] text-stone-500">
            Nutrient records are preserved from peer-reviewed scientific publications (ICMR-NIN IFCT, ASC, BFP). Unmeasured nutrient values are transparently designated as &quot;Data not available in source&quot; to maintain empirical integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
