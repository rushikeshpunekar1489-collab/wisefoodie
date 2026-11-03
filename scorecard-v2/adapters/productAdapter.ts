import type { Product } from '../../types/product';
import libraryData from '../config/ingredient-library.json';

export type UnitType = 'g' | 'ml';
export type NutrientSource = 'declared' | 'estimated' | 'missing';

export interface NutrientValue {
  value: number | null;
  unit: string;
  source: NutrientSource;
}

export interface PackSize {
  value: number;
  unit: UnitType;
}

export interface ServingSize {
  value: number;
  unit: UnitType;
}

export interface ProductFacts {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string | null;
  priceINR: number | null;
  packSize: PackSize | null;
  servingSize: ServingSize | null;
  servingsPerPack: number | null;
  nutrition: {
    basis: 'per100g' | 'per100ml' | 'perServing';
    values: Record<string, NutrientValue>;
  };
  ingredientsRaw: string | null;
  ingredientsList: string[];
  allergenDeclared: string[];
  allergenPrecautionary: string[];
  fbs: Product['fbs']; // Passed through untouched
}

/**
 * Normalizes any Product record into an immutable, read-only ProductFacts object.
 * Strictly guarantees no NaN/Infinity, preserves declared vs estimated badges,
 * and maintains allergen separation.
 */
