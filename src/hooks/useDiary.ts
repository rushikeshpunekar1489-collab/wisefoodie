'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  type DiaryEntry,
  type DiaryState,
  type MealSlot,
  type PortionType,
  type SimpleGoal,
  DIARY_STORAGE_KEY,
  parseDiaryState,
  serializeDiaryState,
  aggregateDayNutrients,
  generateInsightNudges,
  calculateStreak,
  exportDiaryToCSV,
  toSafeDateString,
} from '@/lib/diary';
import type { ProductPer100g } from '@/types/product';

export function useDiary() {
  const [todayStr, setTodayStr] = useState<string>(toSafeDateString);
  const [selectedDate, setSelectedDate] = useState<string>(toSafeDateString);

  useEffect(() => {
    const today = toSafeDateString();
    setTodayStr(today);
    setSelectedDate((current) => (current && current !== '' ? current : today));
  }, []);
  const [diaryState, setDiaryState] = useState<DiaryState>({
    version: 1,
    entries: [],
    goal: 'balanced',
  });
  const [lastDeleted, setLastDeleted] = useState<DiaryEntry | null>(null);

  // Load state safely
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DIARY_STORAGE_KEY);
      setDiaryState(parseDiaryState(raw));
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === DIARY_STORAGE_KEY) {
        setDiaryState(parseDiaryState(e.newValue));
      }
    };

    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<DiaryState>;
      if (customEvent.detail) {
        setDiaryState(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('wf:diary_changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('wf:diary_changed', handleCustom);
    };
  }, []);

  const saveState = useCallback((nextState: DiaryState) => {
    setDiaryState(nextState);
    try {
      localStorage.setItem(DIARY_STORAGE_KEY, serializeDiaryState(nextState));
      window.dispatchEvent(new CustomEvent('wf:diary_changed', { detail: nextState }));
    } catch (e) {}
  }, []);

  const addFoodEntry = useCallback(
    (item: {
      slug: string;
      name: string;
      brand: string;
      mealSlot: MealSlot;
      portionType: PortionType;
      portionValue: number;
      gramsConsumed: number;
      per100g: ProductPer100g;
      image?: string | null;
      date?: string;
    }) => {
      const newEntry: DiaryEntry = {
        id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        date: item.date || selectedDate,
        mealSlot: item.mealSlot,
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        portionType: item.portionType,
        portionValue: item.portionValue,
        gramsConsumed: item.gramsConsumed,
        per100g: item.per100g,
        image: item.image,
        addedAt: Date.now(),
      };

      saveState({
        ...diaryState,
        entries: [newEntry, ...diaryState.entries],
      });
    },
    [diaryState, saveState, selectedDate]
  );

  const updateEntryPortion = useCallback(
    (id: string, portionType: PortionType, portionValue: number, gramsConsumed: number) => {
      const updated = diaryState.entries.map((e) =>
        e.id === id ? { ...e, portionType, portionValue, gramsConsumed } : e
      );
      saveState({ ...diaryState, entries: updated });
    },
    [diaryState, saveState]
  );

  const deleteFoodEntry = useCallback(
    (id: string) => {
      const item = diaryState.entries.find((e) => e.id === id);
      if (item) {
        setLastDeleted(item);
      }
      const filtered = diaryState.entries.filter((e) => e.id !== id);
      saveState({ ...diaryState, entries: filtered });
    },
    [diaryState, saveState]
  );

  const undoLastDelete = useCallback(() => {
    if (!lastDeleted) return;
    saveState({
      ...diaryState,
      entries: [lastDeleted, ...diaryState.entries],
    });
    setLastDeleted(null);
  }, [lastDeleted, diaryState, saveState]);

  const setGoal = useCallback(
    (goal: SimpleGoal) => {
      saveState({ ...diaryState, goal });
    },
    [diaryState, saveState]
  );

  const copyPreviousDayMeals = useCallback(
    (targetDate: string): number => {
      const safeTarget = toSafeDateString(targetDate);
      const target = new Date(safeTarget);
      target.setDate(target.getDate() - 1);
      const prevDateStr = toSafeDateString(target);

      const prevEntries = diaryState.entries.filter((e) => e.date === prevDateStr);
      if (prevEntries.length === 0) return 0;

      const copied = prevEntries.map((e) => ({
        ...e,
        id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        date: targetDate,
        addedAt: Date.now(),
      }));

      saveState({
        ...diaryState,
        entries: [...copied, ...diaryState.entries],
      });
      return copied.length;
    },
    [diaryState, saveState]
  );

  const exportCSV = useCallback(() => {
    const csv = exportDiaryToCSV(diaryState.entries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wisefoodies_food_diary_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [diaryState.entries, selectedDate]);

  // Filter entries for selected date
  const dayEntries = useMemo(() => {
    return diaryState.entries.filter((e) => e.date === selectedDate);
  }, [diaryState.entries, selectedDate]);

  // Aggregated day summary
  const daySummary = useMemo(() => {
    return aggregateDayNutrients(dayEntries, diaryState.goal);
  }, [dayEntries, diaryState.goal]);

  // Nudges for today
  const nudges = useMemo(() => {
    return generateInsightNudges(daySummary);
  }, [daySummary]);

  // Active streak
  const streak = useMemo(() => {
    return calculateStreak(diaryState.entries, todayStr);
  }, [diaryState.entries, todayStr]);

  return {
    selectedDate,
    setSelectedDate,
    entries: dayEntries,
    allEntries: diaryState.entries,
    goal: diaryState.goal,
    setGoal,
    addFoodEntry,
    updateEntryPortion,
    deleteFoodEntry,
    undoLastDelete,
    lastDeleted,
    copyPreviousDayMeals,
    exportCSV,
    daySummary,
    nudges,
    streak,
  };
}
