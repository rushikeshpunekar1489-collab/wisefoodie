import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { packagedFoodDb, slugToCategory } from '@/lib/db/packagedFoodDb';
import CategoryDetailClient from './CategoryDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const categories = packagedFoodDb.getCategories();
  return categories.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = packagedFoodDb.getCategories();
  const catNames = categories.map(c => c.name);
  const matchedName = slugToCategory(slug, catNames);

  if (!matchedName) {
    return { title: 'Category Not Found | WiseFoodies' };
  }

  const cat = categories.find(c => c.name === matchedName);
  return {
    title: `${matchedName} Packaged Foods (${cat?.productCount || 0} Products) | WiseFoodies`,
    description: `Explore ${cat?.productCount || 0} ${matchedName} packaged products across ${cat?.brands.length || 0} brands with verified nutrition facts and ingredients.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = packagedFoodDb.getCategories();
  const catNames = categories.map(c => c.name);
  const matchedName = slugToCategory(slug, catNames);

  if (!matchedName) {
    notFound();
  }

  const category = categories.find(c => c.name === matchedName)!;
  const products = packagedFoodDb.getAll().filter(p => p.category === matchedName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CategoryDetailClient category={category} products={products} />
    </div>
  );
}
