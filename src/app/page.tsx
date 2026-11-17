import React from 'react';
import { getAllProducts } from '@/lib/products';
import PackagedFoodOrbitCarousel from '@/components/discovery/PackagedFoodOrbitCarousel';
import FoodIntelligenceFBSSection from '@/components/landing/FoodIntelligenceFBSSection';
import NutritionAnalysisSection from '@/components/landing/NutritionAnalysisSection';
import IngredientIntelligenceSection from '@/components/landing/IngredientIntelligenceSection';
import ProductComparisonSection from '@/components/landing/ProductComparisonSection';
import ConsumerFaq from '@/components/landing/ConsumerFaq';
import FinalCTASection from '@/components/landing/FinalCTASection';

export const metadata = {
  title: 'WiseFoodies — Food Intelligence Platform | Eat Smarter. Choose Better.',
  description:
    'WiseFoodies is an independent food intelligence platform helping consumers understand packaged food through Food Benefit Score (FBS), forensic ingredient dissection, ICMR-NIN RDA graphs, and Nutrition Per Paisa.',
};

export default async function HomePage() {
  const allProducts = await getAllProducts();

  // Simple products for instant interactive client search
  const searchableProducts = allProducts.map((p) => ({
    name: p.name,
    brand: p.brand,
    slug: p.slug,
    category: p.category,
    image: p.image,
    score: p.fbs.score,
  }));

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#14211A] pt-24 md:pt-28 font-sans selection:bg-[#16A34A] selection:text-white">
      {/* 1. HERO — PACKAGED FOOD DISH ORBIT CAROUSEL WITH SEARCH & INTELLIGENCE */}
      <section id="hero-orbit" className="w-full">
        <PackagedFoodOrbitCarousel products={searchableProducts} />
      </section>

      {/* 2. FOOD INTELLIGENCE & FBS — SIGNATURE ANIMATED VITALITY LIQUID CAPSULE */}
      <FoodIntelligenceFBSSection />

      {/* 3. NUTRITION ANALYSIS — HORIZONTAL RDA REFERENCE GRAPHS & NUTRITION PER PAISA */}
      <NutritionAnalysisSection />

      {/* 4. INGREDIENT INTELLIGENCE — DISSECTING ADDITIVES, HIDDEN SUGARS & PALM OIL */}
      <IngredientIntelligenceSection />

      {/* 5. PRODUCT COMPARISON — PREMIUM HEAD-TO-HEAD SHOWDOWN */}
      <ProductComparisonSection />

      {/* 6. CONSUMER HEALTH TRANSPARENCY FAQ */}
      <div className="bg-white py-12 sm:py-16 border-b border-[#14211A]/10">
        <ConsumerFaq />
      </div>

      {/* 7. FINAL CTA — STRONG PRODUCT-FOCUSED ENDING & BRAND MANDATE */}
      <FinalCTASection />
    </div>
  );
}
