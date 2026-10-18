/**
 * WiseFoodies Smart Cart Pure Logic Module
 * Deterministic basket calculations, calorie-weighted FBS, value intelligence, and smart swaps.
 */

import type { Product } from '@/types/product';
import { findAlternatives, type AlternativeSuggestion } from './alternatives';

export const CART_STORAGE_KEY = 'wf_cart_v1';

export interface CartItem {
  slug: string;
  quantity: number;
  addedAt: number;
}

export interface SavedBasketList {
  id: string;
  name: string;
  createdAt: number;
  items: CartItem[];
}

export interface CartStoragePayload {
  version: 1;
  items: CartItem[];
  savedLists?: SavedBasketList[];
}

export interface CartItemComputed {
  product: Product;
  quantity: number;
  packWeightG: number;
  totalWeightG: number;
  itemTotalPrice: number | null;
  itemTotalCalories: number;
  itemTotalProteinG: number;
  itemTotalSugarG: number;
  itemTotalAddedSugarG: number;
  itemTotalSodiumMg: number;
  itemTotalFibreG: number;
}

export interface BasketSummary {
  items: CartItemComputed[];
  totalPacks: number;
  uniqueCount: number;
  totalPriceINR: number;
  totalCaloriesKcal: number;
  totalProteinG: number;
  totalFibreG: number;
  totalSugarG: number;
  totalAddedSugarG: number;
  totalSodiumMg: number;
  basketFBS: number | null;
  weightingBasis: 'calories' | 'weight' | 'none';
  proteinPer10INR: number | null;
  fibrePer10INR: number | null;
  categoryMix: Array<{ category: string; count: number; percentage: number }>;
  bestItem: { product: Product; score: number } | null;
  worstItem: { product: Product; score: number } | null;
  draggingDownItems: Array<{ product: Product; score: number; reason: string }>;
}

export interface BasketSwapSuggestion {
  originalProduct: Product;
  suggestedProduct: Product;
  currentBasketFBS: number;
  projectedBasketFBS: number;
  deltaBasketFBS: number;
  deltaPriceINR: number;
  deltaSugarG: number;
  deltaProteinG: number;
  reason: string;
}

/**
 * Safely parse raw JSON into validated CartItem array.
 */
