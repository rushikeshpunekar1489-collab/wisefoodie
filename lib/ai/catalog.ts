import { getAllProductsWithSamples } from '@/lib/products';
import type { Product, ProductPer100g } from '@/types/product';

export interface SearchableDocument {
  id: string;
  slug: string;
  name: string;
  brand: string;
  variant: string;
  category: string;
  subcategory: string;
  packSizeG: number | null;
  packSizeText: string | null;
  priceINR: number | null;
  fbsScore: number | null;
  fbsBand: string | null;
  fbsTopFactors: string[];
  per100g: ProductPer100g;
  ingredients: string[];
  ingredientTags: string[];
  benefits: string[];
  concerns: string[];
  verification: string;
  lastUpdated: string;
  aliases: string[];
  searchText: string;
  embeddingText: string;
}

// Common Indian food synonyms and regional transliterations (Hindi, Marathi, Hinglish)
export const REGIONAL_SYNONYMS: Record<string, string[]> = {
  // Dairy & Milks
  milk: ['doodh', 'dudh', 'dugdha', 'दूध', 'गाय का दूध', 'भैंस का दूध', 'fresh milk', 'toned milk', 'cow milk', 'taaza', 'amul milk'],
  curd: ['dahi', 'yogurt', 'yoghurt', 'दही', 'ताक', 'curds', 'probiotic dahi', 'mishti doi'],
  butter: ['makhan', 'makkhan', 'maska', 'मक्खन', 'लोणी', 'table butter', 'salted butter', 'white butter'],
  ghee: ['desi ghee', 'clarified butter', 'घी', 'तूप', 'pure ghee', 'cow ghee', 'asli ghee'],
  paneer: ['cottage cheese', 'पनीर', 'fresh paneer', 'chenna', 'malai paneer'],
  buttermilk: ['chaas', 'chhas', 'taak', 'mattha', 'छाछ', 'ताक', 'मट्ठा', 'masala chaas'],
  lassi: ['लस्सी', 'sweet lassi', 'mango lassi', 'rose lassi'],
  cheese: ['चीज़', 'processed cheese', 'cheese slices', 'cheese cubes', 'mozzarella'],

  // Bakery, Grains & Cereals
  biscuit: ['biskut', 'biscut', 'cookie', 'cookies', 'बिस्कुट', 'बिस्किट', 'बिस्किटे', 'khari', 'rusk', 'toast'],
  bread: ['pao', 'pav', 'roti', 'loaf', 'ब्रेड', 'पाव', 'brown bread', 'whole wheat bread', 'white bread'],
  atta: ['wheat flour', 'gehu ka atta', 'whole wheat', 'आटा', 'गव्हाचे पीठ', 'chakki atta', 'multigrain atta'],
  maida: ['refined wheat flour', 'all purpose flour', 'मैदा'],
  oats: ['rolled oats', 'porridge', 'ओट्स', 'instant oats', 'oatmeal'],
  cornflakes: ['cereal', 'breakfast cereal', 'कॉर्नफ्लेक्स', 'muesli', 'granola', 'chocos'],
  poha: ['flattened rice', 'chiwda', 'पोहा', 'पोहे', 'aval'],
  suji: ['semolina', 'rava', 'सूजी', 'रवा'],
  besan: ['gram flour', 'chana flour', 'बेसन'],

  // Snacks & Savouries
  chips: ['namkeen', 'snack', 'wafers', 'crisps', 'चिप्स', 'फरसाण', 'potato chips', 'banana chips', 'kurkure', 'lays'],
  namkeen: ['farsan', 'bhujia', 'sev', 'chivda', 'gathiya', 'नमकीन', 'भुजिया', 'सेव', 'फरसाण'],
  noodles: ['maggi', 'yippee', 'chowmein', 'instant noodles', 'नूडल्स', 'मैगी', 'pasta', 'macaroni', 'vermicelli', 'sewai'],

  // Beverages
  tea: ['chai', 'cha', 'chaha', 'चाय', 'चहा', 'patti', 'green tea', 'masala chai'],
  coffee: ['kaapi', 'espresso', 'कॉफ़ी', 'कॉफी', 'instant coffee', 'filter coffee'],
  juice: ['ras', 'fruit juice', 'जूस', 'शरबत', 'squash', 'cordial'],
  cola: ['cold drink', 'soft drink', 'soda', 'carbonated drink', 'कोल्ड ड्रिंक', 'सोडा'],

  // Staples & Sweeteners
  sugar: ['cheeni', 'shakkar', 'sakhar', 'चीनी', 'शक्कर', 'साखर', 'jaggery', 'gud', 'गुड़', 'गूळ'],
  salt: ['namak', 'mith', 'नमक', 'मीठ', 'sendha namak', 'rock salt', 'black salt', 'kala namak'],
  oil: ['tel', 'cooking oil', 'edible oil', 'तेल', 'mustard oil', 'sarson ka tel', 'sunflower oil', 'groundnut oil', 'refined oil', 'palm oil'],
  chocolate: ['choclate', 'mithai', 'candy', 'चॉकलेट', 'toffee', 'sweet'],
  dal: ['daal', 'pulses', 'lentils', 'दाल', 'डाळ', 'toor dal', 'moong dal', 'urad dal', 'chana dal'],
  rice: ['chawal', 'tandul', 'चावल', 'तांदूळ', 'basmati', 'kolam'],
};

