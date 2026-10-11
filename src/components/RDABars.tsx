'use client';

import React, { useEffect, useState } from 'react';

interface RDABarsProps {
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

export default function RDABars({ servingSizeG, per100g }: RDABarsProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const nutrients = [
    { name: 'Calories', val: per100g.energyKcal, rda: 2000, unit: 'kcal', harmful: false },
    { name: 'Protein', val: per100g.proteinG, rda: 54, unit: 'g', harmful: false },
    { name: 'Dietary Fibre', val: per100g.fibreG, rda: 30, unit: 'g', harmful: false },
    { name: 'Added Sugar', val: per100g.addedSugarG ?? per100g.totalSugarG, rda: 25, unit: 'g', harmful: true },
    { name: 'Saturated Fat', val: per100g.satFatG, rda: 22, unit: 'g', harmful: true },
    { name: 'Sodium', val: per100g.sodiumMg, rda: 2000, unit: 'mg', harmful: true },
  ].filter(n => n.val !== null && n.val !== undefined);

  return (
    <div className="bubble-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="t-h3 text-[var(--ink)]">
          Nutrition Breakdown <span className="opacity-50 text-xs">(per 100g)</span>
        </h3>
        <span className="chip text-[11px] py-0.5 px-2.5 bg-[var(--surface-alt)] font-bold">
          ICMR-NIN RDA
        </span>
      </div>

      <div className="space-y-3.5 mt-2">
        {nutrients.map(n => {
          const val = n.val ?? 0;
          const pct = Math.round((val / n.rda) * 100);
          const barWidth = animated ? `${Math.min(100, Math.max(4, pct))}%` : '0%';

          const barColor = n.harmful
            ? pct > 40
              ? 'var(--tomato)'
              : pct > 20
              ? 'var(--mango)'
              : 'var(--leaf)'
            : 'var(--leaf)';

          return (
            <div key={n.name} className="rda-row">
              <div className="rda-header">
                <span>
                  <strong>{n.name}</strong> ({val} {n.unit})
                </span>
                <span className="t-numbers text-xs font-extrabold text-[var(--ink)]">
                  {pct}% of daily
                </span>
              </div>
              <div className="rda-track">
                <div
                  className="rda-fill"
                  style={{
                    width: barWidth,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
