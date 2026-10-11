import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { ProductSchema, type Product } from '../types/product';

const SOURCE_DIR = path.join(process.cwd(), 'data', 'source');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'products.json');
const REPORT_FILE = path.join(process.cwd(), 'data', 'import-report.md');
const SAMPLE_DIR = path.join(process.cwd(), 'data', 'sample');

const BRAND_CATEGORY_MAP: Record<string, { brand: string; category: string; subcategory: string }> = {
  'amul ice cream': { brand: 'Amul', category: 'Dairy & Frozen', subcategory: 'Ice Cream' },
  'balaji wafers': { brand: 'Balaji', category: 'Snacks & Savouries', subcategory: 'Potato Wafers' },
  'cadbury products catalog': { brand: 'Cadbury', category: 'Chocolates & Confectionery', subcategory: 'Chocolates' },
  'campa and raw': { brand: 'Campa & Raw', category: 'Beverages', subcategory: 'Soft Drinks & Juices' },
  'chings products': { brand: "Ching's Secret", category: 'Noodles & Sauces', subcategory: 'Desi Chinese' },
  'coca cola': { brand: 'Coca-Cola', category: 'Beverages', subcategory: 'Carbonated Drinks' },
  'gits food products': { brand: 'Gits', category: 'Ready To Cook', subcategory: 'Instant Mixes' },
  "hershey's and kinder products": { brand: "Hershey's & Kinder", category: 'Chocolates & Confectionery', subcategory: 'Sweets & Spreads' },
  'hocco products': { brand: 'Hocco', category: 'Dairy & Frozen', subcategory: 'Ice Cream & Desserts' },
  'keloggs products': { brand: "Kellogg's", category: 'Breakfast Cereals', subcategory: 'Corn Flakes & Muesli' },
  'kissan products': { brand: 'Kissan', category: 'Sauces & Spreads', subcategory: 'Ketchup & Jams' },
  'knor products': { brand: 'Knorr', category: 'Soups & Seasonings', subcategory: 'Instant Soups' },
  'maggi product catlogs': { brand: 'Maggi', category: 'Instant Foods', subcategory: 'Noodles & Sauces' },
  'mapro products': { brand: 'Mapro', category: 'Beverages & Spreads', subcategory: 'Fruit Crushes & Jams' },
  'mcain food products': { brand: 'McCain', category: 'Frozen Foods', subcategory: 'Frozen Finger Foods' },
  'mtr food products': { brand: 'MTR', category: 'Ready To Eat', subcategory: 'South Indian Meals' },
  'nestle product catalog': { brand: 'Nestlé', category: 'Dairy & Nutrition', subcategory: 'Packaged Foods' },
  'unibic products': { brand: 'Unibic', category: 'Biscuits & Cookies', subcategory: 'Cookies' },
};

