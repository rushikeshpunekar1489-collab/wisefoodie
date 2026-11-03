export interface ParsedIngredient {
  raw: string;
  cleanName: string;
  declaredPercentage: string | null;
  insCode: string | null;
  parentCompound: string | null;
  orderIndex: number;
  isTopThree: boolean;
  libraryMatch: {
    id: string;
    plainExplanation: string;
    whyUsed: string;
    function: string;
    consumerNote: string;
    fssaiNote: string | null;
    categoryTags: string[];
  } | null;
  indicatorTags: Array<{
    id: string;
    label: string;
    icon: string;
    colorClass: string;
  }>;
}

export interface HiddenSugarAnalysis {
  distinctSugarSources: string[];
  totalSugarCount: number;
  hasMultipleSugars: boolean;
  maltodextrinDetected: boolean;
  maltodextrinNote: string | null;
}

export interface TransparencyFlag {
  trigger: string;
  issue: string;
  explanation: string;
}

export interface ConsumerTakeaway {
  keyObservations: string[];
  allergensSummary: string[];
  worthAttention: string[];
  transparencySummary: string | null;
  friendlyInterpretation: string;
}

export interface IngredientAnalysisResult {
  parsedIngredients: ParsedIngredient[];
  topThreeIngredients: ParsedIngredient[];
  hiddenSugars: HiddenSugarAnalysis;
  additivesList: ParsedIngredient[];
  declaredAllergens: string[];
  precautionaryAllergens: string[];
  transparencyFlags: TransparencyFlag[];
  unknownIngredients: string[];
  consumerTakeaway: ConsumerTakeaway;
}
