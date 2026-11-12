'use client';

import React, { useState, useMemo } from 'react';
import { calculateBMI } from '@/lib/calculators/bmi';
import { ftInToCm, cmToFtIn, kgToLbs, lbsToKg } from '@/lib/calculators/unitConversions';
import { HeightUnit, WeightUnit } from '@/types/fitness';
import { Scale, Info, AlertCircle, Sparkles } from 'lucide-react';

export default function BMICalculator() {
  // Unit Toggles
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  // String-backed inputs for natural typing and clearing
  const [heightInput, setHeightInput] = useState<string>('170');
  const [weightInput, setWeightInput] = useState<string>('68');
  const [feetInput, setFeetInput] = useState<string>('5');
  const [inchesInput, setInchesInput] = useState<string>('7');
  const [ageInput, setAgeInput] = useState<string>('28');

  // Handle Height Unit Change
  const handleHeightUnitChange = (unit: HeightUnit) => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    if (unit === 'ft-in') {
      const hCm = parseFloat(heightInput) || 170;
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

  // Handle Weight Unit Change
  const handleWeightUnitChange = (unit: WeightUnit) => {
    if (unit === weightUnit) return;
    setWeightUnit(unit);
    const currentW = parseFloat(weightInput);
    if (!isNaN(currentW) && currentW > 0) {
      if (unit === 'lbs') {
        setWeightInput(String(Math.round(kgToLbs(currentW))));
      } else {
        setWeightInput(String(Math.round(lbsToKg(currentW) * 10) / 10));
      }
    }
  };

  // Resolved metric values for calculation
  const resolvedHeightCm = useMemo(() => {
    if (heightUnit === 'cm') {
      const v = parseFloat(heightInput);
      return !isNaN(v) && v > 0 ? v : 0;
    } else {
      const f = parseFloat(feetInput);
      const i = parseFloat(inchesInput) || 0;
      if (isNaN(f) || f <= 0) return 0;
      return Math.round(ftInToCm(f, i));
    }
  }, [heightUnit, heightInput, feetInput, inchesInput]);

  const resolvedWeightKg = useMemo(() => {
    const v = parseFloat(weightInput);
    if (isNaN(v) || v <= 0) return 0;
    return weightUnit === 'kg' ? v : Math.round(lbsToKg(v) * 10) / 10;
  }, [weightUnit, weightInput]);

  // Compute BMI
  const bmiResult = useMemo(() => {
    if (!resolvedHeightCm || !resolvedWeightKg) return null;
    try {
      const parsedAge = ageInput.trim() ? parseInt(ageInput, 10) : undefined;
      return calculateBMI({
        heightCm: resolvedHeightCm,
        weightKg: resolvedWeightKg,
        age: parsedAge,
      });
    } catch {
      return null;
    }
  }, [resolvedHeightCm, resolvedWeightKg, ageInput]);

  // Color mapping based on category
  const categoryBadgeClass = useMemo(() => {
    if (!bmiResult) return 'bg-stone-200 text-stone-800';
    switch (bmiResult.category) {
      case 'Underweight':
        return 'bg-sky-100 text-sky-800 border-sky-400';
      case 'Normal weight':
        return 'bg-emerald-100 text-emerald-900 border-emerald-500';
      case 'Overweight':
        return 'bg-amber-100 text-amber-900 border-amber-500';
      case 'Obesity Class I':
      case 'Obesity Class II':
      case 'Obesity Class III':
        return 'bg-rose-100 text-rose-900 border-rose-500';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-300';
    }
  }, [bmiResult]);

  // Visual Gauge Indicator Position (between BMI 14 and 42)
  const indicatorPercent = useMemo(() => {
    if (!bmiResult) return 50;
    const minVal = 14;
    const maxVal = 42;
    const clamped = Math.max(minVal, Math.min(maxVal, bmiResult.bmi));
    return ((clamped - minVal) / (maxVal - minVal)) * 100;
  }, [bmiResult]);

  return (
    <div className="card-chunky bg-white p-5 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[var(--mint)] text-emerald-900 border border-[var(--ink)] mb-1">
            <Scale className="w-3.5 h-3.5" /> Calculator 01
          </div>
          <h2 className="t-h2 text-[var(--ink)]">BMI Calculator</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Calculate your Body Mass Index and healthy weight range for your height.
          </p>
        </div>

        {/* Unit Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleHeightUnitChange('cm')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                heightUnit === 'cm' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => handleHeightUnitChange('ft-in')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                heightUnit === 'ft-in' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              ft + in
            </button>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleWeightUnitChange('kg')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                weightUnit === 'kg' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => handleWeightUnitChange('lbs')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                weightUnit === 'lbs' ? 'bg-white text-[var(--ink)] shadow-2xs font-black' : 'text-stone-500'
              }`}
            >
              lbs
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Form Inputs (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Height Input */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
              Height ({heightUnit === 'cm' ? 'centimetres' : 'feet & inches'})
            </label>
            {heightUnit === 'cm' ? (
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  placeholder="e.g. 170"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-base focus:bg-white focus:outline-hidden"
                />
                <span className="absolute right-3.5 top-3 text-xs font-extrabold text-stone-500">cm</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={feetInput}
                    onChange={(e) => setFeetInput(e.target.value)}
                    placeholder="ft"
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
                    placeholder="in"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-base focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-3 text-xs font-extrabold text-stone-500">in</span>
                </div>
              </div>
            )}
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
              Weight ({weightUnit === 'kg' ? 'kilograms' : 'pounds'})
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="350"
                step="0.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="e.g. 68"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-base focus:bg-white focus:outline-hidden"
              />
              <span className="absolute right-3.5 top-3 text-xs font-extrabold text-stone-500">{weightUnit}</span>
            </div>
          </div>

          {/* Age Input (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                Age <span className="text-stone-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] text-stone-500 font-medium">Adult screening (≥ 18 yrs)</span>
            </div>
            <input
              type="number"
              min="2"
              max="120"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              placeholder="e.g. 28"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-base focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Pediatric Notice if Age < 18 */}
          {bmiResult?.isChild && (
            <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Child / Teen Notice:</p>
                <p>{bmiResult.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel (Col 7) */}
        <div className="lg:col-span-7 bg-[var(--surface-alt)] rounded-2xl border-2 border-[var(--ink)] p-5 sm:p-6 space-y-5 min-h-[280px] flex flex-col justify-center">
          {bmiResult ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-stone-500">
                    Your Calculated BMI
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="t-display-huge text-[var(--ink)]">{bmiResult.bmi}</span>
                    <span className="text-xs font-bold text-stone-500">kg/m²</span>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl border-2 font-extrabold text-sm self-start sm:self-auto ${categoryBadgeClass}`}>
                  {bmiResult.category}
                </div>
              </div>

              {/* Visual Horizontal Spectrum Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-extrabold text-stone-600 uppercase">
                  <span>Underweight</span>
                  <span className="text-emerald-700">Normal (18.5 - 24.9)</span>
                  <span>Overweight</span>
                  <span>Obese (≥30)</span>
                </div>

                <div className="relative h-4 w-full rounded-full overflow-hidden border-2 border-[var(--ink)] bg-stone-200 flex">
                  <div style={{ width: '16%' }} className="bg-sky-400" title="Underweight (<18.5)" />
                  <div style={{ width: '23%' }} className="bg-emerald-500" title="Normal (18.5-24.9)" />
                  <div style={{ width: '18%' }} className="bg-amber-400" title="Overweight (25-29.9)" />
                  <div style={{ width: '18%' }} className="bg-orange-500" title="Obese Class I (30-34.9)" />
                  <div style={{ width: '25%' }} className="bg-rose-500" title="Obese Class II/III (≥35)" />
                </div>

                {/* Needle / Pointer */}
                <div className="relative h-4 w-full">
                  <div
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${indicatorPercent}%` }}
                  >
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[var(--ink)]" />
                    <span className="text-[10px] font-black bg-[var(--ink)] text-white px-1.5 py-0.2 rounded-full">
                      {bmiResult.bmi}
                    </span>
                  </div>
                </div>
              </div>

              {/* Healthy Weight Spectrum Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <span className="text-xs text-stone-500 font-bold block">Standard Healthy BMI Weight</span>
                  <p className="text-base font-extrabold text-emerald-800 mt-0.5">
                    {weightUnit === 'kg'
                      ? `${bmiResult.healthyWeightRangeKg.min} – ${bmiResult.healthyWeightRangeKg.max} kg`
                      : `${Math.round(kgToLbs(bmiResult.healthyWeightRangeKg.min))} – ${Math.round(kgToLbs(bmiResult.healthyWeightRangeKg.max))} lbs`}
                  </p>
                  <span className="text-[11px] text-stone-500">Based on standard adult BMI 18.5 – 24.9</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <span className="text-xs text-stone-500 font-bold block">Asian Indian Consensus Context</span>
                  <p className="text-sm font-extrabold text-[var(--ink)] mt-0.5">
                    {bmiResult.asianIndianCategory}
                  </p>
                  <span className="text-[11px] text-stone-500">ICMR / WHO Asian criteria (Overweight ≥ 23.0)</span>
                </div>
              </div>

              {/* Explanatory disclaimer */}
              <div className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-3">
                <Info className="w-3.5 h-3.5 inline mr-1 text-stone-400" />
                {bmiResult.explanation}
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-2">
              <Scale className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="text-sm font-bold text-stone-700">Enter your height and weight above to calculate your BMI.</p>
              <p className="text-xs text-stone-400">Outputs update instantly as you type.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
