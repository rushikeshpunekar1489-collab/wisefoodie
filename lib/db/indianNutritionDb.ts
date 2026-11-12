import fs from 'fs';
import path from 'path';
import type {
  IndianFoodItem,
  SearchOptions,
  SearchResponse,
} from '@/types/nutrition-db';

class IndianNutritionDatabase {
  private items: IndianFoodItem[] = [];
  private byId = new Map<string, IndianFoodItem>();
  private byCode = new Map<string, IndianFoodItem>();
  private initialized = false;
  private filePath = path.join(process.cwd(), 'data', 'indian_nutrition_db.json');

  constructor() {
    this.init();
  }

  public init(forceReload = false): void {
    if (this.initialized && !forceReload) return;

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.items = JSON.parse(raw);
        this.rebuildIndexes();
        this.initialized = true;
      } else {
        console.warn(`[IndianNutritionDatabase] File not found at ${this.filePath}`);
      }
    } catch (err) {
      console.error('[IndianNutritionDatabase] Failed to load dataset:', err);
    }
  }

  private rebuildIndexes(): void {
    this.byId.clear();
    this.byCode.clear();

    for (const item of this.items) {
      this.byId.set(item.id.toLowerCase(), item);
      this.byCode.set(item.code.toLowerCase(), item);
    }
  }

  public getAll(): IndianFoodItem[] {
    this.init();
    return this.items;
  }

  public getById(idOrCode: string): IndianFoodItem | null {
    this.init();
    if (!idOrCode) return null;
    const key = idOrCode.trim().toLowerCase();

    if (this.byId.has(key)) return this.byId.get(key)!;
    if (this.byCode.has(key)) return this.byCode.get(key)!;

    // Remove any prefixes
    const cleanKey = key.replace(/^(indb|nin)-/i, '');
    if (this.byCode.has(cleanKey)) return this.byCode.get(cleanKey)!;

    // Search by exact name
    const found = this.items.find(
      i => i.name.toLowerCase() === key || i.nameEn.toLowerCase() === key
    );
    return found || null;
  }

  public getStats() {
    this.init();
    const cookedCount = this.items.filter(i => i.foodType === 'cooked').length;
    const rawCount = this.items.filter(i => i.foodType === 'raw').length;
    const oilCount = this.items.filter(i => i.oilBreakdown?.available).length;
    const aliasSet = new Set<string>();
    for (const item of this.items) {
      for (const a of item.aliases || []) {
        aliasSet.add(a.toLowerCase());
      }
    }

    return {
      totalRecords: this.items.length,
      cookedDishes: cookedCount,
      rawFoods: rawCount,
      recipesWithOilData: oilCount,
      totalAliases: aliasSet.size,
      dataSources: [
        {
          name: 'Art & Science of Cooking (ASC 5th Ed.)',
          type: 'Cooked Indian Recipes',
          count: 490,
          citation: 'Khanna K, Gupta S, Seth R et al. The Art & Science of Cooking. 5th Ed. Elite Publishing, 2007.',
        },
        {
          name: 'Basic Food Preparation (BFP 4th Ed.)',
          type: 'Cooked Indian Recipes',
          count: 376,
          citation: 'Raina U, Kashyap S, Narula V et al. Basic Food Preparation. 4th Ed. Orient BlackSwan, 2011.',
        },
        {
          name: 'Open Source Recipes (INDB OSR)',
          type: 'Cooked Indian Recipes',
          count: 148,
          citation: 'Vikas Rawal et al., Indian Nutrient Databank (INDB).',
        },
        {
          name: 'ICMR-NIN Indian Food Composition Tables (IFCT 2017)',
          type: 'Raw Indian Foods & Single Ingredients',
          count: 897,
          citation: 'Longvah T, Ananthan R, Bhaskarachary K, Venkaiah K. Indian Food Composition Tables. National Institute of Nutrition (ICMR), 2017.',
        },
      ],
    };
  }

  public getCategories(): { name: string; count: number; type: 'cooked' | 'raw' | 'all' }[] {
    this.init();
    const map = new Map<string, { count: number; type: 'cooked' | 'raw' | 'all' }>();

    for (const item of this.items) {
      const cat = item.foodGroup || item.category || 'Other';
      const existing = map.get(cat) || { count: 0, type: item.foodType };
      existing.count += 1;
      map.set(cat, existing);
    }

    return Array.from(map.entries())
      .map(([name, val]) => ({ name, count: val.count, type: val.type }))
      .sort((a, b) => b.count - a.count);
  }

  public search(options: SearchOptions = {}): SearchResponse {
    this.init();
    const {
      query = '',
      category,
      foodType = 'all',
      hasOilDataOnly = false,
      page = 1,
      limit = 20,
    } = options;

    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    let candidates = this.items;

    // Filter by foodType
    if (foodType !== 'all') {
      candidates = candidates.filter(i => i.foodType === foodType);
    }

    // Filter by oil data
    if (hasOilDataOnly) {
      candidates = candidates.filter(i => i.oilBreakdown?.available);
    }

    // Filter by category
    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      candidates = candidates.filter(
        i =>
          (i.foodGroup && i.foodGroup.toLowerCase() === catLower) ||
          (i.category && i.category.toLowerCase().includes(catLower))
      );
    }

    // If query is empty, return paginated candidates
    if (!q) {
      const total = candidates.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const items = candidates.slice(start, start + limit);

      return {
        items,
        total,
        page,
        totalPages,
        query: '',
        stats: this.getStats(),
      };
    }

    // Scored Search with Ranking & Multilingual Aliases
    const scored: { item: IndianFoodItem; score: number }[] = [];

    for (const item of candidates) {
      let score = 0;
      const name = item.name.toLowerCase();
      const nameEn = (item.nameEn || '').toLowerCase();
      const nameLocal = (item.nameLocal || '').toLowerCase();
      const aliases = item.aliases || [];

      // 1. Exact match on full query
      if (name === q || nameEn === q || nameLocal === q) {
        score += 250;
      } else if (name.startsWith(q) || nameEn.startsWith(q) || nameLocal.startsWith(q)) {
        score += 150;
      } else if (name.includes(q) || nameEn.includes(q) || nameLocal.includes(q)) {
        score += 90;
      }

      // 2. Exact match in aliases
      if (aliases.some((a: string) => a.toLowerCase() === q)) {
        score += 120;
      } else if (aliases.some((a: string) => a.toLowerCase().startsWith(q))) {
        score += 70;
      } else if (aliases.some((a: string) => a.toLowerCase().includes(q))) {
        score += 40;
      }

      // 3. Token matches across name, local name, and aliases
      let matchedTokens = 0;
      for (const token of tokens) {
        let tokenFound = false;
        if (name.includes(token) || nameEn.includes(token) || nameLocal.includes(token)) {
          tokenFound = true;
          score += 35;
        } else if (aliases.some((a: string) => a.toLowerCase().includes(token))) {
          tokenFound = true;
          score += 25;
        }

        if (tokenFound) {
          matchedTokens++;
        }
      }

      // Multi-token completion bonus
      if (matchedTokens === tokens.length && tokens.length > 1) {
        score += 60;
      }

      // Ingredients match bonus for recipes
      if (item.ingredients && item.ingredients.length > 0) {
        for (const ing of item.ingredients) {
          const ingName = ing.name.toLowerCase();
          if (ingName.includes(q)) {
            score += 20;
            break;
          }
        }
      }

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    const total = scored.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = scored.slice(start, start + limit).map(s => s.item);

    return {
      items,
      total,
      page,
      totalPages,
      query,
      stats: this.getStats(),
    };
  }
}

export const indianNutritionDb = new IndianNutritionDatabase();
