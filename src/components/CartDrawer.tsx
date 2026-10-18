'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, ArrowRight, Trash2, Zap } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { computeBasketSummary } from '@/lib/cart';
import type { Product } from '@/types/product';
import AddToCartButton from '@/components/AddToCartButton';
import { getScoreBandColor } from '@/lib/shareCard';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
}

export default function CartDrawer({ isOpen, onClose, allProducts }: CartDrawerProps) {
  const { cartItems, count, clearCart } = useCart();

  const summary = useMemo(() => {
    return computeBasketSummary(cartItems, allProducts);
  }, [cartItems, allProducts]);

  if (!isOpen) return null;

  const bandColor = getScoreBandColor(summary.basketFBS);

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--ink)]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l-3 border-[var(--ink)] animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b-2 border-[var(--ink)]/15 flex items-center justify-between bg-[var(--surface-alt)]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--leaf)]/10 text-[var(--leaf)] border border-[var(--leaf)]">
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--ink)]">Smart Basket</h2>
              <p className="text-xs font-bold opacity-60">{count} packs added</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-full hover:bg-black/10 border border-[var(--ink)]/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-alt)] border-2 border-[var(--ink)] flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 opacity-40 text-[var(--ink)]" />
            </div>
            <h3 className="text-xl font-black text-[var(--ink)]">Your basket is empty</h3>
            <p className="text-xs font-bold opacity-60 max-w-xs mt-2">
              Add foods from Explore or Search to see your basket's average Food Benefit Score and smart swaps!
            </p>
            <Link
              href="/explore"
              onClick={onClose}
              className="btn-chunky btn-primary py-2.5 px-5 text-xs mt-6 flex items-center gap-2"
            >
              Explore Healthy Foods <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Basket Score Quick Summary */}
            <div className="p-4 bg-[var(--surface-alt)]/60 border-b border-[var(--ink)]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-500">Basket Average FBS</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-current" style={{ color: bandColor }} />
                  <span className="text-2xl font-black" style={{ color: bandColor }}>
                    {summary.basketFBS !== null ? summary.basketFBS.toFixed(1) : '—'}
                  </span>
                  <span className="text-xs font-bold opacity-60">/ 10 (calorie-weighted)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-gray-500">Est. Total</span>
                <div className="text-xl font-black text-[var(--ink)]">₹{summary.totalPriceINR}</div>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-dashed divide-gray-200">
              {summary.items.map((item) => (
                <div key={item.product.slug} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="w-14 h-14 relative bg-[var(--surface-alt)] rounded-xl border border-[var(--ink)]/15 shrink-0 p-1 flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    ) : (
                      <span className="font-bold text-xs opacity-50">{item.product.name.charAt(0)}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-[var(--ink)] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] font-bold text-[var(--leaf)]">
                      {item.product.brand} • {item.product.fbs.score ? `FBS ${item.product.fbs.score.toFixed(1)}` : 'Pending'}
                    </p>
                    <div className="text-xs font-black mt-0.5">
                      {item.itemTotalPrice !== null ? `₹${item.itemTotalPrice}` : 'Price unlisted'}
                      <span className="text-[10px] font-normal opacity-60 ml-1.5">
                        ({item.packWeightG}g × {item.quantity})
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <AddToCartButton slug={item.product.slug} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t-2 border-[var(--ink)] bg-white space-y-2.5">
              <Link
                href="/cart"
                onClick={onClose}
                className="btn-chunky btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                View Smart Basket & Swaps <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-xs font-bold text-[var(--tomato)] hover:underline flex items-center justify-center gap-1 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Empty Basket
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
