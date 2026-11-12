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
  ShieldAlert,
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

    // Sort by FBS score
    const sorted = [...selectedProducts].sort(
      (a, b) => (b.fbs.score ?? 0) - (a.fbs.score ?? 0)
    );
    const winner = sorted[0];
    const runnerUp = sorted[1];

    if (!winner.fbs.score || !runnerUp.fbs.score) return null;

    const diff = winner.fbs.score - runnerUp.fbs.score;

    if (diff < 5) {
      return {
        winner,
        summary: 'Nutritional Tie: Marginal Difference',
        reason: `${winner.name} and ${runnerUp.name} have nearly identical nutritional quality (FBS difference < 5 pts). Check ingredients list for additives.`,
      };
    }

    return {
      winner,
      summary: `${winner.name} wins on holistic food benefit`,
      reason: `Scores ${winner.fbs.score.toFixed(1)} vs ${runnerUp.fbs.score.toFixed(1)} (${diff.toFixed(1)} pts higher). Offers better nutrient density per 100g.`,
    };
  }, [selectedProducts]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5 text-primary" />
            <span>Forensic Comparison Matrix</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight">
            Side-by-Side Food Audit
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl font-medium mt-1">
            Compare 2 to 4 foods across verified nutritional metrics, sugar content, and ingredient quality.
          </p>
        </div>

        {selectedSlugs.length < 4 && (
          <button
            onClick={() => setPickerOpen(true)}
            className="py-2.5 px-5 rounded-full bg-primary text-on-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food ({selectedSlugs.length}/4)</span>
          </button>
        )}
      </div>

      {/* Quick Switch Dropdowns */}
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-outline block mb-1">
            Product 1
          </label>
          <select
            value={selectedSlugs[0] || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) setSelectedSlugs([val, selectedSlugs[1] || ''].filter(Boolean));
            }}
            className="w-full p-3 font-semibold text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary"
          >
            {allProducts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.brand} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="font-serif font-bold text-xl text-primary/40 shrink-0 px-2">VS</div>

        <div className="w-full md:flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-outline block mb-1">
            Product 2
          </label>
          <select
            value={selectedSlugs[1] || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) setSelectedSlugs([selectedSlugs[0] || '', val].filter(Boolean));
            }}
            className="w-full p-3 font-semibold text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary"
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
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 sm:p-8 text-center space-y-2 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-primary text-xs font-bold border border-primary/20 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Botanical Forensic Verdict</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary">{verdict.summary}</h2>
          <p className="text-sm font-medium text-on-surface-variant max-w-xl mx-auto">{verdict.reason}</p>
        </div>
      )}

      {/* Comparison Table with Winner Cell Crowns */}
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm divide-y divide-outline-variant/20">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-outline w-1/4">
                  Metric (per 100g)
                </th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="text-center p-4">
                    <div className="relative inline-block">
                      {selectedProducts.length > 2 && (
                        <button
                          onClick={() => removeProduct(p.slug)}
                          className="absolute -top-2 -right-2 bg-error text-white rounded-full p-0.5 shadow-sm hover:scale-110 transition-transform"
                          title="Remove from compare"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="w-20 h-20 mx-auto relative rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-1 overflow-hidden mb-2 shadow-xs">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="80px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-primary/60">
                            <span className="material-symbols-outlined text-xl">verified</span>
                            <span className="text-[8px] font-bold uppercase">Forensic</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-outline">{p.brand}</div>
                    <Link
                      href={`/food/${p.slug}`}
                      className="font-serif font-bold text-sm text-primary hover:underline block truncate max-w-[150px] mx-auto mt-0.5"
                    >
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {/* FBS Score */}
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-4 font-semibold text-on-surface">Food Benefit Score</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.fbs.score !== null &&
                    p.fbs.score === bestMetrics.maxFBS &&
                    bestMetrics.maxFBS > 0;
                  return (
                    <td
                      key={p.id}
                      className={`text-center p-4 ${isWinner ? 'bg-primary/5 font-bold' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-serif font-bold text-xl text-primary">
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
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-4 font-semibold text-on-surface">Protein</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.proteinG !== null &&
                    p.per100g.proteinG === bestMetrics.maxProtein &&
                    bestMetrics.maxProtein > 0;
                  return (
                    <td
                      key={p.id}
                      className={`text-center p-4 font-medium ${isWinner ? 'bg-primary/5 font-bold text-primary' : 'text-on-surface'}`}
                    >
                      {p.per100g.proteinG !== null ? `${p.per100g.proteinG}g` : '—'}
                      {isWinner && <span className="text-[10px] block text-primary font-bold">Highest</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Dietary Fibre */}
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-4 font-semibold text-on-surface">Dietary Fibre</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.fibreG !== null &&
                    p.per100g.fibreG === bestMetrics.maxFibre &&
                    bestMetrics.maxFibre > 0;
                  return (
                    <td
                      key={p.id}
                      className={`text-center p-4 font-medium ${isWinner ? 'bg-primary/5 font-bold text-primary' : 'text-on-surface'}`}
                    >
                      {p.per100g.fibreG !== null ? `${p.per100g.fibreG}g` : '—'}
                      {isWinner && <span className="text-[10px] block text-primary font-bold">Highest</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Added / Total Sugar */}
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-4 font-semibold text-on-surface">Total Sugar</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.totalSugarG !== null &&
                    p.per100g.totalSugarG === bestMetrics.minSugar;
                  return (
                    <td
                      key={p.id}
                      className={`text-center p-4 font-medium ${isWinner ? 'bg-primary/5 font-bold text-primary' : 'text-on-surface'}`}
                    >
                      {p.per100g.totalSugarG !== null ? `${p.per100g.totalSugarG}g` : '—'}
                      {isWinner && <span className="text-[10px] block text-primary font-bold">Lowest</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Sodium */}
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-4 font-semibold text-on-surface">Sodium</td>
                {selectedProducts.map((p) => {
                  const isWinner =
                    p.per100g.sodiumMg !== null &&
                    p.per100g.sodiumMg === bestMetrics.minSodium;
                  return (
                    <td
                      key={p.id}
                      className={`text-center p-4 font-medium ${isWinner ? 'bg-primary/5 font-bold text-primary' : 'text-on-surface'}`}
                    >
                      {p.per100g.sodiumMg !== null ? `${p.per100g.sodiumMg}mg` : '—'}
                      {isWinner && <span className="text-[10px] block text-primary font-bold">Lowest</span>}
                    </td>
                  );
                })}
              </tr>

              {/* MRP & Pack Size */}
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-4 font-semibold text-on-surface">MRP / Pack Size</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="text-center p-4 font-medium text-on-surface">
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
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-serif font-bold text-lg text-primary">Select Food to Compare</h3>
              <button
                onClick={() => setPickerOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container text-outline"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search food by name or brand..."
                className="w-full px-4 py-2.5 text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary"
              />
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between text-xs text-primary">
                <span className="font-medium">Browse Complete Indian Catalog?</span>
                <Link
                  href="/products"
                  className="font-bold underline hover:text-primary-container shrink-0"
                >
                  852 Products Catalog &rarr;
                </Link>
              </div>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {filteredPickerProducts.map((p) => {
                const isSelected = selectedSlugs.includes(p.slug);
                return (
                  <button
                    key={p.id}
                    disabled={isSelected}
                    onClick={() => addProduct(p.slug)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'opacity-40 cursor-not-allowed bg-surface-container-low border-outline-variant/20'
                        : 'hover:border-primary/50 bg-surface-container-lowest border-outline-variant/30 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-outline block">
                        {p.brand}
                      </span>
                      <span className="font-semibold text-xs text-on-surface block truncate max-w-xs">
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {p.fbs.score !== null && (
                        <span className="text-xs py-0.5 px-2 rounded-md bg-surface-container-low font-bold text-primary">
                          FBS {p.fbs.score.toFixed(1)}
                        </span>
                      )}
                      {isSelected ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-outline" />
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
