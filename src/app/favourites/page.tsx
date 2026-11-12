import React from 'react';
import type { Metadata } from 'next';
import { getAllProductsWithSamples } from '@/lib/products';
import FavouritesClient from './FavouritesClient';

export const metadata: Metadata = {
  title: 'My Saved Favourites & Watchlist | WiseFoodies',
  description:
    'Track and compare your favourite packaged food items. Local-first, private, and always available offline.',
  robots: {
    index: false, // Local-first user list shouldn't be indexed by search engines
    follow: false,
  },
};

export default function FavouritesPage() {
  const allProducts = getAllProductsWithSamples();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16">
      <FavouritesClient allProducts={allProducts} />
    </div>
  );
}
