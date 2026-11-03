import React from 'react';
import type { Metadata } from 'next';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Indian Packaged Food Analytics & Insights Dashboard | WiseFoodies',
  description:
    'Interactive nutritional and pricing analytics across 852 Indian packaged food products, 262 brands, and 13 categories.',
};

export default function DashboardPage() {
  const stats = packagedFoodDb.getStatistics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardClient stats={stats} />
    </div>
  );
}
