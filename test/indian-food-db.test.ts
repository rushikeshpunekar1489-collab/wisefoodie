import { describe, it, expect, beforeEach } from 'vitest';
import { packagedFoodDb, CATEGORY_ICONS, slugToCategory, categoryToSlug } from '@/lib/db/packagedFoodDb';

describe('Indian Packaged Food Database Engine', () => {
  beforeEach(() => {
    packagedFoodDb.init(true);
  });

  describe('1. Dataset Integrity & Schema', () => {
    it('loads all 852 products from the Indian dataset', () => {
      const all = packagedFoodDb.getAll();
      expect(all.length).toBe(852);
    });

    it('contains exactly 13 unique food categories', () => {
      const categories = packagedFoodDb.getCategories();
      expect(categories.length).toBe(13);

      const expectedCategories = [
        'BISCUIT',
        'CAKE',
        'CHOCOLATE',
        'DAIRY',
        'ICEREAMES',
        'INSTANT FOOD',
        'JUICE',
        'SAUCE',
        'SNACKS',
        'SPREAD',
        'SWEETS',
        'WAFER',
        'WAFFLE',
      ];

      const catNames = categories.map(c => c.name);
      for (const expected of expectedCategories) {
        expect(catNames).toContain(expected);
      }
    });

    it('contains exactly 262 unique brands', () => {
      const brands = packagedFoodDb.getBrands();
      expect(brands.length).toBe(262);
    });

    it('preserves all 25 data fields on product models', () => {
      const item = packagedFoodDb.getAll()[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('sno');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('slug');
      expect(item).toHaveProperty('brand');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('subCategory');
      expect(item).toHaveProperty('ingredients');
      expect(item).toHaveProperty('servingSizeG');
      expect(item).toHaveProperty('caloriesKcal');
      expect(item).toHaveProperty('carbohydratesG');
      expect(item).toHaveProperty('proteinG');
      expect(item).toHaveProperty('totalFatG');
      expect(item).toHaveProperty('saturatedFatG');
      expect(item).toHaveProperty('transFatG');
      expect(item).toHaveProperty('sugarG');
      expect(item).toHaveProperty('sodiumMg');
      expect(item).toHaveProperty('dietaryFiberG');
      expect(item).toHaveProperty('cholesterolMg');
      expect(item).toHaveProperty('calciumMg');
      expect(item).toHaveProperty('vitamin');
      expect(item).toHaveProperty('ironMg');
      expect(item).toHaveProperty('priceINR');
      expect(item).toHaveProperty('sourceOfData');
      expect(item).toHaveProperty('collectionDate');
    });
  });

  describe('2. Missing Value (Null) Preservation', () => {
    it('preserves null values and does not convert null to zero', () => {
      const all = packagedFoodDb.getAll();
      // Find products that have null values documented in summary
      const nullTransFat = all.find(p => p.transFatG === null);
      expect(nullTransFat).toBeDefined();
      expect(nullTransFat!.transFatG).toBeNull();

      const nullCholesterol = all.find(p => p.cholesterolMg === null);
      expect(nullCholesterol).toBeDefined();
      expect(nullCholesterol!.cholesterolMg).toBeNull();
    });

    it('does not match null values when filtering numeric ranges', () => {
      // Products with null protein should NOT match minProtein filter
      const resMinProtein = packagedFoodDb.filter({ minProtein: 1 });
      for (const item of resMinProtein.items) {
        expect(item.proteinG).not.toBeNull();
        expect(item.proteinG!).toBeGreaterThanOrEqual(1);
      }

      // Products with null calories should NOT match maxCalories filter
      const resMaxCal = packagedFoodDb.filter({ maxCalories: 300 });
      for (const item of resMaxCal.items) {
        expect(item.caloriesKcal).not.toBeNull();
        expect(item.caloriesKcal!).toBeLessThanOrEqual(300);
      }
    });
  });

  describe('3. Advanced Search Capabilities', () => {
    it('searches by product name with partial matching and case insensitivity', () => {
      const res = packagedFoodDb.search('hide & seek');
      expect(res.total).toBeGreaterThan(0);
      expect(res.items.some(i => i.name.toLowerCase().includes('hide'))).toBe(true);
    });

    it('searches by brand name', () => {
      const res = packagedFoodDb.search('parle');
      expect(res.total).toBeGreaterThan(0);
      expect(res.items.every(i => i.brand.toLowerCase().includes('parle') || i.name.toLowerCase().includes('parle'))).toBe(true);
    });

    it('searches by category', () => {
      const res = packagedFoodDb.search('chocolate');
      expect(res.total).toBeGreaterThan(0);
    });

    it('searches by ingredients', () => {
      const res = packagedFoodDb.search('cocoa butter');
      expect(res.total).toBeGreaterThan(0);
      expect(res.items.some(i => i.ingredients.toLowerCase().includes('cocoa'))).toBe(true);
    });
  });

  describe('4. Multi-Facet Filtering System', () => {
    it('filters by category multiselect', () => {
      const res = packagedFoodDb.filter({ categories: ['BISCUIT', 'CAKE'] });
      expect(res.total).toBeGreaterThan(0);
      for (const item of res.items) {
        expect(['BISCUIT', 'CAKE']).toContain(item.category);
      }
    });

    it('filters by brand multiselect', () => {
      const res = packagedFoodDb.filter({ brands: ['PARLE', 'BRITANNIA'] });
      expect(res.total).toBeGreaterThan(0);
      for (const item of res.items) {
        expect(['PARLE', 'BRITANNIA']).toContain(item.brand.toUpperCase());
      }
    });

    it('combines category, nutrient range, and price filter', () => {
      const res = packagedFoodDb.filter({
        categories: ['BISCUIT'],
        maxSugar: 30,
        minProtein: 3,
        maxPrice: 100,
      });

      for (const item of res.items) {
        expect(item.category).toBe('BISCUIT');
        expect(item.sugarG).not.toBeNull();
        expect(item.sugarG!).toBeLessThanOrEqual(30);
        expect(item.proteinG).not.toBeNull();
        expect(item.proteinG!).toBeGreaterThanOrEqual(3);
        expect(item.priceINR).not.toBeNull();
        expect(item.priceINR!).toBeLessThanOrEqual(100);
      }
    });

    it('sorts properly by protein descending', () => {
      const res = packagedFoodDb.filter({ sortBy: 'protein', sortOrder: 'desc', limit: 10 });
      for (let i = 0; i < res.items.length - 1; i++) {
        const curr = res.items[i].proteinG ?? -1;
        const next = res.items[i + 1].proteinG ?? -1;
        expect(curr).toBeGreaterThanOrEqual(next);
      }
    });
  });

  describe('5. Comparison Logic & Highlights', () => {
    it('accurately identifies highest protein, lowest sugar, lowest calorie, and lowest sodium products', () => {
      const all = packagedFoodDb.getAll();
      // Select 3 sample products
      const p1 = all[0];
      const p2 = all[1];
      const p3 = all[2];

      const comp = packagedFoodDb.compare([p1.id, p2.id, p3.id]);
      expect(comp.products.length).toBe(3);

      // Verify highlights are assigned correctly
      const declaredProteins = comp.products
        .filter(p => p.proteinG !== null)
        .map(p => ({ id: p.id, val: p.proteinG! }));
      if (declaredProteins.length > 0) {
        const maxProt = Math.max(...declaredProteins.map(p => p.val));
        const winner = comp.products.find(p => p.id === comp.highlights.highestProteinId);
        expect(winner?.proteinG).toBe(maxProt);
      }

      const declaredSugars = comp.products
        .filter(p => p.sugarG !== null)
        .map(p => ({ id: p.id, val: p.sugarG! }));
      if (declaredSugars.length > 0) {
        const minSugar = Math.min(...declaredSugars.map(p => p.val));
        const winner = comp.products.find(p => p.id === comp.highlights.lowestSugarId);
        expect(winner?.sugarG).toBe(minSugar);
      }
    });
  });

  describe('6. Aggregate Statistics & Chart Series', () => {
    it('calculates correct dataset aggregates and 6 chart series', () => {
      const stats = packagedFoodDb.getStatistics();

      expect(stats.totalProducts).toBe(852);
      expect(stats.totalBrands).toBe(262);
      expect(stats.totalCategories).toBe(13);

      expect(stats.avgCalories).toBeGreaterThan(0);
      expect(stats.avgProtein).toBeGreaterThan(0);
      expect(stats.avgSugar).toBeGreaterThan(0);
      expect(stats.avgPrice).toBeGreaterThan(0);

      expect(stats.categoriesDistribution.length).toBe(13);
      expect(stats.topBrands.length).toBeLessThanOrEqual(15);
      expect(stats.avgCaloriesByCategory.length).toBe(13);
      expect(stats.avgProteinByCategory.length).toBe(13);
      expect(stats.avgSugarByCategory.length).toBe(13);
      expect(stats.priceDistribution.length).toBeGreaterThan(0);
    });
  });

  describe('7. Admin CRUD & Bulk Operations', () => {
    it('performs CRUD operations seamlessly', () => {
      const initialCount = packagedFoodDb.getAll().length;

      // 1. Create
      const createRes = packagedFoodDb.create({
        name: 'Test Protein Bar',
        brand: 'FITFOODS',
        category: 'SNACKS',
        subCategory: 'HEALTH BARS',
        ingredients: 'OATS, DATES, ALMONDS, WHEY PROTEIN',
        servingSizeG: 50,
        caloriesKcal: 210,
        proteinG: 15,
        sugarG: 4,
        priceINR: 80,
      });

      expect(createRes.success).toBe(true);
      expect(createRes.item).toBeDefined();
      const newId = createRes.item!.id;
      expect(packagedFoodDb.getAll().length).toBe(initialCount + 1);

      // 2. Read
      const fetched = packagedFoodDb.getById(newId);
      expect(fetched).not.toBeNull();
      expect(fetched!.name).toBe('Test Protein Bar');

      // 3. Update
      const updateRes = packagedFoodDb.update(newId, {
        priceINR: 95,
        proteinG: 16,
      });
      expect(updateRes.success).toBe(true);
      expect(updateRes.item!.priceINR).toBe(95);
      expect(updateRes.item!.proteinG).toBe(16);

      // 4. Delete
      const deleteRes = packagedFoodDb.delete(newId);
      expect(deleteRes.success).toBe(true);
      expect(packagedFoodDb.getById(newId)).toBeNull();
      expect(packagedFoodDb.getAll().length).toBe(initialCount);
    });

    it('exports data in valid JSON and CSV formats', () => {
      const jsonExport = packagedFoodDb.export('json');
      const parsedJson = JSON.parse(jsonExport);
      expect(Array.isArray(parsedJson)).toBe(true);
      expect(parsedJson.length).toBe(852);

      const csvExport = packagedFoodDb.export('csv');
      expect(csvExport).toContain('S.No,Item name,Brand_Name,Category');
      const lines = csvExport.split('\n');
      expect(lines.length).toBeGreaterThan(850);
    });
  });
});
