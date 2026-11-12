'use client';

import React, { useEffect, useState } from 'react';

interface FBSVitalityCapsuleProps {
  score: number | null | undefined;
  band?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  orientation?: 'vertical' | 'horizontal';
  showLabel?: boolean;
  onClick?: () => void;
}

interface TierConfig {
  min: number;
  max: number;
  color: string;
  containerTint: string;
  textColor: string;
  tierName: string;
}

const TIERS: TierConfig[] = [
  { min: 8.0, max: 10.0, color: '#059669', containerTint: '#ECFDF5', textColor: '#065F46', tierName: 'EXEMPLARY' },
  { min: 6.5, max: 7.9, color: '#16A34A', containerTint: '#F0FDF4', textColor: '#14532D', tierName: 'GOOD' },
  { min: 4.5, max: 6.4, color: '#D97706', containerTint: '#FFFBEB', textColor: '#78350F', tierName: 'MODERATE' },
  { min: 2.5, max: 4.4, color: '#EA580C', containerTint: '#FFF7ED', textColor: '#7C2D12', tierName: 'CAUTION' },
  { min: 0.0, max: 2.4, color: '#DC2626', containerTint: '#FEF2F2', textColor: '#7F1D1D', tierName: 'AVOID / UPF' },
];

export default function FBSVitalityCapsule({
  score,
  size = 'md',
  orientation = 'horizontal',
  showLabel = true,
  onClick,
}: FBSVitalityCapsuleProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const isPending = score === null || score === undefined || isNaN(score);
  const safeScore = isPending ? 0 : Math.max(0, Math.min(10, score));
  const progressPercent = isPending ? 0 : (safeScore / 10) * 100;

  const tier = !isPending
    ? TIERS.find((t) => safeScore >= t.min && safeScore <= t.max) || TIERS[TIERS.length - 1]
    : { color: '#717975', containerTint: '#e6f0eb', textColor: '#414845', tierName: 'PENDING' };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  // Micro / Compact badge (for cards)
  if (size === 'xs') {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs font-sans select-none"
        style={{
          backgroundColor: tier.containerTint,
          borderColor: `${tier.color}40`,
        }}
        onClick={onClick}
        title={`Food Benefit Score: ${safeScore.toFixed(1)}/10 (${tier.tierName})`}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
          style={{ backgroundColor: tier.color }}
        />
        <span
          className="font-display font-bold text-sm tabular-nums leading-none"
          style={{ color: tier.textColor }}
        >
          {isPending ? '—' : safeScore.toFixed(1)}
        </span>
        {showLabel && (
          <span
            className="font-label-caps text-[0.625rem] tracking-wider uppercase font-bold"
            style={{ color: tier.textColor }}
          >
            {tier.tierName}
          </span>
        )}
      </div>
    );
  }

  // Horizontal Capsule
  if (orientation === 'horizontal') {
    return (
      <div
        className={`flex items-center gap-3 p-2.5 rounded-2xl border shadow-xs transition-all ${
          onClick ? 'cursor-pointer hover:shadow-sm active:scale-[0.99]' : ''
        }`}
        style={{
          backgroundColor: tier.containerTint,
          borderColor: `${tier.color}33`,
        }}
        onClick={onClick}
      >
        {/* Metric capsule track */}
        <div
          className="relative overflow-hidden rounded-full border flex-shrink-0"
          style={{
            width: size === 'sm' ? 84 : 112,
            height: size === 'sm' ? 32 : 40,
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderColor: `${tier.color}40`,
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${animatedProgress}%`,
              backgroundColor: tier.color,
              opacity: 0.85,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="font-display font-bold tabular-nums text-primary text-base drop-shadow-xs"
              style={{
                fontSize: size === 'sm' ? '1rem' : '1.25rem',
              }}
            >
              {isPending ? '—' : safeScore.toFixed(1)}
              <span className="text-[0.65rem] opacity-70 font-sans ml-0.5">/10</span>
            </span>
          </div>
        </div>

        {/* Labels */}
        {showLabel && (
          <div className="flex flex-col min-w-0">
            <span
              className="font-label-caps text-xs tracking-wider uppercase font-bold truncate"
              style={{ color: tier.textColor }}
            >
              {tier.tierName}
            </span>
            <span className="font-label-caps text-[0.65rem] text-on-surface-variant uppercase tracking-wider">
              Food Benefit Score
            </span>
          </div>
        )}
      </div>
    );
  }

  // Vertical (Signature Dossier Pillar)
  const width = size === 'sm' ? 68 : size === 'lg' ? 96 : 80;
  const height = size === 'sm' ? 140 : size === 'lg' ? 220 : 180;

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border shadow-sm ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      style={{
        backgroundColor: tier.containerTint,
        borderColor: `${tier.color}33`,
      }}
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden rounded-full border p-1"
        style={{
          width,
          height,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          borderColor: `${tier.color}40`,
        }}
      >
        {/* Dynamic liquid fill meniscus level */}
        <div
          className="w-full absolute bottom-0 left-0 right-0 rounded-b-full transition-all duration-1000 ease-out"
          style={{
            height: `${animatedProgress}%`,
            backgroundColor: tier.color,
            opacity: 0.88,
          }}
        />

        {/* Floating Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span
            className="font-display font-bold tabular-nums text-primary drop-shadow-xs"
            style={{
              fontSize: size === 'sm' ? '1.5rem' : size === 'lg' ? '2.5rem' : '2rem',
            }}
          >
            {isPending ? '—' : safeScore.toFixed(1)}
          </span>
          <span className="font-sans text-[0.7rem] uppercase font-bold text-primary/70">
            / 10
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className="font-label-caps text-xs px-2.5 py-1 rounded-full text-center font-bold tracking-wider"
          style={{
            backgroundColor: tier.color,
            color: '#FFFFFF',
          }}
        >
          {tier.tierName}
        </span>
      )}
    </div>
  );
}
