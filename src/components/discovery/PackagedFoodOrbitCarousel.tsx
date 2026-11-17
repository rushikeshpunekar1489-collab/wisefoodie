'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  ShieldCheck,
  Search,
  ScanLine,
  Scale,
  Flame,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import FBSVitalityLiquidCapsule from '@/components/FBSVitalityLiquidCapsule';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface SimpleProduct {
  name: string;
  brand: string;
  slug: string;
  category: string | null;
  image?: string | null;
  score: number | null;
}

export interface ShowcaseProduct {
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  eyebrow: string;
  title1: string;
  title2: string;
  brand: string;
  name: string;
  image: string;
  fbsScore: number;
  fbsLabel: string;
  fbsBandColor: string;
  tagline: string;
  likes: number;
  comments: number;
  overview: string;
  keyNutrients: { label: string; val: string; isGood?: boolean }[];
  ingredients: string[];
  benefits: string[];
  concerns: string[];
  accentColor: string;
}

export const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'quaker-oats',
    slug: 'quaker-quaker-oats-breakfast-cereal-718',
    category: 'Breakfast Cereals',
    categoryLabel: 'Breakfast Cereals',
    eyebrow: '#1 AUDITED WHOLE GRAIN',
    title1: 'KNOW WHAT',
    title2: 'YOU EAT',
    brand: 'Quaker / PepsiCo',
    name: 'Rolled Oats (100% Whole Grain)',
    image: '/orbit/quaker-oats-plate.png',
    fbsScore: 9.2,
    fbsLabel: 'Exemplary',
    fbsBandColor: '#16A34A',
    tagline: 'Whole grains, high soluble fibre, and complete nutrition transparency.',
    likes: 18450,
    comments: 342,
    overview:
      'Whole grain rolled oats delivering intact beta-glucan soluble fibre. Digests slowly to maintain even glycemic control with zero added sucrose or chemical additives.',
    keyNutrients: [
      { label: 'Energy', val: '389 kcal' },
      { label: 'Protein', val: '11.8g', isGood: true },
      { label: 'Fibre', val: '10.5g', isGood: true },
      { label: 'Added Sugar', val: '0.0g', isGood: true },
      { label: 'Sodium', val: '4.0mg', isGood: true },
    ],
    ingredients: ['Whole Grain Rolled Oats (100%)'],
    benefits: ['Lowers LDL Cholesterol (Beta-Glucan)', 'High Satiety Index', 'Zero Added Sugars'],
    concerns: ['None. Unadulterated whole grain.'],
    accentColor: '#16A34A',
  },
  {
    id: 'tropicana-juice',
    slug: 'tropicana-tropicana-delight-mixed-fruit-juice-132',
    category: 'Fruit Juices',
    categoryLabel: 'Fruit Juices',
    eyebrow: '#2 "HEALTH" CLAIM AUDIT',
    title1: 'STAY HYDRATED',
    title2: 'CHOOSE BETTER',
    brand: 'Tropicana',
    name: '100% Orange Fruit Juice',
    image: '/orbit/tropicana-juice-plate.png',
    fbsScore: 2.7,
    fbsLabel: 'Caution',
    fbsBandColor: '#FFB703',
    tagline: 'Reconstituted fruit extract with stripped insoluble fibre and 12.8g liquid sugar load.',
    likes: 34120,
    comments: 890,
    overview:
      'Marketed as healthy breakfast beverage, but mechanical juice extraction strips out essential insoluble fibre, leaving 12.8g fast-absorbing free sugars per 100ml.',
    keyNutrients: [
      { label: 'Energy', val: '52 kcal' },
      { label: 'Protein', val: '0.4g' },
      { label: 'Fibre', val: '0.1g' },
      { label: 'Total Sugar', val: '12.8g', isGood: false },
      { label: 'Vitamin C', val: '30mg', isGood: true },
    ],
    ingredients: [
      'Water',
      'Concentrated Orange Juice (19%)',
      'Sugar',
      'Acidity Regulator (INS 330)',
      'Antioxidant (INS 300)',
    ],
    benefits: ['Supplies Daily Vitamin C Requirement'],
    concerns: ['High Glycemic Load', 'Strips Intact Dietary Fibre', 'Promotes Rapid Insulin Spikes'],
    accentColor: '#FFB703',
  },
  {
    id: 'good-day-biscuit',
    slug: 'britannia-britannia-good-day-butter-cookies-trans-fat-free-56',
    category: 'Biscuits & Cookies',
    categoryLabel: 'Biscuits',
    eyebrow: '#3 POPULAR TEA-TIME AUDIT',
    title1: 'SNACK SMART',
    title2: 'STAY HEALTHY',
    brand: 'Britannia',
    name: 'Good Day Butter Cookies',
    image: '/orbit/good-day-plate.png',
    fbsScore: 3.0,
    fbsLabel: 'Caution',
    fbsBandColor: '#EA580C',
    tagline: 'Refined wheat flour, high palm oil shortening and 22.5% sugar load.',
    likes: 78240,
    comments: 1420,
    overview:
      'Iconic Indian tea-time cookie formulation reliant on ultra-refined maida, commercial palm oil, and high added sugar (22.5g per 100g) with less than 2% actual dairy butter.',
    keyNutrients: [
      { label: 'Energy', val: '489 kcal' },
      { label: 'Protein', val: '6.8g' },
      { label: 'Added Sugar', val: '22.5g', isGood: false },
      { label: 'Sat Fat', val: '11.2g', isGood: false },
      { label: 'Sodium', val: '310mg' },
    ],
    ingredients: [
      'Refined Wheat Flour (Maida) (57%)',
      'Sugar',
      'Refined Palm Oil',
      'Butter (2%)',
      'Invert Sugar Syrup',
      'Leavening (INS 503ii, 500ii)',
      'Emulsifiers (INS 322, 471)',
    ],
    benefits: ['Readily Available Caloric Energy'],
    concerns: ['Refined Maida Base (57%)', 'High Saturated Palm Fat (11.2g)', 'Deceptive Butter Claims (Only 2%)'],
    accentColor: '#EA580C',
  },
  {
    id: 'maggi-noodles',
    slug: 'maggi-maggi-2-minute-instant-noodles-635',
    category: 'Instant Food',
    categoryLabel: 'Instant Noodles',
    eyebrow: '#4 ULTRA-PROCESSED FOOD (UPF)',
    title1: 'EAT BETTER',
    title2: 'LIVE HEALTHIER',
    brand: 'Nestlé Maggi',
    name: '2-Minute Masala Instant Noodles',
    image: '/orbit/maggi-noodles-plate.png',
    fbsScore: 2.2,
    fbsLabel: 'Avoid / UPF',
    fbsBandColor: '#DC2626',
    tagline: 'Deep-fried maida cake with extreme sodium surpassing 61% daily adult RDA ceiling.',
    likes: 45680,
    comments: 2190,
    overview:
      'Ultra-processed noodle cake flash-fried in palm oil. The seasoning tastemaker injects 1,230mg sodium in a single snack—over 61% of an adult’s entire daily ICMR-NIN safe ceiling.',
    keyNutrients: [
      { label: 'Energy', val: '427 kcal' },
      { label: 'Protein', val: '8.0g' },
      { label: 'Sodium', val: '1,230mg', isGood: false },
      { label: 'Sat Fat', val: '7.2g', isGood: false },
      { label: 'Fibre', val: '2.1g' },
    ],
    ingredients: [
      'Refined Wheat Flour (Maida)',
      'Palm Oil',
      'Iodised Salt',
      'Hydrolysed Groundnut Protein',
      'Flavour Enhancers (INS 635)',
      'Acidity Regulators (INS 501i, 500i)',
      'Thickener (INS 508)',
    ],
    benefits: ['Rapid 2-Minute Preparation'],
    concerns: ['Severe Sodium Surge (1,230mg)', 'Flash-Fried in Palm Oil', 'INS 635 Flavour Enhancers'],
    accentColor: '#DC2626',
  },
  {
    id: 'protein-bar',
    slug: 'yoga-bar-yoga-bar-super-high-protein-muesli-723',
    category: 'Clean Nutrition',
    categoryLabel: 'Clean Snacks',
    eyebrow: '#5 TRANSPARENT INGREDIENTS',
    title1: 'PURE PROTEIN',
    title2: 'ZERO JUNK',
    brand: 'The Whole Truth / Yoga Bar',
    name: '100% Clean Whole Protein Bar',
    image: '/orbit/protein-bar-plate.png',
    fbsScore: 8.4,
    fbsLabel: 'Exemplary',
    fbsBandColor: '#0284C7',
    tagline: 'Zero added sugar, zero artificial sweeteners, zero palm oil. Sweetened only by dates.',
    likes: 29800,
    comments: 512,
    overview:
      'Clean plant and dairy protein blend sweetened strictly with whole dates. Zero artificial sweeteners (sucralose, maltitol), zero emulsifiers, providing 15g clean protein.',
    keyNutrients: [
      { label: 'Energy', val: '210 kcal' },
      { label: 'Protein', val: '15.0g', isGood: true },
      { label: 'Fibre', val: '7.5g', isGood: true },
      { label: 'Added Sugar', val: '0.0g', isGood: true },
      { label: 'Sat Fat', val: '2.1g' },
    ],
    ingredients: ['Dates', 'Whey Protein Isolate', 'Almonds', 'Cashews', 'Cocoa Powder'],
    benefits: ['Complete Amino Acid Profile', '100% Whole Food Ingredients', 'High Satiety Index'],
    concerns: ['Calorie-dense, consume according to daily targets'],
    accentColor: '#0284C7',
  },
];

