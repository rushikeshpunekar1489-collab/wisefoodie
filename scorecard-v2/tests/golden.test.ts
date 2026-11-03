import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getProductBySlug } from '../../lib/products';

describe('Scorecard V2 Golden Snapshot Regression Test', () => {
  it('must prove FBS score, band, breakdown, and product data are 100% identical to baseline', () => {
    const goldenFilePath = path.resolve(process.cwd(), 'scorecard-v2/tests/golden-before.json');
    const rawGolden = fs.readFileSync(goldenFilePath, 'utf-8');
    const goldenRecords: any[] = JSON.parse(rawGolden);

    expect(goldenRecords.length).toBeGreaterThanOrEqual(12);

    for (const record of goldenRecords) {
      const current = getProductBySlug(record.slug);
      expect(current).not.toBeNull();
      if (!current) continue;

      // Prove byte-identical FBS
      expect(current.fbs.score).toBe(record.fbs.score);
      expect(current.fbs.band).toBe(record.fbs.band);
      expect(current.fbs.breakdown).toEqual(record.fbs.breakdown);

      // Prove baseline nutrient data is untouched
      expect(current.per100g).toEqual(record.per100g);
      expect(current.priceINR).toBe(record.priceINR);
      expect(current.packSizeG).toBe(record.packSizeG);
      expect(current.servingSizeG).toBe(record.servingSizeG);
      expect(current.ingredients).toEqual(record.ingredients);
      expect(current.benefits).toEqual(record.benefits);
      expect(current.concerns).toEqual(record.concerns);
    }
  });
});
