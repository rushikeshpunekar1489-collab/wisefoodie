'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '@/hooks/useFavourites';

interface FavouriteButtonProps {
  slug: string;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export default function FavouriteButton({
  slug,
  productName,
  size = 'sm',
  className = '',
  showLabel = false,
}: FavouriteButtonProps) {
  const { has, toggle } = useFavourites();
  const isFav = has(slug);
  const [bouncing, setBouncing] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBouncing(true);
    toggle(slug);
    setTimeout(() => setBouncing(false), 500);
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonClasses = {
    sm: 'p-1.5 rounded-full border border-[var(--ink)]/15 bg-white/90 backdrop-blur-xs hover:bg-white shadow-xs',
    md: 'p-2 rounded-full border-2 border-[var(--ink)] bg-white hover:bg-[var(--surface-alt)] shadow-[2px_2px_0px_var(--ink)]',
    lg: 'py-2.5 px-4 rounded-full border-2 border-[var(--ink)] bg-white hover:bg-[var(--surface-alt)] shadow-[3px_3px_0px_var(--ink)] flex items-center gap-2 font-bold text-sm',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFav}
      aria-label={
        isFav
          ? `Remove ${productName || 'product'} from favourites`
          : `Add ${productName || 'product'} to favourites`
      }
      title={isFav ? 'Remove from favourites' : 'Save to favourites'}
      className={`relative inline-flex items-center justify-center transition-transform active:scale-90 ${
        buttonClasses[size]
      } ${bouncing ? 'scale-125' : ''} ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-colors duration-200 ${
          isFav
            ? 'fill-[var(--tomato)] text-[var(--tomato)] stroke-[2.5]'
            : 'text-[var(--ink)] opacity-70 stroke-[2]'
        }`}
      />
      {showLabel && (
        <span className="text-[var(--ink)] select-none">
          {isFav ? 'Favourited' : 'Add to Favourites'}
        </span>
      )}
    </button>
  );
}
