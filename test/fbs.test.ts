import { describe, it, expect } from 'vitest';
import { computeFBS } from '../lib/fbs';

describe('FBS (Food Benefit Score) Calibration & Pure Function', () => {
  it('Anchor 1: Rolled Oats must score >= 7.5', () => {
    const rolledOats = computeFBS({
      energyKcal: 389,
      proteinG: 13.5,
      carbsG: 66,
      totalSugarG: 1.0,
      addedSugarG: 0,
      fatG: 6.9,
      satFatG: 1.2,
      transFatG: 0,
      fibreG: 10.6,
      sodiumMg: 5,
      ingredients: ['100% Rolled Whole Grain Oats'],
      micronutrients: [
        { name: 'Iron', amount: 4.7, unit: 'mg', rdaPercentage: 25 },
        { name: 'Magnesium', amount: 177, unit: 'mg', rdaPercentage: 40 },
      ],
    });

    expect(rolledOats.score).not.toBeNull();
    expect(rolledOats.score!).toBeGreaterThanOrEqual(7.5);
    expect(rolledOats.band).toMatch(/Excellent|Very Good/);
  });

  it('Anchor 2: Plain Curd / Fresh Paneer must score >= 6.5', () => {
    const paneer = computeFBS({
      energyKcal: 265,
      proteinG: 18.0,
      carbsG: 3.0,
      totalSugarG: 2.5,
      addedSugarG: 0,
      fatG: 20.0,
      satFatG: 12.0,
      transFatG: 0,
      fibreG: 0,
      sodiumMg: 60,
      ingredients: ['Fresh Pasteurized Milk', 'Citric Acid'],
    });

    expect(paneer.score).not.toBeNull();
    expect(paneer.score!).toBeGreaterThanOrEqual(6.5);
    expect(paneer.band).toMatch(/Good|Very Good|Excellent/);
  });

  it('Anchor 3: Typical Sweet Biscuit must score 3.5 - 5.5', () => {
    const sweetBiscuit = computeFBS({
      energyKcal: 460,
      proteinG: 6.5,
      carbsG: 75.0,
      totalSugarG: 26.0,
      addedSugarG: 24.0,
      fatG: 14.0,
      satFatG: 6.5,
      transFatG: 0,
      fibreG: 1.5,
      sodiumMg: 280,
      ingredients: [
        'Refined Wheat Flour (Maida)',
        'Sugar',
        'Edible Vegetable Oil (Palm Oil)',
        'Invert Sugar Syrup',
        'Raising Agents',
        'Artificial Flavour',
      ],
    });

    expect(sweetBiscuit.score).not.toBeNull();
    expect(sweetBiscuit.score!).toBeGreaterThanOrEqual(3.5);
    expect(sweetBiscuit.score!).toBeLessThanOrEqual(5.5);
  });

  it('Anchor 4: Instant Noodles must score 3.0 - 5.0', () => {
    const instantNoodles = computeFBS({
      energyKcal: 427,
      proteinG: 8.0,
      carbsG: 63.5,
      totalSugarG: 2.2,
      addedSugarG: 1.0,
      fatG: 15.7,
      satFatG: 6.8,
      transFatG: 0.1,
      fibreG: 2.0,
      sodiumMg: 950,
      ingredients: [
        'Refined Wheat Flour (Maida)',
        'Palm Oil',
        'Salt',
        'Wheat Gluten',
        'Mineral',
        'Thickener',
        'Acidity Regulator',
        'Flavour Enhancer (INS 635)',
      ],
    });

    expect(instantNoodles.score).not.toBeNull();
    expect(instantNoodles.score!).toBeGreaterThanOrEqual(3.0);
    expect(instantNoodles.score!).toBeLessThanOrEqual(5.0);
  });

  it('Anchor 5: Sugary Soft Drink must score <= 3.0', () => {
    const cola = computeFBS({
      energyKcal: 44,
      proteinG: 0,
      carbsG: 10.9,
      totalSugarG: 10.6,
      addedSugarG: 10.6,
      fatG: 0,
      satFatG: 0,
      transFatG: 0,
      fibreG: 0,
      sodiumMg: 15,
      isBeverage: true,
      ingredients: [
        'Carbonated Water',
        'Sugar',
        'Acidity Regulator (INS 338)',
        'Colour (INS 150d)',
        'Flavours',
        'Caffeine',
      ],
    });

    expect(cola.score).not.toBeNull();
    expect(cola.score!).toBeLessThanOrEqual(3.0);
    expect(cola.band).toBe('Poor');
  });

  it('Incomplete data returns null score with isPending flag', () => {
    const incomplete = computeFBS({
      energyKcal: null,
      proteinG: null,
      fatG: null,
      sodiumMg: null,
    });

    expect(incomplete.score).toBeNull();
    expect(incomplete.band).toBeNull();
    expect(incomplete.isPending).toBe(true);
    expect(incomplete.breakdown[0].factor).toBe('Incomplete Data');
  });
});
