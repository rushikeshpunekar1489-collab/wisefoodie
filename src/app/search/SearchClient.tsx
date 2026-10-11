'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchProducts, type SearchMatchResult } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Search, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchMatchResult[]>([]);

  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      const res = searchProducts(initialQuery);
      setResults(res);
    } else {
      setResults([]);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      const res = searchProducts(query);
      setResults(res);
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
                setResults(searchProducts(sq));
              }}
              className="bg-stone-100 hover:bg-stone-200/80 text-stone-700 px-3 py-1 rounded-full border border-stone-200 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {initialQuery && (
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900">
              Results for &ldquo;{initialQuery}&rdquo; ({results.length} found)
            </h2>
            <Link href="/explore" className="text-xs font-semibold text-emerald-800 hover:underline">
              Browse All Foods
            </Link>
          </div>
        )}

        {results.length > 0 ? (
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
        ) : initialQuery ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-stone-300 space-y-3 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">No direct matches found</h3>
            <p className="text-xs text-stone-500">
              We couldn&apos;t find an exact match for &ldquo;{initialQuery}&rdquo;. Try browsing our category directory or checking common grocery terms.
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5"
              >
                Explore All Products <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
