'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'PRODUCTS', href: '/products' },
  { label: 'CATEGORIES', href: '/category' },
  { label: 'COMPARE', href: '/compare' },
  { label: 'CALCULATORS', href: '/fitness-calculators' },
  { label: 'DIARY', href: '/diary' },
  { label: 'AI DIETITIAN', href: '/ask' },
];

export interface RandomLetterSwapItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  className?: string;
  reverse?: boolean;
  staggerDuration?: number;
}

/**
 * RandomLetterSwapItem
 * Emulates the 21st.dev `m-random-letter-swap-1` by cnippet-dev / Daniel Petho.
 * When hovered, each letter swaps vertically in a randomized order with spring physics.
 */
export function RandomLetterSwapItem({
  label,
  href,
  isActive = false,
  className = '',
  reverse = false,
  staggerDuration = 0.022,
}: RandomLetterSwapItemProps) {
  const containerRef = useRef<HTMLAnchorElement | null>(null);
  const topCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const btmCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const chars = label.split('');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseEnter = () => {
    if (reducedMotion) return;

    // Generate random permutation of indices
    const indices = Array.from({ length: chars.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    indices.forEach((charIndex, rank) => {
      const top = topCharsRef.current[charIndex];
      const btm = btmCharsRef.current[charIndex];
      if (!top || !btm) return;

      const delay = rank * staggerDuration;
      const targetYTop = reverse ? '100%' : '-100%';
      const startYBtm = reverse ? '-100%' : '100%';

      gsap.set(btm, { y: startYBtm });

      tl.to(
        top,
        {
          y: targetYTop,
          duration: 0.34,
          ease: 'power3.out',
        },
        delay
      );

      tl.to(
        btm,
        {
          y: '0%',
          duration: 0.34,
          ease: 'power3.out',
        },
        delay
      );
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;

    // Generate fresh random permutation for the return transition
    const indices = Array.from({ length: chars.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    indices.forEach((charIndex, rank) => {
      const top = topCharsRef.current[charIndex];
      const btm = btmCharsRef.current[charIndex];
      if (!top || !btm) return;

      const delay = rank * (staggerDuration * 0.85);
      const exitYBtm = reverse ? '-100%' : '100%';

      tl.to(
        top,
        {
          y: '0%',
          duration: 0.28,
          ease: 'power3.out',
        },
        delay
      );

      tl.to(
        btm,
        {
          y: exitYBtm,
          duration: 0.28,
          ease: 'power3.out',
        },
        delay
      );
    });
  };

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  return (
    <Link
      ref={containerRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative inline-flex items-center gap-1.5 py-1 text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-colors select-none ${
        isActive
          ? 'text-[#14211A] dark:text-[#EAF5EE] font-extrabold'
          : 'text-[#14211A]/70 dark:text-[#EAF5EE]/70 hover:text-[#16A34A] dark:hover:text-[#34D399]'
      } ${className}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="inline-flex items-center">
        {chars.map((char, i) => (
          <span
            key={i}
            className="relative inline-flex flex-col overflow-hidden h-[1.3em] leading-[1.3em] align-middle"
          >
            {/* Top original letter */}
            <span
              ref={(el) => {
                topCharsRef.current[i] = el;
              }}
              className="inline-block will-change-transform"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>

            {/* Bottom duplicate letter (swapped in on hover) */}
            <span
              ref={(el) => {
                btmCharsRef.current[i] = el;
              }}
              className="absolute left-0 top-0 inline-block will-change-transform text-[#16A34A] dark:text-[#34D399]"
              style={{ transform: reverse ? 'translateY(-100%)' : 'translateY(100%)' }}
              aria-hidden="true"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>

      {/* Active underline indicator */}
      {isActive && (
        <span
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#16A34A] dark:bg-[#34D399] rounded-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

export interface RandomLetterSwapNavProps {
  items?: NavItem[];
  className?: string;
}

export default function RandomLetterSwapNav({
  items = DEFAULT_NAV_ITEMS,
  className = '',
}: RandomLetterSwapNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`hidden lg:flex items-center gap-6 xl:gap-8 ${className}`}
      aria-label="Main Navigation"
    >
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        return (
          <RandomLetterSwapItem
            key={item.href}
            label={item.label}
            href={item.href}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
}
