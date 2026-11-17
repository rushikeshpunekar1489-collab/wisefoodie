'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ScanLine,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export interface SimpleProduct {
  name: string;
  brand: string;
  slug: string;
  category: string | null;
  image?: string | null;
  score: number | null;
}

interface HeroFoodIntelligenceProps {
  products: SimpleProduct[];
}

const QUICK_TAGS = [
  { label: 'Rolled Oats', query: 'oats' },
  { label: 'Good Day', query: 'good day' },
  { label: 'Instant Noodles', query: 'maggi' },
  { label: 'Orange Juice', query: 'tropicana' },
  { label: 'Toned Milk', query: 'amul' },
  { label: 'Whole Wheat Bread', query: 'bread' },
];

export default function HeroFoodIntelligence({ products }: HeroFoodIntelligenceProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SimpleProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close results dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } else {
      router.push('/products');
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return '#64748B';
    if (score >= 8.0) return '#16A34A';
    if (score >= 6.5) return '#22C55E';
    if (score >= 4.5) return '#FFB703';
    if (score >= 2.5) return '#F97316';
    return '#DC2626';
  };

  return (
    <section className="relative overflow-hidden bg-[#FFFBF2] text-[#14211A] pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-[#14211A]/10 font-sans">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none opacity-40">
        <div className="absolute top-10 left-20 w-80 h-80 rounded-full bg-[#16A34A]/10 blur-3xl" />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#FFB703]/10 blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 sm:space-y-12">
        {/* Top Eyebrow Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14211A]/5 border border-[#14211A]/12 text-xs font-bold tracking-widest text-[#14211A] uppercase shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>WISEFOODIES • INDEPENDENT FOOD INTELLIGENCE</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#14211A]/70">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>852 INDIAN PACKAGED FOODS AUDITED</span>
          </div>
        </div>

        {/* Main Headline & Mission Presentation */}
        <div className="max-w-4xl space-y-6">
          <h1 className="font-display-hero text-4xl sm:text-6xl lg:text-7xl font-serif text-[#14211A] tracking-tight leading-[1.04]">
            Know Your Food <br className="hidden sm:inline" />
            <span className="font-sans font-black text-[#16A34A]">Before You Buy It.</span>
          </h1>

          <p className="font-body-md text-base sm:text-xl text-[#14211A]/80 max-w-2xl leading-relaxed">
            Every supermarket aisle is filled with hidden sugars, palm oil, and deceptive packaging claims.
            WiseFoodies dissects real Indian packaged food with independent scientific ratings—zero brand bias, zero sponsored scores.
          </p>
        </div>

        {/* Cinematic Instant Interactive Food Search Engine */}
        <div ref={searchContainerRef} className="relative max-w-2xl">
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center bg-white rounded-2xl p-2 border-2 border-[#14211A]/15 shadow-[0_12px_32px_-8px_rgba(20,33,26,0.1)] focus-within:border-[#16A34A] focus-within:shadow-[0_16px_40px_-10px_rgba(22,163,74,0.18)] transition-all"
          >
            <div className="pl-3 sm:pl-4 text-[#14211A]/50">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              placeholder="Search 852 Indian packaged products, brands or ingredients..."
              className="w-full bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-[#14211A] placeholder-[#14211A]/40 focus:outline-hidden font-medium"
            />

            <div className="hidden sm:flex items-center gap-2 pr-2">
              <kbd className="px-2 py-1 rounded bg-[#FFFBF2] border border-[#14211A]/15 text-[#14211A]/60 text-xs font-mono">
                /
              </kbd>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 sm:py-3 rounded-xl bg-[#14211A] text-white hover:bg-[#16A34A] transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Search Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[#14211A]/60">Popular Audits:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  setQuery(tag.query);
                  router.push(`/search?q=${encodeURIComponent(tag.query)}`);
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-[#14211A]/12 text-[#14211A]/80 hover:bg-[#14211A] hover:text-white transition-all shadow-2xs font-medium"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Live Autocomplete Results Dropdown */}
          {isOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#14211A]/15 shadow-2xl overflow-hidden z-50 divide-y divide-[#14211A]/8">
              <div className="p-2.5 bg-[#FFFBF2] text-[11px] font-bold text-[#14211A]/60 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Verified Indian Packaged Foods</span>
                <span>{results.length} results</span>
              </div>

              {results.map((item) => (
                <Link
                  key={item.slug}
                  href={`/food/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3.5 hover:bg-[#FFFBF2] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#FFFBF2] p-1 border border-[#14211A]/10 shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-contain max-h-full"
                        />
                      ) : (
                        <span className="text-xl">🥣</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#14211A] group-hover:text-[#16A34A] transition-colors truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#14211A]/60 uppercase tracking-wider">
                        {item.brand} • {item.category || 'Packaged Food'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-3">
                    {item.score !== null ? (
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-black tracking-wide text-white shadow-2xs tabular-nums"
                        style={{ backgroundColor: getScoreColor(item.score) }}
                      >
                        FBS {item.score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-[#14211A]/10 text-[#14211A]">
                        Auditing
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-[#14211A]/40 group-hover:text-[#14211A] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}

              <div className="p-2.5 bg-[#FFFBF2] text-center">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="text-xs font-bold text-[#16A34A] hover:underline"
                >
                  View all results for &ldquo;{query}&rdquo; →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Action Triggers Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#product-orbit"
            className="px-6 py-3.5 rounded-full bg-[#16A34A] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#15803D] transition-colors shadow-sm"
          >
            <span>Explore Packaged Food Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/scanner"
            className="px-5 py-3.5 rounded-full bg-white border border-[#14211A]/20 text-[#14211A] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#FFFBF2] hover:border-[#14211A] transition-colors shadow-2xs"
          >
            <ScanLine className="w-4 h-4 text-[#16A34A]" />
            <span>Scan Packaged Barcode</span>
          </Link>

          <Link
            href="/compare"
            className="px-5 py-3.5 rounded-full bg-white border border-[#14211A]/20 text-[#14211A] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#FFFBF2] hover:border-[#14211A] transition-colors shadow-2xs"
          >
            <Scale className="w-4 h-4 text-[#FFB703]" />
            <span>Compare 2 Foods</span>
          </Link>
        </div>

        {/* 4 Pillars Forensic Intelligence Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-5 rounded-2xl bg-white border border-[#14211A]/10 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm">
              FBS
            </div>
            <h3 className="font-bold text-sm text-[#14211A]">Food Benefit Score (0-10)</h3>
            <p className="text-xs text-[#14211A]/70 leading-relaxed">
              Algorithmic vitality score balancing intact proteins, fibres, and micronutrients against added sugars and ultra-processing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#14211A]/10 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFB703]/20 text-[#B45309] flex items-center justify-center font-bold text-sm">
              ₹10
            </div>
            <h3 className="font-bold text-sm text-[#14211A]">Nutrition Per Paisa</h3>
            <p className="text-xs text-[#14211A]/70 leading-relaxed">
              Measure actual grams of clean protein and intact fibre delivered per ₹10 spent, exposing overpriced marketing tricks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#14211A]/10 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#0284C7]/15 text-[#0284C7] flex items-center justify-center font-bold text-sm">
              RDA
            </div>
            <h3 className="font-bold text-sm text-[#14211A]">ICMR-NIN RDA Graphs</h3>
            <p className="text-xs text-[#14211A]/70 leading-relaxed">
              Horizontal reference graphs benchmarking every nutrient against official daily health allowances for Indian adults.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#14211A]/10 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#DC2626]/15 text-[#DC2626] flex items-center justify-center font-bold text-sm">
              INS
            </div>
            <h3 className="font-bold text-sm text-[#14211A]">Ingredient Intelligence</h3>
            <p className="text-xs text-[#14211A]/70 leading-relaxed">
              Forensic disclosure of palm oil, emulsifiers, 56 hidden sugar names, and chemical additives masked behind INS codes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
