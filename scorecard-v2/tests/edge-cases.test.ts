import { describe, it, expect } from 'vitest';
import { adaptProductToFacts } from '../adapters/productAdapter';
import { evaluateNutritionPerPaisa } from '../modules/nutrition-per-paisa/calculator';
import { evaluateSmartConsumption } from '../modules/smart-consumption/engine';
import { analyzeIngredients } from '../modules/ingredients-analysis/parser';
import type { Product } from '../../types/product';

describe('Edge Cases Suite — Scorecard V2 Robustness', () => {
  const baseMock: Product = {
    id: 'edge-base',
    slug: 'edge-base',
    name: 'Edge Case Base Product',
    brand: 'EdgeBrand',
    category: 'Snacks & Savouries',
    subcategory: 'Chips',
    image: null,
    servingSizeG: 30,
    packSizeG: 100,
    priceINR: 40,
    per100g: {
      energyKcal: 500,
      proteinG: 6,
      carbsG: 50,
      totalSugarG: 5,
      addedSugarG: 2,
      fatG: 30,
      satFatG: 12,
      transFatG: 0,
      fibreG: 4,
      sodiumMg: 500,
      micronutrients: [],
    },
    ingredients: ['Potato', 'Edible Vegetable Oil (Palmolein)', 'Salt'],
    ingredientTags: [],
    benefits: [],
    concerns: [],
    fbs: { score: 5.5, band: 'Moderate', breakdown: [] },
    nutritionPerPaisa: { proteinPerRupee: 0.2, fibrePerRupee: 0.1, tenRupeesGet: [] },
    barcode: null,
    aliases: [],
    packSizeText: '100 g',
    lastUpdated: '2026-10-16',
    dataSource: 'Manual',
    verification: 'complete',
  };

  it('handles missing price gracefully (isAvailable: false, no division by zero)', () => {
    const p = { ...baseMock, priceINR: null };
    const facts = adaptProductToFacts(p);
    const perPaisa = evaluateNutritionPerPaisa(facts);

    expect(perPaisa.isAvailable).toBe(false);
    expect(perPaisa.declaredRows).toHaveLength(0);
  });

  it('handles missing pack size gracefully', () => {
    const p = { ...baseMock, packSizeG: null, packSizeText: null };
    const facts = adaptProductToFacts(p);
    const perPaisa = evaluateNutritionPerPaisa(facts);

    expect(perPaisa.isAvailable).toBe(false);
  });

  it('handles liquid / ml products properly', () => {
    const p: Product = {
      ...baseMock,
      category: 'Beverages',
      packSizeText: '200 ml',
    };
    const facts = adaptProductToFacts(p);

    expect(facts.packSize?.unit).toBe('ml');
    expect(facts.nutrition.basis).toBe('per100ml');
  });

  it('handles zero protein and zero fibre without errors', () => {
    const p: Product = {
      ...baseMock,
      per100g: {
        ...baseMock.per100g,
        proteinG: 0,
        fibreG: 0,
      },
    };
    const facts = adaptProductToFacts(p);
    const perPaisa = evaluateNutritionPerPaisa(facts);

    expect(perPaisa.isAvailable).toBe(true);
    const proteinRow = perPaisa.declaredRows.find((r) => r.key === 'protein');
    expect(proteinRow).toBeUndefined(); // Zero values are placed in missing/zero
  });

  it('handles empty or missing ingredient list without crash', () => {
    const p: Product = { ...baseMock, ingredients: [] };
    const facts = adaptProductToFacts(p);
    const result = analyzeIngredients(facts.ingredientsList);

    expect(result.parsedIngredients).toHaveLength(0);
    expect(result.declaredAllergens).toHaveLength(0);
  });

  it('handles very long ingredient lists (> 30 items) smoothly', () => {
    const longList = Array.from({ length: 35 }, (_, i) => `Ingredient Item ${i + 1}`);
    longList.push('May contain traces of Soy');
    const result = analyzeIngredients(longList);

    expect(result.parsedIngredients.length).toBeGreaterThan(30);
    expect(result.precautionaryAllergens).toContain('Soybean');
  });

  it('detects unknown library ingredients and flags them as pending index without negative assumption', () => {
    const ingredients = ['Organic Moringa Oleifera Leaves Extract', 'Himalayan Pink Rock Crystal'];
    const result = analyzeIngredients(ingredients);

    expect(result.unknownIngredients.length).toBeGreaterThanOrEqual(1);
    expect(result.consumerTakeaway.transparencySummary).toContain('pending WiseFoodies library indexing');
  });

  it('flags unspecified edible vegetable oil in transparency check', () => {
    const ingredients = ['Edible Vegetable Oil', 'Flavour', 'Spices and Condiments'];
    const result = analyzeIngredients(ingredients);

    expect(result.transparencyFlags.some((f) => f.issue === 'Unspecified Vegetable Oil')).toBe(true);
    expect(result.transparencyFlags.some((f) => f.issue === 'Generic Flavouring Formulation')).toBe(true);
  });
});
