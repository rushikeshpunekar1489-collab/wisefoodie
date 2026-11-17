'use client';

import React, { useEffect, useState, useId } from 'react';

export interface FBSVitalityLiquidCapsuleProps {
  score: number | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  interactive?: boolean;
  onScoreChange?: (score: number) => void;
  className?: string;
}

export interface FBSTier {
  min: number;
  max: number;
  name: string;
  color: string;
  deepColor: string;
  lightTint: string;
  textColor: string;
  summary: string;
}

export const FBS_TIERS: FBSTier[] = [
  {
    min: 8.0,
    max: 10.0,
    name: 'Exemplary',
    color: '#16A34A', // Leaf green
    deepColor: '#14532D',
    lightTint: '#F0FDF4',
    textColor: '#14532D',
    summary: 'Wholesome ingredients, high protein/fibre, minimal processing, no harmful additives.',
  },
  {
    min: 6.5,
    max: 7.9,
    name: 'Good',
    color: '#22C55E',
    deepColor: '#15803D',
    lightTint: '#F0FDF4',
    textColor: '#166534',
    summary: 'Balanced nutritional profile with moderate whole ingredients and low added sugars.',
  },
  {
    min: 4.5,
    max: 6.4,
    name: 'Moderate',
    color: '#FFB703', // Mango yellow
    deepColor: '#B45309',
    lightTint: '#FFFBEB',
    textColor: '#78350F',
    summary: 'Acceptable in moderation. Noticeable refined sugars, sodium, or saturated fats.',
  },
  {
    min: 2.5,
    max: 4.4,
    name: 'Caution',
    color: '#F97316',
    deepColor: '#C2410C',
    lightTint: '#FFF7ED',
    textColor: '#9A3412',
    summary: 'Frequent ultra-processed additives, elevated added sugar or excess sodium.',
  },
  {
    min: 0.0,
    max: 2.4,
    name: 'Avoid / UPF',
    color: '#DC2626',
    deepColor: '#991B1B',
    lightTint: '#FEF2F2',
    textColor: '#7F1D1D',
    summary: 'Ultra-processed food (UPF) with excessive sugars, refined palm oil, and high synthetic additives.',
  },
];

export function getFBSTier(score: number | null | undefined): FBSTier {
  if (score === null || score === undefined || isNaN(score)) {
    return {
      min: 0,
      max: 10,
      name: 'Auditing',
      color: '#64748B',
      deepColor: '#334155',
      lightTint: '#F8FAFC',
      textColor: '#475569',
      summary: 'Nutrition disclosure in progress.',
    };
  }
  const s = Math.max(0, Math.min(10, score));
  return FBS_TIERS.find((t) => s >= t.min && s <= t.max) || FBS_TIERS[FBS_TIERS.length - 1];
}

