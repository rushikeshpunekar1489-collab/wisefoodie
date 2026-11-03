import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Database,
  Tag,
  ShieldCheck,
  Scale,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { packagedFoodDb, CATEGORY_ICONS } from '@/lib/db/packagedFoodDb';
import IndianNutritionFacts from '@/components/IndianNutritionFacts';

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const products = packagedFoodDb.getAll();
  return products.slice(0, 50).map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = packagedFoodDb.getById(id);

  if (!product) {
    return { title: 'Product Not Found | WiseFoodies' };
  }

  return {
    title: `${product.name} by ${product.brand} | Nutrition Facts & Ingredients | WiseFoodies`,
    description: `Complete label analysis for ${product.name} (${product.brand}). Nutrition facts, calories (${product.caloriesKcal ?? 'N/A'} kcal), protein, sugar, and verified ingredients.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = packagedFoodDb.getById(id);

  if (!product) {
    notFound();
  }

  const icon = CATEGORY_ICONS[product.category] || '🍽️';

  // Find related products in same category
  const related = packagedFoodDb
    .getAll()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[var(--leaf)] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-[var(--leaf)] transition-colors">
          Packaged Foods
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="hover:text-[var(--leaf)] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-stone-900 dark:text-stone-100 truncate max-w-xs font-bold">
          {product.name}
        </span>
      </nav>

      {/* Main Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Overview, Ingredients & Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bubble-card p-6 sm:p-8 bg-[var(--surface)] text-[var(--ink)] space-y-6">
            {/* Header Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" title={product.category}>{icon}</span>
                <Link
                  href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="chip text-xs font-extrabold uppercase bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-[var(--mint)]/30 transition-colors"
                >
                  {product.category}
                </Link>
                {product.subCategory && (
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    • {product.subCategory}
                  </span>
                )}
              </div>

              {product.priceINR !== null && (
                <div className="flex items-baseline gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                  <span className="text-xs font-bold">Price:</span>
                  <span className="font-display font-black text-xl">₹{product.priceINR}</span>
                </div>
              )}
            </div>

            {/* Brand & Name */}
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-stone-400 mb-1">
                {product.brand}
              </p>
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Key Quick Facts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-center">
              <div>
                <span className="text-xs font-bold text-stone-400 block uppercase">Energy</span>
                <span className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                  {product.caloriesKcal !== null ? `${product.caloriesKcal}` : '—'}
                </span>
                <span className="text-[10px] text-stone-400 ml-0.5">kcal</span>
              </div>
              <div>
                <span className="text-xs font-bold text-stone-400 block uppercase">Protein</span>
                <span className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                  {product.proteinG !== null ? `${product.proteinG}` : '—'}
                </span>
                <span className="text-[10px] text-stone-400 ml-0.5">g</span>
              </div>
              <div>
                <span className="text-xs font-bold text-stone-400 block uppercase">Total Sugar</span>
                <span className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                  {product.sugarG !== null ? `${product.sugarG}` : '—'}
                </span>
                <span className="text-[10px] text-stone-400 ml-0.5">g</span>
              </div>
              <div>
                <span className="text-xs font-bold text-stone-400 block uppercase">Sodium</span>
                <span className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                  {product.sodiumMg !== null ? `${product.sodiumMg}` : '—'}
                </span>
                <span className="text-[10px] text-stone-400 ml-0.5">mg</span>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[var(--leaf)]" />
                <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                  Ingredients Declaration
                </h3>
              </div>

              {product.ingredients ? (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-medium leading-relaxed text-stone-800 dark:text-stone-200">
                  {product.ingredients}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Ingredients list was not declared on the scanned packaging label.
                </div>
              )}
            </div>

            {/* Dataset Metadata Box */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-stone-500">
                <Database className="w-3.5 h-3.5 text-stone-400" />
                <span>Source: <strong className="text-stone-700 dark:text-stone-300">{product.sourceOfData || 'Zepto / Retail Label'}</strong></span>
              </div>

              {product.collectionDate && (
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Collected: <strong className="text-stone-700 dark:text-stone-300">{product.collectionDate}</strong></span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Database ID: <strong className="text-stone-700 dark:text-stone-300">{product.id}</strong></span>
              </div>
            </div>
          </div>

          {/* Related Products from same category */}
          {related.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-extrabold text-lg text-stone-900 dark:text-stone-100">
                More from {product.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map(item => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="p-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-800 hover:border-[var(--leaf)] hover:shadow-md transition-all bg-[var(--surface)] flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-stone-400">{item.brand}</p>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-[var(--leaf)]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {item.caloriesKcal !== null ? `${item.caloriesKcal} kcal` : 'Energy N/A'} • {item.priceINR !== null ? `₹${item.priceINR}` : 'MRP N/A'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Nutrition Facts Table (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <IndianNutritionFacts product={product} />

          {/* Quality Commitment Notice */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-100">
              <Info className="w-4 h-4 text-[var(--leaf)]" />
              <span>Label Integrity Policy</span>
            </div>
            <p className="leading-relaxed">
              Every nutritional value shown here is extracted verbatim from packaging declarations. If a field was omitted by the manufacturer, it is marked as <em>Not declared</em> rather than assumed to be zero.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
