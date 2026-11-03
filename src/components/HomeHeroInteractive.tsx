'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sparkles, Search, Scan, ArrowRight, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SimpleProduct {
  name: string;
  brand: string;
  slug: string;
  category: string | null;
  image?: string | null;
  score: number | null;
}

interface HomeHeroInteractiveProps {
  products: SimpleProduct[];
}

export default function HomeHeroInteractive({ products }: HomeHeroInteractiveProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SimpleProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Slider state for FBS Vitality Capsule interactive demo
  const [sliderVal, setSliderVal] = useState(85);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Demo Score Calculation
  const demoScore = (sliderVal / 10).toFixed(1);
  const numericScore = parseFloat(demoScore);
  const demoBand =
    numericScore >= 9.0
      ? { label: 'EXCELLENT CHOICE', color: 'var(--leaf)', textColor: 'white' }
      : numericScore >= 8.0
      ? { label: 'VERY GOOD CHOICE', color: '#10b981', textColor: 'white' }
      : numericScore >= 7.0
      ? { label: 'GOOD CHOICE', color: '#84cc16', textColor: 'white' }
      : numericScore >= 5.0
      ? { label: 'MODERATE', color: 'var(--mango)', textColor: 'var(--ink)' }
      : numericScore >= 3.0
      ? { label: 'LIMITED', color: '#f97316', textColor: 'white' }
      : { label: 'POOR / TREAT', color: 'var(--tomato)', textColor: 'white' };

  // Search input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.toLowerCase().includes('maggi')) {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 800);
    }

    if (val.trim().length >= 2) {
      const q = val.toLowerCase();
      const matched = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        )
        .slice(0, 7);
      setResults(matched);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="hero relative overflow-hidden py-16 lg:py-24 text-center">
        {/* Floating Neo-Brutalist Food Stickers */}
        <div className="sticker" style={{ top: '12%', left: '8%', animationDelay: '0s' }}>🍓</div>
        <div className="sticker" style={{ top: '24%', right: '9%', animationDelay: '0.6s' }}>🥑</div>
        <div className="sticker" style={{ top: '56%', left: '6%', animationDelay: '1.2s' }}>🥨</div>
        <div className="sticker" style={{ top: '68%', right: '7%', animationDelay: '1.8s' }}>🥛</div>
        <div className="sticker" style={{ top: '82%', left: '12%', animationDelay: '2.4s' }}>🍪</div>

        <div className="container hero-content max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center gap-6">
          <div className="chip">
            <Sparkles className="w-4 h-4 text-[var(--mango)]" />
            <span>Independent Food Intelligence for India</span>
          </div>

          <h1 className="t-display-huge">
            Know Your Food<br />
            <span style={{ color: 'var(--leaf)' }}>Before You Buy It.</span>
          </h1>

          <p className="t-h3 max-w-xl mx-auto" style={{ opacity: 0.85 }}>
            Scan the label. See the true Food Benefit Score. Make a cleaner, healthier choice for yourself and your family.
          </p>

          {/* Search Pill */}
          <div
            ref={searchRef}
            className={`search-pill mt-2 relative ${isWiggling ? 'noodle-wiggle' : ''}`}
          >
            <Search className="w-6 h-6 text-[var(--ink)] opacity-70 shrink-0 ml-1" />
            <form onSubmit={handleFormSubmit} className="w-full">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search biscuits, chips, drinks, 'maggi'..."
                autoComplete="off"
                className="w-full"
              />
            </form>

            {/* Live Autocomplete Results */}
            {isOpen && (
              <div className="search-results active">
                {results.length > 0 ? (
                  results.map((product) => (
                    <div
                      key={product.slug}
                      className="search-item"
                      onClick={() => {
                        router.push(`/food/${product.slug}`);
                        setIsOpen(false);
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface-alt)] border border-[var(--ink)]/20 flex items-center justify-center shrink-0 overflow-hidden relative font-display font-black text-sm">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          product.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-sm truncate">{product.name}</div>
                        <div className="text-xs opacity-60 font-semibold">{product.brand} • {product.category}</div>
                      </div>
                      {product.score !== null && (
                        <div
                          className="chip text-xs py-0.5 px-2 font-black shrink-0"
                          style={{
                            background:
                              product.score >= 8
                                ? 'var(--mint)'
                                : product.score >= 5
                                ? 'var(--surface-alt)'
                                : '#ffe4e6',
                            color:
                              product.score >= 8
                                ? 'var(--leaf)'
                                : product.score >= 5
                                ? 'var(--ink)'
                                : 'var(--tomato)',
                          }}
                        >
                          ★ {product.score.toFixed(1)}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="search-item text-sm opacity-80 py-4 text-center">
                    Kuch nahi mila. Try &apos;Chips&apos;, &apos;Noodles&apos;, or &apos;Cookies&apos;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <Link href="/scanner" className="btn-chunky btn-primary w-full sm:w-auto text-center justify-center">
              <Scan className="w-5 h-5" /> Scan a Product
            </Link>
            <Link href="/explore" className="btn-chunky w-full sm:w-auto text-center justify-center">
              Explore 94+ Foods
            </Link>
            <Link href="/compare" className="btn-chunky btn-berry w-full sm:w-auto text-center justify-center">
              Compare 2 Foods
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE FBS VITALITY SCORE INTERACTIVE SECTION */}
      <section className="section-pad border-y-3 border-[var(--ink)]" style={{ background: 'var(--mint)' }}>
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <span className="chip mb-3 bg-white">
            <Sparkles className="w-3.5 h-3.5 text-[var(--leaf)]" /> Proprietary Algorithm
          </span>
          <h2 className="t-display-lg mb-4 text-[var(--ink)]">The FBS Vitality Score</h2>
          <p className="t-body max-w-2xl mx-auto mb-8 font-semibold text-[var(--ink)] opacity-90">
            Not just calories. We reward positive nutrition (protein, dietary fibre) and penalize industrial negatives (added sugar, saturated fat, sodium, trans-fat, refined carbs) per 100g to give you one honest, scientific number from 1 to 10.
          </p>

          <div className="fbs-container horizontal flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border-3 border-[var(--ink)] shadow-[var(--shadow-hard)] max-w-full">
            {/* Interactive Capsule */}
            <div
              className="capsule-wrapper max-w-full"
              style={{ width: 'min(300px, 100%)', height: '80px' }}
              onClick={() => setIsModalOpen(true)}
              title="Click to view full scientific breakdown"
            >
              <div className="capsule" id="demo-capsule">
                <div
                  className="capsule-liquid"
                  id="demo-liquid"
                  style={{
                    ['--band-color' as any]: demoBand.color,
                    width: `${sliderVal}%`,
                  }}
                />
                <div className="capsule-score" style={{ fontSize: '1.85rem' }}>
                  <span id="demo-score">{demoScore}</span>
                  <small> / 10</small>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
              <div
                className="fbs-band-label text-xs sm:text-sm"
                id="demo-band"
                style={{ background: demoBand.color, color: demoBand.textColor }}
              >
                {demoBand.label}
              </div>
              <p className="t-small font-extrabold text-[var(--ink)] opacity-70 text-xs sm:text-sm">
                Drag slider to simulate food quality
              </p>
              <input
                type="range"
                min="10"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                className="w-full max-w-[240px] h-8 accent-[var(--leaf)] cursor-pointer touch-action-manipulation"
                id="demo-slider"
                aria-label="Simulate Food Benefit Score with slider"
              />
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-chunky py-2 px-4 text-xs mt-1 min-h-[44px]"
              >
                <Info className="w-3.5 h-3.5 text-[var(--leaf)]" /> How is this calculated?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Breakdown Modal */}
      {isModalOpen && (
        <div
          className="bottom-sheet-overlay open z-[var(--z-modal,70)]"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bottom-sheet open max-w-lg mx-auto max-h-[85dvh] overflow-y-auto pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-drag" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="t-h2">FBS Calculation Formula</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-chunky p-1.5 rounded-full! border-2! w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close formula breakdown"
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-semibold opacity-70 mb-4">
              Deterministic, benchmarked against ICMR-NIN 2020 Dietary Guidelines for Indians.
            </p>

            <div className="flex justify-between items-center mb-4 p-3 bubble-card" style={{ background: 'var(--surface-alt)' }}>
              <div className="font-extrabold text-sm">Baseline Neutral Score</div>
              <div className="t-h3 font-black">6.0</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                <div>
                  <span className="font-extrabold">Protein Content</span>
                  <span className="text-xs opacity-60 block">Rewards high natural protein (up to +1.5 pts)</span>
                </div>
                <span className="font-black text-[var(--leaf)]">+0.0 to +1.5</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                <div>
                  <span className="font-extrabold">Dietary Fibre</span>
                  <span className="text-xs opacity-60 block">Rewards whole grains, nuts, seeds</span>
                </div>
                <span className="font-black text-[var(--leaf)]">+0.0 to +1.5</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                <div>
                  <span className="font-extrabold">Added Sugars</span>
                  <span className="text-xs opacity-60 block">Penalizes free and industrial sugars</span>
                </div>
                <span className="font-black text-[var(--tomato)]">-0.0 to -1.5</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                <div>
                  <span className="font-extrabold">Excess Sodium</span>
                  <span className="text-xs opacity-60 block">Penalizes salt load exceeding Indian RDA</span>
                </div>
                <span className="font-black text-[var(--tomato)]">-0.0 to -1.0</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--ink)]/20">
                <div>
                  <span className="font-extrabold">Saturated & Trans-Fat</span>
                  <span className="text-xs opacity-60 block">Penalizes palm oil & partially hydrogenated fats</span>
                </div>
                <span className="font-black text-[var(--tomato)]">-0.0 to -1.5</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t-3 border-[var(--ink)]">
              <div className="t-h3">Current Simulated FBS</div>
              <div className="t-display-lg" style={{ color: demoBand.color }}>
                {demoScore}
              </div>
            </div>

            <button
              type="button"
              className="btn-chunky w-full mt-4"
              onClick={() => setIsModalOpen(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
