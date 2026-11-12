import { CalorieInput, CalorieResult, MacroGrams, ActivityLevel } from '@/types/fitness';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

function computeMacros(
  totalCalories: number,
  carbPct: number,
  proteinPct: number,
  fatPct: number
): MacroGrams {
  const carbKcal = Math.round(totalCalories * (carbPct / 100));
  const proteinKcal = Math.round(totalCalories * (proteinPct / 100));
  const fatKcal = Math.round(totalCalories * (fatPct / 100));

  const carbG = Math.round(carbKcal / 4);
  const proteinG = Math.round(proteinKcal / 4);
  const fatG = Math.round(fatKcal / 9);

  return {
    carbG,
    carbKcal,
    carbPct,
    proteinG,
    proteinKcal,
    proteinPct,
    fatG,
    fatKcal,
    fatPct,
  };
}

export function calculateDailyCalories(input: CalorieInput): CalorieResult {
  const {
    age,
    sex,
    heightCm,
    weightKg,
    activityLevel,
    macroPreset = 'balanced',
    customCarbPct,
    customProteinPct,
    customFatPct,
  } = input;

  if (age <= 0 || heightCm <= 0 || weightKg <= 0) {
    throw new Error('Age, height, and weight must be positive numbers.');
  }

  // Mifflin-St Jeor equation for Basal Metabolic Rate (BMR)
  let bmrRaw: number;
  if (sex === 'male') {
    bmrRaw = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmrRaw = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const bmr = Math.round(bmrRaw);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);
  const maintenanceCalories = tdee;

  // Safe calorie targets:
  // Minimum safe nutritional floor: 1500 kcal for adult men, 1200 kcal for adult women
  const minFloor = sex === 'male' ? 1500 : 1200;

  const mildLossTarget = Math.max(minFloor, maintenanceCalories - 300);
  const lossTarget = Math.max(minFloor, maintenanceCalories - 500);
  const gainTarget = maintenanceCalories + 400;

  // Determine macro percentages
  let carbPct = 50;
  let proteinPct = 25;
  let fatPct = 25;

  if (macroPreset === 'high_protein') {
    carbPct = 35;
    proteinPct = 40;
    fatPct = 25;
  } else if (macroPreset === 'low_carb') {
    carbPct = 20;
    proteinPct = 40;
    fatPct = 40;
  } else if (macroPreset === 'custom') {
    const c = customCarbPct ?? 50;
    const p = customProteinPct ?? 25;
    const f = customFatPct ?? 25;
    const total = c + p + f;
    if (total > 0) {
      carbPct = Math.round((c / total) * 100);
      proteinPct = Math.round((p / total) * 100);
      fatPct = 100 - carbPct - proteinPct;
    }
  }

  const macros = {
    maintenance: computeMacros(maintenanceCalories, carbPct, proteinPct, fatPct),
    weightLoss: computeMacros(lossTarget, carbPct, proteinPct, fatPct),
    weightGain: computeMacros(gainTarget, carbPct, proteinPct, fatPct),
  };

  const explanation =
    'Basal Metabolic Rate (BMR) is estimated via the validated Mifflin-St Jeor formula and multiplied by your activity factor to obtain Total Daily Energy Expenditure (TDEE). These are estimates and vary according to individual metabolic rates, genetics, and body composition. Not intended as medical or dietetic advice.';

  return {
    bmr,
    tdee,
    maintenanceCalories,
    mildWeightLossCalories: mildLossTarget,
    weightLossCalories: lossTarget,
    weightGainCalories: gainTarget,
    macros,
    explanation,
  };
}
