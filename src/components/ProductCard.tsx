'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { ShieldCheck, Sparkles, Zap, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isSample = product.verification === 'sample';
  const score = product.fbs.score;
  const isPending = score === null || score === undefined;
  
  const scoreColor = isPending
    ? '#94a3b8'
    : score >= 9
    ? 'var(--leaf)'
    : score >= 7
    ? '#10b981'
    : score >= 5
    ? 'var(--mango)'
    : score >= 3
    ? '#f97316'
    : 'var(--tomato)';

  return (
    <Link
      href={`/food/${product.slug}`}
      className="product-card group"
    >
      {/* Product Image Area */}
      <div className="pc-image-wrap p-4 bg-white">
        {/* Verification badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {isSample ? (
            <span className="chip text-[10px] py-0.5 px-2 bg-[var(--mango)] text-[var(--ink)]">
              <Sparkles className="w-3 h-3" /> Sample
            </span>
          ) : (
            <span className="chip text-[10px] py-0.5 px-2 bg-[var(--mint)] text-[var(--ink)]">
              <ShieldCheck className="w-3 h-3 text-[var(--leaf)]" /> Verified
            </span>
          )}
        </div>

        {product.priceINR && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="chip text-[11px] py-0.5 px-2 bg-[var(--surface-alt)] font-extrabold">
              ₹{product.priceINR}
            </span>
          </div>
        )}

        {product.image ? (
          <div className="relative w-full h-44">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-44 flex items-center justify-center font-display font-black text-4xl text-[var(--ink)] opacity-30">
            {product.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pc-content">
        <div className="pc-brand text-[var(--leaf)]">{product.brand}</div>
        <h3 className="pc-name line-clamp-2 text-[var(--ink)]">{product.name}</h3>

        {/* Nutritional micro-facts */}
        <div className="grid grid-cols-3 gap-1 my-2 py-1.5 px-2 rounded-xl bg-[var(--surface-alt)] text-center text-[10px] font-extrabold border border-[var(--ink)]/10">
          <div>
            <div className="opacity-60 text-[9px] uppercase">Protein</div>
            <div className="text-[var(--ink)]">{product.per100g.proteinG !== null ? `${product.per100g.proteinG}g` : '—'}</div>
          </div>
          <div>
            <div className="opacity-60 text-[9px] uppercase">Sugar</div>
            <div className="text-[var(--tomato)]">{product.per100g.totalSugarG !== null ? `${product.per100g.totalSugarG}g` : '—'}</div>
          </div>
          <div>
            <div className="opacity-60 text-[9px] uppercase">Calories</div>
            <div className="text-[var(--ink)]">{product.per100g.energyKcal !== null ? `${product.per100g.energyKcal}` : '—'}</div>
          </div>
        </div>

        {/* Score pill */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div
            className="pc-score"
            style={{
              borderColor: scoreColor,
              color: scoreColor,
            }}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="font-extrabold">{score !== null ? `${score.toFixed(1)}` : 'Pending'}</span>
          </div>

          <span className="text-[var(--ink)] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
