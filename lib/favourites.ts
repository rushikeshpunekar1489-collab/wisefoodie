/**
 * WiseFoodies Favourites Pure Logic Module
 * Local-first, versioned, migration-safe favourites handling.
 */

import type { Product } from '@/types/product';

export const FAVOURITES_STORAGE_KEY = 'wf_favourites_v1';

export interface FavouriteRecord {
  slug: string;
  addedAt: number; // unix timestamp
}

export interface FavouritesStoreData {
  version: 1;
  items: FavouriteRecord[];
}

/**
 * Safely parse raw stored JSON into a validated list of slug strings.
 * Handles migration from legacy string arrays or malformed data gracefully.
 */
export function parseFavourites(rawJson: string | null): FavouriteRecord[] {
  if (!rawJson) return [];

  try {
    const parsed = JSON.parse(rawJson);

    // Schema v1 with version and metadata
    if (parsed && parsed.version === 1 && Array.isArray(parsed.items)) {
      return parsed.items.filter(
        (item: unknown): item is FavouriteRecord =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as FavouriteRecord).slug === 'string' &&
          typeof (item as FavouriteRecord).addedAt === 'number'
      );
    }

    // Migration fallback: legacy array of strings ['slug-1', 'slug-2']
    if (Array.isArray(parsed)) {
      const now = Date.now();
      return parsed
        .filter((slug: unknown): slug is string => typeof slug === 'string' && slug.trim().length > 0)
        .map((slug, idx) => ({
          slug: slug.trim(),
          addedAt: now - idx * 1000,
        }));
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * Serialize favourite records into versioned storage payload.
 */
export function serializeFavourites(items: FavouriteRecord[]): string {
  const payload: FavouritesStoreData = {
    version: 1,
    items: items.filter((item) => typeof item.slug === 'string' && item.slug.trim().length > 0),
  };
  return JSON.stringify(payload);
}

/**
 * Pure toggle: adds if not present, removes if present.
 * Returns a new array.
 */
export function toggleFavouriteRecord(
  current: FavouriteRecord[],
  slug: string
): { updated: FavouriteRecord[]; isFavourited: boolean } {
  const cleanSlug = slug.trim();
  const exists = current.some((item) => item.slug === cleanSlug);

  if (exists) {
    return {
      updated: current.filter((item) => item.slug !== cleanSlug),
      isFavourited: false,
    };
  }

  return {
    updated: [{ slug: cleanSlug, addedAt: Date.now() }, ...current],
    isFavourited: true,
  };
}

/**
 * Check if a product slug is in the favourites list.
 */
export function isSlugFavourited(records: FavouriteRecord[], slug: string): boolean {
  const cleanSlug = slug.trim();
  return records.some((item) => item.slug === cleanSlug);
}

export type FavouritesSortOption = 'recent' | 'fbs-desc' | 'price-asc' | 'price-desc' | 'name-asc';

/**
 * Filter and sort a list of products according to favourites order and options.
 */
export function filterAndSortFavouriteProducts(
  products: Product[],
  favouriteRecords: FavouriteRecord[],
  options: {
    category?: string;
    sortBy?: FavouritesSortOption;
    searchQuery?: string;
  } = {}
): Product[] {
  const recordMap = new Map<string, number>();
  for (const rec of favouriteRecords) {
    recordMap.set(rec.slug, rec.addedAt);
  }

  // Only keep products that are favourited
  let filtered = products.filter((p) => recordMap.has(p.slug));

  // Category filter
  if (options.category && options.category !== 'all') {
    filtered = filtered.filter(
      (p) => p.category && p.category.toLowerCase() === options.category!.toLowerCase()
    );
  }

  // Search query filter (name or brand)
  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const q = options.searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  // Sorting
  const sortBy = options.sortBy || 'recent';
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'recent': {
        const timeA = recordMap.get(a.slug) || 0;
        const timeB = recordMap.get(b.slug) || 0;
        return timeB - timeA;
      }
      case 'fbs-desc': {
        const scoreA = a.fbs.score ?? -1;
        const scoreB = b.fbs.score ?? -1;
        return scoreB - scoreA;
      }
      case 'price-asc': {
        const priceA = a.priceINR ?? Number.MAX_SAFE_INTEGER;
        const priceB = b.priceINR ?? Number.MAX_SAFE_INTEGER;
        return priceA - priceB;
      }
      case 'price-desc': {
        const priceA = a.priceINR ?? -1;
        const priceB = b.priceINR ?? -1;
        return priceB - priceA;
      }
      case 'name-asc':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return sorted;
}
