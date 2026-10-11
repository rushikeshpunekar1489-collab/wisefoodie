import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-24 lg:pb-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                W
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Wise<span className="text-emerald-400">Foodies</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              India's first independent packaged-food intelligence platform. Decode nutrition labels, verify authentic ingredients, and make truly informed grocery decisions.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-stone-800/80 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scan. Score. Compare. Choose.</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Intelligence Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors">
                  Explore Food Database
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-400 transition-colors">
                  Compare Products
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-emerald-400 transition-colors">
                  Barcode Scanner
                </Link>
              </li>
              <li>
                <Link href="/how-fbs-works" className="hover:text-emerald-400 transition-colors">
                  How FBS Works
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-emerald-400 transition-colors">
                  Smart Food Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Guides */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Knowledge & Guides
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/learn" className="hover:text-emerald-400 transition-colors">
                  Food Knowledge Hub
                </Link>
              </li>
              <li>
                <Link href="/learn/sugar" className="hover:text-emerald-400 transition-colors">
                  Decoding Added Sugar
                </Link>
              </li>
              <li>
                <Link href="/learn/protein" className="hover:text-emerald-400 transition-colors">
                  True Protein Density
                </Link>
              </li>
              <li>
                <Link href="/learn/additives" className="hover:text-emerald-400 transition-colors">
                  Additives & INS Numbers
                </Link>
              </li>
              <li>
                <Link href="/learn/palm-oil" className="hover:text-emerald-400 transition-colors">
                  Palm Oil & Saturated Fat
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Trust & Transparency
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About WiseFoodies
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
                  Medical & Food Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact & Submit Label
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Regulatory / Health Disclaimer */}
        <div className="pt-8 text-xs text-stone-400 space-y-3 leading-relaxed">
          <p className="bg-stone-800/60 p-4 rounded-xl border border-stone-800">
            <strong>Important Consumer Notice:</strong> The Food Benefit Score (FBS) is an informational evaluation derived deterministically from declared manufacturer label data and ICMR-NIN (National Institute of Nutrition, Hyderabad) nutritional guidelines. It is not medical advice, clinical dietary prescription, or a guarantee of health outcomes. WiseFoodies does not manufacture, sell, or endorse any branded packaged food.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800/60 text-stone-500">
            <span>© 2026 WiseFoodies. All rights reserved. Made for Indian Consumers.</span>
            <div className="flex items-center gap-1 text-stone-400">
              <span>Scientific + Consumer-First Food Intelligence</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
