import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Scale, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import FBSVitalityCapsule from '@/components/FBSVitalityCapsule';

export const metadata: Metadata = {
  title: 'How the Food Benefit Score (FBS) Works | WiseFoodies',
  description:
    'Full mathematical methodology and formula table for the Food Benefit Score (FBS) on a deterministic 1.0 to 10.0 scale.',
};

export default function HowFBSWorksPage() {
  const formulaRows = [
    {
      factor: 'Base Score',
      rule: 'Standard starting baseline for all packaged foods',
      points: '6.0',
      type: 'base',
      rationale: 'Neutral starting midpoint on the 1.0–10.0 continuum.',
    },
    {
      factor: 'Protein',
      rule: 'Linear 0 → 15 g per 100 g',
      points: '0 to +1.5',
      type: 'positive',
      rationale: 'Rewards tissue synthesis, metabolic satiety, and amino acid density.',
    },
    {
      factor: 'Dietary Fibre',
      rule: 'Linear 0 → 6 g per 100 g',
      points: '0 to +1.5',
      type: 'positive',
      rationale: 'Encourages prebiotic microbiome nourishment and lower glycemic impact.',
    },
    {
      factor: 'Micronutrients',
      rule: '≥ 2 micronutrients each ≥ 15% Indian Adult RDA per 100 g',
      points: '+0.5',
      type: 'positive',
      rationale: 'Recognizes significant contribution to essential vitamins and minerals.',
    },
    {
      factor: 'Whole-Food Ingredients',
      rule: 'Whole grain / nuts / seeds / pulses / fruit / veg is 1st or 2nd ingredient',
      points: '+1.0',
      type: 'positive',
      rationale: 'Rewards unrefined wholesome food matrices over stripped starches.',
    },
    {
      factor: 'Nutrient Density',
      rule: '(Protein g + Fibre g) per 100 kcal, linear 0 → 5',
      points: '0 to +0.5',
      type: 'positive',
      rationale: 'Caloric efficiency: rewarding foods providing high satiety per calorie.',
    },
    {
      factor: 'Added Sugar',
      rule: 'Linear 0 → 20 g per 100 g',
      points: '0 to −1.5',
      type: 'negative',
      rationale: 'Discourages excessive simple sugar loads and insulin spikes.',
    },
    {
      factor: 'Sodium',
      rule: 'Linear 0 → 800 mg (+ excess scaling > 800mg) per 100 g',
      points: '0 to −1.5',
      type: 'negative',
      rationale: 'Penalizes high salt loads exceeding WHO 2000mg daily targets.',
    },
    {
      factor: 'Saturated Fat',
      rule: 'Linear 0 → 10 g per 100 g',
      points: '0 to −1.0',
      type: 'negative',
      rationale: 'Moderates saturated lipid contribution, especially from palm oil.',
    },
    {
      factor: 'Trans Fat',
      rule: '> 0.2 g per 100 g',
      points: '−0.5',
      type: 'negative',
      rationale: 'Strict zero-tolerance penalty for industrial partially hydrogenated fats.',
    },
    {
      factor: 'Ultra-Processing & Additives',
      rule: '≥ 5 additives / refined-ingredient flags (INS emulsifiers, flavours, colours)',
      points: '−0.7',
      type: 'negative',
      rationale: 'Flags hyper-processed industrial formulations that encourage passive overeating.',
    },
    {
      factor: 'Energy Density',
      rule: '> 450 kcal per 100 g',
      points: '−0.3',
      type: 'negative',
      rationale: 'Deduction for calorie-dense foods that offer low satiety per gram.',
    },
    {
      factor: 'Liquid Calorie Anchor',
      rule: 'Beverage with sugar ≥ 8g and negligible protein/fibre (< 0.5g / 0.2g)',
      points: '−2.5',
      type: 'negative',
      rationale: 'Accounts for rapid liquid glucose absorption and zero chewing satiety in sodas.',
    },
  ];

  const bands = [
    { range: '9.0 – 10.0', band: 'Excellent', advice: 'Wholesome everyday staples packed with protein, fibre & minerals.', color: '#15803d' },
    { range: '8.0 – 8.9', band: 'Very Good', advice: 'Nutritious choices with clean, transparent ingredients.', color: '#16a34a' },
    { range: '7.0 – 7.9', band: 'Good', advice: 'Solid balanced foods suitable for frequent meal planning.', color: '#65a30d' },
    { range: '5.0 – 6.9', band: 'Moderate', advice: 'Balanced treats or staples with moderate sugar or sodium.', color: '#d97706' },
    { range: '3.0 – 4.9', band: 'Limited', advice: 'Refined sweet biscuits, noodles, or fried snacks. Limit intake.', color: '#ea580c' },
    { range: '1.0 – 2.9', band: 'Poor', advice: 'Ultra-processed sugary sodas and empty calorie confections. Rare treat.', color: '#dc2626' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Full Transparency
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          How the Food Benefit Score (FBS) Is Calculated
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          The Food Benefit Score is a deterministic, explainable, and scientific metric calibrated for Indian packaged foods. No black-boxes, no arbitrary ratings.
        </p>
      </div>

      {/* Philosophy Callout */}
      <div className="wf-card p-6 sm:p-8 bg-gradient-to-r from-emerald-950 to-stone-900 text-white space-y-4">
        <h2 className="text-xl font-extrabold text-emerald-300">
          The Deterministic Principle
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">
          Every packaged food starts at a baseline of <strong>6.0 / 10.0</strong>. Points are systematically added for whole grains, protein, and dietary fibre, and subtracted for added sugars, high sodium, saturated fats, and industrial ultra-processing. The score is clamped between <strong>1.0 and 10.0</strong> and rounded to 1 decimal place.
        </p>
        <p className="text-xs text-stone-400 italic pt-2 border-t border-stone-800">
          * FBS is an informational score based on label data. It is not medical advice or a guarantee of health outcomes.
        </p>
      </div>

      {/* The Master Formula Table */}
      <section className="wf-card p-6 sm:p-8 bg-white space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            The Exact Scoring Formula Table
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            All calculations are executed per 100 g (or 100 ml) declared on official manufacturer nutrition facts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 bg-stone-50 text-stone-700">
                <th className="p-3 font-bold uppercase tracking-wider">Factor</th>
                <th className="p-3 font-bold uppercase tracking-wider">Rule (per 100 g)</th>
                <th className="p-3 font-bold uppercase tracking-wider text-right">Points</th>
                <th className="p-3 font-bold uppercase tracking-wider">Scientific Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {formulaRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50">
                  <td className="p-3 font-bold text-stone-900 whitespace-nowrap">
                    {row.factor}
                  </td>
                  <td className="p-3 text-stone-700 font-medium">
                    {row.rule}
                  </td>
                  <td className="p-3 text-right font-black whitespace-nowrap">
                    <span
                      className={
                        row.type === 'positive'
                          ? 'text-emerald-700'
                          : row.type === 'negative'
                          ? 'text-rose-700'
                          : 'text-stone-900'
                      }
                    >
                      {row.points}
                    </span>
                  </td>
                  <td className="p-3 text-stone-500 text-[11px] leading-snug">
                    {row.rationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Score Bands Spectrum */}
      <section className="wf-card p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Score Bands & Consumption Guidance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bands.map(b => (
            <div
              key={b.band}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm" style={{ color: b.color }}>
                  {b.band}
                </span>
                <span className="text-xs font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                  {b.range}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {b.advice}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Calibration Anchors Validation */}
      <section className="wf-card p-6 sm:p-8 bg-emerald-50/30 border-emerald-200 space-y-4">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold">Mathematical Calibration Anchors (Verified in Tests)</h2>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed">
          Every release runs automated unit tests (<code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono">npm test</code>) against 5 core calibration anchors to prevent algorithmic drift:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-stone-800">
          <li className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span><strong>Rolled Whole Oats:</strong> Must score ≥ 7.5 (Current: 9.1 / Excellent)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span><strong>Plain Fresh Curd / Paneer:</strong> Must score ≥ 6.5 (Current: 7.8 / Good)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span><strong>Typical Sweet Glucose Biscuit:</strong> Must score 3.5 – 5.5 (Current: 3.7 / Limited)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span><strong>Instant Masala Noodles:</strong> Must score 3.0 – 5.0 (Current: 4.9 / Limited)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span><strong>Sugary Carbonated Soft Drink:</strong> Must score ≤ 3.0 (Current: 2.7 / Poor)</span>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/explore"
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm px-6 py-3 rounded-xl inline-flex items-center gap-2"
        >
          Explore All Food Scores <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
