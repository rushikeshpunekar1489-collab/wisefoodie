import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import ChatWindow from '../components/ChatWindow';
import { I18nProvider } from '@/context/I18nContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBF2' },
    { media: '(prefers-color-scheme: dark)', color: '#121413' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'WiseFoodies | Know Your Food',
  description:
    'Eat Smarter. Choose Better. Know your food before you buy it with the Food Benefit Score (FBS) and Nutrition Per Paisa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased scroll-smooth" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('wf_theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
                const locale = localStorage.getItem('wf_locale') || 'en';
                document.documentElement.setAttribute('lang', locale);
                if (locale === 'ur' || locale === 'ks' || locale === 'sd') {
                  document.documentElement.setAttribute('dir', 'rtl');
                } else {
                  document.documentElement.setAttribute('dir', 'ltr');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--cream)] text-[var(--ink)] antialiased overflow-x-clip">
        <I18nProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          <Suspense fallback={<div className="h-16 w-full" />}>
            <Header />
          </Suspense>
          <main id="main" className="flex-1 pb-24 md:pb-8 w-full max-w-full min-w-0">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          <Suspense fallback={null}>
            <ChatWindow />
          </Suspense>
        </I18nProvider>
      </body>
    </html>
  );
}
