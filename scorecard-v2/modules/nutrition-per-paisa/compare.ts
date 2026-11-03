import type { ProductFacts } from '../../adapters/productAdapter';
import { evaluateNutritionPerPaisa } from './calculator';
import type { NutrientCostRow } from './types';

export interface ProductNutrientCostComparison {
  nutrientKey: string;
  nutrientName: string;
  targetUnit: string;
  costs: Array<{
    productId: string;
    productName: string;
    costINR: number | null;
    formattedCost: string;
    isLowest: boolean;
  }>;
}

export interface NutrientCompareResult {
  canCompare: boolean;
  incompatibilityReason: string | null;
  commonUnit: 'g' | 'ml' | null;
  rows: ProductNutrientCostComparison[];
}

export function compareProductsNutrientCost(products: ProductFacts[]): NutrientCompareResult {
  if (!products || products.length < 2) {
    return {
      canCompare: false,
      incompatibilityReason: 'At least two products are required for comparison.',
      commonUnit: null,
      rows: [],
    };
  }

  // Check unit consistency (e.g., cannot compare ml to g without explicit warning/refusal)
  const firstUnit = products[0].packSize?.unit;
  const isConsistent = products.every((p) => p.packSize?.unit === firstUnit);

  if (!isConsistent) {
    return {
      canCompare: false,
      incompatibilityReason:
        'Cannot compare liquid products (declared in ml) directly against solid food products (declared in g) on a direct cost-per-gram basis due to differing density factors.',
      commonUnit: null,
      rows: [],
    };
  }

  const evaluations = products.map((p) => ({
    facts: p,
    eval: evaluateNutritionPerPaisa(p),
  }));

  // Collect all unique declared nutrient keys across all evaluated products
  const keyMap = new Map<string, { name: string; targetUnit: string }>();

  for (const item of evaluations) {
    for (const row of item.eval.declaredRows) {
      if (!keyMap.has(row.key)) {
        keyMap.set(row.key, { name: row.name, targetUnit: `${row.targetQty} ${row.targetUnit}` });
      }
    }
  }

  const rows: ProductNutrientCostComparison[] = [];

  for (const [key, meta] of keyMap.entries()) {
    const itemCosts = evaluations.map((item) => {
      const match = item.eval.declaredRows.find((r) => r.key === key);
      return {
        productId: item.facts.id,
        productName: item.facts.name,
        costINR: match?.costINR ?? null,
        formattedCost: match?.formattedCost ?? 'N/A',
        isLowest: false,
      };
    });

    // Determine lowest cost among available numeric costs
    const validCosts = itemCosts.filter((c) => c.costINR !== null && c.costINR > 0);
    if (validCosts.length > 0) {
      const minCost = Math.min(...validCosts.map((c) => c.costINR!));
      for (const c of itemCosts) {
        if (c.costINR !== null && c.costINR === minCost) {
          c.isLowest = true;
        }
      }
    }

    rows.push({
      nutrientKey: key,
      nutrientName: meta.name,
      targetUnit: meta.targetUnit,
      costs: itemCosts,
    });
  }

  return {
    canCompare: true,
    incompatibilityReason: null,
    commonUnit: firstUnit ?? 'g',
    rows,
  };
}
