'use client';

import React, { useState, useMemo } from 'react';
import { calculateIdealWeight } from '@/lib/calculators/idealWeight';
import { cmToFtIn, ftInToCm, kgToLbs, lbsToKg } from '@/lib/calculators/unitConversions';
import { BiologicalSex, HeightUnit, WeightUnit } from '@/types/fitness';
import { Target, Info, CheckCircle2, BookOpen } from 'lucide-react';

export default function IdealWeightCalculator() {
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  const [heightInput, setHeightInput] = useState<string>('172');
  const [feetInput, setFeetInput] = useState<string>('5');
  const [inchesInput, setInchesInput] = useState<string>('8');

  const handleHeightUnitChange = (unit: HeightUnit) => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    if (unit === 'ft-in') {
      const hCm = parseFloat(heightInput) || 172;
      const { feet: f, inches: i } = cmToFtIn(hCm);
      setFeetInput(String(f));
      setInchesInput(String(i));
    } else {
      const f = parseFloat(feetInput) || 0;
      const i = parseFloat(inchesInput) || 0;
      const hCm = Math.round(ftInToCm(f, i));
      setHeightInput(String(hCm));
    }
  };

  const parsedHeightCm = useMemo(() => {
    if (heightUnit === 'cm') {
      const h = parseFloat(heightInput);
      return !isNaN(h) && h > 0 ? h : null;
    } else {
      const f = parseFloat(feetInput);
      const i = parseFloat(inchesInput);
      if (isNaN(f) && isNaN(i)) return null;
      return ftInToCm(isNaN(f) ? 0 : f, isNaN(i) ? 0 : i);
    }
  }, [heightUnit, heightInput, feetInput, inchesInput]);

  const result = useMemo(() => {
    if (!parsedHeightCm) return null;
    try {
      return calculateIdealWeight({ sex, heightCm: parsedHeightCm });
    } catch {
      return null;
    }
  }, [sex, parsedHeightCm]);

  const formatWeight = (kg: number | null) => {
    if (kg === null || kg === undefined) return 'N/A';
    if (weightUnit === 'lbs') {
      return `${Math.round(kgToLbs(kg))} lbs`;
    }
    return `${kg} kg`;
  };

  return (
    <div className="card-chunky bg-white p-5 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-100 text-sky-900 border border-[var(--ink)] mb-1">
            <Target className="w-3.5 h-3.5 text-sky-700" /> Calculator 04
          </div>
          <h2 className="t-h2 text-[var(--ink)]">Ideal Body Weight Calculator</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Healthy BMI weight spectrum alongside Devine, Robinson, Miller, and Hamwi pharmacological models.
          </p>
        </div>

        {/* Controls */}
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

          {/* Unit selector */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleHeightUnitChange('cm')}
              className={`px-2 py-1 rounded-lg transition-all ${
                heightUnit === 'cm' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => handleHeightUnitChange('ft-in')}
              className={`px-2 py-1 rounded-lg transition-all ${
                heightUnit === 'ft-in' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              ft+in
            </button>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => setWeightUnit('kg')}
              className={`px-2 py-1 rounded-lg transition-all ${
                weightUnit === 'kg' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => setWeightUnit('lbs')}
              className={`px-2 py-1 rounded-lg transition-all ${
                weightUnit === 'lbs' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              lbs
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Input Form (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
              Height ({heightUnit === 'cm' ? 'centimetres' : 'feet and inches'})
            </label>
            {heightUnit === 'cm' ? (
              <div className="relative">
                <input
                  type="number"
                  min="120"
                  max="240"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  placeholder="172"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-base focus:bg-white focus:outline-hidden"
                />
                <span className="absolute right-3.5 top-3 text-xs font-extrabold text-stone-500">cm</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={feetInput}
                    onChange={(e) => setFeetInput(e.target.value)}
                    placeholder="5"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-base focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-3 text-xs font-extrabold text-stone-500">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={inchesInput}
                    onChange={(e) => setInchesInput(e.target.value)}
                    placeholder="8"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-base focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-3 text-xs font-extrabold text-stone-500">in</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-extrabold block">Clinical Consensus Note:</span>
            <p>
              Health authorities do not recognise any single number as universally &quot;ideal&quot;. Healthy weight depends on individual frame size, muscle volume, age, and genetic background.
            </p>
          </div>
        </div>

        {/* Results Panel (Col 7) */}
        <div className="lg:col-span-7 bg-[var(--surface-alt)] rounded-2xl border-2 border-[var(--ink)] p-5 sm:p-6 space-y-5">
          {result ? (
            <>
              {/* Primary Recommended Spectrum */}
              <div className="p-4 rounded-xl bg-white border-2 border-[var(--ink)] shadow-2xs space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Recommended Healthy Weight Spectrum
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[var(--ink)]">
                  {formatWeight(result.healthyBmiRangeKg.min)} – {formatWeight(result.healthyBmiRangeKg.max)}
                </div>
                <span className="text-xs text-stone-500 block">
                  Based on WHO adult healthy BMI index (18.5 – 24.9 kg/m²) for your height ({Math.round(parsedHeightCm || 0)} cm)
                </span>
              </div>

              {/* Historical Formula Comparison Table */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                  Clinical Formula Estimates
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold block">Devine (1974)</span>
                    <span className="text-sm font-extrabold text-[var(--ink)] block mt-0.5">
                      {formatWeight(result.devineKg)}
                    </span>
                    <span className="text-[9px] text-stone-400">Pharmacology standard</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold block">Robinson (1983)</span>
                    <span className="text-sm font-extrabold text-[var(--ink)] block mt-0.5">
                      {formatWeight(result.robinsonKg)}
                    </span>
                    <span className="text-[9px] text-stone-400">Modified Metropolitan</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold block">Miller (1983)</span>
                    <span className="text-sm font-extrabold text-[var(--ink)] block mt-0.5">
                      {formatWeight(result.millerKg)}
                    </span>
                    <span className="text-[9px] text-stone-400">Higher muscle baseline</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold block">Hamwi (1964)</span>
                    <span className="text-sm font-extrabold text-[var(--ink)] block mt-0.5">
                      {formatWeight(result.hamwiKg)}
                    </span>
                    <span className="text-[9px] text-stone-400">Rule of 5-foot</span>
                  </div>
                </div>
              </div>

              {/* Formula explanation */}
              <div className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-3">
                <Info className="w-3.5 h-3.5 inline mr-1 text-stone-400" />
                {result.explanation}
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-sm text-stone-500 font-medium">
              Enter height to view healthy weight estimates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