// Common brand transliterations
const BRAND_TRANSLITERATIONS: Record<string, string[]> = {
  amul: ['अमूल', 'amool'],
  nestle: ['nestlé', 'नेस्ले'],
  'nestlé': ['nestle', 'नेस्ले'],
  britannia: ['ब्रिटानिया', 'britania'],
  parle: ['पारले'],
  'haldiram\'s': ['haldiram', 'haldirams', 'हल्दीराम'],
  bikaji: ['बीकाजी'],
  tata: ['टाटा'],
  kellogg: ['kellogg\'s', 'केलाॅग्स', 'केलाग्स'],
  saffola: ['सफोला', 'सफ़ोला'],
  patanjali: ['पतंजलि', 'पतञ्जलि'],
  dabur: ['डाबर'],
  cadbury: ['कैडबरी'],
  itc: ['आईटीसी'],
  campa: ['कैम्पा', 'काम्पा'],
};

function generateAliases(product: Product): string[] {
  const set = new Set<string>();

  // Add existing aliases
  if (Array.isArray(product.aliases)) {
    product.aliases.forEach((a) => set.add(a.toLowerCase().trim()));
  }

  // Name variations
  const lowerName = product.name.toLowerCase();
  const lowerBrand = product.brand.toLowerCase();
  set.add(lowerName);
  set.add(`${lowerBrand} ${lowerName}`);
  set.add(lowerBrand);

  // Brand transliterations
  const brandTrans = BRAND_TRANSLITERATIONS[lowerBrand];
  if (brandTrans) {
    brandTrans.forEach((bt) => {
      set.add(bt);
      set.add(`${bt} ${lowerName}`);
    });
  }

  // Check synonym map
  for (const [key, synonyms] of Object.entries(REGIONAL_SYNONYMS)) {
    if (lowerName.includes(key) || (product.category && product.category.toLowerCase().includes(key))) {
      synonyms.forEach((syn) => {
        set.add(syn);
        set.add(`${lowerBrand} ${syn}`);
      });
    }
  }

  // Variant & Pack Size Distinct Identifiers (e.g., 500ml, 1L, 200g, 1kg)
  if (product.packSizeText) {
    const pack = product.packSizeText.toLowerCase().trim();
    set.add(`${lowerName} ${pack}`);
    set.add(`${lowerBrand} ${lowerName} ${pack}`);

    // Standardized variants like 500ml, 1l, 200g, 1kg
    const compactPack = pack.replace(/\s+/g, '');
    set.add(compactPack);
    set.add(`${lowerName} ${compactPack}`);

    if (pack.includes('1 l') || pack.includes('1l') || pack.includes('1000 ml')) {
      set.add(`${lowerName} 1 litre`);
      set.add(`${lowerName} ek litre`);
      set.add(`${lowerName} family pack`);
      set.add(`${lowerName} bada pack`);
    } else if (pack.includes('500 ml') || pack.includes('500ml')) {
      set.add(`${lowerName} half litre`);
      set.add(`${lowerName} aadha litre`);
      set.add(`${lowerName} 500 ml`);
    } else if (pack.includes('200 ml') || pack.includes('200ml')) {
      set.add(`${lowerName} 200 ml`);
      set.add(`${lowerName} chhota pack`);
    } else if (pack.includes('2 l') || pack.includes('2l')) {
      set.add(`${lowerName} 2 litre`);
      set.add(`${lowerName} jumbo pack`);
      set.add(`${lowerName} 2l bottle`);
    }
  }

  return Array.from(set).filter(Boolean);
}

