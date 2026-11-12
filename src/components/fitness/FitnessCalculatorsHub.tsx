'use client';

import React, { useState } from 'react';
import BMICalculator from './BMICalculator';
import BodyFatCalculator from './BodyFatCalculator';
import DailyCaloriesCalculator from './DailyCaloriesCalculator';
import IdealWeightCalculator from './IdealWeightCalculator';
import { Scale, Activity, Flame, Target } from 'lucide-react';

export default function FitnessCalculatorsHub() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'body_fat' | 'calories' | 'ideal_weight'>('bmi');

  const tabs = [
    { id: 'bmi', label: 'BMI Calculator', icon: Scale, description: 'Body Mass Index & Healthy Range' },
    { id: 'body_fat', label: 'Body Fat %', icon: Activity, description: 'US Navy Circumference Method' },
    { id: 'calories', label: 'Daily Calories & TDEE', icon: Flame, description: 'Mifflin-St Jeor & Macros' },
    { id: 'ideal_weight', label: 'Ideal Weight', icon: Target, description: 'BMI & Pharmacological Models' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Calculator Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-2 ${
                isActive
                  ? 'border-[var(--ink)] bg-[var(--surface)] shadow-[4px_4px_0px_var(--ink)] -translate-y-0.5'
                  : 'border-stone-200 bg-[var(--surface-alt)] hover:bg-stone-100 text-stone-600'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`p-2 rounded-xl border border-[var(--ink)]/20 ${isActive ? 'bg-[var(--mint)] text-emerald-950' : 'bg-stone-200 text-stone-700'}`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </span>
                {isActive && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--leaf)] text-white">
                    Active
                  </span>
                )}
              </div>
              <div>
                <h3 className={`font-black text-sm sm:text-base ${isActive ? 'text-[var(--ink)]' : 'text-stone-800'}`}>
                  {tab.label}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Calculator Component */}
      <div className="transition-all duration-200">
        {activeTab === 'bmi' && <BMICalculator />}
        {activeTab === 'body_fat' && <BodyFatCalculator />}
        {activeTab === 'calories' && <DailyCaloriesCalculator />}
        {activeTab === 'ideal_weight' && <IdealWeightCalculator />}
      </div>
    </div>
  );
}
