/**
 * WiseFoodies Ingredient Normalizer, Tagging, and Search Engine
 * Pure logic module with synonym mapping, INS/E-number resolution, natural-language query routing,
 * and strict verification safeguards.
 */

import type { Product } from '@/types/product';

export interface IngredientTagDefinition {
  id: string;
  label: string;
  group: 'concern' | 'functional' | 'positive' | 'allergen';
  isAllergen?: boolean;
  synonyms: string[];
}

export const INGREDIENT_TAGS: IngredientTagDefinition[] = [
  {
    id: 'palm-oil',
    label: 'Palm Oil / Palmolein',
    group: 'concern',
    synonyms: [
      'palm oil',
      'palmolein',
      'palm fat',
      'edible vegetable oil (palm)',
      'edible vegetable oil (palmolein)',
      'fractionated palm oil',
      'palmolein oil',
      'hydrogenated palm oil',
      'palm kernel oil',
      'palm stearin',
    ],
  },
  {
    id: 'refined-flour',
    label: 'Refined Flour (Maida)',
    group: 'concern',
    synonyms: [
      'maida',
      'refined wheat flour',
      'refined flour',
      'white flour',
      'bleached flour',
      'enriched flour',
      'all purpose flour',
    ],
  },
  {
    id: 'added-sugar',
    label: 'Added Sugars',
    group: 'concern',
    synonyms: [
      'sugar',
      'sucrose',
      'glucose',
      'liquid glucose',
      'invert sugar',
      'corn syrup',
      'high fructose corn syrup',
      'dextrose',
      'maltodextrin',
      'cane sugar',
      'caramelized sugar',
      'brown sugar',
      'icing sugar',
      'chini',
      'shakkar',
      'cheeni',
      'fructose',
      'golden syrup',
    ],
  },
  {
    id: 'artificial-colour',
    label: 'Artificial Colours',
    group: 'concern',
    synonyms: [
      'artificial colour',
      'synthetic food colour',
      'tartrazine',
      'sunset yellow',
      'brilliant blue',
      'caramel iv',
      'allura red',
      'ponceau 4r',
      'carmoisine',
      'erythrosine',
      'ins 102',
      'ins 110',
      'ins 122',
      'ins 124',
      'ins 127',
      'ins 133',
      'ins 150d',
      'e102',
      'e110',
      'e122',
      'e124',
      'e133',
      'e150d',
    ],
  },
  {
    id: 'artificial-sweetener',
    label: 'Artificial Sweeteners',
    group: 'concern',
    synonyms: [
      'artificial sweetener',
      'non-caloric sweetener',
      'sucralose',
      'aspartame',
      'acesulfame',
      'acesulfame k',
      'acesulfame potassium',
      'saccharin',
      'neotame',
      'ins 950',
      'ins 951',
      'ins 954',
      'ins 955',
      'ins 960',
      'e950',
      'e951',
      'e955',
      'e960',
    ],
  },
  {
    id: 'preservative',
    label: 'Chemical Preservatives',
    group: 'concern',
    synonyms: [
      'preservative',
      'class ii preservative',
      'sodium benzoate',
      'potassium sorbate',
      'sorbic acid',
      'benzoic acid',
      'calcium propionate',
      'sodium metabisulphite',
      'ins 211',
      'ins 202',
      'ins 282',
      'ins 223',
      'e211',
      'e202',
      'e282',
    ],
  },
  {
    id: 'emulsifier',
    label: 'Emulsifiers & Thickeners',
    group: 'functional',
    synonyms: [
      'emulsifier',
      'stabilizer',
      'thickener',
      'soy lecithin',
      'lecithin',
      'mono and diglycerides',
      'ins 322',
      'ins 471',
      'ins 472',
      'ins 412',
      'ins 415',
      'ins 407',
      'carrageenan',
      'guar gum',
      'xanthan gum',
      'e322',
      'e471',
      'e412',
    ],
  },
  {
    id: 'whole-grain',
    label: 'Whole Grains',
    group: 'positive',
    synonyms: [
      'whole wheat',
      'whole grain',
      'rolled oats',
      'whole oats',
      'oat flour',
      'jowar',
      'bajra',
      'ragi',
      'millet',
      'finger millet',
      'brown rice',
      'quinoa',
      'barley',
      'whole wheat flour',
      'atta',
    ],
  },
  {
    id: 'nuts',
    label: 'Nuts & Seeds (Allergen)',
    group: 'allergen',
    isAllergen: true,
    synonyms: [
      'almond',
      'cashew',
      'walnut',
      'pistachio',
      'peanut',
      'groundnut',
      'hazelnut',
      'kaju',
      'badam',
      'pista',
      'moongfali',
      'flaxseed',
      'chia seed',
      'pumpkin seed',
      'sunflower seed',
    ],
  },
  {
    id: 'milk',
    label: 'Dairy / Milk (Allergen)',
    group: 'allergen',
    isAllergen: true,
    synonyms: [
      'milk',
      'milk solids',
      'pasteurized milk',
      'skimmed milk',
      'whey',
      'whey protein',
      'casein',
      'cheese',
      'paneer',
      'curd',
      'dahi',
      'butter',
      'ghee',
      'cream',
      'lactose',
      'doodh',
      'dairy',
    ],
  },
  {
    id: 'gluten',
    label: 'Gluten / Wheat (Allergen)',
    group: 'allergen',
    isAllergen: true,
    synonyms: [
      'wheat',
      'refined wheat flour',
      'maida',
      'atta',
      'sooji',
      'semolina',
      'rava',
      'barley',
      'rye',
      'gluten',
      'vital gluten',
      'wheat gluten',
    ],
  },
  {
    id: 'soy',
    label: 'Soy / Soya (Allergen)',
    group: 'allergen',
    isAllergen: true,
    synonyms: [
      'soy',
      'soya',
      'soybean',
      'soy protein',
      'soy lecithin',
      'soya flour',
      'soya chunks',
      'edamame',
      'soyabean',
    ],
  },
];

