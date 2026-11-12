'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import FavouriteButton from '@/components/FavouriteButton';
import AddToCartButton from '@/components/AddToCartButton';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';

interface ProductCardProps {
  product: Product;
  onToggleCompare?: (product: Product) => void;
  isComparing?: boolean;
}

export default function ProductCard({
  product,
  onToggleCompare,
  isComparing = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const score = product.fbs?.score;
  const isUPF = (score !== null && score !== undefined && score < 4.5) ||
    product.concerns?.some((c) => c.toLowerCase().includes('palm oil') || c.toLowerCase().includes('additive'));

  const price = product.priceINR;
  const hasValidImage = product.image && !imageError;
  const detailUrl = product.slug ? `/food/${product.slug}` : `/products/${product.id}`;

  return (
    <div className="group relative flex flex-col rounded-lg bg-surface-container-lowest border border-outline-variant/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden text-on-surface">
      {/* Top Media & Badge Area */}
      <div className="relative w-full aspect-square bg-surface-container-low/40 p-3 flex items-center justify-center overflow-hidden border-b border-outline-variant/20">
        {/* Verification Status Pill */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="font-label-caps text-[0.625rem] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold tracking-wider uppercase border border-primary/10">
            Forensic Audit
          </span>
        </div>

        {/* FBS Vitality Capsule */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <FBSVitalityCapsule score={score} size="xs" />
        </div>

        {/* Product Image or Botanical Seal */}
        <Link href={detailUrl} className="relative w-full h-full flex items-center justify-center">
          {hasValidImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-surface-container to-surface-container-low rounded-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-3xl text-primary/40 mb-1">
                verified_user
              </span>
              <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider line-clamp-1">
                {product.brand}
              </span>
              <span className="font-body-sm text-[0.6875rem] text-on-surface-variant/80 mt-0.5 line-clamp-1">
                Forensic Dossier
              </span>
            </div>
          )}
        </Link>

        {/* Floating Quick Action Buttons */}
        <div className="absolute bottom-2 left-2 z-10">
          <AddToCartButton slug={product.slug || product.id} productName={product.name} size="sm" />
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <FavouriteButton slug={product.slug || product.id} productName={product.name} size="sm" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        {/* Brand & Price Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-caps text-xs text-secondary font-bold uppercase tracking-wider truncate">
            {product.brand}
          </span>
          {price !== null && price !== undefined && (
            <span className="font-headline-sm text-xs font-bold text-primary tabular-nums">
              ₹{price}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link
          href={detailUrl}
          className="font-headline-sm text-sm text-primary group-hover:text-primary-container transition-colors line-clamp-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Nutritional Micro-Metrics */}
        <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-md bg-surface-container-low border border-outline-variant/25 text-center text-xs mt-auto">
          <div>
            <div className="font-label-caps text-[0.625rem] text-on-surface-variant uppercase">Protein</div>
            <div className="font-label-lg text-xs font-bold text-primary tabular-nums">
              {product.per100g?.proteinG !== null && product.per100g?.proteinG !== undefined
                ? `${product.per100g.proteinG}g`
                : '—'}
            </div>
          </div>
          <div>
            <div className="font-label-caps text-[0.625rem] text-on-surface-variant uppercase">Sugar</div>
            <div
              className={`font-label-lg text-xs font-bold tabular-nums ${
                (product.per100g?.totalSugarG ?? 0) > 15 ? 'text-error' : 'text-primary'
              }`}
            >
              {product.per100g?.totalSugarG !== null && product.per100g?.totalSugarG !== undefined
                ? `${product.per100g.totalSugarG}g`
                : '—'}
            </div>
          </div>
          <div>
            <div className="font-label-caps text-[0.625rem] text-on-surface-variant uppercase">Energy</div>
            <div className="font-label-lg text-xs font-bold text-primary tabular-nums">
              {product.per100g?.energyKcal !== null && product.per100g?.energyKcal !== undefined
                ? `${product.per100g.energyKcal}`
                : '—'}
            </div>
          </div>
        </div>

        {/* UPF Stamp or ₹10 Test Pill */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 gap-2">
          {isUPF ? (
            <span className="inline-flex items-center gap-1 font-label-caps text-[0.625rem] px-2 py-0.5 rounded-sm bg-error-container text-on-error-container border border-error/30 font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">warning</span>
              UPF Marker Alert
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-label-caps text-[0.625rem] px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">payments</span>
              The ₹10 Test
            </span>
          )}

          {/* Action Link / Compare */}
          <div className="flex items-center gap-1 ml-auto">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(product)}
                className={`p-1 rounded-full text-xs transition-colors ${
                  isComparing
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
                title={isComparing ? 'Remove from compare' : 'Pin to compare'}
              >
                <span className="material-symbols-outlined text-sm">
                  {isComparing ? 'check' : 'balance'}
                </span>
              </button>
            )}
            <Link
              href={detailUrl}
              className="p-1 text-on-surface-variant hover:text-primary transition-colors"
              title="Open Dossier"
            >
              <span className="material-symbols-outlined text-base">arrow_outward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
