import { describe, it, expect } from 'vitest';
import {
  calculateGrams,
  calculateEntryNutrients,
  aggregateDayNutrients,
  calculateStreak,
  exportDiaryToCSV,
  parseDiaryState,
  serializeDiaryState,
  type DiaryEntry,
} from '../lib/diary';

function createMockEntry(overrides: Partial<DiaryEntry> = {}): DiaryEntry {
  return {
    id: 'entry-1',
    date: '2026-10-16',
    mealSlot: 'breakfast',
    slug: 'amul-gold-milk',
    name: 'Amul Gold Milk',
    brand: 'Amul',
    portionType: 'grams',
    portionValue: 200,
    gramsConsumed: 200,
    per100g: {
      energyKcal: 88,
      proteinG: 3.5,
      carbsG: 5.0,
      totalSugarG: 5.0,
      addedSugarG: 0.0,
      fatG: 6.0,
      satFatG: 3.8,
      transFatG: 0.0,
      fibreG: 0.0,
      sodiumMg: 50,
      micronutrients: [],
    },
    addedAt: Date.now(),
    ...overrides,
  };
}

describe('lib/diary.ts Pure Food Diary Logic', () => {
  it('calculates portion grams accurately for grams, servings, and pack', () => {
    expect(calculateGrams('grams', 150, 30, 200)).toBe(150);
    expect(calculateGrams('servings', 2, 30, 100)).toBe(60);
    expect(calculateGrams('pack', 1, 30, 250)).toBe(250);
    expect(calculateGrams('pack', 0.5, 30, 250)).toBe(125);
  });

  it('scales nutrients according to portion grams consumed', () => {
    const entry = createMockEntry({ gramsConsumed: 200 });
    const nutrients = calculateEntryNutrients(entry);

    expect(nutrients.energyKcal).toBe(176); // 88 * 2
    expect(nutrients.proteinG).toBe(7.0); // 3.5 * 2
    expect(nutrients.addedSugarG).toBe(0.0);
    expect(nutrients.sodiumMg).toBe(100);
  });

  it('aggregates daily totals and computes % of ICMR-NIN reference', () => {
    const entry1 = createMockEntry({ mealSlot: 'breakfast', gramsConsumed: 200 });
    const entry2 = createMockEntry({
      id: 'entry-2',
      mealSlot: 'lunch',
      gramsConsumed: 100,
      per100g: {
        energyKcal: 400,
        proteinG: 10,
        carbsG: 60,
        totalSugarG: 15,
        addedSugarG: 12,
        fatG: 10,
        satFatG: 4,
        transFatG: 0,
        fibreG: 6,
        sodiumMg: 400,
        micronutrients: [],
      },
    });

    const day = aggregateDayNutrients([entry1, entry2], 'balanced');
    expect(day.itemCount).toBe(2);
    expect(day.totals.energyKcal).toBe(176 + 400); // 576
    expect(day.totals.proteinG).toBe(17.0); // 7.0 + 10.0
    expect(day.totals.addedSugarG).toBe(12.0);
    expect(day.percentagesOfReference.protein).toBe(Math.round((17.0 / 54) * 100)); // 31%
    expect(day.percentagesOfReference.addedSugar).toBe(Math.round((12.0 / 25) * 100)); // 48%
    expect(day.mealBreakdown.breakfast.count).toBe(1);
    expect(day.mealBreakdown.lunch.count).toBe(1);
    expect(day.hasIncompleteNutrients).toBe(false);
  });

  it('flags incomplete nutrients without inventing or guessing numbers', () => {
    const incompleteEntry = createMockEntry({
      per100g: {
        energyKcal: 250,
        proteinG: 5.0,
        carbsG: 30,
        totalSugarG: null as any,
        addedSugarG: null as any,
        fatG: 8,
        satFatG: null as any,
        transFatG: null as any,
        fibreG: null as any,
        sodiumMg: 150,
        micronutrients: [],
      },
    });

    const day = aggregateDayNutrients([incompleteEntry], 'balanced');
    expect(day.hasIncompleteNutrients).toBe(true);
    expect(day.missingCounts.addedSugarG).toBe(1);
    expect(day.missingCounts.fibreG).toBe(1);
    expect(day.totals.proteinG).toBe(10); // 5 * 2
  });

  it('adapts reference percentages based on user simple goals', () => {
    const entry = createMockEntry({ gramsConsumed: 200 }); // protein = 7g
    const balancedDay = aggregateDayNutrients([entry], 'balanced');
    const highProteinDay = aggregateDayNutrients([entry], 'more_protein');

    // In balanced, protein target is 54g -> 7 / 54 = 13%
    expect(balancedDay.percentagesOfReference.protein).toBe(13);
    // In more_protein, protein target is 75g -> 7 / 75 = 9%
    expect(highProteinDay.percentagesOfReference.protein).toBe(9);
  });

  it('calculates consecutive streak correctly', () => {
    const entries = [
      createMockEntry({ date: '2026-10-16' }),
      createMockEntry({ id: 'e2', date: '2026-10-15' }),
      createMockEntry({ id: 'e3', date: '2026-10-14' }),
    ];

    expect(calculateStreak(entries, '2026-10-16')).toBe(3);
    expect(calculateStreak([], '2026-10-16')).toBe(0);
  });

  it('exports diary entries to properly formatted CSV', () => {
    const entry = createMockEntry();
    const csv = exportDiaryToCSV([entry]);
    expect(csv).toContain('Date,Meal Slot,Product Name,Brand');
    expect(csv).toContain('2026-10-16,breakfast,"Amul Gold Milk","Amul"');
  });

  it('safely parses empty or corrupted storage states', () => {
    const emptyState = parseDiaryState(null);
    expect(emptyState.version).toBe(1);
    expect(emptyState.entries).toEqual([]);

    const corruptedState = parseDiaryState('{invalid JSON');
    expect(corruptedState.entries).toEqual([]);

    const validSerialized = serializeDiaryState({
      version: 1,
      entries: [createMockEntry()],
      goal: 'more_protein',
    });
    const parsed = parseDiaryState(validSerialized);
    expect(parsed.entries.length).toBe(1);
    expect(parsed.goal).toBe('more_protein');
  });
});
