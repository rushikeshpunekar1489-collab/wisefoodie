import type { ProductPer100g } from '../types/product';

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner';
export type PortionType = 'grams' | 'servings' | 'pack';
export type SimpleGoal = 'balanced' | 'more_protein' | 'less_sugar' | 'less_sodium';

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealSlot: MealSlot;
  slug: string;
  name: string;
  brand: string;
  portionType: PortionType;
  portionValue: number;
  gramsConsumed: number;
  per100g: ProductPer100g;
  image?: string | null;
  addedAt: number;
}

export interface DiaryState {
  version: 1;
  entries: DiaryEntry[];
  goal: SimpleGoal;
}

export const DIARY_STORAGE_KEY = 'wf_diary_v1';

/**
 * Standard adult reference values based on ICMR-NIN (National Institute of Nutrition, India)
 * Recommended Dietary Allowances (RDA) 2020 guidelines for sedentary-to-moderate Indian adults.
 * Used for informational comparison ("contribution vs reference value"), never medical advice.
 */
export const ICMR_NIN_REFERENCE = {
  energyKcal: 2000,
  proteinG: 54, // ~0.83g/kg standard adult
  addedSugarLimitG: 25, // WHO & ICMR upper recommendation (<5-10% energy)
  totalSugarLimitG: 50,
  fibreG: 30, // ICMR recommended daily fibre
  sodiumLimitMg: 2000, // WHO & ICMR upper reference limit
  satFatLimitG: 20,
  fatG: 65,
  carbsG: 275,
};

export const GOAL_TARGETS: Record<SimpleGoal, typeof ICMR_NIN_REFERENCE> = {
  balanced: { ...ICMR_NIN_REFERENCE },
  more_protein: { ...ICMR_NIN_REFERENCE, proteinG: 75 },
  less_sugar: { ...ICMR_NIN_REFERENCE, addedSugarLimitG: 20, totalSugarLimitG: 40 },
  less_sodium: { ...ICMR_NIN_REFERENCE, sodiumLimitMg: 1500 },
};

/**
 * Calculate actual grams consumed based on portion selection
 */
export function calculateGrams(
  portionType: PortionType,
  portionValue: number,
  servingSizeG: number | null | undefined,
  packSizeG: number | null | undefined
): number {
  const count = Math.max(0.1, Number(portionValue) || 1);
  if (portionType === 'grams') {
    return Math.round(count);
  }
  if (portionType === 'servings') {
    const serving = servingSizeG && servingSizeG > 0 ? servingSizeG : 50;
    return Math.round(count * serving);
  }
  if (portionType === 'pack') {
    const pack = packSizeG && packSizeG > 0 ? packSizeG : 100;
    return Math.round(count * pack);
  }
  return 100;
}

export interface ScaledNutrients {
  energyKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  totalSugarG: number | null;
  addedSugarG: number | null;
  fatG: number | null;
  satFatG: number | null;
  fibreG: number | null;
  sodiumMg: number | null;
}

export function calculateEntryNutrients(entry: DiaryEntry): ScaledNutrients {
  const ratio = entry.gramsConsumed / 100;
  const p = entry.per100g;

  return {
    energyKcal: p.energyKcal != null ? Math.round(p.energyKcal * ratio) : null,
    proteinG: p.proteinG != null ? Number((p.proteinG * ratio).toFixed(1)) : null,
    carbsG: p.carbsG != null ? Number((p.carbsG * ratio).toFixed(1)) : null,
    totalSugarG: p.totalSugarG != null ? Number((p.totalSugarG * ratio).toFixed(1)) : null,
    addedSugarG: p.addedSugarG != null ? Number((p.addedSugarG * ratio).toFixed(1)) : null,
    fatG: p.fatG != null ? Number((p.fatG * ratio).toFixed(1)) : null,
    satFatG: p.satFatG != null ? Number((p.satFatG * ratio).toFixed(1)) : null,
    fibreG: p.fibreG != null ? Number((p.fibreG * ratio).toFixed(1)) : null,
    sodiumMg: p.sodiumMg != null ? Math.round(p.sodiumMg * ratio) : null,
  };
}

export interface DaySummary {
  date: string;
  itemCount: number;
  totals: {
    energyKcal: number;
    proteinG: number;
    carbsG: number;
    totalSugarG: number;
    addedSugarG: number;
    fatG: number;
    satFatG: number;
    fibreG: number;
    sodiumMg: number;
  };
  missingCounts: {
    energyKcal: number;
    proteinG: number;
    carbsG: number;
    totalSugarG: number;
    addedSugarG: number;
    fatG: number;
    satFatG: number;
    fibreG: number;
    sodiumMg: number;
  };
  percentagesOfReference: {
    energy: number;
    protein: number;
    addedSugar: number;
    fibre: number;
    sodium: number;
  };
  hasIncompleteNutrients: boolean;
  mealBreakdown: Record<MealSlot, { energyKcal: number; proteinG: number; count: number }>;
}

