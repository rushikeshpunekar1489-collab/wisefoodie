'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Scan, Scale, BookOpen } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/scanner', label: 'Scan', icon: Scan, isPrimary: true },
    { href: '/compare', label: 'Compare', icon: Scale },
    { href: '/learn', label: 'Learn', icon: BookOpen },
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
