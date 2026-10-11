import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.string().nullable(),
  subcategory: z.string().nullable(),
  image: z.string().nullable(),
  servingSizeG: z.number().nullable(),
  packSizeG: z.number().nullable(),
  priceINR: z.number().nullable(),
  per100g: z.object({
    energyKcal: z.number().nullable(),
    proteinG: z.number().nullable(),
    carbsG: z.number().nullable(),
    totalSugarG: z.number().nullable(),
    addedSugarG: z.number().nullable(),
    fatG: z.number().nullable(),
    satFatG: z.number().nullable(),
    transFatG: z.number().nullable(),
    fibreG: z.number().nullable(),
    sodiumMg: z.number().nullable(),
    micronutrients: z.array(z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.string(),
      rdaPercentage: z.number().nullable(),
    })).default([]),
  }),
  ingredients: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  concerns: z.array(z.string()).default([]),
  fbs: z.object({
    score: z.number().nullable(),
    band: z.string().nullable(),
    breakdown: z.array(z.object({
      factor: z.string(),
      value: z.string(),
      points: z.number(),
      reason: z.string(),
    })).default([]),
  }),
  nutritionPerPaisa: z.object({
    proteinPerRupee: z.number().nullable(),
    fibrePerRupee: z.number().nullable(),
    tenRupeesGet: z.array(z.object({
      nutrient: z.string(),
      amount: z.string(),
    })).default([]),
  }),
  barcode: z.string().nullable().default(null),
  aliases: z.array(z.string()).default([]),
  packSizeText: z.string().nullable(),
  lastUpdated: z.string(),
  dataSource: z.string(),
  verification: z.enum(['complete', 'incomplete', 'extracted-from-label (needs review)', 'sample']),
});

export type Product = z.infer<typeof ProductSchema>;
