import type { Product } from '@/types/product';
import { getAllProductsWithSamples, getProductBySlug, getProductByBarcode } from '@/lib/products';
import { getSearchableDocuments } from '@/lib/ai/catalog';
import { loadKBChunks } from '@/lib/ai/kb';
import { findAlternatives } from '@/lib/alternatives';
import { computeBasketSummary, computeBasketSwaps } from '@/lib/cart';
import { calculateNutritionPerPaisa } from '@/lib/value';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (args: any) => Promise<any>;
}

export const tools: Record<string, ToolDefinition> = {
  // Tool 1: Lookup Product by Slug or Barcode
  lookup_product: {
    name: 'lookup_product',
    description: 'Lookup an exact product from the WiseFoodies catalog using its slug or barcode.',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Product slug (e.g., amul-taaza-toned-milk-1l)' },
        barcode: { type: 'string', description: 'EAN/UPC barcode number' },
      },
    },
    execute: async ({ slug, barcode }: { slug?: string; barcode?: string }) => {
      let product: Product | null = null;
      if (slug) product = getProductBySlug(slug);
      if (!product && barcode) product = getProductByBarcode(barcode);

      if (!product) {
        return { found: false, error: 'Product not found in WiseFoodies catalog.' };
      }

      return {
        found: true,
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          slug: product.slug,
          category: product.category,
          subcategory: product.subcategory,
          priceINR: product.priceINR,
          packSize: product.packSizeText || (product.packSizeG ? `${product.packSizeG}g` : null),
          fbs: product.fbs,
          per100g: product.per100g,
          ingredients: product.ingredients,
          benefits: product.benefits,
          concerns: product.concerns,
          verified: product.verification === 'complete',
        },
      };
    },
  },

  // Tool 2: Search Products
  search_products: {
    name: 'search_products',
    description: 'Search catalog by name, brand, category, or ingredients with optional sorting.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords, e.g. "oats", "peanut butter", "sugar-free biscuit"' },
        category: { type: 'string', description: 'Filter by category name' },
        brand: { type: 'string', description: 'Filter by brand name' },
        limit: { type: 'number', description: 'Max items to return (default 5, max 10)' },
      },
      required: ['query'],
    },
    execute: async ({ query, category, brand, limit = 5 }: { query: string; category?: string; brand?: string; limit?: number }) => {
      const docs = getSearchableDocuments();
      const q = query.toLowerCase().trim();
      const STOP_WORDS = new Set([
        'tell', 'me', 'about', 'what', 'is', 'the', 'of', 'in', 'and', 'for', 'with', 'from',
        'content', 'details', 'level', 'does', 'how', 'much', 'have', 'are', 'per', '100g',
        'clean', 'healthy', 'healthier', 'why', 'do', 'cause', 'impact', 'give', 'marked',
        'concerns', 'worth', 'money', 'compared', 'calculate', 'swap', 'which', 'less', 'has'
      ]);

      const significantTokens = q
        .split(/[^a-z0-9]+/i)
        .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));

      const scored = docs.map((d) => {
        if (category && !d.category.toLowerCase().includes(category.toLowerCase())) {
          return { doc: d, score: -1 };
        }
        if (brand && !d.brand.toLowerCase().includes(brand.toLowerCase())) {
          return { doc: d, score: -1 };
        }

        const nameLower = d.name.toLowerCase();
        const brandLower = d.brand.toLowerCase();
        const text = d.searchText;

        let score = 0;
        if (nameLower.includes(q)) score += 50;
        if (brandLower.includes(q)) score += 30;

        for (const tok of significantTokens) {
          if (nameLower.includes(tok)) score += 15;
          else if (brandLower.includes(tok)) score += 10;
          else if (text.includes(tok)) score += 2;
        }

        score += (d.fbsScore || 0) * 0.01;
        return { doc: d, score };
      });

      const matched = scored.filter((s) => s.score > 0);
      matched.sort((a, b) => b.score - a.score);

      const sliced = matched.slice(0, Math.min(limit, 10)).map((s) => s.doc);
      return {
        totalMatches: matched.length,
        results: sliced.map((d) => ({
          slug: d.slug,
          name: d.name,
          brand: d.brand,
          category: d.category,
          priceINR: d.priceINR,
          fbsScore: d.fbsScore,
          fbsBand: d.fbsBand,
          proteinG: d.per100g.proteinG,
          addedSugarG: d.per100g.addedSugarG,
          sodiumMg: d.per100g.sodiumMg,
        })),
      };
    },
  },

  // Tool 3: Compare Products
  compare_products: {
    name: 'compare_products',
    description: 'Compare 2 to 4 products side-by-side with nutritional deltas and FBS comparison.',
    parameters: {
      type: 'object',
      properties: {
        slugs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of 2 to 4 product slugs to compare',
        },
      },
      required: ['slugs'],
    },
    execute: async ({ slugs }: { slugs: string[] }) => {
      if (!Array.isArray(slugs) || slugs.length < 2) {
        return { error: 'Please provide at least 2 product slugs to compare.' };
      }

      const products = slugs.map((s) => getProductBySlug(s)).filter((p): p is Product => p !== null);
      if (products.length < 2) {
        return { error: 'Could not find at least 2 valid products for comparison.' };
      }

      return {
        productsCount: products.length,
        comparison: products.map((p) => ({
          name: p.name,
          brand: p.brand,
          slug: p.slug,
          priceINR: p.priceINR,
          fbs: p.fbs,
          energyKcal: p.per100g.energyKcal,
          proteinG: p.per100g.proteinG,
          totalSugarG: p.per100g.totalSugarG,
          addedSugarG: p.per100g.addedSugarG,
          satFatG: p.per100g.satFatG,
          sodiumMg: p.per100g.sodiumMg,
          fibreG: p.per100g.fibreG,
          benefits: p.benefits,
          concerns: p.concerns,
        })),
      };
    },
  },

  // Tool 4: Find Healthier Alternatives
  find_healthier_alternatives: {
    name: 'find_healthier_alternatives',
    description: 'Find healthier alternative swaps in the same category with higher FBS and lower sugar/sodium.',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Product slug to find healthier swaps for' },
        mode: {
          type: 'string',
          enum: ['overall', 'fbs', 'sugar', 'protein', 'sodium', 'cheaper', 'value'],
          description: 'Priority criteria for alternatives',
        },
      },
      required: ['slug'],
    },
    execute: async ({ slug, mode = 'overall' }: { slug: string; mode?: any }) => {
      const target = getProductBySlug(slug);
      if (!target) return { error: `Product with slug "${slug}" not found.` };

      const all = getAllProductsWithSamples();
      const res = findAlternatives(target, all, { mode });

      return {
        targetProduct: { name: target.name, brand: target.brand, fbs: target.fbs.score },
        isTargetTopTier: res.isTargetTopTier,
        statusMessage: res.statusMessage,
        alternatives: res.suggestions.map((s) => ({
          name: s.product.name,
          brand: s.product.brand,
          slug: s.product.slug,
          fbs: s.product.fbs.score,
          primaryAdvantage: s.primaryAdvantage,
          fbsDelta: s.delta.fbs,
          sugarDelta: s.delta.sugarG,
          proteinDelta: s.delta.proteinG,
          priceDelta: s.delta.priceINR,
          reasons: s.reasons,
        })),
      };
    },
  },

  // Tool 5: Explain FBS
  explain_fbs: {
    name: 'explain_fbs',
    description: 'Explain the Food Benefit Score (FBS) breakdown, formula, and factors for a product.',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Product slug to explain FBS breakdown for' },
      },
      required: ['slug'],
    },
    execute: async ({ slug }: { slug: string }) => {
      const product = getProductBySlug(slug);
      if (!product) return { error: `Product with slug "${slug}" not found.` };

      return {
        productName: product.name,
        brand: product.brand,
        score: product.fbs.score,
        band: product.fbs.band,
        positiveNutrients: {
          proteinG: product.per100g.proteinG,
          fibreG: product.per100g.fibreG,
        },
        penalizedNutrients: {
          addedSugarG: product.per100g.addedSugarG,
          satFatG: product.per100g.satFatG,
          sodiumMg: product.per100g.sodiumMg,
        },
        breakdownFactors: product.fbs.breakdown || [],
        disclaimer: 'FBS is an algorithmic informational score for food literacy, not a medical diagnosis.',
      };
    },
  },

  // Tool 6: Nutrition Per Paisa
  nutrition_per_paisa: {
    name: 'nutrition_per_paisa',
    description: 'Calculate nutritional value delivered per rupee/paisa spent (Protein per Rupee, Value Index).',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Product slug to calculate value metrics for' },
      },
      required: ['slug'],
    },
    execute: async ({ slug }: { slug: string }) => {
      const product = getProductBySlug(slug);
      if (!product) return { error: `Product with slug "${slug}" not found.` };

      const valueInfo = calculateNutritionPerPaisa(product);
      return {
        productName: product.name,
        brand: product.brand,
        priceINR: product.priceINR,
        packSize: product.packSizeText || (product.packSizeG ? `${product.packSizeG}g` : null),
        valueMetric: valueInfo,
      };
    },
  },

  // Tool 7: Query Knowledge Base
  query_knowledge_base: {
    name: 'query_knowledge_base',
    description: 'Search official WiseFoodies food literacy articles, how FBS works, ingredients, and FAQs.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Topic or question (e.g. "added sugar limit", "why palm oil is bad", "fbs formula")' },
      },
      required: ['query'],
    },
    execute: async ({ query }: { query: string }) => {
      const chunks = loadKBChunks();
      const q = query.toLowerCase();
      const tokens = q.split(/\s+/).filter(t => t.length > 2);

      const scored = chunks.map((c) => {
        let score = 0;
        if (c.searchText.includes(q)) score += 10;
        for (const tok of tokens) {
          if (c.searchText.includes(tok)) score += 2;
        }
        return { chunk: c, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const top = scored.filter(s => s.score > 0).slice(0, 3);

      return {
        resultsFound: top.length,
        articles: top.map(t => ({
          title: t.chunk.title,
          section: t.chunk.section,
          content: t.chunk.content.slice(0, 800),
        })),
      };
    },
  },

  // Tool 8: Analyze Basket
  analyze_basket: {
    name: 'analyze_basket',
    description: 'Analyze nutritional totals, calorie-weighted FBS, and dragging down items in a shopping basket.',
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
        },
      },
      required: ['items'],
    },
    execute: async ({ items }: { items: Array<{ slug: string; quantity?: number }> }) => {
      const all = getAllProductsWithSamples();
      const cartItems = items.map((i) => ({
        slug: i.slug,
        quantity: i.quantity || 1,
        addedAt: Date.now(),
      }));
      const summary = computeBasketSummary(cartItems, all);

      return {
        totalItems: summary.totalPacks,
        totalPriceINR: summary.totalPriceINR,
        totalCaloriesKcal: summary.totalCaloriesKcal,
        totalProteinG: summary.totalProteinG,
        totalSugarG: summary.totalSugarG,
        totalAddedSugarG: summary.totalAddedSugarG,
        totalSodiumMg: summary.totalSodiumMg,
        basketFBS: summary.basketFBS,
        draggingDownItems: summary.draggingDownItems.map(d => ({
          productName: d.product.name,
          score: d.score,
          reason: d.reason,
        })),
      };
    },
  },

  // Tool 9: Suggest Basket Swaps
  suggest_basket_swaps: {
    name: 'suggest_basket_swaps',
    description: 'Suggest high-impact product swaps to elevate total basket health score and reduce sugar.',
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
        },
      },
      required: ['items'],
    },
    execute: async ({ items }: { items: Array<{ slug: string; quantity?: number }> }) => {
      const all = getAllProductsWithSamples();
      const cartItems = items.map((i) => ({
        slug: i.slug,
        quantity: i.quantity || 1,
        addedAt: Date.now(),
      }));
      const swaps = computeBasketSwaps(cartItems, all);

      return {
        swapsCount: swaps.length,
        swaps: swaps.slice(0, 5).map((s) => ({
          from: s.originalProduct.name,
          to: s.suggestedProduct.name,
          fbsImprovement: s.deltaBasketFBS,
          sugarReductionG: s.deltaSugarG,
          priceDeltaINR: s.deltaPriceINR,
          reason: s.reason,
        })),
      };
    },
  },

  // Tool 10: Get Category Rankings
  get_category_rankings: {
    name: 'get_category_rankings',
    description: 'Get top healthiest products in a category by Food Benefit Score (FBS).',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category name (e.g. "Breakfast Cereals", "Dairy & Frozen", "Beverages")' },
        limit: { type: 'number', description: 'Number of top products (default 5)' },
      },
      required: ['category'],
    },
    execute: async ({ category, limit = 5 }: { category: string; limit?: number }) => {
      const docs = getSearchableDocuments();
      const catLower = category.toLowerCase().trim();

      const inCat = docs.filter(d => d.category.toLowerCase().includes(catLower));
      inCat.sort((a, b) => (b.fbsScore || 0) - (a.fbsScore || 0));

      const top = inCat.slice(0, Math.min(limit, 10));
      return {
        category,
        totalProductsInCategory: inCat.length,
        topRanked: top.map(p => ({
          name: p.name,
          brand: p.brand,
          slug: p.slug,
          fbsScore: p.fbsScore,
          fbsBand: p.fbsBand,
          proteinG: p.per100g.proteinG,
          addedSugarG: p.per100g.addedSugarG,
          priceINR: p.priceINR,
        })),
      };
    },
  },
};
