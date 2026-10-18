'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n } from '@/context/I18nContext';
import { LOCALES, type Locale, type LocaleMeta, isRTL } from '@/lib/i18n';
import { Globe, Search, X, Check, Sparkles } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelectorModal({ isOpen, onClose }: LanguageSelectorModalProps) {
  const { locale, setLocale, t } = useI18n();
  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'popular' | 'rtl'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setRegionFilter('all');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter languages
  const filteredLocales = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LOCALES.filter((loc) => {
      // Category filter
      if (regionFilter === 'rtl' && loc.dir !== 'rtl') return false;
      if (regionFilter === 'popular') {
        const popularCodes = ['en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'pa', 'ur'];
        if (!popularCodes.includes(loc.code)) return false;
      }

      if (!q) return true;
      return (
        loc.label.toLowerCase().includes(q) ||
        loc.native.toLowerCase().includes(q) ||
        loc.script.toLowerCase().includes(q) ||
        loc.code.toLowerCase().includes(q) ||
        (loc.region && loc.region.toLowerCase().includes(q))
      );
    });
  }, [query, regionFilter]);

  if (!isOpen) return null;

  const handleSelect = (code: Locale) => {
    setLocale(code);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[var(--surface)] text-[var(--ink)] rounded-2xl border-3 border-[var(--ink)] shadow-[6px_6px_0px_var(--ink)] overflow-hidden animate-scale-up"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-[var(--surface-alt)] bg-[var(--cream)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--leaf)] text-white flex items-center justify-center border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 id="language-modal-title" className="text-lg sm:text-xl font-black text-[var(--ink)] flex items-center gap-2">
                <span>Select Language</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--mint)] text-[var(--ink)] font-bold border border-[var(--ink)]">
                  22 Indian Languages + EN
                </span>
              </h2>
              <p className="text-xs text-[var(--ink)] opacity-70">
                Choose your preferred language for all product insights & explanations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close language selector"
            className="p-2 rounded-full hover:bg-[var(--surface-alt)] border border-transparent hover:border-[var(--ink)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="p-4 border-b border-[var(--surface-alt)] bg-[var(--surface)] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink)] opacity-50" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search language (e.g., Hindi, বাংলা, Telugu, اردو)..."
              aria-label="Search supported languages"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--leaf)] transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-xs opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
            <button
              type="button"
              onClick={() => setRegionFilter('all')}
              className={`px-3 py-1 rounded-full border transition-all ${
                regionFilter === 'all'
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                  : 'bg-[var(--surface-alt)] text-[var(--ink)] border-[var(--surface-alt)] hover:border-[var(--ink)]'
              }`}
            >
              All (23)
            </button>
            <button
              type="button"
              onClick={() => setRegionFilter('popular')}
              className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                regionFilter === 'popular'
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                  : 'bg-[var(--surface-alt)] text-[var(--ink)] border-[var(--surface-alt)] hover:border-[var(--ink)]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[var(--mango)]" /> Widely Spoken
            </button>
            <button
              type="button"
              onClick={() => setRegionFilter('rtl')}
              className={`px-3 py-1 rounded-full border transition-all ${
                regionFilter === 'rtl'
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                  : 'bg-[var(--surface-alt)] text-[var(--ink)] border-[var(--surface-alt)] hover:border-[var(--ink)]'
              }`}
            >
              RTL (Urdu, Kashmiri, Sindhi)
            </button>
          </div>
        </div>

        {/* Languages Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-h-[50vh]">
          {filteredLocales.length === 0 ? (
            <div className="text-center py-10 opacity-70">
              <p className="font-bold text-sm">No language found for &quot;{query}&quot;</p>
              <p className="text-xs mt-1">Try searching by script or English name.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredLocales.map((loc) => {
                const isActive = locale === loc.code;
                return (
                  <button
                    key={loc.code}
                    type="button"
                    onClick={() => handleSelect(loc.code)}
                    className={`text-left p-3 rounded-xl border-2 transition-all flex items-start justify-between group relative ${
                      isActive
                        ? 'border-[var(--leaf)] bg-[var(--mint)]/30 shadow-[2px_2px_0px_var(--leaf)] font-bold'
                        : 'border-[var(--surface-alt)] hover:border-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--surface-alt)]/50 shadow-sm'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base sm:text-lg font-black tracking-wide text-[var(--ink)]">
                          {loc.native}
                        </span>
                        {loc.dir === 'rtl' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--ink)] opacity-75 font-medium flex items-center gap-1">
                        <span>{loc.label}</span>
                        <span className="opacity-40">•</span>
                        <span className="text-[10px] opacity-60">{loc.script}</span>
                      </div>
                    </div>

                    {isActive && (
                      <span className="w-5 h-5 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--surface-alt)] bg-[var(--cream)] flex items-center justify-between text-xs text-[var(--ink)] opacity-75">
          <span>Active: <strong className="text-[var(--leaf)] font-black">{LOCALES.find(l => l.code === locale)?.native} ({locale.toUpperCase()})</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg border border-[var(--ink)] font-bold hover:bg-[var(--ink)] hover:text-white transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
