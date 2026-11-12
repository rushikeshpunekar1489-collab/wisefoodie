'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';

interface SimpleProduct {
  name: string;
  brand: string;
  slug: string;
  category: string | null;
  image?: string | null;
  score: number | null;
}

interface ConsumerHealthHeroProps {
  products: SimpleProduct[];
}

const CATEGORIES = [
  { label: 'All Audits', slug: 'all', icon: 'all_inclusive' },
  { label: 'Breakfast Cereals', slug: 'cereal', icon: 'breakfast_dining' },
  { label: 'Biscuits & Cookies', slug: 'biscuit', icon: 'cookie' },
  { label: 'Instant Noodles', slug: 'noodles', icon: 'ramen_dining' },
  { label: 'Juices & Drinks', slug: 'beverage', icon: 'local_drink' },
  { label: 'Dairy & Frozen', slug: 'dairy', icon: 'icecream' },
];

export default function ConsumerHealthHero({ products }: ConsumerHealthHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SimpleProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [realityMode, setRealityMode] = useState<'claim' | 'truth'>('claim');
  const searchRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length >= 2) {
      const q = val.toLowerCase();
      const matched = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        )
        .slice(0, 6);
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
    } else {
      router.push('/products');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-surface border-b border-outline-variant/30">
      <div className="container max-w-6xl mx-auto px-4 relative z-1 space-y-8 sm:space-y-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps uppercase tracking-wider text-xs border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Forensic Food Intelligence Dossier</span>
          </div>

          <div className="flex items-center gap-2 font-label-caps text-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>852 INDIAN PACKAGED FOODS AUDITED</span>
          </div>
        </div>

        {/* Hero Headline & Interactive Decoder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h1 className="font-display-hero text-3xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.08]">
              Clean ingredients are a basic human right. <br />
              <span className="font-serif italic text-primary-container">
                Not a luxury marketing premium.
              </span>
            </h1>

            <p className="font-body-lg text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-xl">
              We scientifically audit Indian supermarket groceries to reveal what brands hide on the back label. Zero corporate sponsorships, zero paid listings — just 100% independent food benefit scores.
            </p>

            {/* Live Search Bar */}
            <div ref={searchRef} className="relative max-w-xl">
              <form onSubmit={handleFormSubmit} className="relative flex items-center">
                <div className="relative w-full flex items-center bg-surface-container-lowest border border-outline-variant/60 rounded-full shadow-xs focus-within:border-primary focus-within:shadow-sm transition-all h-12 px-4">
                  <span className="material-symbols-outlined text-on-surface-variant mr-2 text-xl">search</span>
                  <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search: Maggi, Bournvita, Real, Kissan, Britannia..."
                    className="w-full font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/70 bg-transparent border-none outline-none"
                  />
                  <button
                    type="submit"
                    className="ml-2 px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-caps text-xs uppercase font-bold shrink-0 hidden sm:inline-flex items-center gap-1 hover:bg-primary-container transition-colors"
                  >
                    <span>Audit</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </form>

              {/* Instant Predictive Results Dropdown */}
              {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-lg z-50 overflow-hidden divide-y divide-outline-variant/20 animate-fade-in">
                  <div className="p-2.5 bg-surface-container-low font-label-caps text-[0.6875rem] uppercase text-on-surface-variant flex justify-between items-center">
                    <span>Instant Laboratory Audit</span>
                    <span>FBS Score / 10</span>
                  </div>
                  {results.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/food/${product.slug}`}
                      className="p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <div className="w-10 h-10 rounded-lg border border-outline-variant/30 overflow-hidden relative shrink-0 bg-white">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-headline-sm text-sm text-primary group-hover:text-primary-container line-clamp-1">
                            {product.name}
                          </div>
                          <div className="font-body-sm text-xs text-on-surface-variant">
                            {product.brand} &bull; {product.category || 'Packaged Food'}
                          </div>
                        </div>
                      </div>

                      <FBSVitalityCapsule score={product.score} size="xs" />
                    </Link>
                  ))}
                  <div className="p-2 text-center bg-surface-container-low">
                    <button
                      type="button"
                      onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
                      className="font-label-caps text-xs text-primary font-bold hover:underline"
                    >
                      View all forensic results for &ldquo;{query}&rdquo; &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Proof Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-4 font-label-caps text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                <span>Zero Brand Sponsorships</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                <span>ICMR-NIN &amp; FSSAI Calibrated</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Reality Decoder Card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-surface-container-lowest p-5 sm:p-6 border border-outline-variant/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-primary-fixed text-on-primary-fixed">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </span>
                  <span className="font-label-caps text-xs font-bold uppercase text-primary tracking-wider">
                    DECODER CASE STUDY
                  </span>
                </div>

                {/* Claim vs Truth Toggle Switch */}
                <div className="flex bg-surface-container p-0.5 rounded-full border border-outline-variant/30 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRealityMode('claim')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      realityMode === 'claim'
                        ? 'bg-secondary text-on-secondary shadow-2xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Front Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setRealityMode('truth')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      realityMode === 'truth'
                        ? 'bg-primary text-on-primary shadow-2xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Chemical Truth
                  </button>
                </div>
              </div>

              {realityMode === 'claim' ? (
                <div className="space-y-3 p-4 rounded-lg bg-secondary-fixed/20 border border-dashed border-secondary/40 animate-fade-in">
                  <div className="inline-flex items-center gap-1 font-label-caps text-[0.625rem] text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full font-bold uppercase">
                    <span className="material-symbols-outlined text-xs">shield</span>
                    Front-of-Pack Marketing Claim
                  </div>
                  <h3 className="font-headline-sm text-base text-primary">
                    &ldquo;100% Real Whole Wheat &amp; No Added Sugar*&rdquo;
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Designed with sun-drenched grain visuals and clean green badges to reassure parents while placing it into the shopping cart.
                  </p>
                  <div className="pt-2 border-t border-secondary/20 flex items-center justify-between text-xs">
                    <span className="font-label-caps text-[0.6875rem] text-secondary font-bold">Consumer Perception</span>
                    <span className="font-label-caps text-xs px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-bold">
                      HEALTHY BREAKFAST
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-lg bg-error-container/40 border border-error/30 animate-fade-in">
                  <div className="inline-flex items-center gap-1 font-label-caps text-[0.625rem] text-error bg-error-container px-2 py-0.5 rounded-full font-bold uppercase">
                    <span className="material-symbols-outlined text-xs">biotech</span>
                    Independent Laboratory Back-Label Audit
                  </div>
                  <h3 className="font-headline-sm text-base text-primary">
                    68% Refined Flour + Liquid Maltodextrin (GI &gt; 105)
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    The asterisk exempts industrial high-glycemic starch hydrolysates. It triggers blood glucose spikes comparable to direct glucose powder.
                  </p>
                  <div className="pt-2 border-t border-error/20 flex items-center justify-between text-xs">
                    <span className="font-label-caps text-[0.6875rem] text-error font-bold">Actual Food Benefit Score</span>
                    <FBSVitalityCapsule score={2.4} size="xs" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stitch Category Chips Bar */}
        <div className="pt-2 border-t border-outline-variant/30 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  if (cat.slug !== 'all') {
                    router.push(`/category/${cat.slug}`);
                  } else {
                    router.push('/products');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-label-caps text-xs uppercase tracking-wider font-bold ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
