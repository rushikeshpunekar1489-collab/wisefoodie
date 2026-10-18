'use client';

import React from 'react';
import type { DiaryEntry, MealSlot } from '@/lib/diary';
import { calculateEntryNutrients } from '@/lib/diary';
import { Plus, Trash2, Utensils, Coffee, Sun, Sunset, Moon } from 'lucide-react';

interface MealTimelineProps {
  entries: DiaryEntry[];
  onOpenAddModal: (mealSlot: MealSlot) => void;
  onDeleteEntry: (id: string) => void;
}

const MEAL_CONFIG: Record<
  MealSlot,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  breakfast: { label: 'Breakfast', icon: Coffee, color: 'bg-[var(--mango)]' },
  lunch: { label: 'Lunch', icon: Sun, color: 'bg-[var(--leaf)]' },
  snack: { label: 'Snacks & Bites', icon: Utensils, color: 'bg-[var(--sky)]' },
  dinner: { label: 'Dinner', icon: Moon, color: 'bg-[var(--mint)]' },
};

export default function MealTimeline({
  entries,
  onOpenAddModal,
  onDeleteEntry,
}: MealTimelineProps) {
  const slots: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner'];

  // Total calories for the stacked ratio
  const totalCalories = entries.reduce((acc, e) => {
    const n = calculateEntryNutrients(e);
    return acc + (n.energyKcal || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Stacked Meal Distribution Bar */}
      {totalCalories > 0 && (
        <div className="card-chunky p-4 bg-[var(--surface)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Where your calories came from</span>
            <span className="font-extrabold">{totalCalories} kcal total</span>
          </div>

          <div className="w-full h-4 rounded-full border-2 border-[var(--ink)] overflow-hidden flex bg-[var(--surface-alt)]">
            {slots.map((slot) => {
              const slotCalories = entries
                .filter((e) => e.mealSlot === slot)
                .reduce((acc, e) => acc + (calculateEntryNutrients(e).energyKcal || 0), 0);
              const pct = totalCalories > 0 ? (slotCalories / totalCalories) * 100 : 0;
              if (pct <= 0) return null;

              return (
                <div
                  key={slot}
                  style={{ width: `${pct}%` }}
                  title={`${MEAL_CONFIG[slot].label}: ${slotCalories} kcal (${Math.round(pct)}%)`}
                  className={`h-full ${MEAL_CONFIG[slot].color} transition-all duration-300`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] font-bold pt-1">
            {slots.map((slot) => {
              const slotCalories = entries
                .filter((e) => e.mealSlot === slot)
                .reduce((acc, e) => acc + (calculateEntryNutrients(e).energyKcal || 0), 0);
              return (
                <div key={slot} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${MEAL_CONFIG[slot].color}`} />
                  <span className="capitalize">{slot}</span>
                  <span className="opacity-70">({slotCalories} kcal)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Slots details */}
      <div className="space-y-4">
        {slots.map((slot) => {
          const cfg = MEAL_CONFIG[slot];
          const Icon = cfg.icon;
          const slotEntries = entries.filter((e) => e.mealSlot === slot);
          const slotCalories = slotEntries.reduce(
            (acc, e) => acc + (calculateEntryNutrients(e).energyKcal || 0),
            0
          );
          const slotProtein = Number(
            slotEntries
              .reduce((acc, e) => acc + (calculateEntryNutrients(e).proteinG || 0), 0)
              .toFixed(1)
          );

          return (
            <div
              key={slot}
              className="card-chunky p-4 bg-[var(--surface)] border-2 border-[var(--ink)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl ${cfg.color} border border-[var(--ink)] flex items-center justify-center text-[var(--ink)] shadow-[1px_1px_0px_var(--ink)]`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold font-display">{cfg.label}</h4>
                    <p className="text-[10px] opacity-70">
                      {slotCalories} kcal • {slotProtein}g protein
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAddModal(slot)}
                  className="btn-chunky py-1 px-3 text-xs flex items-center gap-1 bg-[var(--surface-alt)] hover:bg-[var(--leaf)] hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {slotEntries.length === 0 ? (
                <div className="py-4 text-center rounded-2xl bg-[var(--surface-alt)]/50 border border-dashed border-[var(--ink)]/30 text-xs opacity-60">
                  No foods logged for {cfg.label.toLowerCase()} yet.
                </div>
              ) : (
                <div className="divide-y divide-[var(--ink)]/10">
                  {slotEntries.map((e) => {
                    const n = calculateEntryNutrients(e);
                    return (
                      <div
                        key={e.id}
                        className="py-2.5 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[var(--ink)]/20 flex items-center justify-center overflow-hidden shrink-0">
                            {e.image ? (
                              <img src={e.image} alt={e.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm">🥣</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate leading-tight">{e.name}</p>
                            <p className="text-[10px] opacity-70 truncate">
                              {e.brand} • <span className="font-bold">{e.gramsConsumed}g</span> (
                              {e.portionValue}{' '}
                              {e.portionType === 'pack'
                                ? 'pack'
                                : e.portionType === 'servings'
                                ? 'serving'
                                : 'g'}
                              )
                            </p>
                            <div className="flex gap-2 text-[10px] font-semibold text-[var(--ink)] opacity-90 mt-0.5">
                              <span>{n.energyKcal ?? '—'} kcal</span>
                              <span>•</span>
                              <span>{n.proteinG ?? '—'}g protein</span>
                              <span>•</span>
                              <span>{n.addedSugarG ?? 0}g sugar</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteEntry(e.id)}
                          className="p-1.5 rounded-lg text-[var(--tomato)] hover:bg-[var(--tomato)]/10 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
