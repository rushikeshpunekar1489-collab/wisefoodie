import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllProductsWithSamples } from '@/lib/products';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare Packaged Foods Side-by-Side | WiseFoodies',
  description:
    'Compare 2 to 4 Indian packaged foods by Food Benefit Score, sugar load, protein per rupee, and ingredients with our impartial verdict engine.',
};

export default function ComparePage() {
  const allProducts = getAllProductsWithSamples();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense
        fallback={
          <div className="text-center py-16 text-sm text-stone-500">
            Loading comparison matrix...
          </div>
        }
      >
        <CompareClient allProducts={allProducts} />
      </Suspense>
    </div>
  );
}
