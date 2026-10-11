import type { MetadataRoute } from 'next';
import { getAllProductsWithSamples, getCategories } from '@/lib/products';
import { LEARN_TOPICS } from '@/lib/learn';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000';
  const products = getAllProductsWithSamples();
  const categories = getCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/explore',
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
    lastModified: new Date('2026-10-10'),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
    url: `${baseUrl}/food/${p.slug}`,
    lastModified: new Date(p.lastUpdated || Date.now()),
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
