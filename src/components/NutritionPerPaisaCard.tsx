'use client';

import React, { useState } from 'react';
import type { NutritionPerPaisaResult } from '@/lib/value';
import { Coins, Sparkles, HelpCircle } from 'lucide-react';

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
  category,
}: NutritionPerPaisaCardProps) {
  const [spentCount, setSpentCount] = useState(0);

  const handleCoinClick = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setSpentCount(prev => (prev < 5 ? prev + 1 : 0));
  };

  if (!valueData.isAvailable || !priceINR || !packSizeG) {
    return (
      <div className="bubble-card border-dashed bg-[var(--surface-alt)] opacity-80">
        <div className="flex items-center gap-3">
          <Coins className="w-6 h-6 text-[var(--mango)]" />
          <div>
            <h4 className="font-extrabold text-base">Nutrition Per Paisa</h4>
            <p className="text-xs opacity-70 mt-0.5">
              Price or pack weight not yet verified. Value ratio unlocks once pack metrics are confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const proteinRatio = valueData.proteinPerRupee ?? 0;
  const fibreRatio = valueData.fibrePerRupee ?? 0;

  return (
    <div className="bubble-card bg-[var(--surface-alt)]">
      <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--ink)]/15">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-[var(--mango)] fill-[var(--mango)]" />
          <h3 className="t-h3 text-[var(--ink)]">Nutrition Per Paisa</h3>
        </div>
        <span className="chip text-xs py-0.5 px-2 bg-[var(--surface)]">
          MRP ₹{priceINR} / {packSizeG}g
        </span>
      </div>

      <p className="t-small opacity-75 my-3">
        What real nutrients do you get for <strong>₹10</strong> of this food? Tap the coins below:
      </p>

      {/* Coin Stack + Big Stat */}
      <div className="flex items-center gap-6 my-4 p-4 rounded-2xl bg-[var(--surface)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]">
        <div
          className="coin-stack select-none shrink-0"
          onClick={handleCoinClick}
          title="Click to spend / drop coins"
        >
          {[0, 1, 2, 3, 4].map(idx => (
            <div
              key={idx}
              className={`coin ${idx < spentCount ? 'spent' : ''}`}
            />
          ))}
        </div>

        <div>
          <div className="t-display-lg text-[var(--mango)] leading-none">
            {proteinRatio > 0 ? `${(proteinRatio * 10).toFixed(1)}g` : '0g'}
          </div>
          <div className="font-extrabold text-sm text-[var(--ink)] mt-1">
            Protein per ₹10
          </div>
          <div className="text-xs opacity-60 font-semibold">
            {spentCount > 0 ? `(${5 - spentCount} coins active)` : 'Tap coins to interact'}
          </div>
        </div>
      </div>

      {/* Ten Rupees Get Items */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        {valueData.tenRupeesGet.map(item => (
          <div
            key={item.nutrient}
            className="p-2.5 rounded-xl bg-[var(--surface)] border-2 border-[var(--ink)] text-xs shadow-[2px_2px_0px_rgba(20,33,26,0.1)]"
          >
            <div className="opacity-60 text-[10px] uppercase font-bold">{item.nutrient}</div>
            <div className="font-extrabold text-sm text-[var(--ink)] mt-0.5">{item.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
