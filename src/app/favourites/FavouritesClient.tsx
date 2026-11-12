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
      <div className="py-20 text-center text-sm text-outline font-medium">
        Loading your pantry watchlist...
      </div>
    );
  }

  // 1. EMPTY STATE
  if (count === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-surface-container-low flex items-center justify-center mb-6 text-primary">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary">Your Watchlist is Empty</h1>
        <p className="text-sm font-medium text-on-surface-variant mt-3 leading-relaxed">
          Tap the heart button on any product card or report to save healthy alternatives, track nutrition, and plan smarter grocery choices.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="py-3 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Explore 852 Products <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/compare"
            className="py-3 px-6 rounded-full bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors"
          >
            Compare Foods
          </Link>
        </div>

        <div className="mt-12 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface-variant">
          🔒 <strong>100% Local & Private:</strong> Your saved pantry items stay on this browser. No account required, no tracking.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed top-24 right-4 z-50 bg-primary text-on-primary font-semibold py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <ShoppingCart className="w-5 h-5" />
          <span>Added all favourites to your Cart!</span>
        </div>
      )}

      {/* Header & Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary flex items-center gap-2">
              My Favourites
              <span className="text-xs py-0.5 px-2.5 rounded-full bg-primary text-on-primary font-bold">
                {count}
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-on-surface-variant mt-1">
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
            className={`py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
              isSelectMode
                ? 'bg-primary text-on-primary'
                : 'border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-on-surface'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isSelectMode ? 'Cancel Compare' : 'Select to Compare'}</span>
          </button>

          <button
            type="button"
            onClick={handleAddAllToCart}
            className="py-2 px-3.5 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1.5 shadow-xs transition-colors"
            title="Stage all favourited items in cart"
          >
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span>Add All to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="py-2 px-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-error/5 text-xs font-semibold text-error transition-colors shadow-xs"
            title="Clear all favourites"
            aria-label="Clear all favourites"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Clear All */}
      {showClearConfirm && (
        <div className="p-4 bg-error/5 border border-error/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-error">
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
              className="py-1.5 px-3 rounded-lg text-xs bg-error text-white font-semibold"
            >
              Yes, Clear All
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="py-1.5 px-3 rounded-lg text-xs border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters & Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 shadow-sm">
        {/* Search within favourites */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved foods or brands..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-surface-container-low rounded-lg border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-outline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as FavouritesSortOption)}
            className="py-1.5 px-3 text-xs font-medium bg-surface-container-low rounded-lg border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary cursor-pointer"
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`text-xs py-1 px-3 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            All Categories ({count})
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs py-1 px-3 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* No Results from filters */}
      {favouritedProducts.length === 0 && (
        <div className="py-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
          <p className="text-sm font-medium text-on-surface-variant">No saved foods match your current search or category filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="py-2 px-4 text-xs font-semibold mt-3 rounded-lg bg-surface-container text-on-surface"
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
                  className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg border transition-all shadow-sm ${
                    isSelected ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest text-outline border-outline-variant/40'
                  }`}
                  aria-label={isSelected ? 'Deselect for compare' : 'Select for compare'}
                >
                  {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-60" />}
                </button>
              )}

              <ProductCard product={product} />
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Comparison Floating Bar when items are selected */}
      {isSelectMode && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl p-3.5 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-6">
          <div className="text-xs">
            <span className="font-bold text-primary">{selectedSlugs.length} / 4 Selected</span>
            {selectedSlugs.length < 2 && (
              <span className="block text-[10px] font-medium text-outline">Pick at least 2</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedSlugs([])}
              className="text-xs py-1.5 px-3 rounded-lg bg-surface-container-low text-on-surface font-medium hover:bg-surface-container"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCompareSelected}
              disabled={selectedSlugs.length < 2}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                selectedSlugs.length >= 2
                  ? 'bg-primary text-on-primary shadow-sm hover:bg-primary-container hover:text-on-primary-container'
                  : 'opacity-40 cursor-not-allowed bg-surface-container text-outline'
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