export function aggregateDayNutrients(entries: DiaryEntry[], goal: SimpleGoal = 'balanced'): DaySummary {
  const ref = GOAL_TARGETS[goal] || ICMR_NIN_REFERENCE;

  const totals = {
    energyKcal: 0,
    proteinG: 0,
    carbsG: 0,
    totalSugarG: 0,
    addedSugarG: 0,
    fatG: 0,
    satFatG: 0,
    fibreG: 0,
    sodiumMg: 0,
  };

  const missingCounts = {
    energyKcal: 0,
    proteinG: 0,
    carbsG: 0,
    totalSugarG: 0,
    addedSugarG: 0,
    fatG: 0,
    satFatG: 0,
    fibreG: 0,
    sodiumMg: 0,
  };

  const mealBreakdown: Record<MealSlot, { energyKcal: number; proteinG: number; count: number }> = {
    breakfast: { energyKcal: 0, proteinG: 0, count: 0 },
    lunch: { energyKcal: 0, proteinG: 0, count: 0 },
    snack: { energyKcal: 0, proteinG: 0, count: 0 },
    dinner: { energyKcal: 0, proteinG: 0, count: 0 },
  };

  for (const entry of entries) {
    const n = calculateEntryNutrients(entry);

    if (n.energyKcal != null) {
      totals.energyKcal += n.energyKcal;
      mealBreakdown[entry.mealSlot].energyKcal += n.energyKcal;
    } else {
      missingCounts.energyKcal++;
    }

    if (n.proteinG != null) {
      totals.proteinG += n.proteinG;
      mealBreakdown[entry.mealSlot].proteinG += n.proteinG;
    } else {
      missingCounts.proteinG++;
    }

    if (n.carbsG != null) totals.carbsG += n.carbsG; else missingCounts.carbsG++;
    if (n.totalSugarG != null) totals.totalSugarG += n.totalSugarG; else missingCounts.totalSugarG++;
    if (n.addedSugarG != null) totals.addedSugarG += n.addedSugarG; else missingCounts.addedSugarG++;
    if (n.fatG != null) totals.fatG += n.fatG; else missingCounts.fatG++;
    if (n.satFatG != null) totals.satFatG += n.satFatG; else missingCounts.satFatG++;
    if (n.fibreG != null) totals.fibreG += n.fibreG; else missingCounts.fibreG++;
    if (n.sodiumMg != null) totals.sodiumMg += n.sodiumMg; else missingCounts.sodiumMg++;

    mealBreakdown[entry.mealSlot].count++;
  }

  // Round results neatly
  totals.energyKcal = Math.round(totals.energyKcal);
  totals.proteinG = Number(totals.proteinG.toFixed(1));
  totals.carbsG = Number(totals.carbsG.toFixed(1));
  totals.totalSugarG = Number(totals.totalSugarG.toFixed(1));
  totals.addedSugarG = Number(totals.addedSugarG.toFixed(1));
  totals.fatG = Number(totals.fatG.toFixed(1));
  totals.satFatG = Number(totals.satFatG.toFixed(1));
  totals.fibreG = Number(totals.fibreG.toFixed(1));
  totals.sodiumMg = Math.round(totals.sodiumMg);

  const hasIncompleteNutrients = Object.values(missingCounts).some((c) => c > 0);

  const percentagesOfReference = {
    energy: Math.min(250, Math.round((totals.energyKcal / ref.energyKcal) * 100)),
    protein: Math.min(250, Math.round((totals.proteinG / ref.proteinG) * 100)),
    addedSugar: Math.min(250, Math.round((totals.addedSugarG / ref.addedSugarLimitG) * 100)),
    fibre: Math.min(250, Math.round((totals.fibreG / ref.fibreG) * 100)),
    sodium: Math.min(250, Math.round((totals.sodiumMg / ref.sodiumLimitMg) * 100)),
  };

  return {
    date: entries[0]?.date || new Date().toISOString().split('T')[0],
    itemCount: entries.length,
    totals,
    missingCounts,
    percentagesOfReference,
    hasIncompleteNutrients,
    mealBreakdown,
  };
}

export interface InsightNudge {
  id: string;
  type: 'protein' | 'sugar' | 'sodium' | 'fibre' | 'balanced';
  title: string;
  message: string;
  recommendationLink?: string;
  ctaText?: string;
}

