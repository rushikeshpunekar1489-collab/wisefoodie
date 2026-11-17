'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Droplets } from 'lucide-react';
import { gsap } from 'gsap';

export interface InkSpillThemeSwitchProps {
  className?: string;
  showDropIndicator?: boolean;
}

interface Particle {
  id: number;
  angle: number; // in radians
  distanceRatio: number; // multiplier of main radius (e.g. 1.08 to 1.35)
  size: number; // radius in px
  opacity: number;
}

/**
 * Ink Spill Theme Switch
 * Inspired by @kedhareswer/ink-spill-theme-switch on 21st.dev.
 *
 * When toggled, the incoming theme spills out from the toggle coordinates
 * like liquid ink across the entire viewport, featuring:
 * - A ragged fractal edge distorted via SVG `feTurbulence` & `feDisplacementMap`
 * - Fluid hairline tendrils and micro-droplets shooting forward radially
 * - Smooth theme synchronization without layout shift or flickering
 * - Full accessibility and `prefers-reduced-motion` compliance
 */
export function InkSpillThemeSwitch({
  className = '',
  showDropIndicator = true,
}: InkSpillThemeSwitchProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inkState, setInkState] = useState<{
    originX: number;
    originY: number;
    color: string;
    maxRadius: number;
    progress: number;
    opacity: number;
    particles: Particle[];
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const animTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const filterId = useId().replace(/:/g, '-');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const triggerInkSpill = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
      if (isAnimating) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const nextTheme = isDark ? 'light' : 'dark';

      // If user prefers reduced motion, skip the ink spill animation
      if (prefersReducedMotion) {
        setTheme(nextTheme);
        return;
      }

      // Calculate origin coordinates
      let originX = window.innerWidth / 2;
      let originY = window.innerHeight / 2;

      if (e && 'clientX' in e && e.clientX > 0 && e.clientY > 0) {
        originX = e.clientX;
        originY = e.clientY;
      } else if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }

      // Calculate max radius to cover every corner of the viewport
      const cornerDists = [
        Math.hypot(originX, originY),
        Math.hypot(window.innerWidth - originX, originY),
        Math.hypot(originX, window.innerHeight - originY),
        Math.hypot(window.innerWidth - originX, window.innerHeight - originY),
      ];
      const maxRadius = Math.max(...cornerDists) * 1.15 + 60;

      // Color of spilling ink
      // Switching to dark -> rich deep botanical forest ink (#0A130E)
      // Switching to light -> rich warm cream milk ink (#FFFBF2)
      const spillColor = nextTheme === 'dark' ? '#0A130E' : '#FFFBF2';

      // Generate 16 radial satellite droplet particles
      const particles: Particle[] = Array.from({ length: 16 }, (_, i) => {
        const baseAngle = (i / 16) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * 0.35;
        return {
          id: i,
          angle: baseAngle + jitter,
          distanceRatio: 1.08 + Math.random() * 0.26,
          size: 6 + Math.random() * 16,
          opacity: 0.8 + Math.random() * 0.2,
        };
      });

      setIsAnimating(true);
      setInkState({
        originX,
        originY,
        color: spillColor,
        maxRadius,
        progress: 0,
        opacity: 1,
        particles,
      });

      // Kill any previous timeline
      if (animTimelineRef.current) {
        animTimelineRef.current.kill();
      }

      const animObj = { progress: 0, opacity: 1 };
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          setInkState(null);
        },
      });

      animTimelineRef.current = tl;

      // Stage 1: Expand ink wave across screen (0ms - 550ms)
      tl.to(animObj, {
        progress: 1,
        duration: 0.65,
        ease: 'power3.inOut',
        onUpdate: () => {
          setInkState((prev) =>
            prev ? { ...prev, progress: animObj.progress } : null
          );
        },
      });

      // Stage 2: Midway through the spill, trigger theme switch in DOM
      tl.add(() => {
        setTheme(nextTheme);
      }, 0.38);

      // Stage 3: Smoothly dissolve ink overlay once screen is covered
      tl.to(
        animObj,
        {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          onUpdate: () => {
            setInkState((prev) =>
              prev ? { ...prev, opacity: animObj.opacity } : null
            );
          },
        },
        0.58
      );
    },
    [isAnimating, isDark, setTheme]
  );

  return (
    <>
      {/* Tactile Toggle Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={triggerInkSpill}
        disabled={isAnimating}
        className={`group relative min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 rounded-full border border-outline-variant/50 bg-surface-container text-on-surface hover:bg-surface-container-high transition-all duration-300 shadow-2xs hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
        aria-label={
          isDark
            ? 'Switch to Light Theme (Ink Spill Transition)'
            : 'Switch to Dark Theme (Ink Spill Transition)'
        }
        title={
          isDark
            ? 'Switch to Light Mode (Ink Spill)'
            : 'Switch to Dark Mode (Ink Spill)'
        }
      >
        {/* Sun / Moon Icon Transition */}
        <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
          <Sun
            className={`w-5 h-5 text-amber-500 transition-all duration-500 absolute ${
              isDark
                ? 'opacity-0 rotate-90 scale-50'
                : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <Moon
            className={`w-5 h-5 text-emerald-400 transition-all duration-500 absolute ${
              isDark
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-90 scale-50'
            }`}
          />
        </div>

        {/* Liquid droplet indicator badge */}
        {showDropIndicator && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-600'
            }`}
            title="Ink Spill Transition Active"
          >
            <Droplets className="w-2.5 h-2.5" />
          </span>
        )}
      </button>

      {/* Full-Screen Ink Spill Portal Overlay */}
      {inkState && (
        <div
          className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden"
          style={{ opacity: inkState.opacity }}
          aria-hidden="true"
        >
          {/* SVG Filter for Organic Fractal Turbulence & Fluid Tendrils */}
          <svg
            className="absolute w-0 h-0 overflow-hidden"
            aria-hidden="true"
            style={{ position: 'absolute', width: 0, height: 0 }}
          >
            <defs>
              <filter
                id={`ink-filter-${filterId}`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                {/* Generates fine fractal noise texture */}
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.018"
                  numOctaves="4"
                  result="noise"
                  seed="8"
                />
                {/* Distorts the circular boundary into ragged ink tendrils */}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="85"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="displaced"
                />
                {/* Feathers the displaced edge slightly to simulate fluid bleed */}
                <feGaussianBlur in="displaced" stdDeviation="0.7" result="feathered" />
                <feMerge>
                  <feMergeNode in="feathered" />
                  <feMergeNode in="SourceGraphic" opacity="0.3" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Liquid Ink Spill SVG Canvas */}
          <svg
            className="w-full h-full"
            style={{
              width: '100vw',
              height: '100vh',
            }}
          >
            <g filter={`url(#ink-filter-${filterId})`}>
              {/* Main Expanding Ink Reservoir */}
              <circle
                cx={inkState.originX}
                cy={inkState.originY}
                r={inkState.progress * inkState.maxRadius}
                fill={inkState.color}
              />

              {/* Satellite Droplets shooting outward ahead of the front */}
              {inkState.particles.map((p) => {
                const currentDist =
                  inkState.progress * inkState.maxRadius * p.distanceRatio;
                const px = inkState.originX + Math.cos(p.angle) * currentDist;
                const py = inkState.originY + Math.sin(p.angle) * currentDist;

                // Only render droplets while expanding before being enveloped
                if (inkState.progress > 0.88) return null;

                return (
                  <circle
                    key={p.id}
                    cx={px}
                    cy={py}
                    r={p.size * Math.sin(inkState.progress * Math.PI)}
                    fill={inkState.color}
                    opacity={p.opacity}
                  />
                );
              })}
            </g>
          </svg>
        </div>
      )}
    </>
  );
}

export default InkSpillThemeSwitch;
