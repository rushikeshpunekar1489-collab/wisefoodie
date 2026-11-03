import fs from 'fs';
import path from 'path';
import { packagedFoodDb } from '../lib/db/packagedFoodDb';
import type { RawPackagedFoodRecord } from '../types/packaged-food';

function runImport() {
  const filePath = path.join(process.cwd(), 'data', 'packaged_foods_india.json');
  console.log('==================================================');
  console.log('  INDIAN PACKAGED FOOD DATABASE IMPORT SCRIPT     ');
  console.log('==================================================');
  console.log(`Source File: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: Dataset file not found at ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  let rawData: RawPackagedFoodRecord[];

  try {
    rawData = JSON.parse(fileContent);
  } catch (err) {
    console.error('ERROR: Failed to parse JSON file:', err);
    process.exit(1);
  }

  console.log(`Found ${rawData.length} records in source file.`);

  let validCount = 0;
  let invalidCount = 0;
  const invalidReasons: string[] = [];
  const seenKeys = new Set<string>();
  let duplicates = 0;

  const validRecords: RawPackagedFoodRecord[] = [];

  for (let i = 0; i < rawData.length; i++) {
    const r = rawData[i];
    const rowNum = i + 1;

    // Required fields check
    if (!r['Item name'] || !String(r['Item name']).trim()) {
      invalidCount++;
      invalidReasons.push(`Row ${rowNum}: Missing 'Item name'`);
      continue;
    }

    if (!r['Brand_Name'] || !String(r['Brand_Name']).trim()) {
      invalidCount++;
      invalidReasons.push(`Row ${rowNum}: Missing 'Brand_Name'`);
      continue;
    }

    if (!r['Category'] || !String(r['Category']).trim()) {
      invalidCount++;
      invalidReasons.push(`Row ${rowNum}: Missing 'Category'`);
      continue;
    }

    // Deduplication check
    const dupKey = `${String(r['Brand_Name']).trim().toLowerCase()}:::${String(r['Item name']).trim().toLowerCase()}`;
    if (seenKeys.has(dupKey)) {
      duplicates++;
    } else {
      seenKeys.add(dupKey);
    }

    // Nutritional sanity check (if present, must be number >= 0)
    const numericFields = [
      'Serving_Size_g',
      'Calories_kcal',
      'Carbohydrates_g',
      'Proteins_g',
      'Total_Fat_g',
      'Saturated_Fat_g',
      'Trans_Fat_g',
      'Sugar_g',
      'Sodium_mg',
      'Dietary_Fiber_g',
      'Cholesterol_mg',
      'Calcium_mg',
      'Iron_mg',
      'Price_INR'
    ] as const;

    for (const field of numericFields) {
      const val = r[field];
      if (val !== null && val !== undefined) {
        const num = Number(val);
        if (isNaN(num)) {
          console.warn(`Row ${rowNum} warning: Field '${field}' has non-numeric value: ${val}`);
        }
      }
    }

    validRecords.push(r);
    validCount++;
  }

  console.log(`\nValidation Results:`);
  console.log(`- Valid records: ${validCount}`);
  console.log(`- Invalid records: ${invalidCount}`);
  console.log(`- Duplicates found: ${duplicates}`);

  if (invalidReasons.length > 0) {
    console.log(`\nFirst 5 Invalid Record Reasons:`);
    invalidReasons.slice(0, 5).forEach(r => console.log(`  * ${r}`));
  }

  // Reload database with fresh valid records
  packagedFoodDb.init(true);
  const categories = packagedFoodDb.getCategories();
  const brands = packagedFoodDb.getBrands();
  const stats = packagedFoodDb.getStatistics();

  console.log('\nDatabase Status after Import:');
  console.log(`- Total Indexed Products: ${stats.totalProducts}`);
  console.log(`- Unique Categories: ${stats.totalCategories}`);
  console.log(`- Unique Brands: ${stats.totalBrands}`);
  console.log(`- Average Calories: ${stats.avgCalories} kcal`);
  console.log(`- Average Protein: ${stats.avgProtein} g`);
  console.log(`- Average Sugar: ${stats.avgSugar} g`);
  console.log(`- Average Price: ₹${stats.avgPrice}`);
  console.log('\nTop 5 Categories:');
  categories.slice(0, 5).forEach(c => console.log(`  ${c.icon} ${c.name}: ${c.productCount} products`));

  console.log('\n==================================================');
  console.log('  IMPORT COMPLETED SUCCESSFULLY                   ');
  console.log('==================================================');
}

runImport();
