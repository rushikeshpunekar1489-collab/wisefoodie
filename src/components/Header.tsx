'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Scan, Moon, Sun, Leaf, Heart, ShoppingCart, Sparkles, X, Globe, ChevronRight } from 'lucide-react';
import { useFavourites } from '@/hooks/useFavourites';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/context/I18nContext';
import LanguageToggle from '@/components/LanguageToggle';
import LanguageSelectorModal from '@/components/LanguageSelectorModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const { count: favCount } = useFavourites();
  const { count: cartCount } = useCart();
  const { locale, t } = useI18n();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wf_theme') || 'light';
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
    }
  }, [isMobileSearchOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('wf_theme', next);
    } catch (e) {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const recentSearches = ['Milk', 'Biscuits', 'Oats', 'Maggi', 'Peanut Butter'];

  return (
    <header className="site-header">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Logo */}
        <Link href="/" className="logo shrink-0 flex items-center gap-1.5 sm:gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] group-hover:rotate-6 transition-transform">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-[var(--ink)]">
            Wise<span className="text-[var(--leaf)]">Foodies</span>
          </span>
        </Link>

        {/* Search Input on Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className="search-pill w-full">
            <Search className="w-5 h-5 text-[var(--ink)] opacity-70 shrink-0" />
            <input
              type="text"
              value={quickQuery}
              onChange={e => setQuickQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
            />
          </div>
        </form>

        {/* Navigation items (Desktop) */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-4 font-bold text-sm">
          <Link
            href="/products"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname.startsWith('/products') ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            Foods
          </Link>
          <Link
            href="/category"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname.startsWith('/category') ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            Categories
          </Link>
          <Link
            href="/compare"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname === '/compare' ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            {t('nav.compare')}
          </Link>
          <Link
            href="/dashboard"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname.startsWith('/dashboard') ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            Analytics
          </Link>
          <Link
            href="/learn"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname.startsWith('/learn') ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            {t('nav.learn')}
          </Link>

          {/* Favourites Link */}
          <Link
            href="/favourites"
            className={`relative transition-colors hover:text-[var(--leaf)] flex items-center gap-1.5 ${
              pathname === '/favourites' ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
            title={t('nav.favourites')}
          >
            <Heart className="w-4 h-4 fill-current text-[var(--tomato)]" />
            <span>{t('nav.favourites')}</span>
            {favCount > 0 && (
              <span className="text-[10px] font-black py-0.2 px-1.5 rounded-full bg-[var(--tomato)] text-white">
                {favCount}
              </span>
            )}
          </Link>

          {/* Smart Basket Link */}
          <Link
            href="/cart"
            className={`relative transition-colors hover:text-[var(--leaf)] flex items-center gap-1.5 ${
              pathname === '/cart' ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
            title={t('nav.cart')}
          >
            <ShoppingCart className="w-4 h-4 text-[var(--leaf)] stroke-[2.5]" />
            <span>{t('nav.cart')}</span>
            {cartCount > 0 && (
              <span className="text-[10px] font-black py-0.2 px-1.5 rounded-full bg-[var(--leaf)] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Diary Link */}
          <Link
            href="/diary"
            className={`relative transition-colors hover:text-[var(--leaf)] flex items-center gap-1.5 ${
              pathname === '/diary' ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
            title={t('nav.diary')}
          >
            <span>🥗</span>
            <span>{t('nav.diary')}</span>
          </Link>

          {/* Ask AI Link */}
          <Link
            href="/ask"
            className={`relative transition-colors hover:text-[var(--leaf)] flex items-center gap-1.5 ${
              pathname === '/ask' ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
            title={t('ai.title')}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI</span>
          </Link>

          {/* Scan Button */}
          <Link href="/scanner" className="btn-chunky btn-primary py-2 px-3 text-xs">
            <Scan className="w-4 h-4" /> {t('nav.scanner')}
          </Link>

          {/* Language Switcher */}
          <LanguageToggle compact />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-chunky p-2 rounded-full! border-2! min-w-[44px] min-h-[44px]"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--mango)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
          </button>
        </nav>

        {/* Mobile Compact Bar: Logo | Search | Scanner | Menu (Zero Overflow, ≥44px Tap Targets) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            aria-label="Open search"
            className="btn-chunky p-2 rounded-full! border-2! w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Search products"
          >
            <Search className="w-4 h-4 text-[var(--ink)]" />
          </button>

          {/* Scanner Button */}
          <Link
            href="/scanner"
            className="btn-chunky btn-primary p-2 rounded-full! border-2! w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={t('nav.scanner')}
            title={t('nav.scanner')}
          >
            <Scan className="w-4 h-4 text-white" />
          </Link>

          {/* Settings / Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu and settings"
            className="btn-chunky p-2 rounded-full! border-2! w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center relative"
            title="Preferences & Shortcuts"
          >
            <Globe className="w-4 h-4 text-[var(--leaf)]" />
            {(favCount > 0 || cartCount > 0) && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--tomato)] border border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Full-Width Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start animate-fade-in md:hidden">
          <div className="bg-[var(--surface)] border-b-3 border-[var(--ink)] p-4 shadow-xl pt-safe space-y-3">
            <div className="flex items-center gap-2">
              <form onSubmit={handleMobileSearchSubmit} className="flex-1 flex items-center gap-2 bg-[var(--surface-alt)] border-2 border-[var(--ink)] rounded-full px-3 py-1.5 shadow-[2px_2px_0px_var(--ink)]">
                <Search className="w-5 h-5 text-[var(--ink)] opacity-70 shrink-0" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={mobileQuery}
                  onChange={e => setMobileQuery(e.target.value)}
                  placeholder={t('common.searchPlaceholder')}
                  style={{ fontSize: '16px' }}
                  className="w-full bg-transparent border-none outline-none text-[var(--ink)] font-semibold"
                />
                {mobileQuery && (
                  <button
                    type="button"
                    onClick={() => setMobileQuery('')}
                    aria-label="Clear query"
                    className="p-1 text-[var(--ink)] opacity-60 hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="btn-chunky px-3 py-2 text-xs min-h-[44px] font-bold"
              >
                Close
              </button>
            </div>

            {/* Quick search chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--ink)] opacity-60">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map(term => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setIsMobileSearchOpen(false);
                    }}
                    className="chip text-xs py-1 px-2.5 font-bold bg-[var(--surface)]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setIsMobileSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Settings & Shortcuts Bottom Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end animate-fade-in md:hidden">
          <div className="bg-[var(--surface)] border-t-3 border-[var(--ink)] rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85dvh] overflow-y-auto pb-safe">
            <div className="w-12 h-1.5 bg-[var(--ink)]/20 rounded-full mx-auto" />
            
            <div className="flex items-center justify-between pb-2 border-b border-[var(--ink)]/10">
              <h3 className="font-extrabold text-base text-[var(--ink)]">Preferences & Shortcuts</h3>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-chunky p-2 rounded-full! border-2! w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preferences: Language & Theme */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsLangModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="btn-chunky flex items-center justify-between py-2.5 px-3.5 text-xs text-left"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--leaf)]" />
                  <span>Language</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="btn-chunky flex items-center justify-between py-2.5 px-3.5 text-xs text-left"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--mango)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>
            </div>

            {/* Shortcuts */}
            <div className="space-y-2 pt-1">
              <Link
                href="/products"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📦</span>
                  <span>Indian Packaged Foods (852)</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </Link>

              <Link
                href="/category"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🗂️</span>
                  <span>All 13 Categories</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📊</span>
                  <span>Food Intelligence Analytics</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </Link>

              <Link
                href="/admin"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">⚙️</span>
                  <span>Database Admin Panel</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </Link>

              <Link
                href="/favourites"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-[var(--tomato)] fill-current" />
                  <span>{t('nav.favourites')}</span>
                </div>
                {favCount > 0 && (
                  <span className="text-xs font-black py-0.5 px-2 rounded-full bg-[var(--tomato)] text-white">
                    {favCount} saved
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-5 h-5 text-[var(--leaf)] stroke-[2.5]" />
                  <span>{t('nav.cart')}</span>
                </div>
                {cartCount > 0 && (
                  <span className="text-xs font-black py-0.5 px-2 rounded-full bg-[var(--leaf)] text-white">
                    {cartCount} items
                  </span>
                )}
              </Link>

              <Link
                href="/diary"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🥗</span>
                  <span>{t('nav.diary')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </Link>

              <Link
                href="/ask"
                className="flex items-center justify-between p-3 rounded-2xl bg-[var(--mint)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-extrabold text-sm text-[var(--leaf)]"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[var(--leaf)]" />
                  <span>Ask WiseFoodies AI</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>
            </div>
          </div>
          {/* Backdrop click */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </header>
  );
}
