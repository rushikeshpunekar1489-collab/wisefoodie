'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type Locale,
  LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
  isRTL as checkIsRTL,
  getTranslation,
  formatNumber as libFormatNumber,
  formatINR as libFormatINR,
} from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  formatNumber: (val: number, decimals?: number) => string;
  formatINR: (val: number, decimals?: number) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  isRTL: false,
  t: (keyPath) => keyPath,
  formatNumber: (val) => String(val),
  formatINR: (val) => `₹${val}`,
});

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const langs = navigator.languages || [navigator.language];
  for (const lang of langs) {
    if (!lang) continue;
    const code = lang.split('-')[0].toLowerCase();
    if (isValidLocale(code)) {
      return code as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let initialLocale: Locale = DEFAULT_LOCALE;
    try {
      const saved = localStorage.getItem('wf_locale');
      if (saved && isValidLocale(saved)) {
        initialLocale = saved as Locale;
      } else {
        initialLocale = detectBrowserLocale();
      }
    } catch (e) {
      initialLocale = detectBrowserLocale();
    }

    setLocaleState(initialLocale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initialLocale;
      document.documentElement.dir = checkIsRTL(initialLocale) ? 'rtl' : 'ltr';
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'wf_locale' && e.newValue && isValidLocale(e.newValue)) {
        const next = e.newValue as Locale;
        setLocaleState(next);
        document.documentElement.lang = next;
        document.documentElement.dir = checkIsRTL(next) ? 'rtl' : 'ltr';
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    if (!isValidLocale(nextLocale)) return;
    setLocaleState(nextLocale);
    try {
      localStorage.setItem('wf_locale', nextLocale);
      document.cookie = `wf_locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}

    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = checkIsRTL(nextLocale) ? 'rtl' : 'ltr';
    }
  }, []);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>) => {
      return getTranslation(locale, keyPath, params);
    },
    [locale]
  );

  const formatNumber = useCallback((val: number, decimals?: number) => {
    return libFormatNumber(val, decimals);
  }, []);

  const formatINR = useCallback((val: number, decimals?: number) => {
    return libFormatINR(val, decimals);
  }, []);

  const isRTL = checkIsRTL(locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, isRTL, t, formatNumber, formatINR }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
