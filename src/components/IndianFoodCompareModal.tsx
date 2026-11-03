'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Award, Flame, Droplets, Zap, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { PackagedFoodItem, ComparisonHighlight } from '@/types/packaged-food';
import { CATEGORY_ICONS } from '@/lib/foodConstants';

interface Props {
  selectedProducts: PackagedFoodItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function IndianFoodCompareModal({
  selectedProducts,
  onRemove,
  onClear,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedProducts.length === 0) return null;

  // Compute highlights
  const highlights: ComparisonHighlight = {
    highestProteinId: null,
    lowestSugarId: null,
    lowestCalorieId: null,
    lowestSodiumId: null,
  };

  let maxProt = -Infinity;
  let minSug = Infinity;
  let minCal = Infinity;
  let minSod = Infinity;

  selectedProducts.forEach(p => {
    if (p.proteinG !== null && p.proteinG > maxProt) {
      maxProt = p.proteinG;
      highlights.highestProteinId = p.id;
    }
    if (p.sugarG !== null && p.sugarG < minSug) {
      minSug = p.sugarG;
      highlights.lowestSugarId = p.id;
    }
    if (p.caloriesKcal !== null && p.caloriesKcal < minCal) {
      minCal = p.caloriesKcal;
      highlights.lowestCalorieId = p.id;
    }
    if (p.sodiumMg !== null && p.sodiumMg < minSod) {
      minSod = p.sodiumMg;
      highlights.lowestSodiumId = p.id;
    }
  });

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-stone-900 text-white rounded-2xl shadow-[6px_6px_0px_var(--ink)] border-2 border-stone-950 p-3 sm:p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto min-w-0">
          <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[var(--accent)] shrink-0">
            Compare ({selectedProducts.length}/4):
          </span>
          <div className="flex items-center gap-2">
            {selectedProducts.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-stone-800 text-stone-200 px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 border border-stone-700"
              >
                <span>{CATEGORY_ICONS[p.category] || '🍽️'}</span>
                <span className="max-w-[120px] truncate">{p.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="hover:text-[var(--tomato)] transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-stone-400 hover:text-white px-2 py-1 font-bold"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="btn-chunky py-2 px-4 text-xs bg-[var(--accent)] text-stone-950 font-black flex items-center gap-1.5"
          >
            <span>Compare Now</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[var(--surface)] text-[var(--ink)] border-3 border-[var(--ink)] rounded-3xl shadow-[8px_8px_0px_var(--ink)] max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b-2 border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-50">
                  Nutritional Head-to-Head Comparison
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  Side-by-side nutritional metrics with automatic winner detection
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body: Comparison Table */}
            <div className="overflow-x-auto p-4 sm:p-6 flex-1">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-stone-300 dark:border-stone-700">
                    <th className="p-3 text-xs font-black uppercase text-stone-500 w-1/4">Metric</th>
                    {selectedProducts.map(p => (
                      <th key={p.id} className="p-3 text-sm font-display font-extrabold text-stone-900 dark:text-stone-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-stone-400 uppercase">{p.brand}</span>
                          <button
                            type="button"
                            onClick={() => onRemove(p.id)}
                            className="text-stone-400 hover:text-[var(--tomato)]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-base line-clamp-2 mt-0.5">{p.name}</div>
                        <div className="text-xs font-normal text-stone-500 mt-1 flex items-center gap-1">
                          <span>{CATEGORY_ICONS[p.category]}</span>
                          <span>{p.category}</span>
                          {p.priceINR !== null && <span className="font-bold text-[var(--leaf)] ml-1">₹{p.priceINR}</span>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
                  {/* Energy / Calories */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-bold flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>Calories (kcal)</span>
                    </td>
                    {selectedProducts.map(p => {
                      const isWinner = highlights.lowestCalorieId === p.id && p.caloriesKcal !== null;
                      return (
                        <td key={p.id} className="p-3 font-mono font-bold">
                          {p.caloriesKcal !== null ? `${p.caloriesKcal} kcal` : <span className="text-stone-400 font-normal">Not declared</span>}
                          {isWinner && (
                            <span className="ml-2 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              ⚡ Lowest Calorie
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Protein */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Protein (g)</span>
                    </td>
                    {selectedProducts.map(p => {
                      const isWinner = highlights.highestProteinId === p.id && p.proteinG !== null;
                      return (
                        <td key={p.id} className="p-3 font-mono font-bold">
                          {p.proteinG !== null ? `${p.proteinG} g` : <span className="text-stone-400 font-normal">Not declared</span>}
                          {isWinner && (
                            <span className="ml-2 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              🏆 Highest Protein
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Sugar */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-bold flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-rose-500" />
                      <span>Sugar (g)</span>
                    </td>
                    {selectedProducts.map(p => {
                      const isWinner = highlights.lowestSugarId === p.id && p.sugarG !== null;
                      return (
                        <td key={p.id} className="p-3 font-mono font-bold">
                          {p.sugarG !== null ? `${p.sugarG} g` : <span className="text-stone-400 font-normal">Not declared</span>}
                          {isWinner && (
                            <span className="ml-2 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              🍃 Lowest Sugar
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Sodium */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-bold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-sky-500" />
                      <span>Sodium (mg)</span>
                    </td>
                    {selectedProducts.map(p => {
                      const isWinner = highlights.lowestSodiumId === p.id && p.sodiumMg !== null;
                      return (
                        <td key={p.id} className="p-3 font-mono font-bold">
                          {p.sodiumMg !== null ? `${p.sodiumMg} mg` : <span className="text-stone-400 font-normal">Not declared</span>}
                          {isWinner && (
                            <span className="ml-2 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              💧 Lowest Sodium
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Carbohydrates */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">Carbohydrates (g)</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="p-3 font-mono">
                        {p.carbohydratesG !== null ? `${p.carbohydratesG} g` : '—'}
                      </td>
                    ))}
                  </tr>

                  {/* Total Fat */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">Total Fat (g)</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="p-3 font-mono">
                        {p.totalFatG !== null ? `${p.totalFatG} g` : '—'}
                      </td>
                    ))}
                  </tr>

                  {/* Dietary Fiber */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">Dietary Fiber (g)</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="p-3 font-mono">
                        {p.dietaryFiberG !== null ? `${p.dietaryFiberG} g` : '—'}
                      </td>
                    ))}
                  </tr>

                  {/* Serving Size */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">Serving Size</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="p-3">
                        {p.servingSizeG !== null ? `${p.servingSizeG} g` : 'Per 100g'}
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">Price (INR)</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="p-3 font-bold text-[var(--leaf)]">
                        {p.priceINR !== null ? `₹${p.priceINR}` : '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t-2 border-stone-200 dark:border-stone-800 flex justify-end gap-3 bg-stone-50 dark:bg-stone-900">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-chunky py-2 px-5 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
