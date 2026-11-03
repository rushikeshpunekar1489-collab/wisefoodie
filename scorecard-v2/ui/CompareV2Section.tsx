'use client';

import React from 'react';
import type { Product } from '../../types/product';
import { adaptProductToFacts } from '../adapters/productAdapter';
import { compareProductsNutrientCost } from '../modules/nutrition-per-paisa/compare';
import { compareIngredientsPair } from '../modules/ingredients-analysis/compare';
import { Coins, Layers, AlertCircle, Award } from 'lucide-react';

interface CompareV2SectionProps {
  products: Product[];
}

export default function CompareV2Section({ products }: CompareV2SectionProps) {
  if (!products || products.length < 2) return null;

  const factsList = products.map(adaptProductToFacts);
  const costCompare = compareProductsNutrientCost(factsList);
  const ingPair = factsList.length >= 2 ? compareIngredientsPair(factsList[0], factsList[1]) : null;

  return (
    <div className="space-y-6 pt-4">
      {/* 1. NUTRITION PER PAISA COMPARISON */}
      <div className="bubble-card space-y-4 bg-[var(--surface-alt)]">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[var(--ink)]/15">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[var(--mango)] fill-[var(--mango)]" />
            <h3 className="t-h3 text-base text-[var(--ink)]">Nutrition Per Paisa: Cost per Nutrient</h3>
          </div>
          <span className="chip text-xs bg-[var(--surface)]">Target Unit Efficiency</span>
        </div>

        {costCompare.canCompare ? (
          <div className="overflow-x-auto rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-alt)] border-b-2 border-[var(--ink)]">
                  <th className="p-3 font-black">Nutrient</th>
                  <th className="p-3 font-black">Target Unit</th>
                  {costCompare.rows[0]?.costs.map((c) => (
                    <th key={c.productId} className="p-3 font-black text-center truncate max-w-[140px]">
                      {c.productName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {costCompare.rows.map((row) => (
                  <tr key={row.nutrientKey} className="border-b border-[var(--ink)]/10 hover:bg-[var(--surface-alt)]/40">
                    <td className="p-3 font-bold text-[var(--ink)]">{row.nutrientName}</td>
                    <td className="p-3 font-semibold opacity-75">{row.targetUnit}</td>
                    {row.costs.map((c) => (
                      <td
                        key={c.productId}
                        className={`p-3 text-center font-extrabold ${
                          c.isLowest ? 'bg-[var(--mint)] text-[var(--leaf)] font-black' : 'text-[var(--ink)]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {c.isLowest && <Award className="w-3.5 h-3.5 text-[var(--leaf)] shrink-0" />}
                          <span>{c.formattedCost}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[var(--surface)] border-2 border-[var(--mango)] flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-[var(--mango)] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[var(--ink)] block mb-0.5">Unit Comparison Limitation</span>
              <p className="opacity-80 leading-relaxed">{costCompare.incompatibilityReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. INGREDIENTS COMPARISON (First 2 Products) */}
      {ingPair && (
        <div className="bubble-card space-y-4 bg-[var(--surface)]">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[var(--ink)]/15">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--berry)]" />
              <h3 className="t-h3 text-base text-[var(--ink)]">Ingredient Profile Comparison</h3>
            </div>
            <span className="chip text-xs bg-[var(--surface-alt)]">Side-by-Side</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface-alt)]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface)] border-b-2 border-[var(--ink)]">
                  <th className="p-3 font-black">Formulation Metric</th>
                  <th className="p-3 font-black text-center">{ingPair.productA.name}</th>
                  <th className="p-3 font-black text-center">{ingPair.productB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ink)]/10">
                <tr>
                  <td className="p-3 font-bold">Total Declared Ingredients</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productA.ingredientCount}</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productB.ingredientCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Distinct Added Sugar Sources</td>
                  <td className="p-3 text-center font-extrabold text-[var(--tomato)]">{ingPair.productA.sugarCount}</td>
                  <td className="p-3 text-center font-extrabold text-[var(--tomato)]">{ingPair.productB.sugarCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Identified Additives & Preservatives</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productA.preservativeCount}</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productB.preservativeCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Flavour Enhancers (e.g. MSG, INS 627)</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productA.flavourEnhancerCount}</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productB.flavourEnhancerCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Declared Recipe Allergens</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productA.allergenCount}</td>
                  <td className="p-3 text-center font-extrabold">{ingPair.productB.allergenCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Primary #1 Ingredient by Weight</td>
                  <td className="p-3 text-center font-bold text-xs">{ingPair.productA.topThree[0] || '—'}</td>
                  <td className="p-3 text-center font-bold text-xs">{ingPair.productB.topThree[0] || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] opacity-70 italic font-semibold text-center pt-1">
            {ingPair.qualityDisclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
