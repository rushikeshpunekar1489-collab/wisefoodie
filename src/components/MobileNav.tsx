'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Scan, Scale, BookOpen } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleResize = () => {
      if (window.visualViewport) {
        // If visual viewport is significantly smaller than innerHeight, software keyboard is active
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

  const links = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/explore', label: t('nav.explore'), icon: Compass },
    { href: '/scanner', label: t('nav.scanner'), icon: Scan, isPrimary: true },
    { href: '/compare', label: t('nav.compare'), icon: Scale },
    { href: '/learn', label: t('nav.learn'), icon: BookOpen },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="bottom-nav md:hidden transition-transform duration-200"
    >
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        if (item.isPrimary) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-scan-btn focus:outline-hidden"
              aria-label="Scan food label with camera"
              title="Barcode & Label Scanner"
            >
              <Icon className="w-7 h-7 stroke-[2.5]" />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-5 h-5 stroke-[2.2]" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
