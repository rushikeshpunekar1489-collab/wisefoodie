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
      <div className="py-20 text-center text-sm text-outline font-medium">
        Loading your Smart Basket...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
        <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto text-primary">
          <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Your Smart Basket is Empty
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Add items from the 852 Indian packaged products catalog to analyze your total nutritional footprint, free sugar load, and discover healthier brand swaps.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/products"
            className="w-full sm:w-auto py-2.5 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
          >
            Explore 852 Products
          </Link>
          <Link
            href="/favourites"
            className="w-full sm:w-auto py-2.5 px-6 rounded-full bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors"
          >
            View Favourites
          </Link>
        </div>

        {/* Saved lists if any */}
        {savedLists.length > 0 && (
          <div className="mt-8 text-left bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-primary" /> Your Saved Baskets
            </h3>
            <div className="space-y-2">
              {savedLists.map((list) => (
                <div key={list.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
                  <div>
                    <span className="font-bold text-sm text-on-surface">{list.name}</span>
                    <span className="text-xs text-outline ml-2">({list.items.reduce((s, i) => s + i.quantity, 0)} packs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadSavedBasket(list.id)}
                      className="py-1 px-3 rounded-full bg-primary text-on-primary text-xs font-semibold"
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedBasket(list.id)}
                      className="p-1 text-error hover:text-error/80"
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
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl shadow-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="text-xs font-bold text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Swapped for a healthier alternative! Basket FBS elevated.</span>
          </div>
          <button
            type="button"
            onClick={handleUndoSwap}
            className="py-1 px-3 text-xs bg-surface-container-lowest rounded-lg border border-outline-variant/40 font-semibold text-on-surface flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo Swap
          </button>
        </div>
      )}

      {/* Header & Basket Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShoppingCart className="w-6 h-6 stroke-[2]" />
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary flex items-center gap-2">
              Smart Basket
              <span className="text-xs py-0.5 px-2.5 rounded-full bg-primary text-on-primary font-bold">
                {count} packs
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-on-surface-variant mt-1">
            Real-time nutrition balance, calorie-weighted score, and 1-tap swaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareBasket}
            className="py-2 px-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1.5 shadow-xs transition-colors"
            title="Share basket summary"
          >
            {shareCopied ? (
              <>
                <Check className="w-4 h-4 text-primary" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-primary" />
                <span>Share Basket</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="py-2 px-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-error/5 text-xs font-semibold text-error flex items-center gap-1.5 shadow-xs transition-colors"
            title="Empty basket"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty</span>
          </button>
        </div>
      </div>

      {/* 1. BASKET FBS HERO SCORE CARD */}
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 justify-between shadow-sm">
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline bg-surface-container-low px-2.5 py-1 rounded-md">
              Basis: Calorie-Weighted Average
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
              Basket Rating:{' '}
              <span style={{ color: bandColor }}>
                {summary.basketFBS !== null ? `${summary.basketFBS.toFixed(1)}/10` : 'Pending'}
              </span>
            </h2>
            <p className="text-xs font-medium text-on-surface-variant max-w-sm">
              Each food's impact on your score is proportioned to its caloric density and quantity in your basket.
            </p>
            {summary.proteinPer10INR !== null && (
              <div className="pt-2 text-xs font-bold text-primary flex items-center gap-1.5 justify-center sm:justify-start">
                <Zap className="w-4 h-4 fill-current text-primary" />
                <span>₹10 gives {summary.proteinPer10INR}g protein & {summary.fibrePer10INR || '0'}g fibre</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Macro Totals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:max-w-md">
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Est. Price</span>
            <div className="text-xl font-bold font-serif text-primary mt-0.5">₹{summary.totalPriceINR}</div>
            <span className="text-[9px] font-medium text-outline">all {count} packs</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Total Energy</span>
            <div className="text-xl font-bold font-serif text-primary mt-0.5">{summary.totalCaloriesKcal}</div>
            <span className="text-[9px] font-medium text-outline">kcal</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Protein</span>
            <div className="text-xl font-bold font-serif text-primary mt-0.5">{summary.totalProteinG}g</div>
            <span className="text-[9px] font-medium text-outline">pack total</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-error">Free Sugar</span>
            <div className="text-xl font-bold font-serif text-error mt-0.5">{summary.totalAddedSugarG}g</div>
            <span className="text-[9px] font-medium text-outline">free sugars</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Fibre</span>
            <div className="text-xl font-bold font-serif text-on-surface mt-0.5">{summary.totalFibreG}g</div>
            <span className="text-[9px] font-medium text-outline">dietary fibre</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Sodium</span>
            <div className="text-xl font-bold font-serif text-on-surface mt-0.5">{summary.totalSodiumMg}mg</div>
            <span className="text-[9px] font-medium text-outline">salt load</span>
          </div>
        </div>
      </div>

      {/* 2. "MAKE THIS BASKET BETTER" (SMART SWAPS) */}
      {swapSuggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h3 className="font-serif font-bold text-xl text-primary">Make This Basket Better (Smart Swaps)</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
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
                  className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-outline">
                    <span>Category: {swap.originalProduct.category}</span>
                    <span className="text-primary font-bold">
                      +{swap.deltaBasketFBS} Basket FBS Boost
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    {/* Current item */}
                    <div className="p-3 rounded-xl bg-error/5 border border-error/20">
                      <span className="text-[9px] uppercase font-bold text-error">In Basket</span>
                      <h5 className="text-xs font-bold text-on-surface truncate mt-0.5">
                        {swap.originalProduct.name}
                      </h5>
                      <div className="text-xs font-bold text-error mt-1">
                        FBS {origScore.toFixed(1)}
                        <span className="text-[10px] text-outline ml-1 font-normal">
                          (₹{swap.originalProduct.priceINR || '—'})
                        </span>
                      </div>
                    </div>

                    {/* Swap candidate */}
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <span className="text-[9px] uppercase font-bold text-primary">Recommended Swap</span>
                      <h5 className="text-xs font-bold text-on-surface truncate mt-0.5">
                        {swap.suggestedProduct.name}
                      </h5>
                      <div className="text-xs font-bold text-primary mt-1">
                        FBS {altScore.toFixed(1)}
                        <span className="text-[10px] text-outline ml-1 font-normal">
                          (₹{swap.suggestedProduct.priceINR || '—'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Impact preview */}
                  <div className="p-3 bg-surface-container-low rounded-xl text-xs font-medium text-on-surface flex items-center justify-between">
                    <div>
                      Projected Basket:{' '}
                      <strong className="text-primary font-bold">
                        {swap.currentBasketFBS.toFixed(1)} → {swap.projectedBasketFBS.toFixed(1)}
                      </strong>
                    </div>
                    <div className="text-on-surface-variant font-semibold">
                      {swap.deltaPriceINR >= 0 ? `+₹${swap.deltaPriceINR}` : `−₹${Math.abs(swap.deltaPriceINR)}`} &middot;{' '}
                      {swap.deltaSugarG <= 0 ? `${swap.deltaSugarG}g sugar` : `+${swap.deltaSugarG}g sugar`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplySwap(swap)}
                    className="w-full py-2 px-4 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
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
        <div className="rounded-2xl bg-error/5 border border-error/20 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle className="w-5 h-5 text-error" />
            <h3 className="font-serif font-bold text-lg text-on-surface">What's Dragging Your Basket Score Down?</h3>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">
            These foods add heavy free sugar, sodium, or ultra-processing penalties to your basket:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {summary.draggingDownItems.map((drag) => (
              <div key={drag.product.slug} className="p-3 bg-surface-container-lowest rounded-xl border border-error/20 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-error">
                    FBS {drag.score.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-medium text-outline">{drag.product.brand}</span>
                </div>
                <h5 className="text-xs font-bold text-on-surface truncate mt-1">
                  {drag.product.name}
                </h5>
                <p className="text-[11px] font-medium text-on-surface-variant mt-1">{drag.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. NUTRIENT CONTRIBUTION BREAKDOWN */}
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-lg text-primary">Where does your nutrition come from?</h3>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveNutrientTab('sugar')}
              className={`text-xs py-1 px-3 rounded-lg font-semibold transition-colors ${
                activeNutrientTab === 'sugar' ? 'bg-error text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sugar
            </button>
            <button
              type="button"
              onClick={() => setActiveNutrientTab('protein')}
              className={`text-xs py-1 px-3 rounded-lg font-semibold transition-colors ${
                activeNutrientTab === 'protein' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Protein
            </button>
            <button
              type="button"
              onClick={() => setActiveNutrientTab('calories')}
              className={`text-xs py-1 px-3 rounded-lg font-semibold transition-colors ${
                activeNutrientTab === 'calories' ? 'bg-on-surface text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Energy
            </button>
          </div>
        </div>

        {/* Stacked contribution bar */}
        <div className="space-y-3">
          <div className="w-full h-5 rounded-full overflow-hidden flex bg-surface-container-low border border-outline-variant/30">
            {summary.items.map((item, idx) => {
              const colors = ['#059669', '#d97706', '#2563eb', '#db2777', '#7c3aed', '#0d9488', '#4b5563'];
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

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-on-surface-variant">
            {summary.items.map((item, idx) => {
              const colors = ['#059669', '#d97706', '#2563eb', '#db2777', '#7c3aed', '#0d9488', '#4b5563'];
              const itemVal =
                activeNutrientTab === 'sugar'
                  ? item.itemTotalSugarG
                  : activeNutrientTab === 'protein'
                  ? item.itemTotalProteinG
                  : item.itemTotalCalories;

              return (
                <div key={item.product.slug} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="truncate max-w-36 text-on-surface">{item.product.name}</span>
                  <span className="font-bold text-primary">
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
        <h3 className="font-serif font-bold text-xl text-primary">Basket Items ({summary.uniqueCount} distinct)</h3>

        <div className="space-y-3">
          {summary.items.map((item) => {
            const score = item.product.fbs.score;
            const itemBandColor = getScoreBandColor(score);

            return (
              <div
                key={item.product.slug}
                className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 relative bg-surface-container-low rounded-xl border border-outline-variant/30 shrink-0 p-1 flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-primary/60">
                        <span className="material-symbols-outlined text-lg">verified</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-primary truncate">
                      <Link href={`/food/${item.product.slug}`} className="hover:underline">
                        {item.product.name}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] py-0.5 px-2 rounded-md font-bold"
                        style={{ backgroundColor: `${itemBandColor}15`, color: itemBandColor }}
                      >
                        FBS {score !== null ? score.toFixed(1) : '—'}
                      </span>
                      <span className="text-xs font-medium text-outline">
                        ₹{item.product.priceINR || '—'} / {item.packWeightG}g pack
                      </span>
                    </div>
                  </div>
                </div>

                {/* Per-item nutrients summary */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-surface-container-low py-1.5 px-3 rounded-xl w-full sm:w-auto">
                  <div>
                    <span className="text-[9px] text-outline block uppercase font-medium">Protein</span>
                    <span className="text-primary font-bold">{item.itemTotalProteinG}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-outline block uppercase font-medium">Sugar</span>
                    <span className="text-error font-bold">{item.itemTotalSugarG}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-outline block uppercase font-medium">Energy</span>
                    <span className="text-on-surface font-semibold">{item.itemTotalCalories}</span>
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-outline block font-medium">Item Total</span>
                    <span className="text-base font-bold font-serif text-primary">
                      {item.itemTotalPrice !== null ? `₹${item.itemTotalPrice}` : '—'}
                    </span>
                  </div>

                  <AddToCartButton slug={item.product.slug} size="sm" />

                  <button
                    type="button"
                    onClick={() => remove(item.product.slug)}
                    aria-label={`Remove ${item.product.name}`}
                    className="p-1.5 rounded-full hover:bg-error/10 text-error transition-colors"
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
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-primary" /> Save This Basket as a Reusable List
        </h3>
        <form onSubmit={handleSaveList} className="flex gap-2">
          <input
            type="text"
            value={listNameInput}
            onChange={(e) => setListNameInput(e.target.value)}
            placeholder="e.g. Weekly Breakfast Essentials, College Snack Box..."
            className="flex-1 py-2 px-3 text-xs bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold shrink-0 hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Save List
          </button>
        </form>
        {saveSuccess && (
          <p className="text-xs font-medium text-primary flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Basket saved to your lists!
          </p>
        )}
      </div>

      {/* Ground Rules Disclaimer Note */}
      <p className="text-[11px] text-center font-medium text-outline pt-4">
        Totals are based on pack label declarations. For information only, not medical advice. No checkout or payments.
      </p>
    </div>
  );
}
