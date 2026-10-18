'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import {
  computeBasketSummary,
  computeBasketSwaps,
  applyCartSwap,
  type BasketSwapSuggestion,
} from '@/lib/cart';
import { getScoreBandColor } from '@/lib/shareCard';
import AddToCartButton from '@/components/AddToCartButton';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';
import {
  ShoppingCart,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Trash2,
  Bookmark,
  Share2,
  Check,
  Plus,
  Minus,
  Info,
  Layers,
} from 'lucide-react';

interface CartClientProps {
  allProducts: Product[];
}

export default function CartClient({ allProducts }: CartClientProps) {
  const {
    cartItems,
    count,
    isReady,
    updateQuantity,
    remove,
    clearCart,
    savedLists,
    saveCurrentBasket,
    loadSavedBasket,
    deleteSavedBasket,
  } = useCart();

  const [listNameInput, setListNameInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [undoSwap, setUndoSwap] = useState<{ from: string; to: string } | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeNutrientTab, setActiveNutrientTab] = useState<'calories' | 'protein' | 'sugar'>('sugar');

  // Compute live basket summary
  const summary = useMemo(() => {
    return computeBasketSummary(cartItems, allProducts);
  }, [cartItems, allProducts]);

  // Compute smart swaps
  const swapSuggestions = useMemo(() => {
    return computeBasketSwaps(cartItems, allProducts);
  }, [cartItems, allProducts]);

  const bandColor = getScoreBandColor(summary.basketFBS);

  const handleApplySwap = (suggestion: BasketSwapSuggestion) => {
    // Record for undo
    setUndoSwap({
      from: suggestion.suggestedProduct.slug,
      to: suggestion.originalProduct.slug,
    });

    // Execute swap
    const updated = applyCartSwap(cartItems, suggestion.originalProduct.slug, suggestion.suggestedProduct.slug);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('wf_cart_v1', JSON.stringify({ version: 1, items: updated }));
        window.dispatchEvent(new CustomEvent('wf:cart_changed', { detail: updated }));
      }
    } catch {
      // ignore
    }
  };

  const handleUndoSwap = () => {
    if (!undoSwap) return;
    const reverted = applyCartSwap(cartItems, undoSwap.from, undoSwap.to);
    setUndoSwap(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('wf_cart_v1', JSON.stringify({ version: 1, items: reverted }));
        window.dispatchEvent(new CustomEvent('wf:cart_changed', { detail: reverted }));
      }
    } catch {
      // ignore
    }
  };

  const handleSaveList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listNameInput.trim()) return;
    saveCurrentBasket(listNameInput.trim());
    setListNameInput('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleShareBasket = () => {
    const text = `My WiseFoodies Smart Basket has an FBS of ${summary.basketFBS ?? '—'}/10 with ${count} items (₹${summary.totalPriceINR}). Check nutritional intelligence before you buy! → https://wisefoodies.in/cart`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'WiseFoodies Smart Basket', text });
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  if (!isReady) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[var(--leaf)] border-t-transparent" />
        <p className="mt-3 text-xs font-bold opacity-60">Calculating your basket nutrition...</p>
      </div>
    );
  }

  // EMPTY STATE
  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--surface-alt)] border-3 border-[var(--ink)] flex items-center justify-center shadow-[4px_4px_0px_var(--ink)] mb-6">
          <ShoppingCart className="w-10 h-10 text-[var(--leaf)] opacity-40 stroke-[2]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">Your Smart Basket is Empty</h1>
        <p className="text-sm font-semibold text-[var(--ink)] opacity-70 mt-3 leading-relaxed">
          Add items from the catalog or search to see your aggregate Food Benefit Score, sugar tracking, and 1-tap smarter swaps.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/explore" className="btn-chunky btn-primary py-3 px-6 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Explore Healthy Foods <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/favourites" className="btn-chunky py-3 px-6 text-sm bg-white hover:bg-[var(--surface-alt)]">
            View Favourites
          </Link>
        </div>

        {/* Saved lists if any */}
        {savedLists.length > 0 && (
          <div className="mt-12 text-left bg-white p-5 rounded-2xl border-2 border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)]">
            <h3 className="text-sm font-black uppercase text-[var(--ink)] mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[var(--leaf)]" /> Your Saved Baskets
            </h3>
            <div className="space-y-2">
              {savedLists.map((list) => (
                <div key={list.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/15">
                  <div>
                    <span className="font-extrabold text-sm">{list.name}</span>
                    <span className="text-xs opacity-60 ml-2">({list.items.reduce((s, i) => s + i.quantity, 0)} packs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadSavedBasket(list.id)}
                      className="btn-chunky btn-primary py-1 px-3 text-xs"
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedBasket(list.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Undo Banner if swap was applied */}
      {undoSwap && (
        <div className="p-3 bg-[var(--mint)] border-2 border-[var(--ink)] rounded-2xl shadow-[3px_3px_0px_var(--ink)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="text-xs font-black text-[var(--ink)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--leaf)]" />
            <span>Swapped for a healthier alternative! Basket FBS elevated.</span>
          </div>
          <button
            type="button"
            onClick={handleUndoSwap}
            className="btn-chunky py-1 px-3 text-xs bg-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo Swap
          </button>
        </div>
      )}

      {/* Header & Basket Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-3 border-[var(--ink)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--leaf)]/10 text-[var(--leaf)] border-2 border-[var(--leaf)]">
              <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
              Smart Basket
              <span className="ml-2.5 text-base py-0.5 px-2.5 rounded-full bg-[var(--ink)] text-white font-black">
                {count} packs
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold opacity-70 mt-1">
            Real-time nutrition balance, calorie-weighted score, and 1-tap swaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareBasket}
            className="btn-chunky py-2 px-3 text-xs bg-white hover:bg-[var(--surface-alt)] flex items-center gap-1.5"
            title="Share basket summary"
          >
            {shareCopied ? (
              <>
                <Check className="w-4 h-4 text-[var(--leaf)]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[var(--leaf)]" />
                <span>Share Basket</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="btn-chunky py-2 px-3 text-xs text-[var(--tomato)] hover:bg-red-50 flex items-center gap-1.5"
            title="Empty basket"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty</span>
          </button>
        </div>
      </div>

      {/* 1. BASKET FBS HERO SCORE CARD */}
      <div className="bubble-card bg-[var(--surface)] p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
        {/* Left: Vitality Capsule Display */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <FBSVitalityCapsule
            score={summary.basketFBS}
            band={summary.basketFBS && summary.basketFBS >= 7 ? 'Good' : summary.basketFBS && summary.basketFBS >= 5 ? 'Moderate' : 'Needs Better'}
            orientation="vertical"
            size="md"
            showLabel={true}
          />

          <div className="text-center sm:text-left space-y-2">
            <span className="chip text-[11px] bg-[var(--surface-alt)] font-extrabold">
              Basis: Calorie-Weighted Average
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)]">
              Basket Rating:{' '}
              <span style={{ color: bandColor }}>
                {summary.basketFBS !== null ? `${summary.basketFBS.toFixed(1)}/10` : 'Pending'}
              </span>
            </h2>
            <p className="text-xs font-semibold opacity-70 max-w-sm">
              Each food's impact on your score is proportioned to its caloric density and quantity in your basket.
            </p>
            {summary.proteinPer10INR !== null && (
              <div className="pt-2 text-xs font-black text-[var(--leaf)] flex items-center gap-1.5 justify-center sm:justify-start">
                <Zap className="w-4 h-4 fill-current" />
                <span>₹10 gives {summary.proteinPer10INR}g protein & {summary.fibrePer10INR || '0'}g fibre</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Macro Totals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:max-w-md">
          <div className="p-3 bg-white rounded-2xl border-2 border-[var(--ink)]/15 text-center shadow-xs">
            <span className="text-[10px] font-black uppercase text-gray-500">Est. Price</span>
            <div className="text-xl font-black text-[var(--ink)] mt-0.5">₹{summary.totalPriceINR}</div>
            <span className="text-[9px] font-bold opacity-50">all {count} packs</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border-2 border-[var(--ink)]/15 text-center shadow-xs">
            <span className="text-[10px] font-black uppercase text-gray-500">Total Calories</span>
            <div className="text-xl font-black text-[var(--ink)] mt-0.5">{summary.totalCaloriesKcal}</div>
            <span className="text-[9px] font-bold opacity-50">kcal</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border-2 border-[var(--ink)]/15 text-center shadow-xs">
            <span className="text-[10px] font-black uppercase text-[var(--leaf)]">Protein</span>
            <div className="text-xl font-black text-[var(--leaf)] mt-0.5">{summary.totalProteinG}g</div>
            <span className="text-[9px] font-bold opacity-50">pack total</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border-2 border-[var(--ink)]/15 text-center shadow-xs">
            <span className="text-[10px] font-black uppercase text-[var(--tomato)]">Added Sugar</span>
            <div className="text-xl font-black text-[var(--tomato)] mt-0.5">{summary.totalAddedSugarG}g</div>
            <span className="text-[9px] font-bold opacity-50">free sugars</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border-2 border-[var(--ink)]/15 text-center shadow-xs">
            <span className="text-[10px] font-black uppercase text-gray-500">Fibre</span>
            <div className="text-xl font-black text-[var(--ink)] mt-0.5">{summary.totalFibreG}g</div>
            <span className="text-[9px] font-bold opacity-50">dietary fibre</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border-2 border-[var(--ink)]/15 text-center shadow-xs">
            <span className="text-[10px] font-black uppercase text-gray-500">Sodium</span>
            <div className="text-xl font-black text-[var(--ink)] mt-0.5">{summary.totalSodiumMg}mg</div>
            <span className="text-[9px] font-bold opacity-50">salt load</span>
          </div>
        </div>
      </div>

      {/* 2. "MAKE THIS BASKET BETTER" (SMART SWAPS) */}
      {swapSuggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--mango)]" />
              <h3 className="text-xl font-black text-[var(--ink)]">Make This Basket Better (Smart Swaps)</h3>
            </div>
            <span className="chip bg-[var(--mint)] text-xs font-black">
              {swapSuggestions.length} swap{swapSuggestions.length > 1 ? 's' : ''} available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swapSuggestions.map((swap) => {
              const origScore = swap.originalProduct.fbs.score ?? 0;
              const altScore = swap.suggestedProduct.fbs.score ?? 0;

              return (
                <div
                  key={`${swap.originalProduct.slug}-${swap.suggestedProduct.slug}`}
                  className="bubble-card bg-white p-4 space-y-3 border-2 border-[var(--ink)]"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                    <span>Category: {swap.originalProduct.category}</span>
                    <span className="text-[var(--leaf)] font-black">
                      +{swap.deltaBasketFBS} Basket FBS Boost
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    {/* Current item */}
                    <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-200">
                      <span className="text-[9px] uppercase font-black text-red-500">In Basket</span>
                      <h5 className="text-xs font-extrabold text-[var(--ink)] truncate mt-0.5">
                        {swap.originalProduct.name}
                      </h5>
                      <div className="text-xs font-black text-red-600 mt-1">
                        FBS {origScore.toFixed(1)}
                        <span className="text-[10px] text-gray-500 ml-1 font-normal">
                          (₹{swap.originalProduct.priceINR || '—'})
                        </span>
                      </div>
                    </div>

                    {/* Swap candidate */}
                    <div className="p-2.5 rounded-xl bg-green-50 border border-green-300">
                      <span className="text-[9px] uppercase font-black text-green-700">Recommended Swap</span>
                      <h5 className="text-xs font-extrabold text-[var(--ink)] truncate mt-0.5">
                        {swap.suggestedProduct.name}
                      </h5>
                      <div className="text-xs font-black text-green-700 mt-1">
                        FBS {altScore.toFixed(1)}
                        <span className="text-[10px] text-gray-500 ml-1 font-normal">
                          (₹{swap.suggestedProduct.priceINR || '—'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Impact preview */}
                  <div className="p-2 bg-[var(--surface-alt)] rounded-xl text-[11px] font-bold text-[var(--ink)] flex items-center justify-between">
                    <div>
                      Projected Basket:{' '}
                      <strong className="text-[var(--leaf)]">
                        {swap.currentBasketFBS.toFixed(1)} → {swap.projectedBasketFBS.toFixed(1)}
                      </strong>
                    </div>
                    <div className="text-gray-600 font-extrabold">
                      {swap.deltaPriceINR >= 0 ? `+₹${swap.deltaPriceINR}` : `−₹${Math.abs(swap.deltaPriceINR)}`} •{' '}
                      {swap.deltaSugarG <= 0 ? `${swap.deltaSugarG}g sugar` : `+${swap.deltaSugarG}g sugar`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplySwap(swap)}
                    className="btn-chunky btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Apply Swap
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. "WHAT'S DRAGGING YOUR SCORE DOWN?" */}
      {summary.draggingDownItems.length > 0 && (
        <div className="bubble-card bg-amber-50/70 border-2 border-[var(--mango)] p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-[var(--mango)]" />
            <h3 className="text-lg font-black">What's Dragging Your Basket Score Down?</h3>
          </div>
          <p className="text-xs font-semibold text-amber-800">
            These foods add heavy free sugar, sodium, or ultra-processing penalties to your basket:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {summary.draggingDownItems.map((drag) => (
              <div key={drag.product.slug} className="p-3 bg-white rounded-xl border border-amber-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-red-500">
                    FBS {drag.score.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">{drag.product.brand}</span>
                </div>
                <h5 className="text-xs font-extrabold text-[var(--ink)] truncate mt-1">
                  {drag.product.name}
                </h5>
                <p className="text-[11px] font-semibold text-gray-600 mt-1">{drag.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. NUTRIENT CONTRIBUTION BREAKDOWN */}
      <div className="bubble-card bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--leaf)]" />
            <h3 className="text-lg font-black text-[var(--ink)]">Where does your nutrition come from?</h3>
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--surface-alt)] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveNutrientTab('sugar')}
              className={`chip text-[11px] py-1 px-2.5 ${
                activeNutrientTab === 'sugar' ? 'bg-[var(--tomato)] text-white' : ''
              }`}
            >
              Sugar
            </button>
            <button
              type="button"
              onClick={() => setActiveNutrientTab('protein')}
              className={`chip text-[11px] py-1 px-2.5 ${
                activeNutrientTab === 'protein' ? 'bg-[var(--leaf)] text-white' : ''
              }`}
            >
              Protein
            </button>
            <button
              type="button"
              onClick={() => setActiveNutrientTab('calories')}
              className={`chip text-[11px] py-1 px-2.5 ${
                activeNutrientTab === 'calories' ? 'bg-[var(--ink)] text-white' : ''
              }`}
            >
              Calories
            </button>
          </div>
        </div>

        {/* Stacked contribution bar */}
        <div className="space-y-3">
          <div className="w-full h-6 rounded-xl overflow-hidden flex border-2 border-[var(--ink)]">
            {summary.items.map((item, idx) => {
              const colors = ['#15803d', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#64748b'];
              const itemVal =
                activeNutrientTab === 'sugar'
                  ? item.itemTotalSugarG
                  : activeNutrientTab === 'protein'
                  ? item.itemTotalProteinG
                  : item.itemTotalCalories;

              const totalVal =
                activeNutrientTab === 'sugar'
                  ? summary.totalSugarG
                  : activeNutrientTab === 'protein'
                  ? summary.totalProteinG
                  : summary.totalCaloriesKcal;

              const pct = totalVal > 0 ? (itemVal / totalVal) * 100 : 0;
              if (pct < 1) return null;

              return (
                <div
                  key={item.product.slug}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: colors[idx % colors.length],
                  }}
                  title={`${item.product.name}: ${itemVal}${activeNutrientTab === 'calories' ? ' kcal' : 'g'} (${pct.toFixed(0)}%)`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-600">
            {summary.items.map((item, idx) => {
              const colors = ['#15803d', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#64748b'];
              const itemVal =
                activeNutrientTab === 'sugar'
                  ? item.itemTotalSugarG
                  : activeNutrientTab === 'protein'
                  ? item.itemTotalProteinG
                  : item.itemTotalCalories;

              return (
                <div key={item.product.slug} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="truncate max-w-36">{item.product.name}</span>
                  <span className="font-black text-[var(--ink)]">
                    {itemVal}
                    {activeNutrientTab === 'calories' ? ' kcal' : 'g'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. CART ITEMS TABLE */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[var(--ink)]">Basket Items ({summary.uniqueCount} distinct)</h3>

        <div className="space-y-3">
          {summary.items.map((item) => {
            const score = item.product.fbs.score;
            const itemBandColor = getScoreBandColor(score);

            return (
              <div
                key={item.product.slug}
                className="bubble-card bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[var(--ink)]"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 relative bg-[var(--surface-alt)] rounded-xl border border-[var(--ink)]/15 shrink-0 p-1 flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    ) : (
                      <span className="font-bold text-sm opacity-40">{item.product.name.charAt(0)}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-[var(--leaf)] uppercase">
                      {item.product.brand}
                    </span>
                    <h4 className="text-sm font-black text-[var(--ink)] truncate">
                      <Link href={`/food/${item.product.slug}`} className="hover:underline">
                        {item.product.name}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="chip text-[10px] py-0.2 px-2 font-black"
                        style={{ borderColor: itemBandColor, color: itemBandColor }}
                      >
                        FBS {score !== null ? score.toFixed(1) : '—'}
                      </span>
                      <span className="text-xs font-bold opacity-60">
                        ₹{item.product.priceINR || '—'} / {item.packWeightG}g pack
                      </span>
                    </div>
                  </div>
                </div>

                {/* Per-item nutrients summary */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black bg-[var(--surface-alt)] py-1.5 px-3 rounded-xl w-full sm:w-auto">
                  <div>
                    <span className="text-[9px] opacity-60 block uppercase">Protein</span>
                    <span className="text-[var(--leaf)]">{item.itemTotalProteinG}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] opacity-60 block uppercase">Sugar</span>
                    <span className="text-[var(--tomato)]">{item.itemTotalSugarG}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] opacity-60 block uppercase">Calories</span>
                    <span>{item.itemTotalCalories}</span>
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <span className="text-xs opacity-60 block">Item Total</span>
                    <span className="text-base font-black text-[var(--ink)]">
                      {item.itemTotalPrice !== null ? `₹${item.itemTotalPrice}` : '—'}
                    </span>
                  </div>

                  <AddToCartButton slug={item.product.slug} size="sm" />

                  <button
                    type="button"
                    onClick={() => remove(item.product.slug)}
                    aria-label={`Remove ${item.product.name}`}
                    className="p-1.5 rounded-full hover:bg-red-50 text-[var(--tomato)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. SAVE BASKET AS LIST */}
      <div className="bubble-card bg-[var(--surface-alt)] p-5 space-y-3">
        <h3 className="text-sm font-black uppercase text-[var(--ink)] flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-[var(--leaf)]" /> Save This Basket as a Reusable List
        </h3>
        <form onSubmit={handleSaveList} className="flex gap-2">
          <input
            type="text"
            value={listNameInput}
            onChange={(e) => setListNameInput(e.target.value)}
            placeholder="e.g. Weekly Breakfast Essentials, College Snack Box..."
            className="flex-1 py-2 px-3 text-xs font-bold bg-white rounded-xl border border-[var(--ink)]/20 focus:outline-hidden"
          />
          <button type="submit" className="btn-chunky btn-primary py-2 px-4 text-xs shrink-0">
            Save List
          </button>
        </form>
        {saveSuccess && (
          <p className="text-xs font-bold text-[var(--leaf)] flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Basket saved to your lists!
          </p>
        )}
      </div>

      {/* Ground Rules Disclaimer Note */}
      <p className="text-[11px] text-center font-semibold text-[var(--ink)]/60 pt-4">
        Totals are based on pack label declarations. For information only, not medical advice. No checkout or payments.
      </p>
    </div>
  );
}
