'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Scan, Moon, Sun, Leaf } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState('');
  const [theme, setTheme] = useState('light');

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
              placeholder="Search biscuit, oats, noodles, or 'high protein'..."
            />
          </div>
        </form>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-6 font-bold text-sm">
          <Link
            href="/explore"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname.startsWith('/explore') ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            Explore
          </Link>
          <Link
            href="/compare"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname === '/compare' ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            Compare
          </Link>
          <Link
            href="/learn"
            className={`transition-colors hover:text-[var(--leaf)] ${
              pathname.startsWith('/learn') ? 'text-[var(--leaf)] font-extrabold underline decoration-2 underline-offset-4' : 'text-[var(--ink)]'
            }`}
          >
            Learn
          </Link>

          {/* Scan Button */}
          <Link href="/scanner" className="btn-chunky btn-primary py-2 px-4 text-xs">
            <Scan className="w-4 h-4" /> Scan
          </Link>

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
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-chunky p-2 rounded-full! border-2!"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--mango)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
          </button>
          <Link href="/scanner" className="btn-chunky btn-primary py-1.5 px-3 text-xs">
            <Scan className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
