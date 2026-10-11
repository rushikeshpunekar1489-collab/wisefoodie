'use client';

import React, { useEffect, useState } from 'react';

interface FBSVitalityCapsuleProps {
  score: number | null;
  band?: string | null;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

const BAND_CONFIGS: Record<string, { color: string; label: string }> = {
  Excellent: { color: 'var(--leaf)', label: 'EXCELLENT CHOICE' },
  'Very Good': { color: '#10b981', label: 'VERY GOOD CHOICE' },
  Good: { color: '#84cc16', label: 'GOOD CHOICE' },
  Moderate: { color: 'var(--mango)', label: 'MODERATE' },
  Limited: { color: '#f97316', label: 'LIMIT INTAKE' },
  Poor: { color: 'var(--tomato)', label: 'POOR / TREAT' },
};

export default function FBSVitalityCapsule({
  score,
  band,
  orientation = 'vertical',
  size = 'md',
  showLabel = true,
  onClick,
}: FBSVitalityCapsuleProps) {
  const [animatedHeight, setAnimatedHeight] = useState(0);

  const isPending = score === null || score === undefined;
  const safeScore = score ?? 0;
  const fillPercentage = Math.min(100, Math.max(12, safeScore * 10));

  const resolvedBand = band || (safeScore >= 9 ? 'Excellent' : safeScore >= 8 ? 'Very Good' : safeScore >= 7 ? 'Good' : safeScore >= 5 ? 'Moderate' : safeScore >= 3 ? 'Limited' : 'Poor');
  const bandConfig = !isPending
    ? BAND_CONFIGS[resolvedBand] || BAND_CONFIGS['Moderate']
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
        className="fbs-container horizontal items-center cursor-pointer"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        <div className="capsule-wrapper" style={{ width: size === 'sm' ? 180 : 340, height: size === 'sm' ? 64 : 96 }}>
          <div className="capsule">
            <div
              className="capsule-liquid"
              style={{
                ['--band-color' as any]: bandConfig.color,
                width: `${animatedHeight}%`,
              }}
            />
            <div className="capsule-score" style={{ fontSize: size === 'sm' ? '1.5rem' : '2.2rem' }}>
              <span>{isPending ? 'Pending' : safeScore.toFixed(1)}</span>
              {!isPending && <small>/ 10</small>}
            </div>
          </div>
        </div>

        {showLabel && (
          <div className="flex flex-col gap-1 items-start">
            <span
              className="fbs-band-label"
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
  const wrapperWidth = size === 'sm' ? 76 : size === 'lg' ? 130 : 100;
  const wrapperHeight = size === 'sm' ? 180 : size === 'lg' ? 300 : 230;

  return (
    <div
      className="fbs-container cursor-pointer select-none"
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
            style={{ fontSize: size === 'sm' ? '1.8rem' : size === 'lg' ? '3.2rem' : '2.4rem' }}
          >
            <span>{isPending ? '—' : safeScore.toFixed(1)}</span>
            {!isPending && <small>/ 10</small>}
          </div>
        </div>
      </div>

      {showLabel && (
        <div
          className="fbs-band-label text-center"
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
