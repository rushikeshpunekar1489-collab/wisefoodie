'use client';

import React, { useState, useMemo } from 'react';
import type { DiaryEntry, SimpleGoal } from '@/lib/diary';
import { aggregateDayNutrients, GOAL_TARGETS, toSafeDateString } from '@/lib/diary';

interface WeekTrendChartProps {
  entries: DiaryEntry[];
  currentDate: string;
  onSelectDate: (d: string) => void;
  goal: SimpleGoal;
}

type MetricType = 'protein' | 'sugar' | 'sodium' | 'calories';

export default function WeekTrendChart({
  entries,
  currentDate,
  onSelectDate,
  goal,
}: WeekTrendChartProps) {
  const [metric, setMetric] = useState<MetricType>('protein');

  const refTargets = GOAL_TARGETS[goal];

  // Generate 7 days leading up to currentDate
  const weekDays = useMemo(() => {
    const list: { dateStr: string; label: string; daySummary: ReturnType<typeof aggregateDayNutrients> }[] = [];
    const safeCurrent = toSafeDateString(currentDate);
    const base = new Date(safeCurrent);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const dateStr = toSafeDateString(d);
      const dayEntries = entries.filter((e) => e.date === dateStr);
      const daySummary = aggregateDayNutrients(dayEntries, goal);

      // Short label like "Wed 14"
      const label = !isNaN(d.getTime())
        ? d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
        : dateStr;
      list.push({ dateStr, label, daySummary });
    }
    return list;
  }, [entries, currentDate, goal]);

  // Determine target reference value and max scale
  const metricConfig = useMemo(() => {
    switch (metric) {
      case 'protein':
        return {
          title: 'Protein',
          unit: 'g',
          target: refTargets.proteinG,
          getValue: (s: typeof weekDays[0]['daySummary']) => s.totals.proteinG,
          color: 'var(--leaf)',
        };
      case 'sugar':
        return {
          title: 'Added Sugar',
          unit: 'g',
          target: refTargets.addedSugarLimitG,
          getValue: (s: typeof weekDays[0]['daySummary']) => s.totals.addedSugarG,
          color: 'var(--mango)',
        };
      case 'sodium':
        return {
          title: 'Sodium',
          unit: 'mg',
          target: refTargets.sodiumLimitMg,
          getValue: (s: typeof weekDays[0]['daySummary']) => s.totals.sodiumMg,
          color: 'var(--tomato)',
        };
      case 'calories':
        return {
          title: 'Calories',
          unit: 'kcal',
          target: refTargets.energyKcal,
          getValue: (s: typeof weekDays[0]['daySummary']) => s.totals.energyKcal,
          color: 'var(--sky)',
        };
    }
  }, [metric, refTargets]);

  // Calculate highest value to scale the bars
  const maxVal = useMemo(() => {
    const values = weekDays.map((d) => metricConfig.getValue(d.daySummary));
    const highest = Math.max(...values, metricConfig.target);
    return Math.max(highest * 1.15, 10);
  }, [weekDays, metricConfig]);

  return (
    <div className="card-chunky p-5 bg-[var(--surface)] space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-extrabold font-display">7-Day Trend</h3>
          <p className="text-xs text-[var(--ink)] opacity-70">
            Tap any day to view or edit meals
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex gap-1.5 p-1 rounded-2xl bg-[var(--surface-alt)] border-2 border-[var(--ink)]">
          {(['protein', 'sugar', 'sodium', 'calories'] as MetricType[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              className={`py-1 px-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                metric === m
                  ? 'bg-[var(--ink)] text-white shadow-[1px_1px_0px_var(--ink)]'
                  : 'text-[var(--ink)] hover:text-[var(--leaf)] opacity-80'
              }`}
            >
              {m === 'sugar' ? 'Added Sugar' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="pt-2">
        <div className="h-44 flex items-end justify-between gap-2 border-b-2 border-[var(--ink)] pb-2 relative">
          {/* Target Reference Line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-[var(--ink)]/40 flex justify-end pr-2 text-[10px] font-bold text-[var(--ink)]/70 pointer-events-none"
            style={{
              bottom: `${(metricConfig.target / maxVal) * 100}%`,
            }}
          >
            Ref: {metricConfig.target}
            {metricConfig.unit}
          </div>

          {weekDays.map((d) => {
            const val = metricConfig.getValue(d.daySummary);
            const heightPct = Math.min(100, Math.max(4, (val / maxVal) * 100));
            const isSelected = d.dateStr === currentDate;

            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => onSelectDate(d.dateStr)}
                title={`${d.label}: ${val}${metricConfig.unit}`}
                className="flex-1 flex flex-col items-center justify-end h-full group focus:outline-hidden"
              >
                {/* Value on top */}
                <span
                  className={`text-[10px] font-black mb-1 transition-opacity ${
                    isSelected ? 'opacity-100 text-[var(--leaf)] scale-110' : 'opacity-70 group-hover:opacity-100'
                  }`}
                >
                  {val > 0 ? val : '—'}
                </span>

                {/* SVG Bar */}
                <div
                  className={`w-full max-w-[36px] rounded-t-xl border-2 border-[var(--ink)] transition-all ${
                    isSelected
                      ? 'shadow-[3px_3px_0px_var(--ink)] -translate-y-1'
                      : 'hover:brightness-95'
                  }`}
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: metricConfig.color,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* X-Axis Day Labels */}
        <div className="flex justify-between gap-2 pt-2">
          {weekDays.map((d) => {
            const isSelected = d.dateStr === currentDate;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => onSelectDate(d.dateStr)}
                className={`flex-1 text-center text-[10px] font-bold py-1 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-[var(--leaf)] text-white font-extrabold'
                    : 'text-[var(--ink)]/70 hover:text-[var(--ink)]'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
