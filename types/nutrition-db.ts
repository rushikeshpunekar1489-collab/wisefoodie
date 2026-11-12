export interface NutrientProfile {
  energyKcal: number | null;
  energyKj: number | null;
  proteinG: number | null;
  carbG: number | null;
  fatG: number | null;
  fibreG: number | null;
  freeSugarG: number | null;
  sfaMg: number | null;
  mufaMg: number | null;
  pufaMg: number | null;
  cholesterolMg: number | null;
  calciumMg: number | null;
  phosphorusMg: number | null;
  magnesiumMg: number | null;
  sodiumMg: number | null;
  potassiumMg: number | null;
  ironMg: number | null;
  copperMg: number | null;
  zincMg: number | null;
  seleniumUg: number | null;
  chromiumMg: number | null;
  manganeseMg: number | null;
  molybdenumMg: number | null;
  vitaUg: number | null;
  viteMg: number | null;
  vitd2Ug: number | null;
  vitd3Ug: number | null;
  vitk1Ug: number | null;
  vitk2Ug: number | null;
  folateUg: number | null;
  vitb1Mg: number | null;
  vitb2Mg: number | null;
  vitb3Mg: number | null;
  vitb5Mg: number | null;
  vitb6Mg: number | null;
  vitb7Ug: number | null;
  vitb9Ug: number | null;
  vitcMg: number | null;
  carotenoidsUg: number | null;
}

export interface ServingInfo {
  servingWeightG: number;
  servingUnit: string;
  noOfServingsInRecipe: number;
  servingLabel: string;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  original: string;
}

export interface OilItem {
  name: string;
  raw_amount: number;
  raw_unit: string;
  grams: number;
}

export interface OilBreakdown {
  available: boolean;
  oilTypes: string[];
  totalRecipeOilG: number;
  oilPerServingG: number | null;
  oilCaloriesPerServing: number | null;
  oilItems: OilItem[];
  note: string;
}

export interface IndianFoodItem {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  nameLocal: string | null;
  foodType: 'cooked' | 'raw';
  foodGroup: string;
  category: string;
  provenance: string;
  primarySource: string;
  servingInfo: ServingInfo;
  oilBreakdown: OilBreakdown;
  ingredients: RecipeIngredient[];
  nutrientsPer100g: NutrientProfile;
  nutrientsPerServing: NutrientProfile;
  aliases: string[];
}

export interface SearchOptions {
  query?: string;
  category?: string;
  foodType?: 'all' | 'cooked' | 'raw';
  hasOilDataOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  items: IndianFoodItem[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
  stats: {
    totalRecords: number;
    cookedDishes: number;
    rawFoods: number;
    recipesWithOilData: number;
    totalAliases: number;
  };
}
