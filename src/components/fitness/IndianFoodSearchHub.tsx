'use client';

import React, { useState, useEffect, useTransition } from 'react';
import type { IndianFoodItem, SearchResponse } from '@/types/nutrition-db';
import FoodDetailModal from './FoodDetailModal';
import {
  Search,
  Filter,
  Sparkles,
  ChefHat,
  Droplet,
  Info,
  Layers,
  ChevronRight,
  Database,
  ArrowRight,
  Loader2,
  X,
} from 'lucide-react';

export default function IndianFoodSearchHub() {
  const [query, setQuery] = useState('');
  const [foodType, setFoodType] = useState<'all' | 'cooked' | 'raw'>('all');
  const [hasOilOnly, setHasOilOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [selectedFood, setSelectedFood] = useState<IndianFoodItem | null>(null);

  // Quick search suggestions
  const suggestedPills = [
    'Aloo Gobi',
    'Palak Paneer',
    'Dal Tadka',
    'Rajma',
    'Poha',
    'Upma',
    'Idli',
    'Dosa',
    'Roti',
    'Bhindi',
    'Baingan Bharta',
    'Batata',
    'भिंडी',
    'पालक',
    'पोहा',
  ];

  // Fetch search results from API
  const fetchFoods = async (searchQuery: string, fType: string, oilOnly: boolean, cat: string, pageNum: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (fType !== 'all') params.set('foodType', fType);
      if (oilOnly) params.set('hasOil', 'true');
      if (cat !== 'all') params.set('category', cat);
      params.set('page', String(pageNum));
      params.set('limit', '18');

      const res = await fetch(`/api/nutrition/search?${params.toString()}`);
      if (res.ok) {
        const json: SearchResponse = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load foods:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search on query or filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchFoods(query, foodType, hasOilOnly, selectedCategory, page);
    }, 250);

    return () => clearTimeout(handler);
  }, [query, foodType, hasOilOnly, selectedCategory, page]);

  const handlePillClick = (term: string) => {
    setQuery(term);
    setPage(1);
  };

  const handleFilterChange = (type: 'all' | 'cooked' | 'raw') => {
    setFoodType(type);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <div className="card-chunky bg-white p-5 sm:p-8 space-y-5 border-2 border-[var(--ink)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[var(--mint)] text-emerald-950 border border-[var(--ink)] mb-2">
            <Database className="w-3.5 h-3.5" /> Indian Nutrient Databank (INDB) & ICMR-NIN
          </div>
          <h2 className="t-h2 text-[var(--ink)]">Search Indian Food Nutrition Database</h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1">
            Search 1,900+ authentic Indian recipes and raw single ingredients with multilingual Hindi/Marathi aliases, accurate quantity calculations, and transparent cooking oil breakdown.
          </p>
        </div>

        {/* Database Provenance Banner */}
        {data?.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-[var(--surface-alt)] border border-stone-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Authentic Foods</span>
              <span className="font-black text-sm text-[var(--ink)]">{data.stats.totalRecords.toLocaleString()} items</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Cooked Dishes (INDB)</span>
              <span className="font-black text-sm text-amber-900">{data.stats.cookedDishes.toLocaleString()} recipes</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Raw Ingredients (NIN)</span>
              <span className="font-black text-sm text-emerald-900">{data.stats.rawFoods.toLocaleString()} items</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Multilingual Aliases</span>
              <span className="font-black text-sm text-[var(--leaf)]">{data.stats.totalAliases.toLocaleString()} terms</span>
            </div>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="relative">
          <div className="search-pill w-full flex items-center gap-2 p-1.5 sm:p-2 border-3 border-[var(--ink)] rounded-2xl bg-white shadow-hard">
            <Search className="w-5 h-5 text-stone-500 ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search Indian foods (e.g. Aloo Gobi, Palak Paneer, Rajma, Batata, भिंडी, पोहा)..."
              className="w-full px-2 py-1.5 font-bold text-base text-[var(--ink)] placeholder:text-stone-400 focus:outline-hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setPage(1);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 mr-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mr-2 shrink-0" />
            )}
          </div>
        </div>

        {/* Multilingual Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
            Popular Searches & Regional Aliases:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handlePillClick(pill)}
                className={`text-xs px-2.5 py-1 rounded-xl font-bold border transition-all ${
                  query.toLowerCase() === pill.toLowerCase()
                    ? 'border-[var(--ink)] bg-[var(--leaf)] text-white shadow-2xs'
                    : 'border-stone-200 bg-[var(--surface-alt)] hover:bg-stone-200/70 text-stone-700'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar: Food Type & Oil Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
          {/* Food Type Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                foodType === 'all' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              All Items ({data?.stats?.totalRecords || 1911})
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('cooked')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                foodType === 'cooked' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              Cooked Dishes ({data?.stats?.cookedDishes || 1014})
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('raw')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                foodType === 'raw' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              Raw Foods ({data?.stats?.rawFoods || 897})
            </button>
          </div>

          {/* Oil Breakdown Checkbox Filter */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-stone-700">
            <input
              type="checkbox"
              checked={hasOilOnly}
              onChange={(e) => {
                setHasOilOnly(e.target.checked);
                setPage(1);
              }}
              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>With Verified Oil Breakdown Only</span>
            </span>
          </label>
        </div>
      </div>

      {/* Search Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
          <span>
            {data ? `Showing ${data.items.length} of ${data.total} foods` : 'Loading items...'}
            {query && ` matching "${query}"`}
          </span>
          {data && data.totalPages > 1 && (
            <span>Page {data.page} of {data.totalPages}</span>
          )}
        </div>

        {data && data.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((item: IndianFoodItem) => {
              const cals = item.nutrientsPer100g.energyKcal;
              const protein = item.nutrientsPer100g.proteinG;
              const carbs = item.nutrientsPer100g.carbG;
              const fat = item.nutrientsPer100g.fatG;
              const fiber = item.nutrientsPer100g.fibreG;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFood(item)}
                  className="card-chunky bg-white p-5 rounded-2xl border-2 border-[var(--ink)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        item.foodType === 'cooked'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}>
                        {item.foodType === 'cooked' ? 'Cooked Recipe' : 'Raw Food'}
                      </span>

                      {item.oilBreakdown?.available && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1">
                          <Droplet className="w-3 h-3 fill-amber-500 text-amber-600" />
                          <span>Oil data</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-[var(--ink)] group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      {item.nameLocal && (
                        <p className="text-xs font-semibold text-emerald-800 line-clamp-1 mt-0.5">
                          {item.nameLocal}
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-stone-500 line-clamp-1">
                      {item.provenance}
                    </div>
                  </div>

                  {/* Macro Summary Strip (per 100g) */}
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex justify-between">
                      <span>Per 100g portion</span>
                      <span>{item.servingInfo?.servingUnit ? `1 serv ≈ ${item.servingInfo.servingWeightG}g` : ''}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 text-center">
                      <div className="p-1 rounded bg-stone-50 border border-stone-100">
                        <span className="text-[9px] text-stone-500 block font-bold">Cals</span>
                        <span className="text-xs font-black text-[var(--ink)]">
                          {cals !== null ? Math.round(cals) : '-'}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-blue-50 border border-blue-100">
                        <span className="text-[9px] text-blue-700 block font-bold">Prot</span>
                        <span className="text-xs font-black text-blue-900">
                          {protein !== null ? `${protein}g` : '-'}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-emerald-50 border border-emerald-100">
                        <span className="text-[9px] text-emerald-700 block font-bold">Carb</span>
                        <span className="text-xs font-black text-emerald-900">
                          {carbs !== null ? `${carbs}g` : '-'}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-rose-50 border border-rose-100">
                        <span className="text-[9px] text-rose-700 block font-bold">Fat</span>
                        <span className="text-xs font-black text-rose-900">
                          {fat !== null ? `${fat}g` : '-'}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-purple-50 border border-purple-100">
                        <span className="text-[9px] text-purple-700 block font-bold">Fib</span>
                        <span className="text-xs font-black text-purple-900">
                          {fiber !== null ? `${fiber}g` : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                      <span>Calculate custom grams</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-chunky bg-white p-12 text-center space-y-3">
            <span className="text-3xl">🔍</span>
            <h3 className="font-extrabold text-base text-[var(--ink)]">No Indian food matches found</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              We couldn&apos;t find an authentic source record for &quot;{query}&quot;. Try searching common terms like Aloo, Paneer, Dal, Bhindi, Roti, or browse our categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFoodType('all');
                setHasOilOnly(false);
                setSelectedCategory('all');
              }}
              className="btn-chunky btn-primary text-xs mt-2"
            >
              Reset Search Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn-chunky px-4 py-1.5 text-xs font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-black px-3 py-1 bg-white rounded-xl border border-stone-300">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              className="btn-chunky px-4 py-1.5 text-xs font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Full Detail & Quantity Calculator Modal */}
      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
}
