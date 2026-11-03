import type { ProductFacts } from '../../adapters/productAdapter';
import type {
  SmartConsumptionAnalysis,
  ConsumptionClassification,
  DailyLimitContribution,
  FoodCombination,
} from './types';
import thresholdsData from '../../config/thresholds.json';
import consumptionRulesData from '../../config/consumption-rules.json';

export function evaluateSmartConsumption(facts: ProductFacts): SmartConsumptionAnalysis {
  const categoryTemplates = consumptionRulesData.categoryTemplates as Record<string, any>;
  const template =
    categoryTemplates[facts.category] || categoryTemplates['Default'];

  // Serving size resolution
  let servingValue = facts.servingSize?.value ?? template.defaultServingG;
  let servingUnit = facts.servingSize?.unit ?? template.servingUnit;
  let isServingEstimated = facts.servingSize === null;

  // Multiplier from per 100g/ml to per serving
  const servingRatio = servingValue / 100;

  // Extract per-100g values
  const getNutrientVal = (k: string): number | null => {
    const item = facts.nutrition.values[k];
    return item && typeof item.value === 'number' && !isNaN(item.value) ? item.value : null;
  };

  const energy100 = getNutrientVal('energyKcal');
  const protein100 = getNutrientVal('protein');
  const fibre100 = getNutrientVal('fibre');
  const addedSugar100 = getNutrientVal('addedSugar') ?? getNutrientVal('totalSugar') ?? 0;
  const satFat100 = getNutrientVal('satFat') ?? 0;
  const transFat100 = getNutrientVal('transFat') ?? 0;
  const sodium100 = getNutrientVal('sodium') ?? 0;

  // Calories per serving
  const caloriesPerServing = energy100 !== null ? Math.round(energy100 * servingRatio) : null;

  // Per-serving amounts
  const addedSugarPerServing = Math.round(addedSugar100 * servingRatio * 10) / 10;
  const satFatPerServing = Math.round(satFat100 * servingRatio * 10) / 10;
  const transFatPerServing = Math.round(transFat100 * servingRatio * 10) / 10;
  const sodiumPerServing = Math.round(sodium100 * servingRatio);

  // Daily limits evaluation (2,000 kcal reference diet)
  const dl = thresholdsData.dailyLimits;
  const sugarLimit = dl.addedSugarG.limit;
  const satFatLimit = dl.satFatG.limit;
  const transFatLimit = dl.transFatG.limit;
  const sodiumLimit = dl.sodiumMg.limit;

  const sugarPct = Math.round((addedSugarPerServing / sugarLimit) * 100);
  const satFatPct = Math.round((satFatPerServing / satFatLimit) * 100);
  const transFatPct = Math.round((transFatPerServing / transFatLimit) * 100);
  const sodiumPct = Math.round((sodiumPerServing / sodiumLimit) * 100);

  const dailyContributions: DailyLimitContribution[] = [
    {
      nutrient: 'Added / Free Sugar',
      amountPerServing: addedSugarPerServing,
      unit: 'g',
      dailyLimit: sugarLimit,
      percentageOfLimit: sugarPct,
      isHigh: sugarPct > 20,
      citation: dl.addedSugarG.source,
    },
    {
      nutrient: 'Saturated Fat',
      amountPerServing: satFatPerServing,
      unit: 'g',
      dailyLimit: satFatLimit,
      percentageOfLimit: satFatPct,
      isHigh: satFatPct > 25,
      citation: dl.satFatG.source,
    },
    {
      nutrient: 'Trans Fatty Acids',
      amountPerServing: transFatPerServing,
      unit: 'g',
      dailyLimit: transFatLimit,
      percentageOfLimit: transFatPct,
      isHigh: transFatPerServing >= 0.2,
      citation: dl.transFatG.source,
    },
    {
      nutrient: 'Sodium',
      amountPerServing: sodiumPerServing,
      unit: 'mg',
      dailyLimit: sodiumLimit,
      percentageOfLimit: sodiumPct,
      isHigh: sodiumPct > 20,
      citation: dl.sodiumMg.source,
    },
  ];

  // Triggers & Classification Logic
  const triggers: string[] = [];
  const crossedThresholds: string[] = [];

  if (sodiumPct >= 35) {
    triggers.push(`High sodium burden: 1 serving gives ${sodiumPct}% of the daily limit (${sodiumPerServing} mg).`);
    crossedThresholds.push('High Sodium');
  } else if (sodiumPct >= 20) {
    triggers.push(`Notable sodium contribution: 1 serving gives ${sodiumPct}% of daily recommended limit.`);
  }

  if (sugarPct >= 35) {
    triggers.push(`High added sugar burden: 1 serving provides ${sugarPct}% of daily free sugar limit (${addedSugarPerServing}g).`);
    crossedThresholds.push('High Added Sugar');
  } else if (sugarPct >= 15) {
    triggers.push(`Moderate added sugar content: ${sugarPct}% of daily limit per serving.`);
  }

  if (satFatPct >= 35) {
    triggers.push(`Elevated saturated lipid content: ${satFatPct}% of daily limit in a single portion.`);
    crossedThresholds.push('High Saturated Fat');
  }

  if (transFatPerServing >= 0.2) {
    triggers.push(`Declared trans fat detected: ${transFatPerServing}g per serving.`);
    crossedThresholds.push('Trans Fat Declared');
  }

  if ((protein100 !== null && protein100 >= 10) || (fibre100 !== null && fibre100 >= 5)) {
    triggers.push(`Nutrient dense base: delivers substantial natural protein (${protein100 ?? 0}g) or dietary fibre (${fibre100 ?? 0}g) per 100${facts.packSize?.unit ?? 'g'}.`);
  }

  // Derive transparent classification verdict
  let verdict: ConsumptionClassification = 'Moderate';
  let badgeColor = 'var(--mango)';

  const fbsScore = facts.fbs.score;

  if (
    sodiumPct >= 40 ||
    sugarPct >= 40 ||
    satFatPct >= 45 ||
    (fbsScore !== null && fbsScore < 3.5)
  ) {
    verdict = 'Limit';
    badgeColor = 'var(--tomato)';
  } else if (
    sodiumPct >= 25 ||
    sugarPct >= 25 ||
    satFatPct >= 25 ||
    (fbsScore !== null && fbsScore < 6.0)
  ) {
    verdict = 'Occasional';
    badgeColor = 'var(--mango)';
  } else if (
    sodiumPct <= 15 &&
    sugarPct <= 10 &&
    satFatPct <= 15 &&
    (fbsScore === null || fbsScore >= 7.0)
  ) {
    verdict = 'Frequent';
    badgeColor = 'var(--mint)';
  } else {
    verdict = 'Moderate';
    badgeColor = 'var(--sky)';
  }

  const headlineMap: Record<ConsumptionClassification, string> = {
    Frequent: 'Wholesome, balanced nutrient profile suitable for regular dietary inclusion.',
    Moderate: 'Balanced composition best enjoyed mindfully alongside whole foods.',
    Occasional: 'Concentrated in sodium, sugar, or saturated fat — best reserved for occasional treat meals.',
    Limit: 'Ultra-concentrated nutrients of public health concern; keep portions small and spaced out.',
  };

  // Harm reduction strategies
  const harmReductionStrategies: string[] = [];

  if (crossedThresholds.includes('High Sodium')) {
    harmReductionStrategies.push(
      'Enjoy alongside fresh potassium-rich foods (such as tomatoes, cucumbers, or a squeeze of lemon) which can help balance the dietary mineral profile.'
    );
    harmReductionStrategies.push(
      'Drink plenty of water across the day to aid natural sodium clearance, and avoid adding table salt or extra seasoning.'
    );
  }

  if (crossedThresholds.includes('High Added Sugar')) {
    harmReductionStrategies.push(
      'Pair this item with a source of dietary fibre or protein (such as seeds, unsweetened yoghurt, or nuts) to help slow down simple carbohydrate absorption.'
    );
    harmReductionStrategies.push(
      'Measure out a smaller portion rather than consuming directly from the full package.'
    );
  }

  if (crossedThresholds.includes('High Saturated Fat')) {
    harmReductionStrategies.push(
      'Balance this meal by choosing steamed, boiled, or grilled preparations with minimal added oil for the remainder of your daily meals.'
    );
  }

  if (template.harmReductionDefaults && template.harmReductionDefaults.length > 0) {
    for (const strat of template.harmReductionDefaults) {
      if (!harmReductionStrategies.includes(strat)) {
        harmReductionStrategies.push(strat);
      }
    }
  }

  if (harmReductionStrategies.length === 0) {
    harmReductionStrategies.push(
      'Maintain wholesome dietary balance by pairing this with fresh seasonal vegetables and adequate daily hydration.'
    );
  }

  // Smart Food Combinations
  const smartFoodCombinations: FoodCombination[] = Array.isArray(template.combinations)
    ? [...template.combinations]
    : [];

  // Things to avoid
  const thingsToAvoid: string[] = Array.isArray(template.avoidWith)
    ? [...template.avoidWith]
    : [];

  if (sodiumPct > 25) {
    thingsToAvoid.push('Pairing with salty packaged snacks, papads, or extra table salt in the same sitting.');
  }
  if (sugarPct > 25) {
    thingsToAvoid.push('Combining with sweetened beverages or sugary bakery desserts in the same meal.');
  }

  // Per serving context string
  const perServingContext = `One standard serving (${servingValue}${servingUnit}) provides ${caloriesPerServing ?? '—'} kcal, ${sodiumPerServing} mg sodium (${sodiumPct}% daily limit), and ${addedSugarPerServing}g added sugar (${sugarPct}% daily limit).`;

  return {
    classification: {
      verdict,
      badgeColor,
      headline: headlineMap[verdict],
      triggers: triggers.length > 0 ? triggers : ['Standard baseline profile conforming to category thresholds.'],
      summary: `Calibrated against ICMR-NIN 2020 RDA and WHO Dietary Guidelines for a 2,000 kcal reference diet.`,
      disclaimer: 'General guidance based on label data; not medical advice.',
    },
    recommendedConsumption: {
      servingSizeValue: servingValue,
      servingSizeUnit: servingUnit,
      isServingEstimated,
      caloriesPerServing,
      suggestedFrequency: template.frequencyBaseline,
      portionTip: template.portionTip,
      suitability: verdict === 'Frequent' ? 'Suitable for regular consumption' : 'Best consumed in moderation',
      keyConsideration: triggers[0] || 'Clean macronutrient composition.',
    },
    bestWayToConsume: {
      timing: template.bestTiming,
      preparation: template.preparationTip,
      perServingContext,
    },
    harmReduction: {
      strategies: harmReductionStrategies,
      crossedThresholds,
    },
    smartFoodCombinations,
    thingsToAvoid: Array.from(new Set(thingsToAvoid)),
    dailyContributions,
  };
}
