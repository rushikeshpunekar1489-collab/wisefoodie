'use client';

import React, { useState } from 'react';
import type { SmartConsumptionAnalysis } from '../modules/smart-consumption/types';
import {
  Sparkles,
  ChevronDown,
  Clock,
  Utensils,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HeartPulse,
} from 'lucide-react';

interface SmartConsumptionCardProps {
  analysis: SmartConsumptionAnalysis;
}

export default function SmartConsumptionCard({ analysis }: SmartConsumptionCardProps) {
  const [openSection, setOpenSection] = useState<'recommended' | 'bestWay' | 'harmReduction' | 'combinations' | 'avoid' | null>('recommended');
  const [showWhyRating, setShowWhyRating] = useState(false);

  const toggleSection = (section: 'recommended' | 'bestWay' | 'harmReduction' | 'combinations' | 'avoid') => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const { classification, recommendedConsumption, bestWayToConsume, harmReduction, smartFoodCombinations, thingsToAvoid, dailyContributions } = analysis;

  return (
    <div className="bubble-card space-y-6 bg-[var(--surface)]">
      {/* 1. Header with Badge & Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[var(--ink)]/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-[var(--leaf)]" />
            <h3 className="t-h3 text-[var(--ink)]">Smart Consumption</h3>
          </div>
          <p className="text-xs font-semibold opacity-75">
            Scientific, practical advice on how to integrate this food into your routine.
          </p>
        </div>

        {/* Classification Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span
            className="chip text-xs font-black uppercase tracking-wider py-1 px-3 border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]"
            style={{ backgroundColor: classification.badgeColor, color: 'var(--ink)' }}
          >
            {classification.verdict} Choice
          </span>
        </div>
      </div>

      {/* 2. Top Summary & "Why this rating?" Toggle */}
      <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-sm font-bold text-[var(--ink)]">
            {classification.headline}
          </p>
          <button
            type="button"
            onClick={() => setShowWhyRating(!showWhyRating)}
            aria-expanded={showWhyRating}
            className="text-xs font-black text-[var(--leaf)] hover:underline flex items-center gap-1 shrink-0 min-h-[44px] min-w-[44px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showWhyRating ? 'Hide criteria' : 'Why this rating?'}
          </button>
        </div>

        {/* "Why this rating?" Expanded Panel */}
        {showWhyRating && (
          <div className="pt-3 border-t border-[var(--ink)]/15 space-y-2 text-xs">
            <p className="font-extrabold text-[var(--ink)] uppercase text-[10px] tracking-wider opacity-70">
              Deterministic Triggers (ICMR-NIN & WHO Reference Limits)
            </p>
            <ul className="space-y-1 ml-4 list-disc font-semibold opacity-85">
              {classification.triggers.map((trig, idx) => (
                <li key={idx}>{trig}</li>
              ))}
            </ul>
            <p className="text-[11px] opacity-65 italic pt-1">{classification.summary}</p>
          </div>
        )}

        {/* Daily Limits Contribution Progress */}
        <div className="pt-2">
          <span className="text-[11px] font-black uppercase tracking-wider opacity-70 block mb-2">
            Per-Serving Contribution to Daily Limits (2,000 kcal diet)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dailyContributions.map((dc) => (
              <div
                key={dc.nutrient}
                className="p-2.5 rounded-xl bg-[var(--surface)] border-2 border-[var(--ink)] space-y-1 text-center"
              >
                <div className="text-[10px] font-black uppercase opacity-60 truncate">
                  {dc.nutrient}
                </div>
                <div className={`text-sm font-black ${dc.isHigh ? 'text-[var(--tomato)]' : 'text-[var(--ink)]'}`}>
                  {dc.percentageOfLimit !== null ? `${dc.percentageOfLimit}%` : 'N/A'}
                </div>
                <div className="text-[10px] font-semibold opacity-70">
                  {dc.amountPerServing !== null ? `${dc.amountPerServing} ${dc.unit}` : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Interactive Accordion Cards */}
      <div className="space-y-3">
        {/* A. Recommended Consumption */}
        <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)] overflow-hidden shadow-[2px_2px_0px_var(--ink)]">
          <button
            type="button"
            onClick={() => toggleSection('recommended')}
            aria-expanded={openSection === 'recommended'}
            className="w-full p-4 flex items-center justify-between text-left font-black text-sm bg-[var(--surface-alt)] hover:bg-[var(--surface-alt)]/80 transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[var(--leaf)]" />
              <span>Recommended Consumption & Portion</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'recommended' ? 'rotate-180' : ''}`} />
          </button>
          {openSection === 'recommended' && (
            <div className="p-4 space-y-3 text-xs border-t-2 border-[var(--ink)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/20">
                  <span className="font-bold opacity-70 block mb-0.5">Serving Size:</span>
                  <span className="font-extrabold text-sm text-[var(--ink)]">
                    {recommendedConsumption.servingSizeValue} {recommendedConsumption.servingSizeUnit}
                    {recommendedConsumption.isServingEstimated && (
                      <span className="ml-1.5 chip text-[9px] py-0 px-1 bg-[var(--mango)]">Estimated</span>
                    )}
                  </span>
                  {recommendedConsumption.caloriesPerServing !== null && (
                    <span className="block opacity-60 mt-0.5 font-semibold">
                      (~{recommendedConsumption.caloriesPerServing} kcal per serving)
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/20">
                  <span className="font-bold opacity-70 block mb-0.5">Suggested Frequency:</span>
                  <span className="font-extrabold text-sm text-[var(--leaf)]">
                    {recommendedConsumption.suggestedFrequency}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--ink)]/15">
                <span className="font-black text-[var(--ink)] block mb-1">Portion Control Tip:</span>
                <p className="font-semibold opacity-85 leading-relaxed">{recommendedConsumption.portionTip}</p>
              </div>
            </div>
          )}
        </div>

        {/* B. Best Way to Consume */}
        <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)] overflow-hidden shadow-[2px_2px_0px_var(--ink)]">
          <button
            type="button"
            onClick={() => toggleSection('bestWay')}
            aria-expanded={openSection === 'bestWay'}
            className="w-full p-4 flex items-center justify-between text-left font-black text-sm bg-[var(--surface-alt)] hover:bg-[var(--surface-alt)]/80 transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <Utensils className="w-4 h-4 text-[var(--sky)]" />
              <span>Best Way to Consume (Timing & Prep)</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'bestWay' ? 'rotate-180' : ''}`} />
          </button>
          {openSection === 'bestWay' && (
            <div className="p-4 space-y-3 text-xs border-t-2 border-[var(--ink)]">
              <p className="font-semibold text-xs opacity-75">{bestWayToConsume.perServingContext}</p>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/15">
                  <span className="font-black text-[var(--ink)] block mb-1">Ideal Timing:</span>
                  <p className="font-semibold opacity-85 leading-relaxed">{bestWayToConsume.timing}</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/15">
                  <span className="font-black text-[var(--ink)] block mb-1">Preparation Tip:</span>
                  <p className="font-semibold opacity-85 leading-relaxed">{bestWayToConsume.preparation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* C. Harm Reduction */}
        <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)] overflow-hidden shadow-[2px_2px_0px_var(--ink)]">
          <button
            type="button"
            onClick={() => toggleSection('harmReduction')}
            aria-expanded={openSection === 'harmReduction'}
            className="w-full p-4 flex items-center justify-between text-left font-black text-sm bg-[var(--surface-alt)] hover:bg-[var(--surface-alt)]/80 transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-4 h-4 text-[var(--mango)]" />
              <span>Realistic Harm Reduction</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'harmReduction' ? 'rotate-180' : ''}`} />
          </button>
          {openSection === 'harmReduction' && (
            <div className="p-4 space-y-3 text-xs border-t-2 border-[var(--ink)]">
              <p className="font-semibold text-[11px] opacity-75">
                Practical methods to help balance the meal without completely eliminating foods you enjoy:
              </p>
              <ul className="space-y-2">
                {harmReduction.strategies.map((strat, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/15">
                    <CheckCircle2 className="w-4 h-4 text-[var(--leaf)] shrink-0 mt-0.5" />
                    <span className="font-semibold text-[var(--ink)] leading-relaxed">{strat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* D. Smart Food Combinations */}
        {smartFoodCombinations.length > 0 && (
          <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)] overflow-hidden shadow-[2px_2px_0px_var(--ink)]">
            <button
              type="button"
              onClick={() => toggleSection('combinations')}
              aria-expanded={openSection === 'combinations'}
              className="w-full p-4 flex items-center justify-between text-left font-black text-sm bg-[var(--surface-alt)] hover:bg-[var(--surface-alt)]/80 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[var(--mint)]" />
                <span>Smart Food Combinations</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'combinations' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'combinations' && (
              <div className="p-4 space-y-2.5 text-xs border-t-2 border-[var(--ink)]">
                {smartFoodCombinations.map((combo, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/15">
                    <span className="font-extrabold text-[var(--ink)] block text-xs mb-0.5">
                      + {combo.food}
                    </span>
                    <span className="font-semibold opacity-75 leading-relaxed block">
                      {combo.reason}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* E. Things to Avoid / Be Careful With */}
        {thingsToAvoid.length > 0 && (
          <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--surface)] overflow-hidden shadow-[2px_2px_0px_var(--ink)]">
            <button
              type="button"
              onClick={() => toggleSection('avoid')}
              aria-expanded={openSection === 'avoid'}
              className="w-full p-4 flex items-center justify-between text-left font-black text-sm bg-[var(--surface-alt)] hover:bg-[var(--surface-alt)]/80 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[var(--tomato)]" />
                <span>Things to Keep in Mind</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'avoid' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'avoid' && (
              <div className="p-4 space-y-2 text-xs border-t-2 border-[var(--ink)]">
                {thingsToAvoid.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--ink)]/15">
                    <AlertTriangle className="w-4 h-4 text-[var(--tomato)] shrink-0 mt-0.5" />
                    <span className="font-semibold text-[var(--ink)] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Module Footer Tagline */}
      <div className="pt-2 text-center border-t border-[var(--ink)]/10 text-xs font-semibold opacity-60">
        &ldquo;Eat what you enjoy. Understand what you consume. Know what you pay for. Make smarter food choices.&rdquo;
      </div>
    </div>
  );
}
