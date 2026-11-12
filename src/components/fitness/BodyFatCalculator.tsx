'use client';

import React, { useState, useMemo } from 'react';
import { calculateBodyFat } from '@/lib/calculators/bodyFat';
import { cmToInches, inchesToCm, kgToLbs, lbsToKg } from '@/lib/calculators/unitConversions';
import { BiologicalSex, CircumferenceUnit, WeightUnit } from '@/types/fitness';
import { Activity, Info, AlertTriangle } from 'lucide-react';

export default function BodyFatCalculator() {
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [unit, setUnit] = useState<CircumferenceUnit>('cm');

  // String-backed inputs for natural typing & clearing
  const [ageInput, setAgeInput] = useState<string>('30');
  const [weightInput, setWeightInput] = useState<string>('72');
  const [heightInput, setHeightInput] = useState<string>('175');
  const [neckInput, setNeckInput] = useState<string>('38');
  const [waistInput, setWaistInput] = useState<string>('86');
  const [hipInput, setHipInput] = useState<string>('98'); // For female calculation

  const handleUnitChange = (newUnit: CircumferenceUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);

    const h = parseFloat(heightInput);
    const n = parseFloat(neckInput);
    const w = parseFloat(waistInput);
    const hp = parseFloat(hipInput);
    const wt = parseFloat(weightInput);

    if (newUnit === 'inches') {
      if (!isNaN(h)) setHeightInput(String(Math.round(cmToInches(h) * 10) / 10));
      if (!isNaN(n)) setNeckInput(String(Math.round(cmToInches(n) * 10) / 10));
      if (!isNaN(w)) setWaistInput(String(Math.round(cmToInches(w) * 10) / 10));
      if (!isNaN(hp)) setHipInput(String(Math.round(cmToInches(hp) * 10) / 10));
      if (!isNaN(wt)) setWeightInput(String(Math.round(kgToLbs(wt))));
    } else {
      if (!isNaN(h)) setHeightInput(String(Math.round(inchesToCm(h))));
      if (!isNaN(n)) setNeckInput(String(Math.round(inchesToCm(n) * 10) / 10));
      if (!isNaN(w)) setWaistInput(String(Math.round(inchesToCm(w) * 10) / 10));
      if (!isNaN(hp)) setHipInput(String(Math.round(inchesToCm(hp) * 10) / 10));
      if (!isNaN(wt)) setWeightInput(String(Math.round(lbsToKg(wt) * 10) / 10));
    }
  };

  // Convert to metric values for calculation
  const resolvedMetrics = useMemo(() => {
    const age = parseInt(ageInput, 10);
    const rawW = parseFloat(weightInput);
    const rawH = parseFloat(heightInput);
    const rawN = parseFloat(neckInput);
    const rawWaist = parseFloat(waistInput);
    const rawHip = parseFloat(hipInput);

    if (
      isNaN(age) || age <= 0 ||
      isNaN(rawW) || rawW <= 0 ||
      isNaN(rawH) || rawH <= 0 ||
      isNaN(rawN) || rawN <= 0 ||
      isNaN(rawWaist) || rawWaist <= 0
    ) {
      return null;
    }

    if (sex === 'female' && (isNaN(rawHip) || rawHip <= 0)) {
      return null;
    }

    const weightKg = unit === 'cm' ? rawW : lbsToKg(rawW);
    const heightCm = unit === 'cm' ? rawH : inchesToCm(rawH);
    const neckCm = unit === 'cm' ? rawN : inchesToCm(rawN);
    const waistCm = unit === 'cm' ? rawWaist : inchesToCm(rawWaist);
    const hipCm = unit === 'cm' ? rawHip : inchesToCm(rawHip);

    return { age, weightKg, heightCm, neckCm, waistCm, hipCm };
  }, [sex, unit, ageInput, weightInput, heightInput, neckInput, waistInput, hipInput]);

  // Validation error state
  const validationError = useMemo(() => {
    if (!resolvedMetrics) return null;
    const { waistCm, neckCm, hipCm } = resolvedMetrics;

    if (sex === 'male' && waistCm <= neckCm) {
      return 'Waist circumference must be larger than neck circumference for the US Navy equation.';
    }
    if (sex === 'female' && waistCm + hipCm <= neckCm) {
      return 'Combined waist and hip circumference must exceed neck circumference.';
    }
    return null;
  }, [sex, resolvedMetrics]);

  // Compute body fat
  const result = useMemo(() => {
    if (!resolvedMetrics || validationError) return null;
    try {
      return calculateBodyFat({
        sex,
        age: resolvedMetrics.age,
        heightCm: resolvedMetrics.heightCm,
        weightKg: resolvedMetrics.weightKg,
        waistCm: resolvedMetrics.waistCm,
        neckCm: resolvedMetrics.neckCm,
        hipCm: sex === 'female' ? resolvedMetrics.hipCm : undefined,
      });
    } catch {
      return null;
    }
  }, [sex, resolvedMetrics, validationError]);

  return (
    <div className="card-chunky bg-white p-5 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[var(--mango)]/20 text-[var(--ink)] border border-[var(--ink)] mb-1">
            <Activity className="w-3.5 h-3.5 text-amber-700" /> Calculator 02
          </div>
          <h2 className="t-h2 text-[var(--ink)]">Body Fat Percentage Calculator</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            US Navy circumference method estimating body composition, fat mass, and lean mass.
          </p>
        </div>

        {/* Units & Sex Selector */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Sex toggle */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSex('male')}
              className={`px-3 py-1 rounded-lg transition-all ${
                sex === 'male' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setSex('female')}
              className={`px-3 py-1 rounded-lg transition-all ${
                sex === 'female' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              Female
            </button>
          </div>

          {/* Metric / Imperial toggle */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleUnitChange('cm')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'cm' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              cm / kg
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('inches')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'inches' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              in / lbs
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Input Controls (Col 5) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Age & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                Age
              </label>
              <input
                type="number"
                min="18"
                max="100"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                Weight ({unit === 'cm' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                min="20"
                max="350"
                step="0.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder={unit === 'cm' ? 'e.g. 72' : 'e.g. 158'}
                className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
              Height ({unit === 'cm' ? 'cm' : 'inches'})
            </label>
            <input
              type="number"
              min="50"
              max="250"
              value={heightInput}
              onChange={(e) => setHeightInput(e.target.value)}
              placeholder={unit === 'cm' ? 'e.g. 175' : 'e.g. 69'}
              className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Neck Circumference */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                Neck ({unit === 'cm' ? 'cm' : 'inches'})
              </label>
              <span className="text-[10px] text-stone-500">Below Adam&apos;s apple</span>
            </div>
            <input
              type="number"
              min="15"
              max="70"
              step="0.5"
              value={neckInput}
              onChange={(e) => setNeckInput(e.target.value)}
              placeholder={unit === 'cm' ? 'e.g. 38' : 'e.g. 15'}
              className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Waist Circumference */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                Waist ({unit === 'cm' ? 'cm' : 'inches'})
              </label>
              <span className="text-[10px] text-stone-500">At navel level</span>
            </div>
            <input
              type="number"
              min="30"
              max="180"
              step="0.5"
              value={waistInput}
              onChange={(e) => setWaistInput(e.target.value)}
              placeholder={unit === 'cm' ? 'e.g. 86' : 'e.g. 34'}
              className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Hip Circumference (Females Only) */}
          {sex === 'female' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Hip ({unit === 'cm' ? 'cm' : 'inches'}) <span className="text-emerald-700 font-black">*Required</span>
                </label>
                <span className="text-[10px] text-stone-500">At widest circumference</span>
              </div>
              <input
                type="number"
                min="40"
                max="200"
                step="0.5"
                value={hipInput}
                onChange={(e) => setHipInput(e.target.value)}
                placeholder={unit === 'cm' ? 'e.g. 98' : 'e.g. 38.5'}
                className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
              />
            </div>
          )}

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex gap-2 items-center">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Results Panel (Col 7) */}
        <div className="lg:col-span-7 bg-[var(--surface-alt)] rounded-2xl border-2 border-[var(--ink)] p-5 sm:p-6 space-y-5 min-h-[280px] flex flex-col justify-center">
          {result ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-stone-500">
                    Estimated Body Fat
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="t-display-huge text-[var(--ink)]">{result.bodyFatPercentage}</span>
                    <span className="text-xl font-black text-stone-500">%</span>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl border-2 border-[var(--ink)] bg-white font-extrabold text-sm self-start sm:self-auto text-[var(--ink)] shadow-2xs">
                  {result.category}
                </div>
              </div>

              {/* Composition Breakdown: Fat Mass vs Lean Mass */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>Fat Mass: {unit === 'cm' ? `${result.fatMassKg} kg` : `${Math.round(kgToLbs(result.fatMassKg))} lbs`} ({result.bodyFatPercentage}%)</span>
                  <span>Lean Mass: {unit === 'cm' ? `${result.leanMassKg} kg` : `${Math.round(kgToLbs(result.leanMassKg))} lbs`} ({(100 - result.bodyFatPercentage).toFixed(1)}%)</span>
                </div>

                {/* Stacked bar */}
                <div className="h-4 w-full rounded-full border-2 border-[var(--ink)] bg-stone-200 overflow-hidden flex">
                  <div
                    style={{ width: `${result.bodyFatPercentage}%` }}
                    className="bg-amber-400"
                    title={`Fat Mass: ${result.bodyFatPercentage}%`}
                  />
                  <div
                    style={{ width: `${100 - result.bodyFatPercentage}%` }}
                    className="bg-emerald-500"
                    title={`Lean Body Mass: ${(100 - result.bodyFatPercentage).toFixed(1)}%`}
                  />
                </div>
              </div>

              {/* ACE Guidelines Reference Table */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                  American Council on Exercise (ACE) Classification ({sex})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <span className="text-[10px] text-stone-500 block font-bold">Essential</span>
                    <span className="font-extrabold">{sex === 'male' ? '2 – 5%' : '10 – 13%'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <span className="text-[10px] text-stone-500 block font-bold">Athletes</span>
                    <span className="font-extrabold">{sex === 'male' ? '6 – 13%' : '14 – 20%'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="text-[10px] text-emerald-700 block font-bold">Fitness</span>
                    <span className="font-extrabold">{sex === 'male' ? '14 – 17%' : '21 – 24%'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <span className="text-[10px] text-stone-500 block font-bold">Average</span>
                    <span className="font-extrabold">{sex === 'male' ? '18 – 24%' : '25 – 31%'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-stone-500 block font-bold">Obese</span>
                    <span className="font-extrabold">{sex === 'male' ? '≥ 25%' : '≥ 32%'}</span>
                  </div>
                </div>
              </div>

              {/* Disclaimers */}
              <div className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-3">
                <Info className="w-3.5 h-3.5 inline mr-1 text-stone-400" />
                {result.explanation}
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-2">
              <Activity className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="text-sm font-bold text-stone-700">Enter your measurements to calculate body fat percentage.</p>
              <p className="text-xs text-stone-400">All fields must be valid positive numbers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
