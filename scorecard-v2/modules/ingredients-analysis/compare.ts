import type { ProductFacts } from '../../adapters/productAdapter';
import { analyzeIngredients } from './parser';

export interface IngredientSideBySideComparison {
  productA: {
    name: string;
    ingredientCount: number;
    sugarCount: number;
    preservativeCount: number;
    colourCount: number;
    flavourEnhancerCount: number;
    allergenCount: number;
    beneficialCount: number;
    topThree: string[];
  };
  productB: {
    name: string;
    ingredientCount: number;
    sugarCount: number;
    preservativeCount: number;
    colourCount: number;
    flavourEnhancerCount: number;
    allergenCount: number;
    beneficialCount: number;
    topThree: string[];
  };
  qualityDisclaimer: string;
}

export function compareIngredientsPair(
  prodA: ProductFacts,
  prodB: ProductFacts
): IngredientSideBySideComparison {
  const analysisA = analyzeIngredients(prodA.ingredientsList);
  const analysisB = analyzeIngredients(prodB.ingredientsList);

  const getCountByTag = (items: typeof analysisA.parsedIngredients, tag: string) =>
    items.filter((p) => p.indicatorTags.some((t) => t.id === tag)).length;

  return {
    productA: {
      name: prodA.name,
      ingredientCount: analysisA.parsedIngredients.length,
      sugarCount: analysisA.hiddenSugars.totalSugarCount,
      preservativeCount: getCountByTag(analysisA.parsedIngredients, 'preservative'),
      colourCount: getCountByTag(analysisA.parsedIngredients, 'colour'),
      flavourEnhancerCount: getCountByTag(analysisA.parsedIngredients, 'flavour-enhancer'),
      allergenCount: analysisA.declaredAllergens.length,
      beneficialCount: getCountByTag(analysisA.parsedIngredients, 'nutritionally-beneficial'),
      topThree: analysisA.topThreeIngredients.map((p) => p.cleanName),
    },
    productB: {
      name: prodB.name,
      ingredientCount: analysisB.parsedIngredients.length,
      sugarCount: analysisB.hiddenSugars.totalSugarCount,
      preservativeCount: getCountByTag(analysisB.parsedIngredients, 'preservative'),
      colourCount: getCountByTag(analysisB.parsedIngredients, 'colour'),
      flavourEnhancerCount: getCountByTag(analysisB.parsedIngredients, 'flavour-enhancer'),
      allergenCount: analysisB.declaredAllergens.length,
      beneficialCount: getCountByTag(analysisB.parsedIngredients, 'nutritionally-beneficial'),
      topThree: analysisB.topThreeIngredients.map((p) => p.cleanName),
    },
    qualityDisclaimer:
      'Nutritional Reminder: Having fewer ingredients does not automatically mean a product is healthier; overall nutrient density, added sugars, and lipid quality govern wholesome dietary value.',
  };
}