export async function runImport(): Promise<{ totalFound: number; totalImported: number }> {
  console.log('--- Starting WiseFoodies Product Importer ---');

  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Source directory does not exist: ${SOURCE_DIR}`);
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => !f.startsWith('.'));
  const totalFound = files.length;
  console.log(`Found ${totalFound} source files in ${SOURCE_DIR}`);

  const products: Product[] = [];
  const skipped: Array<{ file: string; reason: string }> = [];
  const incomplete: Array<{ name: string; file: string; missing: string }> = [];

  for (const file of files) {
    try {
      const ext = path.extname(file).toLowerCase();
      const baseName = path.parse(file).name.trim();
      const rawSlug = slugify(baseName, { lower: true, strict: true });
      const slug = rawSlug.replace(/-+/g, '-').replace(/^-|-$/g, '');

      // Normalized meta
      const lookupKey = baseName.toLowerCase().replace(/\s+/g, ' ');
      const meta = BRAND_CATEGORY_MAP[lookupKey] || {
        brand: baseName.split(' ')[0],
        category: 'Packaged Foods',
        subcategory: 'Catalog Collection',
      };

      // Check extracted image
      const imagePath = `/products/${slug}.webp`;
      const localImageExists = fs.existsSync(path.join(process.cwd(), 'public', 'products', `${slug}.webp`));

      const product: Product = {
        id: `wf-${slug}`,
        slug: slug,
        name: `${meta.brand} Product Range`,
        brand: meta.brand,
        category: meta.category,
        subcategory: meta.subcategory,
        image: localImageExists ? imagePath : null,
        servingSizeG: null,
        packSizeG: null,
        priceINR: null,
        per100g: {
          energyKcal: null,
          proteinG: null,
          carbsG: null,
          totalSugarG: null,
          addedSugarG: null,
          fatG: null,
          satFatG: null,
          transFatG: null,
          fibreG: null,
          sodiumMg: null,
          micronutrients: [],
        },
        ingredients: [],
        benefits: [
          `Authentic product collection from ${meta.brand}`,
          'Directly sourced from original manufacturer catalog',
        ],
        concerns: [
          'Detailed nutritional panel currently awaiting manual verification or community contribution.',
        ],
        fbs: {
          score: null,
          band: null,
          breakdown: [
            {
              factor: 'Catalog Ingestion',
              value: 'PDF Catalog',
              points: 0,
              reason: 'Source provided is an image-based catalog. Nutrition facts are pending label extraction.',
            },
          ],
        },
        nutritionPerPaisa: {
          proteinPerRupee: null,
          fibrePerRupee: null,
          tenRupeesGet: [],
        },
        barcode: null,
        lastUpdated: new Date().toISOString().split('T')[0],
        dataSource: `Original Catalog PDF: ${file}`,
        verification: 'incomplete',
      };

      const parsed = ProductSchema.parse(product);
      products.push(parsed);
      incomplete.push({
        name: parsed.name,
        file,
        missing: 'Energy, Protein, Carbs, Sugar, Fat, Sodium, Ingredients, Pack Size, Price',
      });
    } catch (err: any) {
      console.error(`Failed to process ${file}:`, err);
      skipped.push({ file, reason: err.message });
    }
  }

  // Ensure output dir
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), 'utf-8');

  // Build markdown report
  let reportMd = `# WiseFoodies Product Import Report\n\n`;
  reportMd += `*Generated on ${new Date().toISOString()}*\n\n`;
  reportMd += `### Summary\n`;
  reportMd += `- **Total Files Found in Source Folder:** ${totalFound}\n`;
  reportMd += `- **Total Products Successfully Imported:** ${products.length}\n`;
  reportMd += `- **Skipped Files:** ${skipped.length}\n`;
  reportMd += `- **Incomplete / Pending Products:** ${incomplete.length}\n\n`;

  reportMd += `### Data Honesty Status\n`;
  reportMd += `In accordance with WiseFoodies strict Data Honesty Rules (§2), no nutritional values or prices were synthesized for image-only PDF catalogs. Products are marked \`verification: "incomplete"\` and render graceful missing-data states in the UI.\n\n`;

  if (skipped.length > 0) {
    reportMd += `### Skipped Files\n`;
    reportMd += `| Filename | Reason |\n|---|---|\n`;
    skipped.forEach(s => {
      reportMd += `| \`${s.file}\` | ${s.reason} |\n`;
    });
    reportMd += `\n`;
  }

  reportMd += `### Imported Products Inventory (${products.length} Products)\n\n`;
  reportMd += `| # | Product Name | Brand | Category | Slug | Status | Image |\n`;
  reportMd += `|---|---|---|---|---|---|---|\n`;
  products.forEach((p, idx) => {
    reportMd += `| ${idx + 1} | ${p.name} | ${p.brand} | ${p.category} | \`${p.slug}\` | ⚠️ ${p.verification} | ${p.image ? '✅ Local WebP' : '❌ Placeholder'} |\n`;
  });

  reportMd += `\n### Missing Fields Detail\n`;
  reportMd += `| Product | Source File | Missing Fields |\n|---|---|---|\n`;
  incomplete.forEach(inc => {
    reportMd += `| ${inc.name} | \`${inc.file}\` | ${inc.missing} |\n`;
  });

  fs.writeFileSync(REPORT_FILE, reportMd, 'utf-8');
  console.log(`Saved import report to ${REPORT_FILE}`);
  console.log(`Successfully imported ${products.length}/${totalFound} products.`);

  if (products.length !== totalFound) {
    throw new Error(`Import count mismatch! Found ${totalFound} files but imported ${products.length}`);
  }

  return { totalFound, totalImported: products.length };
}

// Execute if run directly
if (process.argv[1]?.includes('import-products')) {
  runImport().catch(err => {
    console.error('Fatal Import Error:', err);
    process.exit(1);
  });
}
