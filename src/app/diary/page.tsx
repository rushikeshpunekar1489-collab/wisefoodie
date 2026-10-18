import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllProductsWithSamples } from '@/lib/products';
import DiaryClient from './DiaryClient';

export const metadata: Metadata = {
  title: 'Food Diary ("Aaj maine kya khaya") | WiseFoodies',
  description:
    'Track your daily food intake, meal contributions, and nutrient ratios against ICMR-NIN Indian adult reference values. 100% private and stored locally on your device.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DiaryPage() {
  const allProducts = getAllProductsWithSamples();

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 py-12 text-center text-slate-500">Loading diary...</div>}>
      <DiaryClient allProducts={allProducts} />
    </Suspense>
  );
}
