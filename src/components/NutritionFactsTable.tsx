'use client';

import React, { useState } from 'react';

interface NutritionFactsTableProps {
  servingSizeG: number | null;
  per100g: {
    energyKcal: number | null;
    proteinG: number | null;
    carbsG: number | null;
    totalSugarG: number | null;
    addedSugarG: number | null;
    fatG: number | null;
    satFatG: number | null;
    sodiumMg: number | null;
    fibreG: number | null;
  };
}

export default function NutritionFactsTable({ servingSizeG, per100g }: NutritionFactsTableProps) {
  const [mode, setMode] = useState<'100g' | 'serving'>('100g');
  const servingMultiplier = servingSizeG ? servingSizeG / 100 : 1;

  // Format value based on mode
  const fmt = (val: number | null | undefined, unit: string) => {
    if (val === null || val === undefined) return '—';
    const num = mode === 'serving' ? val * servingMultiplier : val;
    // Round to 1 decimal if float
    const rounded = Math.round(num * 10) / 10;
    return `${rounded} ${unit}`;
  };

  const rows = [
    { label: 'Energy', val: per100g.energyKcal, unit: 'kcal', rda: 2000, highlight: false },
    { label: 'Protein', val: per100g.proteinG, unit: 'g', rda: 54, highlight: true, highlightColor: 'var(--leaf)' },
    { label: 'Total Carbohydrates', val: per100g.carbsG, unit: 'g', rda: null, highlight: false },
    { label: 'Total Sugar', val: per100g.totalSugarG, unit: 'g', rda: null, highlight: false },
    {
      label: 'Added Sugar',
      val: per100g.addedSugarG ?? per100g.totalSugarG,
      unit: 'g',
      rda: 25,
      harmful: true,
      highlight: true,
      highlightColor: 'var(--tomato)',
    },
    { label: 'Total Fat', val: per100g.fatG, unit: 'g', rda: null, highlight: false },
    {
      label: 'Saturated Fat',
      val: per100g.satFatG,
      unit: 'g',
      rda: 22,
      harmful: true,
      highlight: false,
    },
    {
      label: 'Sodium',
      val: per100g.sodiumMg,
      unit: 'mg',
      rda: 2000,
      harmful: true,
      highlight: false,
    },
    {
      label: 'Dietary Fibre',
      val: per100g.fibreG,
      unit: 'g',
      rda: 30,
      highlight: true,
      highlightColor: 'var(--leaf)',
    },
  ].filter((r) => r.val !== null && r.val !== undefined);

  return (
    <div className="w-full space-y-3">
      {/* Segmented Control Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold opacity-60">Basis:</span>
        <div
          role="radiogroup"
          aria-label="Nutrition basis"
          className="inline-flex p-1 bg-[var(--surface-alt)] rounded-xl border-2 border-[var(--ink)]"
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === '100g'}
            onClick={() => setMode('100g')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
              mode === '100g'
                ? 'bg-[var(--leaf)] text-white shadow-xs'
                : 'text-[var(--ink)] opacity-70 hover:opacity-100'
            }`}
          >
            Per 100g
          </button>
          {servingSizeG && servingSizeG !== 100 && (
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'serving'}
              onClick={() => setMode('serving')}
              className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
                mode === 'serving'
                  ? 'bg-[var(--leaf)] text-white shadow-xs'
                  : 'text-[var(--ink)] opacity-70 hover:opacity-100'
              }`}
            >
              Per Serving ({servingSizeG}g)
            </button>
          )}
        </div>
      </div>

      {/* Structured Nutrition Table (Label left, Value right) */}
      <div className="rounded-2xl border-2 border-[var(--ink)] bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-[var(--surface-alt)] border-b-2 border-[var(--ink)] text-[var(--ink)] font-black uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3.5">Nutrient</th>
              <th className="py-2.5 px-3.5 text-right">
                Amount ({mode === '100g' ? 'per 100g' : `per ${servingSizeG}g`})
              </th>
              <th className="py-2.5 px-3.5 text-right w-20 sm:w-24">% RDA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ink)]/10 font-bold">
            {rows.map((r, i) => {
              const currentVal = mode === 'serving' ? (r.val ?? 0) * servingMultiplier : (r.val ?? 0);
              const pctRDA = r.rda ? Math.round((currentVal / r.rda) * 100) : null;

              return (
                <tr
                  key={r.label}
                  className={`hover:bg-[var(--surface-alt)]/40 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-[var(--surface-alt)]/20'
                  }`}
                >
                  <td className="py-2.5 px-3.5">
                    <span
                      style={r.highlight && r.highlightColor ? { color: r.highlightColor } : undefined}
                      className={r.highlight ? 'font-black' : ''}
                    >
                      {r.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-black text-[var(--ink)]">
                    {fmt(r.val, r.unit)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-xs">
                    {pctRDA !== null ? (
                      <span
                        className={`font-black ${
                          r.harmful
                            ? pctRDA > 40
                              ? 'text-[var(--tomato)]'
                              : pctRDA > 20
                              ? 'text-[var(--mango)]'
                              : 'text-[var(--leaf)]'
                            : 'text-[var(--leaf)]'
                        }`}
                      >
                        {pctRDA}%
                      </span>
                    ) : (
                      <span className="opacity-40">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold opacity-60 px-1">
        <span>*Reference Daily Intake based on ICMR-NIN 2020 (Adult Male 2000 kcal).</span>
      </div>
    </div>
  );
}
