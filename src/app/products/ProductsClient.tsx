'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import type {
  PackagedFoodItem,
  CategorySummary,
  BrandSummary,
  ProductFilters,
} from '@/types/packaged-food';
import IndianFoodCard from '@/components/IndianFoodCard';
import IndianFoodCompareModal from '@/components/IndianFoodCompareModal';

interface Props {
  initialProducts: PackagedFoodItem[];
  totalProducts: number;
  categories: CategorySummary[];
  brands: BrandSummary[];
}

export default function ProductsClient({
  initialProducts,
  totalProducts,
  categories,
  brands,
}: Props) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');

  // Nutrient Ranges
  const [minCalories, setMinCalories] = useState<string>('');
  const [maxCalories, setMaxCalories] = useState<string>('');
  const [minProtein, setMinProtein] = useState<string>('');
  const [maxProtein, setMaxProtein] = useState<string>('');
  const [minSugar, setMinSugar] = useState<string>('');
  const [maxSugar, setMaxSugar] = useState<string>('');
  const [minSodium, setMinSodium] = useState<string>('');
  const [maxSodium, setMaxSodium] = useState<string>('');
  const [minFiber, setMinFiber] = useState<string>('');
  const [maxFiber, setMaxFiber] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Sorting & Pagination
  const [sortBy, setSortBy] = useState<'sno' | 'name' | 'brand' | 'calories' | 'protein' | 'sugar' | 'price'>('sno');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const limit = 24;

  // Compare List
  const [comparingProducts, setComparingProducts] = useState<PackagedFoodItem[]>([]);

  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions based on query
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const matched = new Set<string>();
    // Check categories
    categories.forEach(c => {
      if (c.name.toLowerCase().includes(q)) matched.add(c.name);
    });
    // Check brands
    brands.forEach(b => {
      if (b.name.toLowerCase().includes(q) && matched.size < 6) matched.add(b.name);
    });
    // Check products
    initialProducts.forEach(p => {
      if (p.name.toLowerCase().includes(q) && matched.size < 10) matched.add(p.name);
    });

    setSuggestions(Array.from(matched));
  }, [searchQuery, categories, brands, initialProducts]);

  // Filter and sort items client-side for instant snappy response
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Search query
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(item => {
        const name = item.name.toLowerCase();
        const brand = item.brand.toLowerCase();
        const cat = item.category.toLowerCase();
        const sub = item.subCategory.toLowerCase();
        const ing = item.ingredients.toLowerCase();
        return tokens.every(
          t => name.includes(t) || brand.includes(t) || cat.includes(t) || sub.includes(t) || ing.includes(t)
        );
      });
    }

    // Categories
    if (selectedCategories.length > 0) {
      const catSet = new Set(selectedCategories.map(c => c.toUpperCase()));
      list = list.filter(item => catSet.has(item.category.toUpperCase()));
    }

    // Brands
    if (selectedBrands.length > 0) {
      const brandSet = new Set(selectedBrands.map(b => b.toUpperCase()));
      list = list.filter(item => brandSet.has(item.brand.toUpperCase()));
    }

    // Nutrients: null is strictly NOT treated as zero!
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
    if (maxProtein !== '') {
      const val = parseFloat(maxProtein);
      list = list.filter(i => i.proteinG !== null && i.proteinG <= val);
    }

    if (minSugar !== '') {
      const val = parseFloat(minSugar);
      list = list.filter(i => i.sugarG !== null && i.sugarG >= val);
    }
    if (maxSugar !== '') {
      const val = parseFloat(maxSugar);
      list = list.filter(i => i.sugarG !== null && i.sugarG <= val);
    }

    if (minSodium !== '') {
      const val = parseFloat(minSodium);
      list = list.filter(i => i.sodiumMg !== null && i.sodiumMg >= val);
    }
    if (maxSodium !== '') {
      const val = parseFloat(maxSodium);
      list = list.filter(i => i.sodiumMg !== null && i.sodiumMg <= val);
    }

    if (minFiber !== '') {
      const val = parseFloat(minFiber);
      list = list.filter(i => i.dietaryFiberG !== null && i.dietaryFiberG >= val);
    }
    if (maxFiber !== '') {
      const val = parseFloat(maxFiber);
      list = list.filter(i => i.dietaryFiberG !== null && i.dietaryFiberG <= val);
    }

    if (minPrice !== '') {
      const val = parseFloat(minPrice);
      list = list.filter(i => i.priceINR !== null && i.priceINR >= val);
    }
    if (maxPrice !== '') {
      const val = parseFloat(maxPrice);
      list = list.filter(i => i.priceINR !== null && i.priceINR <= val);
    }

    // Sorting
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
  }, [
    initialProducts,
    debouncedQuery,
    selectedCategories,
    selectedBrands,
    minCalories,
    maxCalories,
    minProtein,
    maxProtein,
    minSugar,
    maxSugar,
    minSodium,
    maxSodium,
    minFiber,
    maxFiber,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedQuery,
    selectedCategories,
    selectedBrands,
    minCalories,
    maxCalories,
    minProtein,
    maxProtein,
    minSugar,
    maxSugar,
    minSodium,
    maxSodium,
    minFiber,
    maxFiber,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  ]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const paginatedItems = filteredProducts.slice((page - 1) * limit, page * limit);

  // Active filters count & list
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; clear: () => void }[] = [];
    if (debouncedQuery) {
      list.push({ key: 'q', label: `Search: "${debouncedQuery}"`, clear: () => setSearchQuery('') });
    }
    selectedCategories.forEach(cat => {
      list.push({
        key: `cat-${cat}`,
        label: `Category: ${cat}`,
        clear: () => setSelectedCategories(prev => prev.filter(c => c !== cat)),
      });
    });
    selectedBrands.forEach(b => {
      list.push({
        key: `brand-${b}`,
        label: `Brand: ${b}`,
        clear: () => setSelectedBrands(prev => prev.filter(item => item !== b)),
      });
    });
    if (minCalories !== '') list.push({ key: 'minCal', label: `Cal ≥ ${minCalories}`, clear: () => setMinCalories('') });
    if (maxCalories !== '') list.push({ key: 'maxCal', label: `Cal ≤ ${maxCalories}`, clear: () => setMaxCalories('') });
    if (minProtein !== '') list.push({ key: 'minProt', label: `Protein ≥ ${minProtein}g`, clear: () => setMinProtein('') });
    if (maxProtein !== '') list.push({ key: 'maxProt', label: `Protein ≤ ${maxProtein}g`, clear: () => setMaxProtein('') });
    if (minSugar !== '') list.push({ key: 'minSug', label: `Sugar ≥ ${minSugar}g`, clear: () => setMinSugar('') });
    if (maxSugar !== '') list.push({ key: 'maxSug', label: `Sugar ≤ ${maxSugar}g`, clear: () => setMaxSugar('') });
    if (minSodium !== '') list.push({ key: 'minSod', label: `Sodium ≥ ${minSodium}mg`, clear: () => setMinSodium('') });
    if (maxSodium !== '') list.push({ key: 'maxSod', label: `Sodium ≤ ${maxSodium}mg`, clear: () => setMaxSodium('') });
    if (minPrice !== '') list.push({ key: 'minPrice', label: `Price ≥ ₹${minPrice}`, clear: () => setMinPrice('') });
    if (maxPrice !== '') list.push({ key: 'maxPrice', label: `Price ≤ ₹${maxPrice}`, clear: () => setMaxPrice('') });
    return list;
  }, [
    debouncedQuery,
    selectedCategories,
    selectedBrands,
    minCalories,
    maxCalories,
    minProtein,
    maxProtein,
    minSugar,
    maxSugar,
    minSodium,
    maxSodium,
    minPrice,
    maxPrice,
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinCalories('');
    setMaxCalories('');
    setMinProtein('');
    setMaxProtein('');
    setMinSugar('');
    setMaxSugar('');
    setMinSodium('');
    setMaxSodium('');
    setMinFiber('');
    setMaxFiber('');
    setMinPrice('');
    setMaxPrice('');
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands(prev =>
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  const toggleCompare = (product: PackagedFoodItem) => {
    setComparingProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 products at the same time.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const visibleBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands.slice(0, 30);
    const q = brandSearch.toLowerCase().trim();
    return brands.filter(b => b.name.toLowerCase().includes(q)).slice(0, 40);
  }, [brands, brandSearch]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Bar */}
      <div className="bubble-card bg-gradient-to-br from-[var(--surface)] to-[var(--mint)]/10 p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--leaf)] text-white text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Indian Packaged Food Intelligence</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-stone-50 tracking-tight leading-none mb-3">
            Search 852 Packaged Foods
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-medium leading-relaxed mb-6">
            Explore authentic packaged foods across 262 brands and 13 categories. Instant multi-attribute search, strict nutritional filters, and verified label transparency.
          </p>

          {/* Search Box with instant suggestions */}
          <div ref={searchContainerRef} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by product name, brand (Parle, Amul), category, or ingredients..."
                className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base bg-white dark:bg-stone-900 border-2 border-[var(--ink)] rounded-2xl shadow-[4px_4px_0px_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--leaf)] font-medium text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 border-2 border-[var(--ink)] rounded-2xl shadow-[6px_6px_0px_var(--ink)] z-30 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
                <div className="px-3.5 py-2 text-[11px] font-black uppercase text-stone-400 tracking-wider bg-stone-50 dark:bg-stone-800/50">
                  Instant Suggestions
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(s);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-[var(--mint)]/20 hover:text-[var(--leaf)] transition-colors flex items-center justify-between"
                  >
                    <span>{s}</span>
                    <Search className="w-3.5 h-3.5 opacity-40" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bubble-card p-5 bg-[var(--surface)] text-[var(--ink)] space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2 font-display font-black text-base text-stone-900 dark:text-stone-50">
                <Filter className="w-4 h-4 text-[var(--leaf)]" />
                <span>Filters</span>
              </div>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[var(--tomato)] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-2.5">
                Categories ({categories.length})
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {categories.map(cat => {
                  const isChecked = selectedCategories.includes(cat.name);
                  return (
                    <label
                      key={cat.slug}
                      className="flex items-center justify-between text-xs font-semibold p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.name)}
                          className="rounded text-[var(--leaf)] focus:ring-[var(--leaf)]"
                        />
                        <span>{cat.icon}</span>
                        <span className="text-stone-800 dark:text-stone-200">{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-bold bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                        {cat.productCount}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brands (Searchable) */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">
                  Brands ({brands.length})
                </h3>
              </div>
              <input
                type="text"
                placeholder="Search brand..."
                value={brandSearch}
                onChange={e => setBrandSearch(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 mb-2"
              />
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {visibleBrands.map(b => {
                  const isChecked = selectedBrands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      className="flex items-center justify-between text-xs font-semibold p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(b.name)}
                          className="rounded text-[var(--leaf)] focus:ring-[var(--leaf)]"
                        />
                        <span className="truncate text-stone-800 dark:text-stone-200">{b.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-bold">
                        {b.productCount}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Nutritional Filters */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-4 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">
                Nutritional Ranges
              </h3>

              {/* Calories */}
              <div>
                <label className="text-xs font-bold block mb-1">Calories (kcal)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minCalories}
                    onChange={e => setMinCalories(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxCalories}
                    onChange={e => setMaxCalories(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              {/* Protein */}
              <div>
                <label className="text-xs font-bold block mb-1">Protein (g)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minProtein}
                    onChange={e => setMinProtein(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxProtein}
                    onChange={e => setMaxProtein(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              {/* Sugar */}
              <div>
                <label className="text-xs font-bold block mb-1">Total Sugar (g)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minSugar}
                    onChange={e => setMinSugar(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxSugar}
                    onChange={e => setMaxSugar(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              {/* Sodium */}
              <div>
                <label className="text-xs font-bold block mb-1">Sodium (mg)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minSodium}
                    onChange={e => setMinSodium(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxSodium}
                    onChange={e => setMaxSodium(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold block mb-1">Price (₹ INR)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Results Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar: Mobile filter trigger, Count, Sort dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] p-4 rounded-2xl border-2 border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden btn-chunky text-xs py-2 px-3 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters {activeFilters.length > 0 && `(${activeFilters.length})`}</span>
              </button>

              <div className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300">
                Showing <span className="font-extrabold text-stone-900 dark:text-stone-50">{filteredProducts.length}</span> of {totalProducts} products
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
              >
                <option value="sno">Default (S.No)</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="brand">Brand Name (A-Z)</option>
                <option value="protein">Protein (High to Low)</option>
                <option value="calories">Calories (Energy)</option>
                <option value="sugar">Sugar (Low to High)</option>
                <option value="price">Price (₹ INR)</option>
              </select>

              <button
                type="button"
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                className="p-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                title={`Order: ${sortOrder.toUpperCase()}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-stone-400">Active Filters:</span>
              {activeFilters.map(filter => (
                <span
                  key={filter.key}
                  className="chip text-xs py-1 px-2.5 rounded-full bg-[var(--mint)]/30 text-stone-900 dark:text-stone-100 border border-[var(--leaf)]/40 flex items-center gap-1.5 font-bold"
                >
                  <span>{filter.label}</span>
                  <button
                    type="button"
                    onClick={filter.clear}
                    className="hover:text-[var(--tomato)]"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[var(--tomato)] hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {paginatedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedItems.map(product => (
                <IndianFoodCard
                  key={product.id}
                  product={product}
                  highlightText={debouncedQuery}
                  isComparing={comparingProducts.some(p => p.id === product.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="bubble-card p-12 text-center bg-[var(--surface)] text-[var(--ink)] space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-3xl">
                🔍
              </div>
              <h3 className="font-display font-black text-xl text-stone-900 dark:text-stone-50">
                No matching packaged foods found
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                No products match your current search and filter combination. Try clearing some filters or searching for popular categories like Chocolate, Biscuits, or Snacks.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn-chunky py-2.5 px-6 bg-[var(--leaf)] text-white text-sm font-bold inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-2xl border-2 border-stone-200 dark:border-stone-800">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="btn-chunky py-2 px-4 text-xs bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs sm:text-sm font-extrabold text-stone-700 dark:text-stone-300">
                Page <span className="text-[var(--leaf)] font-black">{page}</span> of {totalPages}
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="btn-chunky py-2 px-4 text-xs bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 font-bold"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Drawer / Modal */}
      <IndianFoodCompareModal
        selectedProducts={comparingProducts}
        onRemove={id => setComparingProducts(prev => prev.filter(p => p.id !== id))}
        onClear={() => setComparingProducts([])}
      />
    </div>
  );
}
