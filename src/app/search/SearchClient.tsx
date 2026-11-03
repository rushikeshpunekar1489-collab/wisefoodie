'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchProducts, type SearchMatchResult } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import IndianFoodCard from '@/components/IndianFoodCard';
import type { PackagedFoodItem } from '@/types/packaged-food';
import { Search, Sparkles, AlertCircle, ArrowRight, Layers } from 'lucide-react';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchMatchResult[]>([]);
  const [indianFoodResults, setIndianFoodResults] = useState<PackagedFoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setIndianFoodResults([]);
      return;
    }

    setIsLoading(true);
    // 1. Search legacy catalog
    const res = searchProducts(trimmed);
    setResults(res);

    // 2. Search Indian Packaged Food Database
    fetch(`/api/products/search?q=${encodeURIComponent(trimmed)}&limit=12`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setIndianFoodResults(d.items || []);
        } else {
          setIndianFoodResults([]);
        }
      })
      .catch(() => setIndianFoodResults([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    } else {
      setResults([]);
      setIndianFoodResults([]);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query);
    }
  };

  const sampleQueries = [
    'high protein biscuits',
    'low sugar breakfast',
    'best value snacks',
    'rolled oats',
    'instant noodles',
    'paneer',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Intelligent Food Search
        </h1>
        <p className="text-sm text-stone-600">
          Search products, brands, ingredients, or nutritional intents like 'low sugar' or 'high protein'.
        </p>

        <form onSubmit={handleSearch} className="pt-2">
          <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-stone-200/90 p-2 focus-within:ring-2 focus-within:ring-emerald-700/30">
            <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. high protein biscuits, low sugar, rolled oats..."
              className="w-full px-3 py-3 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Suggested Query Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-stone-400">Try searching:</span>
          {sampleQueries.map(sq => (
            <button
              key={sq}
              onClick={() => {
                setQuery(sq);
                router.push(`/search?q=${encodeURIComponent(sq)}`);
                performSearch(sq);
              }}
              className="bg-stone-100 hover:bg-stone-200/80 text-stone-700 px-3 py-1 rounded-full border border-stone-200 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12 gap-3 text-emerald-800">
            <div className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Searching database...</span>
          </div>
        )}

        {initialQuery && !isLoading && (
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900">
              Results for &ldquo;{initialQuery}&rdquo; ({results.length + indianFoodResults.length} total found)
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/products" className="text-xs font-semibold text-emerald-800 hover:underline">
                View All 852 Products &rarr;
              </Link>
              <Link href="/explore" className="text-xs font-semibold text-stone-600 hover:underline">
                Browse Directory
              </Link>
            </div>
          </div>
        )}

        {/* Indian Packaged Food Database Results */}
        {indianFoodResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {indianFoodResults.length}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  Indian Packaged Food Database
                </h3>
                <span className="text-xs text-stone-500 hidden sm:inline">
                  (852 verified products with 25 data fields)
                </span>
              </div>
              <Link href="/products" className="text-xs font-medium text-emerald-700 hover:underline">
                Explore All Products
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {indianFoodResults.map(item => (
                <IndianFoodCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}

        {/* Curated FBS Scorecard Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                  {results.length}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  Curated Food Benefit Scorecards
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(r => (
                <div key={r.product.id} className="space-y-2">
                  <ProductCard product={r.product} />
                  {/* Visible "Why this matched" line */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 text-xs text-emerald-900">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">
                      <strong>Why it matched:</strong> {r.matchReason}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && initialQuery && results.length === 0 && indianFoodResults.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-stone-300 space-y-3 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">No direct matches found</h3>
            <p className="text-xs text-stone-500">
              We couldn&apos;t find an exact match for &ldquo;{initialQuery}&rdquo;. Try browsing our category directory or searching by brand like Amul, Britannia, Nestlé, or Tata.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products"
                className="bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 hover:bg-emerald-900"
              >
                Browse 852 Indian Foods <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/explore"
                className="bg-stone-100 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 hover:bg-stone-200"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