export function parseCart(rawJson: string | null): CartItem[] {
  if (!rawJson) return [];

  try {
    const parsed = JSON.parse(rawJson);

    // Schema v1 with versioned payload
    if (parsed && parsed.version === 1 && Array.isArray(parsed.items)) {
      return parsed.items
        .filter((item: any) => typeof item === 'object' && item !== null && typeof item.slug === 'string')
        .map((item: any) => ({
          slug: item.slug.trim(),
          quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
          addedAt: typeof item.addedAt === 'number' ? item.addedAt : Date.now(),
        }));
    }

    // Direct array fallback: [{ slug, quantity }] or ['slug-1', 'slug-2']
    if (Array.isArray(parsed)) {
      const now = Date.now();
      return parsed
        .map((entry: any, idx: number) => {
          if (typeof entry === 'string') {
            return { slug: entry.trim(), quantity: 1, addedAt: now - idx * 1000 };
          }
          if (entry && typeof entry.slug === 'string') {
            return {
              slug: entry.slug.trim(),
              quantity: Math.max(1, Math.min(99, Number(entry.quantity) || 1)),
              addedAt: typeof entry.addedAt === 'number' ? entry.addedAt : now - idx * 1000,
            };
          }
          return null;
        })
        .filter((item): item is CartItem => item !== null && item.slug.length > 0);
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * Serialize Cart items into versioned storage payload.
 */
export function serializeCart(items: CartItem[], savedLists?: SavedBasketList[]): string {
  const payload: CartStoragePayload = {
    version: 1,
    items: items.map((i) => ({
      slug: i.slug.trim(),
      quantity: Math.max(1, Math.min(99, i.quantity)),
      addedAt: i.addedAt || Date.now(),
    })),
    savedLists,
  };
  return JSON.stringify(payload);
}

/**
 * Add or increment item quantity in cart.
 */
export function addToCart(current: CartItem[], slug: string, quantity = 1): CartItem[] {
  const cleanSlug = slug.trim();
  const existingIdx = current.findIndex((item) => item.slug === cleanSlug);

  if (existingIdx >= 0) {
    const updated = [...current];
    updated[existingIdx] = {
      ...updated[existingIdx],
      quantity: Math.min(99, updated[existingIdx].quantity + quantity),
    };
    return updated;
  }

  return [{ slug: cleanSlug, quantity: Math.min(99, Math.max(1, quantity)), addedAt: Date.now() }, ...current];
}

/**
 * Update quantity of a cart item, or remove if quantity <= 0.
 */
export function updateCartQuantity(current: CartItem[], slug: string, quantity: number): CartItem[] {
  const cleanSlug = slug.trim();
  if (quantity <= 0) {
    return current.filter((item) => item.slug !== cleanSlug);
  }

  return current.map((item) =>
    item.slug === cleanSlug ? { ...item, quantity: Math.min(99, quantity) } : item
  );
}

/**
 * Remove an item completely from cart.
 */
export function removeFromCart(current: CartItem[], slug: string): CartItem[] {
  const cleanSlug = slug.trim();
  return current.filter((item) => item.slug !== cleanSlug);
}

/**
 * Compute comprehensive basket totals, calorie-weighted FBS, and value intelligence.
 */
export function computeBasketSummary(cartItems: CartItem[], allProducts: Product[]): BasketSummary {
  const productMap = new Map<string, Product>();
  for (const p of allProducts) {
    productMap.set(p.slug, p);
  }

  const computedItems: CartItemComputed[] = [];
  let totalPacks = 0;
  let totalPriceINR = 0;
  let totalCaloriesKcal = 0;
  let totalProteinG = 0;
  let totalFibreG = 0;
  let totalSugarG = 0;
  let totalAddedSugarG = 0;
  let totalSodiumMg = 0;
  let totalWeightG = 0;

  // Calorie-weighted score accumulator
  let weightedFBSNumerator = 0;
  let weightedFBSDenominator = 0;

  // Gram-weight fallback accumulator
  let weightFBSNumerator = 0;
  let weightFBSDenominator = 0;

  const categoryCounts: Record<string, number> = {};
  const draggingDownItems: Array<{ product: Product; score: number; reason: string }> = [];

  let bestItem: { product: Product; score: number } | null = null;
  let worstItem: { product: Product; score: number } | null = null;

  for (const item of cartItems) {
    const product = productMap.get(item.slug);
    if (!product) continue;

    const qty = item.quantity;
    totalPacks += qty;

    const packWeightG = product.packSizeG && product.packSizeG > 0 ? product.packSizeG : 100;
    const itemWeightG = packWeightG * qty;
    totalWeightG += itemWeightG;

    const ratio = itemWeightG / 100;

    const itemPrice = product.priceINR !== null ? product.priceINR * qty : null;
    if (itemPrice !== null) totalPriceINR += itemPrice;

    const itemCal = (product.per100g.energyKcal || 0) * ratio;
    const itemProt = (product.per100g.proteinG || 0) * ratio;
    const itemFibre = (product.per100g.fibreG || 0) * ratio;
    const itemSugar = (product.per100g.totalSugarG || 0) * ratio;
    const itemAddedSugar = (product.per100g.addedSugarG || 0) * ratio;
    const itemSodium = (product.per100g.sodiumMg || 0) * ratio;

    totalCaloriesKcal += itemCal;
    totalProteinG += itemProt;
    totalFibreG += itemFibre;
    totalSugarG += itemSugar;
    totalAddedSugarG += itemAddedSugar;
    totalSodiumMg += itemSodium;

    // Category mix
    const cat = product.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + qty;

    // Track Best & Worst items by FBS
    const score = product.fbs.score;
    if (score !== null) {
      if (!bestItem || score > bestItem.score) {
        bestItem = { product, score };
      }
      if (!worstItem || score < worstItem.score) {
        worstItem = { product, score };
      }

      // Dragging down detection: score < 5.0 or high added sugar
      if (score < 5.0) {
        draggingDownItems.push({
          product,
          score,
          reason: `Low FBS score of ${score.toFixed(1)}/10 contributes high processing/sugar load.`,
        });
      } else if (product.per100g.addedSugarG && product.per100g.addedSugarG > 20) {
        draggingDownItems.push({
          product,
          score,
          reason: `High added sugar (${product.per100g.addedSugarG}g/100g) increases basket free sugar.`,
        });
      }

      // Calorie weighting
      if (itemCal > 0) {
        weightedFBSNumerator += score * itemCal;
        weightedFBSDenominator += itemCal;
      }

      // Weight in grams fallback
      weightFBSNumerator += score * itemWeightG;
      weightFBSDenominator += itemWeightG;
    }

    computedItems.push({
      product,
      quantity: qty,
      packWeightG,
      totalWeightG: itemWeightG,
      itemTotalPrice: itemPrice,
      itemTotalCalories: Math.round(itemCal),
      itemTotalProteinG: Number(itemProt.toFixed(1)),
      itemTotalSugarG: Number(itemSugar.toFixed(1)),
      itemTotalAddedSugarG: Number(itemAddedSugar.toFixed(1)),
      itemTotalSodiumMg: Math.round(itemSodium),
      itemTotalFibreG: Number(itemFibre.toFixed(1)),
    });
  }

  // Calculate Basket FBS
  let basketFBS: number | null = null;
  let weightingBasis: 'calories' | 'weight' | 'none' = 'none';

  if (weightedFBSDenominator > 0) {
    basketFBS = Number((weightedFBSNumerator / weightedFBSDenominator).toFixed(1));
    weightingBasis = 'calories';
  } else if (weightFBSDenominator > 0) {
    basketFBS = Number((weightFBSNumerator / weightFBSDenominator).toFixed(1));
    weightingBasis = 'weight';
  }

  // Nutrition Per ₹10 for the basket
  let proteinPer10INR: number | null = null;
  let fibrePer10INR: number | null = null;
  if (totalPriceINR > 0) {
    proteinPer10INR = Number(((totalProteinG / totalPriceINR) * 10).toFixed(1));
    fibrePer10INR = Number(((totalFibreG / totalPriceINR) * 10).toFixed(1));
  }

  // Category mix array with percentages
  const categoryMix = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: totalPacks > 0 ? Math.round((count / totalPacks) * 100) : 0,
  })).sort((a, b) => b.count - a.count);

  return {
    items: computedItems,
    totalPacks,
    uniqueCount: computedItems.length,
    totalPriceINR: Math.round(totalPriceINR),
    totalCaloriesKcal: Math.round(totalCaloriesKcal),
    totalProteinG: Number(totalProteinG.toFixed(1)),
    totalFibreG: Number(totalFibreG.toFixed(1)),
    totalSugarG: Number(totalSugarG.toFixed(1)),
    totalAddedSugarG: Number(totalAddedSugarG.toFixed(1)),
    totalSodiumMg: Math.round(totalSodiumMg),
    basketFBS,
    weightingBasis,
    proteinPer10INR,
    fibrePer10INR,
    categoryMix,
    bestItem,
    worstItem,
    draggingDownItems,
  };
}

