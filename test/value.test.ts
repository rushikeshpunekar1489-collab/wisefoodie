import { describe, it, expect } from 'vitest';
import { computeNutritionPerPaisa } from '../lib/value';

describe('Nutrition Per Paisa (lib/value.ts)', () => {
  it('Computes ₹ per gram protein, fibre, and ₹10 breakdown correctly', () => {
    // 500g Oats for ₹150, 13g protein, 10g fibre per 100g
    const res = computeNutritionPerPaisa({
      priceINR: 150,
      packSizeG: 500,
      per100g: {
        energyKcal: 380,
        proteinG: 13,
        fibreG: 10,
        micronutrients: [
          { name: 'Iron', amount: 4.5, unit: 'mg' },
        ],
      },
    });

    expect(res.isAvailable).toBe(true);
    // Total protein = 13 * 5 = 65g. Price = ₹150. ₹/g protein = 150 / 65 = 2.31
    expect(res.rupeesPerGramProtein).toBeCloseTo(2.31, 1);
    // Total fibre = 10 * 5 = 50g. Price = ₹150. ₹/g fibre = 150 / 50 = 3.0
    expect(res.rupeesPerGramFibre).toBe(3);

    // ₹10 buys (10/150)*500 = 33.33g
    // Protein in 33.33g = 33.33 * 0.13 = 4.33g
    const proteinCard = res.tenRupeesGet.find(item => item.nutrient === 'Protein');
    expect(proteinCard).toBeDefined();
    expect(proteinCard?.amount).toBe('4.3g');
  });

  it('Suppresses metrics when nutrients are negligible (<1g in pack)', () => {
    const res = computeNutritionPerPaisa({
      priceINR: 40,
      packSizeG: 200,
      per100g: {
        energyKcal: 44,
        proteinG: 0.1, // only 0.2g in 200g pack -> suppress
        fibreG: 0,
      },
    });

    expect(res.rupeesPerGramProtein).toBeNull();
    expect(res.rupeesPerGramFibre).toBeNull();
    const proteinCard = res.tenRupeesGet.find(item => item.nutrient === 'Protein');
    expect(proteinCard).toBeUndefined();
  });

  it('Returns unavailable when price or pack size is missing', () => {
    const res = computeNutritionPerPaisa({
      priceINR: null,
      packSizeG: 100,
      per100g: {
        energyKcal: 200,
        proteinG: 5,
        fibreG: 2,
      },
    });

    expect(res.isAvailable).toBe(false);
    expect(res.tenRupeesGet).toHaveLength(0);
  });
});
