import type { Product } from '@/types/product';

export type AlternativeMode =
  | 'overall'
  | 'fbs'
  | 'sugar'
  | 'protein'
  | 'sodium'
  | 'cheaper'
  | 'value';

export interface AlternativeDelta {
  fbs: number | null;
  sugarG: number | null;
  proteinG: number | null;
  sodiumMg: number | null;
  priceINR: number | null;
}

export interface AlternativeSuggestion {
  product: Product;
  delta: AlternativeDelta;
  reasons: string[];
  primaryAdvantage: string;
  isSameSubcategory: boolean;
}

export interface AlternativesResult {
  target: Product;
  mode: AlternativeMode;
  isTargetTopTier: boolean;
  statusMessage: string;
  suggestions: AlternativeSuggestion[];
}

export interface FindAlternativesOptions {
  mode?: AlternativeMode;
  maxPriceMultiplier?: number;
  limit?: number;
  sameSubcategoryOnly?: boolean;
}

/**
 * Pure function to find and rank better alternatives for a given product.
 * Returns measured deltas and plain explanations grounded in verifiable label data.
 */
export function findAlternatives(
  target: Product,
  allProducts: Product[],
  options: FindAlternativesOptions = {}
): AlternativesResult {
  const mode = options.mode || 'overall';
  const maxPriceMultiplier = options.maxPriceMultiplier ?? 1.30;
  const limit = options.limit ?? 6;

  if (!target || !allProducts || allProducts.length === 0) {
    return {
      target,
      mode,
      isTargetTopTier: false,
      statusMessage: 'No product catalog available for comparison.',
      suggestions: [],
    };
  }

  // 1. Filter to candidates in same category, excluding the target itself
  const candidates = allProducts.filter((p) => {
    if (p.slug === target.slug || p.id === target.id) return false;
    if (p.category && target.category && p.category !== target.category) return false;
    return true;
  });

  if (candidates.length === 0) {
    return {
      target,
      mode,
      isTargetTopTier: true,
      statusMessage: `No other products currently in the ${target.category || 'category'} aisle.`,
      suggestions: [],
    };
  }

  const targetFBS = target.fbs?.score ?? null;
  const targetPrice = target.priceINR ?? null;
  const targetPack = target.packSizeG ?? null;
  const targetSugar = target.per100g?.totalSugarG ?? null;
  const targetProtein = target.per100g?.proteinG ?? null;
  const targetSodium = target.per100g?.sodiumMg ?? null;

  // Check if target is already top-tier in category
  const categoryMaxFBS = Math.max(
    targetFBS ?? 0,
    ...candidates.map((c) => c.fbs?.score ?? 0)
  );
  const isTopInFBS = targetFBS !== null && targetFBS >= categoryMaxFBS - 0.2;

  // 2. Score and rank candidates based on mode
  interface RankedCandidate {
    product: Product;
    score: number;
    delta: AlternativeDelta;
    reasons: string[];
    primaryAdvantage: string;
    isSameSubcategory: boolean;
  }

  const ranked: RankedCandidate[] = [];

  for (const candidate of candidates) {
    const candFBS = candidate.fbs?.score ?? null;
    const candPrice = candidate.priceINR ?? null;
    const candPack = candidate.packSizeG ?? null;
    const candSugar = candidate.per100g?.totalSugarG ?? null;
    const candProtein = candidate.per100g?.proteinG ?? null;
    const candSodium = candidate.per100g?.sodiumMg ?? null;

    // Pack size class filtering: Avoid comparing 20g snack to 5kg sack
    if (targetPack && candPack) {
      if (candPack > targetPack * 4.0 || candPack < targetPack * 0.25) {
        continue;
      }
    }

    const isSameSubcategory =
      Boolean(target.subcategory && candidate.subcategory && target.subcategory === candidate.subcategory);

    // Compute measured deltas
    const delta: AlternativeDelta = {
      fbs: targetFBS !== null && candFBS !== null ? Number((candFBS - targetFBS).toFixed(1)) : null,
      sugarG: targetSugar !== null && candSugar !== null ? Number((candSugar - targetSugar).toFixed(1)) : null,
      proteinG: targetProtein !== null && candProtein !== null ? Number((candProtein - targetProtein).toFixed(1)) : null,
      sodiumMg: targetSodium !== null && candSodium !== null ? Math.round(candSodium - targetSodium) : null,
      priceINR: targetPrice !== null && candPrice !== null ? Math.round(candPrice - targetPrice) : null,
    };

    const reasons: string[] = [];

    // Delta explanation strings
    if (delta.fbs !== null && delta.fbs > 0) {
      reasons.push(`+${delta.fbs} higher FBS vitality`);
    } else if (delta.fbs !== null && delta.fbs < 0) {
      reasons.push(`${delta.fbs} FBS`);
    }

    if (delta.sugarG !== null && delta.sugarG < 0) {
      reasons.push(`${Math.abs(delta.sugarG)}g less sugar / 100g`);
    }

    if (delta.proteinG !== null && delta.proteinG > 0) {
      reasons.push(`+${delta.proteinG}g more protein / 100g`);
    }

    if (delta.sodiumMg !== null && delta.sodiumMg < 0) {
      reasons.push(`${Math.abs(delta.sodiumMg)}mg lower sodium`);
    }

    if (delta.priceINR !== null) {
      if (delta.priceINR < 0) {
        reasons.push(`₹${Math.abs(delta.priceINR)} cheaper`);
      } else if (delta.priceINR === 0) {
        reasons.push(`Same price (₹${candPrice})`);
      } else if (delta.priceINR > 0) {
        reasons.push(`+₹${delta.priceINR}`);
      }
    }

    if (isSameSubcategory) {
      reasons.push('Same product type');
    }

    // Primary advantage headline
    let primaryAdvantage = 'Balanced alternative';
    if (delta.fbs !== null && delta.fbs >= 1.0) {
      primaryAdvantage = `+${delta.fbs} FBS Vitality Upgrade`;
    } else if (delta.sugarG !== null && delta.sugarG <= -5.0) {
      primaryAdvantage = `${Math.abs(delta.sugarG)}g Lower Sugar Swap`;
    } else if (delta.proteinG !== null && delta.proteinG >= 3.0) {
      primaryAdvantage = `+${delta.proteinG}g High Protein Choice`;
    } else if (delta.priceINR !== null && delta.priceINR <= -10) {
      primaryAdvantage = `₹${Math.abs(delta.priceINR)} Wallet Saver`;
    } else if (delta.sodiumMg !== null && delta.sodiumMg <= -200) {
      primaryAdvantage = `${Math.abs(delta.sodiumMg)}mg Lower Sodium`;
    }

    // Determine eligibility and ranking score per mode
    let score = 0;
    let eligible = true;

    if (mode === 'overall') {
      // Price ceiling constraint: not more than +30%
      if (targetPrice && candPrice && candPrice > targetPrice * maxPriceMultiplier) {
        eligible = false;
      }
      const fbsGain = delta.fbs ?? 0;
      const sugarSaving = -(delta.sugarG ?? 0);
      const proteinGain = delta.proteinG ?? 0;
      const pricePenalty = (delta.priceINR ?? 0) > 0 ? (delta.priceINR ?? 0) * 0.05 : -(delta.priceINR ?? 0) * 0.05;

      score = fbsGain * 2.0 + (sugarSaving / 5.0) + (proteinGain / 3.0) + (isSameSubcategory ? 1.0 : 0) - pricePenalty;
      // In overall mode, prefer items that are actually better or equal
      if (fbsGain < -0.5 && !isTopInFBS) {
        eligible = false;
      }
    } else if (mode === 'fbs') {
      score = (candFBS ?? 0) + (isSameSubcategory ? 0.3 : 0);
    } else if (mode === 'sugar') {
      // Lower sugar gets higher score
      score = -(candSugar ?? 999) + (isSameSubcategory ? 1.0 : 0);
    } else if (mode === 'protein') {
      score = (candProtein ?? 0) + (isSameSubcategory ? 1.0 : 0);
    } else if (mode === 'sodium') {
      score = -(candSodium ?? 9999) + (isSameSubcategory ? 10 : 0);
    } else if (mode === 'cheaper') {
      if (targetPrice && candPrice && candPrice >= targetPrice) {
        eligible = false;
      }
      score = -(candPrice ?? 999) + (candFBS ?? 0);
    } else if (mode === 'value') {
      const pPerRupee = candidate.nutritionPerPaisa?.proteinPerRupee ?? 0;
      score = pPerRupee * 10 + (candFBS ?? 0);
    }

    if (eligible) {
      ranked.push({
        product: candidate,
        score,
        delta,
        reasons,
        primaryAdvantage,
        isSameSubcategory,
      });
    }
  }

  // Sort descending by calculated score
  ranked.sort((a, b) => b.score - a.score);

  const topSuggestions = ranked.slice(0, limit).map((r) => ({
    product: r.product,
    delta: r.delta,
    reasons: r.reasons,
    primaryAdvantage: r.primaryAdvantage,
    isSameSubcategory: r.isSameSubcategory,
  }));

  let statusMessage = `Showing smarter alternatives in ${target.category || 'this category'}.`;
  if (isTopInFBS && mode === 'overall') {
    statusMessage = 'Already one of the best choices in this category! Here are top-rated peers.';
  } else if (topSuggestions.length === 0) {
    statusMessage = 'No strict alternatives matched criteria; showing similar items in this aisle.';
  }

  return {
    target,
    mode,
    isTargetTopTier: isTopInFBS,
    statusMessage,
    suggestions: topSuggestions,
  };
}
