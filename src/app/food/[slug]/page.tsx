import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getAllProductsWithSamples } from '@/lib/products';
import { computeNutritionPerPaisa } from '@/lib/value';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';
import RDABars from '@/components/RDABars';
import NutritionPerPaisaCard from '@/components/NutritionPerPaisaCard';
import IngredientBreakdown from '@/components/IngredientBreakdown';
import ScorecardV2Container from '@/scorecard-v2/ui/ScorecardV2Container';
import ProductPageClientExtras from '@/components/ProductPageClientExtras';
import BetterAlternativesCarousel from '@/components/BetterAlternativesCarousel';
import FavouriteButton from '@/components/FavouriteButton';
import ShareButton from '@/components/ShareButton';
import AddToCartButton from '@/components/AddToCartButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: 'Product Not Found | WiseFoodies' };
  }

  const scoreText = product.fbs.score ? ` (FBS: ${product.fbs.score}/10)` : '';
  const ogImageUrl = `/api/og?slug=${encodeURIComponent(product.slug)}`;
  return {
    title: `${product.name}${scoreText} Nutrition & Food Benefit Score | WiseFoodies`,
    description: `Decoded label report for ${product.name} by ${product.brand}. Verified nutrients, ingredients, FBS rating, and value intelligence.`,
    openGraph: {
      title: `${product.name} — WiseFoodies FBS Report`,
      description: `Decoded label report: ${product.fbs.band || 'Rating'} • ${product.brand}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} FBS Card`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — WiseFoodies`,
      description: `FBS Rating: ${product.fbs.score ?? '—'}/10 • ${product.brand}`,
      images: [ogImageUrl],
    },
  };
}

export function generateStaticParams() {
  const all = getAllProductsWithSamples();
  return all.slice(0, 50).map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isSample = product.verification === 'sample';
  const score = product.fbs.score;

  // Compute Nutrition Per Paisa
  const valueData = computeNutritionPerPaisa({
    priceINR: product.priceINR,
    packSizeG: product.packSizeG,
    per100g: product.per100g,
  });

  // Better alternatives in the same category
  const allProds = getAllProductsWithSamples();
  const alternatives = allProds
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        (p.fbs.score ?? 0) > (score ?? 0)
    )
    .sort((a, b) => (b.fbs.score ?? 0) - (a.fbs.score ?? 0))
    .slice(0, 4);

  const isUPF = (score !== null && score !== undefined && score < 4.5) ||
    product.concerns?.some((c) => c.toLowerCase().includes('palm oil') || c.toLowerCase().includes('additive'));

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
        {product.category && (
          <>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link
              href={`/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="hover:text-primary transition-colors"
            >
              {product.category}
            </Link>
          </>
        )}
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
          {isSample && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-xs uppercase font-bold border border-secondary/20">
              <span>Sample Benchmark</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Hero Product Showcase Card (Stitch 2 Dossier Showcase) */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Packaging Image Showcase */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square relative rounded-xl bg-surface-container-low border border-outline-variant/30 p-4 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
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
              {product.priceINR !== null && product.priceINR !== undefined && (
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
              {product.subcategory && ` • Subcategory: ${product.subcategory}`}
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
                <FBSVitalityCapsule score={score} size="sm" orientation="horizontal" />
              </div>
            </div>

            {/* UPF Risk Alert */}
            {isUPF && (
              <div className="p-3 rounded-lg bg-error-container text-on-error-container border border-error/30 flex items-center gap-2 text-xs font-label-caps">
                <span className="material-symbols-outlined text-base text-error">warning</span>
                <span>Contains Ultra-Processed Additives or High Sugar/Sodium Ratio. Consume with caution.</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <AddToCartButton slug={product.slug} productName={product.name} size="md" />
              <FavouriteButton slug={product.slug} productName={product.name} size="md" showLabel={true} />
              <ShareButton product={product} size="md" showLabel={true} />
              <Link
                href={`/compare?select=${product.slug}`}
                className="px-4 py-2.5 rounded-full border border-outline-variant/40 bg-surface-container text-on-surface font-label-caps text-xs uppercase font-bold hover:bg-surface-container-high transition-colors inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">balance</span>
                <span>Pin to Compare</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MACRO FACTS & NUTRITION PER PAISA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Nutrition Per Paisa Card */}
        {valueData && (
          <NutritionPerPaisaCard
            valueData={valueData}
            priceINR={product.priceINR}
            packSizeG={product.packSizeG}
            category={product.category}
          />
        )}

        {/* RDA Reference Bars */}
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <h3 className="font-headline-sm text-base text-primary">
              RDA Reference Daily Allowances
            </h3>
            <span className="font-label-caps text-xs text-on-surface-variant font-bold">
              ICMR-NIN 2024
            </span>
          </div>
          <RDABars per100g={product.per100g} servingSizeG={product.servingSizeG} />
        </div>
      </div>

      {/* 5. FORENSIC INGREDIENT BREAKDOWN */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">biotech</span>
            <h3 className="font-headline-sm text-base text-primary">
              Forensic Ingredient Breakdown
            </h3>
          </div>
          <span className="font-label-caps text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface">
            {product.ingredients?.length ?? 0} Declared Ingredients
          </span>
        </div>
        <IngredientBreakdown
          ingredients={product.ingredients}
        />
      </div>

      {/* 6. SCORECARD V2 DEEP INTELLIGENCE MODULES */}
      <div className="space-y-6 pt-4 border-t border-outline-variant/30">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="font-label-caps text-xs uppercase tracking-wider text-primary bg-primary-fixed px-3 py-1 rounded-full border border-primary/20 font-bold">
            Deep Intelligence Modules
          </span>
          <h2 className="font-headline-md text-2xl text-primary font-serif">
            Smart Consumption &amp; Additives Analysis
          </h2>
        </div>
        <ScorecardV2Container product={product} />
      </div>

      {/* 7. BETTER ALTERNATIVES CAROUSEL */}
      {alternatives.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-outline-variant/30">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-xs text-emerald-800 uppercase font-bold">
                Healthy Swaps
              </span>
              <h3 className="font-headline-sm text-lg text-primary">
                Better Alternatives in {product.category}
              </h3>
            </div>
            <Link
              href={`/category/${product.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="font-label-caps text-xs text-primary font-bold hover:underline"
            >
              View Category &rarr;
            </Link>
          </div>
          <BetterAlternativesCarousel
            targetProduct={product}
            allProducts={allProds}
          />
        </div>
      )}

      {/* 8. CLIENT EXTRAS (Report Issue, Feedback) */}
      <ProductPageClientExtras product={product} />
    </div>
  );
}
