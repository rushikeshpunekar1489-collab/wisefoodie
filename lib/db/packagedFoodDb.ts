import fs from 'fs';
import path from 'path';
import type {
  RawPackagedFoodRecord,
  PackagedFoodItem,
  CategorySummary,
  BrandSummary,
  ProductFilters,
  PaginatedResult,
  ComparisonResult,
  ComparisonHighlight,
  AggregateStatistics,
} from '@/types/packaged-food';
import { CATEGORY_ICONS, slugify, categoryToSlug, slugToCategory } from '@/lib/foodConstants';

export { CATEGORY_ICONS, slugify, categoryToSlug, slugToCategory };

class PackagedFoodDatabase {
  private items: PackagedFoodItem[] = [];
  private byId = new Map<string, PackagedFoodItem>();
  private bySno = new Map<number, PackagedFoodItem>();
  private bySlug = new Map<string, PackagedFoodItem>();
  private byCategory = new Map<string, PackagedFoodItem[]>();
  private byBrand = new Map<string, PackagedFoodItem[]>();
  private bySubcategory = new Map<string, PackagedFoodItem[]>();
  private initialized = false;
  private filePath = path.join(process.cwd(), 'data', 'packaged_foods_india.json');
  private imageMap = new Map<string, string>();

  constructor() {
    this.init();
  }

  public init(forceReload = false): void {
    if (this.initialized && !forceReload) return;

    try {
      // Load verified image associations from products.json
      const prodPath = path.join(process.cwd(), 'data', 'products.json');
      if (fs.existsSync(prodPath)) {
        try {
          const prods = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
          if (Array.isArray(prods)) {
            for (const p of prods) {
              if (p && p.id && p.image) {
                this.imageMap.set(p.id, p.image);
              }
            }
          }
        } catch (e) {
          console.warn('[PackagedFoodDatabase] Failed to load image map:', e);
        }
      }

      if (fs.existsSync(this.filePath)) {
        const rawContent = fs.readFileSync(this.filePath, 'utf8');
        const rawRecords: RawPackagedFoodRecord[] = JSON.parse(rawContent);
        this.items = rawRecords.map(rec => this.normalizeRecord(rec));
        this.rebuildIndexes();
        this.initialized = true;
      } else {
        console.warn(`[PackagedFoodDatabase] File not found at ${this.filePath}`);
      }
    } catch (err) {
      console.error('[PackagedFoodDatabase] Failed to load dataset:', err);
    }
  }

