import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, getSampleProducts, getCategories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import NutritionPerPaisaCard from '@/components/NutritionPerPaisaCard';
import HomeHeroInteractive from '@/components/HomeHeroInteractive';
import { computeNutritionPerPaisa } from '@/lib/value';
import {
  Scan,
  Scale,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Coins,
  Utensils,
  FlaskConical,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const allProducts = getAllProducts();
  const sampleProducts = getSampleProducts();
  const categories = getCategories();

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

  // Category bento colors
  const categoryBentoColors = [
    'var(--mint)',
    'var(--mango)',
    'var(--sky)',
    'var(--tomato)',
    'var(--bubblegum)',
    'var(--berry)',
    'var(--surface-alt)',
    'var(--leaf)',
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. HERO + FBS INTERACTIVE SLIDER DEMO */}
      <HomeHeroInteractive products={searchableProducts} />

      {/* 2. THE FOUR CORE PILLARS OF WISEFOODIES (PHASE 3.2) */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Scientific Food Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
            The Four Pillars of WiseFoodies
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
            Our platform evaluates every packaged food product through four transparent,
            objective dimensions. No corporate sponsorships, no marketing buzzwords.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PILLAR 1: FBS CALCULATION */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-600/40 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Pillar 1
                </span>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  Food Benefit Score (FBS)
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                A standardized scientific score from <strong>1 to 10</strong>. Starting from a neutral 6.0 baseline,
                we reward protein, dietary fibre, and whole-food bases while penalizing free sugars, saturated fats,
                excessive sodium, and industrial additives.
              </p>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-700 space-y-1">
                <div className="font-bold text-stone-900">How to interpret:</div>
                <div className="flex justify-between">
                  <span>8.0 - 10.0:</span> <strong className="text-emerald-700">Excellent / Everyday</strong>
                </div>
                <div className="flex justify-between">
                  <span>5.0 - 7.9:</span> <strong className="text-amber-700">Good / Moderate</strong>
                </div>
                <div className="flex justify-between">
                  <span>&lt; 5.0:</span> <strong className="text-rose-700">Limited / Treat</strong>
                </div>
              </div>
            </div>
            <Link
              href="/how-fbs-works"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors pt-3 border-t border-stone-100"
            >
              Explore FBS Formula <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* PILLAR 2: NUTRITION PER PAISA */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-600/40 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                <Coins className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  Pillar 2
                </span>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  Nutrition per Paisa™
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connects nutritional density with money spent. We calculate the exact cost in ₹ per gram
                of pure protein and dietary fibre, alongside our signature <strong>"What does ₹10 truly buy you?"</strong> grocery stack.
              </p>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-700 space-y-1">
                <div className="font-bold text-stone-900">Value Intelligence:</div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Clearly distinguishes expensive marketing markup from actual nutrient density within the same aisle.
                </p>
              </div>
            </div>
            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors pt-3 border-t border-stone-100"
            >
              Compare Value <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* PILLAR 3: SMART CONSUMPTION */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-600/40 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-200 group-hover:scale-105 transition-transform">
                <Utensils className="w-6 h-6 text-sky-700" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                  Pillar 3
                </span>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  Smart Consumption
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Translates abstract labels into real-life eating habits: realistic portion control,
                calories per serving, suggested consumption frequency (regular vs occasional treat),
                and evidence-based food pairings.
              </p>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-700 space-y-1">
                <div className="font-bold text-stone-900">Practical Guidance:</div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Portion control advice, food pairings (e.g. curd with spicy noodles), and healthier prep modifications.
                </p>
              </div>
            </div>
            <Link
              href="/diary"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors pt-3 border-t border-stone-100"
            >
              Consumption Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* PILLAR 4: INGREDIENTS ANALYSIS */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-600/40 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-200 group-hover:scale-105 transition-transform">
                <FlaskConical className="w-6 h-6 text-purple-700" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  Pillar 4
                </span>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  Ingredients Analysis
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Identifies every single ingredient, explains its functional purpose (emulsifier, stabilizer, sweetener),
                and decodes cryptic INS numbers into plain English. Highlights palm oil, allergens, and ultra-processed additives.
              </p>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-700 space-y-1">
                <div className="font-bold text-stone-900">Decoding Additives:</div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  From harmless INS 330 (citric acid) to palm oil and synthetic flavorings — know exactly what goes into your body.
                </p>
              </div>
            </div>
            <Link
              href="/learn/additives"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors pt-3 border-t border-stone-100"
            >
              Decode Ingredients <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. HOMEPAGE USER MANUAL (PHASE 3.3) */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Step-by-Step Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
              How to Use WiseFoodies — User Manual
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-medium">
              A quick manual for first-time users: master the 4 pillars to shop smarter in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="font-bold text-base text-stone-900">
                Calculate & Read FBS
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Search our 852 Indian products or scan any package with your camera. Look at the score out of 10.
                Scores above <strong>8.0</strong> represent wholesome choices; scores below <strong>5.0</strong> signify high sugar, saturated fats, or heavy processing.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                💡 Tip: Tap the score capsule to view the full point-by-point breakdown.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="font-bold text-base text-stone-900">
                Compare Value per Paisa
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Check the <strong>Nutrition per Paisa™</strong> card on every product. Compare products within the same grocery aisle to see how much protein or fibre you receive for each Rupee spent, alongside the ₹10 grocery basket.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                💡 Tip: Never compare biscuits against milk; always compare within the same category.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="font-bold text-base text-stone-900">
                Apply Smart Consumption
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Look at the <strong>Smart Consumption</strong> section. Discover your recommended serving size in grams, calories per serve, and consumption frequency (daily vs 2-3x/week vs occasional treat) based on ICMR guidelines.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                💡 Tip: Check pairing suggestions to blunt sugar spikes or reduce sodium absorption.
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                4
              </div>
              <h3 className="font-bold text-base text-stone-900">
                Decode Ingredients & INS
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Review the <strong>Ingredients Analysis</strong> module. Ingredients are listed in descending order by weight. Check the highlighted wholesome ingredients, flagged concerns (e.g. palmolein, artificial sweeteners), and plain-language INS additive explanations.
              </p>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                💡 Tip: The first 3 ingredients make up the majority of what you eat.
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-stone-100 flex flex-wrap justify-center gap-4">
            <Link href="/scanner" className="btn-chunky btn-primary">
              <Scan className="w-4 h-4" /> Try It Now: Scan a Product
            </Link>
            <Link href="/products" className="btn-chunky">
              Browse 852 Indian Products
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY BENTO GRID */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="chip mb-2 bg-[var(--surface)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--leaf)]" /> Grocery Aisles
            </div>
            <h2 className="t-h2">Explore Categories</h2>
            <p className="text-sm font-semibold opacity-70">
              Pick an aisle to discover nutrition truths and smart alternatives across 852 items.
            </p>
          </div>
          <Link
            href="/category"
            className="btn-chunky py-2 px-5 text-xs self-start sm:self-auto"
          >
            All 13 Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bento-grid">
          {categories.slice(0, 8).map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="bento-card group"
              style={{
                background: categoryBentoColors[i % categoryBentoColors.length],
                color: i % categoryBentoColors.length === 5 ? 'white' : 'var(--ink)',
              }}
            >
              <div className="text-3xl sm:text-4xl">{cat.icon}</div>
              <div>
                <div className="font-extrabold text-base leading-tight group-hover:underline">
                  {cat.name}
                </div>
                <div className="text-xs opacity-75 font-bold mt-1">
                  {cat.count} {cat.count === 1 ? 'item' : 'items'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. POPULAR RIGHT NOW PRODUCT GRID */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="chip mb-2 bg-[var(--leaf)] text-white">
              <Sparkles className="w-3.5 h-3.5" /> High Demand Catalog
            </div>
            <h2 className="t-h2">Popular Right Now</h2>
            <p className="text-sm font-semibold opacity-70">
              Verified nutritional profiles and Food Benefit Scores for everyday grocery staples.
            </p>
          </div>
          <Link
            href="/products"
            className="btn-chunky btn-primary py-2.5 px-5 text-xs self-start sm:self-auto"
          >
            View All {allProducts.length} Items <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="product-grid">
          {allProducts.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. NUTRITION PER PAISA SPOTLIGHT */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            {oatsValueData && (
              <NutritionPerPaisaCard
                valueData={oatsValueData}
                priceINR={oatsSample.priceINR}
                packSizeG={oatsSample.packSizeG}
                category={oatsSample.category}
              />
            )}
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="chip bg-[var(--mango)] text-[var(--ink)]">
              🪙 Value Intelligence
            </div>
            <h2 className="t-h2">
              Nutrition Per Paisa™: What Does ₹10 Truly Buy You?
            </h2>
            <p className="t-body font-semibold opacity-85 leading-relaxed">
              A high price does not guarantee nutrition, nor does low price mean bad quality. We calculate the exact cost in ₹ per gram of pure protein and dietary fibre, alongside our signature interactive <strong>What do you get for ₹10?</strong> grocery stack.
            </p>
            <div className="bubble-card p-4 bg-[var(--surface-alt)]">
              <p className="text-xs font-bold opacity-80">
                💡 <strong>Smart Shopper Rule:</strong> Compare value strictly within the same aisle (e.g. Oats vs. Oats, or Biscuits vs. Biscuits) to spot honest brands that don&apos;t charge a premium for filler ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SIDE-BY-SIDE COMPARE BANNER */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="bubble-card bg-emerald-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-emerald-950">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="chip bg-white text-emerald-950">
              <Scale className="w-3.5 h-3.5 text-emerald-800" /> Head-to-Head Showdown
            </div>
            <h2 className="t-h2 text-white">Compare 2 Foods Side-by-Side</h2>
            <p className="text-sm sm:text-base font-semibold text-white/90 leading-relaxed">
              Torn between two snacks at the supermarket? Run our comparative engine to see who wins on protein, who packs hidden sodium, and who takes the WiseFoodies Crown 👑.
            </p>
          </div>

          <Link
            href="/compare"
            className="btn-chunky bg-white text-emerald-950 shrink-0 px-8 py-4 text-base hover:bg-stone-100"
          >
            <Scale className="w-5 h-5 text-emerald-800" /> Compare Foods Now
          </Link>
        </div>
      </section>

      {/* 8. LABEL LITERACY / ESSENTIAL GUIDES */}
      <section className="container max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="chip mb-2 bg-[var(--surface)]">
              <BookOpen className="w-3.5 h-3.5 text-[var(--leaf)]" /> Decoding Food Labels
            </div>
            <h2 className="t-h2">Essential Food Knowledge</h2>
            <p className="text-sm font-semibold opacity-70">
              Clear, science-backed insights designed to protect Indian consumers.
            </p>
          </div>
          <Link
            href="/learn"
            className="btn-chunky py-2 px-5 text-xs self-start sm:self-auto"
          >
            All Articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/learn/sugar" className="bubble-card group flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-4xl">🍯</span>
              <h3 className="t-h3 group-hover:text-[var(--leaf)] transition-colors">
                The 12 Aliases of Added Sugar
              </h3>
              <p className="text-sm font-semibold opacity-75">
                How invert syrup, maltodextrin, and fruit concentrates conceal extreme sugar loads on Indian packaging.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[var(--leaf)] mt-4">
              Read Guide <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/learn/palm-oil" className="bubble-card group flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-4xl">🌴</span>
              <h3 className="t-h3 group-hover:text-[var(--leaf)] transition-colors">
                Palm Oil & Saturated Fat
              </h3>
              <p className="text-sm font-semibold opacity-75">
                Why generic &apos;Edible Vegetable Oil&apos; is almost always palmolein, and its impact on heart health.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[var(--leaf)] mt-4">
              Read Guide <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/learn/additives" className="bubble-card group flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-4xl">🧪</span>
              <h3 className="t-h3 group-hover:text-[var(--leaf)] transition-colors">
                Decoding INS Numbers
              </h3>
              <p className="text-sm font-semibold opacity-75">
                From INS 330 (harmless citric acid) to INS 627 & 631 (flavour enhancers) — which additives matter and why.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[var(--leaf)] mt-4">
              Read Guide <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 9. QUICK CAMERA SCANNER BANNER */}
      <section className="container max-w-6xl mx-auto px-4 pb-12">
        <div className="bubble-card bg-emerald-50/50 p-8 sm:p-12 text-center space-y-4 border-2 border-emerald-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-800 text-white flex items-center justify-center border border-emerald-900 shadow-md">
            <Scan className="w-8 h-8" />
          </div>
          <h2 className="t-h2 text-stone-900">Ready to Decode Your Groceries?</h2>
          <p className="text-sm sm:text-base font-semibold text-stone-600 max-w-md mx-auto">
            Upload photographs of any nutrition label or grocery package to immediately calculate its Food Benefit Score.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/scanner" className="btn-chunky btn-primary">
              <Scan className="w-4 h-4" /> Launch Optical AI Scanner
            </Link>
            <Link href="/products" className="btn-chunky">
              Explore 852 Indian Foods
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
