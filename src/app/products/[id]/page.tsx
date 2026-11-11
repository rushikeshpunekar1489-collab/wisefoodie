import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Database,
  Tag,
  ShieldCheck,
  Scale,
  Sparkles,
  ChevronRight,
  Info,
  Award,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { packagedFoodDb, CATEGORY_ICONS } from '@/lib/db/packagedFoodDb';
import { getProductBySlug } from '@/lib/products';
import IndianNutritionFacts from '@/components/IndianNutritionFacts';
import ScorecardV2Container from '@/scorecard-v2/ui/ScorecardV2Container';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';
import FavouriteButton from '@/components/FavouriteButton';
import ShareButton from '@/components/ShareButton';

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const products = packagedFoodDb.getAll();
  return products.slice(0, 50).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = packagedFoodDb.getById(id);

  if (!product) {
    return { title: 'Product Not Found | WiseFoodies' };
  }

  return {
    title: `${product.name} by ${product.brand} | Nutrition Facts & Food Benefit Score | WiseFoodies`,
    description: `Complete label analysis for ${product.name} (${product.brand}). Nutrition facts, Food Benefit Score (FBS), Smart Consumption, and verified ingredients.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = packagedFoodDb.getById(id);

  if (!product) {
    notFound();
  }

  const fullProduct = getProductBySlug(product.slug);
  const icon = CATEGORY_ICONS[product.category] || '🍽️';

  // Related products in same category
  const related = packagedFoodDb
    .getAll()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-emerald-700 transition-colors">
          Packaged Foods
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="hover:text-emerald-700 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-stone-900 truncate max-w-xs font-bold">
          {product.name}
        </span>
      </nav>

      {/* 2. Top Product Header & Image Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Product Image Area */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full h-72 relative rounded-2xl bg-stone-50 border border-stone-200 p-4 flex items-center justify-center overflow-hidden">
              {fullProduct?.image ? (
                <Image
                  src={fullProduct.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-2"
                  priority
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <span className="text-6xl">{icon}</span>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                    {product.brand}
                  </p>
                  <p className="text-xs text-stone-500 max-w-xs font-medium">
                    Verified Package Record
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified FSSAI Label Data
              </span>
            </div>
          </div>

          {/* Product Details & FBS Score Capsule */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-stone-100 text-stone-800">
                {product.brand}
              </span>
              {product.priceINR !== null && (
                <div className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-200">
                  MRP: <strong className="text-base font-black">₹{product.priceINR}</strong>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-display">
              {product.name}
            </h1>

            <p className="text-xs text-stone-500 font-semibold">
              Category: <strong className="text-stone-700">{product.category}</strong>
              {product.subCategory && ` • Subcategory: ${product.subCategory}`}
              {product.servingSizeG && ` • Serving: ${product.servingSizeG}g`}
            </p>

            {/* FBS Highlight Box */}
            {fullProduct?.fbs && (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1">
                    <Award className="w-4 h-4 text-emerald-600" /> Food Benefit Score (FBS)
                  </div>
                  <p className="text-xs text-stone-600 max-w-md">
                    Deterministic score calculated from positive nutrients vs. sugars, sat fat, and sodium.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-2xl font-black leading-none">{fullProduct.fbs.score ?? '—'}</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-200 mt-0.5">
                      {fullProduct.fbs.band || 'Rating'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {fullProduct && (
                <>
                  <FavouriteButton slug={fullProduct.slug} productName={fullProduct.name} size="md" showLabel={true} />
                  <ShareButton product={fullProduct} size="md" showLabel={true} />
                </>
              )}
              <Link
                href={`/compare?select=${product.slug}`}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-stone-600" /> Compare Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NUTRITIONAL FACTS & INGREDIENTS DECLARATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Ingredients & Dataset Meta (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
              <Tag className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-base text-stone-900">
                Ingredients Declaration
              </h3>
            </div>

            {product.ingredients ? (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium leading-relaxed text-stone-800 font-mono">
                {product.ingredients}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
                Ingredients list was not disclosed on packaging.
              </div>
            )}

            {/* Dataset Meta */}
            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-stone-400" />
                <span>Source: <strong className="text-stone-700">{product.sourceOfData || 'Zepto / Label'}</strong></span>
              </div>
              {product.collectionDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Collected: <strong className="text-stone-700">{product.collectionDate}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Item ID: <strong className="text-stone-700">{product.id}</strong></span>
              </div>
            </div>
          </div>

          {/* Related from same category */}
          {related.length > 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                More from {product.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-600/40 hover:shadow-xs transition-all bg-stone-50 flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-stone-400">{item.brand}</p>
                      <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-emerald-800">
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

        {/* Right: Nutrition Facts Table (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <IndianNutritionFacts product={product} />
        </div>
      </div>

      {/* 4. SCORECARD V2 THREE DEEP INTELLIGENCE MODULES */}
      {fullProduct && (
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Deep Intelligence Modules
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Smart Consumption, Nutrition Per Paisa & Ingredients
            </h2>
          </div>
          <ScorecardV2Container product={fullProduct} />
        </div>
      )}
    </div>
  );
}
