import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ALL_LOCALES = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'pa', 'or',
  'as', 'mai', 'sa', 'ur', 'ks', 'kok', 'ne', 'sd', 'doi', 'brx', 'sat', 'mni'
];

function flattenKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(flattenKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function checkI18n() {
  console.log('--- Checking WiseFoodies i18n Translation Coverage Across All 22+1 Languages ---');
  
  const enPath = path.join(rootDir, 'messages', 'en.json');
  if (!fs.existsSync(enPath)) {
    console.error('Error: messages/en.json missing!');
    process.exit(1);
  }

  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = new Set(flattenKeys(en));
  console.log(`Reference Locale: English (en) with ${enKeys.size} keys\n`);

  let totalErrors = 0;
  const verifiedLocales: string[] = [];

  for (const loc of ALL_LOCALES) {
    if (loc === 'en') continue;
    const locPath = path.join(rootDir, 'messages', `${loc}.json`);
    if (!fs.existsSync(locPath)) {
      console.error(`❌ messages/${loc}.json is missing!`);
      totalErrors++;
      continue;
    }

    const locData = JSON.parse(fs.readFileSync(locPath, 'utf8'));
    const locKeys = new Set(flattenKeys(locData));

    let locMissing = 0;
    for (const key of enKeys) {
      if (!locKeys.has(key)) {
        console.error(`  [${loc}] Missing key: "${key}"`);
        locMissing++;
        totalErrors++;
      }
    }

    if (locMissing === 0) {
      verifiedLocales.push(loc);
      console.log(`✓ [${loc.padEnd(4)}] 100% parity (${locKeys.size}/${enKeys.size} keys)`);
    } else {
      console.error(`❌ [${loc.padEnd(4)}] Failed: ${locMissing} missing keys`);
    }
  }

  console.log(`\n======================================================`);
  console.log(`Summary: ${verifiedLocales.length + 1}/${ALL_LOCALES.length} locales fully verified.`);
  if (totalErrors > 0) {
    console.error(`❌ i18n check failed with ${totalErrors} missing key error(s)!`);
    process.exit(1);
  }

  console.log(`🎉 All 22 Scheduled Indian Languages + English have 100% key parity!`);
}

checkI18n();
