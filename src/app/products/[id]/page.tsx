import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { packagedFoodDb, CATEGORY_ICONS } from '@/lib/db/packagedFoodDb';
import { getProductBySlug } from '@/lib/products';
import IndianNutritionFacts from '@/components/IndianNutritionFacts';
import ScorecardV2Container from '@/scorecard-v2/ui/ScorecardV2Container';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';
import FavouriteButton from '@/components/FavouriteButton';
import ShareButton from '@/components/ShareButton';
import AddToCartButton from '@/components/AddToCartButton';

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
    description: `Forensic packaging dossier for ${product.name} (${product.brand}). Nutrition facts, Food Benefit Score (FBS), Smart Consumption, and verified ingredients.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = packagedFoodDb.getById(id);

  if (!product) {
    notFound();
  }

  // Look up corresponding full Product record (by id or slug)
  const fullProduct = getProductBySlug(product.id) || getProductBySlug(product.slug);
  const icon = CATEGORY_ICONS[product.category] || 'inventory_2';

  // Compute calculated FBS score if full product is not precomputed
  const sugarPenalty = (product.sugarG ?? 0) * 0.15;
  const satFatPenalty = (product.saturatedFatG ?? 0) * 0.2;
  const sodiumPenalty = ((product.sodiumMg ?? 0) / 1000) * 1.5;
  const proteinBonus = (product.proteinG ?? 0) * 0.25;
  const fiberBonus = (product.dietaryFiberG ?? 0) * 0.35;
  const calculatedScore = fullProduct?.fbs?.score ?? Math.max(1.0, Math.min(10.0, 7.5 - sugarPenalty - satFatPenalty - sodiumPenalty + proteinBonus + fiberBonus));

  const isUPF = (product.sugarG ?? 0) > 20 || (product.sodiumMg ?? 0) > 800 || calculatedScore < 4.5;
  const productImage = fullProduct?.image || product.image;

  // Related products from same category
  const related = packagedFoodDb
    .getAll()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 space-y-8 bg-surface text-on-surface">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-label-caps text-on-surface-variant overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          Packaged Foods
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link
          href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-primary truncate max-w-xs font-bold">
          {product.name}
        </span>
      </nav>

      {/* 2. Top Header: Packaged Food Dossier Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider block mb-1">
            Forensic Food Intelligence Dossier
          </span>
          <h1 className="font-headline-lg-mobile sm:font-headline-lg text-primary font-serif">
            Packaged Food Dossier
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-xs uppercase font-bold border border-primary/10">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Forensic Audit Complete</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-caps text-xs uppercase font-bold border border-outline-variant/30">
            <span>FSSAI 2020 Compliant</span>
          </span>
        </div>
      </div>

      {/* 3. Hero Product Showcase Card (Stitch 2 Dossier Showcase) */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Packaging Image Showcase Area */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square relative rounded-xl bg-surface-container-low border border-outline-variant/30 p-4 flex items-center justify-center overflow-hidden">
              {productImage ? (
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-contain p-3"
                  priority
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <span className="material-symbols-outlined text-6xl text-primary/30">
                    inventory_2
                  </span>
                  <p className="font-label-caps text-xs font-bold text-primary uppercase tracking-widest block">
                    {product.brand}
                  </p>
                  <p className="font-body-sm text-xs text-on-surface-variant max-w-xs">
                    Commercial packaging image undergoing laboratory validation
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full text-xs font-label-caps font-bold bg-primary-fixed text-on-primary-fixed border border-primary/20 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">health_and_safety</span>
                <span>Verified Independent Inspection</span>
              </span>
            </div>
          </div>

          {/* Product Details & Score Pillar */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-surface-container text-secondary font-bold">
                {product.brand}
              </span>
              {product.priceINR !== null && (
                <div className="px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-sm border border-secondary/20 tabular-nums">
                  MRP: <strong className="text-base font-bold">₹{product.priceINR}</strong>
                </div>
              )}
            </div>

            <h2 className="font-headline-lg-mobile sm:font-headline-lg text-primary font-serif leading-tight">
              {product.name}
            </h2>

            <p className="font-body-sm text-xs text-on-surface-variant font-medium">
              Category: <strong className="text-primary">{product.category}</strong>
              {product.subCategory && ` • Subcategory: ${product.subCategory}`}
              {product.servingSizeG && ` • Serving: ${product.servingSizeG}g`}
            </p>

            {/* Signature FBS Vitality Capsule */}
            <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-label-caps text-xs uppercase text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">award_star</span>
                  <span>Food Benefit Score (FBS)</span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-md">
                  Algorithmic evaluation calibrated from intact protein &amp; fibre against free sugars, sodium &amp; industrial UPF markers.
                </p>
              </div>
              <div className="shrink-0">
                <FBSVitalityCapsule score={calculatedScore} size="sm" orientation="horizontal" />
              </div>
            </div>

            {/* UPF Risk Notice */}
            {isUPF && (
              <div className="p-3 rounded-lg bg-error-container text-on-error-container border border-error/30 flex items-center gap-2 text-xs font-label-caps">
                <span className="material-symbols-outlined text-base text-error">warning</span>
                <span>Contains Ultra-Processed Additives or High Sugar/Sodium Ratio. Consume with caution.</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <AddToCartButton slug={product.slug || product.id} productName={product.name} size="md" />
              <FavouriteButton slug={product.slug || product.id} productName={product.name} size="md" showLabel={true} />
              {fullProduct && <ShareButton product={fullProduct} size="md" showLabel={true} />}
              <Link
                href={`/compare?select=${product.slug || product.id}`}
                className="px-4 py-2.5 rounded-full border border-outline-variant/40 bg-surface-container text-on-surface font-label-caps text-xs uppercase font-bold hover:bg-surface-container-high transition-colors inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">balance</span>
                <span>Pin to Compare</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INGREDIENTS DECLARATION & NUTRITION FACTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Ingredients & Dataset Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="material-symbols-outlined text-primary text-xl">description</span>
              <h3 className="font-headline-sm text-base text-primary">
                Ingredients Declaration
              </h3>
            </div>

            {product.ingredients ? (
              <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/25 font-mono text-xs sm:text-sm text-on-surface leading-relaxed">
                {product.ingredients}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-secondary-fixed/20 border border-secondary/30 text-xs font-body-sm text-on-surface-variant">
                Full ingredient list was not disclosed on the exterior label.
              </div>
            )}

            {/* Dataset Metadata */}
            <div className="pt-3 border-t border-outline-variant/20 grid grid-cols-2 sm:grid-cols-3 gap-3 font-label-caps text-xs text-on-surface-variant">
              <div>
                Source: <strong className="text-primary">{product.sourceOfData || 'FSSAI Label Inspection'}</strong>
              </div>
              {product.collectionDate && (
                <div>
                  Audited: <strong className="text-primary">{product.collectionDate}</strong>
                </div>
              )}
              <div>
                Forensic SKU: <strong className="text-primary">{product.id}</strong>
              </div>
            </div>
          </div>

          {/* Related from same category */}
          {related.length > 0 && (
            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-6 space-y-4 shadow-xs">
              <h3 className="font-label-lg text-xs uppercase tracking-wider text-primary font-bold">
                More Audits in {product.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="p-3.5 rounded-lg border border-outline-variant/30 hover:border-primary/40 hover:shadow-xs transition-all bg-surface-container-low flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <p className="font-label-caps text-[0.625rem] text-secondary font-bold uppercase">{item.brand}</p>
                      <h4 className="font-headline-sm text-xs text-primary truncate group-hover:text-primary-container">
                        {item.name}
                      </h4>
                      <p className="font-body-sm text-[0.6875rem] text-on-surface-variant mt-0.5 tabular-nums">
                        {item.caloriesKcal !== null ? `${item.caloriesKcal} kcal` : 'Energy N/A'} • {item.priceINR !== null ? `₹${item.priceINR}` : 'MRP N/A'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-0.5 transition-transform text-lg shrink-0">
                      arrow_forward
                    </span>
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

      {/* 5. SCORECARD V2 DEEP FORENSIC MODULES */}
      {fullProduct && (
        <div className="space-y-6 pt-4 border-t border-outline-variant/30">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="font-label-caps text-xs uppercase tracking-wider text-primary bg-primary-fixed px-3 py-1 rounded-full border border-primary/20 font-bold">
              Deep Intelligence Modules
            </span>
            <h2 className="font-headline-md text-2xl text-primary font-serif">
              Smart Consumption, The ₹10 Test &amp; Forensic Safety
            </h2>
          </div>
          <ScorecardV2Container product={fullProduct} />
        </div>
      )}
    </div>
  );
}
