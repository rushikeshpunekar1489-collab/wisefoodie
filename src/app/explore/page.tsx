import React from 'react';
import type { Metadata } from 'next';
import { getAllProducts, getSampleProducts, getCategories } from '@/lib/products';
import ExploreClient from './ExploreClient';

export const metadata: Metadata = {
  title: 'Explore All Packaged Foods | WiseFoodies',
  description:
    'Browse and filter the complete catalog of Indian packaged foods with Food Benefit Scores, nutrition facts, and category benchmarks.',
};

export default function ExplorePage() {
  const initialProducts = getAllProducts();
  const sampleProducts = getSampleProducts();
  const categories = getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ExploreClient
        initialProducts={initialProducts}
        sampleProducts={sampleProducts}
        categories={categories}
      />
    </div>
  );
}
