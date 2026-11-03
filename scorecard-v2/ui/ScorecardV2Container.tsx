import React from 'react';
import type { Product } from '../../types/product';
import { adaptProductToFacts } from '../adapters/productAdapter';
import { evaluateSmartConsumption } from '../modules/smart-consumption/engine';
import { evaluateNutritionPerPaisa } from '../modules/nutrition-per-paisa/calculator';
import { analyzeIngredients } from '../modules/ingredients-analysis/parser';

import ModuleErrorBoundary from './ModuleErrorBoundary';
import SmartConsumptionCard from './SmartConsumptionCard';
import NutritionPerPaisaV2Card from './NutritionPerPaisaV2Card';
import IngredientsAnalysisCard from './IngredientsAnalysisCard';

interface ScorecardV2ContainerProps {
  product: Product;
}

export default function ScorecardV2Container({ product }: ScorecardV2ContainerProps) {
  const facts = adaptProductToFacts(product);

  const smartConsumption = evaluateSmartConsumption(facts);
  const nutritionPerPaisa = evaluateNutritionPerPaisa(facts);
  const ingredientsAnalysis = analyzeIngredients(facts.ingredientsList);

  return (
    <div className="space-y-8">
      {/* MODULE 1: SMART CONSUMPTION */}
      <ModuleErrorBoundary moduleName="Smart Consumption">
        <SmartConsumptionCard analysis={smartConsumption} />
      </ModuleErrorBoundary>

      {/* MODULE 2: NUTRITION PER PAISA (UPGRADED IN PLACE) */}
      <ModuleErrorBoundary moduleName="Nutrition Per Paisa">
        <NutritionPerPaisaV2Card analysis={nutritionPerPaisa} />
      </ModuleErrorBoundary>

      {/* MODULE 3: INTELLIGENT INGREDIENTS ANALYSIS (UPGRADED IN PLACE) */}
      <ModuleErrorBoundary moduleName="Ingredient Analysis">
        <IngredientsAnalysisCard analysis={ingredientsAnalysis} />
      </ModuleErrorBoundary>
    </div>
  );
}
