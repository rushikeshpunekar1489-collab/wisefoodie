import React from 'react';
import type { Metadata } from 'next';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin Panel | Indian Packaged Food Database | WiseFoodies',
  description: 'Manage Indian packaged food products, perform CRUD operations, and bulk import/export.',
};

export default function AdminPage() {
  const products = packagedFoodDb.getAll();
  const categories = packagedFoodDb.getCategories();
  const brands = packagedFoodDb.getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16">
      <AdminClient
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