/**
 * Deterministically compute Smart Swaps for items in the basket that can elevate the basket FBS.
 */
export function computeBasketSwaps(cartItems: CartItem[], allProducts: Product[]): BasketSwapSuggestion[] {
  const currentSummary = computeBasketSummary(cartItems, allProducts);
  const currentFBS = currentSummary.basketFBS ?? 5.0;

  const suggestions: BasketSwapSuggestion[] = [];

  for (const item of cartItems) {
    const product = allProducts.find((p) => p.slug === item.slug);
    if (!product || product.fbs.score === null) continue;

    // Only look for alternatives if score < 8.0 or if it's below basket average
    if (product.fbs.score >= 8.5) continue;

    const res = findAlternatives(product, allProducts, { mode: 'overall', limit: 3 });
    const bestAlt = res.suggestions.find(
      (alt: AlternativeSuggestion) =>
        !cartItems.some((ci) => ci.slug === alt.product.slug) &&
        alt.delta.fbs !== null &&
        alt.delta.fbs >= 0.5
    );

    if (bestAlt) {
      // Simulate basket with this single item swapped
      const simulatedCart = applyCartSwap(cartItems, item.slug, bestAlt.product.slug);
      const simulatedSummary = computeBasketSummary(simulatedCart, allProducts);
      const projectedFBS = simulatedSummary.basketFBS ?? currentFBS;
      const deltaBasket = Number((projectedFBS - currentFBS).toFixed(1));

      const priceDiff = (bestAlt.product.priceINR || 0) - (product.priceINR || 0);
      const sugarDiff = (bestAlt.product.per100g.totalSugarG || 0) - (product.per100g.totalSugarG || 0);
      const proteinDiff = (bestAlt.product.per100g.proteinG || 0) - (product.per100g.proteinG || 0);

      suggestions.push({
        originalProduct: product,
        suggestedProduct: bestAlt.product,
        currentBasketFBS: currentFBS,
        projectedBasketFBS: projectedFBS,
        deltaBasketFBS: deltaBasket,
        deltaPriceINR: priceDiff * item.quantity,
        deltaSugarG: Number((sugarDiff * (product.packSizeG || 100) / 100 * item.quantity).toFixed(1)),
        deltaProteinG: Number((proteinDiff * (product.packSizeG || 100) / 100 * item.quantity).toFixed(1)),
        reason: bestAlt.primaryAdvantage,
      });
    }
  }

  // Sort suggestions by biggest positive impact on basket FBS
  return suggestions.sort((a, b) => b.deltaBasketFBS - a.deltaBasketFBS);
}

/**
 * Swap an item in the cart maintaining the same quantity.
 */
export function applyCartSwap(cartItems: CartItem[], fromSlug: string, toSlug: string): CartItem[] {
  const fromIdx = cartItems.findIndex((i) => i.slug === fromSlug);
  if (fromIdx < 0) return cartItems;

  const currentQty = cartItems[fromIdx].quantity;
  const withoutFrom = cartItems.filter((i) => i.slug !== fromSlug);

  const existingToIdx = withoutFrom.findIndex((i) => i.slug === toSlug);
  if (existingToIdx >= 0) {
    const updated = [...withoutFrom];
    updated[existingToIdx] = {
      ...updated[existingToIdx],
      quantity: Math.min(99, updated[existingToIdx].quantity + currentQty),
    };
    return updated;
  }

  return [{ slug: toSlug, quantity: currentQty, addedAt: Date.now() }, ...withoutFrom];
}