export const ALLERGEN_DISCLAIMER =
  'Always check the physical pack. Manufacturing facilities may involve cross-contact with allergens.';

/**
 * Normalise ingredient string for comparison: lowercase, remove special characters, trim.
 */
export function normalizeIngredientText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\(\)\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if a product contains a specific tag, returning matching term if found.
 */
export function matchProductIngredientTag(
  product: Product,
  tagId: string
): { matches: boolean; matchedTerm?: string } {
  const tagDef = INGREDIENT_TAGS.find((t) => t.id === tagId);
  if (!tagDef) return { matches: false };

  // Combine ingredients array or text
  const ingredientString = Array.isArray(product.ingredients)
    ? product.ingredients.join(', ')
    : String(product.ingredients || '');

  if (!ingredientString.trim()) {
    return { matches: false };
  }

  const normalized = normalizeIngredientText(ingredientString);

  for (const synonym of tagDef.synonyms) {
    const normSyn = normalizeIngredientText(synonym);
    // Boundary-safe search
    const regex = new RegExp(`(?:^|\\b|\\()${escapeRegex(normSyn)}(?:\\b|\\)|$)`, 'i');
    if (regex.test(normalized)) {
      return { matches: true, matchedTerm: synonym };
    }
  }

  return { matches: false };
}

/**
 * Derive all matching ingredient tags for a product.
 */
export function deriveProductIngredientTags(product: Product): string[] {
  const matched: string[] = [];
  for (const tag of INGREDIENT_TAGS) {
    if (matchProductIngredientTag(product, tag.id).matches) {
      matched.push(tag.id);
    }
  }
  return matched;
}

export interface NaturalLanguageIngredientFilter {
  tagId: string;
  type: 'contains' | 'does_not_contain';
  originalQuery: string;
}

/**
 * Parse natural-language queries into structured ingredient tag filters.
 * e.g. "without palm oil", "bina maida ke", "no added sugar", "contains whole grain"
 */
export function parseNaturalLanguageIngredientQuery(
  rawQuery: string
): NaturalLanguageIngredientFilter | null {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return null;

  // Negative patterns: without, no, free, bina ... ke, zero
  const negativePrefixes = [
    /^(?:without|no|zero|free\s*from|bina)\s+(.+?)(?:\s+ke)?$/,
    /^(.+?)\s+(?:free|rahit)$/,
  ];

  let isNegative = false;
  let targetPhrase = q;

  for (const pattern of negativePrefixes) {
    const match = q.match(pattern);
    if (match) {
      isNegative = true;
      targetPhrase = match[1].trim();
      break;
    }
  }

  // Look up targetPhrase across synonyms
  for (const tag of INGREDIENT_TAGS) {
    for (const syn of tag.synonyms) {
      if (
        targetPhrase === syn ||
        targetPhrase.includes(syn) ||
        syn.includes(targetPhrase)
      ) {
        return {
          tagId: tag.id,
          type: isNegative ? 'does_not_contain' : 'contains',
          originalQuery: rawQuery,
        };
      }
    }
    if (tag.id.replace('-', ' ') === targetPhrase || tag.label.toLowerCase().includes(targetPhrase)) {
      return {
        tagId: tag.id,
        type: isNegative ? 'does_not_contain' : 'contains',
        originalQuery: rawQuery,
      };
    }
  }

  return null;
}

