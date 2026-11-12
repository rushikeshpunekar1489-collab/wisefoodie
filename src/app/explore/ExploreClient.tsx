'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import {
  Search,
  Filter,
  Sparkles,
  X,
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  INGREDIENT_TAGS,
  filterProductsByIngredients,
  parseNaturalLanguageIngredientQuery,
  ALLERGEN_DISCLAIMER,
  matchProductIngredientTag,
} from '@/lib/ingredients';

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
  const [activeQuickFilter, setActiveQuickFilter] = useState<
    'all' | 'protein' | 'sugar' | 'vitality' | 'budget'
  >('all');
  const [containsTags, setContainsTags] = useState<string[]>([]);
  const [doesNotContainTags, setDoesNotContainTags] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showUnknownAccordion, setShowUnknownAccordion] = useState(false);
  const [visibleCount, setVisibleCount] = useState(48);

  React.useEffect(() => {
    setVisibleCount(48);
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    minFBS,
    activeQuickFilter,
    sortBy,
    includeSamples,
    containsTags,
    doesNotContainTags,
  ]);

  // Natural language query detection
  const detectedNLFilter = useMemo(() => {
    return parseNaturalLanguageIngredientQuery(searchQuery);
  }, [searchQuery]);

  // Effective tags (combines manual tag toggles with natural query detection)
  const effectiveContainsTags = useMemo(() => {
    const set = new Set(containsTags);
    if (detectedNLFilter && detectedNLFilter.type === 'contains') {
      set.add(detectedNLFilter.tagId);
    }
    return Array.from(set);
  }, [containsTags, detectedNLFilter]);

  const effectiveDoesNotContainTags = useMemo(() => {
    const set = new Set(doesNotContainTags);
    if (detectedNLFilter && detectedNLFilter.type === 'does_not_contain') {
      set.add(detectedNLFilter.tagId);
    }
    return Array.from(set);
  }, [doesNotContainTags, detectedNLFilter]);

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

  // Compute tag counts in available pool
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tag of INGREDIENT_TAGS) {
      counts[tag.id] = availablePool.filter(
        (p) => matchProductIngredientTag(p, tag.id).matches
      ).length;
    }
    return counts;
  }, [availablePool]);

  // Filter & Sort logic
  const { filteredProducts, unknownProducts, matchReasons, activeAllergensSelected } = useMemo(() => {
    // 1. First apply standard text, category, brand, and FBS filters
    const baseFiltered = availablePool.filter((p) => {
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

      // Query filter (if not completely handled as an ingredient query)
      if (searchQuery.trim() && !detectedNLFilter) {
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
    });

    // 2. Apply Ingredient Filters with strict accuracy rule
    const ingResult = filterProductsByIngredients(baseFiltered, {
      containsTags: effectiveContainsTags,
      doesNotContainTags: effectiveDoesNotContainTags,
    });

    // 3. Sort
    const sorted = [...ingResult.matchedProducts].sort((a, b) => {
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

    return {
      filteredProducts: sorted,
      unknownProducts: ingResult.unknownProducts,
      matchReasons: ingResult.matchReasons,
      activeAllergensSelected: ingResult.activeAllergensSelected,
    };
  }, [
    availablePool,
    activeQuickFilter,
    searchQuery,
    detectedNLFilter,
    selectedCategory,
    selectedBrand,
    minFBS,
    effectiveContainsTags,
    effectiveDoesNotContainTags,
    sortBy,
  ]);

  const toggleContainsTag = (tagId: string) => {
    setContainsTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
    // If it was in doesNotContain, remove it
    setDoesNotContainTags((prev) => prev.filter((t) => t !== tagId));
  };

  const toggleDoesNotContainTag = (tagId: string) => {
    setDoesNotContainTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
    // If it was in contains, remove it
    setContainsTags((prev) => prev.filter((t) => t !== tagId));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinFBS(0);
    setActiveQuickFilter('all');
    setSortBy('default');
    setContainsTags([]);
    setDoesNotContainTags([]);
  };

  return (
    <div className="space-y-8 container max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Forensic Food Directory
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary tracking-tight">Explore Food Intelligence</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Browse all <strong className="text-primary font-bold">{filteredProducts.length}</strong> catalog items with verified nutritional facts and Food Benefit Scores.
          </p>
        </div>

        {/* Sample benchmark toggle */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-on-surface bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30 cursor-pointer select-none flex items-center">
            <input
              type="checkbox"
              checked={includeSamples}
              onChange={(e) => setIncludeSamples(e.target.checked)}
              className="mr-2 accent-primary cursor-pointer rounded"
            />
            <span>Include Benchmarks ({sampleProducts.length})</span>
          </label>
        </div>
      </div>

      {/* Indian Packaged Food Database Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-700/80 text-emerald-100 text-xs font-bold px-2.5 py-0.5 rounded-full">
              <Layers className="w-3 h-3" /> 852 Products Dataset
            </span>
            <span className="text-xs text-emerald-200">262 Brands &bull; 13 Categories &bull; 25 Fields</span>
          </div>
          <p className="text-sm font-medium text-emerald-50">
            Looking for the full Indian Packaged Food Database? Search, filter, compare, and analyze all 852 Indian products.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shrink-0 shadow-sm"
        >
          Explore 852 Indian Products <ArrowRight className="w-4 h-4" />
        </Link>
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

      {/* Natural Language Query Indicator */}
      {detectedNLFilter && (
        <div className="p-3 bg-[var(--mint)] border-2 border-[var(--ink)] rounded-2xl flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-black text-[var(--ink)]">
            <Sparkles className="w-4 h-4 text-[var(--leaf)]" />
            <span>
              Smart Query Filter:{' '}
              {detectedNLFilter.type === 'does_not_contain' ? 'Free from' : 'Contains'}{' '}
              <strong className="underline decoration-2">
                {INGREDIENT_TAGS.find((t) => t.id === detectedNLFilter.tagId)?.label ||
                  detectedNLFilter.tagId}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="chip text-[11px] py-0.5 px-2 bg-white hover:bg-[var(--surface-alt)] font-bold cursor-pointer"
          >
            Clear Query
          </button>
        </div>
      )}

      {/* Allergen Warning Banner */}
      {activeAllergensSelected && (
        <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-amber-900 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{ALLERGEN_DISCLAIMER}</span>
        </div>
      )}

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="w-5 h-5 text-[var(--ink)] opacity-50 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search biscuit, oats, noodles, 'without palm oil', 'no added sugar'..."
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

          {/* INGREDIENT FILTERS: FREE FROM (DOES NOT CONTAIN) */}
          <div className="space-y-2 pt-2 border-t-2 border-[var(--ink)]/10">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--tomato)] flex items-center justify-between">
              <span>🚫 Free From (No ...)</span>
              {doesNotContainTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDoesNotContainTags([])}
                  className="text-[10px] lowercase font-bold underline opacity-70"
                >
                  clear
                </button>
              )}
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {INGREDIENT_TAGS.map((tag) => {
                const isSelected = effectiveDoesNotContainTags.includes(tag.id);
                return (
                  <button
                    key={`free-${tag.id}`}
                    type="button"
                    onClick={() => toggleDoesNotContainTag(tag.id)}
                    className={`chip text-[11px] py-1 px-2.5 transition-colors cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[var(--tomato)] text-white font-black'
                        : 'bg-white hover:bg-[var(--surface-alt)] font-semibold'
                    }`}
                  >
                    No {tag.label.split(' ')[0]}
                    <span className="opacity-50 text-[10px] ml-1">({tagCounts[tag.id] ?? 0})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* INGREDIENT FILTERS: CONTAINS */}
          <div className="space-y-2 pt-2 border-t-2 border-[var(--ink)]/10">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--leaf)] flex items-center justify-between">
              <span>🟢 Contains Ingredient</span>
              {containsTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setContainsTags([])}
                  className="text-[10px] lowercase font-bold underline opacity-70"
                >
                  clear
                </button>
              )}
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {INGREDIENT_TAGS.map((tag) => {
                const isSelected = effectiveContainsTags.includes(tag.id);
                return (
                  <button
                    key={`contains-${tag.id}`}
                    type="button"
                    onClick={() => toggleContainsTag(tag.id)}
                    className={`chip text-[11px] py-1 px-2.5 transition-colors cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[var(--leaf)] text-white font-black'
                        : 'bg-white hover:bg-[var(--surface-alt)] font-semibold'
                    }`}
                  >
                    {tag.label.split(' ')[0]}
                    <span className="opacity-50 text-[10px] ml-1">({tagCounts[tag.id] ?? 0})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid & Unknowns Disclosure */}
        <main className="lg:col-span-3 space-y-6">
          {/* Ingredients Unknown Section (Strict Accuracy Safeguard) */}
          {effectiveDoesNotContainTags.length > 0 && unknownProducts.length > 0 && (
            <div className="p-4 bg-[var(--surface-alt)] border-2 border-dashed border-[var(--ink)]/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-[var(--ink)]">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span>
                    Ingredients Unknown ({unknownProducts.length} items excluded)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUnknownAccordion(!showUnknownAccordion)}
                  className="text-xs font-bold underline text-[var(--ink)] cursor-pointer"
                >
                  {showUnknownAccordion ? 'Hide' : 'Review Excluded Items'}
                </button>
              </div>
              <p className="text-[11px] font-semibold opacity-70">
                <strong>Strict Accuracy Rule:</strong> These products are excluded from &quot;Doesn&apos;t contain&quot; results because their full ingredient lists are pending verification. We never falsely guarantee ingredients.
              </p>
              {showUnknownAccordion && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {unknownProducts.slice(0, 18).map((up) => (
                    <div
                      key={up.id}
                      className="text-xs font-bold truncate p-1.5 bg-white rounded-lg border border-[var(--ink)]/10"
                    >
                      {up.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {filteredProducts.slice(0, visibleCount).map((p) => {
                  const reasons = matchReasons.get(p.slug);
                  return (
                    <div key={p.id} className="flex flex-col">
                      {reasons && reasons.length > 0 && (
                        <div className="mb-1 px-1 text-[10px] font-extrabold flex items-center gap-1 text-[var(--leaf)] truncate">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>
                            {reasons[0].type === 'verified_free' ? 'Verified free of ' : 'Contains '}
                            {reasons[0].matchedTerm}
                          </span>
                        </div>
                      )}
                      <ProductCard product={p} />
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length > visibleCount && (
                <div className="bubble-card flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-[var(--surface)]">
                  <p className="text-xs font-bold text-[var(--ink)] opacity-70">
                    Showing{' '}
                    <span className="text-[var(--leaf)] font-black">
                      {Math.min(visibleCount, filteredProducts.length)}
                    </span>{' '}
                    of <span className="font-black">{filteredProducts.length}</span> foods
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 48)}
                      className="btn-chunky btn-secondary py-2 px-5 text-xs font-bold"
                    >
                      Load More (+48)
                    </button>
                    <button
                      onClick={() => setVisibleCount(filteredProducts.length)}
                      className="btn-chunky btn-primary py-2 px-5 text-xs font-bold"
                    >
                      View All ({filteredProducts.length})
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bubble-card text-center py-16 px-4 space-y-4">
              <span className="text-4xl block">🔍</span>
              <h3 className="t-h3">No foods match your filters</h3>
              <p className="text-sm font-semibold opacity-70 max-w-sm mx-auto">
                Try clearing your search query or reset ingredient filters to display the full catalog.
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
