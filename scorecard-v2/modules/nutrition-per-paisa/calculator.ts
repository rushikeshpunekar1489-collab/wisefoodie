import type { ProductFacts, UnitType } from '../../adapters/productAdapter';
import type { NutrientCostRow, NutritionPerPaisaAnalysis, BestValueHighlight } from './types';
import nutrientUnitsConfig from '../../config/nutrient-units.json';

/**
 * Pure calculation function for single nutrient cost.
 * formula: cost = (price * targetQty) / totalNutrientInPack
 */
export function calculateNutrientCost(
  priceINR: number,
  packSizeValue: number,
  amountIn100g: number,
  targetQty: number
): number | null {
  if (
    typeof priceINR !== 'number' ||
    priceINR <= 0 ||
    typeof packSizeValue !== 'number' ||
    packSizeValue <= 0 ||
    typeof amountIn100g !== 'number' ||
    amountIn100g <= 0 ||
    typeof targetQty !== 'number' ||
    targetQty <= 0
  ) {
    return null;
  }

  const totalNutrientInPack = (amountIn100g * packSizeValue) / 100;
  if (totalNutrientInPack <= 0) return null;

  const cost = (priceINR * targetQty) / totalNutrientInPack;
  return isFinite(cost) ? Math.round(cost * 100) / 100 : null;
}

export function formatINR(val: number | null): string {
  if (val === null || isNaN(val)) return 'N/A';
  if (val < 0.01 && val > 0) return '< ₹0.01';
  return `₹${val.toFixed(2)}`;
}

