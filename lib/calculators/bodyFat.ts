import { BodyFatInput, BodyFatResult, BodyFatCategory } from '@/types/fitness';
import { cmToInches } from './unitConversions';

export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  const { sex, heightCm, weightKg, waistCm, neckCm, hipCm } = input;

  if (heightCm <= 0 || weightKg <= 0 || waistCm <= 0 || neckCm <= 0) {
    throw new Error('Height, weight, waist, and neck circumferences must be positive numbers.');
  }

  // Convert to inches for standard US Navy equations
  const heightIn = cmToInches(heightCm);
  const neckIn = cmToInches(neckCm);
  const waistIn = cmToInches(waistCm);

  let bodyFatPct = 0;

  if (sex === 'male') {
    if (waistCm <= neckCm) {
      throw new Error('Waist circumference must be greater than neck circumference.');
    }
    const waistMinusNeck = waistIn - neckIn;
    if (waistMinusNeck <= 0) {
      throw new Error('Waist must exceed neck circumference.');
    }
    // US Navy formula for men:
    // % Fat = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
    bodyFatPct = 86.010 * Math.log10(waistMinusNeck) - 70.041 * Math.log10(heightIn) + 36.76;
  } else {
    // Female requires hip circumference
    if (!hipCm || hipCm <= 0) {
      throw new Error('Hip circumference is required for female body fat calculation.');
    }
    const hipIn = cmToInches(hipCm);
    const circumferenceTerm = waistIn + hipIn - neckIn;
    if (circumferenceTerm <= 0) {
      throw new Error('Combined waist and hip circumference must be greater than neck circumference.');
    }
    // US Navy formula for women:
    // % Fat = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
    bodyFatPct = 163.205 * Math.log10(circumferenceTerm) - 97.684 * Math.log10(heightIn) - 78.387;
  }

  // Bound reasonable physiological limits
  bodyFatPct = Math.max(2, Math.min(65, Math.round(bodyFatPct * 10) / 10));

  const fatMassKg = Math.round(((weightKg * bodyFatPct) / 100) * 10) / 10;
  const leanMassKg = Math.round((weightKg - fatMassKg) * 10) / 10;

  // Categorization based on American Council on Exercise (ACE) standards
  let category: BodyFatCategory = 'Average';
  if (sex === 'male') {
    if (bodyFatPct < 6) category = 'Essential Fat';
    else if (bodyFatPct <= 13) category = 'Athletes';
    else if (bodyFatPct <= 17) category = 'Fitness';
    else if (bodyFatPct <= 24) category = 'Average';
    else category = 'Above Average / Obese';
  } else {
    if (bodyFatPct < 14) category = 'Essential Fat';
    else if (bodyFatPct <= 20) category = 'Athletes';
    else if (bodyFatPct <= 24) category = 'Fitness';
    else if (bodyFatPct <= 31) category = 'Average';
    else category = 'Above Average / Obese';
  }

  const explanation =
    'This calculation uses the US Navy circumference-based method. It provides an empirical estimate for body composition and is not a clinical laboratory measurement like a DXA scan or hydrostatic weighing.';

  return {
    bodyFatPercentage: bodyFatPct,
    fatMassKg,
    leanMassKg,
    category,
    explanation,
  };
}
