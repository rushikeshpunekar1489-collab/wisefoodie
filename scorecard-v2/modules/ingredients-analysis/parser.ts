import libraryData from '../../config/ingredient-library.json';
import type {
  ParsedIngredient,
  HiddenSugarAnalysis,
  TransparencyFlag,
  ConsumerTakeaway,
  IngredientAnalysisResult,
} from './types';

/**
 * Splits an ingredients string by commas while respecting nested parentheses and brackets.
 */
export function splitTopLevelIngredients(raw: string): string[] {
  const result: string[] = [];
  let current = '';
  let parenDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === '(') parenDepth++;
    else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
    else if (char === '[') bracketDepth++;
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);

    if (char === ',' && parenDepth === 0 && bracketDepth === 0) {
      const trimmed = current.trim();
      if (trimmed) result.push(trimmed);
      current = '';
    } else {
      current += char;
    }
  }

  const lastTrimmed = current.trim();
  if (lastTrimmed) result.push(lastTrimmed);

  return result;
}

/**
 * Extracts declared percentage if present (e.g. "Wheat Flour (65%)" -> "65%")
 */
export function extractPercentage(text: string): { cleanText: string; percentage: string | null } {
  const pctMatch = text.match(/\b(\d+(?:\.\d+)?\s*%)/);
  if (pctMatch) {
    return {
      cleanText: text.replace(/\s*\(\s*\d+(?:\.\d+)?\s*%\s*\)/g, '').trim(),
      percentage: pctMatch[1].replace(/\s+/g, ''),
    };
  }
  return { cleanText: text, percentage: null };
}

/**
 * Extracts INS or E-code if present (e.g. "INS 330", "E330", "INS 500(ii)")
 */
export function extractInsCode(text: string): string | null {
  const match = text.match(/\b(?:INS|E)\s*([0-9]{3,4}(?:\s*\([a-z0-9]+\))?)/i);
  return match ? match[1].replace(/\s+/g, '') : null;
}

/**
 * Maps category tag to user-facing indicator badge
 */
export function mapTagToIndicator(tag: string): {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
} {
  switch (tag) {
    case 'nutritionally-beneficial':
      return { id: tag, label: 'Nutritionally Beneficial', icon: '🌿', colorClass: 'badge-beneficial' };
    case 'functional':
      return { id: tag, label: 'Recipe / Functional', icon: '⚙️', colorClass: 'badge-functional' };
    case 'added-sugar':
      return { id: tag, label: 'Added Sugar', icon: '🍬', colorClass: 'badge-sugar' };
    case 'sodium-source':
      return { id: tag, label: 'Sodium Source', icon: '🧂', colorClass: 'badge-sodium' };
    case 'fat-source':
      return { id: tag, label: 'Fat / Lipid Source', icon: '💧', colorClass: 'badge-fat' };
    case 'preservative':
      return { id: tag, label: 'Preservative / Antioxidant', icon: '🛡️', colorClass: 'badge-preservative' };
    case 'colour':
      return { id: tag, label: 'Colourant', icon: '🎨', colorClass: 'badge-colour' };
    case 'flavour-enhancer':
      return { id: tag, label: 'Flavour Enhancer', icon: '✨', colorClass: 'badge-enhancer' };
    case 'emulsifier-stabiliser':
      return { id: tag, label: 'Emulsifier / Stabiliser', icon: '🔄', colorClass: 'badge-stabiliser' };
    case 'potential-allergen':
      return { id: tag, label: 'Allergen Trigger', icon: '⚠️', colorClass: 'badge-allergen' };
    default:
      return { id: tag, label: 'Functional Ingredient', icon: '🔹', colorClass: 'badge-functional' };
  }
}

/**
 * Matches an ingredient name or fragment against the curated library
 */
