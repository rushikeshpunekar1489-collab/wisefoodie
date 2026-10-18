'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/product';
import { Share2 } from 'lucide-react';
import ShareModal from '@/components/ShareModal';

interface ShareButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export default function ShareButton({
  product,
  size = 'md',
  className = '',
  showLabel = true,
}: ShareButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonClasses = {
    sm: 'p-1.5 rounded-full border border-[var(--ink)]/15 bg-white/90 hover:bg-white',
    md: 'py-2 px-3.5 rounded-full border-2 border-[var(--ink)] bg-white hover:bg-[var(--surface-alt)] shadow-[2px_2px_0px_var(--ink)] flex items-center gap-1.5 font-bold text-xs',
    lg: 'py-2.5 px-4 rounded-full border-2 border-[var(--ink)] bg-white hover:bg-[var(--surface-alt)] shadow-[3px_3px_0px_var(--ink)] flex items-center gap-2 font-bold text-sm',
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label={`Share ${product.name} card`}
        title="Share nutrition card"
        className={`btn-chunky ${buttonClasses[size]} ${className}`}
      >
        <Share2 className={`${iconSizes[size]} text-[var(--leaf)] stroke-[2.5]`} />
        {showLabel && <span>Share</span>}
      </button>

      <ShareModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