export default function FBSVitalityLiquidCapsule({
  score,
  size = 'md',
  showLabel = true,
  interactive = false,
  onScoreChange,
  className = '',
}: FBSVitalityLiquidCapsuleProps) {
  const isPending = score === null || score === undefined || isNaN(score);
  const currentScore = isPending ? 0 : Math.max(0, Math.min(10, score));
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [displayScore, setDisplayScore] = useState(currentScore);
  const uniqueId = useId().replace(/:/g, '');

  const tier = getFBSTier(isPending ? null : displayScore);

  // Smooth number interpolation and liquid fill
  useEffect(() => {
    const targetPercent = isPending ? 12 : Math.max(10, Math.min(94, (currentScore / 10) * 100));
    setAnimatedLevel(targetPercent);

    if (isPending) return;

    let start = displayScore;
    const diff = currentScore - start;
    if (Math.abs(diff) < 0.05) {
      setDisplayScore(currentScore);
      return;
    }

    const duration = 600;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = parseFloat((start + diff * ease).toFixed(1));
      setDisplayScore(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayScore(currentScore);
      }
    }

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [currentScore, isPending]);

  // Dimension scaling
  const dimensions = {
    sm: { width: 68, height: 130, numSize: 'text-2xl', labelSize: 'text-[10px]' },
    md: { width: 92, height: 180, numSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { width: 116, height: 230, numSize: 'text-4xl', labelSize: 'text-xs' },
    hero: { width: 140, height: 280, numSize: 'text-5xl', labelSize: 'text-sm' },
  }[size];

  const fillHeight = (animatedLevel / 100) * dimensions.height;
  const liquidTopY = dimensions.height - fillHeight;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Liquid Glass Capsule Body */}
      <div
        className="relative group transition-transform duration-300 hover:scale-[1.02]"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Glow ambient background aura */}
        <div
          className="absolute -inset-2 rounded-full blur-xl opacity-40 transition-colors duration-700 pointer-events-none"
          style={{ backgroundColor: tier.color }}
        />

        {/* Outer Capsule Shell with Glass Bevel */}
        <div
          className="relative w-full h-full rounded-full border-2 overflow-hidden shadow-xl"
          style={{
            borderColor: `${tier.color}45`,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(245,248,246,0.55) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* SVG Animated Liquid Container */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Vertical Liquid Gradient */}
              <linearGradient id={`liquidGrad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={tier.color} stopOpacity="0.88" />
                <stop offset="50%" stopColor={tier.color} stopOpacity="0.95" />
                <stop offset="100%" stopColor={tier.deepColor} stopOpacity="1" />
              </linearGradient>

              {/* Back Wave Gradient (Darker depth) */}
              <linearGradient id={`backWaveGrad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={tier.deepColor} stopOpacity="0.55" />
                <stop offset="100%" stopColor={tier.color} stopOpacity="0.75" />
              </linearGradient>

              {/* Clip path matching capsule shape */}
              <clipPath id={`capsuleClip-${uniqueId}`}>
                <rect
                  x="0"
                  y="0"
                  width={dimensions.width}
                  height={dimensions.height}
                  rx={dimensions.width / 2}
                  ry={dimensions.width / 2}
                />
              </clipPath>
            </defs>

            <g clipPath={`url(#capsuleClip-${uniqueId})`}>
              {/* Liquid Level Container smoothly translated in Y */}
              <g
                style={{
                  transform: `translateY(${liquidTopY}px)`,
                  transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* Back Liquid Wave (Offset Phase, Sloshing Back) */}
                <path
                  fill={`url(#backWaveGrad-${uniqueId})`}
                  d={`
                    M -${dimensions.width} 0
                    Q -${dimensions.width * 0.5} 8 0 0
                    T ${dimensions.width} 0
                    T ${dimensions.width * 2} 0
                    V ${dimensions.height * 2}
                    H -${dimensions.width}
                    Z
                  `}
                  className="animate-[waveBack_5s_ease-in-out_infinite_alternate]"
                />

                {/* Front Liquid Wave (Primary Active Surface Wave) */}
                <path
                  fill={`url(#liquidGrad-${uniqueId})`}
                  d={`
                    M -${dimensions.width} 0
                    Q -${dimensions.width * 0.5} -10 0 0
                    T ${dimensions.width} 0
                    T ${dimensions.width * 2} 0
                    V ${dimensions.height * 2}
                    H -${dimensions.width}
                    Z
                  `}
                  className="animate-[waveFront_3.2s_ease-in-out_infinite_alternate]"
                />

                {/* Subsurface Liquid Shimmer Line */}
                <ellipse
                  cx={dimensions.width / 2}
                  cy={1}
                  rx={dimensions.width * 0.38}
                  ry={3.5}
                  fill="rgba(255, 255, 255, 0.45)"
                  className="animate-pulse"
                />
              </g>

              {/* Rising Organic Vitality Bubbles */}
              <circle
                cx={dimensions.width * 0.35}
                cy={dimensions.height - 24}
                r={2.5}
                fill="rgba(255, 255, 255, 0.4)"
                className="animate-[bubbleFloat_3.4s_ease-in_infinite]"
              />
              <circle
                cx={dimensions.width * 0.65}
                cy={dimensions.height - 40}
                r={2}
                fill="rgba(255, 255, 255, 0.35)"
                className="animate-[bubbleFloat_2.6s_ease-in_infinite_1.2s]"
              />
              <circle
                cx={dimensions.width * 0.48}
                cy={dimensions.height - 14}
                r={1.5}
                fill="rgba(255, 255, 255, 0.3)"
                className="animate-[bubbleFloat_4s_ease-in_infinite_0.6s]"
              />
            </g>
          </svg>

          {/* Glossy Glass Highlight Overlay (Left Cylindrical Curve Reflection) */}
          <div
            className="absolute inset-y-2 left-2 w-2 rounded-full pointer-events-none opacity-60"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Top Curved Rim Specular Glint */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full pointer-events-none opacity-70"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
            }}
          />

          {/* Center Floating Readout Typography */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-2">
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-[#14211A]/80 font-extrabold mb-0.5">
              FBS
            </span>
            <div className="flex items-baseline">
              <span
                className={`font-black tracking-tight tabular-nums drop-shadow-sm ${dimensions.numSize}`}
                style={{
                  color: currentScore > 4.5 ? '#14211A' : '#14211A',
                }}
              >
                {isPending ? '—' : displayScore.toFixed(1)}
              </span>
            </div>
            <span className="font-bold text-[11px] tracking-wider text-[#14211A]/70 uppercase">
              / 10
            </span>
          </div>
        </div>

        {/* Optional Interactive Slider Handle if user wants to play with FBS */}
        {interactive && (
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={currentScore}
            onChange={(e) => onScoreChange?.(parseFloat(e.target.value))}
            aria-label="Adjust Food Benefit Score"
            className="absolute -bottom-8 left-0 right-0 h-1.5 accent-[#16A34A] cursor-pointer"
          />
        )}
      </div>

      {/* Rating Label and Category Badge */}
      {showLabel && (
        <div className="mt-3.5 flex flex-col items-center text-center">
          <span
            className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-xs transition-colors duration-500 text-white"
            style={{ backgroundColor: tier.color }}
          >
            {tier.name}
          </span>
          <span className="mt-1 text-[11px] font-bold text-[#14211A]/70 tracking-wide uppercase">
            Food Benefit Score
          </span>
        </div>
      )}

      {/* Embedded Wave Keyframes */}
      <style jsx>{`
        @keyframes waveFront {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(${dimensions.width}px);
          }
        }
        @keyframes waveBack {
          0% {
            transform: translateX(${dimensions.width}px);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes bubbleFloat {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-90px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
