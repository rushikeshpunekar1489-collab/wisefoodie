'use client';

import React, { useState, useMemo } from 'react';
import type { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, Sparkles, X, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface ExploreClientProps {
  initialProducts: Product[];
  sampleProducts: Product[];
  categories: Array<{ name: string; slug: string; count: number; icon?: string }>;
}

export default function ExploreClient({
  initialProducts,
  sampleProducts,
  categories,
}: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minFBS, setMinFBS] = useState<number>(0);
  const [includeSamples, setIncludeSamples] = useState(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'protein' | 'sugar' | 'vitality' | 'budget'>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [initialProducts]);

  // Combine products based on sample toggle
  const availablePool = useMemo(() => {
    return includeSamples ? [...initialProducts, ...sampleProducts] : initialProducts;
  }, [initialProducts, sampleProducts, includeSamples]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return availablePool
      .filter((p) => {
        // Quick preset filter
        if (activeQuickFilter === 'protein') {
          if ((p.per100g.proteinG ?? 0) < 8) return false;
        } else if (activeQuickFilter === 'sugar') {
          if ((p.per100g.totalSugarG ?? 99) > 5) return false;
        } else if (activeQuickFilter === 'vitality') {
          if ((p.fbs.score ?? 0) < 7.0) return false;
        } else if (activeQuickFilter === 'budget') {
          if (!p.priceINR || p.priceINR > 50) return false;
        }

        // Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesBrand = p.brand.toLowerCase().includes(q);
          const matchesCat = p.category?.toLowerCase().includes(q);
          if (!matchesName && !matchesBrand && !matchesCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        // Min FBS filter
        if (minFBS > 0) {
          if (p.fbs.score === null || p.fbs.score < minFBS) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fbs-desc') {
          return (b.fbs.score ?? 0) - (a.fbs.score ?? 0);
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'brand-asc') {
          return a.brand.localeCompare(b.brand);
        }
        if (sortBy === 'protein-desc') {
          return (b.per100g.proteinG ?? 0) - (a.per100g.proteinG ?? 0);
        }
        return 0;
      });
  }, [
    availablePool,
    activeQuickFilter,
    searchQuery,
    selectedCategory,
    selectedBrand,
    minFBS,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinFBS(0);
    setActiveQuickFilter('all');
    setSortBy('default');
  };

  return (
    <div className="space-y-8 container max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-[var(--ink)]">
        <div>
          <div className="chip mb-2 bg-[var(--leaf)] text-white">
            <Sparkles className="w-3.5 h-3.5" /> Full Food Directory
          </div>
          <h1 className="t-display-lg text-[var(--ink)]">Explore DB</h1>
          <p className="t-body font-semibold opacity-75 mt-1">
            Browse all <strong className="text-[var(--ink)]">{filteredProducts.length}</strong> catalog items with verified nutritional facts and Food Benefit Scores.
          </p>
        </div>

        {/* Sample benchmark toggle */}
        <div className="flex items-center gap-2">
          <label className="chip cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSamples}
              onChange={(e) => setIncludeSamples(e.target.checked)}
              className="mr-1.5 accent-[var(--leaf)] cursor-pointer"
            />
            <span>Include Benchmarks ({sampleProducts.length})</span>
          </label>
        </div>
      </div>

      {/* Quick Filter Chips (Reference UI Style) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveQuickFilter('all')}
          className="chip"
          style={{
            background: activeQuickFilter === 'all' ? 'var(--leaf)' : 'var(--surface)',
            color: activeQuickFilter === 'all' ? 'white' : 'var(--ink)',
          }}
        >
          All Items ({availablePool.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveQuickFilter('protein')}
          className="chip"
          style={{
            background: activeQuickFilter === 'protein' ? 'var(--sky)' : 'var(--surface)',
            color: 'var(--ink)',
          }}
        >
          ⚡ High Protein (≥8g)
        </button>

        <button
          type="button"
          onClick={() => setActiveQuickFilter('sugar')}
          className="chip"
          style={{
            background: activeQuickFilter === 'sugar' ? 'var(--mint)' : 'var(--surface)',
            color: 'var(--ink)',
          }}
        >
          🍃 Low Sugar (≤5g)
        </button>

        <button
          type="button"
          onClick={() => setActiveQuickFilter('vitality')}
          className="chip"
          style={{
            background: activeQuickFilter === 'vitality' ? 'var(--mango)' : 'var(--surface)',
            color: 'var(--ink)',
          }}
        >
          👑 Top Vitality (FBS ≥ 7.0)
        </button>

        <button
          type="button"
          onClick={() => setActiveQuickFilter('budget')}
          className="chip"
          style={{
            background: activeQuickFilter === 'budget' ? 'var(--bubblegum)' : 'var(--surface)',
            color: 'var(--ink)',
          }}
        >
          🪙 Under ₹50
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="w-5 h-5 text-[var(--ink)] opacity-50 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search biscuit, wafer, sauce, chips..."
            className="w-full pl-11 pr-10 py-3 text-base font-semibold bg-[var(--surface)] border-3 border-[var(--ink)] rounded-2xl shadow-[var(--shadow-hard)] focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-[var(--ink)] opacity-50 hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Sort dropdown */}
          <div className="relative flex-1 md:w-56">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-3 px-4 text-xs font-black uppercase bg-[var(--surface)] border-3 border-[var(--ink)] rounded-2xl shadow-[var(--shadow-hard)] text-[var(--ink)] focus:outline-hidden cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="fbs-desc">FBS Score: High to Low</option>
              <option value="protein-desc">Protein: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="brand-asc">Brand: A to Z</option>
            </select>
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden btn-chunky py-3 px-4 text-xs"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bubble-card space-y-6 h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--ink)]/15">
            <h3 className="font-extrabold text-[var(--ink)] text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--leaf)]" /> Refine Database
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-black text-[var(--ink)] opacity-60 hover:opacity-100 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--ink)] opacity-70 block">
              Grocery Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-[var(--surface-alt)] border-2 border-[var(--ink)] rounded-xl text-[var(--ink)] focus:bg-[var(--surface)]"
            >
              <option value="all">
                All Categories ({categories.reduce((a, b) => a + b.count, 0)})
              </option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.icon} {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--ink)] opacity-70 block">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-[var(--surface-alt)] border-2 border-[var(--ink)] rounded-xl text-[var(--ink)] focus:bg-[var(--surface)]"
            >
              <option value="all">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum FBS Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black">
              <span className="uppercase tracking-wider text-[var(--ink)] opacity-70">
                Min. FBS Score
              </span>
              <span className="text-[var(--leaf)] font-black">
                {minFBS > 0 ? `${minFBS}.0+` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              value={minFBS}
              onChange={(e) => setMinFBS(Number(e.target.value))}
              className="w-full accent-[var(--leaf)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-black opacity-50">
              <span>All</span>
              <span>5.0 (Moderate)</span>
              <span>8.0+ (Top)</span>
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-3 space-y-6">
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bubble-card text-center py-16 px-4 space-y-4">
              <span className="text-4xl block">🔍</span>
              <h3 className="t-h3">No foods match your filters</h3>
              <p className="text-sm font-semibold opacity-70 max-w-sm mx-auto">
                Try clearing your search query or reset filters to display the full catalog.
              </p>
              <button onClick={resetFilters} className="btn-chunky btn-primary py-2.5 px-6 text-xs">
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