export interface IngredientFilterOptions {
  containsTags?: string[];
  doesNotContainTags?: string[];
  textQuery?: string;
}

export interface IngredientFilterResult {
  matchedProducts: Product[];
  unknownProducts: Product[];
  matchReasons: Map<string, Array<{ tagId: string; label: string; matchedTerm: string; type: 'contains' | 'verified_free' }>>;
  hasActiveFilters: boolean;
  activeAllergensSelected: boolean;
}

/**
 * Filter products with strict accuracy rule:
 * "does_not_contain" only matches if the product ingredient list is verified and non-empty.
 */
export function filterProductsByIngredients(
  products: Product[],
  options: IngredientFilterOptions = {}
): IngredientFilterResult {
  const contains = options.containsTags || [];
  const doesNotContain = options.doesNotContainTags || [];
  const textQuery = options.textQuery ? options.textQuery.toLowerCase().trim() : '';

  const hasActiveFilters = contains.length > 0 || doesNotContain.length > 0 || textQuery.length > 0;
  const matchReasons = new Map<
    string,
    Array<{ tagId: string; label: string; matchedTerm: string; type: 'contains' | 'verified_free' }>
  >();

  // Check if any allergen tags are selected in options
  const activeAllergensSelected = [...contains, ...doesNotContain].some((id) => {
    const tag = INGREDIENT_TAGS.find((t) => t.id === id);
    return tag?.isAllergen;
  });

  if (!hasActiveFilters) {
    return {
      matchedProducts: products,
      unknownProducts: [],
      matchReasons,
      hasActiveFilters: false,
      activeAllergensSelected: false,
    };
  }

  const matched: Product[] = [];
  const unknown: Product[] = [];

  for (const product of products) {
    const hasIngredients = Array.isArray(product.ingredients) && product.ingredients.length > 0;
    const isVerified = product.verification === 'complete';

    // If doesNotContain is requested, but product has no ingredients list or is incomplete,
    // accuracy rule dictates it cannot be certified as "free from X".
    if (doesNotContain.length > 0 && (!hasIngredients || !isVerified)) {
      unknown.push(product);
      continue;
    }

    let passesContains = true;
    const reasons: Array<{ tagId: string; label: string; matchedTerm: string; type: 'contains' | 'verified_free' }> = [];

    // Check CONTAINS filters
    for (const tagId of contains) {
      const match = matchProductIngredientTag(product, tagId);
      if (!match.matches) {
        passesContains = false;
        break;
      }
      const tagDef = INGREDIENT_TAGS.find((t) => t.id === tagId);
      reasons.push({
        tagId,
        label: tagDef?.label || tagId,
        matchedTerm: match.matchedTerm || tagId,
        type: 'contains',
      });
    }

    if (!passesContains) continue;

    // Check DOES NOT CONTAIN filters
    let passesDoesNotContain = true;
    for (const tagId of doesNotContain) {
      const match = matchProductIngredientTag(product, tagId);
      if (match.matches) {
        passesDoesNotContain = false;
        break;
      }
      const tagDef = INGREDIENT_TAGS.find((t) => t.id === tagId);
      reasons.push({
        tagId,
        label: tagDef?.label || tagId,
        matchedTerm: 'Verified free on label',
        type: 'verified_free',
      });
    }

    if (!passesDoesNotContain) continue;

    // Free text check in ingredients if provided
    if (textQuery) {
      const ingText = Array.isArray(product.ingredients)
        ? product.ingredients.join(' ').toLowerCase()
        : String(product.ingredients || '').toLowerCase();

      if (!ingText.includes(textQuery)) {
        continue;
      }
    }

    matchReasons.set(product.slug, reasons);
    matched.push(product);
  }

  return {
    matchedProducts: matched,
    unknownProducts: unknown,
    matchReasons,
    hasActiveFilters,
    activeAllergensSelected,
  };
}

/**
 * Highlight ingredients in text that match active tags or search terms.
 */
export function highlightIngredientTokens(
  ingredientText: string,
  matchedSynonyms: string[]
): Array<{ text: string; isHighlighted: boolean }> {
  if (!ingredientText || matchedSynonyms.length === 0) {
    return [{ text: ingredientText, isHighlighted: false }];
  }

  const escaped = matchedSynonyms.map((s) => escapeRegex(s.trim())).filter(Boolean);
  if (escaped.length === 0) {
    return [{ text: ingredientText, isHighlighted: false }];
  }

  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = ingredientText.split(regex);

  return parts.map((part) => ({
    text: part,
    isHighlighted: matchedSynonyms.some((s) => s.toLowerCase() === part.toLowerCase()),
  }));
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
