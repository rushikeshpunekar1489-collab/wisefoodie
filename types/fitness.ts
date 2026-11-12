export type HeightUnit = 'cm' | 'ft-in';
export type WeightUnit = 'kg' | 'lbs';
export type CircumferenceUnit = 'cm' | 'inches';
export type BiologicalSex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';

export interface BMICalculationInput {
  heightCm: number;
  weightKg: number;
  age?: number;
}

export type BMICategory = 
  | 'Underweight'
  | 'Normal weight'
  | 'Overweight'
  | 'Obesity Class I'
  | 'Obesity Class II'
  | 'Obesity Class III';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  healthyBmiRange: { min: number; max: number };
  healthyWeightRangeKg: { min: number; max: number };
  asianIndianCategory?: string;
  isChild: boolean;
  explanation: string;
}

export interface BodyFatInput {
  sex: BiologicalSex;
  age: number;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  neckCm: number;
  hipCm?: number; // Required for females
}

export type BodyFatCategory =
  | 'Essential Fat'
  | 'Athletes'
  | 'Fitness'
  | 'Average'
  | 'Above Average / Obese';

export interface BodyFatResult {
  bodyFatPercentage: number;
  fatMassKg: number;
  leanMassKg: number;
  category: BodyFatCategory;
  explanation: string;
}

export interface CalorieInput {
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  macroPreset?: 'balanced' | 'high_protein' | 'low_carb' | 'custom';
  customCarbPct?: number;
  customProteinPct?: number;
  customFatPct?: number;
}

export interface MacroGrams {
  proteinG: number;
  proteinKcal: number;
  proteinPct: number;
  carbG: number;
  carbKcal: number;
  carbPct: number;
  fatG: number;
  fatKcal: number;
  fatPct: number;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  maintenanceCalories: number;
  mildWeightLossCalories: number; // -300 kcal
  weightLossCalories: number;     // -500 kcal
  weightGainCalories: number;     // +400 kcal
  macros: {
    maintenance: MacroGrams;
    weightLoss: MacroGrams;
    weightGain: MacroGrams;
  };
  explanation: string;
}

export interface IdealWeightInput {
  sex: BiologicalSex;
  heightCm: number;
}

export interface IdealWeightResult {
  heightCm: number;
  healthyBmiRangeKg: { min: number; max: number };
  devineKg: number | null;
  robinsonKg: number | null;
  millerKg: number | null;
  hamwiKg: number | null;
  averageFormulaKg: number | null;
  explanation: string;
}
