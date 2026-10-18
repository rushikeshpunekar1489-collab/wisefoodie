'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { useFavourites } from '@/hooks/useFavourites';
import {
  filterAndSortFavouriteProducts,
  type FavouritesSortOption,
} from '@/lib/favourites';
import {
  Heart,
  Search,
  Scale,
  ShoppingCart,
  Trash2,
  Sparkles,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
  X,
} from 'lucide-react';

interface FavouritesClientProps {
  allProducts: Product[];
}

export default function FavouritesClient({ allProducts }: FavouritesClientProps) {
  const router = useRouter();
  const { favouriteRecords, count, isReady, clearAll } = useFavourites();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<FavouritesSortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [cartToast, setCartToast] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter & sort favourites
  const favouritedProducts = useMemo(() => {
    return filterAndSortFavouriteProducts(allProducts, favouriteRecords, {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sortBy,
      searchQuery,
    });
  }, [allProducts, favouriteRecords, selectedCategory, sortBy, searchQuery]);

  // Categories present among all favourited products
  const availableCategories = useMemo(() => {
    const recordSlugs = new Set(favouriteRecords.map((r: { slug: string }) => r.slug));
    const userFavs = allProducts.filter((p) => recordSlugs.has(p.slug));
    const cats = new Set<string>();
    for (const p of userFavs) {
      if (p.category) cats.add(p.category);
    }
    return Array.from(cats).sort();
  }, [allProducts, favouriteRecords]);

  // Handle multi-select toggle
  const toggleSelect = (slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 4) {
        // Max 4 for comparison
        return prev;
      }
      return [...prev, slug];
    });
  };

  const handleCompareSelected = () => {
    if (selectedSlugs.length < 2) return;
    const query = selectedSlugs.map((s, idx) => `${idx === 0 ? 'a' : idx === 1 ? 'b' : idx === 2 ? 'c' : 'd'}=${encodeURIComponent(s)}`).join('&');
    router.push(`/compare?${query}`);
  };

  const handleAddAllToCart = () => {
    // Stage all items for cart store (in Phase 3 this links to full cart)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const rawCart = window.localStorage.getItem('wf_cart_v1');
        const existingCart: { slug: string; quantity: number }[] = rawCart ? JSON.parse(rawCart) : [];
        const cartSlugs = new Set(existingCart.map((c) => c.slug));

        const updated = [...existingCart];
        for (const rec of favouriteRecords) {
          if (!cartSlugs.has(rec.slug)) {
            updated.push({ slug: rec.slug, quantity: 1 });
          }
        }
        window.localStorage.setItem('wf_cart_v1', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('wf:cart_changed', { detail: updated }));
      }
    } catch {
      // ignore
    }

    setCartToast(true);
    setTimeout(() => setCartToast(false), 3000);
  };

  if (!isReady) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[var(--leaf)] border-t-transparent" />
        <p className="mt-3 text-xs font-bold opacity-60">Loading your pantry watchlist...</p>
      </div>
    );
  }

  // 1. EMPTY STATE (No favourites saved at all)
  if (count === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--surface-alt)] border-3 border-[var(--ink)] flex items-center justify-center shadow-[4px_4px_0px_var(--ink)] mb-6">
          <Heart className="w-10 h-10 text-[var(--tomato)] opacity-40 stroke-[2]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">Your Watchlist is Empty</h1>
        <p className="text-sm font-semibold text-[var(--ink)] opacity-70 mt-3 leading-relaxed">
          Tap the heart button on any product card or report to save healthy alternatives, track nutrition, and plan smarter grocery choices.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/explore" className="btn-chunky btn-primary py-3 px-6 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Explore Top Products <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/compare" className="btn-chunky py-3 px-6 text-sm bg-white hover:bg-[var(--surface-alt)]">
            Compare Foods
          </Link>
        </div>

        <div className="mt-12 p-4 rounded-2xl bg-[var(--surface-alt)] border border-[var(--ink)]/10 text-xs font-semibold text-[var(--ink)] opacity-70">
          🔒 <strong>100% Local & Private:</strong> Your saved pantry items stay on this browser. No account required, no tracking.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed top-20 right-4 z-50 bg-[var(--leaf)] text-white font-bold py-3 px-5 rounded-2xl border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <ShoppingCart className="w-5 h-5" />
          <span>Added all favourites to your Cart!</span>
        </div>
      )}

      {/* Header & Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-3 border-[var(--ink)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--tomato)]/10 text-[var(--tomato)] border-2 border-[var(--tomato)]">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
              My Favourites
              <span className="ml-2.5 text-base py-0.5 px-2.5 rounded-full bg-[var(--ink)] text-white font-black">
                {count}
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold opacity-70 mt-1">
            Your curated food watchlist. Stored safely on this device.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              if (isSelectMode) setSelectedSlugs([]);
            }}
            className={`btn-chunky py-2 px-3 text-xs flex items-center gap-1.5 ${
              isSelectMode ? 'btn-primary' : 'bg-white hover:bg-[var(--surface-alt)]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isSelectMode ? 'Cancel Compare' : 'Select to Compare'}</span>
          </button>

          <button
            type="button"
            onClick={handleAddAllToCart}
            className="btn-chunky py-2 px-3 text-xs bg-white hover:bg-[var(--surface-alt)] flex items-center gap-1.5"
            title="Stage all favourited items in cart"
          >
            <ShoppingCart className="w-4 h-4 text-[var(--leaf)]" />
            <span>Add All to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="btn-chunky py-2 px-2.5 text-xs text-[var(--tomato)] hover:bg-red-50"
            title="Clear all favourites"
            aria-label="Clear all favourites"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Clear All */}
      {showClearConfirm && (
        <div className="p-4 bg-red-50 border-2 border-[var(--tomato)] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--tomato)]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Are you sure you want to remove all {count} items from favourites?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                clearAll();
                setShowClearConfirm(false);
              }}
              className="btn-chunky py-1.5 px-3 text-xs bg-[var(--tomato)] text-white"
            >
              Yes, Clear All
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="btn-chunky py-1.5 px-3 text-xs bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters & Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--surface-alt)] p-3 rounded-2xl border-2 border-[var(--ink)]/15">
        {/* Search within favourites */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink)] opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved foods or brands..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-bold bg-white rounded-xl border border-[var(--ink)]/20 focus:outline-hidden focus:border-[var(--leaf)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-extrabold opacity-70">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as FavouritesSortOption)}
            className="py-1.5 px-3 text-xs font-bold bg-white rounded-xl border border-[var(--ink)]/20 focus:outline-hidden cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="fbs-desc">Highest Score (FBS)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      {availableCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`chip text-xs py-1 px-3 whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[var(--ink)] text-white'
                : 'bg-white hover:bg-[var(--surface-alt)]'
            }`}
          >
            All Categories ({count})
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`chip text-xs py-1 px-3 whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--leaf)] text-white'
                  : 'bg-white hover:bg-[var(--surface-alt)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* No Results from filters */}
      {favouritedProducts.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border-2 border-dashed border-[var(--ink)]/20 p-6">
          <p className="text-sm font-bold opacity-70">No saved foods match your current search or category filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="btn-chunky py-2 px-4 text-xs mt-3 bg-[var(--surface-alt)]"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favouritedProducts.map((product) => {
          const isSelected = selectedSlugs.includes(product.slug);

          return (
            <div key={product.slug} className="relative group">
              {/* Select Checkbox in Compare Mode */}
              {isSelectMode && (
                <button
                  type="button"
                  onClick={() => toggleSelect(product.slug)}
                  className={`absolute top-2 right-2 z-20 p-1.5 rounded-xl border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] transition-transform active:scale-95 ${
                    isSelected ? 'bg-[var(--leaf)] text-white' : 'bg-white text-[var(--ink)]'
                  }`}
                  aria-label={isSelected ? 'Deselect for compare' : 'Select for compare'}
                >
                  {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 opacity-40" />}
                </button>
              )}

              <ProductCard product={product} />
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Comparison Floating Bar when items are selected */}
      {isSelectMode && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg bg-[var(--surface)] border-3 border-[var(--ink)] rounded-2xl shadow-[6px_6px_0px_var(--ink)] p-3 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-6">
          <div className="text-xs font-black">
            <span>{selectedSlugs.length} / 4 Selected</span>
            {selectedSlugs.length < 2 && (
              <span className="block text-[10px] font-bold text-[var(--mango)]">Pick at least 2</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedSlugs([])}
              className="chip text-[11px] py-1 px-2.5 bg-white"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCompareSelected}
              disabled={selectedSlugs.length < 2}
              className={`btn-chunky py-1.5 px-4 text-xs flex items-center gap-1.5 ${
                selectedSlugs.length >= 2 ? 'btn-primary' : 'opacity-40 cursor-not-allowed bg-gray-200'
              }`}
            >
              <Scale className="w-4 h-4" /> Compare Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
