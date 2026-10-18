'use client';

import React from 'react';
import type { DaySummary } from '@/lib/diary';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface DayProgressBarsProps {
  daySummary: DaySummary;
  goalLabel?: string;
}

export default function DayProgressBars({ daySummary, goalLabel = 'Balanced' }: DayProgressBarsProps) {
  const { totals, percentagesOfReference, missingCounts, hasIncompleteNutrients } = daySummary;

  const metrics = [
    {
      id: 'protein',
      label: 'Protein',
      value: totals.proteinG,
      unit: 'g',
      pct: percentagesOfReference.protein,
      missing: missingCounts.proteinG,
      isLimit: false,
      color: 'bg-[var(--leaf)]',
      barColor: '#2D8A4E',
      icon: '💪',
      status:
        percentagesOfReference.protein >= 80
          ? 'Great intake'
          : percentagesOfReference.protein >= 40
          ? 'On track'
          : 'Low so far',
    },
    {
      id: 'fibre',
      label: 'Dietary Fibre',
      value: totals.fibreG,
      unit: 'g',
      pct: percentagesOfReference.fibre,
      missing: missingCounts.fibreG,
      isLimit: false,
      color: 'bg-[var(--sky)]',
      barColor: '#0084D1',
      icon: '🌾',
      status:
        percentagesOfReference.fibre >= 70
          ? 'High fibre'
          : percentagesOfReference.fibre >= 35
          ? 'Moderate'
          : 'Low so far',
    },
    {
      id: 'addedSugar',
      label: 'Added Sugar',
      value: totals.addedSugarG,
      unit: 'g',
      pct: percentagesOfReference.addedSugar,
      missing: missingCounts.addedSugarG,
      isLimit: true,
      color: percentagesOfReference.addedSugar > 100 ? 'bg-[var(--tomato)]' : 'bg-[var(--mango)]',
      barColor: percentagesOfReference.addedSugar > 100 ? '#FF4A3F' : '#FF9900',
      icon: '🍬',
      status:
        percentagesOfReference.addedSugar > 100
          ? 'Over limit'
          : percentagesOfReference.addedSugar > 75
          ? 'Near limit'
          : 'Within limit',
    },
    {
      id: 'sodium',
      label: 'Sodium',
      value: totals.sodiumMg,
      unit: 'mg',
      pct: percentagesOfReference.sodium,
      missing: missingCounts.sodiumMg,
      isLimit: true,
      color: percentagesOfReference.sodium > 100 ? 'bg-[var(--tomato)]' : 'bg-[var(--sky)]',
      barColor: percentagesOfReference.sodium > 100 ? '#FF4A3F' : '#0084D1',
      icon: '🧂',
      status:
        percentagesOfReference.sodium > 100
          ? 'Over limit'
          : percentagesOfReference.sodium > 75
          ? 'Near limit'
          : 'Within limit',
    },
  ];

  return (
    <div className="card-chunky p-5 space-y-5 bg-[var(--surface)]">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-[var(--ink)]/15 pb-3">
        <div>
          <h3 className="text-base font-extrabold font-display">Daily Contribution vs Reference Values</h3>
          <p className="text-xs text-[var(--ink)] opacity-70">
            Based on ICMR-NIN Indian adult references ({goalLabel} goal)
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-alt)] border border-[var(--ink)]/30 text-xs font-bold">
          <Info className="w-3.5 h-3.5 text-[var(--leaf)]" />
          <span>Informational, not medical advice</span>
        </div>
      </div>

      {hasIncompleteNutrients && (
        <div className="p-3 rounded-2xl bg-[var(--mango)]/20 border-2 border-[var(--mango)] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[var(--mango)] shrink-0" />
          <span>
            Some packaged items did not declare complete sugar/fibre values on their label. Displayed totals show{' '}
            <strong>at least</strong> the recorded amounts.
          </span>
        </div>
      )}

      {/* Progress Bars Grid */}
      <div className="space-y-4">
        {metrics.map((m) => {
          const clampedWidth = Math.min(100, m.pct);
          return (
            <div key={m.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                  {m.missing > 0 && (
                    <span className="text-[10px] text-[var(--tomato)] font-normal">
                      (missing on {m.missing} item{m.missing > 1 ? 's' : ''})
                    </span>
                  )}
                </span>
                <span className="text-right">
                  <span className="font-extrabold">
                    {m.missing > 0 ? '≥ ' : ''}
                    {m.value}
                    {m.unit}
                  </span>{' '}
                  <span className="opacity-70">
                    ({m.pct}% of {m.isLimit ? 'limit' : 'target'})
                  </span>
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-3 rounded-full bg-[var(--surface-alt)] border-2 border-[var(--ink)] overflow-hidden relative">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${clampedWidth}%`,
                    backgroundColor: m.barColor,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] opacity-70">
                <span>{m.isLimit ? 'Upper reference limit' : 'Recommended target'}</span>
                <span className="font-bold">{m.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
