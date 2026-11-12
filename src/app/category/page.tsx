import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

export const metadata: Metadata = {
  title: 'Food Categories | Indian Packaged Food Intelligence | WiseFoodies',
  description:
    'Explore 13 Indian packaged food categories including Biscuits, Chocolate, Dairy, Snacks, Juices, and Instant Foods with verified nutritional facts.',
};

export default function CategoryIndexPage() {
  const categories = packagedFoodDb.getCategories();
  const totalProducts = packagedFoodDb.getAll().length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      {/* Hero Header */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span>Category Directory</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight leading-tight mb-3">
          All 13 Food Categories
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl font-medium leading-relaxed">
          Browse {totalProducts} verified products organized into 13 dynamic categories. Every category dynamically lists brand distributions, average nutritional metrics, and product listings.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <h2 className="font-serif font-bold text-xl text-on-surface group-hover:text-primary transition-colors mb-1">
                {cat.name}
              </h2>
              <p className="text-xs font-bold text-primary mb-3">
                {cat.productCount} products &middot; {cat.brands.length} brands
              </p>
              <div className="flex flex-wrap gap-1">
                {cat.brands.slice(0, 4).map(b => (
                  <span
                    key={b}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface-variant"
                  >
                    {b}
                  </span>
                ))}
                {cat.brands.length > 4 && (
                  <span className="text-[10px] font-medium text-outline self-center">
                    +{cat.brands.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-primary">
              <span>Explore Category</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
