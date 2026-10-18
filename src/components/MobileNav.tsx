'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Scan, Scale, BookOpen } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const links = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/explore', label: t('nav.explore'), icon: Compass },
    { href: '/scanner', label: t('nav.scanner'), icon: Scan, isPrimary: true },
    { href: '/compare', label: t('nav.compare'), icon: Scale },
    { href: '/learn', label: t('nav.learn'), icon: BookOpen },
  ];

  return (
    <nav className="bottom-nav md:hidden">
      {links.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        if (item.isPrimary) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-scan-btn focus:outline-hidden"
              aria-label="Scan label"
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
          >
            <Icon className="w-5 h-5 stroke-[2.2]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