export function matchLibraryEntry(rawName: string) {
  const lower = rawName.toLowerCase().trim();
  const ins = extractInsCode(rawName);

  for (const item of libraryData.ingredients) {
    // Check INS code match
    if (ins && item.ins && item.ins.toLowerCase() === ins.toLowerCase()) {
      return item;
    }
    // Check aliases
    for (const alias of item.aliases) {
      if (lower.includes(alias.toLowerCase())) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Pure parsing and analysis function for raw ingredients array or text
 */
export function analyzeIngredients(rawInput: string[] | string): IngredientAnalysisResult {
  let topItems: string[] = [];
  if (Array.isArray(rawInput)) {
    if (rawInput.length === 1 && rawInput[0].includes(',')) {
      topItems = splitTopLevelIngredients(rawInput[0]);
    } else {
      topItems = rawInput;
    }
  } else if (typeof rawInput === 'string') {
    topItems = splitTopLevelIngredients(rawInput);
  }

  const parsedIngredients: ParsedIngredient[] = [];
  const unknownIngredients: string[] = [];
  let orderCounter = 0;

  for (const item of topItems) {
    const trimmed = item.trim();
    if (!trimmed) continue;

    // Check if it's a compound ingredient: e.g. "Seasoning [Spices, Salt, Sugar]"
    const compoundMatch = trimmed.match(/^([^\[\(]+)[\[\(](.*)[\]\)]$/);
    if (compoundMatch && compoundMatch[2].includes(',')) {
      const parentName = compoundMatch[1].trim();
      const childrenRaw = compoundMatch[2].trim();
      const children = splitTopLevelIngredients(childrenRaw);

      // Register parent
      orderCounter++;
      const { cleanText: parentClean, percentage: parentPct } = extractPercentage(parentName);
      const parentLib = matchLibraryEntry(parentName);
      const parentTags = parentLib ? parentLib.categoryTags.map(mapTagToIndicator) : [];

      parsedIngredients.push({
        raw: parentName,
        cleanName: parentClean,
        declaredPercentage: parentPct,
        insCode: extractInsCode(parentName),
        parentCompound: null,
        orderIndex: orderCounter,
        isTopThree: orderCounter <= 3,
        libraryMatch: parentLib,
        indicatorTags: parentTags,
      });

      // Register children under parent
      for (const child of children) {
        orderCounter++;
        const { cleanText: childClean, percentage: childPct } = extractPercentage(child);
        const childLib = matchLibraryEntry(child);
        const childTags = childLib ? childLib.categoryTags.map(mapTagToIndicator) : [];

        if (!childLib) {
          unknownIngredients.push(childClean);
        }

        parsedIngredients.push({
          raw: child,
          cleanName: childClean,
          declaredPercentage: childPct,
          insCode: extractInsCode(child),
          parentCompound: parentClean,
          orderIndex: orderCounter,
          isTopThree: orderCounter <= 3,
          libraryMatch: childLib,
          indicatorTags: childTags,
        });
      }
    } else {
      orderCounter++;
      const { cleanText, percentage } = extractPercentage(trimmed);
      const libMatch = matchLibraryEntry(trimmed);
      const tags = libMatch ? libMatch.categoryTags.map(mapTagToIndicator) : [];

      if (!libMatch) {
        unknownIngredients.push(cleanText);
      }

      parsedIngredients.push({
        raw: trimmed,
        cleanName: cleanText,
        declaredPercentage: percentage,
        insCode: extractInsCode(trimmed),
        parentCompound: null,
        orderIndex: orderCounter,
        isTopThree: orderCounter <= 3,
        libraryMatch: libMatch,
        indicatorTags: tags,
      });
    }
  }

  // Top 3 ingredients
  const topThreeIngredients = parsedIngredients.slice(0, 3);

  // Hidden Sugar Detection: sort aliases by length descending so compound forms match first
  const distinctSugarSourcesSet = new Set<string>();
  let maltodextrinDetected = false;
  const sortedSugarAliases = [...libraryData.sugarAliases].sort((a, b) => b.length - a.length);

  for (const item of parsedIngredients) {
    const lower = item.cleanName.toLowerCase();

    // Check maltodextrin separately per Section 7.2 C
    if (libraryData.maltodextrinAliases.some((al: string) => lower.includes(al))) {
      maltodextrinDetected = true;
      continue; // NEVER count maltodextrin as a sugar name
    }

    // Check conventional sugar aliases (longest match first)
    for (const sugarAlias of sortedSugarAliases) {
      if (new RegExp(`\\b${sugarAlias}\\b`, 'i').test(lower)) {
        distinctSugarSourcesSet.add(sugarAlias.toLowerCase());
        break;
      }
    }
  }

  const distinctSugarSources = Array.from(distinctSugarSourcesSet);
  const hiddenSugars: HiddenSugarAnalysis = {
    distinctSugarSources,
    totalSugarCount: distinctSugarSources.length,
    hasMultipleSugars: distinctSugarSources.length >= 2,
    maltodextrinDetected,
    maltodextrinNote: maltodextrinDetected
      ? 'Contains Maltodextrin: A rapidly digestible starch-derived carbohydrate. Though not legally listed as a conventional sugar on labels, it has a high glycemic index.'
      : null,
  };

  // Additives list (any with INS code or preservative/colour/enhancer/stabiliser tags)
  const additivesList = parsedIngredients.filter(
    (p) =>
      p.insCode !== null ||
      p.indicatorTags.some((t) =>
        ['preservative', 'colour', 'flavour-enhancer', 'emulsifier-stabiliser'].includes(t.id)
      )
  );

  // Allergens: Declared vs Precautionary
  const declaredAllergensSet = new Set<string>();
  const precautionaryAllergensSet = new Set<string>();

  for (const p of parsedIngredients) {
    const lower = p.raw.toLowerCase();
    const isPrecautionary = libraryData.allergenRules.precautionaryPhrases.some((phrase: string) =>
      lower.includes(phrase)
    );

    for (const rule of libraryData.allergenRules.declaredAllergens) {
      const matches = rule.keywords.some((kw: string) =>
        new RegExp(`\\b${kw}\\b`, 'i').test(lower)
      );
      if (matches) {
        if (isPrecautionary) {
          precautionaryAllergensSet.add(rule.label);
        } else {
          declaredAllergensSet.add(rule.label);
        }
      }
    }
  }

  // Transparency Flags
  const transparencyFlags: TransparencyFlag[] = [];
  const fullText = parsedIngredients.map((p) => p.raw).join(', ').toLowerCase();

  for (const flag of libraryData.transparencyFlags) {
    if (fullText.includes(flag.trigger)) {
      transparencyFlags.push(flag);
    }
  }

  // Consumer Takeaway (deterministic template-driven per Section 7.2 I)
  const keyObservations: string[] = [];
  if (topThreeIngredients.length > 0) {
    const topNames = topThreeIngredients.map((p) => p.cleanName).join(', ');
    keyObservations.push(`Top 3 ingredients by weight: ${topNames}. Food regulations mandate that ingredients are listed in descending order by weight.`);
  }

  if (hiddenSugars.hasMultipleSugars) {
    keyObservations.push(
      `Multiple added sugar sources detected (${hiddenSugars.totalSugarCount} distinct forms: ${distinctSugarSources.join(', ')}). Combining various sugars can mask overall sweetness intensity on the front label.`
    );
  } else if (hiddenSugars.totalSugarCount === 1) {
    keyObservations.push(`Single added sugar source identified (${distinctSugarSources[0]}).`);
  }

  if (maltodextrinDetected) {
    keyObservations.push(`Maltodextrin present as a bulking agent / carrier; rapidly metabolized starch-derived carbohydrate.`);
  }

  const worthAttention: string[] = [];
  for (const flag of transparencyFlags) {
    worthAttention.push(`${flag.issue}: ${flag.explanation}`);
  }

  const allergensSummary = Array.from(declaredAllergensSet);

  let transparencySummary: string | null = null;
  if (transparencyFlags.length > 0 || unknownIngredients.length > 0) {
    transparencySummary = `Transparency Limits: ${transparencyFlags.length} generic labelling disclosure(s) detected. ${unknownIngredients.length > 0 ? `${unknownIngredients.length} ingredient(s) pending WiseFoodies library indexing.` : ''}`;
  }

  const friendlyInterpretation =
    topThreeIngredients.some((p) => p.cleanName.toLowerCase().includes('whole') || p.cleanName.toLowerCase().includes('milk'))
      ? 'Whole-food or dairy base forms the majority of this product by weight.'
      : 'Formulated with refined grains, vegetable fats, or added sugars among its primary bulk weight.';

  return {
    parsedIngredients,
    topThreeIngredients,
    hiddenSugars,
    additivesList,
    declaredAllergens: Array.from(declaredAllergensSet),
    precautionaryAllergens: Array.from(precautionaryAllergensSet),
    transparencyFlags,
    unknownIngredients: Array.from(new Set(unknownIngredients)),
    consumerTakeaway: {
      keyObservations,
      allergensSummary,
      worthAttention,
      transparencySummary,
      friendlyInterpretation,
    },
  };
}
