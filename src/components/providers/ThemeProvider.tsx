'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      storageKey="wf_theme"
      disableTransitionOnChange
      {...props}
    >
      <ThemeClassSync>{children}</ThemeClassSync>
    </NextThemesProvider>
  );
}

/**
 * Synchronizes both `data-theme` and `class="dark"` on `document.documentElement`
 * to ensure complete compatibility across Tailwind v4, Stitch tokens, and CSS variables.
 */
function ThemeClassSync({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) return;
    const isDark = resolvedTheme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem('wf_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('wf_theme', 'light');
      } catch {}
    }
  }, [resolvedTheme]);

  return <>{children}</>;
}
