'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/context/I18nContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleResize = () => {
      if (window.visualViewport) {
        const keyboardActive = window.visualViewport.height < window.innerHeight * 0.78;
        setIsKeyboardOpen(keyboardActive);
      }
    };

    window.visualViewport.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  // Hide on full-screen scanner and when on-screen keyboard is open
  if (pathname === '/scanner' || isKeyboardOpen) {
    return null;
  }

  const items = [
    { href: '/', label: 'Home', icon: 'explore', match: pathname === '/' },
    { href: '/products', label: 'Products', icon: 'inventory_2', match: pathname.startsWith('/products') || pathname.startsWith('/food') },
    { href: '/scanner', label: 'Scan', icon: 'barcode_scanner', isPrimary: true },
    { href: '/fitness-calculators', label: 'Calculators', icon: 'calculate', match: pathname.startsWith('/fitness-calculators') },
    { href: '/compare', label: 'Compare', icon: 'balance', match: pathname.startsWith('/compare') },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] border-t border-outline-variant/30 md:hidden"
    >
      <div className="flex justify-between items-center h-16 px-space-xs max-w-lg mx-auto relative">
        {items.map((item) => {
          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6 w-12 h-12 rounded-full bg-primary text-on-primary shadow-md border-2 border-surface active:scale-95 transition-transform"
                aria-label="In-Store Barcode Scanner"
                title="Scan Barcode"
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </Link>
            );
          }

          const isActive = item.match;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'font-bold' : ''}`}>
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps tracking-tighter mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
