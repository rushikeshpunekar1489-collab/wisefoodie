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
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              <span>Dataset Intelligence Hub</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight leading-tight mb-2">
              Indian Packaged Food Analytics
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl font-medium leading-relaxed">
              Macro and micro trends across {stats.totalProducts} packaged foods, {stats.totalBrands} brands, and {stats.totalCategories} food categories in India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="py-2.5 px-5 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center gap-1.5 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
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
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Products</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl lg:text-3xl text-primary">
              {stats.totalProducts}
            </span>
            <span className="text-[10px] text-outline block mt-0.5">Verified items</span>
          </div>
        </div>

        {/* Total Brands */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Brands</span>
            <Tag className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl lg:text-3xl text-primary">
              {stats.totalBrands}
            </span>
            <span className="text-[10px] text-outline block mt-0.5">Indian & Global</span>
          </div>
        </div>

        {/* Total Categories */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Categories</span>
            <PieChart className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl lg:text-3xl text-primary">
              {stats.totalCategories}
            </span>
            <span className="text-[10px] text-outline block mt-0.5">Distinct segments</span>
          </div>
        </div>

        {/* Avg Calories */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Energy</span>
            <Flame className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-bold text-2xl lg:text-3xl text-primary">
                {stats.avgCalories}
              </span>
              <span className="text-xs font-semibold text-outline">kcal</span>
            </div>
            <span className="text-[10px] text-outline block mt-0.5">per 100g</span>
          </div>
        </div>

        {/* Avg Protein */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Protein</span>
            <Award className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-bold text-2xl lg:text-3xl text-primary">
                {stats.avgProtein}
              </span>
              <span className="text-xs font-semibold text-outline">g</span>
            </div>
            <span className="text-[10px] text-outline block mt-0.5">per 100g</span>
          </div>
        </div>

        {/* Avg Sugar */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Sugar</span>
            <Droplets className="w-4 h-4 text-error" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-bold text-2xl lg:text-3xl text-error">
                {stats.avgSugar}
              </span>
              <span className="text-xs font-semibold text-outline">g</span>
            </div>
            <span className="text-[10px] text-outline block mt-0.5">Total sugar</span>
          </div>
        </div>

        {/* Avg Price */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Price</span>
            <CircleDollarSign className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-bold text-2xl lg:text-3xl text-primary">
                ₹{stats.avgPrice}
              </span>
            </div>
            <span className="text-[10px] text-outline block mt-0.5">Retail declared</span>
          </div>
        </div>
      </div>

      {/* 6 Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Products by Category */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">
                1. Products by Category
              </h2>
              <p className="text-xs text-on-surface-variant">Distribution of all 852 products across 13 categories</p>
            </div>
            <Layers className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.categoriesDistribution.map(cat => {
              const pct = Math.round((cat.count / maxCategoryCount) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 truncate text-on-surface">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-outline shrink-0">{cat.count} products</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Top Brands by Catalog Size */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">
                2. Products by Brand (Top 15)
              </h2>
              <p className="text-xs text-on-surface-variant">Highest product count brand representation</p>
            </div>
            <Tag className="w-5 h-5 text-secondary" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.topBrands.map((b, idx) => {
              const pct = Math.round((b.count / maxBrandCount) * 100);
              return (
                <div key={b.brand} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="truncate text-on-surface">
                      <span className="text-outline font-mono mr-2">#{idx + 1}</span>
                      {b.brand}
                    </span>
                    <span className="font-mono text-outline shrink-0">{b.count} products</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Average Calories by Category */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">
                3. Average Calories by Category
              </h2>
              <p className="text-xs text-on-surface-variant">Mean energy density (kcal / 100g)</p>
            </div>
            <Flame className="w-5 h-5 text-secondary" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.avgCaloriesByCategory.map(cat => {
              const pct = Math.round((cat.avgCalories / maxCaloriesCat) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 truncate text-on-surface">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-outline shrink-0">{cat.avgCalories} kcal</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Average Protein by Category */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">
                4. Average Protein by Category
              </h2>
              <p className="text-xs text-on-surface-variant">Mean protein concentration (g / 100g)</p>
            </div>
            <Award className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.avgProteinByCategory.map(cat => {
              const pct = Math.round((cat.avgProtein / maxProteinCat) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 truncate text-on-surface">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-outline shrink-0">{cat.avgProtein} g</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 5: Average Sugar by Category */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">
                5. Average Sugar by Category
              </h2>
              <p className="text-xs text-on-surface-variant">Sugar concentration ranking (g / 100g)</p>
            </div>
            <Droplets className="w-5 h-5 text-error" />
          </div>

          <div className="space-y-2.5 pt-2">
            {stats.avgSugarByCategory.map(cat => {
              const pct = Math.round((cat.avgSugar / maxSugarCat) * 100);
              const icon = CATEGORY_ICONS[cat.category] || '🍽️';
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 truncate text-on-surface">
                      <span>{icon}</span>
                      <span className="truncate">{cat.category}</span>
                    </span>
                    <span className="font-mono text-outline shrink-0">{cat.avgSugar} g</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-error/70 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 6: Price Distribution */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">
                6. Price Distribution
              </h2>
              <p className="text-xs text-on-surface-variant">Retail price tier segmentation across dataset</p>
            </div>
            <CircleDollarSign className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-3 pt-2">
            {stats.priceDistribution.map(bucket => {
              const pct = Math.round((bucket.count / maxPriceBucket) * 100);
              return (
                <div key={bucket.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-on-surface">{bucket.range}</span>
                    <span className="font-mono text-outline shrink-0">{bucket.count} products</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
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
