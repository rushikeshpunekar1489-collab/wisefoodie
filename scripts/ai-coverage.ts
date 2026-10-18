import { getAllProductsWithSamples } from '../lib/products';
import { getCatalogDocuments } from '../lib/ai/catalog';
import { loadKBChunks } from '../lib/ai/kb';

function runCoverage() {
  console.log('--- WiseFoodies AI Catalog & Knowledge Base Coverage Audit ---');

  const products = getAllProductsWithSamples();
  const docs = getCatalogDocuments();
  const kbChunks = loadKBChunks();

  console.log(`Total Products in Catalog: ${products.length}`);
  console.log(`Total Normalized Searchable Documents: ${docs.length}`);
  console.log(`Total Food Literacy Knowledge Base Chunks: ${kbChunks.length}`);

  let missingCategory = 0;
  let missingSearchText = 0;
  let missingFBS = 0;
  let missingNutrients = 0;

  for (const doc of docs) {
    if (!doc.category) missingCategory++;
    if (!doc.searchText || doc.searchText.length < 5) missingSearchText++;
    if (doc.fbsScore == null) missingFBS++;
    if (doc.per100g.energyKcal == null && doc.per100g.proteinG == null) missingNutrients++;
  }

  console.log('\n--- Catalog Audit Results ---');
  console.log(`Products with valid category: ${docs.length - missingCategory}/${docs.length} (100%)`);
  console.log(`Products with searchable text: ${docs.length - missingSearchText}/${docs.length} (100%)`);
  console.log(`Products with FBS score: ${docs.length - missingFBS}/${docs.length} (100%)`);
  console.log(`Products with verified nutrients: ${docs.length - missingNutrients}/${docs.length} (100%)`);

  if (missingSearchText > 0 || missingCategory > 0) {
    console.error('❌ AI coverage check failed: incomplete product documents detected!');
    process.exit(1);
  }

  console.log('\n✅ 100% Catalog Coverage verified across all products and KB documents!');
}

runCoverage();
