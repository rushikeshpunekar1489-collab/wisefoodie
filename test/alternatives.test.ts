import { describe, it, expect } from 'vitest';
import { findAlternatives } from '../lib/alternatives';
import type { Product } from '../types/product';

const mockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'test-1',
  slug: 'test-1',
  name: 'Standard Biscuit',
  brand: 'BrandA',
  category: 'Biscuits & Cookies',
  subcategory: 'Cookies',
  image: '/products/test.webp',
  servingSizeG: 30,
  packSizeG: 100,
  priceINR: 30,
  per100g: {
    energyKcal: 450,
    proteinG: 5.0,
    carbsG: 70.0,
    totalSugarG: 25.0,
    addedSugarG: 22.0,
    fatG: 18.0,
    satFatG: 9.0,
    transFatG: 0.0,
    fibreG: 2.0,
    sodiumMg: 350,
    micronutrients: [],
  },
  ingredients: ['Wheat Flour', 'Sugar', 'Palm Oil'],
  ingredientTags: [],
  benefits: ['Crunchy taste'],
  concerns: ['Added sugar'],
  fbs: {
    score: 5.0,
    band: 'Moderate',
    breakdown: [],
  },
  nutritionPerPaisa: {
    proteinPerRupee: 0.17,
    fibrePerRupee: 0.07,
    tenRupeesGet: [],
  },
  barcode: '890000000001',
  aliases: [],
  packSizeText: '100 g',
  lastUpdated: '2026-10-16',
  dataSource: 'Test Source',
  verification: 'complete',
  ...overrides,
});

describe('lib/alternatives.ts', () => {
  const target = mockProduct({
    id: 'target',
    slug: 'target',
    name: 'Target Sweet Biscuit',
    priceINR: 40,
    packSizeG: 100,
    fbs: { score: 4.5, band: 'Limited', breakdown: [] },
    per100g: {
      energyKcal: 480,
      proteinG: 4.0,
      carbsG: 72.0,
      totalSugarG: 30.0,
      addedSugarG: 28.0,
      fatG: 20.0,
      satFatG: 10.0,
      transFatG: 0.0,
      fibreG: 1.0,
      sodiumMg: 400,
      micronutrients: [],
    },
  });

  const betterPeer = mockProduct({
    id: 'better',
    slug: 'better',
    name: 'Oat Digestive Biscuit',
    priceINR: 45,
    packSizeG: 100,
    fbs: { score: 7.2, band: 'Good', breakdown: [] },
    per100g: {
      energyKcal: 440,
      proteinG: 8.5,
      carbsG: 62.0,
      totalSugarG: 12.0,
      addedSugarG: 10.0,
      fatG: 16.0,
      satFatG: 7.0,
      transFatG: 0.0,
      fibreG: 6.0,
      sodiumMg: 280,
      micronutrients: [],
    },
  });

  const highSugarPeer = mockProduct({
    id: 'sugary',
    slug: 'sugary',
    name: 'Double Sugar Cookie',
    priceINR: 35,
    packSizeG: 100,
    fbs: { score: 3.2, band: 'Poor', breakdown: [] },
    per100g: {
      energyKcal: 510,
      proteinG: 3.0,
      carbsG: 75.0,
      totalSugarG: 42.0,
      addedSugarG: 40.0,
      fatG: 22.0,
      satFatG: 12.0,
      transFatG: 0.1,
      fibreG: 0.5,
      sodiumMg: 450,
      micronutrients: [],
    },
  });

  const expensiveSuperfood = mockProduct({
    id: 'expensive',
    slug: 'expensive',
    name: 'Gourmet Organic Biscuit',
    priceINR: 120, // +200% price (exceeds +30% price constraint)
    packSizeG: 100,
    fbs: { score: 9.0, band: 'Excellent', breakdown: [] },
  });

  const differentCategoryPeer = mockProduct({
    id: 'beverage',
    slug: 'beverage',
    name: 'Fresh Cow Milk',
    category: 'Dairy & Frozen',
    priceINR: 30,
    fbs: { score: 8.5, band: 'Very Good', breakdown: [] },
  });

  it('ranks higher FBS, lower sugar and higher protein first in overall mode', () => {
    const catalog = [target, betterPeer, highSugarPeer];
    const result = findAlternatives(target, catalog, { mode: 'overall' });

    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.suggestions[0].product.slug).toBe('better');
    expect(result.suggestions[0].delta.fbs).toBe(2.7);
    expect(result.suggestions[0].delta.sugarG).toBe(-18.0);
    expect(result.suggestions[0].delta.proteinG).toBe(4.5);
  });

  it('respects price ceiling constraint (+30% max by default) in overall mode', () => {
    const catalog = [target, expensiveSuperfood, betterPeer];
    const result = findAlternatives(target, catalog, { mode: 'overall', maxPriceMultiplier: 1.30 });

    const slugs = result.suggestions.map((s) => s.product.slug);
    expect(slugs).toContain('better');
    expect(slugs).not.toContain('expensive');
  });

  it('filters strictly by category (never suggests items from a different aisle)', () => {
    const catalog = [target, differentCategoryPeer, betterPeer];
    const result = findAlternatives(target, catalog);

    const slugs = result.suggestions.map((s) => s.product.slug);
    expect(slugs).not.toContain('beverage');
  });

  it('handles single-product category gracefully with appropriate status message', () => {
    const catalog = [target];
    const result = findAlternatives(target, catalog);

    expect(result.suggestions).toEqual([]);
    expect(result.isTargetTopTier).toBe(true);
    expect(result.statusMessage).toContain('No other products currently');
  });

  it('recognizes top-tier items in category and displays respectful notice', () => {
    const topTarget = mockProduct({
      id: 'champion',
      slug: 'champion',
      category: 'Biscuits & Cookies',
      fbs: { score: 9.2, band: 'Excellent', breakdown: [] },
    });
    const catalog = [topTarget, betterPeer, target];
    const result = findAlternatives(topTarget, catalog, { mode: 'overall' });

    expect(result.isTargetTopTier).toBe(true);
    expect(result.statusMessage).toContain('Already one of the best');
  });

  it('handles missing nutrient data without throwing errors', () => {
    const incompletePeer = mockProduct({
      id: 'incomplete',
      slug: 'incomplete',
      per100g: {
        energyKcal: null,
        proteinG: null,
        carbsG: null,
        totalSugarG: null,
        addedSugarG: null,
        fatG: null,
        satFatG: null,
        transFatG: null,
        fibreG: null,
        sodiumMg: null,
        micronutrients: [],
      },
      fbs: { score: null, band: null, breakdown: [] },
    });

    const catalog = [target, incompletePeer];
    expect(() => findAlternatives(target, catalog)).not.toThrow();
  });

  it('supports distinct alternative modes (sugar, protein, cheaper, value)', () => {
    const catalog = [target, betterPeer, highSugarPeer];

    const sugarResult = findAlternatives(target, catalog, { mode: 'sugar' });
    expect(sugarResult.suggestions[0].product.slug).toBe('better');

    const proteinResult = findAlternatives(target, catalog, { mode: 'protein' });
    expect(proteinResult.suggestions[0].product.slug).toBe('better');

    const cheaperPeer = mockProduct({
      id: 'cheaper',
      slug: 'cheaper',
      priceINR: 20, // Cheaper than target 40
      fbs: { score: 5.5, band: 'Moderate', breakdown: [] },
    });
    const cheaperResult = findAlternatives(target, [target, cheaperPeer, betterPeer], { mode: 'cheaper' });
    expect(cheaperResult.suggestions[0].product.slug).toBe('cheaper');
  });
});
