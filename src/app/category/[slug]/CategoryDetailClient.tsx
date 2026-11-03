'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Tag,
  ChevronDown,
} from 'lucide-react';
import type { PackagedFoodItem, CategorySummary } from '@/types/packaged-food';
import IndianFoodCard from '@/components/IndianFoodCard';
import IndianFoodCompareModal from '@/components/IndianFoodCompareModal';

interface Props {
  category: CategorySummary;
  products: PackagedFoodItem[];
}

export default function CategoryDetailClient({ category, products }: Props) {
  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [minCalories, setMinCalories] = useState<string>('');
  const [maxCalories, setMaxCalories] = useState<string>('');
  const [minProtein, setMinProtein] = useState<string>('');
  const [maxSugar, setMaxSugar] = useState<string>('');
  const [sortBy, setSortBy] = useState<'sno' | 'name' | 'brand' | 'calories' | 'protein' | 'sugar' | 'price'>('sno');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const limit = 24;

  const [comparing, setComparing] = useState<PackagedFoodItem[]>([]);

  // Filter products
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.brand.toLowerCase().includes(q) ||
          i.subCategory.toLowerCase().includes(q) ||
          i.ingredients.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.length > 0) {
      const bSet = new Set(selectedBrands.map(b => b.toUpperCase()));
      list = list.filter(i => bSet.has(i.brand.toUpperCase()));
    }

    if (minCalories !== '') {
      const val = parseFloat(minCalories);
      list = list.filter(i => i.caloriesKcal !== null && i.caloriesKcal >= val);
    }
    if (maxCalories !== '') {
      const val = parseFloat(maxCalories);
      list = list.filter(i => i.caloriesKcal !== null && i.caloriesKcal <= val);
    }
    if (minProtein !== '') {
      const val = parseFloat(minProtein);
      list = list.filter(i => i.proteinG !== null && i.proteinG >= val);
    }
    if (maxSugar !== '') {
      const val = parseFloat(maxSugar);
      list = list.filter(i => i.sugarG !== null && i.sugarG <= val);
    }

    const mult = sortOrder === 'desc' ? -1 : 1;
    list.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * mult;
        case 'brand':
          return a.brand.localeCompare(b.brand) * mult;
        case 'calories':
          return ((a.caloriesKcal ?? -1) - (b.caloriesKcal ?? -1)) * mult;
        case 'protein':
          return ((a.proteinG ?? -1) - (b.proteinG ?? -1)) * mult;
        case 'sugar':
          return ((a.sugarG ?? -1) - (b.sugarG ?? -1)) * mult;
        case 'price':
          return ((a.priceINR ?? -1) - (b.priceINR ?? -1)) * mult;
        case 'sno':
        default:
          return (a.sno - b.sno) * mult;
      }
    });

    return list;
  }, [products, search, selectedBrands, minCalories, maxCalories, minProtein, maxSugar, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const toggleBrand = (b: string) => {
    setSelectedBrands(prev => (prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]));
  };

  const toggleCompare = (p: PackagedFoodItem) => {
    setComparing(prev => {
      if (prev.some(x => x.id === p.id)) {
        return prev.filter(x => x.id !== p.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 products at the same time.');
        return prev;
      }
      return [...prev, p];
    });
  };

  const visibleBrands = useMemo(() => {
    if (!brandSearch.trim()) return category.brands;
    const q = brandSearch.toLowerCase().trim();
    return category.brands.filter(b => b.toLowerCase().includes(q));
  }, [category.brands, brandSearch]);

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="bubble-card bg-gradient-to-br from-[var(--surface)] to-[var(--mint)]/20 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-900 border-2 border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] flex items-center justify-center text-4xl">
            {category.icon}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[var(--leaf)]">
              Category Focus
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-stone-50">
              {category.name}
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed mb-6 font-medium">
          Showing {category.productCount} products across {category.brands.length} distinct Indian brands. Filter by brand or nutrient ranges to discover the healthiest options.
        </p>

        {/* Brand quick filter chips */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-stone-400 tracking-wider">
            Available Brands ({category.brands.length}):
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {category.brands.map(brand => {
              const active = selectedBrands.includes(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={`text-xs font-bold py-1 px-3 rounded-full border transition-all ${
                    active
                      ? 'bg-[var(--leaf)] text-white border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Filters & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="bubble-card p-5 bg-[var(--surface)] text-[var(--ink)] space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2 font-display font-black text-sm">
              <Filter className="w-4 h-4 text-[var(--leaf)]" />
              <span>Filter {category.name}</span>
            </div>
            {(selectedBrands.length > 0 || search || minCalories || maxCalories || minProtein || maxSugar) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBrands([]);
                  setSearch('');
                  setMinCalories('');
                  setMaxCalories('');
                  setMinProtein('');
                  setMaxSugar('');
                }}
                className="text-xs text-[var(--tomato)] font-bold hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search within category */}
          <div>
            <label className="text-xs font-bold block mb-1">Search within category</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Product or ingredient..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
              />
            </div>
          </div>

          {/* Brand Search */}
          <div>
            <label className="text-xs font-bold block mb-1">Filter Brand</label>
            <input
              type="text"
              placeholder="Search brand..."
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 mb-2"
            />
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {visibleBrands.map(b => (
                <label key={b} className="flex items-center gap-2 text-xs font-medium cursor-pointer p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => {
                      toggleBrand(b);
                      setPage(1);
                    }}
                    className="rounded text-[var(--leaf)]"
                  />
                  <span className="truncate">{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Nutritional Filters */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-3 space-y-3">
            <div>
              <label className="text-xs font-bold block mb-1">Max Sugar (g)</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={maxSugar}
                onChange={e => {
                  setMaxSugar(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Min Protein (g)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={minProtein}
                onChange={e => {
                  setMinProtein(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Calories (kcal)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minCalories}
                  onChange={e => {
                    setMinCalories(e.target.value);
                    setPage(1);
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxCalories}
                  onChange={e => {
                    setMaxCalories(e.target.value);
                    setPage(1);
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Listing */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] p-4 rounded-2xl border-2 border-stone-200 dark:border-stone-800">
            <div className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300">
              Showing <span className="font-extrabold text-stone-900 dark:text-stone-50">{filtered.length}</span> of {category.productCount} products in {category.name}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
              >
                <option value="sno">Default (S.No)</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="brand">Brand Name (A-Z)</option>
                <option value="protein">Protein (High to Low)</option>
                <option value="calories">Calories</option>
                <option value="sugar">Sugar (Low to High)</option>
                <option value="price">Price (₹ INR)</option>
              </select>

              <button
                type="button"
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                className="p-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
              >
                <ArrowUpDown className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              </button>
            </div>
          </div>

          {/* Grid */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginated.map(p => (
                <IndianFoodCard
                  key={p.id}
                  product={p}
                  highlightText={search}
                  isComparing={comparing.some(x => x.id === p.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="bubble-card p-12 text-center bg-[var(--surface)] text-[var(--ink)] space-y-4">
              <h3 className="font-display font-black text-xl">No products match your filters</h3>
              <p className="text-sm text-stone-500">Try loosening your search or brand filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-2xl border-2 border-stone-200 dark:border-stone-800">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="btn-chunky py-2 px-4 text-xs bg-stone-100 dark:bg-stone-800 disabled:opacity-40"
              >
                Previous
              </button>
              <div className="text-xs font-black">
                Page {page} of {totalPages}
              </div>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="btn-chunky py-2 px-4 text-xs bg-stone-100 dark:bg-stone-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <IndianFoodCompareModal
        selectedProducts={comparing}
        onRemove={id => setComparing(prev => prev.filter(p => p.id !== id))}
        onClear={() => setComparing([])}
      />
    </div>
  );
}
