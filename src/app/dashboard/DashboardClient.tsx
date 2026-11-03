'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Award,
  Flame,
  Droplets,
  Layers,
  Sparkles,
  Zap,
  ArrowUpRight,
  PieChart,
  Tag,
  CircleDollarSign,
} from 'lucide-react';
import type { AggregateStatistics } from '@/types/packaged-food';
import { CATEGORY_ICONS } from '@/lib/foodConstants';

interface Props {
  stats: AggregateStatistics;
}

export default function DashboardClient({ stats }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'pricing'>('overview');

  // Max value calculators for SVG bar ratios
  const maxCategoryCount = Math.max(...stats.categoriesDistribution.map(c => c.count), 1);
  const maxBrandCount = Math.max(...stats.topBrands.map(b => b.count), 1);
  const maxCaloriesCat = Math.max(...stats.avgCaloriesByCategory.map(c => c.avgCalories), 1);
  const maxProteinCat = Math.max(...stats.avgProteinByCategory.map(c => c.avgProtein), 1);
  const maxSugarCat = Math.max(...stats.avgSugarByCategory.map(c => c.avgSugar), 1);
  const maxPriceBucket = Math.max(...stats.priceDistribution.map(p => p.count), 1);

  return (
    <div className="space-y-8">
      {/* Dashboard Hero Header */}
      <div className="bubble-card bg-gradient-to-br from-[var(--surface)] to-[var(--mint)]/20 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--leaf)] text-white text-xs font-black uppercase tracking-wider mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dataset Intelligence Hub</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-stone-50 tracking-tight leading-none mb-2">
              Indian Packaged Food Analytics
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl font-medium leading-relaxed">
              Macro and micro trends across {stats.totalProducts} packaged foods, {stats.totalBrands} brands, and {stats.totalCategories} food categories in India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="btn-chunky py-2.5 px-4 bg-[var(--leaf)] text-white text-xs font-black flex items-center gap-1.5"
            >
              <span>Explore Products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 7 Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Products */}
        <div className="bubble-card p-4 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Products</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <span className="font-display font-black text-2xl lg:text-3xl text-stone-900 dark:text-stone-50">
              {stats.totalProducts}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Verified items</span>
          </div>
        </div>

        {/* Total Brands */}
        <div className="bubble-card p-4 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Brands</span>
            <Tag className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <span className="font-display font-black text-2xl lg:text-3xl text-stone-900 dark:text-stone-50">
              {stats.totalBrands}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Indian & Global</span>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bubble-card p-4 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Categories</span>
            <PieChart className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className="font-display font-black text-2xl lg:text-3xl text-stone-900 dark:text-stone-50">
              {stats.totalCategories}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Food classes</span>
          </div>
        </div>

        {/* Avg Calories */}
        <div className="bubble-card p-4 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Avg Calories</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl lg:text-3xl text-stone-900 dark:text-stone-50">
                {stats.avgCalories}
              </span>
              <span className="text-xs font-bold text-stone-400">kcal</span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">Per 100g / serv</span>
          </div>
        </div>

        {/* Avg Protein */}
        <div className="bubble-card p-4 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Avg Protein</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl lg:text-3xl text-stone-900 dark:text-stone-50">
                {stats.avgProtein}
              </span>
              <span className="text-xs font-bold text-stone-400">g</span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">Macro strength</span>
          </div>
        </div>

        {/* Avg Sugar */}
        <div className="bubble-card p-4 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Avg Sugar</span>
            <Droplets className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl lg:text-3xl text-stone-900 dark:text-stone-50">
                {stats.avgSugar}
              </span>
              <span className="text-xs font-bold text-stone-400">g</span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">Total sugar</span>
          </div>
        </div>

        {/* Avg Price */}
        <div className="bubble-card p-4 bg-[var(--surface)] text-[var(--ink)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Avg Price</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl lg:text-3xl text-stone-900 dark:text-stone-50">
                ₹{stats.avgPrice}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">Retail declared</span>
          </div>
        </div>
      </div>

      {/* 6 Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Products by Category */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-display font-black text-lg text-stone-900 dark:text-stone-50">
                1. Products by Category
              </h2>
              <p className="text-xs text-stone-500">Distribution of all 852 products across 13 categories</p>
            </div>
            <Layers className="w-5 h-5 text-[var(--leaf)]" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.categoriesDistribution.map(cat => {
              const pct = Math.round((cat.count / maxCategoryCount) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-stone-500 shrink-0">{cat.count} products</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[var(--leaf)] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Top Brands by Catalog Size */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-display font-black text-lg text-stone-900 dark:text-stone-50">
                2. Products by Brand (Top 15)
              </h2>
              <p className="text-xs text-stone-500">Highest product count brand representation</p>
            </div>
            <Tag className="w-5 h-5 text-sky-500" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.topBrands.map((b, idx) => {
              const pct = Math.round((b.count / maxBrandCount) * 100);
              return (
                <div key={b.brand} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="truncate">
                      <span className="text-stone-400 font-mono mr-2">#{idx + 1}</span>
                      {b.brand}
                    </span>
                    <span className="font-mono text-stone-500 shrink-0">{b.count} products</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Average Calories by Category */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-display font-black text-lg text-stone-900 dark:text-stone-50">
                3. Average Calories by Category
              </h2>
              <p className="text-xs text-stone-500">Mean energy density (kcal / 100g)</p>
            </div>
            <Flame className="w-5 h-5 text-rose-500" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.avgCaloriesByCategory.map(cat => {
              const pct = Math.round((cat.avgCalories / maxCaloriesCat) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-stone-500 shrink-0">{cat.avgCalories} kcal</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Average Protein by Category */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-display font-black text-lg text-stone-900 dark:text-stone-50">
                4. Average Protein by Category
              </h2>
              <p className="text-xs text-stone-500">Mean protein concentration (g / 100g)</p>
            </div>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.avgProteinByCategory.map(cat => {
              const pct = Math.round((cat.avgProtein / maxProteinCat) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-stone-500 shrink-0">{cat.avgProtein} g</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 5: Average Sugar by Category */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-display font-black text-lg text-stone-900 dark:text-stone-50">
                5. Average Sugar by Category
              </h2>
              <p className="text-xs text-stone-500">Sugar concentration ranking (g / 100g)</p>
            </div>
            <Droplets className="w-5 h-5 text-rose-500" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.avgSugarByCategory.map(cat => {
              const pct = Math.round((cat.avgSugar / maxSugarCat) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-stone-500 shrink-0">{cat.avgSugar} g</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 6: Price Distribution */}
        <div className="bubble-card p-6 bg-[var(--surface)] text-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-display font-black text-lg text-stone-900 dark:text-stone-50">
                6. Price Distribution
              </h2>
              <p className="text-xs text-stone-500">Retail price tier segmentation across dataset</p>
            </div>
            <CircleDollarSign className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="space-y-3 pt-2">
            {stats.priceDistribution.map(bucket => {
              const pct = Math.round((bucket.count / maxPriceBucket) * 100);
              return (
                <div key={bucket.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-800 dark:text-stone-200">{bucket.range}</span>
                    <span className="font-mono text-stone-500 shrink-0">{bucket.count} products</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
