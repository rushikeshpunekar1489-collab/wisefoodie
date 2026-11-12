import type { Product } from '@/types/product';
import Fuse from 'fuse.js';
import productsData from '@/data/products.json';
import sampleData from '@/data/sample/sample-products.json';
import goldenData from '@/scorecard-v2/tests/golden-before.json';
import legacyFallback from '@/data/legacy-fallback.json';

const rawProducts = productsData as unknown as Product[];
const rawSamples = sampleData as unknown as Product[];
const rawGolden = goldenData as unknown as Product[];
const rawLegacy = legacyFallback as unknown as Product[];

export function getAllProducts(): Product[] {
  return rawProducts;
}

export function getSampleProducts(): Product[] {
  return rawSamples;
}

export function getAllProductsWithSamples(): Product[] {
  return [...rawProducts, ...rawSamples];
}

export function getProductBySlug(slug: string): Product | null {
  const normSlug = (slug || '').toLowerCase();
  const all = getAllProductsWithSamples();
  const found = all.find(p => p.slug?.toLowerCase() === normSlug || p.id?.toLowerCase() === normSlug);
  if (found) return found;

  const golden = rawGolden.find(p => p.slug?.toLowerCase() === normSlug || p.id?.toLowerCase() === normSlug);
  if (golden) return golden;

  const legacy = rawLegacy.find(p => p.slug?.toLowerCase() === normSlug || p.id?.toLowerCase() === normSlug);
  return legacy || null;
}

export function getProductByBarcode(barcode: string): Product | null {
  const all = getAllProductsWithSamples();
  const found = all.find(p => p.barcode && p.barcode.trim() === barcode.trim());
  return found || null;
}

export interface CategoryInfo {
  name: string;
  count: number;
  slug: string;
  icon?: string;
}

export function getCategories(): CategoryInfo[] {
  const products = getAllProducts();
  const map = new Map<string, number>();

  for (const p of products) {
    const cat = p.category || 'Other';
    map.set(cat, (map.get(cat) || 0) + 1);
  }

  const categoryIcons: Record<string, string> = {
    'Dairy & Frozen': '🥛',
    'Snacks & Savouries': '🍿',
    'Chocolates & Confectionery': '🍫',
    'Beverages': '🥤',
    'Noodles & Sauces': '🍜',
    'Ready To Cook': '🍲',
    'Breakfast Cereals': '🥣',
    'Sauces & Spreads': '🥫',
    'Soups & Seasonings': '🍲',
    'Instant Foods': '⚡',
    'Beverages & Spreads': '🍓',
    'Frozen Foods': '🧊',
    'Ready To Eat': '🍛',
    'Dairy & Nutrition': '🥛',
    'Biscuits & Cookies': '🍪',
    'Packaged Foods': '📦',
  };

  return Array.from(map.entries()).map(([name, count]) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return {
      name,
      count,
      slug,
      icon: categoryIcons[name] || '🍽️',
    };
  });
}

export interface SearchMatchResult {
  product: Product;
  score: number;
  matchReason: string;
}

export function searchProducts(query: string): SearchMatchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const all = getAllProductsWithSamples();

  // Smart intent matches
  const isHighProtein = /high\s*protein|protein/i.test(trimmed);
  const isLowSugar = /low\s*sugar|no\s*sugar|sugar\s*free/i.test(trimmed);
  const isBestValue = /best\s*value|value|cheap|paisa/i.test(trimmed);
  const isHighFibre = /fibre|fiber|digest/i.test(trimmed);

  const fuse = new Fuse(all, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'brand', weight: 0.3 },
      { name: 'category', weight: 0.2 },
      { name: 'ingredients', weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
  });

  const fuseResults = fuse.search(trimmed);
  const matched = new Set<string>();
  const results: SearchMatchResult[] = [];

  fuseResults.forEach(r => {
    matched.add(r.item.id);
    let reason = `Matched title/brand "${trimmed}"`;
    if (r.item.ingredients.some(i => i.toLowerCase().includes(trimmed))) {
      reason = `Matched ingredient in ${r.item.name}`;
    } else if (r.item.category?.toLowerCase().includes(trimmed)) {
      reason = `Matched category: ${r.item.category}`;
    }

    results.push({
      product: r.item,
      score: r.score ?? 0.5,
      matchReason: reason,
    });
  });

  // Filter based on smart keywords if requested
  if (isHighProtein) {
    all.filter(p => (p.per100g.proteinG ?? 0) >= 10 && !matched.has(p.id)).forEach(p => {
      results.unshift({
        product: p,
        score: 0.1,
        matchReason: `High Protein: ${p.per100g.proteinG}g protein per 100g`,
      });
      matched.add(p.id);
    });
  }

  if (isLowSugar) {
    all.filter(p => (p.per100g.totalSugarG ?? 99) <= 5 && !matched.has(p.id)).forEach(p => {
      results.unshift({
        product: p,
        score: 0.1,
        matchReason: `Low Sugar: Only ${p.per100g.totalSugarG ?? 0}g sugar per 100g`,
      });
      matched.add(p.id);
    });
  }

  if (isHighFibre) {
    all.filter(p => (p.per100g.fibreG ?? 0) >= 5 && !matched.has(p.id)).forEach(p => {
      results.unshift({
        product: p,
        score: 0.1,
        matchReason: `High Fibre: ${p.per100g.fibreG}g dietary fibre per 100g`,
      });
      matched.add(p.id);
    });
  }

  if (isBestValue) {
    all.filter(p => (p.nutritionPerPaisa.proteinPerRupee ?? 0) >= 0.35 && !matched.has(p.id)).forEach(p => {
      results.unshift({
        product: p,
        score: 0.1,
        matchReason: `Best Value: ₹1 buys ${p.nutritionPerPaisa.proteinPerRupee}g protein`,
      });
      matched.add(p.id);
    });
  }

  return results;
}
