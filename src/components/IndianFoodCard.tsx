'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PackagedFoodItem } from '@/types/packaged-food';
import FavouriteButton from '@/components/FavouriteButton';
import AddToCartButton from '@/components/AddToCartButton';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';

interface IndianFoodCardProps {
  product: PackagedFoodItem;
  onToggleCompare?: (product: PackagedFoodItem) => void;
  isComparing?: boolean;
  highlightQuery?: string;
}

export default function IndianFoodCard({
  product,
  onToggleCompare,
  isComparing = false,
  highlightQuery = '',
}: IndianFoodCardProps) {
  const [imageError, setImageError] = useState(false);

  // Approximate FBS score from nutrient profile for instant display if not explicitly precomputed
  const sugarPenalty = (product.sugarG ?? 0) * 0.15;
  const satFatPenalty = (product.saturatedFatG ?? 0) * 0.2;
  const sodiumPenalty = ((product.sodiumMg ?? 0) / 1000) * 1.5;
  const proteinBonus = (product.proteinG ?? 0) * 0.25;
  const fiberBonus = (product.dietaryFiberG ?? 0) * 0.35;
  const calculatedScore = Math.max(1.0, Math.min(10.0, 7.5 - sugarPenalty - satFatPenalty - sodiumPenalty + proteinBonus + fiberBonus));

  const isUPF = (product.sugarG ?? 0) > 20 || (product.sodiumMg ?? 0) > 800 || calculatedScore < 4.5;
  const hasValidImage = product.image && !imageError;

  const renderHighlighted = (text: string) => {
    if (!highlightQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${highlightQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightQuery.toLowerCase() ? (
        <mark key={i} className="bg-secondary-fixed text-on-secondary-fixed rounded-xs px-0.5 font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="group relative flex flex-col rounded-lg bg-surface-container-lowest border border-outline-variant/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden text-on-surface">
      {/* Media and Header Area */}
      <div className="relative w-full aspect-square bg-surface-container-low/40 p-3 flex items-center justify-center overflow-hidden border-b border-outline-variant/20">
        {/* Verification Status Pill */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="font-label-caps text-[0.625rem] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold tracking-wider uppercase border border-primary/10">
            {product.category || 'Packaged Food'}
          </span>
        </div>

        {/* FBS Vitality Capsule */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <FBSVitalityCapsule score={calculatedScore} size="xs" />
        </div>

        {/* Product Image or Forensic Emblem */}
        <Link href={`/products/${product.id}`} className="relative w-full h-full flex items-center justify-center">
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
                inventory_2
              </span>
              <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider line-clamp-1">
                {product.brand}
              </span>
              <span className="font-body-sm text-[0.6875rem] text-on-surface-variant/80 mt-0.5 line-clamp-1">
                {product.subCategory || 'Forensic Dossier'}
              </span>
            </div>
          )}
        </Link>

        {/* Floating Controls */}
        <div className="absolute bottom-2 left-2 z-10">
          <AddToCartButton slug={product.slug || product.id} productName={product.name} size="sm" />
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <FavouriteButton slug={product.slug || product.id} productName={product.name} size="sm" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        {/* Brand and Price */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-caps text-xs text-secondary font-bold uppercase tracking-wider truncate">
            {renderHighlighted(product.brand)}
          </span>
          {product.priceINR !== null && product.priceINR !== undefined && (
            <span className="font-headline-sm text-xs font-bold text-primary tabular-nums">
              ₹{product.priceINR}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.id}`}
          className="font-headline-sm text-sm text-primary group-hover:text-primary-container transition-colors line-clamp-2 leading-snug"
          title={product.name}
        >
          {renderHighlighted(product.name)}
        </Link>

        {/* Nutrient Matrix (Energy, Protein, Sugar, Sodium) */}
        <div className="grid grid-cols-4 gap-1 py-1.5 px-2 rounded-md bg-surface-container-low border border-outline-variant/25 text-center text-xs mt-auto">
          <div>
            <span className="font-label-caps text-[0.625rem] text-on-surface-variant uppercase block">Energy</span>
            <span className="font-label-lg text-xs font-bold text-primary tabular-nums">
              {product.caloriesKcal !== null ? `${product.caloriesKcal}` : '—'}
            </span>
          </div>
          <div>
            <span className="font-label-caps text-[0.625rem] text-on-surface-variant uppercase block">Protein</span>
            <span className="font-label-lg text-xs font-bold text-primary tabular-nums">
              {product.proteinG !== null ? `${product.proteinG}g` : '—'}
            </span>
          </div>
          <div>
            <span className="font-label-caps text-[0.625rem] text-on-surface-variant uppercase block">Sugar</span>
            <span className={`font-label-lg text-xs font-bold tabular-nums ${(product.sugarG ?? 0) > 15 ? 'text-error' : 'text-primary'}`}>
              {product.sugarG !== null ? `${product.sugarG}g` : '—'}
            </span>
          </div>
          <div>
            <span className="font-label-caps text-[0.625rem] text-on-surface-variant uppercase block">Sodium</span>
            <span className="font-label-lg text-xs font-bold text-primary tabular-nums">
              {product.sodiumMg !== null ? `${product.sodiumMg}` : '—'}
            </span>
          </div>
        </div>

        {/* Footer: UPF Warning or Category Tag + Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 gap-2">
          {isUPF ? (
            <span className="inline-flex items-center gap-1 font-label-caps text-[0.625rem] px-2 py-0.5 rounded-sm bg-error-container text-on-error-container border border-error/30 font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">warning</span>
              UPF Risk
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-label-caps text-[0.625rem] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Audited
            </span>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(product)}
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  isComparing
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
                title={isComparing ? 'Remove from compare' : 'Pin to compare'}
              >
                <span className="material-symbols-outlined text-base">
                  {isComparing ? 'check' : 'balance'}
                </span>
              </button>
            )}

            <Link
              href={`/products/${product.id}`}
              className="p-1 text-on-surface-variant hover:text-primary transition-colors"
              title="View Forensic Facts"
            >
              <span className="material-symbols-outlined text-base">arrow_outward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