export function evaluateNutritionPerPaisa(facts: ProductFacts): NutritionPerPaisaAnalysis {
  const price = facts.priceINR;
  const packSize = facts.packSize;

  if (!price || !packSize || packSize.value <= 0) {
    return {
      isAvailable: false,
      priceINR: price,
      packSizeValue: packSize?.value ?? null,
      packSizeUnit: packSize?.unit ?? 'g',
      declaredRows: [],
      missingRows: [],
      bestValue: null,
      qualityChips: [],
      proteinQualityNote: null,
      micronutrientNote: 'Price or pack weight awaiting verified package confirmation.',
      disclaimer: 'Cost calculated deterministically per verified packaging declarations.',
    };
  }

  const packRatio = packSize.value / 100;
  const declaredRows: NutrientCostRow[] = [];
  const missingRows: NutrientCostRow[] = [];

  const configNutrients = nutrientUnitsConfig.nutrients as Array<{
    key: string;
    name: string;
    group: 'Macros' | 'Minerals' | 'Vitamins';
    targetQty: number;
    targetUnit: string;
    standardUnit: string;
    multiplierFromStandard: number;
    bioavailabilityNote: string;
  }>;

  for (const item of configNutrients) {
    const declaredEntry = facts.nutrition.values[item.key];
    const amountIn100g = declaredEntry?.value ?? null;
    const source = declaredEntry?.source ?? 'missing';

    if (amountIn100g !== null && amountIn100g > 0) {
      const totalInPack = Math.round(amountIn100g * packRatio * 100) / 100;
      const costINR = calculateNutrientCost(price, packSize.value, amountIn100g, item.targetQty);

      declaredRows.push({
        key: item.key,
        name: item.name,
        group: item.group,
        targetQty: item.targetQty,
        targetUnit: item.targetUnit,
        amountIn100g,
        totalInPack,
        costINR,
        formattedCost: formatINR(costINR),
        source,
        bioavailabilityNote: item.bioavailabilityNote,
      });
    } else {
      missingRows.push({
        key: item.key,
        name: item.name,
        group: item.group,
        targetQty: item.targetQty,
        targetUnit: item.targetUnit,
        amountIn100g: null,
        totalInPack: null,
        costINR: null,
        formattedCost: 'N/A',
        source: 'missing',
        bioavailabilityNote: item.bioavailabilityNote,
      });
    }
  }

  // Best-value nutrient in this product
  let bestValue: BestValueHighlight | null = null;
  const validDeclared = declaredRows.filter((r) => r.costINR !== null && r.costINR > 0);

  // Separate protein / fibre if available
  const proteinRow = validDeclared.find((r) => r.key === 'protein');
  const fibreRow = validDeclared.find((r) => r.key === 'fibre');

  if (proteinRow && proteinRow.costINR !== null && proteinRow.costINR <= 1.5) {
    bestValue = {
      nutrientName: 'Protein',
      formattedCost: proteinRow.formattedCost,
      targetUnit: `per 1 ${proteinRow.targetUnit}`,
      insight: `High efficiency protein source: only ${proteinRow.formattedCost} per 1g complete protein.`,
    };
  } else if (fibreRow && fibreRow.costINR !== null && fibreRow.costINR <= 2.0) {
    bestValue = {
      nutrientName: 'Dietary Fibre',
      formattedCost: fibreRow.formattedCost,
      targetUnit: `per 1 ${fibreRow.targetUnit}`,
      insight: `Cost-effective dietary fibre delivery: ${fibreRow.formattedCost} per 1g prebiotic fibre.`,
    };
  } else if (validDeclared.length > 0) {
    const topRow = validDeclared[0];
    bestValue = {
      nutrientName: topRow.name,
      formattedCost: topRow.formattedCost,
      targetUnit: `per ${topRow.targetQty} ${topRow.targetUnit}`,
      insight: `Economical nutrient density: ${topRow.formattedCost} per target unit.`,
    };
  }

  // Quality Guardrail Chips (Mandatory: "Cheapest is not healthiest")
  const qualityChips: string[] = ['Quality Notice: Cheapest is never automatically healthiest.'];

  const sodium = facts.nutrition.values.sodium?.value;
  const addedSugar = facts.nutrition.values.addedSugar?.value ?? facts.nutrition.values.totalSugar?.value;
  const satFat = facts.nutrition.values.satFat?.value;
  const transFat = facts.nutrition.values.transFat?.value;

  if (sodium !== undefined && sodium !== null && sodium >= 600) {
    qualityChips.push('High Sodium Level (≥600mg / 100g)');
  }
  if (addedSugar !== undefined && addedSugar !== null && addedSugar >= 12.5) {
    qualityChips.push('High Added Sugar Content (≥12.5g / 100g)');
  }
  if (satFat !== undefined && satFat !== null && satFat >= 4.0) {
    qualityChips.push('High Saturated Fat Concentration (≥4.0g / 100g)');
  }
  if (transFat !== undefined && transFat !== null && transFat > 0.2) {
    qualityChips.push('Trans Fat Declared on Label');
  }

  // Protein Quality Note by source category
  const rawIngs = (facts.ingredientsRaw || '').toLowerCase();
  let proteinQualityNote: string | null = null;

  if (
    /whey|milk solids|dairy|casein|egg|albumin/i.test(rawIngs) ||
    facts.category.includes('Dairy')
  ) {
    proteinQualityNote =
      'Complete Amino Acid Profile: Animal/dairy source providing all 9 essential amino acids in high biological availability.';
  } else if (/soy|soya/i.test(rawIngs)) {
    proteinQualityNote =
      'Complete Plant Protein: Soy is one of the rare plant proteins providing a complete essential amino acid profile.';
  } else if (/wheat|maida|atta|cereal|oat|corn|rice/i.test(rawIngs)) {
    proteinQualityNote =
      'Cereal Grain Protein: Plant-based protein; typically limiting in lysine. Combine with pulses or milk for complete amino acid balance.';
  } else if (/peanut|dal|pulse|chana|besan/i.test(rawIngs)) {
    proteinQualityNote =
      'Legume / Pulse Protein: Plant-based protein; typically rich in lysine and limiting in methionine. Best combined with whole grains.';
  }

  return {
    isAvailable: true,
    priceINR: price,
    packSizeValue: packSize.value,
    packSizeUnit: packSize.unit,
    declaredRows,
    missingRows,
    bestValue,
    qualityChips,
    proteinQualityNote,
    micronutrientNote:
      'Mineral and vitamin bioavailability depends on intestinal cofactors and processing. Fortification levels are presented as declared on packaging.',
    disclaimer:
      'Calculated deterministically as: cost = (price × targetQty) / totalNutrientInPack. General guidance based on label data; not medical advice.',
  };
}
