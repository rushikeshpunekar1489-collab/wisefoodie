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
  hideCardWrapper?: boolean;
}

export default function RDABars({ servingSizeG, per100g, hideCardWrapper = false }: RDABarsProps) {
  const [animated, setAnimated] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const nutrients = [
    {
      name: 'Calories',
      val: per100g.energyKcal,
      rda: 2000,
      unit: 'kcal',
      harmful: false,
      desc: 'Based on 2000 kcal standard daily energy allowance (ICMR-NIN 2020)',
    },
    {
      name: 'Protein',
      val: per100g.proteinG,
      rda: 54,
      unit: 'g',
      harmful: false,
      desc: 'RDA: 54g for reference Indian adult male (1.0g per kg body weight)',
    },
    {
      name: 'Dietary Fibre',
      val: per100g.fibreG,
      rda: 30,
      unit: 'g',
      harmful: false,
      desc: 'RDA: 30g minimum per day for gut health and balanced digestion',
    },
    {
      name: 'Added Sugar',
      val: per100g.addedSugarG ?? per100g.totalSugarG,
      rda: 25,
      unit: 'g',
      harmful: true,
      desc: 'WHO & ICMR-NIN safe upper limit: max 25g (approx. 5-6 teaspoons) daily',
    },
    {
      name: 'Saturated Fat',
      val: per100g.satFatG,
      rda: 22,
      unit: 'g',
      harmful: true,
      desc: 'Upper limit: max 22g daily (<10% of total dietary energy intake)',
    },
    {
      name: 'Sodium',
      val: per100g.sodiumMg,
      rda: 2000,
      unit: 'mg',
      harmful: true,
      desc: 'Safe limit: 2000mg sodium daily (equivalent to 5g of table salt)',
    },
  ].filter(n => n.val !== null && n.val !== undefined);

  const content = (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-extrabold text-[var(--ink)]">
          RDA Daily Contribution <span className="opacity-50 text-xs font-normal">(per 100g)</span>
        </h4>
        <span className="chip text-[11px] py-0.5 px-2 bg-[var(--surface-alt)] font-bold">
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

          const isTooltipOpen = activeTooltip === n.name;

          return (
            <div
              key={n.name}
              className="rda-row cursor-pointer select-none"
              onClick={() => setActiveTooltip(isTooltipOpen ? null : n.name)}
              title="Tap for RDA guidance"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm font-bold text-[var(--ink)]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-extrabold">{n.name}</span>
                  <span className="opacity-70 text-xs font-normal">
                    ({val} {n.unit})
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 text-right">
                  <span className="text-[11px] opacity-60 sm:hidden">of daily allowance</span>
                  <span
                    className={`t-numbers text-xs font-black ${
                      n.harmful && pct > 40
                        ? 'text-[var(--tomato)]'
                        : n.harmful && pct > 20
                        ? 'text-[var(--mango)]'
                        : 'text-[var(--ink)]'
                    }`}
                  >
                    {pct}% of daily
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="rda-track mt-1.5 h-3 rounded-full overflow-hidden bg-[var(--surface-alt)] border border-[var(--ink)]/20">
                <div
                  className="rda-fill h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: barWidth,
                    backgroundColor: barColor,
                  }}
                />
              </div>

              {/* Touch-friendly inline tooltip explanation */}
              {isTooltipOpen && (
                <div className="mt-1.5 p-2 bg-[var(--surface-alt)] rounded-xl border border-[var(--ink)]/20 text-[11px] font-semibold text-[var(--ink)] animate-in fade-in">
                  💡 {n.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] opacity-50 mt-3 text-right">
        Tap any nutrient to view clinical reference guideline
      </p>
    </div>
  );

  if (hideCardWrapper) {
    return content;
  }

  return <div className="bubble-card">{content}</div>;
}
