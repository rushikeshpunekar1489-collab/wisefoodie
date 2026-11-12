import { describe, it, expect } from 'vitest';
import { calculateBMI } from '../lib/calculators/bmi';
import { calculateBodyFat } from '../lib/calculators/bodyFat';
import { calculateDailyCalories } from '../lib/calculators/dailyCalories';
import { calculateIdealWeight } from '../lib/calculators/idealWeight';
import {
  cmToInches,
  inchesToCm,
  ftInToCm,
  cmToFtIn,
  kgToLbs,
  lbsToKg,
} from '../lib/calculators/unitConversions';

describe('Unit Conversions', () => {
  it('correctly converts centimeters and inches', () => {
    expect(cmToInches(25.4)).toBeCloseTo(10, 2);
    expect(inchesToCm(10)).toBeCloseTo(25.4, 2);
  });

  it('correctly converts feet and inches to cm', () => {
    // 5 ft 8 in = 68 inches = 172.72 cm
    expect(ftInToCm(5, 8)).toBeCloseTo(172.72, 1);
  });

  it('correctly converts kilograms and pounds', () => {
    expect(kgToLbs(70)).toBeCloseTo(154.32, 1);
    expect(lbsToKg(154.323)).toBeCloseTo(70, 1);
  });
});

describe('BMI Calculator', () => {
  it('correctly calculates normal BMI', () => {
    // 70kg at 175cm: 70 / (1.75^2) = 22.86 -> 22.9
    const res = calculateBMI({ heightCm: 175, weightKg: 70, age: 30 });
    expect(res.bmi).toBe(22.9);
    expect(res.category).toBe('Normal weight');
    expect(res.isChild).toBe(false);
    expect(res.healthyWeightRangeKg.min).toBeCloseTo(56.7, 1);
    expect(res.healthyWeightRangeKg.max).toBeCloseTo(76.3, 1);
  });

  it('correctly classifies underweight and obesity categories', () => {
    const under = calculateBMI({ heightCm: 180, weightKg: 50 });
    expect(under.bmi).toBe(15.4);
    expect(under.category).toBe('Underweight');

    const obese1 = calculateBMI({ heightCm: 170, weightKg: 95 });
    expect(obese1.bmi).toBe(32.9);
    expect(obese1.category).toBe('Obesity Class I');

    const obese3 = calculateBMI({ heightCm: 160, weightKg: 110 });
    expect(obese3.bmi).toBe(43.0);
    expect(obese3.category).toBe('Obesity Class III');
  });

  it('flags pediatric users and does not apply adult categories blindly', () => {
    const child = calculateBMI({ heightCm: 140, weightKg: 35, age: 10 });
    expect(child.isChild).toBe(true);
    expect(child.explanation).toContain('children and teens under 18 years');
  });

  it('throws error on invalid non-positive inputs', () => {
    expect(() => calculateBMI({ heightCm: 0, weightKg: 70 })).toThrow();
    expect(() => calculateBMI({ heightCm: 170, weightKg: -5 })).toThrow();
  });
});