// Orbital Arc calculation function matching 21st.dev reference
export function arcPath(
  a0: number,
  a1: number,
  cx: number,
  cy: number,
  r: number,
  w: number,
  steps = 48
): string {
  const outer: string[] = [];
  const inner: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45);
    const c = Math.cos(a);
    const s = Math.sin(a);
    outer.push((cx + c * (r + h)).toFixed(1) + ' ' + (cy + s * (r + h)).toFixed(1));
    inner.push((cx + c * (r - h)).toFixed(1) + ' ' + (cy + s * (r - h)).toFixed(1));
  }
  return 'M' + outer.join('L') + 'L' + inner.reverse().join('L') + 'Z';
}

const ARC_REST = [
  [50, 98],
  [46, 124],
  [60, 126],
  [40, 100],
  [48, 115],
];

const ARC_SWEEP = [38, 146];
const ORBIT_X = 299;
const ORBIT_Y = -450;
const ORBIT_R = 650;
const SWING = 50;

const HIDE_1 = 'inset(0% 0% 0% 100%)'; // Thin line wipes to right
const HIDE_2 = 'inset(0% 100% 0% 0%)'; // Heavy line wipes to left
const SHOW = 'inset(0% 0% 0% 0%)';

const POPULAR_AUDITS = [
  { label: 'Rolled Oats', query: 'oats' },
  { label: 'Good Day', query: 'good day' },
  { label: 'Instant Noodles', query: 'maggi' },
  { label: 'Orange Juice', query: 'tropicana' },
  { label: 'Toned Milk', query: 'amul' },
  { label: 'Whole Wheat Bread', query: 'bread' },
];

