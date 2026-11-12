'use client';

import React, { useState } from 'react';
import type { NutritionPerPaisaResult } from '@/lib/value';

interface NutritionPerPaisaCardProps {
  valueData: NutritionPerPaisaResult;
  priceINR: number | null;
  packSizeG: number | null;
  category?: string | null;
}

export default function NutritionPerPaisaCard({
  valueData,
  priceINR,
  packSizeG,
}: NutritionPerPaisaCardProps) {
  const [spentCount, setSpentCount] = useState(0);

  const handleCoinClick = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setSpentCount((prev) => (prev < 5 ? prev + 1 : 0));
  };

  if (!valueData.isAvailable || !priceINR || !packSizeG) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low/60 text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-2xl">currency_rupee</span>
          <div>
            <h4 className="font-headline-sm text-sm text-primary">The ₹10 Test (Nutrition Per Paisa)</h4>
            <p className="font-body-sm text-xs opacity-70 mt-0.5">
              Price or pack weight pending verification. Value ratio unlocks once commercial pack metrics are confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const proteinRatio = valueData.proteinPerRupee ?? 0;
  const fibreRatio = valueData.fibrePerRupee ?? 0;
  const proteinPer10 = (proteinRatio * 10).toFixed(1);
  const fibrePer10 = (fibreRatio * 10).toFixed(1);

  return (
    <div className="p-4 rounded-xl border-2 border-secondary/40 bg-[#FFFBEB] dark:bg-surface-container shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-xl">payments</span>
          <h3 className="font-headline-sm text-sm text-primary">The ₹10 Value Ratio</h3>
        </div>
        <span className="font-label-caps text-xs py-0.5 px-2 rounded-full bg-surface-container-lowest text-on-surface border border-secondary/30 tabular-nums font-bold">
          ₹{priceINR} / {packSizeG}g
        </span>
      </div>

      <p className="font-body-sm text-xs text-on-surface-variant my-2.5">
        Forensic nutrient extraction test: What vital macronutrients do you actually receive per <strong>₹10 spent</strong>?
      </p>

      {/* Main Stat Card */}
      <div className="flex items-center gap-4 my-3 p-3.5 rounded-lg bg-surface-container-lowest border border-secondary/30 shadow-2xs">
        <div
          className="coin-stack select-none shrink-0 cursor-pointer"
          onClick={handleCoinClick}
          title="Tap to simulate spending ₹10 coins"
        >
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className={`coin ${idx < spentCount ? 'spent' : ''}`}
            />
          ))}
        </div>

        <div>
          <div className="font-display text-3xl font-bold text-secondary tabular-nums leading-none">
            {proteinRatio > 0 ? `${proteinPer10}g` : '0g'}
          </div>
          <div className="font-label-lg text-xs text-primary font-bold mt-1">
            Protein Extracted / ₹10
          </div>
          <div className="font-label-caps text-[0.65rem] text-on-surface-variant">
            {spentCount > 0 ? `(${5 - spentCount} coins active)` : 'Tap coins to interact'}
          </div>
        </div>
      </div>

      {/* Breakdown chips */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        {valueData.tenRupeesGet.map((item) => (
          <div
            key={item.nutrient}
            className="p-2 rounded-md bg-surface-container-lowest border border-outline-variant/30 text-xs shadow-2xs"
          >
            <div className="font-label-caps text-[0.65rem] uppercase text-on-surface-variant font-bold">
              {item.nutrient}
            </div>
            <div className="font-headline-sm text-xs font-bold text-primary mt-0.5 tabular-nums">
              {item.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
