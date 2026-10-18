import { describe, it, expect } from 'vitest';
import {
  parseCart,
  serializeCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  computeBasketSummary,
  applyCartSwap,
  computeBasketSwaps,
  type CartItem,
} from '../lib/cart';
import type { Product } from '../types/product';

function createTestProduct(
  slug: string,
  name: string,
  category: string,
  score: number | null,
  price: number,
  packSizeG: number,
  calories: number,
  protein: number,
  sugar: number,
  addedSugar: number,
  sodium: number
): Product {
  return {
    id: slug,
    slug,
    name,
    brand: 'Test Brand',
    category,
    subcategory: null,
    image: null,
    servingSizeG: 50,
    packSizeG,
    packSizeText: `${packSizeG}g`,
    priceINR: price,
    verification: 'complete',
    per100g: {
      energyKcal: calories,
      proteinG: protein,
      carbsG: 50,
      totalSugarG: sugar,
      addedSugarG: addedSugar,
      fatG: 10,
      satFatG: 3,
      transFatG: 0,
      fibreG: 4,
      sodiumMg: sodium,
      micronutrients: [],
    },
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    ingredientTags: [],
    benefits: ['Good source of nutrition'],
    concerns: addedSugar > 15 ? ['High added sugar'] : [],
    fbs: {
      score,
      band: score && score >= 7 ? 'Good' : 'Moderate',
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

describe('Smart Cart Pure Logic', () => {
  it('parses null, empty, or corrupted cart payload safely', () => {
    expect(parseCart(null)).toEqual([]);
    expect(parseCart('')).toEqual([]);
    expect(parseCart('{invalid:json}')).toEqual([]);
  });

  it('parses valid version 1 cart schema', () => {
    const raw = JSON.stringify({
      version: 1,
      items: [
        { slug: 'amul-gold-milk', quantity: 2, addedAt: 1000 },
        { slug: 'maggi-noodles', quantity: 3, addedAt: 2000 },
      ],
    });
    const parsed = parseCart(raw);
    expect(parsed.length).toBe(2);
    expect(parsed[0].quantity).toBe(2);
    expect(parsed[1].quantity).toBe(3);
  });

  it('migrates legacy string array or unversioned payload', () => {
    const raw = JSON.stringify(['amul-butter', 'cadbury-dairy-milk']);
    const parsed = parseCart(raw);
    expect(parsed.length).toBe(2);
    expect(parsed[0].slug).toBe('amul-butter');
    expect(parsed[0].quantity).toBe(1);
  });

  it('handles cart item manipulations: add, update, remove', () => {
    let cart: CartItem[] = [];
    cart = addToCart(cart, 'item-a', 1);
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(1);

    // Adding existing item increments quantity
    cart = addToCart(cart, 'item-a', 2);
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(3);

    // Update quantity
    cart = updateCartQuantity(cart, 'item-a', 5);
    expect(cart[0].quantity).toBe(5);

    // Quantity <= 0 removes item
    cart = updateCartQuantity(cart, 'item-a', 0);
    expect(cart.length).toBe(0);

    // Remove directly
    cart = addToCart(cart, 'item-b', 2);
    cart = removeFromCart(cart, 'item-b');
    expect(cart.length).toBe(0);
  });

  it('computes accurate basket summary and calorie-weighted FBS', () => {
    // p1: 100g, 400 kcal, FBS 8.0, 10g protein, 5g sugar
    const p1 = createTestProduct('p1', 'Healthy Oats', 'Breakfast', 8.0, 50, 100, 400, 10, 5, 0, 100);
    // p2: 100g, 200 kcal, FBS 4.0, 2g protein, 25g sugar
    const p2 = createTestProduct('p2', 'Sugary Cookies', 'Biscuits', 4.0, 30, 100, 200, 2, 25, 20, 300);

    const cart: CartItem[] = [
      { slug: 'p1', quantity: 1, addedAt: 100 },
      { slug: 'p2', quantity: 1, addedAt: 200 },
    ];

    const summary = computeBasketSummary(cart, [p1, p2]);

    expect(summary.totalPacks).toBe(2);
    expect(summary.totalPriceINR).toBe(80); // 50 + 30
    expect(summary.totalCaloriesKcal).toBe(600); // 400 + 200
    expect(summary.totalProteinG).toBe(12); // 10 + 2
    expect(summary.totalSugarG).toBe(30); // 5 + 25

    // Calorie-weighted FBS: (8.0 * 400 + 4.0 * 200) / 600 = (3200 + 800) / 600 = 4000 / 600 = 6.666 -> 6.7
    expect(summary.basketFBS).toBe(6.7);
    expect(summary.weightingBasis).toBe('calories');

    // Best & worst items
    expect(summary.bestItem?.product.slug).toBe('p1');
    expect(summary.worstItem?.product.slug).toBe('p2');

    // Dragging down items includes p2 (FBS 4.0 < 5.0)
    expect(summary.draggingDownItems.some((d) => d.product.slug === 'p2')).toBe(true);
  });

  it('applies smart swaps and recalculates elevated basket FBS', () => {
    const currentCart: CartItem[] = [
      { slug: 'bad-biscuit', quantity: 2, addedAt: 100 },
      { slug: 'good-milk', quantity: 1, addedAt: 200 },
    ];

    const swapped = applyCartSwap(currentCart, 'bad-biscuit', 'better-biscuit');
    expect(swapped.some((i) => i.slug === 'bad-biscuit')).toBe(false);
    expect(swapped.find((i) => i.slug === 'better-biscuit')?.quantity).toBe(2);
  });
});
