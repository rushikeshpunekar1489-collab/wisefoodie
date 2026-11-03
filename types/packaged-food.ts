export interface RawPackagedFoodRecord {
  'S.No': number;
  'Item name': string;
  'Brand_Name': string;
  Category: string;
  Sub_Category: string;
  Ingredients: string;
  Serving_Size_g: number | null;
  Calories_kcal: number | null;
  Carbohydrates_g: number | null;
  Proteins_g: number | null;
  Total_Fat_g: number | null;
  Saturated_Fat_g: number | null;
  Trans_Fat_g: number | null;
  Sugar_g: number | null;
  Sodium_mg: number | null;
  Dietary_Fiber_g: number | null;
  Cholesterol_mg: number | null;
  Calcium_mg: number | null;
  Vitamin: string | null;
  Iron_mg: number | null;
  Price_INR: number | null;
  Source_of_Data: string | null;
  Collection_Date: string | null;
  Collected_By: string | null;
  Remarks: string | null;
}

export interface PackagedFoodItem {
  id: string; // e.g. "IN-1"
  sno: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subCategory: string;
  ingredients: string;
  servingSizeG: number | null;
  caloriesKcal: number | null;
  carbohydratesG: number | null;
  proteinG: number | null;
  totalFatG: number | null;
  saturatedFatG: number | null;
  transFatG: number | null;
  sugarG: number | null;
  sodiumMg: number | null;
  dietaryFiberG: number | null;
  cholesterolMg: number | null;
  calciumMg: number | null;
  vitamin: string | null;
  ironMg: number | null;
  priceINR: number | null;
  sourceOfData: string | null;
  collectionDate: string | null;
  collectedBy: string | null;
  remarks: string | null;
  image?: string | null;
}

export interface CategorySummary {
  name: string;
  slug: string;
  productCount: number;
  brands: string[];
  icon: string;
}

export interface BrandSummary {
  name: string;
  productCount: number;
  categories: string[];
}

export interface ProductFilters {
  search?: string;
  categories?: string[];
  brands?: string[];
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minFat?: number;
  maxFat?: number;
  minSugar?: number;
  maxSugar?: number;
  minSodium?: number;
  maxSodium?: number;
  minFiber?: number;
  maxFiber?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'brand' | 'calories' | 'protein' | 'sugar' | 'price' | 'sno';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ComparisonHighlight {
  highestProteinId: string | null;
  lowestSugarId: string | null;
  lowestCalorieId: string | null;
  lowestSodiumId: string | null;
}

export interface ComparisonResult {
  products: PackagedFoodItem[];
  highlights: ComparisonHighlight;
}

export interface AggregateStatistics {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
  avgCalories: number;
  avgProtein: number;
  avgSugar: number;
  avgPrice: number;
  categoriesDistribution: { category: string; count: number }[];
  topBrands: { brand: string; count: number }[];
  avgCaloriesByCategory: { category: string; avgCalories: number }[];
  avgProteinByCategory: { category: string; avgProtein: number }[];
  avgSugarByCategory: { category: string; avgSugar: number }[];
  priceDistribution: { range: string; count: number }[];
}
