import { Product } from '../../types/product';

export interface ValueMetrics {
  proteinPerRupee: number | null;
  fibrePerRupee: number | null;
  tenRupeesGet: { nutrient: string; amount: string }[];
}

export function calculateValue(product: Product): ValueMetrics {
  const { priceINR, packSizeG, per100g } = product;

  if (!priceINR || !packSizeG) {
    return {
      proteinPerRupee: null,
      fibrePerRupee: null,
      tenRupeesGet: [],
    };
  }

  const pricePerGram = priceINR / packSizeG;
  const proteinPerGram = (per100g.proteinG || 0) / 100;
  const fibrePerGram = (per100g.fibreG || 0) / 100;

  const proteinPerRupee = proteinPerGram / pricePerGram;
  const fibrePerRupee = fibrePerGram / pricePerGram;

  const tenRupeesGet: { nutrient: string; amount: string }[] = [];

  // Protein for ₹10
  const prot10 = proteinPerRupee * 10;
  if (prot10 >= 0.1) {
    tenRupeesGet.push({
      nutrient: 'Protein',
      amount: `${prot10.toFixed(1)}g`,
    });
  }

  // Fibre for ₹10
  const fib10 = fibrePerRupee * 10;
  if (fib10 >= 0.1) {
    tenRupeesGet.push({
      nutrient: 'Fibre',
      amount: `${fib10.toFixed(1)}g`,
    });
  }

  return {
    proteinPerRupee: proteinPerRupee > 0 ? parseFloat(proteinPerRupee.toFixed(4)) : null,
    fibrePerRupee: fibrePerRupee > 0 ? parseFloat(fibrePerRupee.toFixed(4)) : null,
    tenRupeesGet,
  };
}
