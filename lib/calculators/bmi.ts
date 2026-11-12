import { BMICalculationInput, BMIResult, BMICategory } from '@/types/fitness';

export function calculateBMI(input: BMICalculationInput): BMIResult {
  const { heightCm, weightKg, age } = input;

  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be positive numbers.');
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  // Determine standard adult category
  let category: BMICategory = 'Normal weight';
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
  } else if (bmi <= 34.9) {
    category = 'Obesity Class I';
  } else if (bmi <= 39.9) {
    category = 'Obesity Class II';
  } else {
    category = 'Obesity Class III';
  }

  // Asian Indian consensus cut-off
  let asianIndianCategory = 'Normal weight (18.5 - 22.9)';
  if (bmi < 18.5) {
    asianIndianCategory = 'Underweight (< 18.5)';
  } else if (bmi <= 22.9) {
    asianIndianCategory = 'Normal weight (18.5 - 22.9)';
  } else if (bmi <= 27.4) {
    asianIndianCategory = 'Overweight / At Risk (23.0 - 27.4)';
  } else {
    asianIndianCategory = 'Obese (≥ 27.5)';
  }

  const healthyMinKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const healthyMaxKg = Math.round(24.9 * heightM * heightM * 10) / 10;

  const isChild = typeof age === 'number' && age > 0 && age < 18;

  const explanation = isChild
    ? 'Notice: For children and teens under 18 years, standard adult BMI categories do not apply. Pediatric BMI must be interpreted using age-and-sex specific percentile growth curves from WHO or CDC.'
    : 'BMI is an established screening indicator for weight categories. It does not measure body fat directly and does not distinguish between lean muscle mass and fat tissue.';

  return {
    bmi,
    category,
    healthyBmiRange: { min: 18.5, max: 24.9 },
    healthyWeightRangeKg: { min: healthyMinKg, max: healthyMaxKg },
    asianIndianCategory,
    isChild,
    explanation,
  };
}
