import { Product } from '../../types/product';

export interface FBSBreakdown {
  factor: string;
  value: string;
  points: number;
  reason: string;
}

export interface FBSResult {
  score: number;
  band: string;
  breakdown: FBSBreakdown[];
}

export function calculateFBS(product: Product): FBSResult | { status: 'pending'; reason: string } {
  const { per100g } = product;

  // Core inputs required for a valid score
  if (
    per100g.energyKcal === null ||
    per100g.proteinG === null ||
    per100g.totalSugarG === null ||
    per100g.fatG === null ||
    per100g.sodiumMg === null
  ) {
    return {
      status: 'pending',
      reason: 'Core nutrition data (Energy, Protein, Sugar, Fat, Sodium) is missing.',
    };
  }

  let score = 6.0;
  const breakdown: FBSBreakdown[] = [];

  // 1. Protein (linear 0 -> 15g: 0 to +1.5)
  const proteinPoints = Math.min((per100g.proteinG / 15) * 1.5, 1.5);
  score += proteinPoints;
  breakdown.push({
    factor: 'Protein',
    value: `${per100g.proteinG}g`,
    points: parseFloat(proteinPoints.toFixed(2)),
    reason: 'High protein content boosts the score.',
  });

  // 2. Fibre (linear 0 -> 6g: 0 to +1.5)
  const fibrePoints = Math.min((per100g.fibreG || 0) / 6 * 1.5, 1.5);
  score += fibrePoints;
  breakdown.push({
    factor: 'Fibre',
    value: `${per100g.fibreG || 0}g`,
    points: parseFloat(fibrePoints.toFixed(2)),
    reason: 'Dietary fibre improves gut health and satiety.',
  });

  // 3. Micronutrients (>=2 each >=15% RDA per 100g: +0.5)
  const richMicros = per100g.micronutrients.filter(m => (m.rdaPercentage || 0) >= 15);
  if (richMicros.length >= 2) {
    score += 0.5;
    breakdown.push({
      factor: 'Micronutrients',
      value: `${richMicros.length} rich`,
      points: 0.5,
      reason: 'Contains multiple essential micronutrients.',
    });
  }

  // 4. Whole-food ingredients (+1.0 if 1st/2nd is whole grain/nut/etc)
  // (Simplified for now: check if ingredients list starts with whole foods)
  const wholeFoodKeywords = ['whole', 'grain', 'nut', 'seed', 'pulse', 'fruit', 'vegetable'];
  const firstTwoIngredients = product.ingredients.slice(0, 2).join(' ').toLowerCase();
  const hasWholeFood = wholeFoodKeywords.some(kw => firstTwoIngredients.includes(kw));
  if (hasWholeFood) {
    score += 1.0;
    breakdown.push({
      factor: 'Whole Foods',
      value: 'Yes',
      points: 1.0,
      reason: 'First or second ingredient is a whole food.',
    });
  }

  // 5. Nutrient Density ( (prot + fibre) / 100kcal, linear 0 -> 5: 0 to +0.5)
  const density = (per100g.proteinG + (per100g.fibreG || 0)) / (per100g.energyKcal / 100);
  const densityPoints = Math.min((density / 5) * 0.5, 0.5);
  score += densityPoints;
  breakdown.push({
    factor: 'Nutrient Density',
    value: density.toFixed(2),
    points: parseFloat(densityPoints.toFixed(2)),
    reason: 'High nutrient-to-calorie ratio.',
  });

  // --- Negatives ---

  // 6. Added Sugar (linear 0 -> 20g: 0 to -1.5)
  const sugarPoints = Math.min((per100g.addedSugarG || 0) / 20 * -1.5, -1.5);
  score += sugarPoints;
  breakdown.push({
    factor: 'Added Sugar',
    value: `${per100g.addedSugarG || 0}g`,
    points: parseFloat(sugarPoints.toFixed(2)),
    reason: 'Added sugars are linked to metabolic issues.',
  });

  // 7. Sodium (linear 0 -> 800mg: 0 to -1.0)
  const sodiumPoints = Math.min((per100g.sodiumMg / 800) * -1.0, -1.0);
  score += sodiumPoints;
  breakdown.push({
    factor: 'Sodium',
    value: `${per100g.sodiumMg}mg`,
    points: parseFloat(sodiumPoints.toFixed(2)),
    reason: 'Excessive sodium can increase blood pressure.',
  });

  // 8. Saturated Fat (linear 0 -> 10g: 0 to -1.0)
  const satFatPoints = Math.min((per100g.satFatG || 0) / 10 * -1.0, -1.0);
  score += satFatPoints;
  breakdown.push({
    factor: 'Saturated Fat',
    value: `${per100g.satFatG || 0}g`,
    points: parseFloat(satFatPoints.toFixed(2)),
    reason: 'High saturated fat can impact heart health.',
  });

  // 9. Trans Fat (>0.2g: -0.5)
  if ((per100g.transFatG || 0) > 0.2) {
    score -= 0.5;
    breakdown.push({
      factor: 'Trans Fat',
      value: `${per100g.transFatG}g`,
      points: -0.5,
      reason: 'Trans fats are harmful to cardiovascular health.',
    });
  }

  // 10. Processing (>=5 additives: -0.5)
  // (Checking ingredient list for common additive patterns)
  const additiveCount = product.ingredients.filter(ing =>
    ing.toLowerCase().includes('e') || ing.toLowerCase().includes('artificial') || ing.toLowerCase().includes('preservative')
  ).length;
  if (additiveCount >= 5) {
    score -= 0.5;
    breakdown.push({
      factor: 'Processing',
      value: `${additiveCount} additives`,
      points: -0.5,
      reason: 'High level of ultra-processing detected.',
    });
  }

  // 11. Energy Density (>450 kcal: -0.3)
  if (per100g.energyKcal > 450) {
    score -= 0.3;
    breakdown.push({
      factor: 'Energy Density',
      value: `${per100g.energyKcal} kcal`,
      points: -0.3,
      reason: 'Very high calorie density.',
    });
  }

  // Clamp and Round
  const finalScore = Math.min(Math.max(parseFloat(score.toFixed(1)), 1), 10);

  return {
    score: finalScore,
    band: getFBSBand(finalScore),
    breakdown,
  };
}

function getFBSBand(score: number): string {
  if (score >= 9.0) return 'Excellent';
  if (score >= 8.0) return 'Very Good';
  if (score >= 7.0) return 'Good';
  if (score >= 5.0) return 'Moderate';
  if (score >= 3.0) return 'Limited';
  return 'Poor';
}
