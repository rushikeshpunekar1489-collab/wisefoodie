import { describe, it, expect } from 'vitest';
import { calculateNutrientCost, formatINR } from '../modules/nutrition-per-paisa/calculator';
import {
  splitTopLevelIngredients,
  extractPercentage,
  extractInsCode,
  analyzeIngredients,
} from '../modules/ingredients-analysis/parser';
import { evaluateSmartConsumption } from '../modules/smart-consumption/engine';
import { adaptProductToFacts } from '../adapters/productAdapter';
import type { Product } from '../../types/product';

describe('Unit Tests — Scorecard V2', () => {
  describe('Nutrition Per Paisa Formula & Worked Example', () => {
    it('passes the mandatory worked example: ₹60, 200g pack, 40g/100g protein -> ₹0.75 per 1g protein', () => {
      // price ₹60, pack 200 g, protein 40 g/100 g -> total protein 80 g -> ₹60 * 1 / 80 = ₹0.75
      const priceINR = 60;
      const packSizeG = 200;
      const proteinPer100g = 40;
      const targetQty = 1; // 1 g target

      const cost = calculateNutrientCost(priceINR, packSizeG, proteinPer100g, targetQty);
      expect(cost).toBe(0.75);
      expect(formatINR(cost)).toBe('₹0.75');
    });

    it('safely handles zero and negative inputs without NaN or Infinity', () => {
      expect(calculateNutrientCost(0, 200, 40, 1)).toBeNull();
      expect(calculateNutrientCost(60, 0, 40, 1)).toBeNull();
      expect(calculateNutrientCost(60, 200, 0, 1)).toBeNull();
      expect(calculateNutrientCost(60, 200, 40, 0)).toBeNull();
      expect(calculateNutrientCost(-60, 200, 40, 1)).toBeNull();
    });

    it('formats tiny values as < ₹0.01', () => {
      expect(formatINR(0.004)).toBe('< ₹0.01');
      expect(formatINR(null)).toBe('N/A');
    });
  });

  describe('Ingredient Parser Engine', () => {
    it('correctly splits top-level commas while preserving nested parentheses and brackets', () => {
      const raw = 'Refined Wheat Flour (Maida), Seasoning [Spices (Chilli, Cumin), Iodised Salt, Sugar], Palmolein Oil';
      const items = splitTopLevelIngredients(raw);

      expect(items).toHaveLength(3);
      expect(items[0]).toBe('Refined Wheat Flour (Maida)');
      expect(items[1]).toBe('Seasoning [Spices (Chilli, Cumin), Iodised Salt, Sugar]');
      expect(items[2]).toBe('Palmolein Oil');
    });

    it('extracts declared percentages accurately', () => {
      const { cleanText, percentage } = extractPercentage('Whole Wheat Flour (Atta) (65%)');
      expect(percentage).toBe('65%');
      expect(cleanText).toBe('Whole Wheat Flour (Atta)');
    });

    it('extracts INS and E codes cleanly', () => {
      expect(extractInsCode('Acidity Regulator (INS 330)')).toBe('330');
      expect(extractInsCode('Raising Agent (INS 500(ii))')).toBe('500(ii)');
      expect(extractInsCode('Emulsifier (E322)')).toBe('322');
      expect(extractInsCode('Fresh Milk')).toBeNull();
    });
  });

  describe('Hidden Sugar Detection & Maltodextrin Separation', () => {
    it('detects multiple conventional added sugars', () => {
      const ingredients = [
        'Refined Wheat Flour',
        'Sugar',
        'Liquid Glucose',
        'Invert Sugar Syrup',
        'Palm Oil',
      ];
      const result = analyzeIngredients(ingredients);

      expect(result.hiddenSugars.totalSugarCount).toBeGreaterThanOrEqual(3);
      expect(result.hiddenSugars.hasMultipleSugars).toBe(true);
      expect(result.hiddenSugars.distinctSugarSources).toContain('sugar');
      expect(result.hiddenSugars.distinctSugarSources).toContain('liquid glucose');
    });

    it('strictly separates maltodextrin and NEVER counts it as a conventional sugar name', () => {
      const ingredients = [
        'Corn Flour',
        'Maltodextrin',
        'Salt',
        'Spices',
      ];
      const result = analyzeIngredients(ingredients);

      expect(result.hiddenSugars.maltodextrinDetected).toBe(true);
      expect(result.hiddenSugars.maltodextrinNote).toContain('Contains Maltodextrin');
      // Must NOT be counted as a conventional sugar
      expect(result.hiddenSugars.distinctSugarSources).not.toContain('maltodextrin');
      expect(result.hiddenSugars.totalSugarCount).toBe(0);
    });
  });

  describe('Allergens: Declared vs Precautionary Separation', () => {
    it('keeps declared recipe allergens and precautionary "may contain" notices strictly separated', () => {
      const ingredients = [
        'Standardized Milk Solids',
        'Wheat Flour',
        'Sugar',
        'May contain traces of Peanuts and Tree Nuts',
      ];
      const result = analyzeIngredients(ingredients);

      expect(result.declaredAllergens).toContain('Milk & Dairy');
      expect(result.declaredAllergens).toContain('Wheat / Gluten');
      expect(result.declaredAllergens).not.toContain('Peanuts');

      expect(result.precautionaryAllergens).toContain('Peanuts');
      expect(result.precautionaryAllergens).toContain('Tree Nuts');
    });
  });

  describe('Smart Consumption Rule Engine', () => {
    it('classifies a high sodium/sugar food as Occasional or Limit with exact triggers', () => {
      const mockProduct: Product = {
        id: 'test-high-sodium',
        slug: 'test-high-sodium',
        name: 'Instant Noodles Test',
        brand: 'TestBrand',
        category: 'Instant Foods',
        subcategory: 'Noodles',
        image: null,
        servingSizeG: 70,
        packSizeG: 70,
        priceINR: 15,
        per100g: {
          energyKcal: 450,
          proteinG: 8,
          carbsG: 60,
          totalSugarG: 4,
          addedSugarG: 2,
          fatG: 18,
          satFatG: 8.5,
          transFatG: 0,
          fibreG: 3,
          sodiumMg: 1200, // 1200mg/100g -> ~840mg in 70g serving = 42% of daily 2000mg limit!
          micronutrients: [],
        },
        ingredients: ['Wheat Flour', 'Palm Oil', 'Seasoning (Salt, Spices)'],
        ingredientTags: [],
        benefits: [],
        concerns: ['High Sodium'],
        fbs: { score: 4.2, band: 'Fair', breakdown: [] },
        nutritionPerPaisa: { proteinPerRupee: 0.3, fibrePerRupee: 0.1, tenRupeesGet: [] },
        barcode: null,
        aliases: [],
        packSizeText: '70 g',
        lastUpdated: '2026-10-16',
        dataSource: 'Test',
        verification: 'complete',
      };

      const facts = adaptProductToFacts(mockProduct);
      const analysis = evaluateSmartConsumption(facts);

      expect(['Occasional', 'Limit']).toContain(analysis.classification.verdict);
      expect(analysis.classification.triggers.some(t => t.includes('sodium'))).toBe(true);
      expect(analysis.harmReduction.strategies.length).toBeGreaterThan(0);
    });
  });
});
