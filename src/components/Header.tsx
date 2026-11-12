'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useFavourites } from '@/hooks/useFavourites';
import { useI18n } from '@/context/I18nContext';
import LanguageSelectorModal from '@/components/LanguageSelectorModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState('');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const { count: cartCount } = useCart();
  const { count: favCount } = useFavourites();
  const { locale } = useI18n();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-outline-variant/30">
        <div className="h-28 px-margin max-w-7xl mx-auto flex flex-col justify-between py-space-xs">
          {/* Top Row: Brand & Actions */}
          <div className="flex items-center justify-between gap-space-xs">
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-space-xs min-w-0">
              <Link href="/" className="flex items-center gap-space-xs min-w-0 group">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-outline-variant/50 flex-shrink-0 flex items-center justify-center p-0.5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Image
                    src="/wisefoodies-logo-mark.png"
                    alt="WiseFoodies Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-primary leading-tight truncate">
                      WiseFoodies
                    </span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded-full uppercase">
                      Forensic
                    </span>
                  </div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant truncate max-w-[280px] hidden sm:block">
                    Clean ingredients are a basic human right, not a luxury marketing premium.
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              <Link
                href="/products"
                className={`transition-colors hover:text-primary ${
                  pathname.startsWith('/products') ? 'text-primary border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Products
              </Link>
              <Link
                href="/category"
                className={`transition-colors hover:text-primary ${
                  pathname.startsWith('/category') ? 'text-primary border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Categories
              </Link>
              <Link
                href="/compare"
                className={`transition-colors hover:text-primary ${
                  pathname.startsWith('/compare') ? 'text-primary border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Compare
              </Link>
              <Link
                href="/fitness-calculators"
                className={`transition-colors hover:text-primary ${
                  pathname.startsWith('/fitness-calculators') ? 'text-primary border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Calculators
              </Link>
              <Link
                href="/diary"
                className={`transition-colors hover:text-primary ${
                  pathname.startsWith('/diary') ? 'text-primary border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Diary
              </Link>
              <Link
                href="/ask"
                className={`transition-colors hover:text-primary flex items-center gap-1 ${
                  pathname.startsWith('/ask') ? 'text-primary border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                <span>AI Dietitian</span>
              </Link>
            </nav>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-space-xs flex-shrink-0">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setIsLangModalOpen(true)}
                aria-label="Switch Language"
                className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center gap-space-2xs px-space-xs py-space-2xs rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-lg">language</span>
                <span className="font-label-caps text-label-caps uppercase">{locale || 'EN'}</span>
              </button>

              {/* Favourites Shortcut */}
              <Link
                href="/favourites"
                aria-label="Favourites"
                className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center relative p-2 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                title="Saved Products"
              >
                <span className="material-symbols-outlined text-lg">favorite</span>
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-on-error font-label-caps text-[0.625rem] px-1 rounded-full tabular-nums">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Smart Basket */}
              <Link
                href="/cart"
                aria-label="Smart Basket"
                className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center relative px-2.5 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">shopping_basket</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary font-label-caps text-[0.625rem] px-1 rounded-full tabular-nums">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* AI Assistant profile button */}
              <Link
                href="/ask"
                aria-label="AI Nutritionist"
                className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-1 rounded-full bg-surface-container text-primary hover:bg-primary-fixed transition-colors"
                title="Forensic Food AI"
              >
                <span className="material-symbols-outlined text-xl">psychology</span>
              </Link>
            </div>
          </div>

          {/* Bottom Row: Global Search Bar */}
          <div className="relative w-full pb-space-2xs">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full h-10 px-space-sm rounded-full bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-outline-variant/40 text-on-surface-variant focus-within:border-primary transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant mr-space-xs text-lg">search</span>
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Audit 852 Indian packaged products & 8,500+ cooked foods..."
                className="font-body-sm text-body-sm text-on-surface bg-transparent border-none outline-none flex-1 truncate placeholder:text-on-surface-variant/70"
              />
              <Link
                href="/scanner"
                className="flex items-center justify-center text-outline hover:text-primary transition-colors pl-2"
                title="Scan Barcode"
              >
                <span className="material-symbols-outlined text-lg">barcode_scanner</span>
              </Link>
            </form>
          </div>
        </div>
      </header>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </>
  );
}
