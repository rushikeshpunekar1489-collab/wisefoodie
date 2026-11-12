import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-fixed-dim pt-16 pb-24 lg:pb-16 border-t border-primary-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-primary-container/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-primary-fixed/20 flex items-center justify-center p-1">
                <Image
                  src="/wisefoodies-logo-mark.png"
                  alt="WiseFoodies"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-xl tracking-tight text-white font-serif">
                  WiseFoodies
                </span>
                <span className="font-label-caps text-[0.625rem] bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded-full uppercase font-bold">
                  Forensic
                </span>
              </div>
            </Link>
            <p className="font-body-sm text-sm text-primary-fixed-dim/80 max-w-sm leading-relaxed">
              India&apos;s independent packaged-food forensic intelligence platform. Decoding nutrition declarations, uncovering hidden industrial UPF markers, and auditing 852+ packaged foods and 8,500+ cooked foods.
            </p>
            <div className="flex items-center gap-2 font-label-caps text-xs text-primary-fixed font-semibold bg-primary-container/80 px-3 py-1.5 rounded-full w-fit border border-primary-fixed/20">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Clean ingredients are a basic human right.</span>
            </div>
          </div>

          {/* Intelligence Tools */}
          <div>
            <h4 className="font-label-lg text-xs uppercase tracking-wider text-white mb-4">
              Intelligence Dossiers
            </h4>
            <ul className="space-y-2.5 font-body-sm text-sm">
              <li>
                <Link href="/products" className="hover:text-primary-fixed transition-colors font-bold text-primary-fixed">
                  Indian Packaged Foods (852)
                </Link>
              </li>
              <li>
                <Link href="/fitness-calculators" className="hover:text-secondary-fixed transition-colors font-bold text-secondary-fixed">
                  Fitness &amp; Macro Calculators
                </Link>
              </li>
              <li>
                <Link href="/category" className="hover:text-primary-fixed transition-colors">
                  13 Food Categories
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-primary-fixed transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-primary-fixed transition-colors">
                  In-Store Barcode Scanner
                </Link>
              </li>
              <li>
                <Link href="/how-fbs-works" className="hover:text-primary-fixed transition-colors">
                  Food Benefit Score (FBS)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary-fixed transition-colors">
                  Nutritional Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Guides */}
          <div>
            <h4 className="font-label-lg text-xs uppercase tracking-wider text-white mb-4">
              Forensic Guides
            </h4>
            <ul className="space-y-2.5 font-body-sm text-sm">
              <li>
                <Link href="/learn" className="hover:text-primary-fixed transition-colors">
                  Food Knowledge Hub
                </Link>
              </li>
              <li>
                <Link href="/learn/sugar" className="hover:text-primary-fixed transition-colors">
                  Decoding Added Sugars
                </Link>
              </li>
              <li>
                <Link href="/learn/protein" className="hover:text-primary-fixed transition-colors">
                  Nutrition Per Paisa (₹10 Test)
                </Link>
              </li>
              <li>
                <Link href="/learn/additives" className="hover:text-primary-fixed transition-colors">
                  Additives &amp; INS Numbers
                </Link>
              </li>
              <li>
                <Link href="/learn/palm-oil" className="hover:text-primary-fixed transition-colors">
                  Palm Oil &amp; Saturated Fats
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="font-label-lg text-xs uppercase tracking-wider text-white mb-4">
              Trust &amp; Transparency
            </h4>
            <ul className="space-y-2.5 font-body-sm text-sm">
              <li>
                <Link href="/about" className="hover:text-primary-fixed transition-colors">
                  About WiseFoodies
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-primary-fixed transition-colors">
                  Medical &amp; Food Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-fixed transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-fixed transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-fixed transition-colors">
                  Report Packaging / Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary-fixed transition-colors text-xs opacity-60">
                  Catalog Diagnostics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Scientific Notice */}
        <div className="pt-8 text-xs text-primary-fixed-dim/80 space-y-3 leading-relaxed font-body-sm">
          <p className="bg-primary-container/60 p-4 rounded-xl border border-primary-container">
            <strong className="text-white">Important Consumer Notice:</strong> The Food Benefit Score (FBS) is an independent, deterministic evaluation derived from manufacturer-declared packaging data and benchmarked against ICMR-NIN (National Institute of Nutrition, Hyderabad) guidelines and FSSAI Labelling Regulations (2020). It does not constitute medical advice or clinical prescription.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-primary-container/60 text-primary-fixed-dim/60 font-label-caps">
            <span>© 2026 WiseFoodies Forensic Intelligence. All rights reserved.</span>
            <div className="flex items-center gap-1 text-primary-fixed-dim">
              <span>Scientific + Consumer-First Forensic Standards</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
