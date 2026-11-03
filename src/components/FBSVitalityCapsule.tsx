'use client';

import React, { useEffect, useState } from 'react';

interface FBSVitalityCapsuleProps {
  score: number | null | undefined;
  band?: string | null;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'vertical' | 'horizontal';
  showLabel?: boolean;
  onClick?: () => void;
}

const BANDS = [
  { min: 9.0, max: 10.0, color: 'var(--leaf)', label: 'EXCELLENT CHOICE' },
  { min: 8.0, max: 8.9, color: '#10b981', label: 'VERY GOOD CHOICE' },
  { min: 7.0, max: 7.9, color: '#84cc16', label: 'GOOD CHOICE' },
  { min: 5.0, max: 6.9, color: 'var(--mango)', label: 'MODERATE' },
  { min: 3.0, max: 4.9, color: '#f97316', label: 'LIMITED' },
  { min: 1.0, max: 2.9, color: 'var(--tomato)', label: 'POOR / TREAT' },
];

export default function FBSVitalityCapsule({
  score,
  size = 'md',
  orientation = 'vertical',
  showLabel = true,
  onClick,
}: FBSVitalityCapsuleProps) {
  const [animatedHeight, setAnimatedHeight] = useState(0);

  const isPending = score === null || score === undefined || isNaN(score);
  const safeScore = isPending ? 0 : Math.max(1, Math.min(10, score));
  const fillPercentage = isPending ? 0 : ((safeScore - 1) / 9) * 100;

  const bandConfig = !isPending
    ? BANDS.find((b) => safeScore >= b.min && safeScore <= b.max) || BANDS[BANDS.length - 1]
    : { color: '#94a3b8', label: 'SCORE PENDING' };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHeight(isPending ? 20 : fillPercentage);
    }, 120);
    return () => clearTimeout(timer);
  }, [fillPercentage, isPending]);

  if (orientation === 'horizontal') {
    return (
      <div
        className="fbs-container horizontal flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-full cursor-pointer touch-action-manipulation"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        <div
          className="capsule-wrapper max-w-full"
          style={{
            width: size === 'sm' ? 160 : 'min(300px, 100%)',
            height: size === 'sm' ? 56 : 76,
          }}
        >
          <div className="capsule">
            <div
              className="capsule-liquid"
              style={{
                ['--band-color' as any]: bandConfig.color,
                width: `${animatedHeight}%`,
              }}
            />
            <div
              className="capsule-score"
              style={{ fontSize: size === 'sm' ? '1.35rem' : '1.85rem' }}
            >
              <span>{isPending ? 'Pending' : safeScore.toFixed(1)}</span>
              {!isPending && <small>/ 10</small>}
            </div>
          </div>
        </div>

        {showLabel && (
          <div className="flex flex-col gap-0.5 items-center sm:items-start text-center sm:text-left max-w-full">
            <span
              className="fbs-band-label text-xs sm:text-sm font-extrabold max-w-full truncate"
              style={{
                background: bandConfig.color,
                color: safeScore < 5 && !isPending ? 'var(--ink)' : 'white',
              }}
            >
              {bandConfig.label}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--ink)] opacity-60">
              Food Benefit Score
            </span>
          </div>
        )}
      </div>
    );
  }

  // Vertical (Signature)
  const wrapperWidth = size === 'sm' ? 70 : size === 'lg' ? 116 : 92;
  const wrapperHeight = size === 'sm' ? 160 : size === 'lg' ? 260 : 210;

  return (
    <div
      className="fbs-container cursor-pointer select-none max-w-full touch-action-manipulation"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div
        className="capsule-wrapper"
        style={{ width: wrapperWidth, height: wrapperHeight }}
      >
        <div className="capsule">
          <div
            className="capsule-liquid"
            style={{
              ['--band-color' as any]: bandConfig.color,
              height: `${animatedHeight}%`,
            }}
          />
          <div
            className="capsule-score"
            style={{ fontSize: size === 'sm' ? '1.6rem' : size === 'lg' ? '2.8rem' : '2.2rem' }}
          >
            <span>{isPending ? '—' : safeScore.toFixed(1)}</span>
            {!isPending && <small>/ 10</small>}
          </div>
        </div>
      </div>

      {showLabel && (
        <div
          className="fbs-band-label text-center text-xs sm:text-sm max-w-full"
          style={{
            background: bandConfig.color,
            color: safeScore < 5 && !isPending ? 'var(--ink)' : 'white',
          }}
        >
          {bandConfig.label}
        </div>
      )}
    </div>
  );
}
