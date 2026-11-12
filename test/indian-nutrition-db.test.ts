import { describe, it, expect } from 'vitest';
import { indianNutritionDb } from '../lib/db/indianNutritionDb';
import { FEATURES } from '../lib/features';

describe('Indian Nutrition Database Engine', () => {
  it('loads authentic database and matches audited counts', () => {
    const stats = indianNutritionDb.getStats();

    expect(stats.totalRecords).toBe(1911);
    expect(stats.cookedDishes).toBe(1014);
    expect(stats.rawFoods).toBe(897);
    expect(stats.recipesWithOilData).toBeGreaterThanOrEqual(700);
    expect(stats.totalAliases).toBeGreaterThan(2500);
  });

  it('retrieves classic dishes with multilingual aliases (English, Hindi, Marathi)', () => {
    // 1. Aloo Gobi
    const alooSearch = indianNutritionDb.search({ query: 'Aloo Gobi', limit: 5 });
    expect(alooSearch.items.length).toBeGreaterThan(0);
    const topAloo = alooSearch.items[0];
    const hasAlooOrPotato = topAloo.name.toLowerCase().includes('potato') || topAloo.name.toLowerCase().includes('aloo');
    expect(hasAlooOrPotato).toBe(true);

    // 2. Palak Paneer
    const palakSearch = indianNutritionDb.search({ query: 'Palak Paneer', limit: 5 });
    expect(palakSearch.items.length).toBeGreaterThan(0);
    expect(palakSearch.items[0].name.toLowerCase()).toContain('paneer');

    // 3. Devanagari Hindi search: भिंडी (Bhindi)
    const hindiSearch = indianNutritionDb.search({ query: 'भिंडी', limit: 5 });
    expect(hindiSearch.items.length).toBeGreaterThan(0);
    expect(hindiSearch.items[0].name.toLowerCase()).toMatch(/bhindi|okra/i);

    // 4. Marathi / regional name: Batata
    const marathiSearch = indianNutritionDb.search({ query: 'Batata', limit: 5 });
    expect(marathiSearch.items.length).toBeGreaterThan(0);

    // 5. Devanagari Hindi search: पोहा (Poha)
    const pohaSearch = indianNutritionDb.search({ query: 'पोहा', limit: 5 });
    expect(pohaSearch.items.length).toBeGreaterThan(0);
  });

  it('distinguishes raw and cooked foods correctly', () => {
    const cookedOnly = indianNutritionDb.search({ foodType: 'cooked', limit: 10 });
    expect(cookedOnly.items.every((i: any) => i.foodType === 'cooked')).toBe(true);

    const rawOnly = indianNutritionDb.search({ foodType: 'raw', limit: 10 });
    expect(rawOnly.items.every((i: any) => i.foodType === 'raw')).toBe(true);
    expect(rawOnly.items[0].provenance).toContain('ICMR-NIN');
  });

  it('provides verified oil breakdown and does not invent oil for recipes without it', () => {
    // Cooked dish with oil: Palak Paneer (ASC215)
    const palakPaneer = indianNutritionDb.getById('ASC215');
    expect(palakPaneer).not.toBeNull();
    expect(palakPaneer!.oilBreakdown.available).toBe(true);
    expect(palakPaneer!.oilBreakdown.totalRecipeOilG).toBeGreaterThan(0);
    expect(palakPaneer!.oilBreakdown.oilPerServingG).toBeGreaterThan(0);
    expect(palakPaneer!.oilBreakdown.oilCaloriesPerServing).toBeGreaterThan(0);

    // Raw ingredient: Amaranth seed (A001)
    const amaranth = indianNutritionDb.getById('A001');
    expect(amaranth).not.toBeNull();
    expect(amaranth!.foodType).toBe('raw');
    expect(amaranth!.oilBreakdown.available).toBe(false);
    expect(amaranth!.oilBreakdown.note).toContain('No added cooking oil');
  });

  it('preserves missing nutrients without converting to fake zeros', () => {
    const all = indianNutritionDb.getAll();
    // At least some records should have null for nutrients that were unmeasured in source tables
    const hasUnmeasuredSfa = all.some(i => i.nutrientsPer100g.sfaMg === null);
    expect(hasUnmeasuredSfa).toBe(true);
  });
});

describe('Scanner Feature Flag', () => {
  it('has ENABLE_SCANNER set to false by default for temporary maintenance', () => {
    expect(FEATURES.ENABLE_SCANNER).toBe(false);
  });
});
