export type ConsumptionClassification = 'Frequent' | 'Moderate' | 'Occasional' | 'Limit';

export interface DailyLimitContribution {
  nutrient: string;
  amountPerServing: number | null;
  unit: string;
  dailyLimit: number;
  percentageOfLimit: number | null;
  isHigh: boolean;
  citation: string;
}

export interface FoodCombination {
  food: string;
  reason: string;
}

export interface SmartConsumptionAnalysis {
  classification: {
    verdict: ConsumptionClassification;
    badgeColor: string;
    headline: string;
    triggers: string[];
    summary: string;
    disclaimer: string;
  };
  recommendedConsumption: {
    servingSizeValue: number;
    servingSizeUnit: 'g' | 'ml';
    isServingEstimated: boolean;
    caloriesPerServing: number | null;
    suggestedFrequency: string;
    portionTip: string;
    suitability: string;
    keyConsideration: string;
  };
  bestWayToConsume: {
    timing: string;
    preparation: string;
    perServingContext: string;
  };
  harmReduction: {
    strategies: string[];
    crossedThresholds: string[];
  };
  smartFoodCombinations: FoodCombination[];
  thingsToAvoid: string[];
  dailyContributions: DailyLimitContribution[];
}
