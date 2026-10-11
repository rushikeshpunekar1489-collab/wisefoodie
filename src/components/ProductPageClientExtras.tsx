'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import { Info, Sparkles, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface ProductPageClientExtrasProps {
  product: Product;
}

export default function ProductPageClientExtras({ product }: ProductPageClientExtrasProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const score = product.fbs.score;

  // Trigger confetti once if score >= 8.0
  useEffect(() => {
    if (score && score >= 8.0) {
      const colors = ['var(--leaf)', 'var(--mango)', 'var(--bubblegum)', 'var(--sky)'];
      for (let i = 0; i < 30; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        el.style.left = `${Math.random() * 100}vw`;
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.animationDuration = `${Math.random() * 2 + 2}s`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }
    }
  }, [score]);

  const bandColor =
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
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="btn-chunky btn-primary py-2.5 px-5 text-xs inline-flex items-center gap-2"
      >
        <Info className="w-4 h-4" /> How is this calculated?
      </button>

      {/* Global Bottom Sheet for Breakdown */}
      {sheetOpen && (
        <div
          className="bottom-sheet-overlay open"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="bottom-sheet open max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-drag" />
            <div className="flex justify-between items-center mb-4">
              <h2 className="t-h2">Score Breakdown</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="chip p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="flex justify-between items-center mb-4 p-3 bubble-card"
              style={{ background: 'var(--surface-alt)' }}
            >
              <div className="font-extrabold text-sm">Baseline Neutral Score</div>
              <div className="t-h3 font-black">6.0</div>
            </div>

            <div className="space-y-3 text-sm">
              {/* Positive Factors */}
              {product.per100g.proteinG !== null && product.per100g.proteinG > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                  <div>
                    <div className="font-bold flex items-center gap-1 text-[var(--leaf)]">
                      <CheckCircle className="w-3.5 h-3.5" /> Protein Bonus ({product.per100g.proteinG}g / 100g)
                    </div>
                    <span className="text-xs opacity-60">High natural protein density</span>
                  </div>
                  <div className="font-black text-[var(--leaf)]">
                    +{Math.min(1.5, ((product.per100g.proteinG || 0) / 15) * 1.5).toFixed(1)}
                  </div>
                </div>
              )}

              {product.per100g.fibreG !== null && product.per100g.fibreG > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                  <div>
                    <div className="font-bold flex items-center gap-1 text-[var(--leaf)]">
                      <CheckCircle className="w-3.5 h-3.5" /> Dietary Fibre ({product.per100g.fibreG}g / 100g)
                    </div>
                    <span className="text-xs opacity-60">Whole grains, seeds, or legumes</span>
                  </div>
                  <div className="font-black text-[var(--leaf)]">
                    +{Math.min(1.5, ((product.per100g.fibreG || 0) / 6) * 1.5).toFixed(1)}
                  </div>
                </div>
              )}

              {/* Negative Factors */}
              {product.per100g.addedSugarG !== null && product.per100g.addedSugarG > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                  <div>
                    <div className="font-bold flex items-center gap-1 text-[var(--tomato)]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Added Sugar ({product.per100g.addedSugarG}g / 100g)
                    </div>
                    <span className="text-xs opacity-60">Free sugar load penalty</span>
                  </div>
                  <div className="font-black text-[var(--tomato)]">
                    -{Math.min(1.5, ((product.per100g.addedSugarG || 0) / 20) * 1.5).toFixed(1)}
                  </div>
                </div>
              )}

              {product.per100g.sodiumMg !== null && product.per100g.sodiumMg > 400 && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                  <div>
                    <div className="font-bold flex items-center gap-1 text-[var(--tomato)]">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Sodium ({product.per100g.sodiumMg}mg / 100g)
                    </div>
                    <span className="text-xs opacity-60">Salt load exceeds guideline</span>
                  </div>
                  <div className="font-black text-[var(--tomato)]">
                    -{Math.min(1.0, ((product.per100g.sodiumMg || 0) / 800) * 1.0).toFixed(1)}
                  </div>
                </div>
              )}

              {product.per100g.satFatG !== null && product.per100g.satFatG > 5 && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                  <div>
                    <div className="font-bold flex items-center gap-1 text-[var(--tomato)]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Saturated Fat ({product.per100g.satFatG}g / 100g)
                    </div>
                    <span className="text-xs opacity-60">Palmolein / butter fat density</span>
                  </div>
                  <div className="font-black text-[var(--tomato)]">
                    -{Math.min(1.0, ((product.per100g.satFatG || 0) / 10) * 1.0).toFixed(1)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-5 pt-4 border-t-3 border-[var(--ink)]">
              <div className="t-h3">Final Food Benefit Score</div>
              <div className="t-display-lg" style={{ color: bandColor }}>
                {score !== null ? score.toFixed(1) : 'Pending'}
              </div>
            </div>

            <button
              type="button"
              className="btn-chunky w-full mt-5"
              onClick={() => setSheetOpen(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
