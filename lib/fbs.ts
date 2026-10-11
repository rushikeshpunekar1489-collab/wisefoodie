export interface FBSBreakdownItem {
  factor: string;
  value: string;
  points: number;
  reason: string;
}

export interface FBSResult {
  score: number | null;
  band: 'Excellent' | 'Very Good' | 'Good' | 'Moderate' | 'Limited' | 'Poor' | null;
  breakdown: FBSBreakdownItem[];
  isPending?: boolean;
}

export interface FBSInput {
  energyKcal: number | null;
  proteinG: number | null;
  carbsG?: number | null;
  totalSugarG?: number | null;
  addedSugarG?: number | null;
  fatG: number | null;
  satFatG?: number | null;
  transFatG?: number | null;
  fibreG?: number | null;
  sodiumMg: number | null;
  micronutrients?: Array<{
    name: string;
    amount: number;
    unit: string;
    rdaPercentage?: number | null;
  }>;
  ingredients?: string[];
  isBeverage?: boolean;
}

const WHOLE_FOOD_TERMS = [
  'whole grain', 'whole wheat', 'rolled oats', 'oats', 'ragi', 'jowar', 'bajra',
  'nuts', 'almonds', 'cashews', 'walnuts', 'peanuts',
  'seeds', 'chia seeds', 'flax seeds', 'pumpkin seeds', 'sunflower seeds',
  'pulses', 'dal', 'chana', 'moong', 'lentils', 'beans', 'chickpeas',
  'fruit', 'vegetable', 'apple', 'banana', 'curd', 'milk', 'paneer', 'yogurt'
];

const REFINED_AND_ADDITIVE_TERMS = [
  'refined wheat flour', 'maida', 'palm oil', 'palmolein', 'invert sugar',
  'high fructose corn syrup', 'corn syrup', 'maltodextrin', 'liquid glucose',
  'artificial flavour', 'nature identical flavour', 'synthetic food colour',
  'preservative', 'emulsifier', 'stabilizer', 'thickener', 'acidity regulator',
  'flavour enhancer', 'ins 471', 'ins 322', 'ins 150d', 'ins 635', 'ins 621',
  'caramel color', 'colour', 'ins 330', 'ins 338', 'sodium benzoate', 'potassium sorbate'
];

