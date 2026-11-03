'use client';

import React from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface AddToCartButtonProps {
  slug: string;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStepperWhenAdded?: boolean;
}

export default function AddToCartButton({
  slug,
  productName,
  size = 'md',
  className = '',
  showStepperWhenAdded = true,
}: AddToCartButtonProps) {
  const { cartItems, add, updateQuantity } = useCart();
  const currentItem = cartItems.find((i) => i.slug === slug);
  const qty = currentItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(slug, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(slug, qty + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(slug, qty - 1);
  };

  // If already in cart and stepper is enabled
  if (qty > 0 && showStepperWhenAdded) {
    if (size === 'sm') {
      return (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`inline-flex items-center gap-1 bg-[var(--leaf)] text-white rounded-full px-1.5 py-0.5 border border-[var(--ink)] shadow-xs text-xs font-black select-none touch-action-manipulation ${className}`}
        >
          <button
            type="button"
            onClick={handleDecrement}
            className="w-7 h-7 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full hover:bg-black/10 active:scale-90 transition-transform"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
          <span className="w-3.5 text-center">{qty}</span>
          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full hover:bg-black/10 active:scale-90 transition-transform"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      );
    }

    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`inline-flex items-center gap-3 bg-[var(--leaf)] text-white rounded-full px-3.5 py-1.5 min-h-[44px] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-extrabold text-sm select-none touch-action-manipulation ${className}`}
      >
        <button
          type="button"
          onClick={handleDecrement}
          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-black/10 active:scale-90 transition-transform"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>
        <span className="min-w-5 text-center">{qty} in Basket</span>
        <button
          type="button"
          onClick={handleIncrement}
          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-black/10 active:scale-90 transition-transform"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  // Not yet added or standard button
  const buttonClasses = {
    sm: 'w-10 h-10 min-w-[40px] min-h-[40px] rounded-full border border-[var(--ink)]/20 bg-white hover:bg-[var(--leaf)] hover:text-white transition-colors shadow-xs flex items-center justify-center touch-action-manipulation',
    md: 'py-2 px-3.5 min-h-[44px] rounded-full border-2 border-[var(--ink)] bg-white hover:bg-[var(--leaf)] hover:text-white shadow-[2px_2px_0px_var(--ink)] flex items-center gap-1.5 font-bold text-xs transition-colors touch-action-manipulation',
    lg: 'py-2.5 px-5 min-h-[44px] rounded-full border-2 border-[var(--ink)] bg-[var(--leaf)] text-white hover:brightness-105 shadow-[3px_3px_0px_var(--ink)] flex items-center gap-2 font-black text-sm transition-transform active:scale-95 touch-action-manipulation',
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${productName || 'product'} to basket`}
      title="Add to Smart Basket"
      className={`btn-chunky ${buttonClasses[size]} ${className}`}
    >
      <ShoppingCart className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'} stroke-[2.5]`} />
      {size !== 'sm' && <span>Add to Basket</span>}
    </button>
  );
}
