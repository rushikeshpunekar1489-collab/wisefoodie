'use client';

import React, { useState, useMemo } from 'react';
import type { Product } from '@/types/product';
import {
  type MealSlot,
  type PortionType,
  calculateGrams,
} from '@/lib/diary';
import { useFavourites } from '@/hooks/useFavourites';
import { useCart } from '@/hooks/useCart';
import { Search, X, Plus, Heart, ShoppingCart, Check } from 'lucide-react';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAdd: (item: {
    slug: string;
    name: string;
    brand: string;
    mealSlot: MealSlot;
    portionType: PortionType;
    portionValue: number;
    gramsConsumed: number;
    per100g: Product['per100g'];
    image?: string | null;
  }) => void;
  defaultMealSlot?: MealSlot;
}

export default function AddFoodModal({
  isOpen,
  onClose,
  products,
  onAdd,
  defaultMealSlot = 'breakfast',
}: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mealSlot, setMealSlot] = useState<MealSlot>(defaultMealSlot);
  const [portionType, setPortionType] = useState<PortionType>('pack');
  const [portionValue, setPortionValue] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'search' | 'favourites' | 'cart'>('search');

  const { favouriteSlugs } = useFavourites();
  const { cartItems } = useCart();

  // Reset when opened
  React.useEffect(() => {
    if (isOpen) {
      setMealSlot(defaultMealSlot);
      setSelectedProduct(null);
      setSearchQuery('');
      setPortionValue(1);
      setPortionType('pack');
    }
  }, [isOpen, defaultMealSlot]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    if (activeTab === 'favourites') {
      return products.filter((p) => favouriteSlugs.includes(p.slug));
    }
    if (activeTab === 'cart') {
      const cartSlugs = cartItems.map((c) => c.slug);
      return products.filter((p) => cartSlugs.includes(p.slug));
    }
    if (!searchQuery.trim()) {
      return products.slice(0, 20); // Top products by default
    }
    const q = searchQuery.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      )
      .slice(0, 30);
  }, [products, searchQuery, activeTab, favouriteSlugs, cartItems]);

  if (!isOpen) return null;

  const grams = selectedProduct
    ? calculateGrams(
        portionType,
        portionValue,
        selectedProduct.servingSizeG,
        selectedProduct.packSizeG
      )
    : 0;

  const handleConfirm = () => {
    if (!selectedProduct) return;
    onAdd({
      slug: selectedProduct.slug,
      name: selectedProduct.name,
      brand: selectedProduct.brand,
      mealSlot,
      portionType,
      portionValue,
      gramsConsumed: grams,
      per100g: selectedProduct.per100g,
      image: selectedProduct.image,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] text-[var(--ink)] border-3 border-[var(--ink)] rounded-3xl shadow-[8px_8px_0px_var(--ink)] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-[var(--ink)] flex items-center justify-between bg-[var(--surface-alt)]">
          <div>
            <h2 className="text-xl font-extrabold font-display">Add Food to Diary</h2>
            <p className="text-xs text-[var(--ink)] opacity-70">
              Select what you ate and choose your portion
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--surface)] border border-[var(--ink)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Slot Switcher */}
        <div className="p-3 bg-[var(--surface)] border-b border-[var(--ink)]/20 flex gap-2 overflow-x-auto">
          {(['breakfast', 'lunch', 'snack', 'dinner'] as MealSlot[]).map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setMealSlot(slot)}
              className={`py-1.5 px-3 rounded-full text-xs font-bold capitalize transition-all ${
                mealSlot === slot
                  ? 'bg-[var(--leaf)] text-white border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]'
                  : 'bg-[var(--surface-alt)] text-[var(--ink)] opacity-80 hover:opacity-100 border border-[var(--ink)]/30'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Source Tabs & Search */}
        <div className="p-3 bg-[var(--surface-alt)] border-b border-[var(--ink)]/20 space-y-2">
          <div className="flex gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`py-1 px-3 rounded-lg transition-colors ${
                activeTab === 'search'
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--leaf)]/20'
              }`}
            >
              All Foods
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('favourites')}
              className={`py-1 px-3 rounded-lg flex items-center gap-1 transition-colors ${
                activeTab === 'favourites'
                  ? 'bg-[var(--tomato)] text-white'
                  : 'bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--tomato)]/20'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" /> Favourites ({favouriteSlugs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className={`py-1 px-3 rounded-lg flex items-center gap-1 transition-colors ${
                activeTab === 'cart'
                  ? 'bg-[var(--leaf)] text-white'
                  : 'bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--leaf)]/20'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> In Basket ({cartItems.length})
            </button>
          </div>

          {activeTab === 'search' && (
            <div className="search-pill w-full bg-[var(--surface)]">
              <Search className="w-4 h-4 opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by name or brand..."
                className="text-xs"
              />
            </div>
          )}
        </div>

        {/* Product selection list */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-[var(--ink)]/10 min-h-[160px] max-h-[220px]">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-xs opacity-60 py-8">
              No matching products found. Try typing a brand or product name.
            </p>
          ) : (
            filteredProducts.map((p) => {
              const isSelected = selectedProduct?.slug === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelectedProduct(p)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[var(--leaf)]/15 border-2 border-[var(--leaf)] font-bold'
                      : 'hover:bg-[var(--surface-alt)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[var(--ink)]/20 flex items-center justify-center overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xs font-black">🥣</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] opacity-70 truncate">
                        {p.brand} • {p.per100g.energyKcal || '—'} kcal/100g
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Portion Selector (when product is selected) */}
        {selectedProduct && (
          <div className="p-3 bg-[var(--surface-alt)] border-t-2 border-[var(--ink)] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Portion for {selectedProduct.name}</span>
              <span className="text-[var(--leaf)] font-black text-sm">{grams} grams</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setPortionType('pack');
                  setPortionValue(1);
                }}
                className={`py-2 px-2 rounded-xl text-center border-2 border-[var(--ink)] transition-all ${
                  portionType === 'pack'
                    ? 'bg-[var(--mango)] shadow-[2px_2px_0px_var(--ink)]'
                    : 'bg-[var(--surface)] hover:bg-[var(--surface-alt)]'
                }`}
              >
                1 Whole Pack
                <span className="block text-[10px] font-normal opacity-80">
                  {selectedProduct.packSizeG || 100}g
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortionType('servings');
                  setPortionValue(1);
                }}
                className={`py-2 px-2 rounded-xl text-center border-2 border-[var(--ink)] transition-all ${
                  portionType === 'servings'
                    ? 'bg-[var(--sky)] shadow-[2px_2px_0px_var(--ink)]'
                    : 'bg-[var(--surface)] hover:bg-[var(--surface-alt)]'
                }`}
              >
                1 Serving
                <span className="block text-[10px] font-normal opacity-80">
                  {selectedProduct.servingSizeG || 50}g
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortionType('grams');
                  setPortionValue(100);
                }}
                className={`py-2 px-2 rounded-xl text-center border-2 border-[var(--ink)] transition-all ${
                  portionType === 'grams'
                    ? 'bg-[var(--mint)] shadow-[2px_2px_0px_var(--ink)]'
                    : 'bg-[var(--surface)] hover:bg-[var(--surface-alt)]'
                }`}
              >
                Custom Grams
                <span className="block text-[10px] font-normal opacity-80">Exact weight</span>
              </button>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between bg-[var(--surface)] p-2 rounded-xl border border-[var(--ink)]/30">
              <span className="text-xs font-bold">
                {portionType === 'grams'
                  ? 'Grams:'
                  : portionType === 'servings'
                  ? 'Servings:'
                  : 'Packs:'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPortionValue((v) =>
                      portionType === 'grams' ? Math.max(10, v - 25) : Math.max(0.5, v - 0.5)
                    )
                  }
                  className="w-7 h-7 rounded-lg border border-[var(--ink)] bg-[var(--surface-alt)] font-black text-sm flex items-center justify-center active:scale-95"
                >
                  −
                </button>
                <span className="text-xs font-black min-w-8 text-center">{portionValue}</span>
                <button
                  type="button"
                  onClick={() =>
                    setPortionValue((v) =>
                      portionType === 'grams' ? v + 25 : v + 0.5
                    )
                  }
                  className="w-7 h-7 rounded-lg border border-[var(--ink)] bg-[var(--surface-alt)] font-black text-sm flex items-center justify-center active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t-2 border-[var(--ink)] bg-[var(--surface)] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-xs font-bold hover:bg-[var(--surface-alt)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedProduct}
            onClick={handleConfirm}
            className="btn-chunky btn-primary py-2 px-5 text-xs disabled:opacity-40"
          >
            Add to {mealSlot}
          </button>
        </div>
      </div>
    </div>
  );
}
