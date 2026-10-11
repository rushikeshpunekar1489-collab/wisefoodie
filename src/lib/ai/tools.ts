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
};
