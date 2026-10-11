import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Smart Search | WiseFoodies',
  description:
    'Search Indian packaged foods with smart nutritional filters like high protein, low sugar, and best value.',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-stone-500">
          Loading smart search...
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
