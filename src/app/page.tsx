import Link from 'next/link';
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
    'var(--mango)',
    'var(--mint)',
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

      {/* 2. CATEGORY BENTO GRID */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="chip mb-2 bg-[var(--surface)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--leaf)]" /> Grocery Aisles
            </div>
            <h2 className="t-h2">Explore Categories</h2>
            <p className="text-sm font-semibold opacity-70">
              Pick an aisle to discover nutrition truths and smart alternatives.
            </p>
          </div>
          <Link
            href="/explore"
            className="btn-chunky py-2 px-5 text-xs self-start sm:self-auto"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bento-grid">
          {categories.slice(0, 8).map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/explore/${cat.slug}`}
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

      {/* 3. POPULAR RIGHT NOW PRODUCT GRID */}
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
            href="/explore"
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

      {/* 4. NUTRITION PER PAISA SPOTLIGHT */}
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

      {/* 5. SIDE-BY-SIDE COMPARE BANNER */}
      <section className="container max-w-6xl mx-auto px-4">
        <div className="bubble-card bg-[var(--berry)] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="chip bg-white text-[var(--ink)]">
              <Scale className="w-3.5 h-3.5 text-[var(--berry)]" /> Head-to-Head Showdown
            </div>
            <h2 className="t-h2 text-white">Compare 2 Foods Side-by-Side</h2>
            <p className="text-sm sm:text-base font-semibold text-white/90 leading-relaxed">
              Torn between two snacks at the supermarket? Run our comparative engine to see who wins on protein, who packs hidden sodium, and who takes the WiseFoodies Crown 👑.
            </p>
          </div>

          <Link
            href="/compare"
            className="btn-chunky bg-white text-[var(--ink)] shrink-0 px-8 py-4 text-base"
          >
            <Scale className="w-5 h-5 text-[var(--berry)]" /> Compare Foods Now
          </Link>
        </div>
      </section>

      {/* 6. LABEL LITERACY / ESSENTIAL GUIDES */}
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

      {/* 7. QUICK CAMERA SCANNER BANNER */}
      <section className="container max-w-6xl mx-auto px-4 pb-12">
        <div className="bubble-card bg-[var(--surface-alt)] p-8 sm:p-12 text-center space-y-4 border-3 border-[var(--ink)]">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--leaf)] text-white flex items-center justify-center border-2 border-[var(--ink)] shadow-[var(--shadow-hard)]">
            <Scan className="w-8 h-8" />
          </div>
          <h2 className="t-h2">Ready to Decode Your Groceries?</h2>
          <p className="text-sm sm:text-base font-semibold opacity-80 max-w-md mx-auto">
            Scan any grocery barcode or nutrition table with your camera to instantly calculate its Food Benefit Score.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/scanner" className="btn-chunky btn-primary">
              <Scan className="w-4 h-4" /> Launch Barcode Scanner
            </Link>
            <Link href="/explore" className="btn-chunky">
              Explore Product Database
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
