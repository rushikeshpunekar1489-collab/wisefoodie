import { NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/ai/gemini';

export interface ExtractedNutritionData {
  productName: string | null;
  brand: string | null;
  category: string | null;
  servingSizeValue: number | null;
  servingUnit: 'g' | 'ml';
  nutritionBasis: 'per100g' | 'per100ml' | 'perServing';
  isBeverage: boolean;
  nutrition: {
    energyKcal: number | null;
    proteinG: number | null;
    carbsG: number | null;
    totalSugarG: number | null;
    addedSugarG: number | null;
    fatG: number | null;
    satFatG: number | null;
    transFatG: number | null;
    fibreG: number | null;
    sodiumMg: number | null;
    cholesterolMg: number | null;
    calciumMg: number | null;
    ironMg: number | null;
  };
  ingredientsRaw: string;
  ingredientsList: string[];
  qualityAssessment: {
    isReadable: boolean;
    isBlurry: boolean;
    hasIncompleteLabel: boolean;
    missingKeyNutrients: string[];
    confidence: 'high' | 'medium' | 'low';
    notes: string;
  };
  source: 'ai_vision' | 'rule_based' | 'fallback';
}

function parseNutritionText(text: string): ExtractedNutritionData {
  const clean = text.replace(/\r/g, ' ');

  const getNum = (regex: RegExp): number | null => {
    const match = clean.match(regex);
    if (!match) return null;
    const num = parseFloat(match[1]);
    return isNaN(num) ? null : num;
  };

  // Extract core nutrients
  const energyKcal = getNum(/(?:energy|calories|caloric\s*value)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*(?:kcal|cal)?/i);
  const proteinG = getNum(/(?:protein[s]?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i) ?? getNum(/(?:protein[s]?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)/i);
  const carbsG = getNum(/(?:carbohydrate[s]?|total\s*carbs)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i) ?? getNum(/(?:carbohydrate[s]?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)/i);
  const addedSugarG = getNum(/(?:added\s*sugar[s]?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i);
  const totalSugarG = getNum(/(?:total\s*sugar[s]?|sugar[s]?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i) ?? getNum(/(?:total\s*sugar[s]?|sugar[s]?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)/i);
  const fatG = getNum(/(?:total\s*fat|fat\b)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i) ?? getNum(/(?:total\s*fat|fat\b)[^0-9]*?([0-9]+(?:\.[0-9]+)?)/i);
  const satFatG = getNum(/(?:saturated\s*fat(?:ty\s*acids)?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i);
  const transFatG = getNum(/(?:trans\s*fat(?:ty\s*acids)?)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i);
  const fibreG = getNum(/(?:dietary\s*fib(?:er|re)|fib(?:er|re))[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*g/i);
  const sodiumMg = getNum(/(?:sodium)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*mg/i) ?? getNum(/(?:sodium)[^0-9]*?([0-9]+(?:\.[0-9]+)?)/i);
  const cholesterolMg = getNum(/(?:cholesterol)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*mg/i);
  const calciumMg = getNum(/(?:calcium)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*mg/i);
  const ironMg = getNum(/(?:iron)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*mg/i);

  // Serving size
  const servingMatch = clean.match(/(?:serving\s*size|serve\s*size|per\s*serve)[^0-9]*?([0-9]+(?:\.[0-9]+)?)\s*(g|ml)/i);
  const servingSizeValue = servingMatch ? parseFloat(servingMatch[1]) : 100;
  const servingUnit: 'g' | 'ml' = servingMatch && servingMatch[2].toLowerCase() === 'ml' ? 'ml' : 'g';

  // Ingredients extraction
  let rawIngredients = '';
  const ingMatch = clean.match(/ingredients\s*[:\-]([\s\S]*?)(?:nutrition|contain|allergen|mfg|lic|best\s*before|$)/i);
  if (ingMatch && ingMatch[1]) {
    rawIngredients = ingMatch[1].trim();
  } else if (/maida|sugar|palm oil|milk solids|wheat/i.test(clean)) {
    rawIngredients = clean;
  }

  const ingredientsList = rawIngredients
    ? rawIngredients
        .split(/[,;\n]/)
        .map(i => i.trim().replace(/^[-•*]\s*/, ''))
        .filter(i => i.length > 2 && !/^(ingredients|net weight|batch|mrp)/i.test(i))
    : [];

  // Missing essential nutrients evaluation for FBS
  const missing: string[] = [];
  if (energyKcal === null) missing.push('Energy (kcal)');
  if (proteinG === null) missing.push('Protein (g)');
  if (totalSugarG === null && addedSugarG === null) missing.push('Sugar (g)');
  if (fatG === null) missing.push('Fat (g)');
  if (sodiumMg === null) missing.push('Sodium (mg)');

  return {
    productName: null,
    brand: null,
    category: servingUnit === 'ml' ? 'Beverages' : 'Packaged Food',
    servingSizeValue: servingSizeValue,
    servingUnit: servingUnit,
    nutritionBasis: 'per100g',
    isBeverage: servingUnit === 'ml',
    nutrition: {
      energyKcal,
      proteinG,
      carbsG,
      totalSugarG,
      addedSugarG: addedSugarG ?? totalSugarG,
      fatG,
      satFatG,
      transFatG: transFatG ?? 0,
      fibreG,
      sodiumMg,
      cholesterolMg,
      calciumMg,
      ironMg,
    },
    ingredientsRaw: rawIngredients,
    ingredientsList,
    qualityAssessment: {
      isReadable: missing.length <= 2,
      isBlurry: false,
      hasIncompleteLabel: missing.length > 0,
      missingKeyNutrients: missing,
      confidence: missing.length === 0 ? 'high' : missing.length <= 2 ? 'medium' : 'low',
      notes: missing.length === 0
        ? 'All essential nutritional values and ingredients recognized successfully.'
        : `Please verify or fill in: ${missing.join(', ')}.`,
    },
    source: 'rule_based',
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { images, rawText, labelType } = body;

    // 1. Try Gemini Vision if images are provided and client is available
    const genAI = getGeminiClient();
    if (genAI && Array.isArray(images) && images.length > 0) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const imageParts = images.map((img: { data: string; mimeType?: string }) => {
          let base64 = img.data;
          let mime = img.mimeType || 'image/jpeg';
          if (base64.includes(';base64,')) {
            const parts = base64.split(';base64,');
            mime = parts[0].replace('data:', '') || mime;
            base64 = parts[1];
          }
          return {
            inlineData: {
              data: base64,
              mimeType: mime,
            },
          };
        });

        const prompt = `You are an expert food technologist and OCR engine analyzing Indian packaged food product labels.
Extract the exact information from the label images into valid JSON matching this schema:
{
  "productName": "string or null",
  "brand": "string or null",
  "category": "string or null (e.g. Biscuits, Snacks, Beverages, Dairy, Instant Food, Chocolate, Breakfast Cereals, Sweets)",
  "servingSizeValue": number or null,
  "servingUnit": "g" or "ml",
  "nutritionBasis": "per100g" or "per100ml" or "perServing",
  "isBeverage": boolean,
  "nutrition": {
    "energyKcal": number or null,
    "proteinG": number or null,
    "carbsG": number or null,
    "totalSugarG": number or null,
    "addedSugarG": number or null,
    "fatG": number or null,
    "satFatG": number or null,
    "transFatG": number or null,
    "fibreG": number or null,
    "sodiumMg": number or null,
    "cholesterolMg": number or null,
    "calciumMg": number or null,
    "ironMg": number or null
  },
  "ingredientsRaw": "exact raw ingredients text from label",
  "ingredientsList": ["exact ingredients in order as printed on package"],
  "qualityAssessment": {
    "isReadable": boolean,
    "isBlurry": boolean,
    "hasIncompleteLabel": boolean,
    "missingKeyNutrients": ["list of missing essential nutrients if any: Energy, Protein, Sugar, Fat, Sodium"],
    "confidence": "high" or "medium" or "low",
    "notes": "clear observation on label quality or missing information"
  }
}
CRITICAL RULES:
- Never invent nutritional values. If a nutrient is missing from the label, return null.
- Maintain original ingredient order as printed on the package.
- Identify whether values are per 100g, per 100ml, or per serving.
- Return ONLY valid JSON, no markdown codeblocks.`;

        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text().trim();
        const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleanedJson);

        return NextResponse.json({
          success: true,
          data: {
            ...parsed,
            source: 'ai_vision',
          },
        });
      } catch (geminiError) {
        console.warn('Gemini vision extraction failed, falling back to rule-based parser:', geminiError);
      }
    }

    // 2. Fallback: Parse from text or provided input
    if (rawText && typeof rawText === 'string' && rawText.trim().length > 0) {
      const parsedData = parseNutritionText(rawText);
      return NextResponse.json({
        success: true,
        data: parsedData,
      });
    }

    // 3. Fallback when sample image or unparsed image was uploaded
    // Returns structured empty template with helpful guidance for user verification
    const emptyTemplate: ExtractedNutritionData = {
      productName: null,
      brand: null,
      category: 'Packaged Food',
      servingSizeValue: 100,
      servingUnit: 'g',
      nutritionBasis: 'per100g',
      isBeverage: false,
      nutrition: {
        energyKcal: null,
        proteinG: null,
        carbsG: null,
        totalSugarG: null,
        addedSugarG: null,
        fatG: null,
        satFatG: null,
        transFatG: 0,
        fibreG: null,
        sodiumMg: null,
        cholesterolMg: null,
        calciumMg: null,
        ironMg: null,
      },
      ingredientsRaw: '',
      ingredientsList: [],
      qualityAssessment: {
        isReadable: true,
        isBlurry: false,
        hasIncompleteLabel: true,
        missingKeyNutrients: ['Energy (kcal)', 'Protein (g)', 'Sugar (g)', 'Fat (g)', 'Sodium (mg)'],
        confidence: 'medium',
        notes: 'Image received. Please confirm or enter the label values below to run independent analysis.',
      },
      source: 'fallback',
    };

    return NextResponse.json({
      success: true,
      data: emptyTemplate,
    });
  } catch (error: any) {
    console.error('Scan API handler error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process food label image',
      },
      { status: 500 }
    );
  }
}
