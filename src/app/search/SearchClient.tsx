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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      {/* Header & Search Bar */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Forensic Search Engine</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight">
          Intelligent Food Search
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto font-medium">
          Search products, brands, ingredients, or nutritional intents like &apos;low sugar&apos; or &apos;high protein&apos;.
        </p>

        <form onSubmit={handleSearch} className="pt-2">
          <div className="relative flex items-center bg-surface-container-lowest rounded-full shadow-md border border-outline-variant/40 p-2 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="w-5 h-5 text-outline ml-4 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. high protein biscuits, low sugar, rolled oats..."
              className="w-full px-3 py-2 text-sm sm:text-base text-on-surface placeholder:text-outline bg-transparent focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-semibold text-sm px-6 py-2.5 rounded-full transition-all shrink-0 shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Suggested Query Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-outline font-medium">Try searching:</span>
          {sampleQueries.map(sq => (
            <button
              key={sq}
              onClick={() => {
                setQuery(sq);
                router.push(`/search?q=${encodeURIComponent(sq)}`);
                performSearch(sq);
              }}
              className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface px-3 py-1 rounded-full border border-outline-variant/40 transition-colors font-medium"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12 gap-3 text-primary">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Searching forensic database...</span>
          </div>
        )}

        {initialQuery && !isLoading && (
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <h2 className="font-serif font-bold text-lg text-primary">
              Results for &ldquo;{initialQuery}&rdquo; ({results.length + indianFoodResults.length} total found)
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/products" className="text-xs font-semibold text-primary hover:underline">
                View All 852 Products &rarr;
              </Link>
              <Link href="/category" className="text-xs font-medium text-outline hover:text-on-surface">
                Browse Categories
              </Link>
            </div>
          </div>
        )}

        {/* Indian Packaged Food Database Results */}
        {indianFoodResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {indianFoodResults.length}
                </span>
                <h3 className="font-serif font-bold text-base text-primary">
                  Indian Packaged Food Database
                </h3>
                <span className="text-xs text-outline hidden sm:inline">
                  (852 verified products with 25 data fields)
                </span>
              </div>
              <Link href="/products" className="text-xs font-semibold text-primary hover:underline">
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
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary/15 text-secondary font-bold text-xs">
                  {results.length}
                </span>
                <h3 className="font-serif font-bold text-base text-primary">
                  Curated Food Benefit Scorecards
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(r => (
                <div key={r.product.id} className="space-y-2">
                  <ProductCard product={r.product} />
                  {/* Visible "Why this matched" line */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-primary font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
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
          <div className="text-center py-16 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 space-y-3 max-w-lg mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 text-outline mx-auto" />
            <h3 className="font-serif font-bold text-primary text-base">No direct matches found</h3>
            <p className="text-xs text-on-surface-variant font-medium">
              We couldn&apos;t find an exact match for &ldquo;{initialQuery}&rdquo;. Try browsing our category directory or searching by brand like Amul, Britannia, Nestlé, or Tata.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products"
                className="bg-primary text-on-primary text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
              >
                Browse 852 Indian Foods <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/category"
                className="bg-surface-container text-on-surface text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 hover:bg-surface-container-high transition-colors"
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
