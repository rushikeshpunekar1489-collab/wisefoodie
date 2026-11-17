'use client';

import React from 'react';
import Link from 'next/link';
import {
  ScanLine,
  Scale,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Calculator,
} from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#14211A] text-white py-20 sm:py-28 font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#16A34A] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#FFB703] blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        {/* 4-Step Action Blueprint */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-widest text-[#16A34A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE WISE CONSUMER STANDARD</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
            Scan. Score. Compare. Choose.
          </h2>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            Take back control of your kitchen and grocery basket today. No subscriptions, no sponsorships, 100% free forever.
          </p>
        </div>

        {/* 4 Pillars Card Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#16A34A]/20 text-[#16A34A] flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="font-bold text-lg text-white">SCAN</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Point your phone camera at any packaged food barcode in seconds to retrieve the verified nutritional dossier.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#FFB703]/20 text-[#FFB703] flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="font-bold text-lg text-white">SCORE</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Check the animated FBS Vitality Score to see if the product is genuinely nourishing or disguised ultra-processing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 text-[#38BDF8] flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="font-bold text-lg text-white">COMPARE</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Pit 2 to 4 products side-by-side to expose hidden palm oil, free sugars, and cost-per-gram protein yield.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="font-bold text-lg text-white">CHOOSE</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Make educated grocery decisions that safeguard your family’s metabolic health, gut microbiome, and hard-earned money.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/products"
            className="px-7 py-4 rounded-full bg-[#16A34A] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#15803D] transition-all shadow-lg active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Audit 852 Packaged Foods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/scanner"
            className="px-6 py-4 rounded-full bg-white text-[#14211A] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#FFFBF2] transition-all shadow-lg active:scale-95"
          >
            <ScanLine className="w-4 h-4 text-[#16A34A]" />
            <span>Launch Food Scanner</span>
          </Link>

          <Link
            href="/compare"
            className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95"
          >
            <Scale className="w-4 h-4 text-[#FFB703]" />
            <span>Compare Products</span>
          </Link>

          <Link
            href="/fitness-calculators"
            className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95"
          >
            <Calculator className="w-4 h-4 text-[#38BDF8]" />
            <span>1,911 INDB Indian Recipes</span>
          </Link>
        </div>

        {/* Final Sign-Off Brand Signature */}
        <div className="pt-8 border-t border-white/10 text-center space-y-2">
          <span className="text-2xl font-serif font-black tracking-tight text-white block">
            WISEFOODIES
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-[#16A34A]">
            Eat Smarter. Choose Better.
          </p>
          <p className="text-[11px] text-white/50 max-w-md mx-auto pt-1">
            Independent forensic food intelligence for Indian consumers. Unaffiliated with commercial food manufacturers.
          </p>
        </div>
      </div>
    </section>
  );
}