function extractVariant(name: string, brand: string): string {
  let v = name;
  if (v.toLowerCase().startsWith(brand.toLowerCase())) {
    v = v.slice(brand.length).trim();
  }
  return v || name;
}

export function normalizeProductToDocument(p: Product): SearchableDocument {
  const aliases = generateAliases(p);
  const variant = extractVariant(p.name, p.brand);
  const topFactors = (p.fbs.breakdown || [])
    .slice(0, 4)
    .map((b) => `${b.factor} (${b.points > 0 ? '+' : ''}${b.points} pts)`);

  const p100 = p.per100g || ({} as ProductPer100g);

  // Compact natural language text for semantic search and embeddings
  const embeddingText = [
    `Product: ${p.name} by ${p.brand}. Category: ${p.category || 'General'} - ${p.subcategory || 'General'}.`,
    `Food Benefit Score (FBS): ${p.fbs.score ?? 'N/A'}/10 (${p.fbs.band || 'Unrated'}).`,
    `Price: ₹${p.priceINR ?? 'N/A'} for ${p.packSizeText || (p.packSizeG ? `${p.packSizeG}g` : 'pack')}.`,
    `Nutrition per 100g: Energy ${p100.energyKcal ?? 'N/A'} kcal, Protein ${p100.proteinG ?? 'N/A'}g, Total Sugar ${p100.totalSugarG ?? 'N/A'}g, Added Sugar ${p100.addedSugarG ?? 'N/A'}g, Fat ${p100.fatG ?? 'N/A'}g, Saturated Fat ${p100.satFatG ?? 'N/A'}g, Trans Fat ${p100.transFatG ?? 'N/A'}g, Dietary Fibre ${p100.fibreG ?? 'N/A'}g, Sodium ${p100.sodiumMg ?? 'N/A'}mg.`,
    p.ingredients && p.ingredients.length > 0
      ? `Ingredients: ${p.ingredients.slice(0, 15).join(', ')}.`
      : '',
    p.ingredientTags && p.ingredientTags.length > 0
      ? `Ingredient Tags: ${p.ingredientTags.join(', ')}.`
      : '',
    p.benefits && p.benefits.length > 0
      ? `Benefits: ${p.benefits.join('; ')}.`
      : '',
    p.concerns && p.concerns.length > 0
      ? `Concerns: ${p.concerns.join('; ')}.`
      : '',
    `Verification: ${p.verification}. Data source: ${p.dataSource}.`,
  ]
    .filter(Boolean)
    .join(' ');

  // Search text for token matching & fuzzy search
  const searchText = [
    p.name,
    p.brand,
    p.category || '',
    p.subcategory || '',
    ...aliases,
    ...(p.ingredients || []),
    ...(p.ingredientTags || []),
    ...(p.benefits || []),
    ...(p.concerns || []),
  ]
    .join(' ')
    .toLowerCase();

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    variant,
    category: p.category || 'Other',
    subcategory: p.subcategory || 'General',
    packSizeG: p.packSizeG,
    packSizeText: p.packSizeText || (p.packSizeG ? `${p.packSizeG}g` : null),
    priceINR: p.priceINR,
    fbsScore: p.fbs.score,
    fbsBand: p.fbs.band,
    fbsTopFactors: topFactors,
    per100g: p100,
    ingredients: p.ingredients || [],
    ingredientTags: p.ingredientTags || [],
    benefits: p.benefits || [],
    concerns: p.concerns || [],
    verification: p.verification,
    lastUpdated: p.lastUpdated,
    aliases,
    searchText,
    embeddingText,
  };
}

let cachedDocs: SearchableDocument[] | null = null;
let cachedDocMap: Map<string, SearchableDocument> | null = null;

export function getCatalogDocuments(): SearchableDocument[] {
  if (cachedDocs) return cachedDocs;

  const rawProducts = getAllProductsWithSamples();
  cachedDocs = rawProducts.map(normalizeProductToDocument);
  cachedDocMap = new Map();
  for (const doc of cachedDocs) {
    cachedDocMap.set(doc.slug.toLowerCase(), doc);
  }
  return cachedDocs;
}

export const getSearchableDocuments = getCatalogDocuments;

export function getCatalogDocumentBySlug(slug: string): SearchableDocument | null {
  if (!cachedDocMap) {
    getCatalogDocuments();
  }
  return cachedDocMap?.get(slug.toLowerCase()) || null;
}
