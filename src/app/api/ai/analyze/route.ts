import { NextResponse } from 'next/server';
import { computeFBS } from '@/lib/fbs';
import { evaluateSmartConsumption } from '@/scorecard-v2/modules/smart-consumption/engine';
import { evaluateNutritionPerPaisa } from '@/scorecard-v2/modules/nutrition-per-paisa/calculator';
import { analyzeIngredients } from '@/scorecard-v2/modules/ingredients-analysis/parser';
import { adaptProductToFacts } from '@/scorecard-v2/adapters/productAdapter';
import type { Product } from '@/types/product';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      brand,
      category,
      subcategory,
      priceINR,
      servingSizeG,
      servingUnit,
      nutrition,
      ingredients,
    } = body;

    // Standardize nutrients
    const energyKcal = nutrition?.energyKcal !== undefined && nutrition?.energyKcal !== null ? Number(nutrition.energyKcal) : null;
    const proteinG = nutrition?.proteinG !== undefined && nutrition?.proteinG !== null ? Number(nutrition.proteinG) : null;
    const carbsG = nutrition?.carbsG !== undefined && nutrition?.carbsG !== null ? Number(nutrition.carbsG) : null;
    const totalSugarG = nutrition?.totalSugarG !== undefined && nutrition?.totalSugarG !== null ? Number(nutrition.totalSugarG) : null;
    const addedSugarG = nutrition?.addedSugarG !== undefined && nutrition?.addedSugarG !== null ? Number(nutrition.addedSugarG) : (totalSugarG ?? null);
    const fatG = nutrition?.fatG !== undefined && nutrition?.fatG !== null ? Number(nutrition.fatG) : null;
    const satFatG = nutrition?.satFatG !== undefined && nutrition?.satFatG !== null ? Number(nutrition.satFatG) : null;
    const transFatG = nutrition?.transFatG !== undefined && nutrition?.transFatG !== null ? Number(nutrition.transFatG) : 0;
    const fibreG = nutrition?.fibreG !== undefined && nutrition?.fibreG !== null ? Number(nutrition.fibreG) : null;
    const sodiumMg = nutrition?.sodiumMg !== undefined && nutrition?.sodiumMg !== null ? Number(nutrition.sodiumMg) : null;
    const cholesterolMg = nutrition?.cholesterolMg !== undefined && nutrition?.cholesterolMg !== null ? Number(nutrition.cholesterolMg) : null;
    const calciumMg = nutrition?.calciumMg !== undefined && nutrition?.calciumMg !== null ? Number(nutrition.calciumMg) : null;
    const ironMg = nutrition?.ironMg !== undefined && nutrition?.ironMg !== null ? Number(nutrition.ironMg) : null;

    const ingArray: string[] = Array.isArray(ingredients)
      ? ingredients.map((s: string) => String(s).trim()).filter(Boolean)
      : typeof ingredients === 'string'
      ? ingredients.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const isBeverage = servingUnit === 'ml' || /drink|beverage|juice|soda|milk/i.test(category || '');

    // 1. Food Benefit Score (FBS)
    const fbsResult = computeFBS({
      energyKcal,
      proteinG,
      carbsG,
      totalSugarG,
      addedSugarG,
      fatG,
      satFatG,
      transFatG,
      fibreG,
      sodiumMg,
      ingredients: ingArray,
      isBeverage,
    });

    // Synthesize transient Product object for scorecard-v2 engine
    const transientProduct: Product = {
      id: `scanned-${Date.now()}`,
      slug: `scanned-food-${Date.now()}`,
      name: name || 'Scanned Packaged Food',
      brand: brand || 'Independent Product',
      category: category || (isBeverage ? 'Beverages' : 'Packaged Foods'),
      subcategory: subcategory || null,
      image: null,
      servingSizeG: servingSizeG ? Number(servingSizeG) : 100,
      packSizeG: servingSizeG ? Number(servingSizeG) : 100,
      priceINR: priceINR !== undefined && priceINR !== null ? Number(priceINR) : null,
      per100g: {
        energyKcal,
        proteinG,
        carbsG,
        totalSugarG,
        addedSugarG,
        fatG,
        satFatG,
        transFatG,
        fibreG,
        sodiumMg,
        micronutrients: [
          ...(calciumMg ? [{ name: 'Calcium', amount: calciumMg, unit: 'mg', rdaPercentage: Math.round((calciumMg / 1000) * 100) }] : []),
          ...(ironMg ? [{ name: 'Iron', amount: ironMg, unit: 'mg', rdaPercentage: Math.round((ironMg / 19) * 100) }] : []),
        ],
      },
      ingredients: ingArray,
      ingredientTags: [],
      benefits: [],
      concerns: [],
      fbs: {
        score: fbsResult.score,
        band: fbsResult.band,
        breakdown: fbsResult.breakdown,
      },
      nutritionPerPaisa: {
        proteinPerRupee: null,
        fibrePerRupee: null,
        tenRupeesGet: [],
      },
      barcode: null,
      aliases: [],
      packSizeText: `${servingSizeG || 100}${servingUnit || 'g'}`,
      lastUpdated: new Date().toISOString(),
      dataSource: 'Live Optical Analysis',
      verification: 'extracted-from-label (needs review)',
    };

    // 2. Scorecard V2 Adapters & Engines
    const facts = adaptProductToFacts(transientProduct);

    // Smart Consumption
    const smartConsumption = evaluateSmartConsumption(facts);

    // Nutrition per Paisa (requires price)
    const nutritionPerPaisa = evaluateNutritionPerPaisa(facts);

    // Ingredients Analysis
    const ingredientsAnalysis = analyzeIngredients(facts.ingredientsList);

    return NextResponse.json({
      success: true,
      analysis: {
        product: transientProduct,
        facts,
        fbs: fbsResult,
        smartConsumption,
        nutritionPerPaisa,
        ingredientsAnalysis,
      },
    });
  } catch (error: any) {
    console.error('Analyze API handler error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to analyze food product',
      },
      { status: 500 }
    );
  }
}
