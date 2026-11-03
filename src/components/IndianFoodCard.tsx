'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus, Check, Flame, Award, Droplets, Zap } from 'lucide-react';
import type { PackagedFoodItem } from '@/types/packaged-food';
import { CATEGORY_ICONS } from '@/lib/foodConstants';

interface Props {
  product: PackagedFoodItem;
  isComparing?: boolean;
  onToggleCompare?: (product: PackagedFoodItem) => void;
  highlightText?: string;
}

export default function IndianFoodCard({
  product,
  isComparing = false,
  onToggleCompare,
  highlightText = '',
}: Props) {
  const icon = CATEGORY_ICONS[product.category] || '🍽️';

  const renderHighlighted = (text: string) => {
    if (!highlightText || !highlightText.trim()) return text;
    const q = highlightText.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.substring(0, idx)}
        <mark className="bg-[var(--accent)] text-stone-900 rounded px-0.5 font-bold">
          {text.substring(idx, idx + q.length)}
        </mark>
        {text.substring(idx + q.length)}
      </>
    );
  };

  return (
    <div className="bubble-card flex flex-col justify-between h-full group hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--ink)] transition-all bg-[var(--surface)] text-[var(--ink)]">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xl" title={product.category}>{icon}</span>
            <span className="chip text-[11px] font-extrabold uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {product.category}
            </span>
            {product.subCategory && (
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                • {product.subCategory}
              </span>
            )}
          </div>

          {product.priceINR !== null && (
            <span className="font-display font-extrabold text-sm text-[var(--leaf)] bg-[var(--mint)]/20 px-2.5 py-0.5 rounded-full border border-[var(--leaf)]/30 shrink-0">
              ₹{product.priceINR}
            </span>
          )}
        </div>

        {/* Brand */}
        <p className="text-xs font-black uppercase tracking-wider text-stone-500 mb-0.5">
          {renderHighlighted(product.brand)}
        </p>

        {/* Product Name */}
        <Link
          href={`/products/${product.id}`}
          className="font-display font-black text-lg text-stone-900 dark:text-stone-100 hover:text-[var(--leaf)] transition-colors line-clamp-2 leading-tight block mb-3"
        >
          {renderHighlighted(product.name)}
        </Link>

        {/* Nutrition Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 py-2 px-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 mb-4 text-center">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Energy</span>
            <span className="font-display font-black text-xs text-stone-800 dark:text-stone-200">
              {product.caloriesKcal !== null ? `${product.caloriesKcal}` : '—'}
            </span>
            <span className="text-[9px] text-stone-400 ml-0.5">kcal</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Protein</span>
            <span className="font-display font-black text-xs text-stone-800 dark:text-stone-200">
              {product.proteinG !== null ? `${product.proteinG}` : '—'}
            </span>
            <span className="text-[9px] text-stone-400 ml-0.5">g</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Sugar</span>
            <span className="font-display font-black text-xs text-stone-800 dark:text-stone-200">
              {product.sugarG !== null ? `${product.sugarG}` : '—'}
            </span>
            <span className="text-[9px] text-stone-400 ml-0.5">g</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Sodium</span>
            <span className="font-display font-black text-xs text-stone-800 dark:text-stone-200">
              {product.sodiumMg !== null ? `${product.sodiumMg}` : '—'}
            </span>
            <span className="text-[9px] text-stone-400 ml-0.5">mg</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-stone-200 dark:border-stone-800 mt-2">
        <Link
          href={`/products/${product.id}`}
          className="btn-chunky flex-1 text-center text-xs py-2 px-3 bg-[var(--leaf)] text-white hover:opacity-95 flex items-center justify-center gap-1"
        >
          <span>View Facts</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(product)}
            className={`btn-chunky py-2 px-3 text-xs flex items-center gap-1 transition-all ${
              isComparing
                ? 'bg-[var(--accent)] text-stone-900 font-extrabold border-[var(--ink)]'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
            title={isComparing ? 'Remove from compare' : 'Add to compare'}
          >
            {isComparing ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Compare</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
