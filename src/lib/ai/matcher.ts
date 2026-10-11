import { getAllProducts } from '../products';
import Fuse from 'fuse.js';
import { Product } from '../../types/product';

export interface MatchResult {
  product: Product | null;
  score: number;
  matchType: 'exact' | 'fuzzy' | 'none';
}

export async function matchProduct(query: string, barcode?: string): Promise<MatchResult> {
  const products = await getAllProducts();

  // 1. Exact Barcode Match
  if (barcode) {
    const barcodeMatch = products.find(p => p.barcode === barcode);
    if (barcodeMatch) {
      return { product: barcodeMatch, score: 1.0, matchType: 'exact' };
    }
  }

  // 2. Exact Name/Brand/Alias Match
  const normalizedQuery = query.toLowerCase().trim();
  const exactMatch = products.find(p =>
    p.name.toLowerCase() === normalizedQuery ||
    p.brand.toLowerCase() === normalizedQuery ||
    p.aliases.some(a => a.toLowerCase() === normalizedQuery)
  );
  if (exactMatch) {
    return { product: exactMatch, score: 1.0, matchType: 'exact' };
  }

  // 3. Fuzzy Match
  const fuse = new Fuse(products, {
    keys: ['name', 'brand', ...products[0]?.aliases.map((_, i) => `aliases.${i}`) || []],
    threshold: 0.4,
    distance: 100,
  });

  const result = fuse.search(query);
  if (result.length > 0) {
    const bestMatch = result[0];
    return {
      product: bestMatch.item,
      score: 1 - bestMatch.score,
      matchType: 'fuzzy',
    };
  }

  return { product: null, score: 0, matchType: 'none' };
}