export function generateInsightNudges(day: DaySummary): InsightNudge[] {
  const nudges: InsightNudge[] = [];

  if (day.itemCount === 0) {
    return [
      {
        id: 'empty',
        type: 'balanced',
        title: 'Aaj kya khaya?',
        message: 'Add foods from your meals to check how your day compares to reference values.',
        recommendationLink: '/explore',
        ctaText: 'Explore Foods',
      },
    ];
  }

  // Protein nudge
  if (day.percentagesOfReference.protein < 50) {
    nudges.push({
      id: 'protein_low',
      type: 'protein',
      title: `Protein is ${day.percentagesOfReference.protein}% of reference so far`,
      message: 'A high-protein dairy or snack option can help boost your intake for muscle vitality.',
      recommendationLink: '/explore?q=high+protein',
      ctaText: 'View High Protein Options',
    });
  }

  // Added sugar alert
  if (day.percentagesOfReference.addedSugar > 80) {
    nudges.push({
      id: 'sugar_high',
      type: 'sugar',
      title: `Added sugar reached ${day.percentagesOfReference.addedSugar}% of reference limit`,
      message: 'You are close to the daily 25g reference limit. Consider choosing zero-added-sugar drinks or whole grain snacks.',
      recommendationLink: '/explore?q=no+added+sugar',
      ctaText: 'Zero Added Sugar Swaps',
    });
  }

  // Fibre nudge
  if (day.percentagesOfReference.fibre < 40) {
    nudges.push({
      id: 'fibre_low',
      type: 'fibre',
      title: `Dietary fibre is ${day.percentagesOfReference.fibre}% of recommendation`,
      message: 'Whole grain oats, muesli, or high-fibre biscuits can help support digestion.',
      recommendationLink: '/explore?q=whole+grain',
      ctaText: 'Explore Fibre Rich Foods',
    });
  }

  // Sodium warning
  if (day.percentagesOfReference.sodium > 85) {
    nudges.push({
      id: 'sodium_high',
      type: 'sodium',
      title: `Sodium reached ${day.percentagesOfReference.sodium}% of reference limit`,
      message: 'Packaged noodles and salted namkeens contribute significant sodium. Check labels for low-sodium choices.',
      recommendationLink: '/explore?q=low+sodium',
      ctaText: 'Check Low Sodium Foods',
    });
  }

  if (nudges.length === 0) {
    nudges.push({
      id: 'well_balanced',
      type: 'balanced',
      title: 'Balanced nutrition day!',
      message: 'Your meals today sit comfortably within healthy reference boundaries.',
    });
  }

  return nudges;
}

/**
 * Calculate active food logging streak in days up to target date
 */
export function calculateStreak(entries: DiaryEntry[], currentDate: string): number {
  if (!entries || entries.length === 0) return 0;

  const datesWithLogs = new Set(entries.map((e) => e.date));
  let streak = 0;
  const current = new Date(currentDate);

  // Check up to 365 consecutive days back
  for (let i = 0; i < 365; i++) {
    const d = new Date(current);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    if (datesWithLogs.has(dateStr)) {
      streak++;
    } else {
      // If today is empty, check if yesterday was logged to preserve streak
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}

/**
 * Export entries as CSV for local user data freedom
 */
export function exportDiaryToCSV(entries: DiaryEntry[]): string {
  const headers = [
    'Date',
    'Meal Slot',
    'Product Name',
    'Brand',
    'Portion Type',
    'Portion Value',
    'Grams Consumed',
    'Energy (kcal)',
    'Protein (g)',
    'Carbs (g)',
    'Total Sugar (g)',
    'Added Sugar (g)',
    'Fat (g)',
    'Fibre (g)',
    'Sodium (mg)',
  ];

  const rows = entries.map((e) => {
    const n = calculateEntryNutrients(e);
    return [
      e.date,
      e.mealSlot,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.brand.replace(/"/g, '""')}"`,
      e.portionType,
      e.portionValue,
      e.gramsConsumed,
      n.energyKcal ?? '',
      n.proteinG ?? '',
      n.carbsG ?? '',
      n.totalSugarG ?? '',
      n.addedSugarG ?? '',
      n.fatG ?? '',
      n.fibreG ?? '',
      n.sodiumMg ?? '',
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Migration-safe local-first state parsing
 */
export function parseDiaryState(raw: string | null): DiaryState {
  if (!raw) {
    return { version: 1, entries: [], goal: 'balanced' };
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.entries)) {
      return {
        version: 1,
        entries: parsed.entries.filter((e: any) => e && e.id && e.date && e.slug),
        goal: parsed.goal || 'balanced',
      };
    }
  } catch (e) {}
  return { version: 1, entries: [], goal: 'balanced' };
}

export function serializeDiaryState(state: DiaryState): string {
  return JSON.stringify(state);
}
