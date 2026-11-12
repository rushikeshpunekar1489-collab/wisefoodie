'use client';

import React, { useState, useMemo } from 'react';
import { calculateDailyCalories } from '@/lib/calculators/dailyCalories';
import { BiologicalSex, ActivityLevel } from '@/types/fitness';
import { Flame, Info, Sliders, ShieldCheck, Dumbbell, TrendingDown, Target, TrendingUp } from 'lucide-react';

export default function DailyCaloriesCalculator() {
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [ageInput, setAgeInput] = useState<string>('27');
  const [heightInput, setHeightInput] = useState<string>('172');
  const [weightInput, setWeightInput] = useState<string>('70');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Goal tab for macro preview
  const [selectedGoal, setSelectedGoal] = useState<'maintenance' | 'loss' | 'gain'>('maintenance');

  // Macro preset
  const [macroPreset, setMacroPreset] = useState<'balanced' | 'high_protein' | 'low_carb' | 'custom'>('balanced');
  const [customCarbPct, setCustomCarbPct] = useState<number>(50);
  const [customProteinPct, setCustomProteinPct] = useState<number>(25);
  const [customFatPct, setCustomFatPct] = useState<number>(25);

  const parsedAge = parseFloat(ageInput);
  const parsedHeight = parseFloat(heightInput);
  const parsedWeight = parseFloat(weightInput);

  const result = useMemo(() => {
    if (isNaN(parsedAge) || parsedAge <= 0 || isNaN(parsedHeight) || parsedHeight <= 0 || isNaN(parsedWeight) || parsedWeight <= 0) {
      return null;
    }
    try {
      return calculateDailyCalories({
        age: parsedAge,
        sex,
        heightCm: parsedHeight,
        weightKg: parsedWeight,
        activityLevel,
        macroPreset,
        customCarbPct,
        customProteinPct,
        customFatPct,
      });
    } catch {
      return null;
    }
  }, [parsedAge, sex, parsedHeight, parsedWeight, activityLevel, macroPreset, customCarbPct, customProteinPct, customFatPct]);

  // Selected calories and macros for current goal
  const currentGoalData = useMemo(() => {
    if (!result) return null;
    if (selectedGoal === 'loss') {
      return {
        calories: result.weightLossCalories,
        label: 'Healthy Weight Loss Target (~0.5 kg/week deficit)',
        macros: result.macros.weightLoss,
      };
    }
    if (selectedGoal === 'gain') {
      return {
        calories: result.weightGainCalories,
        label: 'Controlled Muscle Gain (~0.25 - 0.35 kg/week surplus)',
        macros: result.macros.weightGain,
      };
    }
    return {
      calories: result.maintenanceCalories,
      label: 'Energy Equilibrium (Zero weight change)',
      macros: result.macros.maintenance,
    };
  }, [result, selectedGoal]);

  return (
    <div className="card-chunky bg-white p-5 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-[var(--ink)] mb-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" /> Calculator 03
          </div>
          <h2 className="t-h2 text-[var(--ink)]">Daily Calorie & Macro Calculator</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Mifflin-St Jeor formula calculating BMR, TDEE, and customized macronutrient targets.
          </p>
        </div>

        {/* Biological sex selector */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-bold self-start sm:self-auto">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Input Parameters (Col 5) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                Age
              </label>
              <input
                type="number"
                min="15"
                max="110"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                placeholder="27"
                className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min="90"
                max="240"
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                placeholder="172"
                className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                min="30"
                max="250"
                step="0.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="70"
                className="w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-[var(--ink)] bg-[var(--surface-alt)] font-bold text-sm focus:bg-white focus:outline-hidden"
            >
              <option value="sedentary">Sedentary (desk job, little to no exercise)</option>
              <option value="light">Lightly Active (light exercise 1–3 days/wk)</option>
              <option value="moderate">Moderately Active (exercise 3–5 days/wk)</option>
              <option value="very_active">Very Active (hard exercise 6–7 days/wk)</option>
              <option value="extra_active">Extra Active (intense training, physical labor)</option>
            </select>
          </div>

          {/* Macro Profile Preset */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
              Macronutrient Ratio Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMacroPreset('balanced')}
                className={`p-2 rounded-xl border-2 text-xs font-extrabold transition-all text-center ${
                  macroPreset === 'balanced'
                    ? 'border-[var(--ink)] bg-[var(--leaf)] text-white shadow-2xs'
                    : 'border-stone-200 bg-[var(--surface-alt)] text-stone-700'
                }`}
              >
                Balanced
                <span className="block text-[10px] font-normal opacity-85">50C / 25P / 25F</span>
              </button>

              <button
                type="button"
                onClick={() => setMacroPreset('high_protein')}
                className={`p-2 rounded-xl border-2 text-xs font-extrabold transition-all text-center ${
                  macroPreset === 'high_protein'
                    ? 'border-[var(--ink)] bg-[var(--leaf)] text-white shadow-2xs'
                    : 'border-stone-200 bg-[var(--surface-alt)] text-stone-700'
                }`}
              >
                High Protein
                <span className="block text-[10px] font-normal opacity-85">35C / 40P / 25F</span>
              </button>

              <button
                type="button"
                onClick={() => setMacroPreset('low_carb')}
                className={`p-2 rounded-xl border-2 text-xs font-extrabold transition-all text-center ${
                  macroPreset === 'low_carb'
                    ? 'border-[var(--ink)] bg-[var(--leaf)] text-white shadow-2xs'
                    : 'border-stone-200 bg-[var(--surface-alt)] text-stone-700'
                }`}
              >
                Low Carb
                <span className="block text-[10px] font-normal opacity-85">20C / 40P / 40F</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel (Col 7) */}
        <div className="lg:col-span-7 bg-[var(--surface-alt)] rounded-2xl border-2 border-[var(--ink)] p-5 sm:p-6 space-y-5">
          {result && currentGoalData ? (
            <>
              {/* BMR and TDEE Stat Badges */}
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                    Basal Metabolic Rate (BMR)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-[var(--ink)]">{result.bmr}</span>
                    <span className="text-xs font-bold text-stone-500">kcal/day</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Calories burned at absolute rest</span>
                </div>

                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                    Total Daily Energy (TDEE)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-emerald-800">{result.tdee}</span>
                    <span className="text-xs font-bold text-stone-500">kcal/day</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Maintenance with current activity</span>
                </div>
              </div>

              {/* Goal Selector Tabs */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-600 block mb-2">
                  Select Target Caloric Goal
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGoal('loss')}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      selectedGoal === 'loss'
                        ? 'border-[var(--ink)] bg-white shadow-2xs'
                        : 'border-transparent bg-stone-200/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-black text-rose-800">
                      <TrendingDown className="w-3.5 h-3.5" /> Lose Fat
                    </div>
                    <span className="text-base font-black text-[var(--ink)] block mt-0.5">
                      {result.weightLossCalories} <span className="text-[10px] font-bold">kcal</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGoal('maintenance')}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      selectedGoal === 'maintenance'
                        ? 'border-[var(--ink)] bg-white shadow-2xs'
                        : 'border-transparent bg-stone-200/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-black text-emerald-800">
                      <Target className="w-3.5 h-3.5" /> Maintain
                    </div>
                    <span className="text-base font-black text-[var(--ink)] block mt-0.5">
                      {result.maintenanceCalories} <span className="text-[10px] font-bold">kcal</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGoal('gain')}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      selectedGoal === 'gain'
                        ? 'border-[var(--ink)] bg-white shadow-2xs'
                        : 'border-transparent bg-stone-200/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-black text-amber-800">
                      <TrendingUp className="w-3.5 h-3.5" /> Build Muscle
                    </div>
                    <span className="text-base font-black text-[var(--ink)] block mt-0.5">
                      {result.weightGainCalories} <span className="text-[10px] font-bold">kcal</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Target Calories and Macro Breakdown */}
              <div className="bg-white rounded-xl border-2 border-stone-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-stone-700">
                    {currentGoalData.label}
                  </span>
                  <span className="text-xs font-black bg-stone-100 px-2 py-0.5 rounded-md text-[var(--ink)]">
                    {currentGoalData.calories} kcal/day
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  {/* Protein */}
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] uppercase font-bold text-blue-800 block">Protein</span>
                    <span className="text-lg font-black text-blue-900 block mt-0.5">
                      {currentGoalData.macros.proteinG}g
                    </span>
                    <span className="text-[10px] text-blue-700">
                      {currentGoalData.macros.proteinKcal} kcal ({currentGoalData.macros.proteinPct}%)
                    </span>
                  </div>

                  {/* Carbs */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Carbs</span>
                    <span className="text-lg font-black text-emerald-900 block mt-0.5">
                      {currentGoalData.macros.carbG}g
                    </span>
                    <span className="text-[10px] text-emerald-700">
                      {currentGoalData.macros.carbKcal} kcal ({currentGoalData.macros.carbPct}%)
                    </span>
                  </div>

                  {/* Fat */}
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Fats</span>
                    <span className="text-lg font-black text-amber-900 block mt-0.5">
                      {currentGoalData.macros.fatG}g
                    </span>
                    <span className="text-[10px] text-amber-700">
                      {currentGoalData.macros.fatKcal} kcal ({currentGoalData.macros.fatPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety floor notice */}
              <div className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-3">
                <Info className="w-3.5 h-3.5 inline mr-1 text-stone-400" />
                {result.explanation}
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-sm text-stone-500 font-medium">
              Enter age, height, and weight to calculate energy expenditure.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