  private normalizeRecord(raw: RawPackagedFoodRecord): PackagedFoodItem {
    const sno = Number(raw['S.No']);
    const name = String(raw['Item name'] || '').trim();
    const brand = String(raw['Brand_Name'] || '').trim();
    const category = String(raw['Category'] || '').trim();
    const subCategory = String(raw['Sub_Category'] || '').trim();
    const id = `IN-${sno}`;
    const slug = `${slugify(brand)}-${slugify(name)}-${sno}`;

    return {
      id,
      sno,
      name,
      slug,
      brand,
      category,
      subCategory,
      ingredients: String(raw['Ingredients'] || '').trim(),
      servingSizeG: raw['Serving_Size_g'] !== null && raw['Serving_Size_g'] !== undefined ? Number(raw['Serving_Size_g']) : null,
      caloriesKcal: raw['Calories_kcal'] !== null && raw['Calories_kcal'] !== undefined ? Number(raw['Calories_kcal']) : null,
      carbohydratesG: raw['Carbohydrates_g'] !== null && raw['Carbohydrates_g'] !== undefined ? Number(raw['Carbohydrates_g']) : null,
      proteinG: raw['Proteins_g'] !== null && raw['Proteins_g'] !== undefined ? Number(raw['Proteins_g']) : null,
      totalFatG: raw['Total_Fat_g'] !== null && raw['Total_Fat_g'] !== undefined ? Number(raw['Total_Fat_g']) : null,
      saturatedFatG: raw['Saturated_Fat_g'] !== null && raw['Saturated_Fat_g'] !== undefined ? Number(raw['Saturated_Fat_g']) : null,
      transFatG: raw['Trans_Fat_g'] !== null && raw['Trans_Fat_g'] !== undefined ? Number(raw['Trans_Fat_g']) : null,
      sugarG: raw['Sugar_g'] !== null && raw['Sugar_g'] !== undefined ? Number(raw['Sugar_g']) : null,
      sodiumMg: raw['Sodium_mg'] !== null && raw['Sodium_mg'] !== undefined ? Number(raw['Sodium_mg']) : null,
      dietaryFiberG: raw['Dietary_Fiber_g'] !== null && raw['Dietary_Fiber_g'] !== undefined ? Number(raw['Dietary_Fiber_g']) : null,
      cholesterolMg: raw['Cholesterol_mg'] !== null && raw['Cholesterol_mg'] !== undefined ? Number(raw['Cholesterol_mg']) : null,
      calciumMg: raw['Calcium_mg'] !== null && raw['Calcium_mg'] !== undefined ? Number(raw['Calcium_mg']) : null,
      vitamin: raw['Vitamin'] !== null && raw['Vitamin'] !== undefined ? String(raw['Vitamin']).trim() : null,
      ironMg: raw['Iron_mg'] !== null && raw['Iron_mg'] !== undefined ? Number(raw['Iron_mg']) : null,
      priceINR: raw['Price_INR'] !== null && raw['Price_INR'] !== undefined ? Number(raw['Price_INR']) : null,
      sourceOfData: raw['Source_of_Data'] !== null && raw['Source_of_Data'] !== undefined ? String(raw['Source_of_Data']).trim() : null,
      collectionDate: raw['Collection_Date'] !== null && raw['Collection_Date'] !== undefined ? String(raw['Collection_Date']).trim() : null,
      collectedBy: raw['Collected_By'] !== null && raw['Collected_By'] !== undefined ? String(raw['Collected_By']).trim() : null,
      remarks: raw['Remarks'] !== null && raw['Remarks'] !== undefined ? String(raw['Remarks']).trim() : null,
      image: this.imageMap.get(id) || null,
    };
  }

  private rebuildIndexes(): void {
    this.byId.clear();
    this.bySno.clear();
    this.bySlug.clear();
    this.byCategory.clear();
    this.byBrand.clear();
    this.bySubcategory.clear();

    for (const item of this.items) {
      this.byId.set(item.id, item);
      this.bySno.set(item.sno, item);
      this.bySlug.set(item.slug, item);

      // By Category
      const catList = this.byCategory.get(item.category) || [];
      catList.push(item);
      this.byCategory.set(item.category, catList);

      // By Brand
      const brandList = this.byBrand.get(item.brand) || [];
      brandList.push(item);
      this.byBrand.set(item.brand, brandList);

      // By Subcategory
      const subList = this.bySubcategory.get(item.subCategory) || [];
      subList.push(item);
      this.bySubcategory.set(item.subCategory, subList);
    }
  }

  public getAll(): PackagedFoodItem[] {
    this.init();
    return [...this.items];
  }

  public getById(idOrSlugOrSno: string | number): PackagedFoodItem | null {
    this.init();
    if (typeof idOrSlugOrSno === 'number') {
      return this.bySno.get(idOrSlugOrSno) || null;
    }

    const trimmed = String(idOrSlugOrSno).trim();
    if (this.byId.has(trimmed)) return this.byId.get(trimmed)!;
    if (this.bySlug.has(trimmed.toLowerCase())) return this.bySlug.get(trimmed.toLowerCase())!;

    // Check if numeric string
    const num = parseInt(trimmed.replace(/^in-/i, ''), 10);
    if (!isNaN(num) && this.bySno.has(num)) {
      return this.bySno.get(num)!;
    }

    // Fallback: search by exact name case-insensitive
    const found = this.items.find(
      i => i.name.toLowerCase() === trimmed.toLowerCase() || i.slug.toLowerCase() === trimmed.toLowerCase()
    );
    return found || null;
  }

