import type { NutrientSource, UnitType } from '../../adapters/productAdapter';

export interface NutrientCostRow {
  key: string;
  name: string;
  group: 'Macros' | 'Minerals' | 'Vitamins';
  targetQty: number;
  targetUnit: string;
  amountIn100g: number | null;
  totalInPack: number | null;
  costINR: number | null;
  formattedCost: string;
  source: NutrientSource;
  bioavailabilityNote: string;
}

export interface BestValueHighlight {
  nutrientName: string;
  formattedCost: string;
  targetUnit: string;
  insight: string;
}

export interface NutritionPerPaisaAnalysis {
  isAvailable: boolean;
  priceINR: number | null;
  packSizeValue: number | null;
  packSizeUnit: UnitType;
  declaredRows: NutrientCostRow[];
  missingRows: NutrientCostRow[];
  bestValue: BestValueHighlight | null;
  qualityChips: string[];
  proteinQualityNote: string | null;
  micronutrientNote: string;
  disclaimer: string;
}
