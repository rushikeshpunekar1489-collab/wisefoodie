'use client';

import React, { useState } from 'react';
import glossaryData from '@/data/ingredient-glossary.json';
import { Sparkles, Info, X } from 'lucide-react';

interface IngredientBreakdownProps {
  ingredients: string[];
}

interface GlossaryEntry {
  name: string;
  category: 'useful' | 'functional' | 'worth-understanding' | 'attention';
  icon: string;
  tag: string;
  whatItIs: string;
  whyUsed: string;
  whatToKnow: string;
}

const glossary = glossaryData as Record<string, GlossaryEntry>;

export default function IngredientBreakdown({ ingredients }: IngredientBreakdownProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<GlossaryEntry | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="bubble-card border-dashed bg-[var(--surface-alt)] opacity-80 text-center py-6">
        <p className="t-small opacity-70">Ingredient list awaiting manufacturer disclosure.</p>
      </div>
    );
  }

  const lookupEntry = (raw: string): GlossaryEntry => {
    const lower = raw.toLowerCase().trim();
    for (const [key, entry] of Object.entries(glossary)) {
      if (lower.includes(key)) {
        return { ...entry, name: raw };
      }
    }
    return {
      name: raw,
      category: 'functional',
      icon: '🔵',
      tag: 'Culinary Ingredient',
      whatItIs: 'Standard recipe component.',
      whyUsed: 'Provides texture, taste, or stability.',
      whatToKnow: 'Standard food ingredient; no acute health concern registered.',
    };
  };

  const getPillClass = (category: string) => {
    switch (category) {
      case 'useful':
        return 'ing-useful';
      case 'functional':
        return 'ing-functional';
      case 'worth-understanding':
        return 'ing-worth';
      case 'attention':
        return 'ing-attention';
      default:
        return 'ing-functional';
    }
  };

  const COLLAPSED_LIMIT = 8;
  const hasMore = ingredients.length > COLLAPSED_LIMIT;
  const displayedIngredients = isExpanded || !hasMore ? ingredients : ingredients.slice(0, COLLAPSED_LIMIT);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs opacity-70 font-bold">
          {ingredients.length} declared ingredients
        </span>
        {hasMore && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-black text-[var(--leaf)] hover:underline"
          >
            {isExpanded ? 'Show fewer' : `Show all (${ingredients.length})`}
          </button>
        )}
      </div>

      {/* Ingredient Pills */}
      <div className="flex flex-wrap gap-1.5 my-2">
        {displayedIngredients.map((ing, idx) => {
          const entry = lookupEntry(ing);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIngredient(entry)}
              className={`ingredient-pill ${getPillClass(entry.category)}`}
            >
              {ing}
            </button>
          );
        })}
      </div>

      {/* Expand Button for mobile if long list */}
      {hasMore && !isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="btn-chunky py-2 px-4 text-xs w-full mt-2 bg-[var(--surface-alt)] font-black text-[var(--ink)]"
        >
          + Show {ingredients.length - COLLAPSED_LIMIT} More Ingredients
        </button>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2.5 sm:gap-4 mt-5 pt-3 border-t-2 border-[var(--ink)]/15 text-[11px] sm:text-xs font-black">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--leaf)] border border-[var(--ink)]" />
          Useful Base
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--sky)] border border-[var(--ink)]" />
          Functional Additive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--mango)] border border-[var(--ink)]" />
          Worth Understanding
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--tomato)] border border-[var(--ink)]" />
          Limit / Attention
        </span>
      </div>

      {/* Detail Modal Popover */}
      {selectedIngredient && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedIngredient(null)}
        >
          <div
            className="bubble-card max-w-md w-full relative bg-[var(--surface)] p-5 sm:p-6 max-h-[85dvh] overflow-y-auto pb-safe rounded-b-none sm:rounded-3xl animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-drag sm:hidden" />
            <button
              onClick={() => setSelectedIngredient(null)}
              className="btn-chunky p-2 rounded-full! border-2! absolute top-4 right-4"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <span className={`chip text-xs py-0.5 px-3 mb-2 font-extrabold ${getPillClass(selectedIngredient.category)}`}>
              {selectedIngredient.tag}
            </span>

            <h3 className="t-h2 text-[var(--ink)] mt-2 mb-3">{selectedIngredient.name}</h3>

            <div className="space-y-3 text-sm text-[var(--ink)]">
              <div>
                <strong className="text-xs uppercase opacity-60 block">What it is</strong>
                <p className="mt-0.5">{selectedIngredient.whatItIs}</p>
              </div>
              <div>
                <strong className="text-xs uppercase opacity-60 block">Why it is used</strong>
                <p className="mt-0.5">{selectedIngredient.whyUsed}</p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/20">
                <strong className="text-xs uppercase text-[var(--tomato)] font-extrabold block">WiseFoodies Note</strong>
                <p className="text-xs mt-0.5 opacity-90">{selectedIngredient.whatToKnow}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedIngredient(null)}
              className="btn-chunky btn-primary w-full mt-5"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