  public getCategories(): CategorySummary[] {
    this.init();
    const categories: CategorySummary[] = [];

    for (const [name, items] of this.byCategory.entries()) {
      const brandsSet = new Set<string>();
      items.forEach(i => brandsSet.add(i.brand));

      categories.push({
        name,
        slug: categoryToSlug(name),
        productCount: items.length,
        brands: Array.from(brandsSet).sort(),
        icon: CATEGORY_ICONS[name] || '🍽️',
      });
    }

    return categories.sort((a, b) => b.productCount - a.productCount);
  }

  public getBrands(): BrandSummary[] {
    this.init();
    const brands: BrandSummary[] = [];

    for (const [name, items] of this.byBrand.entries()) {
      const catSet = new Set<string>();
      items.forEach(i => catSet.add(i.category));

      brands.push({
        name,
        productCount: items.length,
        categories: Array.from(catSet).sort(),
      });
    }

    return brands.sort((a, b) => b.productCount - a.productCount);
  }

  public search(query: string, limit = 20): { items: PackagedFoodItem[]; total: number; query: string } {
    this.init();
    const q = query.trim().toLowerCase();
    if (!q) {
      return { items: this.items.slice(0, limit), total: this.items.length, query: '' };
    }

    const tokens = q.split(/\s+/).filter(Boolean);

    const scored: { item: PackagedFoodItem; score: number }[] = [];

    for (const item of this.items) {
      let score = 0;
      const name = item.name.toLowerCase();
      const brand = item.brand.toLowerCase();
      const cat = item.category.toLowerCase();
      const sub = item.subCategory.toLowerCase();
      const ing = item.ingredients.toLowerCase();

      // Exact phrase bonus
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 50;
      else if (name.includes(q)) score += 30;

      if (brand === q) score += 60;
      else if (brand.startsWith(q)) score += 35;
      else if (brand.includes(q)) score += 20;

      if (cat.includes(q)) score += 15;
      if (sub.includes(q)) score += 15;
      if (ing.includes(q)) score += 10;

      // Token matches
      let matchedTokens = 0;
      for (const token of tokens) {
        if (name.includes(token) || brand.includes(token) || cat.includes(token) || sub.includes(token) || ing.includes(token)) {
          matchedTokens++;
        }
      }

      if (matchedTokens === tokens.length) {
        score += matchedTokens * 5;
      }

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const total = scored.length;
    const items = scored.slice(0, limit).map(s => s.item);

    return { items, total, query };
  }

  public filter(filters: ProductFilters): PaginatedResult<PackagedFoodItem> {
    this.init();
    let result = [...this.items];

    // Search query filter
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      result = result.filter(item => {
        const name = item.name.toLowerCase();
        const brand = item.brand.toLowerCase();
        const cat = item.category.toLowerCase();
        const sub = item.subCategory.toLowerCase();
        const ing = item.ingredients.toLowerCase();
        return tokens.every(token =>
          name.includes(token) || brand.includes(token) || cat.includes(token) || sub.includes(token) || ing.includes(token)
        );
      });
    }

    // Category filter (multiselect)
    if (filters.categories && filters.categories.length > 0) {
      const allowed = new Set(filters.categories.map(c => c.toUpperCase()));
      result = result.filter(item => allowed.has(item.category.toUpperCase()));
    }

    // Brand filter (multiselect)
    if (filters.brands && filters.brands.length > 0) {
      const allowed = new Set(filters.brands.map(b => b.toUpperCase()));
      result = result.filter(item => allowed.has(item.brand.toUpperCase()));
    }

    // Nutrient filters: Missing values (null) are strictly NOT treated as zero!
    // If a range is specified, only items with a non-null value within range are included.
    if (filters.minCalories !== undefined) {
      result = result.filter(item => item.caloriesKcal !== null && item.caloriesKcal >= filters.minCalories!);
    }
    if (filters.maxCalories !== undefined) {
      result = result.filter(item => item.caloriesKcal !== null && item.caloriesKcal <= filters.maxCalories!);
    }

    if (filters.minProtein !== undefined) {
      result = result.filter(item => item.proteinG !== null && item.proteinG >= filters.minProtein!);
    }
    if (filters.maxProtein !== undefined) {
      result = result.filter(item => item.proteinG !== null && item.proteinG <= filters.maxProtein!);
    }

    if (filters.minCarbs !== undefined) {
      result = result.filter(item => item.carbohydratesG !== null && item.carbohydratesG >= filters.minCarbs!);
    }
    if (filters.maxCarbs !== undefined) {
      result = result.filter(item => item.carbohydratesG !== null && item.carbohydratesG <= filters.maxCarbs!);
    }

    if (filters.minFat !== undefined) {
      result = result.filter(item => item.totalFatG !== null && item.totalFatG >= filters.minFat!);
    }
    if (filters.maxFat !== undefined) {
      result = result.filter(item => item.totalFatG !== null && item.totalFatG <= filters.maxFat!);
    }

    if (filters.minSugar !== undefined) {
      result = result.filter(item => item.sugarG !== null && item.sugarG >= filters.minSugar!);
    }
    if (filters.maxSugar !== undefined) {
      result = result.filter(item => item.sugarG !== null && item.sugarG <= filters.maxSugar!);
    }

    if (filters.minSodium !== undefined) {
      result = result.filter(item => item.sodiumMg !== null && item.sodiumMg >= filters.minSodium!);
    }
    if (filters.maxSodium !== undefined) {
      result = result.filter(item => item.sodiumMg !== null && item.sodiumMg <= filters.maxSodium!);
    }

    if (filters.minFiber !== undefined) {
      result = result.filter(item => item.dietaryFiberG !== null && item.dietaryFiberG >= filters.minFiber!);
    }
    if (filters.maxFiber !== undefined) {
      result = result.filter(item => item.dietaryFiberG !== null && item.dietaryFiberG <= filters.maxFiber!);
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      result = result.filter(item => item.priceINR !== null && item.priceINR >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(item => item.priceINR !== null && item.priceINR <= filters.maxPrice!);
    }

    // Sorting
    const sortBy = filters.sortBy || 'sno';
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * sortOrder;
        case 'brand':
          return a.brand.localeCompare(b.brand) * sortOrder;
        case 'calories':
          return ((a.caloriesKcal ?? -1) - (b.caloriesKcal ?? -1)) * sortOrder;
        case 'protein':
          return ((a.proteinG ?? -1) - (b.proteinG ?? -1)) * sortOrder;
        case 'sugar':
          return ((a.sugarG ?? -1) - (b.sugarG ?? -1)) * sortOrder;
        case 'price':
          return ((a.priceINR ?? -1) - (b.priceINR ?? -1)) * sortOrder;
        case 'sno':
        default:
          return (a.sno - b.sno) * sortOrder;
      }
    });

    const total = result.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 24);
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedItems = result.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  public compare(ids: string[]): ComparisonResult {
    this.init();
    const products: PackagedFoodItem[] = [];

    for (const rawId of ids.slice(0, 4)) {
      const p = this.getById(rawId);
      if (p) products.push(p);
    }

    const highlights: ComparisonHighlight = {
      highestProteinId: null,
      lowestSugarId: null,
      lowestCalorieId: null,
      lowestSodiumId: null,
    };

    if (products.length > 0) {
      // Highest protein: highest declared non-null protein
      let maxProtein = -Infinity;
      for (const p of products) {
        if (p.proteinG !== null && p.proteinG > maxProtein) {
          maxProtein = p.proteinG;
          highlights.highestProteinId = p.id;
        }
      }

      // Lowest sugar: lowest declared non-null sugar
      let minSugar = Infinity;
      for (const p of products) {
        if (p.sugarG !== null && p.sugarG < minSugar) {
          minSugar = p.sugarG;
          highlights.lowestSugarId = p.id;
        }
      }

      // Lowest calories: lowest declared non-null calories
      let minCal = Infinity;
      for (const p of products) {
        if (p.caloriesKcal !== null && p.caloriesKcal < minCal) {
          minCal = p.caloriesKcal;
          highlights.lowestCalorieId = p.id;
        }
      }

      // Lowest sodium: lowest declared non-null sodium
      let minSodium = Infinity;
      for (const p of products) {
        if (p.sodiumMg !== null && p.sodiumMg < minSodium) {
          minSodium = p.sodiumMg;
          highlights.lowestSodiumId = p.id;
        }
      }
    }

    return { products, highlights };
  }

  public getStatistics(): AggregateStatistics {
    this.init();
    const totalProducts = this.items.length;
    const brandsSet = new Set<string>();
    const categoriesMap = new Map<string, number>();
    const brandsMap = new Map<string, number>();

    let sumCal = 0, countCal = 0;
    let sumProt = 0, countProt = 0;
    let sumSug = 0, countSug = 0;
    let sumPrice = 0, countPrice = 0;

    const catCalMap = new Map<string, { sum: number; count: number }>();
    const catProtMap = new Map<string, { sum: number; count: number }>();
    const catSugMap = new Map<string, { sum: number; count: number }>();

    const priceBuckets = {
      'Under ₹20': 0,
      '₹20 - ₹50': 0,
      '₹50 - ₹100': 0,
      '₹100 - ₹200': 0,
      '₹200 - ₹500': 0,
      'Above ₹500': 0,
    };

    for (const item of this.items) {
      brandsSet.add(item.brand);
      brandsMap.set(item.brand, (brandsMap.get(item.brand) || 0) + 1);
      categoriesMap.set(item.category, (categoriesMap.get(item.category) || 0) + 1);

      if (item.caloriesKcal !== null) {
        sumCal += item.caloriesKcal;
        countCal++;
        const curr = catCalMap.get(item.category) || { sum: 0, count: 0 };
        curr.sum += item.caloriesKcal;
        curr.count++;
        catCalMap.set(item.category, curr);
      }

      if (item.proteinG !== null) {
        sumProt += item.proteinG;
        countProt++;
        const curr = catProtMap.get(item.category) || { sum: 0, count: 0 };
        curr.sum += item.proteinG;
        curr.count++;
        catProtMap.set(item.category, curr);
      }

      if (item.sugarG !== null) {
        sumSug += item.sugarG;
        countSug++;
        const curr = catSugMap.get(item.category) || { sum: 0, count: 0 };
        curr.sum += item.sugarG;
        curr.count++;
        catSugMap.set(item.category, curr);
      }

      if (item.priceINR !== null) {
        sumPrice += item.priceINR;
        countPrice++;
        const price = item.priceINR;
        if (price < 20) priceBuckets['Under ₹20']++;
        else if (price <= 50) priceBuckets['₹20 - ₹50']++;
        else if (price <= 100) priceBuckets['₹50 - ₹100']++;
        else if (price <= 200) priceBuckets['₹100 - ₹200']++;
        else if (price <= 500) priceBuckets['₹200 - ₹500']++;
        else priceBuckets['Above ₹500']++;
      }
    }

    const categoriesDistribution = Array.from(categoriesMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const topBrands = Array.from(brandsMap.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    const avgCaloriesByCategory = Array.from(catCalMap.entries())
      .map(([category, { sum, count }]) => ({
        category,
        avgCalories: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.avgCalories - a.avgCalories);

    const avgProteinByCategory = Array.from(catProtMap.entries())
      .map(([category, { sum, count }]) => ({
        category,
        avgProtein: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.avgProtein - a.avgProtein);

    const avgSugarByCategory = Array.from(catSugMap.entries())
      .map(([category, { sum, count }]) => ({
        category,
        avgSugar: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.avgSugar - a.avgSugar);

    const priceDistribution = Object.entries(priceBuckets).map(([range, count]) => ({
      range,
      count,
    }));

    return {
      totalProducts,
      totalBrands: brandsSet.size,
      totalCategories: categoriesMap.size,
      avgCalories: countCal > 0 ? Math.round((sumCal / countCal) * 10) / 10 : 0,
      avgProtein: countProt > 0 ? Math.round((sumProt / countProt) * 10) / 10 : 0,
      avgSugar: countSug > 0 ? Math.round((sumSug / countSug) * 10) / 10 : 0,
      avgPrice: countPrice > 0 ? Math.round((sumPrice / countPrice) * 10) / 10 : 0,
      categoriesDistribution,
      topBrands,
      avgCaloriesByCategory,
      avgProteinByCategory,
      avgSugarByCategory,
      priceDistribution,
    };
  }

  public create(data: Partial<PackagedFoodItem>): { success: boolean; item?: PackagedFoodItem; error?: string } {
    this.init();
    if (!data.name || !data.name.trim()) return { success: false, error: 'Product name is required.' };
    if (!data.brand || !data.brand.trim()) return { success: false, error: 'Brand name is required.' };
    if (!data.category || !data.category.trim()) return { success: false, error: 'Category is required.' };

    const maxSno = this.items.reduce((max, i) => Math.max(max, i.sno), 0);
    const sno = maxSno + 1;
    const id = `IN-${sno}`;
    const slug = `${slugify(data.brand)}-${slugify(data.name)}-${sno}`;

    // Duplicate check
    const isDup = this.items.some(
      i => i.name.toLowerCase() === data.name!.trim().toLowerCase() && i.brand.toLowerCase() === data.brand!.trim().toLowerCase()
    );
    if (isDup) {
      return { success: false, error: `Product with name "${data.name}" and brand "${data.brand}" already exists.` };
    }

    const newItem: PackagedFoodItem = {
      id,
      sno,
      name: data.name.trim(),
      slug,
      brand: data.brand.trim(),
      category: data.category.trim().toUpperCase(),
      subCategory: (data.subCategory || '').trim(),
      ingredients: (data.ingredients || '').trim(),
      servingSizeG: data.servingSizeG ?? null,
      caloriesKcal: data.caloriesKcal ?? null,
      carbohydratesG: data.carbohydratesG ?? null,
      proteinG: data.proteinG ?? null,
      totalFatG: data.totalFatG ?? null,
      saturatedFatG: data.saturatedFatG ?? null,
      transFatG: data.transFatG ?? null,
      sugarG: data.sugarG ?? null,
      sodiumMg: data.sodiumMg ?? null,
      dietaryFiberG: data.dietaryFiberG ?? null,
      cholesterolMg: data.cholesterolMg ?? null,
      calciumMg: data.calciumMg ?? null,
      vitamin: data.vitamin ? String(data.vitamin).trim() : null,
      ironMg: data.ironMg ?? null,
      priceINR: data.priceINR ?? null,
      sourceOfData: data.sourceOfData ?? null,
      collectionDate: data.collectionDate ?? new Date().toISOString().split('T')[0],
      collectedBy: data.collectedBy ?? 'ADMIN',
      remarks: data.remarks ?? null,
      image: data.image ?? null,
    };

    this.items.push(newItem);
    this.rebuildIndexes();
    this.persistToFile();
    return { success: true, item: newItem };
  }

  public update(id: string, data: Partial<PackagedFoodItem>): { success: boolean; item?: PackagedFoodItem; error?: string } {
    this.init();
    const existing = this.getById(id);
    if (!existing) return { success: false, error: `Product not found: ${id}` };

    const index = this.items.findIndex(i => i.id === existing.id);
    if (index === -1) return { success: false, error: 'Product not found in database array.' };

    const updated: PackagedFoodItem = {
      ...existing,
      ...data,
      id: existing.id,
      sno: existing.sno, // keep original sno
      slug: data.name || data.brand ? `${slugify(data.brand || existing.brand)}-${slugify(data.name || existing.name)}-${existing.sno}` : existing.slug,
    };

    this.items[index] = updated;
    this.rebuildIndexes();
    this.persistToFile();
    return { success: true, item: updated };
  }

  public delete(id: string): { success: boolean; error?: string } {
    this.init();
    const existing = this.getById(id);
    if (!existing) return { success: false, error: `Product not found: ${id}` };

    this.items = this.items.filter(i => i.id !== existing.id);
    this.rebuildIndexes();
    this.persistToFile();
    return { success: true };
  }

  public bulkImport(newRecords: any[], mode: 'merge' | 'replace' = 'merge'): { success: boolean; imported: number; errors: string[] } {
    this.init();
    const errors: string[] = [];
    const validItems: PackagedFoodItem[] = [];

    let currentSno = mode === 'replace' ? 0 : this.items.reduce((max, i) => Math.max(max, i.sno), 0);

    for (let idx = 0; idx < newRecords.length; idx++) {
      const rec = newRecords[idx];
      const name = rec['Item name'] || rec.name;
      const brand = rec['Brand_Name'] || rec.brand;
      const cat = rec['Category'] || rec.category;

      if (!name || !String(name).trim()) {
        errors.push(`Row ${idx + 1}: Missing Product Name.`);
        continue;
      }
      if (!brand || !String(brand).trim()) {
        errors.push(`Row ${idx + 1}: Missing Brand Name.`);
        continue;
      }
      if (!cat || !String(cat).trim()) {
        errors.push(`Row ${idx + 1}: Missing Category.`);
        continue;
      }

      currentSno++;
      const sno = Number(rec['S.No'] || rec.sno || currentSno);
      const id = `IN-${sno}`;
      const slug = `${slugify(String(brand))}-${slugify(String(name))}-${sno}`;

      const item: PackagedFoodItem = {
        id,
        sno,
        name: String(name).trim(),
        slug,
        brand: String(brand).trim(),
        category: String(cat).trim().toUpperCase(),
        subCategory: String(rec['Sub_Category'] || rec.subCategory || '').trim(),
        ingredients: String(rec['Ingredients'] || rec.ingredients || '').trim(),
        servingSizeG: rec['Serving_Size_g'] ?? rec.servingSizeG ?? null,
        caloriesKcal: rec['Calories_kcal'] ?? rec.caloriesKcal ?? null,
        carbohydratesG: rec['Carbohydrates_g'] ?? rec.carbohydratesG ?? null,
        proteinG: rec['Proteins_g'] ?? rec.proteinG ?? null,
        totalFatG: rec['Total_Fat_g'] ?? rec.totalFatG ?? null,
        saturatedFatG: rec['Saturated_Fat_g'] ?? rec.saturatedFatG ?? null,
        transFatG: rec['Trans_Fat_g'] ?? rec.transFatG ?? null,
        sugarG: rec['Sugar_g'] ?? rec.sugarG ?? null,
        sodiumMg: rec['Sodium_mg'] ?? rec.sodiumMg ?? null,
        dietaryFiberG: rec['Dietary_Fiber_g'] ?? rec.dietaryFiberG ?? null,
        cholesterolMg: rec['Cholesterol_mg'] ?? rec.cholesterolMg ?? null,
        calciumMg: rec['Calcium_mg'] ?? rec.calciumMg ?? null,
        vitamin: rec['Vitamin'] ?? rec.vitamin ?? null,
        ironMg: rec['Iron_mg'] ?? rec.ironMg ?? null,
        priceINR: rec['Price_INR'] ?? rec.priceINR ?? null,
        sourceOfData: rec['Source_of_Data'] ?? rec.sourceOfData ?? null,
        collectionDate: rec['Collection_Date'] ?? rec.collectionDate ?? null,
        collectedBy: rec['Collected_By'] ?? rec.collectedBy ?? null,
        remarks: rec['Remarks'] ?? rec.remarks ?? null,
        image: null,
      };

      validItems.push(item);
    }

    if (mode === 'replace') {
      this.items = validItems;
    } else {
      for (const item of validItems) {
        // deduplicate by name + brand
        const existingIdx = this.items.findIndex(
          i => i.name.toLowerCase() === item.name.toLowerCase() && i.brand.toLowerCase() === item.brand.toLowerCase()
        );
        if (existingIdx !== -1) {
          this.items[existingIdx] = { ...this.items[existingIdx], ...item, id: this.items[existingIdx].id, sno: this.items[existingIdx].sno };
        } else {
          this.items.push(item);
        }
      }
    }

    this.rebuildIndexes();
    this.persistToFile();

    return {
      success: true,
      imported: validItems.length,
      errors,
    };
  }

  public export(format: 'json' | 'csv'): string {
    this.init();
    if (format === 'json') {
      // Export in raw format matching packaged_foods_india.json
      const rawRecords: RawPackagedFoodRecord[] = this.items.map(item => ({
        'S.No': item.sno,
        'Item name': item.name,
        'Brand_Name': item.brand,
        Category: item.category,
        Sub_Category: item.subCategory,
        Ingredients: item.ingredients,
        Serving_Size_g: item.servingSizeG,
        Calories_kcal: item.caloriesKcal,
        Carbohydrates_g: item.carbohydratesG,
        Proteins_g: item.proteinG,
        Total_Fat_g: item.totalFatG,
        Saturated_Fat_g: item.saturatedFatG,
        Trans_Fat_g: item.transFatG,
        Sugar_g: item.sugarG,
        Sodium_mg: item.sodiumMg,
        Dietary_Fiber_g: item.dietaryFiberG,
        Cholesterol_mg: item.cholesterolMg,
        Calcium_mg: item.calciumMg,
        Vitamin: item.vitamin,
        Iron_mg: item.ironMg,
        Price_INR: item.priceINR,
        Source_of_Data: item.sourceOfData,
        Collection_Date: item.collectionDate,
        Collected_By: item.collectedBy,
        Remarks: item.remarks,
      }));
      return JSON.stringify(rawRecords, null, 2);
    }

    // CSV format
    const headers = [
      'S.No', 'Item name', 'Brand_Name', 'Category', 'Sub_Category', 'Ingredients',
      'Serving_Size_g', 'Calories_kcal', 'Carbohydrates_g', 'Proteins_g', 'Total_Fat_g',
      'Saturated_Fat_g', 'Trans_Fat_g', 'Sugar_g', 'Sodium_mg', 'Dietary_Fiber_g',
      'Cholesterol_mg', 'Calcium_mg', 'Vitamin', 'Iron_mg', 'Price_INR',
      'Source_of_Data', 'Collection_Date', 'Collected_By', 'Remarks'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = this.items.map(i => [
      i.sno,
      escapeCsv(i.name),
      escapeCsv(i.brand),
      escapeCsv(i.category),
      escapeCsv(i.subCategory),
      escapeCsv(i.ingredients),
      i.servingSizeG ?? '',
      i.caloriesKcal ?? '',
      i.carbohydratesG ?? '',
      i.proteinG ?? '',
      i.totalFatG ?? '',
      i.saturatedFatG ?? '',
      i.transFatG ?? '',
      i.sugarG ?? '',
      i.sodiumMg ?? '',
      i.dietaryFiberG ?? '',
      i.cholesterolMg ?? '',
      i.calciumMg ?? '',
      escapeCsv(i.vitamin ?? ''),
      i.ironMg ?? '',
      i.priceINR ?? '',
      escapeCsv(i.sourceOfData ?? ''),
      escapeCsv(i.collectionDate ?? ''),
      escapeCsv(i.collectedBy ?? ''),
      escapeCsv(i.remarks ?? '')
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  public persistToFile(): void {
    try {
      const rawRecords: RawPackagedFoodRecord[] = this.items.map(item => ({
        'S.No': item.sno,
        'Item name': item.name,
        'Brand_Name': item.brand,
        Category: item.category,
        Sub_Category: item.subCategory,
        Ingredients: item.ingredients,
        Serving_Size_g: item.servingSizeG,
        Calories_kcal: item.caloriesKcal,
        Carbohydrates_g: item.carbohydratesG,
        Proteins_g: item.proteinG,
        Total_Fat_g: item.totalFatG,
        Saturated_Fat_g: item.saturatedFatG,
        Trans_Fat_g: item.transFatG,
        Sugar_g: item.sugarG,
        Sodium_mg: item.sodiumMg,
        Dietary_Fiber_g: item.dietaryFiberG,
        Cholesterol_mg: item.cholesterolMg,
        Calcium_mg: item.calciumMg,
        Vitamin: item.vitamin,
        Iron_mg: item.ironMg,
        Price_INR: item.priceINR,
        Source_of_Data: item.sourceOfData,
        Collection_Date: item.collectionDate,
        Collected_By: item.collectedBy,
        Remarks: item.remarks,
      }));

      fs.writeFileSync(this.filePath, JSON.stringify(rawRecords, null, 2), 'utf8');
    } catch (err) {
      console.error('[PackagedFoodDatabase] Failed to persist file:', err);
    }
  }
}

// Global singleton instance
export const packagedFoodDb = new PackagedFoodDatabase();
