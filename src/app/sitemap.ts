import type { MetadataRoute } from 'next';
import { getAllProductsWithSamples, getCategories } from '@/lib/products';
import { LEARN_TOPICS } from '@/lib/learn';

function parseSafeDate(d?: string | null): Date {
  if (!d) return new Date('2026-11-11');
  const parsed = new Date(d);
  if (!isNaN(parsed.getTime())) return parsed;
  const parts = d.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d2 = new Date(year, month, day);
    if (!isNaN(d2.getTime())) return d2;
  }
  return new Date('2026-11-11');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000';
  const products = getAllProductsWithSamples();
  const categories = getCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/explore',
    '/products',
    '/category',
    '/compare',
    '/scanner',
    '/search',
    '/learn',
    '/how-fbs-works',
    '/about',
    '/disclaimer',
    '/privacy',
    '/terms',
    '/contact',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-11-11'),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
    url: `${baseUrl}/food/${p.slug}`,
    lastModified: parseSafeDate(p.lastUpdated),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map(c => ({
    url: `${baseUrl}/explore/${c.slug}`,
    lastModified: new Date('2026-10-10'),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const learnRoutes: MetadataRoute.Sitemap = LEARN_TOPICS.map(t => ({
    url: `${baseUrl}/learn/${t.slug}`,
    lastModified: new Date('2026-10-10'),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...learnRoutes];
}
