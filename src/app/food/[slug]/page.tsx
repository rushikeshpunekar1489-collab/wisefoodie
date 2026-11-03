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
import ReportIssueModal from '@/components/ReportIssueModal';
import BetterAlternativesCarousel from '@/components/BetterAlternativesCarousel';
import FavouriteButton from '@/components/FavouriteButton';
import ShareButton from '@/components/ShareButton';
import AddToCartButton from '@/components/AddToCartButton';
import {
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Scale,
  Calendar,
  Database,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
} from 'lucide-react';

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
      title: `${product.name} (FBS: ${product.fbs.score ?? '—'}/10)`,
      description: `Decoded label report for ${product.name} by ${product.brand}`,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProductsWithSamples();
  // Pre-render the top 40 most popular products at build time; all others render on demand
  return products.slice(0, 40).map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = getAllProductsWithSamples();

  const valueData = computeNutritionPerPaisa({
    priceINR: product.priceINR,
    packSizeG: product.packSizeG,
    per100g: product.per100g,
  });

  const isSample = product.verification === 'sample';
  const isIncomplete = product.verification === 'incomplete';
  const score = product.fbs.score;

  // Header wash color matching reference design
  const heroColor =
    score === null
      ? 'var(--surface-alt)'
      : score >= 8
      ? 'var(--mint)'
      : score >= 6
      ? 'var(--sky)'
      : score >= 4
      ? 'var(--mango)'
      : 'var(--tomato)';

  // Frequency guideline derived deterministically from FBS score
  const getFrequencyVerdict = (s: number | null) => {
    if (s === null) {
      return {
        frequency: 'Evaluation Pending',
        text: 'Nutritional disclosure is currently pending label verification.',
      };
    }
    if (s >= 8.0) {
      return {
        frequency: 'Regular / Everyday Balanced Choice',
        text: 'High nutrient density with minimal ultra-processing makes this suitable as an everyday healthy staple.',
      };
    }
    if (s >= 7.0) {
      return {
        frequency: 'Frequent Choice',
        text: 'Wholesome composition with good nutritional balance for frequent meal inclusion.',
      };
    }
    if (s >= 5.0) {
      return {
        frequency: 'Occasional / Balanced Treat',
        text: 'Moderate nutritional profile. Enjoy mindfully alongside balanced whole-food meals.',
      };
    }
    if (s >= 3.0) {
      return {
        frequency: 'Limit / Occasional Snacking',
        text: 'High in refined carbohydrates, saturated fats, or sodium. Best limited to occasional indulgence.',
      };
    }
    return {
      frequency: 'Rarely / Special Occasion Treat',
      text: 'Ultra-processed food with negligible micronutrients and excessive sugar or refined oil load.',
    };
  };

  const freq = getFrequencyVerdict(product.fbs.score);

  return (
    <>
      {/* 1. HERO COLOR WASH (Reference UI Style) */}
      <div
        className="w-full relative flex items-center justify-center border-b-3 border-[var(--ink)] overflow-hidden"
        style={{
          background: heroColor,
          height: '24vh',
          minHeight: 180,
        }}
      >
        <div
          className="t-display-huge select-none opacity-25 font-black uppercase"
          style={{ color: 'var(--ink)' }}
        >
          {product.category || product.name.charAt(0)}
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10 pb-16 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[var(--ink)] mb-2">
          <Link href="/" className="hover:underline opacity-70">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/explore" className="hover:underline opacity-70">Explore</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <Link
                href={`/explore/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="hover:underline opacity-70"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2. MAIN PRODUCT HEADER BUBBLE CARD */}
        <div className="bubble-card flex flex-col md:flex-row gap-8 items-center bg-[var(--surface)]">
          {/* Image Area */}
          <div className="w-full md:w-5/12 flex flex-col items-center">
            <div className="w-full h-64 relative rounded-2xl bg-white border-2 border-[var(--ink)] p-4 flex items-center justify-center overflow-hidden shadow-[var(--shadow-hard)]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="text-center p-6 text-[var(--ink)] opacity-40 font-display font-black text-6xl">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Badges Under Image */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {isSample ? (
                <span className="chip bg-[var(--mango)] text-[var(--ink)] text-xs">
                  <Sparkles className="w-3.5 h-3.5" /> Sample Benchmark
                </span>
              ) : isIncomplete ? (
                <span className="chip bg-[var(--surface-alt)] text-[var(--ink)] text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--mango)]" /> Catalog Record
                </span>
              ) : (
                <span className="chip bg-[var(--mint)] text-[var(--ink)] text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--leaf)]" /> Verified Label
                </span>
              )}
            </div>
          </div>

          {/* Product Details & Vitality Capsule */}
          <div className="w-full md:w-7/12 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <span className="chip text-xs bg-[var(--surface-alt)]">
              {product.brand}
            </span>
            <h1 className="t-h2 text-[var(--ink)] leading-tight">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-xs font-bold opacity-60">
                Aisle: {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
              </p>
            )}

            {/* Vitality Capsule Showcase */}
            <div className="w-full py-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
              <FBSVitalityCapsule
                score={product.fbs.score}
                band={product.fbs.band}
                orientation="vertical"
                size="md"
                showLabel={true}
              />

              <div className="space-y-3 flex flex-col items-center sm:items-start">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <ProductPageClientExtras product={product} />
                  <FavouriteButton
                    slug={product.slug}
                    productName={product.name}
                    size="md"
                    showLabel={true}
                  />
                  <AddToCartButton
                    slug={product.slug}
                    productName={product.name}
                    size="md"
                  />
                  <ShareButton product={product} size="md" showLabel={true} />
                </div>
                <p className="text-xs font-bold opacity-60 max-w-xs text-center sm:text-left">
                  Algorithmically grounded per 100g on Indian Dietary Guidelines (ICMR-NIN).
                </p>
              </div>
            </div>

            {/* Price & Pack Size */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-3 border-t-2 border-[var(--ink)]/15 w-full">
              <span className="chip text-xs font-black">
                MRP: {product.priceINR ? `₹${product.priceINR}` : 'N/A'}
              </span>
              <span className="chip text-xs font-black">
                Pack: {product.packSizeG ? `${product.packSizeG}g` : 'N/A'}
              </span>
              <span className="chip text-xs font-black">
                Serving: {product.servingSizeG ? `${product.servingSizeG}g` : '100g'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. THE VERDICT (Reference UI Style) */}
        <div className="bubble-card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="t-h3">The Verdict</h3>
            <span className="chip bg-[var(--surface-alt)] text-xs">
              Guideline: {freq.frequency}
            </span>
          </div>
          <p className="t-body font-semibold opacity-85 leading-relaxed">
            {freq.text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-[var(--ink)]/10">
            {/* Benefits */}
            <div className="space-y-3">
              <div className="t-small text-[var(--leaf)] flex items-center gap-1.5 uppercase font-black">
                <CheckCircle className="w-4 h-4" /> Benefits & Highlights
              </div>
              {product.benefits.length > 0 ? (
                <ul className="space-y-1.5 text-sm font-bold opacity-80 list-disc ml-5">
                  {product.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-semibold opacity-60 italic">No notable positive highlights</p>
              )}
            </div>

            {/* Concerns */}
            <div className="space-y-3">
              <div className="t-small text-[var(--tomato)] flex items-center gap-1.5 uppercase font-black">
                <AlertTriangle className="w-4 h-4" /> Things to consider
              </div>
              {product.concerns.length > 0 ? (
                <ul className="space-y-1.5 text-sm font-bold opacity-80 list-disc ml-5">
                  {product.concerns.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-semibold opacity-60 italic">Clean nutritional profile</p>
              )}
            </div>
          </div>
        </div>

        {/* 4. NUTRITION FACTS (PER 100G) & RDA BARS */}
        {product.per100g.energyKcal !== null && (
          <div className="bubble-card space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="t-h3">
                Nutrition <span className="opacity-50 text-sm font-normal">(per 100g)</span>
              </h3>
              <span className="chip text-xs bg-[var(--surface-alt)]">
                ICMR-NIN RDA Reference
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)]">
                <span className="text-[10px] font-black uppercase opacity-60 block">Energy</span>
                <span className="text-xl font-black text-[var(--ink)]">{product.per100g.energyKcal} kcal</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--mint)] border-2 border-[var(--ink)]">
                <span className="text-[10px] font-black uppercase opacity-60 block">Protein</span>
                <span className="text-xl font-black text-[var(--leaf)]">{product.per100g.proteinG} g</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)]">
                <span className="text-[10px] font-black uppercase opacity-60 block">Added Sugar</span>
                <span className="text-xl font-black text-[var(--tomato)]">{product.per100g.addedSugarG ?? product.per100g.totalSugarG ?? 0} g</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)]">
                <span className="text-[10px] font-black uppercase opacity-60 block">Sodium</span>
                <span className="text-xl font-black text-[var(--ink)]">{product.per100g.sodiumMg ?? 0} mg</span>
              </div>
            </div>

            <div className="pt-2">
              <RDABars servingSizeG={product.servingSizeG} per100g={product.per100g} />
            </div>
          </div>
        )}

        {/* SCORECARD V2 DECISION-SUPPORT MODULES:
            Order: Smart Consumption -> Nutrition Per Paisa (upgraded in place) -> Ingredients Analysis (upgraded in place)
        */}
        <ScorecardV2Container product={product} />

        {/* 7. BETTER ALTERNATIVES (ISSE BEHTAR OPTION) */}
        <BetterAlternativesCarousel
          targetProduct={product}
          allProducts={allProducts}
        />

        {/* 8. COMPARISON ACTION BANNER */}
        <div className="bubble-card bg-[var(--berry)] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="t-h3 text-white">Compare Against Similar Grocery Items</h3>
            <p className="text-xs sm:text-sm font-semibold opacity-90">
              Run a side-by-side test to see which option gives you higher protein and less sugar.
            </p>
          </div>
          <Link
            href={`/compare?select=${product.slug}`}
            className="btn-chunky bg-white text-[var(--ink)] shrink-0 py-3 px-6 text-xs"
          >
            <Scale className="w-4 h-4 text-[var(--berry)]" /> Compare This Product
          </Link>
        </div>

        {/* METADATA & REPORT ISSUE FOOTER */}
        <div className="text-center opacity-70 space-y-2 pt-4 t-small">
          <div>Verified Catalog Record • Last Updated: {product.lastUpdated} • Source: {product.dataSource}</div>
          <div className="italic">Not medical advice. Formulated based on publicly disclosed packaging data.</div>
          <div className="pt-2">
            <ReportIssueModal
              productId={product.id}
              productSlug={product.slug}
              productName={product.name}
            />
          </div>
        </div>
      </div>
    </>
  );
}
