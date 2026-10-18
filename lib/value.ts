export interface NutritionPerPaisaInput {
  priceINR: number | null;
  packSizeG: number | null;
  per100g: {
    energyKcal: number | null;
    proteinG: number | null;
    fibreG: number | null;
    micronutrients?: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

export interface ValueCardItem {
  nutrient: string;
  amount: string;
  unit?: string;
  rawValue?: number;
}

export interface NutritionPerPaisaResult {
  proteinPerRupee: number | null; // grams of protein per ₹1
  rupeesPerGramProtein: number | null; // ₹ per gram protein
  fibrePerRupee: number | null; // grams of fibre per ₹1
  rupeesPerGramFibre: number | null; // ₹ per gram fibre
  tenRupeesGet: ValueCardItem[];
  isAvailable: boolean;
}

export function computeNutritionPerPaisa(input: NutritionPerPaisaInput): NutritionPerPaisaResult {
  if (
    !input.priceINR ||
    input.priceINR <= 0 ||
    !input.packSizeG ||
    input.packSizeG <= 0
  ) {
    return {
      proteinPerRupee: null,
      rupeesPerGramProtein: null,
      fibrePerRupee: null,
      rupeesPerGramFibre: null,
      tenRupeesGet: [],
      isAvailable: false,
    };
  }

  const { priceINR, packSizeG, per100g } = input;
  const packRatio = packSizeG / 100;

  // Total nutrients in the entire pack
  const totalProteinG = per100g.proteinG !== null && per100g.proteinG !== undefined
    ? per100g.proteinG * packRatio
    : null;

  const totalFibreG = per100g.fibreG !== null && per100g.fibreG !== undefined
    ? per100g.fibreG * packRatio
    : null;

  // ₹ per gram of nutrient (suppress if total in pack < 1.0g or negligible)
  let rupeesPerGramProtein: number | null = null;
  let proteinPerRupee: number | null = null;
  if (totalProteinG !== null && totalProteinG >= 1.0) {
    rupeesPerGramProtein = Math.round((priceINR / totalProteinG) * 100) / 100;
    proteinPerRupee = Math.round((totalProteinG / priceINR) * 100) / 100;
  }

  let rupeesPerGramFibre: number | null = null;
  let fibrePerRupee: number | null = null;
  if (totalFibreG !== null && totalFibreG >= 1.0) {
    rupeesPerGramFibre = Math.round((priceINR / totalFibreG) * 100) / 100;
    fibrePerRupee = Math.round((totalFibreG / priceINR) * 100) / 100;
  }

  // "What do you get for ₹10?"
  // Grams of product purchased with ₹10
  const gramsForTenRupees = (10 / priceINR) * packSizeG;
  const tenRupeeRatio = gramsForTenRupees / 100;

  const tenRupeesGet: ValueCardItem[] = [];

  // Energy
  if (per100g.energyKcal !== null && per100g.energyKcal !== undefined) {
    const energy = Math.round(per100g.energyKcal * tenRupeeRatio);
    tenRupeesGet.push({
      nutrient: 'Energy',
      amount: `${energy} kcal`,
      rawValue: energy,
    });
  }

  // Protein (suppress if < 0.5g for ₹10)
  if (per100g.proteinG !== null && per100g.proteinG !== undefined) {
    const p = Math.round(per100g.proteinG * tenRupeeRatio * 10) / 10;
    if (p >= 0.5) {
      tenRupeesGet.push({
        nutrient: 'Protein',
        amount: `${p.toFixed(1)}g`,
        rawValue: p,
      });
    }
  }

  // Fibre (suppress if < 0.3g for ₹10)
  if (per100g.fibreG !== null && per100g.fibreG !== undefined) {
    const f = Math.round(per100g.fibreG * tenRupeeRatio * 10) / 10;
    if (f >= 0.3) {
      tenRupeesGet.push({
        nutrient: 'Dietary Fibre',
        amount: `${f.toFixed(1)}g`,
        rawValue: f,
      });
    }
  }

  // Micronutrients (e.g. Calcium, Iron)
  if (per100g.micronutrients && per100g.micronutrients.length > 0) {
    for (const m of per100g.micronutrients) {
      const val = Math.round(m.amount * tenRupeeRatio * 10) / 10;
      if (val > 0) {
        tenRupeesGet.push({
          nutrient: m.name,
          amount: `${val} ${m.unit}`,
          rawValue: val,
        });
      }
    }
  }

  return {
    proteinPerRupee,
    rupeesPerGramProtein,
    fibrePerRupee,
    rupeesPerGramFibre,
    tenRupeesGet,
    isAvailable: true,
  };
}

export function calculateNutritionPerPaisa(product: any): NutritionPerPaisaResult {
  const packSizeMatch = typeof product.packSize === 'string'
    ? product.packSize.match(/(\d+(?:\.\d+)?)\s*(?:g|ml|gm)/i)
    : null;
  const packSizeG = product.packSizeG || (packSizeMatch ? parseFloat(packSizeMatch[1]) : 100);

  return computeNutritionPerPaisa({
    priceINR: product.price ?? null,
    packSizeG,
    per100g: {
      energyKcal: product.per100g?.energyKcal ?? null,
      proteinG: product.per100g?.proteinG ?? null,
      fibreG: product.per100g?.fiberG ?? null,
      micronutrients: product.per100g?.micronutrients,
    },
  });
}
