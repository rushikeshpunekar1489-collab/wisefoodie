import React from 'react';
import type { Metadata } from 'next';
import { getAllProductsWithSamples } from '@/lib/products';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Smart Cart & Basket Nutrition Analyzer | WiseFoodies',
  description:
    'Real-time nutritional audit for your grocery basket. Calorie-weighted Food Benefit Score, sugar tracking, and 1-tap healthier swaps.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  const allProducts = getAllProductsWithSamples();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CartClient allProducts={allProducts} />
    </div>
  );
}