export function computeFBS(input: FBSInput): FBSResult {
  const breakdown: FBSBreakdownItem[] = [];

  // Core inputs check
  const hasEnergy = input.energyKcal !== null && input.energyKcal !== undefined;
  const hasProtein = input.proteinG !== null && input.proteinG !== undefined;
  const hasSugar = (input.totalSugarG !== null && input.totalSugarG !== undefined) ||
                   (input.addedSugarG !== null && input.addedSugarG !== undefined);
  const hasFat = input.fatG !== null && input.fatG !== undefined;
  const hasSodium = input.sodiumMg !== null && input.sodiumMg !== undefined;

  if (!hasEnergy || !hasProtein || !hasSugar || !hasFat || !hasSodium) {
    const missing: string[] = [];
    if (!hasEnergy) missing.push('Energy (kcal)');
    if (!hasProtein) missing.push('Protein (g)');
    if (!hasSugar) missing.push('Sugar (g)');
    if (!hasFat) missing.push('Fat (g)');
    if (!hasSodium) missing.push('Sodium (mg)');

    return {
      score: null,
      band: null,
      breakdown: [
        {
          factor: 'Incomplete Data',
          value: missing.join(', '),
          points: 0,
          reason: `Missing essential nutritional fields: ${missing.join(', ')}. Score pending complete label data.`,
        },
      ],
      isPending: true,
    };
  }

  let totalScore = 6.0;
  breakdown.push({
    factor: 'Base Score',
    value: '6.0',
    points: 6.0,
    reason: 'Standard baseline score for packaged foods',
  });

  // 1. Protein (linear 0 -> 15g, 0 to +1.5)
  const protein = Math.max(0, input.proteinG ?? 0);
  const proteinPoints = Math.min(1.5, (protein / 15) * 1.5);
  const roundedProteinPts = Math.round(proteinPoints * 100) / 100;
  totalScore += roundedProteinPts;
  breakdown.push({
    factor: 'Protein',
    value: `${protein}g / 100g`,
    points: roundedProteinPts,
    reason: protein >= 15 ? 'Excellent protein content (max +1.5 pts)' : `Proportional score up to 15g (+${roundedProteinPts} pts)`,
  });

  // 2. Fibre (linear 0 -> 6g, 0 to +1.5)
  if (input.fibreG !== null && input.fibreG !== undefined) {
    const fibre = Math.max(0, input.fibreG);
    const fibrePoints = Math.min(1.5, (fibre / 6) * 1.5);
    const roundedFibrePts = Math.round(fibrePoints * 100) / 100;
    totalScore += roundedFibrePts;
    breakdown.push({
      factor: 'Dietary Fibre',
      value: `${fibre}g / 100g`,
      points: roundedFibrePts,
      reason: fibre >= 6 ? 'High dietary fibre content (max +1.5 pts)' : `Proportional score up to 6g (+${roundedFibrePts} pts)`,
    });
  } else {
    breakdown.push({
      factor: 'Dietary Fibre',
      value: 'Not reported',
      points: 0,
      reason: 'Fibre data not disclosed on label (skipped)',
    });
  }

  // 3. Micronutrients (>=2 micronutrients each >=15% RDA, +0.5)
  if (input.micronutrients && input.micronutrients.length > 0) {
    const qualifying = input.micronutrients.filter(m => (m.rdaPercentage ?? 0) >= 15);
    if (qualifying.length >= 2) {
      totalScore += 0.5;
      breakdown.push({
        factor: 'Micronutrients',
        value: `${qualifying.length} key vitamins/minerals >= 15% RDA`,
        points: 0.5,
        reason: 'Significant micronutrient contribution (+0.5 pts)',
      });
    } else {
      breakdown.push({
        factor: 'Micronutrients',
        value: `${qualifying.length} vitamins/minerals >= 15% RDA`,
        points: 0,
        reason: 'Fewer than 2 micronutrients reach the 15% reference threshold',
      });
    }
  }

  // 4. Whole-food ingredients (1st or 2nd ingredient is whole grain / nuts / seeds / pulses / fruit / veg / dairy, +1.0)
  if (input.ingredients && input.ingredients.length > 0) {
    const firstTwo = input.ingredients.slice(0, 2).map(i => i.toLowerCase()).join(' ');
    const hasWholeFood = WHOLE_FOOD_TERMS.some(term => firstTwo.includes(term));
    if (hasWholeFood) {
      totalScore += 1.0;
      breakdown.push({
        factor: 'Whole-Food Ingredients',
        value: 'Top ingredient is whole food',
        points: 1.0,
        reason: 'Primary ingredient is whole grain, pulse, nut, seed, dairy or fruit (+1.0 pts)',
      });
    } else {
      breakdown.push({
        factor: 'Whole-Food Ingredients',
        value: 'Refined or sugar base',
        points: 0,
        reason: 'Top ingredients are primarily refined flours, sugars, or fats',
      });
    }
  }

  // 5. Nutrient density: (protein g + fibre g) per 100 kcal, linear 0 -> 5, 0 to +0.5
  const energy = Math.max(1, input.energyKcal ?? 0);
  const totalNutrients = (input.proteinG ?? 0) + (input.fibreG ?? 0);
  const density = totalNutrients / (energy / 100);
  const densityPoints = Math.min(0.5, Math.max(0, (density / 5) * 0.5));
  const roundedDensityPts = Math.round(densityPoints * 100) / 100;
  totalScore += roundedDensityPts;
  breakdown.push({
    factor: 'Nutrient Density',
    value: `${density.toFixed(1)}g per 100 kcal`,
    points: roundedDensityPts,
    reason: `Protein + fibre density relative to calories (+${roundedDensityPts} pts)`,
  });

  // 6. Added sugar: linear 0 -> 20g, 0 to -1.5
  const sugar = input.addedSugarG !== null && input.addedSugarG !== undefined
    ? input.addedSugarG
    : (input.totalSugarG ?? 0);
  const sugarPenalty = -Math.min(1.5, Math.max(0, (sugar / 20) * 1.5));
  const roundedSugarPenalty = Math.round(sugarPenalty * 100) / 100;
  totalScore += roundedSugarPenalty;
  breakdown.push({
    factor: 'Sugar Content',
    value: `${sugar}g / 100g`,
    points: roundedSugarPenalty,
    reason: sugar > 0 ? `Penalty for sugar load up to 20g (${roundedSugarPenalty} pts)` : 'No added sugars detected (0 pts)',
  });

  // 7. Sodium: linear 0 -> 800mg, 0 to -1.0 (with extra penalty for extreme sodium > 800mg)
  const sodium = Math.max(0, input.sodiumMg ?? 0);
  const baseSodiumPenalty = -Math.min(1.0, Math.max(0, (sodium / 800) * 1.0));
  const excessSodiumPenalty = sodium > 800 ? -Math.min(0.5, ((sodium - 800) / 800) * 0.5) : 0;
  const sodiumPenalty = baseSodiumPenalty + excessSodiumPenalty;
  const roundedSodiumPenalty = Math.round(sodiumPenalty * 100) / 100;
  totalScore += roundedSodiumPenalty;
  breakdown.push({
    factor: 'Sodium',
    value: `${sodium}mg / 100g`,
    points: roundedSodiumPenalty,
    reason: sodium > 800 ? `High sodium load exceeding 800mg/100g (${roundedSodiumPenalty} pts)` : sodium > 0 ? `Penalty for sodium level (${roundedSodiumPenalty} pts)` : 'Minimal sodium (0 pts)',
  });

  // 8. Saturated fat: linear 0 -> 10g, 0 to -1.0
  if (input.satFatG !== null && input.satFatG !== undefined) {
    const satFat = Math.max(0, input.satFatG);
    const satFatPenalty = -Math.min(1.0, Math.max(0, (satFat / 10) * 1.0));
    const roundedSatFatPenalty = Math.round(satFatPenalty * 100) / 100;
    totalScore += roundedSatFatPenalty;
    breakdown.push({
      factor: 'Saturated Fat',
      value: `${satFat}g / 100g`,
      points: roundedSatFatPenalty,
      reason: satFat > 0 ? `Penalty for saturated fat up to 10g (${roundedSatFatPenalty} pts)` : 'Low saturated fat (0 pts)',
    });
  }

  // 9. Trans fat: > 0.2g, -0.5
  if (input.transFatG !== null && input.transFatG !== undefined) {
    if (input.transFatG > 0.2) {
      totalScore -= 0.5;
      breakdown.push({
        factor: 'Trans Fat',
        value: `${input.transFatG}g / 100g`,
        points: -0.5,
        reason: 'Contains harmful industrial trans fats > 0.2g (-0.5 pts)',
      });
    }
  }

  // 10. Processing & Additives: >= 5 additives/refined-ingredient flags, -0.5
  if (input.ingredients && input.ingredients.length > 0) {
    const joined = input.ingredients.join(' ').toLowerCase();
    let flagCount = 0;
    REFINED_AND_ADDITIVE_TERMS.forEach(term => {
      if (joined.includes(term)) flagCount++;
    });
    if (flagCount >= 5) {
      totalScore -= 0.7;
      breakdown.push({
        factor: 'Processing & Additives',
        value: `${flagCount} flagged refined ingredients/additives`,
        points: -0.7,
        reason: 'Ultra-processed formulation with >= 5 industrial additives/refined components (-0.7 pts)',
      });
    }


  }

  // 11. Energy density: > 450 kcal, -0.3
  if ((input.energyKcal ?? 0) > 450) {
    totalScore -= 0.3;
    breakdown.push({
      factor: 'Energy Density',
      value: `${input.energyKcal} kcal / 100g`,
      points: -0.3,
      reason: 'Very high caloric density exceeding 450 kcal/100g (-0.3 pts)',
    });
  }

  // 12. Calibration Adjustment: Empty Calorie & Sugary Beverage Anchor
  const isSugaryDrink = (input.isBeverage || (input.energyKcal !== null && input.energyKcal < 70 && sugar >= 8)) &&
                        (input.proteinG ?? 0) < 0.5 &&
                        (input.fibreG ?? 0) < 0.2 &&
                        sugar >= 8;

  if (isSugaryDrink) {
    totalScore -= 2.5;
    breakdown.push({
      factor: 'Sugary Beverage Penalty',
      value: 'Liquid sugar with 0 protein/fibre',
      points: -2.5,
      reason: 'Empty liquid calories with high glycemic load and no intrinsic satiety (-2.5 pts)',
    });
  } else if ((input.proteinG ?? 0) < 0.5 && (input.fibreG ?? 0) < 0.2 && sugar >= 15) {
    totalScore -= 1.0;
    breakdown.push({
      factor: 'Empty Calorie Load',
      value: 'Negligible protein/fibre with high sugar',
      points: -1.0,
      reason: 'Low nutrient density with high simple sugars (-1.0 pts)',
    });
  }

  // Clamp 1.0 - 10.0 and round to 1 decimal
  const clampedScore = Math.min(10.0, Math.max(1.0, totalScore));
  const finalScore = Math.round(clampedScore * 10) / 10;

  let band: FBSResult['band'] = 'Poor';
  if (finalScore >= 9.0) band = 'Excellent';
  else if (finalScore >= 8.0) band = 'Very Good';
  else if (finalScore >= 7.0) band = 'Good';
  else if (finalScore >= 5.0) band = 'Moderate';
  else if (finalScore >= 3.0) band = 'Limited';
  else band = 'Poor';

  return {
    score: finalScore,
    band,
    breakdown,
  };
}
