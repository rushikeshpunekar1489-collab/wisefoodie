import { describe, it, expect } from 'vitest';
import {
  parseFavourites,
  serializeFavourites,
  toggleFavouriteRecord,
  isSlugFavourited,
  filterAndSortFavouriteProducts,
  type FavouriteRecord,
} from '../lib/favourites';
import type { Product } from '../types/product';

function createMockProduct(slug: string, name: string, category: string, score: number | null, price: number | null): Product {
  return {
    id: slug,
    slug,
    name,
    brand: 'Test Brand',
    category,
    subcategory: null,
    image: null,
    servingSizeG: 50,
    packSizeG: 100,
    packSizeText: '100g',
    priceINR: price,
    verification: 'complete',
    per100g: {
      energyKcal: 400,
      proteinG: 10,
      carbsG: 60,
      totalSugarG: 15,
      addedSugarG: 10,
      fatG: 12,
      satFatG: 4,
      transFatG: 0,
      fibreG: 3,
      sodiumMg: 200,
      micronutrients: [],
    },
    ingredients: ['Wheat', 'sugar', 'butter'],
    ingredientTags: [],
    benefits: ['Good protein'],
    concerns: ['Added sugar'],
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

describe('Favourites Pure Logic', () => {
  it('parses null, empty or invalid json safely without throwing', () => {
    expect(parseFavourites(null)).toEqual([]);
    expect(parseFavourites('')).toEqual([]);
    expect(parseFavourites('invalid json string {[[')).toEqual([]);
    expect(parseFavourites('{"someOtherKey": 123}')).toEqual([]);
  });

  it('parses valid version 1 schema', () => {
    const raw = JSON.stringify({
      version: 1,
      items: [
        { slug: 'amul-gold-milk', addedAt: 1700000000 },
        { slug: 'maggi-noodles', addedAt: 1700000100 },
      ],
    });
    const parsed = parseFavourites(raw);
    expect(parsed.length).toBe(2);
    expect(parsed[0].slug).toBe('amul-gold-milk');
    expect(parsed[1].slug).toBe('maggi-noodles');
  });

  it('migrates legacy array of strings safely', () => {
    const rawLegacy = JSON.stringify(['amul-butter', 'cadbury-dairy-milk']);
    const parsed = parseFavourites(rawLegacy);
    expect(parsed.length).toBe(2);
    expect(parsed[0].slug).toBe('amul-butter');
    expect(typeof parsed[0].addedAt).toBe('number');
  });

  it('serializes and round-trips favourites', () => {
    const initial: FavouriteRecord[] = [
      { slug: 'kelloggs-corn-flakes', addedAt: 1700000500 },
    ];
    const serialized = serializeFavourites(initial);
    const roundTripped = parseFavourites(serialized);
    expect(roundTripped).toEqual(initial);
  });

  it('toggles a favourite item (add and remove)', () => {
    const empty: FavouriteRecord[] = [];
    const { updated: added, isFavourited: addedState } = toggleFavouriteRecord(empty, 'amul-taaza-milk');
    expect(addedState).toBe(true);
    expect(added.length).toBe(1);
    expect(added[0].slug).toBe('amul-taaza-milk');

    const { updated: removed, isFavourited: removedState } = toggleFavouriteRecord(added, 'amul-taaza-milk');
    expect(removedState).toBe(false);
    expect(removed.length).toBe(0);
  });

  it('checks if a slug is favourited', () => {
    const records: FavouriteRecord[] = [
      { slug: 'hocco-ice-cream', addedAt: 1000 },
    ];
    expect(isSlugFavourited(records, 'hocco-ice-cream')).toBe(true);
    expect(isSlugFavourited(records, 'not-in-list')).toBe(false);
  });

  it('filters and sorts favourites correctly', () => {
    const p1 = createMockProduct('p1', 'Alpha Protein Bar', 'Snacks', 8.5, 60);
    const p2 = createMockProduct('p2', 'Beta Biscuit', 'Biscuits', 4.2, 20);
    const p3 = createMockProduct('p3', 'Gamma Milk', 'Dairy', 9.1, 40);
    const p4 = createMockProduct('p4', 'Delta Chips', 'Snacks', 3.0, 15);

    const records: FavouriteRecord[] = [
      { slug: 'p1', addedAt: 100 },
      { slug: 'p2', addedAt: 200 },
      { slug: 'p3', addedAt: 300 },
      // p4 is not favourited
    ];

    const all = [p1, p2, p3, p4];

    // Filtered to favourites only
    const favsRecent = filterAndSortFavouriteProducts(all, records, { sortBy: 'recent' });
    expect(favsRecent.map((p) => p.slug)).toEqual(['p3', 'p2', 'p1']);

    // Sort by FBS desc
    const favsFbs = filterAndSortFavouriteProducts(all, records, { sortBy: 'fbs-desc' });
    expect(favsFbs.map((p) => p.slug)).toEqual(['p3', 'p1', 'p2']);

    // Sort by price asc
    const favsPrice = filterAndSortFavouriteProducts(all, records, { sortBy: 'price-asc' });
    expect(favsPrice.map((p) => p.slug)).toEqual(['p2', 'p3', 'p1']);

    // Filter by category
    const snacksOnly = filterAndSortFavouriteProducts(all, records, { category: 'Snacks' });
    expect(snacksOnly.map((p) => p.slug)).toEqual(['p1']);

    // Search query
    const searchMatch = filterAndSortFavouriteProducts(all, records, { searchQuery: 'Biscuit' });
    expect(searchMatch.map((p) => p.slug)).toEqual(['p2']);
  });
});