describe('Body Fat Percentage Calculator (US Navy Method)', () => {
  it('calculates body fat for a standard adult male', () => {
    // Male: height 178cm, weight 78kg, waist 84cm, neck 38cm
    const res = calculateBodyFat({
      sex: 'male',
      age: 28,
      heightCm: 178,
      weightKg: 78,
      waistCm: 84,
      neckCm: 38,
    });

    expect(res.bodyFatPercentage).toBeGreaterThan(10);
    expect(res.bodyFatPercentage).toBeLessThan(20);
    expect(res.fatMassKg).toBeGreaterThan(5);
    expect(res.leanMassKg).toBeGreaterThan(55);
    expect(res.fatMassKg + res.leanMassKg).toBeCloseTo(78, 1);
  });

  it('calculates body fat for a standard adult female', () => {
    // Female: height 165cm, weight 60kg, waist 72cm, neck 33cm, hip 96cm
    const res = calculateBodyFat({
      sex: 'female',
      age: 26,
      heightCm: 165,
      weightKg: 60,
      waistCm: 72,
      neckCm: 33,
      hipCm: 96,
    });

    expect(res.bodyFatPercentage).toBeGreaterThan(18);
    expect(res.bodyFatPercentage).toBeLessThan(32);
    expect(res.fatMassKg + res.leanMassKg).toBeCloseTo(60, 1);
  });

  it('validates impossible measurements', () => {
    // Male waist smaller than neck is physically inconsistent for US Navy formula
    expect(() =>
      calculateBodyFat({
        sex: 'male',
        age: 30,
        heightCm: 175,
        weightKg: 70,
        waistCm: 35,
        neckCm: 40,
      })
    ).toThrow();

    // Female missing hip measurement
    expect(() =>
      calculateBodyFat({
        sex: 'female',
        age: 30,
        heightCm: 165,
        weightKg: 60,
        waistCm: 75,
        neckCm: 35,
      })
    ).toThrow();
  });
});

describe('Daily Calories Calculator (Mifflin-St Jeor & Macros)', () => {
  it('calculates accurate BMR and TDEE for male', () => {
    // Male: 70kg, 175cm, 25yo
    // BMR = 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1674
    const res = calculateDailyCalories({
      age: 25,
      sex: 'male',
      heightCm: 175,
      weightKg: 70,
      activityLevel: 'moderate', // 1.55 multiplier
    });

    expect(res.bmr).toBe(1674);
    expect(res.tdee).toBe(Math.round(1674 * 1.55));
    expect(res.maintenanceCalories).toBe(res.tdee);
    expect(res.weightLossCalories).toBe(res.tdee - 500);
    expect(res.weightGainCalories).toBe(res.tdee + 400);

    // Verify macro calories match target within reasonable integer rounding
    const m = res.macros.maintenance;
    const macroKcalSum = m.proteinKcal + m.carbKcal + m.fatKcal;
    expect(macroKcalSum).toBeCloseTo(res.maintenanceCalories, -1);
  });

  it('calculates accurate BMR and respects safety floors for female', () => {
    // Female: 55kg, 160cm, 30yo
    // BMR = 10*55 + 6.25*160 - 5*30 - 161 = 550 + 1000 - 150 - 161 = 1239
    const res = calculateDailyCalories({
      age: 30,
      sex: 'female',
      heightCm: 160,
      weightKg: 55,
      activityLevel: 'sedentary', // 1.2 multiplier -> TDEE = 1487
    });

    expect(res.bmr).toBe(1239);
    expect(res.tdee).toBe(Math.round(1239 * 1.2)); // 1487
    // Deficit of -500 would be 987, but minimum safety floor is 1200 kcal!
    expect(res.weightLossCalories).toBeGreaterThanOrEqual(1200);
  });
});

describe('Ideal Weight Calculator', () => {
  it('provides standard healthy BMI weight range and historical estimates', () => {
    const res = calculateIdealWeight({ sex: 'male', heightCm: 175 });

    // 175cm -> 1.75m -> min 18.5 * 1.75^2 = 56.7kg, max 24.9 * 1.75^2 = 76.3kg
    expect(res.healthyBmiRangeKg.min).toBeCloseTo(56.7, 1);
    expect(res.healthyBmiRangeKg.max).toBeCloseTo(76.3, 1);

    // Height ~ 68.9 inches -> inches over 5ft ≈ 8.9 inches
    // Devine male = 50 + 2.3 * 8.9 ≈ 70.5kg
    expect(res.devineKg).toBeGreaterThan(65);
    expect(res.devineKg).toBeLessThan(75);
    expect(res.robinsonKg).toBeDefined();
    expect(res.millerKg).toBeDefined();
    expect(res.hamwiKg).toBeDefined();
    expect(res.explanation).toContain('no single universally');
  });
});