interface PackagedFoodOrbitCarouselProps {
  products?: SimpleProduct[];
}

export default function PackagedFoodOrbitCarousel({ products = [] }: PackagedFoodOrbitCarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<'overview' | 'nutrition' | 'ingredients'>('overview');
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  // Search State
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SimpleProduct[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Animation Refs
  const shownIndex = useRef(-1);
  const dirRef = useRef<1 | -1>(1);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reducedRef = useRef(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arcRef = useRef<SVGPathElement | null>(null);
  const arcAngles = useRef({ a0: 50, a1: 98 });

  const total = SHOWCASE_PRODUCTS.length;
  const current = SHOWCASE_PRODUCTS[index];

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'ArrowRight' && document.activeElement !== searchInputRef.current) {
        step(1);
      }
      if (e.key === 'ArrowLeft' && document.activeElement !== searchInputRef.current) {
        step(-1);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [index, total]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    const handler = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Helper to jump to a specific product with shortest direction
  const goTo = (next: number, forcedDir?: 1 | -1) => {
    const wrapped = ((next % total) + total) % total;
    if (wrapped === index) return;

    let d: 1 | -1 = forcedDir ?? 1;
    if (!forcedDir) {
      const fwd = ((wrapped - index) % total + total) % total;
      d = fwd <= total - fwd ? 1 : -1;
    }
    dirRef.current = d;
    setIndex(wrapped);
  };

  const step = (d: 1 | -1) => goTo(index + d, d);

  // Touch Swipe navigation
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      step(dx < 0 ? 1 : -1);
    }
  };

  // Search input change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      const q = val.toLowerCase().trim();
      const matched = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        )
        .slice(0, 6);
      setSearchResults(matched);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  // The Master GSAP Swap Animation (100% mathematical fidelity to 21st.dev reference)
  useIsomorphicLayoutEffect(() => {
    const from = shownIndex.current;
    const to = index;

    const parts = (i: number) => {
      const head = headRefs.current[i];
      return {
        orbit: orbitRefs.current[i],
        head,
        eye: head?.querySelector<HTMLElement>('.dsh-eye'),
        t1: head?.querySelector<HTMLElement>('.dsh-t1'),
        t2: head?.querySelector<HTMLElement>('.dsh-t2'),
        card: cardRefs.current[i],
      };
    };

    const drawArc = () => {
      if (arcRef.current) {
        arcRef.current.setAttribute(
          'd',
          arcPath(arcAngles.current.a0, arcAngles.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118)
        );
      }
    };

    const rest = ARC_REST[to % ARC_REST.length] || [50, 98];
    const targetProduct = SHOWCASE_PRODUCTS[to];
    const tint = targetProduct ? targetProduct.accentColor : '#16A34A';

    // Cancel running timeline if active
    if (tlRef.current) {
      tlRef.current.progress(1).kill();
      tlRef.current = null;
    }

    const b = parts(to);

    // Initial mount or reduced motion
    if (from === -1 || from === to || reducedRef.current) {
      for (let i = 0; i < total; i++) {
        if (i !== to) {
          const p = parts(i);
          if (p.orbit) gsap.set(p.orbit, { autoAlpha: 0, rotation: 0 });
          if (p.head) gsap.set(p.head, { autoAlpha: 0 });
          if (p.card) gsap.set(p.card, { autoAlpha: 0, y: 0 });
        }
      }
      if (b.orbit) gsap.set(b.orbit, { autoAlpha: 1, rotation: 0 });
      if (b.head) gsap.set(b.head, { autoAlpha: 1 });
      if (b.eye) gsap.set(b.eye, { autoAlpha: 1, y: 0 });
      if (b.t1) gsap.set(b.t1, { clipPath: SHOW });
      if (b.t2) gsap.set(b.t2, { clipPath: SHOW });
      if (b.card) gsap.set(b.card, { autoAlpha: 1, y: 0 });

      arcAngles.current.a0 = rest[0];
      arcAngles.current.a1 = rest[1];
      drawArc();
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint });

      shownIndex.current = to;
      return;
    }

    const a = parts(from);
    const d = dirRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        tlRef.current = null;
        shownIndex.current = to;
      },
    });
    tlRef.current = tl;

    // 1. Packaged Food Plate Orbital Swing & RESET
    if (a.orbit && b.orbit) {
      tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: 'power2.in' }, 0)
        .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62) // Crucial reset to prevent accumulation!
        .fromTo(
          b.orbit,
          { autoAlpha: 1, rotation: -SWING * d },
          { rotation: 0, duration: 0.95, ease: 'power3.out' },
          0.3
        );
    }

    // 2. Center Two-Weight Headline Wipe
    if (a.t1 && a.t2 && b.t1 && b.t2) {
      tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: 'power2.in' }, 0)
        .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: 'power2.in' }, 0.06);
      if (a.eye) tl.to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0);
      if (a.head) tl.set(a.head, { autoAlpha: 0 }, 0.5);
      if (b.head) tl.set(b.head, { autoAlpha: 1 }, 0.5);
      if (b.eye) tl.fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.55);
      tl.fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: 'power3.out' }, 0.55)
        .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: 'power3.out' }, 0.62);
    }

    // 3. Right Product Card Transition
    if (a.card && b.card) {
      tl.to(a.card, { autoAlpha: 0, y: -6, duration: 0.3, ease: 'power1.in' }, 0.05)
        .set(b.card, { autoAlpha: 1, y: 0 }, 0.4)
        .fromTo(
          b.card.children,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
          0.4
        );
    }

    // 4. Background Pastel Arc Stretching & Color Morphing
    tl.to(
      arcAngles.current,
      {
        a0: ARC_SWEEP[0],
        a1: ARC_SWEEP[1],
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: drawArc,
      },
      0
    ).to(
      arcAngles.current,
      {
        a0: rest[0],
        a1: rest[1],
        duration: 0.85,
        ease: 'power3.out',
        onUpdate: drawArc,
      },
      0.6
    );

    if (arcRef.current) {
      tl.to(arcRef.current, { fill: tint, duration: 1.1, ease: 'power1.inOut' }, 0.1);
    }
  }, [index, total]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#FFFBF2] dark:bg-[#0D1511] text-[#14211A] dark:text-[#EAF5EE] pt-4 pb-16 sm:pt-6 sm:pb-24 border-b border-[#14211A]/10 dark:border-white/10 font-sans selection:bg-[#16A34A] selection:text-white transition-colors duration-300"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="WiseFoodies Hero Product Orbit Showcase"
    >
      {/* Background Soft Ambient Arc SVG (Traces the Plate Orbit Path) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute -left-10 -top-24 sm:-left-20 sm:-top-20 w-[960px] sm:w-[1280px] h-[640px] sm:h-[720px] opacity-[0.24] transition-opacity duration-700"
          viewBox="0 0 960 520"
          aria-hidden="true"
        >
          <path ref={arcRef} fill={current.accentColor} />
        </svg>

        {/* Subtle Graphic Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(#14211A 1px, transparent 1px), radial-gradient(#14211A 1px, #FFFBF2 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
        {/* =========================================================================
            1. HERO TOP BAR: Brand Pill + Live Autocomplete Search + Fast CTA Actions
           ========================================================================= */}
        <div className="space-y-4 pt-2">
          {/* Top Trust Eyebrows */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14211A]/5 dark:bg-white/5 border border-[#14211A]/10 dark:border-white/10 font-bold tracking-widest text-[#14211A] dark:text-[#EAF5EE] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>WISEFOODIES • INDEPENDENT FOOD INTELLIGENCE</span>
            </div>

            <div className="flex items-center gap-4 font-semibold text-[#14211A]/70 dark:text-[#EAF5EE]/70">
              <span className="hidden sm:inline">852 Indian Packaged Foods Audited</span>
              <div className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-bold">Zero Brand Bias</span>
              </div>
            </div>
          </div>

          {/* Interactive Fast Search Input Bar */}
          <div ref={searchContainerRef} className="relative w-full max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-[#14211A]/40 dark:text-[#EAF5EE]/40 pointer-events-none">
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (query.trim().length >= 2) setIsSearchOpen(true);
                }}
                placeholder="Search 852 Indian packaged products, brands or ingredients..."
                className="w-full pl-12 pr-32 py-3 sm:py-3.5 rounded-2xl bg-white dark:bg-[#141F1A] border border-[#14211A]/15 dark:border-white/15 shadow-[0_4px_20px_-4px_rgba(20,33,26,0.06)] text-[#14211A] dark:text-[#EAF5EE] placeholder:text-[#14211A]/40 dark:placeholder:text-[#EAF5EE]/40 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition-all"
                aria-label="Search food database"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <kbd className="hidden md:inline-block px-2 py-1 rounded bg-[#FFFBF2] dark:bg-[#1C2A24] border border-[#14211A]/15 dark:border-white/15 text-[11px] font-mono text-[#14211A]/60 dark:text-[#EAF5EE]/60 shadow-2xs">
                  /
                </kbd>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#14211A] dark:bg-[#16A34A] text-white hover:bg-[#16A34A] dark:hover:bg-[#22C55E] text-xs font-bold tracking-wider uppercase transition-colors inline-flex items-center gap-1 shadow-xs"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#141F1A] rounded-2xl border border-[#14211A]/10 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(20,33,26,0.18)] z-50 overflow-hidden divide-y divide-[#14211A]/5 dark:divide-white/10">
                <div className="p-2.5 bg-[#FFFBF2] dark:bg-[#1C2A24] text-[11px] font-bold text-[#14211A]/60 dark:text-[#EAF5EE]/60 uppercase tracking-wider flex items-center justify-between">
                  <span>Direct Match Products</span>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="text-[#16A34A] dark:text-[#34D399] hover:underline"
                  >
                    View all results →
                  </Link>
                </div>
                {searchResults.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/food/${p.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3 hover:bg-[#FFFBF2] dark:hover:bg-[#1C2A24] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#14211A]/8 flex items-center justify-center p-1 shrink-0">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            width={36}
                            height={36}
                            className="object-contain max-h-full"
                          />
                        ) : (
                          <Sparkles className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#14211A] group-hover:text-[#16A34A] transition-colors line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-[#14211A]/60 flex items-center gap-2">
                          <span>{p.brand}</span>
                          {p.category && <span>• {p.category}</span>}
                        </div>
                      </div>
                    </div>
                    {p.score !== null && (
                      <div
                        className="px-2 py-0.5 rounded text-[11px] font-black text-white shrink-0"
                        style={{
                          backgroundColor:
                            p.score >= 8
                              ? '#16A34A'
                              : p.score >= 6.5
                              ? '#22C55E'
                              : p.score >= 4.5
                              ? '#FFB703'
                              : p.score >= 2.5
                              ? '#F97316'
                              : '#DC2626',
                        }}
                      >
                        FBS {p.score.toFixed(1)}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {/* Popular Audit Pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#14211A]/50 font-medium">Popular Audits:</span>
              {POPULAR_AUDITS.map((tag) => (
                <Link
                  key={tag.label}
                  href={`/search?q=${encodeURIComponent(tag.query)}`}
                  className="px-2.5 py-1 rounded-full bg-white border border-[#14211A]/10 text-[#14211A]/80 hover:text-[#14211A] hover:border-[#14211A]/30 text-xs font-semibold shadow-2xs transition-all hover:scale-105"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. DISH ORBIT STAGE (100% Mathematical Orbit Animation Experience)
           ========================================================================= */}
        <div className="relative min-h-[480px] lg:min-h-[520px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 mt-2">
          {/* LEFT: Orbital Product Plate Box */}
          <div className="relative w-[280px] sm:w-[320px] lg:w-[360px] h-[280px] sm:h-[320px] lg:h-[360px] flex items-center justify-center shrink-0">
            {/* Visual Motion Accent Lines */}
            <div className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 opacity-50 pointer-events-none">
              <span className="w-6 sm:w-8 h-[3px] rounded-full bg-[#14211A]/40 -rotate-12" />
              <span className="w-8 sm:w-10 h-[3px] rounded-full bg-[#14211A]/70" />
              <span className="w-5 sm:w-7 h-[3px] rounded-full bg-[#14211A]/40 rotate-12" />
            </div>

            {/* Orbiting Packaged Product Images Stack */}
            <div className="relative w-full h-full">
              {SHOWCASE_PRODUCTS.map((prod, i) => (
                <div
                  key={prod.id}
                  ref={(el) => {
                    orbitRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex items-center justify-center will-change-transform"
                  style={{
                    transformOrigin: '69% -217%',
                    visibility: i === index ? 'visible' : 'hidden',
                  }}
                  aria-hidden={i !== index}
                >
                  <div className="relative w-full h-full p-2 group cursor-pointer" onClick={() => step(1)}>
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      priority={i < 2}
                      className="object-contain filter drop-shadow-[0_20px_28px_rgba(20,33,26,0.22)] drop-shadow-[0_4px_6px_rgba(20,33,26,0.12)] transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 360px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Editorial Two-Weight Display Typography & Actions */}
          <div className="relative w-full lg:max-w-[400px] flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            <div className="w-full relative min-h-[190px] sm:min-h-[200px]">
              {SHOWCASE_PRODUCTS.map((prod, i) => (
                <div
                  key={prod.id}
                  ref={(el) => {
                    headRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex flex-col items-center lg:items-start justify-center"
                  style={{ visibility: i === index ? 'visible' : 'hidden' }}
                  aria-hidden={i !== index}
                >
                  {/* Category Pill Eyebrow */}
                  <div className="dsh-eye inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/25 text-[#14532D] font-bold text-xs tracking-wider uppercase mb-3 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    <span>{prod.eyebrow}</span>
                  </div>

                  {/* Two-Weight Headline (Line 1: Light & Wide, Line 2: Heavy & Punchy) */}
                  <h2 className="leading-[0.96] tracking-tight uppercase select-none">
                    <span className="dsh-t1 block font-extralight text-3xl sm:text-4xl lg:text-5xl text-[#14211A] tracking-wider">
                      {prod.title1}
                    </span>
                    <span className="dsh-t2 block font-black text-4xl sm:text-5xl lg:text-6xl text-[#14211A] tracking-tight mt-1.5">
                      {prod.title2}
                    </span>
                  </h2>

                  {/* Action Links */}
                  <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold uppercase tracking-wider">
                    <Link
                      href={`/food/${prod.slug}`}
                      className="inline-flex items-center gap-1 text-[#14211A] hover:text-[#16A34A] transition-colors group"
                    >
                      <span>Explore this audit</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <span className="text-[#14211A]/20">•</span>
                    <Link
                      href={`/compare`}
                      className="text-[#14211A]/70 hover:text-[#14211A] transition-colors underline underline-offset-4 decoration-[#14211A]/30"
                    >
                      Compare food
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Vertical Pager Dots */}
            <div
              className="mt-6 flex items-center justify-center lg:justify-start gap-2"
              role="tablist"
              aria-label="Choose featured product"
            >
              {SHOWCASE_PRODUCTS.map((prod, i) => (
                <button
                  key={prod.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={prod.name}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-[#14211A] dark:bg-[#34D399]' : 'w-2.5 bg-[#14211A]/25 dark:bg-white/20 hover:bg-[#14211A]/50 dark:hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Floating Premium Product Information Card with FBS Liquid Capsule */}
          <div className="relative w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[380px] shrink-0 z-20">
            <div className="relative min-h-[460px] sm:min-h-[480px]">
              {SHOWCASE_PRODUCTS.map((prod, i) => (
                <div
                  key={prod.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute inset-0 bg-white dark:bg-[#141F1A] rounded-3xl p-6 sm:p-7 border border-[#14211A]/10 dark:border-white/10 shadow-[0_12px_36px_-10px_rgba(20,33,26,0.12)] flex flex-col justify-between"
                  style={{ visibility: i === index ? 'visible' : 'hidden' }}
                  aria-hidden={i !== index}
                >
                  {/* Card Header: Liquid Capsule + Classification Badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#14211A]/8 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      {/* Embedded Mini FBS Vitality Liquid Capsule */}
                      <FBSVitalityLiquidCapsule
                        score={prod.fbsScore}
                        size="sm"
                        showLabel={false}
                        interactive={false}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-black tracking-wider uppercase px-2 py-0.5 rounded-md text-white shadow-xs"
                            style={{ backgroundColor: prod.fbsBandColor }}
                          >
                            FBS {prod.fbsScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-[#14211A]/70 dark:text-[#EAF5EE]/70 uppercase mt-0.5">
                          {prod.fbsLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Audited</span>
                    </div>
                  </div>

                  {/* Product Title & Brand */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-bold text-[#14211A]/60 dark:text-[#EAF5EE]/60 uppercase tracking-widest block">
                      {prod.brand}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#14211A] dark:text-[#EAF5EE] leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#14211A]/70 dark:text-[#EAF5EE]/70 leading-relaxed pt-1">{prod.tagline}</p>
                  </div>

                  {/* Social Audits Activity */}
                  <div className="flex items-center gap-4 py-2.5 my-1.5 border-y border-[#14211A]/8 dark:border-white/10 text-xs text-[#14211A]/75 dark:text-[#EAF5EE]/75 font-medium">
                    <button
                      type="button"
                      onClick={() =>
                        setLiked((prev) => ({ ...prev, [prod.id]: !prev[prod.id] }))
                      }
                      className="inline-flex items-center gap-1.5 hover:text-red-600 transition-colors"
                      aria-label="Like product"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          liked[prod.id] ? 'fill-red-500 text-red-500' : 'text-[#14211A]/50 dark:text-[#EAF5EE]/50'
                        }`}
                      />
                      <span>{(prod.likes + (liked[prod.id] ? 1 : 0)).toLocaleString()} likes</span>
                    </button>

                    <div className="inline-flex items-center gap-1.5 text-[#14211A]/60 dark:text-[#EAF5EE]/60">
                      <MessageSquare className="w-4 h-4" />
                      <span>{prod.comments} audits</span>
                    </div>
                  </div>

                  {/* Interactive Tabs: Overview | Nutrition | Ingredients */}
                  <div className="space-y-3">
                    <div
                      className="flex items-center gap-4 border-b border-[#14211A]/8 dark:border-white/10 text-xs font-bold uppercase tracking-wider"
                      role="tablist"
                    >
                      {(['overview', 'nutrition', 'ingredients'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="tab"
                          aria-selected={tab === t}
                          onClick={() => setTab(t)}
                          className={`pb-2 border-b-2 transition-colors ${
                            tab === t
                              ? 'border-[#14211A] dark:border-[#34D399] text-[#14211A] dark:text-[#EAF5EE]'
                              : 'border-transparent text-[#14211A]/40 dark:text-[#EAF5EE]/40 hover:text-[#14211A]/70 dark:hover:text-[#EAF5EE]/70'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[105px] text-xs">
                      {tab === 'overview' && (
                        <p className="text-[#14211A]/80 dark:text-[#EAF5EE]/80 leading-relaxed">{prod.overview}</p>
                      )}

                      {tab === 'nutrition' && (
                        <div className="grid grid-cols-2 gap-2">
                          {prod.keyNutrients.map((n) => (
                            <div
                              key={n.label}
                              className="p-2 rounded-lg bg-[#FFFBF2] dark:bg-[#1C2A24] border border-[#14211A]/8 dark:border-white/10 flex items-center justify-between"
                            >
                              <span className="text-[#14211A]/60 dark:text-[#EAF5EE]/60 text-[11px]">{n.label}</span>
                              <span
                                className={`font-bold tabular-nums ${
                                  n.isGood === true
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : n.isGood === false
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : 'text-[#14211A] dark:text-[#EAF5EE]'
                                }`}
                              >
                                {n.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {tab === 'ingredients' && (
                        <div className="space-y-1.5 max-h-[105px] overflow-y-auto pr-1">
                          <p className="text-[11px] text-[#14211A]/60 dark:text-[#EAF5EE]/60 font-semibold uppercase">
                            Disclosed Ingredients:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {prod.ingredients.map((ing) => (
                              <span
                                key={ing}
                                className="px-2 py-0.5 rounded-full bg-[#FFFBF2] dark:bg-[#1C2A24] border border-[#14211A]/10 dark:border-white/10 text-[10px] text-[#14211A] dark:text-[#EAF5EE]"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Audit Deep Dive Link */}
                  <div className="pt-3 border-t border-[#14211A]/8 dark:border-white/10 flex items-center justify-between">
                    <Link
                      href={`/food/${prod.slug}`}
                      className="w-full py-2.5 rounded-xl bg-[#14211A] dark:bg-[#16A34A] text-white hover:bg-[#16A34A] dark:hover:bg-[#22C55E] transition-colors text-center text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>View Forensic Audit</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. BOTTOM HORIZONTAL THUMBNAIL DOCK / CAROUSEL
           ========================================================================= */}
        <div className="pt-6 border-t border-[#14211A]/10">
          <div className="relative flex items-center justify-between gap-2 sm:gap-4">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous product"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#14211A]/12 shadow-sm flex items-center justify-center text-[#14211A] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition-all shrink-0 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Thumbnail Carousel Track */}
            <div className="overflow-x-auto no-scrollbar scroll-smooth py-2 flex-1">
              <div className="flex items-center gap-3 sm:gap-4 px-2 min-w-max mx-auto justify-center">
                {SHOWCASE_PRODUCTS.map((prod, i) => {
                  const isActive = i === index;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group relative flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white shadow-[0_8px_20px_-4px_rgba(20,33,26,0.14)] border-2 border-[#14211A] scale-105 sm:scale-110'
                          : 'bg-white/60 hover:bg-white border border-[#14211A]/10 opacity-75 hover:opacity-100 hover:scale-100'
                      }`}
                    >
                      {/* Product Thumbnail Image */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          width={64}
                          height={64}
                          className="object-contain max-h-full transition-transform group-hover:scale-110"
                        />
                      </div>

                      {/* Category Label */}
                      <span
                        className={`text-[11px] font-bold tracking-tight whitespace-nowrap ${
                          isActive ? 'text-[#14211A]' : 'text-[#14211A]/70'
                        }`}
                      >
                        {prod.categoryLabel}
                      </span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] absolute -bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next product"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#14211A]/12 shadow-sm flex items-center justify-center text-[#14211A] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition-all shrink-0 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
