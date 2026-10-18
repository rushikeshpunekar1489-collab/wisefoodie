import { describe, it, expect } from 'vitest';
import {
  matchProductIngredientTag,
  deriveProductIngredientTags,
  parseNaturalLanguageIngredientQuery,
  filterProductsByIngredients,
  highlightIngredientTokens,
} from '../lib/ingredients';
import type { Product } from '../types/product';

function makeProductWithIngredients(
  slug: string,
  name: string,
  ingredients: string[],
  verification: 'complete' | 'incomplete' = 'complete'
): Product {
  return {
    id: slug,
    slug,
    name,
    brand: 'Test Brand',
    category: 'Test Category',
    subcategory: null,
    image: null,
    servingSizeG: 50,
    packSizeG: 100,
    packSizeText: '100g',
    priceINR: 40,
    verification,
    per100g: {
      energyKcal: 400,
      proteinG: 8,
      carbsG: 60,
      totalSugarG: 12,
      addedSugarG: 10,
      fatG: 10,
      satFatG: 3,
      transFatG: 0,
      fibreG: 3,
      sodiumMg: 150,
      micronutrients: [],
    },
    ingredients,
    ingredientTags: [],
    benefits: [],
    concerns: [],
    fbs: {
      score: 6.5,
      band: 'Moderate',
      breakdown: [],
    },
    nutritionPerPaisa: {
      proteinPerRupee: 0.2,
      fibrePerRupee: 0.05,
      tenRupeesGet: [],
    },
    barcode: null,
    aliases: [],
    lastUpdated: '2026-01-01',
    dataSource: 'test',
  };
}

describe('Ingredients Normalizer, Synonyms, and Filters', () => {
  it('correctly maps synonyms and INS numbers to tags', () => {
    // 1. Maida -> refined-flour
    const pMaida = makeProductWithIngredients('p1', 'Biscuit', ['Maida', 'Sugar', 'Butter']);
    expect(matchProductIngredientTag(pMaida, 'refined-flour').matches).toBe(true);

    // 2. Palmolein -> palm-oil
    const pPalm = makeProductWithIngredients('p2', 'Chips', ['Potatoes', 'Palmolein Oil', 'Salt']);
    expect(matchProductIngredientTag(pPalm, 'palm-oil').matches).toBe(true);

    // 3. INS 150d -> artificial-colour
    const pCola = makeProductWithIngredients('p3', 'Cola', ['Carbonated Water', 'Sugar', 'Colour (INS 150d)']);
    expect(matchProductIngredientTag(pCola, 'artificial-colour').matches).toBe(true);

    // 4. INS 955 (sucralose) -> artificial-sweetener
    const pDiet = makeProductWithIngredients('p4', 'Diet Drink', ['Water', 'Sweetener (INS 955)']);
    expect(matchProductIngredientTag(pDiet, 'artificial-sweetener').matches).toBe(true);

    // 5. Sodium Benzoate / INS 211 -> preservative
    const pSauce = makeProductWithIngredients('p5', 'Sauce', ['Tomato Paste', 'Preservative (INS 211)']);
    expect(matchProductIngredientTag(pSauce, 'preservative').matches).toBe(true);

    // 6. Hindi names: kaju, badam -> nuts
    const pChoc = makeProductWithIngredients('p6', 'Nut Choc', ['Cocoa', 'Kaju', 'Badam']);
    expect(matchProductIngredientTag(pChoc, 'nuts').matches).toBe(true);
  });

  it('derives all matching ingredient tags for a product', () => {
    const p = makeProductWithIngredients('p-mixed', 'Rich Biscuit', [
      'Refined Wheat Flour (Maida)',
      'Sugar',
      'Palmolein',
      'Milk Solids',
      'Emulsifier (INS 322)',
    ]);

    const tags = deriveProductIngredientTags(p);
    expect(tags).toContain('refined-flour');
    expect(tags).toContain('added-sugar');
    expect(tags).toContain('palm-oil');
    expect(tags).toContain('milk');
    expect(tags).toContain('emulsifier');
    expect(tags).not.toContain('nuts');
  });

  it('parses natural language queries accurately', () => {
    const q1 = parseNaturalLanguageIngredientQuery('without palm oil');
    expect(q1?.tagId).toBe('palm-oil');
    expect(q1?.type).toBe('does_not_contain');

    const q2 = parseNaturalLanguageIngredientQuery('no added sugar');
    expect(q2?.tagId).toBe('added-sugar');
    expect(q2?.type).toBe('does_not_contain');

    const q3 = parseNaturalLanguageIngredientQuery('bina artificial colour ke');
    expect(q3?.tagId).toBe('artificial-colour');
    expect(q3?.type).toBe('does_not_contain');

    const q4 = parseNaturalLanguageIngredientQuery('whole grain');
    expect(q4?.tagId).toBe('whole-grain');
    expect(q4?.type).toBe('contains');
  });

  it('strictly enforces the accuracy rule for "does_not_contain" filters', () => {
    const verifiedClean = makeProductWithIngredients('clean-oats', 'Pure Oats', ['Rolled Oats'], 'complete');
    const verifiedPalm = makeProductWithIngredients('palm-chips', 'Chips', ['Palmolein', 'Potatoes'], 'complete');
    const unverifiedProduct = makeProductWithIngredients('unknown-food', 'Mystery Food', [], 'incomplete');

    const result = filterProductsByIngredients([verifiedClean, verifiedPalm, unverifiedProduct], {
      doesNotContainTags: ['palm-oil'],
    });

    // verifiedClean does not contain palm oil -> matched
    expect(result.matchedProducts.map((p) => p.slug)).toEqual(['clean-oats']);
    // palm-chips contains palm oil -> excluded
    expect(result.matchedProducts.map((p) => p.slug)).not.toContain('palm-chips');
    // unverifiedProduct has unknown ingredients -> MUST NOT be falsely marked as free of palm oil!
    expect(result.unknownProducts.map((p) => p.slug)).toEqual(['unknown-food']);
  });

  it('flags activeAllergensSelected when allergens are filtered', () => {
    const p = makeProductWithIngredients('test', 'Test', ['Wheat']);
    const res = filterProductsByIngredients([p], { containsTags: ['nuts'] });
    expect(res.activeAllergensSelected).toBe(true);

    const nonAllergenRes = filterProductsByIngredients([p], { containsTags: ['palm-oil'] });
    expect(nonAllergenRes.activeAllergensSelected).toBe(false);
  });

  it('highlights matched ingredient tokens properly', () => {
    const text = 'Refined Wheat Flour, Sugar, Palmolein, Milk Solids';
    const tokens = highlightIngredientTokens(text, ['Palmolein', 'Sugar']);
    const highlighted = tokens.filter((t) => t.isHighlighted).map((t) => t.text);
    expect(highlighted).toContain('Sugar');
    expect(highlighted).toContain('Palmolein');
  });
});
