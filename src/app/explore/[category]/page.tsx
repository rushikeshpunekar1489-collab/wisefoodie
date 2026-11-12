import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, getSampleProducts, getCategories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categories = getCategories();
  const matched = categories.find(c => c.slug === category);
  const name = matched ? matched.name : category;

  return {
    title: `${name} Packaged Foods | WiseFoodies`,
    description: `Compare nutrition facts, Food Benefit Scores, and ingredients for ${name} products in India.`,
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map(c => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categories = getCategories();
  const matched = categories.find(c => c.slug === category);

  const allProducts = getAllProducts();
  const sampleProducts = getSampleProducts();
  const combined = [...allProducts, ...sampleProducts];

  const categoryProducts = combined.filter(
    p => p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category
  );

  if (!matched && categoryProducts.length === 0) {
    notFound();
  }

  const categoryName = matched ? matched.name : categoryProducts[0]?.category || 'Category';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-emerald-800">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link href="/explore" className="hover:text-emerald-800">Explore</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-semibold">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Aisle Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1 flex items-center gap-3">
            <span>{matched?.icon || '🍽️'}</span> {categoryName}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Displaying {categoryProducts.length} verified products in this category.
          </p>
        </div>

        <Link
          href="/explore"
          className="text-xs font-bold text-stone-600 hover:text-emerald-800 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> View All Categories
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
