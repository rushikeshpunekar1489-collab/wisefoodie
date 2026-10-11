import React from 'react';
import type { Metadata } from 'next';
import { getAllProductsWithSamples } from '@/lib/products';
import ScannerClient from './ScannerClient';

export const metadata: Metadata = {
  title: 'Barcode & Nutrition Label Scanner | WiseFoodies',
  description:
    'Scan packaged food barcodes with your camera, upload package labels, or lookup nutrition facts instantly.',
};

export default function ScannerPage() {
  const allProducts = getAllProductsWithSamples();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ScannerClient allProducts={allProducts} />
    </div>
  );
}