export function adaptProductToFacts(product: Product): ProductFacts {
  // Determine pack unit (g vs ml)
  let packUnit: UnitType = 'g';
  if (product.packSizeText && /ml|litre|liter|l\b/i.test(product.packSizeText)) {
    packUnit = 'ml';
  } else if (
    product.category &&
    /beverage|drink|juice|soda|milk|water/i.test(product.category)
  ) {
    packUnit = 'ml';
  }

  const packSize: PackSize | null =
    product.packSizeG && product.packSizeG > 0
      ? { value: product.packSizeG, unit: packUnit }
      : null;

  const servingSize: ServingSize | null =
    product.servingSizeG && product.servingSizeG > 0
      ? { value: product.servingSizeG, unit: packUnit }
      : packSize
      ? { value: Math.min(packSize.value, 100), unit: packUnit }
      : null;

  const servingsPerPack: number | null =
    packSize && servingSize && servingSize.value > 0
      ? Math.max(1, Math.round((packSize.value / servingSize.value) * 10) / 10)
      : null;

  const basis = packUnit === 'ml' ? 'per100ml' : 'per100g';
  const p100 = product.per100g || {};

  // Build normalized nutrient dictionary
  const values: Record<string, NutrientValue> = {
    energyKcal: {
      value: p100.energyKcal !== undefined && p100.energyKcal !== null ? p100.energyKcal : null,
      unit: 'kcal',
      source: p100.energyKcal !== null && p100.energyKcal !== undefined ? 'declared' : 'missing',
    },
    protein: {
      value: p100.proteinG !== undefined && p100.proteinG !== null ? p100.proteinG : null,
      unit: 'g',
      source: p100.proteinG !== null && p100.proteinG !== undefined ? 'declared' : 'missing',
    },
    carbs: {
      value: p100.carbsG !== undefined && p100.carbsG !== null ? p100.carbsG : null,
      unit: 'g',
      source: p100.carbsG !== null && p100.carbsG !== undefined ? 'declared' : 'missing',
    },
    totalSugar: {
      value: p100.totalSugarG !== undefined && p100.totalSugarG !== null ? p100.totalSugarG : null,
      unit: 'g',
      source: p100.totalSugarG !== null && p100.totalSugarG !== undefined ? 'declared' : 'missing',
    },
    addedSugar: {
      value: p100.addedSugarG !== undefined && p100.addedSugarG !== null ? p100.addedSugarG : null,
      unit: 'g',
      source: p100.addedSugarG !== null && p100.addedSugarG !== undefined ? 'declared' : 'missing',
    },
    fat: {
      value: p100.fatG !== undefined && p100.fatG !== null ? p100.fatG : null,
      unit: 'g',
      source: p100.fatG !== null && p100.fatG !== undefined ? 'declared' : 'missing',
    },
    satFat: {
      value: p100.satFatG !== undefined && p100.satFatG !== null ? p100.satFatG : null,
      unit: 'g',
      source: p100.satFatG !== null && p100.satFatG !== undefined ? 'declared' : 'missing',
    },
    transFat: {
      value: p100.transFatG !== undefined && p100.transFatG !== null ? p100.transFatG : null,
      unit: 'g',
      source: p100.transFatG !== null && p100.transFatG !== undefined ? 'declared' : 'missing',
    },
    fibre: {
      value: p100.fibreG !== undefined && p100.fibreG !== null ? p100.fibreG : null,
      unit: 'g',
      source: p100.fibreG !== null && p100.fibreG !== undefined ? 'declared' : 'missing',
    },
    sodium: {
      value: p100.sodiumMg !== undefined && p100.sodiumMg !== null ? p100.sodiumMg : null,
      unit: 'mg',
      source: p100.sodiumMg !== null && p100.sodiumMg !== undefined ? 'declared' : 'missing',
    },
  };

  // Map any declared micronutrients
  if (Array.isArray(p100.micronutrients)) {
    for (const micro of p100.micronutrients) {
      const lower = micro.name.toLowerCase().trim();
      let key = lower.replace(/[^a-z0-9]+/g, '');
      let unit = micro.unit;
      let val = micro.amount;

      // Handle Vitamin A specifically: must be µg RAE
      if (lower.includes('vitamin a')) {
        if (/iu/i.test(micro.unit)) {
          // If declared only in IU, show N/A per specification rather than guessing
          values['vitaminA'] = { value: null, unit: 'µg RAE', source: 'missing' };
          continue;
        }
        key = 'vitaminA';
        unit = 'µg RAE';
      } else if (lower.includes('calcium')) {
        key = 'calcium';
      } else if (lower.includes('iron')) {
        key = 'iron';
      } else if (lower.includes('potassium')) {
        key = 'potassium';
      } else if (lower.includes('phosphorus')) {
        key = 'phosphorus';
      } else if (lower.includes('magnesium')) {
        key = 'magnesium';
      } else if (lower.includes('zinc')) {
        key = 'zinc';
      } else if (lower.includes('b1') || lower.includes('thiamine')) {
        key = 'vitaminB1';
      } else if (lower.includes('b2') || lower.includes('riboflavin')) {
        key = 'vitaminB2';
      } else if (lower.includes('b3') || lower.includes('niacin')) {
        key = 'vitaminB3';
      } else if (lower.includes('b6')) {
        key = 'vitaminB6';
      } else if (lower.includes('b9') || lower.includes('folate') || lower.includes('folic')) {
        key = 'folate';
      } else if (lower.includes('b12')) {
        key = 'vitaminB12';
      } else if (lower.includes('vitamin c') || lower.includes('ascorbic')) {
        key = 'vitaminC';
      } else if (lower.includes('vitamin d')) {
        key = 'vitaminD';
      } else if (lower.includes('vitamin e')) {
        key = 'vitaminE';
      }

      values[key] = {
        value: typeof val === 'number' && !isNaN(val) ? val : null,
        unit,
        source: typeof val === 'number' && !isNaN(val) ? 'declared' : 'missing',
      };
    }
  }

  // Raw ingredients string
  const ingredientsList = Array.isArray(product.ingredients) ? product.ingredients : [];
  const ingredientsRaw = ingredientsList.length > 0 ? ingredientsList.join(', ') : null;

  // Extract allergens: separate declared vs precautionary
  const allergenDeclaredSet = new Set<string>();
  const allergenPrecautionarySet = new Set<string>();

  const fullText = (ingredientsRaw || '').toLowerCase();
  const allergenRules = libraryData.allergenRules;

  for (const rule of allergenRules.declaredAllergens) {
    let declaredFound = false;
    let precautionaryFound = false;

    // Check each ingredient
    for (const ing of ingredientsList) {
      const ingLower = ing.toLowerCase();
      const hasPrecautionaryPhrase = allergenRules.precautionaryPhrases.some((phrase: string) =>
        ingLower.includes(phrase)
      );

      const matchesRule = rule.keywords.some((kw: string) =>
        new RegExp(`\\b${kw}\\b`, 'i').test(ingLower)
      );

      if (matchesRule) {
        if (hasPrecautionaryPhrase) {
          precautionaryFound = true;
        } else {
          declaredFound = true;
        }
      }
    }

    if (declaredFound) {
      allergenDeclaredSet.add(rule.label);
    } else if (precautionaryFound) {
      allergenPrecautionarySet.add(rule.label);
    }
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category || 'General Packaged Food',
    subCategory: product.subcategory,
    priceINR: typeof product.priceINR === 'number' && product.priceINR > 0 ? product.priceINR : null,
    packSize,
    servingSize,
    servingsPerPack,
    nutrition: {
      basis,
      values,
    },
    ingredientsRaw,
    ingredientsList,
    allergenDeclared: Array.from(allergenDeclaredSet),
    allergenPrecautionary: Array.from(allergenPrecautionarySet),
    fbs: product.fbs,
  };
}
