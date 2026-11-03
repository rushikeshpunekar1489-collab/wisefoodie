import { describe, it, expect } from 'vitest';
import { getProductBySlug } from '../../lib/products';
import { adaptProductToFacts } from '../adapters/productAdapter';
import { evaluateSmartConsumption } from '../modules/smart-consumption/engine';
import { evaluateNutritionPerPaisa } from '../modules/nutrition-per-paisa/calculator';
import { analyzeIngredients } from '../modules/ingredients-analysis/parser';

describe('Product Matrix Tests — Real Products across 6 Categories', () => {
  const testMatrix = [
    // 1. Packaged Snacks / Frozen
    { slug: 'amul-french-fries', cat: 'Packaged Snacks / Frozen' },
    { slug: 'amul-burger-patty', cat: 'Packaged Snacks / Frozen' },

    // 2. Beverages
    { slug: 'amul-kool-koko', cat: 'Beverages' },
    { slug: 'amul-kool-badam', cat: 'Beverages' },

    // 3. Dairy
    { slug: 'amul-gold-milk', cat: 'Dairy & Frozen' },
    { slug: 'amul-taaza-milk', cat: 'Dairy & Frozen' },

    // 4. Cereals & Breads
    { slug: 'amul-sandwich-bread', cat: 'Bakery & Breads' },
    { slug: 'amul-whole-wheat-bread', cat: 'Bakery & Breads' },

    // 5. Instant Foods
    { slug: 'itc-yippee-magic-masala-noodles', cat: 'Instant Foods' },
    { slug: 'amul-instant-mashed-potato', cat: 'Instant Foods' },

    // 6. Processed Foods (Biscuits, Confectionery)
    { slug: 'amul-butter-cookies', cat: 'Biscuits & Cookies' },
    { slug: 'amul-dark-chocolate', cat: 'Chocolates & Confectionery' },
  ];

  for (const item of testMatrix) {
    it(`evaluates all 3 modules cleanly for [${item.cat}] product: ${item.slug}`, () => {
      const product = getProductBySlug(item.slug);
      expect(product).not.toBeNull();
      if (!product) return;

      const facts = adaptProductToFacts(product);
      expect(facts.id).toBeDefined();

      // Module 1: Smart Consumption
      const smartConsumption = evaluateSmartConsumption(facts);
      expect(['Frequent', 'Moderate', 'Occasional', 'Limit']).toContain(smartConsumption.classification.verdict);
      expect(smartConsumption.recommendedConsumption.servingSizeValue).toBeGreaterThan(0);
      expect(smartConsumption.harmReduction.strategies.length).toBeGreaterThan(0);

      // Module 2: Nutrition Per Paisa
      const perPaisa = evaluateNutritionPerPaisa(facts);
      if (facts.priceINR && facts.packSize) {
        expect(perPaisa.isAvailable).toBe(true);
        expect(perPaisa.declaredRows.length).toBeGreaterThan(0);
        for (const row of perPaisa.declaredRows) {
          expect(row.costINR).not.toBeNaN();
          if (row.costINR !== null) {
            expect(isFinite(row.costINR)).toBe(true);
          }
        }
      }

      // Module 3: Ingredients Analysis
      const ings = analyzeIngredients(facts.ingredientsList);
      expect(ings.parsedIngredients.length).toBeGreaterThanOrEqual(0);
      expect(ings.consumerTakeaway.keyObservations).toBeDefined();
    });
  }
});
