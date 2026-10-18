'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { findAlternatives, AlternativeMode } from '@/lib/alternatives';
import { Sparkles, ArrowRight, Scale, Award, Zap, TrendingUp } from 'lucide-react';

interface BetterAlternativesCarouselProps {
  targetProduct: Product;
  allProducts: Product[];
}

const MODES: Array<{ id: AlternativeMode; label: string; icon: string }> = [
  { id: 'overall', label: 'Better Overall', icon: '✨' },
  { id: 'fbs', label: 'Higher FBS', icon: '📈' },
  { id: 'sugar', label: 'Lower Sugar', icon: '🍃' },
  { id: 'protein', label: 'More Protein', icon: '💪' },
  { id: 'sodium', label: 'Lower Sodium', icon: '🧂' },
  { id: 'cheaper', label: 'Cheaper', icon: '🪙' },
  { id: 'value', label: 'Best Value', icon: '⚡' },
];

export default function BetterAlternativesCarousel({
  targetProduct,
  allProducts,
}: BetterAlternativesCarouselProps) {
  const [selectedMode, setSelectedMode] = useState<AlternativeMode>('overall');

  const result = useMemo(() => {
    return findAlternatives(targetProduct, allProducts, {
      mode: selectedMode,
      limit: 8,
    });
  }, [targetProduct, allProducts, selectedMode]);

  if (!targetProduct || !allProducts || allProducts.length <= 1) {
    return null;
  }

  return (
    <section className="bubble-card bg-[var(--surface)] p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="chip bg-[var(--leaf)] text-white text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Isse Behtar Option (Smart Swaps)
          </div>
          <h2 className="t-h2 flex items-center gap-2">
            Better Alternatives
            {result.isTargetTopTier && selectedMode === 'overall' && (
              <span className="chip bg-[var(--mango)] text-[var(--ink)] text-xs font-black">
                <Award className="w-3.5 h-3.5" /> Top Ranked
              </span>
            )}
          </h2>
          <p className="text-sm font-semibold opacity-75 mt-1">
            {result.statusMessage}
          </p>
        </div>

        {/* Category aisle badge */}
        <div className="text-xs font-bold opacity-60 self-start sm:self-auto">
          Aisle: <span className="text-[var(--ink)] opacity-100 font-extrabold">{targetProduct.category || 'Grocery'}</span>
        </div>
      </div>

      {/* Mode Chips Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`chip cursor-pointer py-1.5 px-3 text-xs font-bold transition-all shrink-0 ${
              selectedMode === mode.id
                ? 'bg-[var(--ink)] text-[var(--surface)] border-2 border-[var(--ink)] shadow-[var(--shadow-hard-sm)]'
                : 'bg-[var(--surface-alt)] text-[var(--ink)] hover:bg-[var(--surface)] border border-[var(--ink)]/30'
            }`}
          >
            <span className="mr-1">{mode.icon}</span> {mode.label}
          </button>
        ))}
      </div>

      {/* Carousel Grid */}
      {result.suggestions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {result.suggestions.map((suggestion) => {
            const p = suggestion.product;
            const delta = suggestion.delta;
            const score = p.fbs?.score;

            const scoreColor =
              score === null
                ? '#94a3b8'
                : score >= 9
                ? 'var(--leaf)'
                : score >= 7
                ? '#10b981'
                : score >= 5
                ? 'var(--mango)'
                : score >= 3
                ? '#f97316'
                : 'var(--tomato)';

            return (
              <div
                key={p.slug}
                className="bubble-card bg-white p-4 flex flex-col justify-between hover:-translate-y-1 transition-transform relative group border-2 border-[var(--ink)] shadow-[var(--shadow-hard-sm)]"
              >
                {/* Top Badge: Primary Advantage */}
                <div className="mb-2">
                  <span className="chip text-[10px] font-black py-0.5 px-2 bg-[var(--mint)] text-[var(--ink)]">
                    <TrendingUp className="w-3 h-3 text-[var(--leaf)] inline mr-1" />
                    {suggestion.primaryAdvantage}
                  </span>
                </div>

                {/* Product Image & Info */}
                <Link href={`/food/${p.slug}`} className="block space-y-3">
                  <div className="w-full h-36 relative bg-[var(--surface-alt)] rounded-xl flex items-center justify-center p-2 overflow-hidden border border-[var(--ink)]/20">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="text-3xl font-black opacity-30 text-[var(--ink)]">
                        {p.name.charAt(0)}
                      </div>
                    )}

                    {/* FBS score bubble */}
                    <div
                      className="absolute top-2 right-2 chip text-[11px] font-black py-0.5 px-2 text-white border border-[var(--ink)]"
                      style={{ background: scoreColor }}
                    >
                      FBS {score ?? '—'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold opacity-60 uppercase tracking-wider block truncate">
                      {p.brand}
                    </span>
                    <h3 className="font-extrabold text-sm line-clamp-2 leading-tight group-hover:underline">
                      {p.name}
                    </h3>
                  </div>
                </Link>

                {/* Measured Deltas */}
                <div className="my-3 pt-3 border-t border-[var(--ink)]/10 space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {delta.fbs !== null && delta.fbs > 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        +{delta.fbs} FBS
                      </span>
                    )}
                    {delta.sugarG !== null && delta.sugarG < 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
                        {delta.sugarG}g sugar
                      </span>
                    )}
                    {delta.proteinG !== null && delta.proteinG > 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        +{delta.proteinG}g protein
                      </span>
                    )}
                    {delta.priceINR !== null && delta.priceINR <= 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                        {delta.priceINR === 0 ? 'Same ₹' : `-₹${Math.abs(delta.priceINR)}`}
                      </span>
                    )}
                  </div>
                  {p.priceINR && (
                    <div className="text-xs font-black text-[var(--ink)]">
                      ₹{p.priceINR} <span className="text-[10px] font-bold opacity-60">/ {p.packSizeText || `${p.packSizeG}g`}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons: Compare & View */}
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--ink)]/10">
                  <Link
                    href={`/compare?p1=${targetProduct.slug}&p2=${p.slug}`}
                    className="flex-1 btn-chunky btn-secondary py-1.5 px-2 text-[11px] font-bold text-center flex items-center justify-center gap-1"
                  >
                    <Scale className="w-3 h-3" /> Compare
                  </Link>
                  <Link
                    href={`/food/${p.slug}`}
                    className="btn-chunky btn-primary py-1.5 px-3 text-[11px] font-bold"
                    aria-label={`View ${p.name}`}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center space-y-3 bg-[var(--surface-alt)] rounded-2xl border border-[var(--ink)]/20">
          <p className="text-sm font-bold opacity-75">
            No alternate products found matching the <strong>{selectedMode}</strong> criteria within this aisle.
          </p>
          <button
            onClick={() => setSelectedMode('overall')}
            className="btn-chunky btn-primary py-2 px-5 text-xs font-bold"
          >
            Switch to Better Overall
          </button>
        </div>
      )}
    </section>
  );
}
