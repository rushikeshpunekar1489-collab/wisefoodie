import React from 'react';
import Link from 'next/link';
import { getAllProducts, getSampleProducts } from '@/lib/products';
import ConsumerHealthHero from '@/components/landing/ConsumerHealthHero';
import TaglineReveal from '@/components/landing/TaglineReveal';
import PackagingDeceptions from '@/components/landing/PackagingDeceptions';
import InteractiveFbsSimulator from '@/components/landing/InteractiveFbsSimulator';
import ConsumerFaq from '@/components/landing/ConsumerFaq';
import NutritionPerPaisaCard from '@/components/NutritionPerPaisaCard';
import ProductCard from '@/components/ProductCard';
import { computeNutritionPerPaisa } from '@/lib/value';

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const sampleProducts = getSampleProducts();

  // Simple products for instant client search
  const searchableProducts = allProducts.map((p) => ({
    name: p.name,
    brand: p.brand,
    slug: p.slug,
    category: p.category,
    image: p.image,
    score: p.fbs.score,
  }));

  // Featured sample product for Nutrition Per Paisa card
  const oatsSample = sampleProducts[0] || allProducts[0];
  const oatsValueData = oatsSample
    ? computeNutritionPerPaisa({
        priceINR: oatsSample.priceINR,
        packSizeG: oatsSample.packSizeG,
        per100g: oatsSample.per100g,
      })
    : null;

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 pt-28 md:pt-32 pb-16 bg-surface">
      {/* 1. HERO SECTION: CONSUMER HEALTH MOVEMENT HERO WITH INTERACTIVE DECODER */}
      <ConsumerHealthHero products={searchableProducts} />

      {/* 2. TAGLINE REVEAL (STITCH BOTANICAL INTELLIGENCE MANDATE) */}
      <TaglineReveal
        tagline="Clean ingredients are a basic human right, not a luxury marketing premium."
        subtext="We believe every Indian household deserves uncompromised scientific truth and forensic ingredient dissection."
        badge="INDEPENDENT FORENSIC STANDARD"
      />

      {/* 3. INVESTIGATIVE DOSSIER: THE 4 PACKAGING TRAPS */}
      <PackagingDeceptions />

      {/* 4. INTERACTIVE LIVE FBS SCORE SIMULATOR */}
      <InteractiveFbsSimulator />

      {/* 5. NUTRITION PER PAISA VALUE INTELLIGENCE */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="rounded-xl bg-surface-container-lowest p-6 sm:p-12 border border-outline-variant/40 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-secondary-fixed text-on-secondary-fixed border border-secondary/20">
                <span className="material-symbols-outlined text-sm">payments</span>
                <span>GROCERY VALUE AUDIT</span>
              </div>
              <h2 className="font-headline-md text-2xl sm:text-3xl text-primary font-serif">
                The ₹10 Test: What Does Your Money Truly Buy?
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xl">
                Connect nutritional density directly to hard-earned rupees. Compare grams of actual protein and intact fibre delivered per ₹10 spent.
              </p>
            </div>

            <Link
              href="/products"
              className="px-4 py-2 rounded-full border border-primary/20 bg-surface-container-low text-primary font-label-caps text-xs uppercase font-bold hover:bg-primary-fixed transition-colors self-start sm:self-auto inline-flex items-center gap-1"
            >
              <span>Audit All Grocery Aisles</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {oatsSample && oatsValueData && (
              <NutritionPerPaisaCard
                valueData={oatsValueData}
                priceINR={oatsSample.priceINR}
                packSizeG={oatsSample.packSizeG}
                category={oatsSample.category}
              />
            )}

            <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4">
              <span className="font-label-caps text-xs uppercase text-primary font-bold block">
                The Supermarket Paradox
              </span>
              <h3 className="font-headline-sm text-lg text-primary">
                Why &ldquo;Premium&rdquo; Doesn&apos;t Mean Healthier
              </h3>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                A ₹450 imported artisan granola bar frequently provides less real dietary fiber and protein per ₹10 than a simple bag of roasted chana or whole rolled oats. WiseFoodies strips away foreign typography, shiny gold foil packaging, and buzzwords to show what you are actually swallowing.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 font-label-caps text-xs text-on-surface">
                <span className="p-2 rounded-md bg-surface-container-lowest border border-outline-variant/30">
                  ₹/g Pure Protein
                </span>
                <span className="p-2 rounded-md bg-surface-container-lowest border border-outline-variant/30">
                  ₹/g Intact Fibre
                </span>
                <span className="p-2 rounded-md bg-surface-container-lowest border border-outline-variant/30">
                  Sugar Cost Ratio
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY AUDIT: EVERYDAY PRODUCTS AUDITED BY SCIENCE */}
      <section className="container max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-primary-fixed text-on-primary-fixed border border-primary/20">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>VERIFIED SCORECARD PREVIEWS</span>
            </div>
            <h2 className="font-headline-md text-2xl sm:text-3xl text-primary font-serif">
              Everyday Products Audited by Science
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Explore real Indian packaged items with independent ratings and zero brand bias.
            </p>
          </div>

          <Link
            href="/products"
            className="px-4 py-2 rounded-full border border-primary/20 bg-surface-container-low text-primary font-label-caps text-xs uppercase font-bold hover:bg-primary-fixed transition-colors self-start sm:self-auto inline-flex items-center gap-1"
          >
            <span>Explore All 852 Products</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. CONNECT WITH THE FITNESS & AUTHENTIC RECIPES HUB */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="rounded-xl bg-surface-container-low p-6 sm:p-10 border border-outline-variant/40 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase tracking-wider bg-surface-container-highest text-on-surface border border-outline-variant/30">
              <span className="material-symbols-outlined text-sm">calculate</span>
              <span>CLINICAL SCREENING &amp; INDB INTEGRATION</span>
            </div>
            <h2 className="font-headline-md text-2xl text-primary font-serif">
              Looking for Clinical Fitness &amp; Authentic Indian Recipes?
            </h2>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Calculate BMI, US Navy Body Fat %, and Mifflin-St Jeor daily calories. Search 1,911 verified Indian recipes and raw foods from the Indian Nutrient Databank (INDB) with authentic added cooking oil breakdowns.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/fitness-calculators"
              className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-caps text-xs uppercase font-bold inline-flex items-center gap-2 hover:bg-primary-container transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-base">fitness_center</span>
              <span>Open Fitness &amp; Nutrition Hub</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CONSUMER HEALTH TRANSPARENCY FAQ */}
      <ConsumerFaq />

      {/* 9. FINAL CALL TO ACTION (RISK REVERSAL & IMMEDIATE PANTRY AUDIT) */}
      <section className="container max-w-6xl mx-auto px-4 pb-12">
        <div className="rounded-xl bg-primary text-on-primary p-8 sm:p-14 text-center space-y-6 border border-primary-container shadow-md relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container border border-primary-fixed/20 font-label-caps text-xs uppercase text-primary-fixed">
              <span className="material-symbols-outlined text-sm">health_and_safety</span>
              <span>JOIN THE FOOD TRANSPARENCY MOVEMENT</span>
            </div>

            <h2 className="font-display-hero-mobile sm:font-display-hero text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight">
              Take Back Control of Your Kitchen Today.
            </h2>

            <p className="font-body-md text-sm sm:text-base text-primary-fixed-dim max-w-lg mx-auto leading-relaxed">
              Search 852 Indian packaged products or screen your health metrics in seconds. Zero account required, 100% free, forever.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-surface-container-lowest text-primary font-label-caps text-xs uppercase font-bold hover:bg-surface-container transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Audit 852 Packaged Foods</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link
                href="/fitness-calculators"
                className="px-6 py-3 rounded-full bg-primary-container text-white border border-primary-fixed/30 font-label-caps text-xs uppercase font-bold hover:bg-primary-container/80 transition-colors inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">calculate</span>
                <span>Fitness &amp; Nutrition Hub</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
