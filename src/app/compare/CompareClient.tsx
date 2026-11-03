'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';
import CompareV2Section from '@/scorecard-v2/ui/CompareV2Section';
import {
  Scale,
  Plus,
  X,
  Sparkles,
  Check,
} from 'lucide-react';

interface CompareClientProps {
  allProducts: Product[];
}

export default function CompareClient({ allProducts }: CompareClientProps) {
  const searchParams = useSearchParams();
  const initialSelect = searchParams.get('select');

  // Default selection: 2 products
  const defaultSlugs = useMemo(() => {
    if (initialSelect) {
      return [initialSelect, allProducts[0]?.slug].filter(Boolean);
    }
    return [allProducts[0]?.slug, allProducts[1]?.slug].filter(Boolean);
  }, [initialSelect, allProducts]);

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    const valid = defaultSlugs.filter((s) => allProducts.some((p) => p.slug === s));
    if (valid.length >= 2) return valid.slice(0, 4);
    return allProducts.slice(0, 2).map((p) => p.slug);
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const filteredPickerProducts = useMemo(() => {
    if (!pickerSearch.trim()) return allProducts;
    const q = pickerSearch.toLowerCase();
    return allProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [allProducts, pickerSearch]);

  const selectedProducts = useMemo(() => {
    return selectedSlugs
      .map((s) => allProducts.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p));
  }, [selectedSlugs, allProducts]);

  const addProduct = (slug: string) => {
    if (selectedSlugs.length < 4 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
    setPickerOpen(false);
  };

  const removeProduct = (slug: string) => {
    if (selectedSlugs.length > 2) {
      setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
    }
  };

  // Find best value per metric across selected products
  const bestMetrics = useMemo(() => {
    let maxProtein = -1;
    let maxFibre = -1;
    let minSugar = 9999;
    let minSodium = 9999;
    let maxFBS = -1;

    selectedProducts.forEach((p) => {
      const protein = p.per100g.proteinG ?? -1;
      if (protein > maxProtein) maxProtein = protein;

      const fibre = p.per100g.fibreG ?? -1;
      if (fibre > maxFibre) maxFibre = fibre;

      const sugar = p.per100g.totalSugarG ?? 9999;
      if (sugar < minSugar) minSugar = sugar;

      const sodium = p.per100g.sodiumMg ?? 9999;
      if (sodium < minSodium) minSodium = sodium;

      const fbs = p.fbs.score ?? -1;
      if (fbs > maxFBS) maxFBS = fbs;
    });

    return { maxProtein, maxFibre, minSugar, minSodium, maxFBS };
  }, [selectedProducts]);

  // Verdict calculation
  const verdict = useMemo(() => {
    if (selectedProducts.length < 2) return null;

    const withScore = selectedProducts.filter((p) => p.fbs.score !== null);
    if (withScore.length === 0) {
      return {
        winner: selectedProducts[0].name,
        summary: 'Nutritional comparison pending complete label declarations.',
      };
    }

    const sorted = [...withScore].sort((a, b) => (b.fbs.score ?? 0) - (a.fbs.score ?? 0));
    const top = sorted[0];
    const second = sorted[1];

    const isTie = top.fbs.score === second?.fbs.score;

    return {
      winner: top.name,
      isTie,
      summary: isTie
        ? "It's a dead heat tie on the Food Benefit Score!"
        : `${top.name} is the superior choice overall.`,
      reason: isTie
        ? 'Both items exhibit identical overall nutritional balance ratings.'
        : `Delivers a higher FBS (${top.fbs.score}/10) with cleaner ingredient density.`,
    };
  }, [selectedProducts]);

  return (
    <div className="space-y-8 container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-[var(--ink)]">
        <div>
          <div className="chip mb-2 bg-[var(--berry)] text-white">
            <Scale className="w-3.5 h-3.5" /> Side-by-Side Engine
          </div>
          <h1 className="t-display-lg text-[var(--ink)]">Compare Foods</h1>
          <p className="t-body font-semibold opacity-75 mt-1">
            Pick 2 to 4 products to compare sugar, protein, sodium, and Food Benefit Scores.
          </p>
        </div>

        {selectedSlugs.length < 4 && (
          <button
            onClick={() => setPickerOpen(true)}
            className="btn-chunky btn-primary py-2.5 px-5 text-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Food ({selectedSlugs.length}/4)
          </button>
        )}
      </div>

      {/* Quick Switch Dropdowns */}
      <div className="bubble-card bg-[var(--surface-alt)] p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:flex-1">
          <label className="text-xs font-black uppercase tracking-wider block mb-1 opacity-70">
            Product 1
          </label>
          <select
            value={selectedSlugs[0] || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) setSelectedSlugs([val, selectedSlugs[1] || ''].filter(Boolean));
            }}
            className="w-full p-3 font-bold text-sm bg-white border-2 border-[var(--ink)] rounded-xl"
          >
            {allProducts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.brand} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="t-h2 text-center shrink-0">VS</div>

        <div className="w-full md:flex-1">
          <label className="text-xs font-black uppercase tracking-wider block mb-1 opacity-70">
            Product 2
          </label>
          <select
            value={selectedSlugs[1] || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) setSelectedSlugs([selectedSlugs[0] || '', val].filter(Boolean));
            }}
            className="w-full p-3 font-bold text-sm bg-white border-2 border-[var(--ink)] rounded-xl"
          >
            {allProducts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.brand} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WiseFoodies Verdict Banner */}
      {verdict && (
        <div className="bubble-card bg-[var(--mint)] border-3 border-[var(--ink)] p-6 sm:p-8 text-center space-y-2">
          <div className="chip bg-white text-[var(--ink)] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--leaf)]" /> WiseFoodies Verdict
          </div>
          <h2 className="t-h2 text-[var(--ink)]">{verdict.summary}</h2>
          <p className="text-sm font-bold opacity-80 max-w-xl mx-auto">{verdict.reason}</p>
        </div>
      )}

      {/* Comparison Table with Winner Cell Crowns */}
      <div className="bubble-card p-0 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="compare-table w-full">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Metric (per 100g)</th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="text-center p-4">
                    <div className="relative inline-block">
                      {selectedProducts.length > 2 && (
                        <button
                          onClick={() => removeProduct(p.slug)}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-700 rounded-full p-0.5 border border-red-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="w-16 h-16 mx-auto relative rounded-xl bg-white border-2 border-[var(--ink)] p-1 overflow-hidden mb-2">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-xs font-black">{p.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase opacity-60">{p.brand}</div>
                    <Link
                      href={`/food/${p.slug}`}
                      className="font-extrabold text-xs hover:underline block truncate max-w-[150px] mx-auto"
                    >
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* FBS Score */}
              <tr>
                <td className="font-extrabold">Food Benefit Score</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.fbs.score !== null &&
                    p.fbs.score === bestMetrics.maxFBS &&
                    bestMetrics.maxFBS > 0;
                  return (
                    <td
                      key={p.id}
                      className={`text-center font-black ${isWinner ? 'winner-cell' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="t-numbers t-h3">
                          {p.fbs.score !== null ? p.fbs.score.toFixed(1) : '—'}
                        </span>
                        <FBSVitalityCapsule
                          score={p.fbs.score}
                          band={p.fbs.band}
                          orientation="horizontal"
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Protein */}
              <tr>
                <td className="font-extrabold">Protein</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.proteinG !== null &&
                    p.per100g.proteinG === bestMetrics.maxProtein &&
                    bestMetrics.maxProtein > 0;
                  return (
                    <td
                      key={p.id}
                      className={`text-center font-bold ${isWinner ? 'winner-cell' : ''}`}
                    >
                      {p.per100g.proteinG !== null ? `${p.per100g.proteinG}g` : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Dietary Fibre */}
              <tr>
                <td className="font-extrabold">Dietary Fibre</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.fibreG !== null &&
                    p.per100g.fibreG === bestMetrics.maxFibre &&
                    bestMetrics.maxFibre > 0;
                  return (
                    <td
                      key={p.id}
                      className={`text-center font-bold ${isWinner ? 'winner-cell' : ''}`}
                    >
                      {p.per100g.fibreG !== null ? `${p.per100g.fibreG}g` : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Added / Total Sugar */}
              <tr>
                <td className="font-extrabold">Total Sugar</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.totalSugarG !== null &&
                    p.per100g.totalSugarG === bestMetrics.minSugar;
                  return (
                    <td
                      key={p.id}
                      className={`text-center font-bold ${isWinner ? 'winner-cell' : ''}`}
                    >
                      {p.per100g.totalSugarG !== null ? `${p.per100g.totalSugarG}g` : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Sodium */}
              <tr>
                <td className="font-extrabold">Sodium</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.sodiumMg !== null &&
                    p.per100g.sodiumMg === bestMetrics.minSodium;
                  return (
                    <td
                      key={p.id}
                      className={`text-center font-bold ${isWinner ? 'winner-cell' : ''}`}
                    >
                      {p.per100g.sodiumMg !== null ? `${p.per100g.sodiumMg}mg` : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* MRP & Pack Size */}
              <tr>
                <td className="font-extrabold">MRP / Pack Size</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="text-center font-bold">
                    {p.priceINR ? `₹${p.priceINR} (${p.packSizeG}g)` : '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SCORECARD V2 COMPARISON UPGRADES (Nutrient Cost & Ingredients) */}
      <CompareV2Section products={selectedProducts} />

      {/* Product Selector Modal */}
      {pickerOpen && (
        <div
          className="bottom-sheet-overlay open"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="bottom-sheet open max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-drag" />
            <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--ink)]/20 mb-3">
              <h3 className="t-h3">Select Food to Compare</h3>
              <button onClick={() => setPickerOpen(false)} className="chip p-1.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-3">
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search food by name or brand..."
                className="w-full px-3 py-2 text-xs font-bold bg-[var(--surface)] border-2 border-[var(--ink)] rounded-xl"
              />
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-900">
                <span className="font-semibold">Comparing Indian Packaged Foods?</span>
                <Link
                  href="/products"
                  className="font-bold text-emerald-800 underline hover:text-emerald-950 shrink-0"
                >
                  852 Products Catalog &rarr;
                </Link>
              </div>
            </div>

            <div className="overflow-y-auto space-y-2 max-h-[50vh]">
              {filteredPickerProducts.map((p) => {
                const isSelected = selectedSlugs.includes(p.slug);
                return (
                  <button
                    key={p.id}
                    disabled={isSelected}
                    onClick={() => addProduct(p.slug)}
                    className={`w-full p-3 rounded-2xl border-2 border-[var(--ink)] text-left flex items-center justify-between transition-transform ${
                      isSelected
                        ? 'opacity-40 cursor-not-allowed bg-[var(--surface-alt)]'
                        : 'hover:scale-[1.01] bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-black text-[var(--leaf)] block">
                        {p.brand}
                      </span>
                      <span className="font-extrabold text-xs block truncate max-w-xs">
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {p.fbs.score !== null && (
                        <span className="chip text-xs py-0.5 px-2 font-black">
                          FBS {p.fbs.score.toFixed(1)}
                        </span>
                      )}
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[var(--leaf)]" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
