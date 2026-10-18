'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Scan, Moon, Sun, Leaf, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { useFavourites } from '@/hooks/useFavourites';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/context/I18nContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const { count: favCount } = useFavourites();
  const { count: cartCount } = useCart();
  const { t } = useI18n();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wf_theme') || 'light';
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } catch (e) {}
  }, []);

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

  return (
    <header className="site-header">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="logo shrink-0 flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] group-hover:rotate-6 transition-transform">
            <Leaf className="w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight font-display text-[var(--ink)]">
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

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-4 font-bold text-sm">
          <Link
            href="/explore"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname.startsWith('/explore') ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            {t('nav.explore')}
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
            className="btn-chunky p-2 rounded-full! border-2!"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--mango)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
          </button>
        </nav>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-1.5">
          <LanguageToggle compact />
          <Link
            href="/favourites"
            className="btn-chunky p-2 rounded-full! border-2! relative"
            aria-label={t('nav.favourites')}
            title={t('nav.favourites')}
          >
            <Heart className="w-4 h-4 text-[var(--tomato)] fill-current" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--tomato)] text-white text-[9px] font-black flex items-center justify-center">
                {favCount > 9 ? '9+' : favCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="btn-chunky p-2 rounded-full! border-2! relative"
            aria-label={t('nav.cart')}
            title={t('nav.cart')}
          >
            <ShoppingCart className="w-4 h-4 text-[var(--leaf)] stroke-[2.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--leaf)] text-white text-[9px] font-black flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-chunky p-2 rounded-full! border-2!"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--mango)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
          </button>
          <Link href="/scanner" className="btn-chunky btn-primary py-1.5 px-2.5 text-xs">
            <Scan className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
