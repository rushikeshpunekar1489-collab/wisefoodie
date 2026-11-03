'use client';

import React, { useState } from 'react';
import type { NutritionPerPaisaAnalysis } from '../modules/nutrition-per-paisa/types';
import {
  Coins,
  Sparkles,
  ChevronDown,
  Info,
  ShieldCheck,
  AlertTriangle,
  Award,
} from 'lucide-react';

interface NutritionPerPaisaV2CardProps {
  analysis: NutritionPerPaisaAnalysis;
}

export default function NutritionPerPaisaV2Card({ analysis }: NutritionPerPaisaV2CardProps) {
  const [spentCount, setSpentCount] = useState(0);
  const [showMissing, setShowMissing] = useState(false);
  const [activeGroup, setActiveGroup] = useState<'All' | 'Macros' | 'Minerals' | 'Vitamins'>('All');

  const handleCoinClick = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setSpentCount((prev) => (prev < 5 ? prev + 1 : 0));
  };

  if (!analysis.isAvailable || !analysis.priceINR || !analysis.packSizeValue) {
    return (
      <div className="bubble-card border-dashed bg-[var(--surface-alt)] opacity-80">
        <div className="flex items-center gap-3">
          <Coins className="w-6 h-6 text-[var(--mango)] shrink-0" />
          <div>
            <h4 className="font-extrabold text-base">Nutrition Per Paisa</h4>
            <p className="text-xs opacity-70 mt-0.5">
              Price or pack weight not yet verified. Accurate nutrient cost calculations unlock once pack metrics are confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredDeclared = analysis.declaredRows.filter((r) =>
    activeGroup === 'All' ? true : r.group === activeGroup
  );

  return (
    <div className="bubble-card bg-[var(--surface-alt)] space-y-6">
      {/* 1. Card Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--ink)]/15 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-[var(--mango)] fill-[var(--mango)]" />
          <h3 className="t-h3 text-[var(--ink)]">Nutrition Per Paisa</h3>
        </div>
        <span className="chip text-xs py-0.5 px-2.5 bg-[var(--surface)] font-extrabold">
          MRP ₹{analysis.priceINR} / {analysis.packSizeValue}{analysis.packSizeUnit}
        </span>
      </div>

      {/* 2. Interactive Coin Showcase & Best-Value Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coin Stack Widget */}
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-[var(--surface)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]">
          <div
            className="coin-stack select-none shrink-0 cursor-pointer"
            onClick={handleCoinClick}
            title="Click to drop/tap coins"
          >
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`coin ${idx < spentCount ? 'spent' : ''}`}
              />
            ))}
          </div>
          <div>
            <div className="text-xs font-bold opacity-60 uppercase tracking-wider">
              Cost Efficiency Metric
            </div>
            <div className="t-display-lg text-[var(--mango)] leading-none my-1">
              {analysis.bestValue ? analysis.bestValue.formattedCost : '₹—'}
            </div>
            <div className="font-extrabold text-xs text-[var(--ink)]">
              {analysis.bestValue
                ? `${analysis.bestValue.nutrientName} (${analysis.bestValue.targetUnit})`
                : 'Nutrient delivery cost'}
            </div>
            <div className="text-[11px] opacity-60 font-semibold mt-0.5">
              {spentCount > 0 ? `(${5 - spentCount} active coins)` : 'Tap coins to interact'}
            </div>
          </div>
        </div>

        {/* Best-Value Highlight Card */}
        {analysis.bestValue && (
          <div className="p-4 rounded-2xl bg-[var(--mint)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[var(--leaf)] mb-1">
              <Award className="w-4 h-4" /> Best-Value Nutrient in this Pack
            </div>
            <div className="text-sm font-extrabold text-[var(--ink)]">
              {analysis.bestValue.insight}
            </div>
            <div className="text-[11px] opacity-75 font-semibold mt-1">
              Obtain 1 target unit of {analysis.bestValue.nutrientName} for just {analysis.bestValue.formattedCost}.
            </div>
          </div>
        )}
      </div>

      {/* 3. Mandatory Quality Guardrail Notice */}
      <div className="p-3 rounded-xl bg-[var(--surface)] border-2 border-[var(--ink)] space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {analysis.qualityChips.map((chip, idx) => (
            <span
              key={idx}
              className={`chip text-[11px] py-0.5 px-2 ${
                idx === 0
                  ? 'bg-[var(--surface-alt)] font-extrabold'
                  : 'bg-[var(--tomato)] text-white font-bold'
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
        {analysis.proteinQualityNote && (
          <p className="text-xs font-semibold opacity-80 pt-1 text-[var(--ink)]">
            <strong>Protein Source Note:</strong> {analysis.proteinQualityNote}
          </p>
        )}
      </div>

      {/* 4. Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['All', 'Macros', 'Minerals', 'Vitamins'] as const).map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setActiveGroup(group)}
            className={`btn-chunky text-xs py-1 px-3 min-h-[44px] ${
              activeGroup === group
                ? 'bg-[var(--ink)] text-white'
                : 'bg-[var(--surface)] text-[var(--ink)]'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* 5. Compact Nutrient Cost Table */}
      <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)] overflow-hidden shadow-[2px_2px_0px_var(--ink)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--surface-alt)] border-b-2 border-[var(--ink)] text-[var(--ink)]">
                <th className="p-3 font-black">Nutrient</th>
                <th className="p-3 font-black">In Pack</th>
                <th className="p-3 font-black">Target Unit</th>
                <th className="p-3 font-black">Cost (₹)</th>
                <th className="p-3 font-black">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeclared.length > 0 ? (
                filteredDeclared.map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-[var(--ink)]/15 hover:bg-[var(--surface-alt)]/50 transition-colors"
                  >
                    <td className="p-3 font-bold text-[var(--ink)]">
                      <div>{row.name}</div>
                      <div className="text-[10px] opacity-60 font-normal truncate max-w-xs">
                        {row.bioavailabilityNote}
                      </div>
                    </td>
                    <td className="p-3 font-semibold whitespace-nowrap">
                      {row.totalInPack} {row.targetUnit}
                    </td>
                    <td className="p-3 font-semibold whitespace-nowrap">
                      per {row.targetQty} {row.targetUnit}
                    </td>
                    <td className="p-3 font-black text-sm text-[var(--leaf)] whitespace-nowrap">
                      {row.formattedCost}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="chip text-[10px] py-0 px-1.5 bg-[var(--mint)] text-[var(--ink)] font-bold">
                        {row.source === 'declared' ? 'Declared' : 'Estimated'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center opacity-60 italic">
                    No declared nutrients in the {activeGroup} group for this product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Missing / Not Declared Expandable Section */}
      {analysis.missingRows.length > 0 && (
        <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMissing(!showMissing)}
            aria-expanded={showMissing}
            className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs bg-[var(--surface-alt)] hover:bg-[var(--surface-alt)]/80 transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[var(--mango)]" />
              <span>Not Declared on this Packaging ({analysis.missingRows.length} nutrients)</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showMissing ? 'rotate-180' : ''
              }`}
            />
          </button>
          {showMissing && (
            <div className="p-4 space-y-2 border-t-2 border-[var(--ink)] text-xs">
              <p className="text-[11px] opacity-70 mb-2">
                Indian packaged food regulations do not mandate disclosure of all micronutrients unless specific fortification or nutrition claims are made.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingRows.map((r) => (
                  <span
                    key={r.key}
                    className="chip text-[11px] bg-[var(--surface-alt)] border border-[var(--ink)]/20 py-0.5 px-2"
                  >
                    {r.name} (N/A)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Bioavailability & Quality Note */}
      <p className="text-[11px] opacity-70 leading-relaxed font-semibold italic text-center">
        {analysis.micronutrientNote}
      </p>

      {/* Module Footer Tagline */}
      <div className="pt-2 text-center border-t border-[var(--ink)]/10 text-xs font-semibold opacity-60">
        &ldquo;Eat what you enjoy. Understand what you consume. Know what you pay for. Make smarter food choices.&rdquo;
      </div>
    </div>
  );
}
