import React from 'react';
import type { Metadata } from 'next';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Indian Packaged Food Database | 852 Products Decoded | WiseFoodies',
  description:
    'Comprehensive Indian Packaged Food intelligence database. Search 852 products across 262 brands with verified nutrition facts and ingredients.',
};

export default function ProductsPage() {
  const allProducts = packagedFoodDb.getAll();
  const categories = packagedFoodDb.getCategories();
  const brands = packagedFoodDb.getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductsClient
        initialProducts={allProducts}
        totalProducts={allProducts.length}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
