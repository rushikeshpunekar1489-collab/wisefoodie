'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FitnessCalculatorsHub from '@/components/fitness/FitnessCalculatorsHub';
import IndianFoodSearchHub from '@/components/fitness/IndianFoodSearchHub';
import {
  Dumbbell,
  Database,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Scale,
  Flame,
  Activity,
  Heart,
  Droplet,
  BookOpen,
  Info,
} from 'lucide-react';

export default function FitnessClient() {
  const [activeMainSection, setActiveMainSection] = useState<'calculators' | 'database'>('calculators');

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Banner */}
      <section className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-12 relative overflow-hidden space-y-6 shadow-sm">
        <div className="max-w-3xl space-y-3 relative z-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Empirical Health & Nutrition Science</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight">
            Fitness & Indian <br />
            <span className="text-primary/70">Nutrition Hub</span>
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl font-medium leading-relaxed">
            Explore scientific fitness screening tools alongside the comprehensive Indian Nutrient Databank (INDB) and ICMR-NIN Food Composition Tables. Compute custom portion nutrition and understand added cooking oils with full transparency.
          </p>
        </div>

        {/* Section Navigation Switcher */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveMainSection('calculators')}
            className={`py-2.5 px-5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeMainSection === 'calculators'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>SECTION A: FITNESS CALCULATORS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainSection('database')}
            className={`py-2.5 px-5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeMainSection === 'database'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>SECTION B: INDIAN FOOD DATABASE</span>
          </button>
        </div>
      </section>

      {/* Main Section Content */}
      <section id="fitness-hub-content" className="space-y-10">
        {activeMainSection === 'calculators' ? (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary">Fitness Calculators</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                  Four clinical screening and metabolic calculators calibrated with international and Indian health standards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMainSection('database')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Jump to Indian Food Database</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <FitnessCalculatorsHub />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary">Indian Food Nutrition Database</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                  Search 1,911 verified source records across prepared Indian recipes and raw foods with multilingual aliases.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMainSection('calculators')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Back to Fitness Calculators</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <IndianFoodSearchHub />
          </div>
        )}
      </section>

      {/* Scientific Provenance & Disclaimer Footer */}
      <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wide">
            Scientific Provenance, Methodology & Data Rights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-on-surface-variant leading-relaxed font-medium">
          <div className="space-y-1.5">
            <h4 className="font-bold text-on-surface">Fitness Formulas:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>BMI:</strong> Quetelet Index (weight kg / height m²) with WHO and Asian Indian consensus classifications.</li>
              <li><strong>Body Fat:</strong> US Navy circumference method (Hodgdon & Beckett) utilizing waist, neck, hip, and height.</li>
              <li><strong>Daily Energy:</strong> Mifflin-St Jeor equation estimating BMR and physical activity multipliers (1.2 to 1.9).</li>
              <li><strong>Ideal Weight:</strong> Standard adult healthy BMI spectrum alongside Devine, Robinson, Miller, and Hamwi models.</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-on-surface">Nutrient Data Sources:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Indian Food Composition Tables (IFCT 2017):</strong> National Institute of Nutrition (ICMR-NIN), Hyderabad.</li>
              <li><strong>Art & Science of Cooking (ASC 5th Ed.):</strong> Standardized recipes (Khanna et al., 2007).</li>
              <li><strong>Basic Food Preparation (BFP 4th Ed.):</strong> Standardized recipes (Raina et al., 2011).</li>
              <li><strong>Oil Breakdown:</strong> Calculated strictly from recipe ingredient records. No fabricated values.</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-outline-variant/20 text-[11px] text-outline font-medium">
          <Info className="w-3.5 h-3.5 inline mr-1 text-primary" />
          <strong>Important Health Disclaimer:</strong> The calculators and nutritional data provided on WiseFoodies are designed for educational and informational screening purposes only. They do not constitute individualized medical, dietetic, or diagnostic advice. Consult a qualified medical practitioner or registered clinical dietitian for medical recommendations.
        </div>
      </section>
    </div>
  );
}
