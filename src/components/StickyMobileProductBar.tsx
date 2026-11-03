'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import AddToCartButton from '@/components/AddToCartButton';
import { Scale } from 'lucide-react';
import { getScoreBandColor } from '@/lib/shareCard';

interface StickyMobileProductBarProps {
  product: Product;
}

export default function StickyMobileProductBar({ product }: StickyMobileProductBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 260px (past product header on phone)
      if (window.scrollY > 260) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const score = product.fbs.score;
  const scoreColor = getScoreBandColor(score);

  return (
    <aside
      aria-label="Sticky product summary"
      className={`fixed top-0 left-0 right-0 z-40 bg-[var(--surface)] border-b-2 border-[var(--ink)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-transform duration-300 md:hidden pt-[max(6px,env(safe-area-inset-top))] px-3 pb-2.5 ${
        visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between gap-2.5 max-w-lg mx-auto">
        {/* Product thumb & name */}
        <Link
          href={`#top`}
          className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-90"
        >
          <div className="w-9 h-9 relative bg-white rounded-lg border border-[var(--ink)] shrink-0 overflow-hidden flex items-center justify-center p-0.5">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="36px"
                className="object-contain"
              />
            ) : (
              <span className="font-black text-xs">{product.name.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[var(--leaf)] uppercase tracking-wider block truncate leading-tight">
              {product.brand}
            </span>
            <h2 className="text-xs font-black text-[var(--ink)] truncate leading-tight">
              {product.name}
            </h2>
          </div>
        </Link>

        {/* FBS Badge */}
        {score !== null && (
          <div
            className="chip text-[11px] font-black py-0.5 px-2 text-white shrink-0 border border-[var(--ink)]"
            style={{ backgroundColor: scoreColor }}
          >
            FBS {score.toFixed(1)}
          </div>
        )}

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/compare?select=${product.slug}`}
            className="btn-chunky p-2 text-xs bg-white text-[var(--ink)]"
            title="Compare this product"
            aria-label="Compare"
          >
            <Scale className="w-4 h-4 text-[var(--berry)]" />
          </Link>
          <AddToCartButton slug={product.slug} productName={product.name} size="sm" />
        </div>
      </div>
    </aside>
  );
}
