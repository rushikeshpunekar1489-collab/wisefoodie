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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bubble-card bg-gradient-to-br from-[var(--surface)] to-[var(--mint)]/20 p-6 md:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--leaf)] text-white text-xs font-black uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Category Directory</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-stone-50 tracking-tight leading-none mb-3">
          All 13 Food Categories
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl font-medium leading-relaxed">
          Browse {totalProducts} verified products organized into 13 dynamic categories. Every category dynamically lists brand distributions, average nutritional metrics, and product listings.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--ink)] transition-all group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h2 className="font-display font-black text-xl text-stone-900 dark:text-stone-50 group-hover:text-[var(--leaf)] transition-colors mb-1">
                {cat.name}
              </h2>
              <p className="text-xs font-extrabold text-[var(--leaf)] mb-3">
                {cat.productCount} products • {cat.brands.length} brands
              </p>
              <div className="flex flex-wrap gap-1">
                {cat.brands.slice(0, 4).map(b => (
                  <span
                    key={b}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                  >
                    {b}
                  </span>
                ))}
                {cat.brands.length > 4 && (
                  <span className="text-[10px] font-bold text-stone-400 self-center">
                    +{cat.brands.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[var(--leaf)]">
              <span>Explore Category</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
