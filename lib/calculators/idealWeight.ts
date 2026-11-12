import { IdealWeightInput, IdealWeightResult } from '@/types/fitness';
import { cmToInches } from './unitConversions';

export function calculateIdealWeight(input: IdealWeightInput): IdealWeightResult {
  const { sex, heightCm } = input;

  if (heightCm <= 0) {
    throw new Error('Height must be a positive number.');
  }

  const heightM = heightCm / 100;
  const healthyMinKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const healthyMaxKg = Math.round(24.9 * heightM * heightM * 10) / 10;

  const heightInches = cmToInches(heightCm);
  const inchesOver5Ft = heightInches - 60;

  let devineKg: number | null = null;
  let robinsonKg: number | null = null;
  let millerKg: number | null = null;
  let hamwiKg: number | null = null;

  // Recognized formulas assume height around 5 feet or taller
  if (inchesOver5Ft >= -5) {
    const diff = Math.max(-5, inchesOver5Ft);
    if (sex === 'male') {
      devineKg = Math.round((50.0 + 2.3 * diff) * 10) / 10;
      robinsonKg = Math.round((52.0 + 1.9 * diff) * 10) / 10;
      millerKg = Math.round((56.2 + 1.41 * diff) * 10) / 10;
      hamwiKg = Math.round((48.0 + 2.7 * diff) * 10) / 10;
    } else {
      devineKg = Math.round((45.5 + 2.3 * diff) * 10) / 10;
      robinsonKg = Math.round((49.0 + 1.7 * diff) * 10) / 10;
      millerKg = Math.round((53.1 + 1.36 * diff) * 10) / 10;
      hamwiKg = Math.round((45.5 + 2.2 * diff) * 10) / 10;
    }
  }

  const formulaValues = [devineKg, robinsonKg, millerKg, hamwiKg].filter(
    (v): v is number => v !== null && v > 0
  );

  const averageFormulaKg =
    formulaValues.length > 0
      ? Math.round((formulaValues.reduce((a, b) => a + b, 0) / formulaValues.length) * 10) / 10
      : null;

  const explanation =
    'There is no single universally "perfect" body weight. Historical formulas (Devine, Robinson, Miller, Hamwi) were originally developed for clinical pharmacology and medication dosing based on height. A healthy weight is best viewed as a flexible spectrum represented by the standard adult BMI range (18.5 to 24.9 kg/m²), which accounts for bone structure, muscle mass, and personal genetics.';

  return {
    heightCm,
    healthyBmiRangeKg: { min: healthyMinKg, max: healthyMaxKg },
    devineKg,
    robinsonKg,
    millerKg,
    hamwiKg,
    averageFormulaKg,
    explanation,
  };
}
