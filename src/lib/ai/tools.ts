import { Product } from '../../types/product';
import { getAllProducts, getProductBySlug } from '../products';

export const productTools = {
  search_products: {
    description: 'Search for products in the WiseFoodies database by name, brand, or characteristics.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The product name, brand, or search term' },
      },
      required: ['query'],
    },
    execute: async ({ query }: { query: string }) => {
      const products = await getAllProducts();
      // Simple filter for demo; in real use, use lib/ai/matcher.ts
      const results = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      );
      return results.map(p => ({ slug: p.slug, name: p.name, brand: p.brand, fbs: p.fbs.score }));
    },
  },
  get_product: {
    description: 'Get the full detailed report for a specific product by its slug.',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The unique product slug' },
      },
      required: ['slug'],
    },
    execute: async ({ slug }: { slug: string }) => {
      const product = await getProductBySlug(slug);
      return product || { error: 'Product not found' };
    },
  },
  compare_products: {
    description: 'Compare 2 to 4 products side-by-side.',
    parameters: {
      type: 'object',
      properties: {
        slugs: { type: 'array', items: { type: 'string' }, description: 'List of product slugs to compare' },
      },
      required: ['slugs'],
    },
    execute: async ({ slugs }: { slugs: string[] }) => {
      const products = await Promise.all(slugs.map(slug => getProductBySlug(slug)));
      return products.filter(Boolean);
    },
  },
  find_alternatives: {
    description: 'Find smarter healthier alternatives for a given product in the same category.',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The product slug to find alternatives for' },
        mode: {
          type: 'string',
          enum: ['overall', 'fbs', 'sugar', 'protein', 'sodium', 'cheaper', 'value'],
          description: 'Alternative ranking mode',
        },
      },
      required: ['slug'],
    },
    execute: async ({ slug, mode }: { slug: string; mode?: any }) => {
      const target = await getProductBySlug(slug);
      if (!target) return { error: 'Product not found' };
      const all = await getAllProducts();
      const { findAlternatives } = await import('../../lib/alternatives');
      const res = findAlternatives(target, all, { mode });
      return {
        statusMessage: res.statusMessage,
        isTargetTopTier: res.isTargetTopTier,
        suggestions: res.suggestions.map(s => ({
          name: s.product.name,
          brand: s.product.brand,
          slug: s.product.slug,
          fbs: s.product.fbs.score,
          primaryAdvantage: s.primaryAdvantage,
          deltas: s.delta,
          reasons: s.reasons,
        })),
      };
    },
  },
  get_cart: {
    description: 'Calculate comprehensive nutritional totals, calorie-weighted FBS, and value intelligence for a user basket.',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              slug: { type: 'string' },
              quantity: { type: 'number' },
            },
            required: ['slug'],
          },
          description: 'List of product items and quantities in the basket',
        },
      },
      required: ['items'],
    },
    execute: async ({ items }: { items: Array<{ slug: string; quantity?: number }> }) => {
      const all = await getAllProducts();
      const { computeBasketSummary } = await import('../../lib/cart');
      const cartItems = items.map((i) => ({
        slug: i.slug,
        quantity: i.quantity || 1,
        addedAt: Date.now(),
      }));
      const summary = computeBasketSummary(cartItems, all);
      return {
        totalPacks: summary.totalPacks,
        totalPriceINR: summary.totalPriceINR,
        totalCaloriesKcal: summary.totalCaloriesKcal,
        totalProteinG: summary.totalProteinG,
        totalSugarG: summary.totalSugarG,
        totalAddedSugarG: summary.totalAddedSugarG,
        totalSodiumMg: summary.totalSodiumMg,
        basketFBS: summary.basketFBS,
        proteinPer10INR: summary.proteinPer10INR,
        categoryMix: summary.categoryMix,
        draggingDownItems: summary.draggingDownItems.map((d) => ({
          name: d.product.name,
          score: d.score,
          reason: d.reason,
        })),
      };
    },
  },
  suggest_swaps: {
    description: 'Find deterministic smart swaps that elevate the basket Food Benefit Score (FBS) with measured nutritional deltas.',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              slug: { type: 'string' },
              quantity: { type: 'number' },
            },
            required: ['slug'],
          },
          description: 'List of product items and quantities in the basket',
        },
      },
      required: ['items'],
    },
    execute: async ({ items }: { items: Array<{ slug: string; quantity?: number }> }) => {
      const all = await getAllProducts();
      const { computeBasketSwaps } = await import('../../lib/cart');
      const cartItems = items.map((i) => ({
        slug: i.slug,
        quantity: i.quantity || 1,
        addedAt: Date.now(),
      }));
      const swaps = computeBasketSwaps(cartItems, all);
      return swaps.map((s) => ({
        from: s.originalProduct.name,
        to: s.suggestedProduct.name,
        currentBasketFBS: s.currentBasketFBS,
        projectedBasketFBS: s.projectedBasketFBS,
        deltaBasketFBS: s.deltaBasketFBS,
        deltaPriceINR: s.deltaPriceINR,
        deltaSugarG: s.deltaSugarG,
        deltaProteinG: s.deltaProteinG,
        reason: s.reason,
      }));
    },
  },
};

