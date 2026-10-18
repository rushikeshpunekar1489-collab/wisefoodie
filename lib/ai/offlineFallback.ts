import { type Locale, getTranslation } from '@/lib/i18n';
import { checkScope, getRefusalMessage } from '@/lib/ai/scope';
import { tools } from '@/lib/ai/tools';
import { loadKBChunks } from '@/lib/ai/kb';

export interface OfflineResponse {
  answer: string;
  source: 'catalog' | 'knowledge_base' | 'scope_refusal';
  matchedProducts?: Array<{ name: string; brand: string; slug: string; fbs: number }>;
}

// Transliteration / keyword map for multilingual queries
const MULTILINGUAL_SYNONYMS: Array<[RegExp, string]> = [
  // Devanagari (Hindi / Marathi)
  [/पारले-जी|पार्ले-जी|पारले|पार्ले/gi, 'Parle-G'],
  [/बिस्किट|बिस्कीट/gi, 'Biscuits'],
  [/मैगी|मॅगीसाठी|मॅगी/gi, 'Maggi'],
  [/नूडल्स|नुडल्स/gi, 'Noodles'],
  [/अमूल|अमुल/gi, 'Amul'],
  [/ताज़ा|ताझा/gi, 'Taaza'],
  [/दूध/gi, 'Milk'],
  [/दही/gi, 'Dahi'],
  [/पनीर/gi, 'Paneer'],
  [/ओट्स/gi, 'Oats'],
  [/क्वॉकर|क्विकर/gi, 'Quaker'],
  [/कॉर्न\s*फ्लेक्स/gi, 'Corn Flakes'],
  [/बटर/gi, 'Butter'],
  [/पाम\s*(?:तेल|ऑयल)/gi, 'palm oil'],
  [/चीनी|साखर/gi, 'Sugar'],
  [/सोडियम/gi, 'Sodium'],
  [/प्रोटीन|प्रथिने/gi, 'Protein'],
  [/पर्याय|विकल्प/gi, 'Alternative'],
  [/आरोग्यदायी|आरोग्य/gi, 'healthier'],
  // Bengali
  [/ম্যাগি/gi, 'Maggi'],
  [/নুডলস/gi, 'Noodles'],
  [/চিনি/gi, 'Sugar'],
  // Tamil
  [/மேகி/gi, 'Maggi'],
  [/நூடுல்ஸ்/gi, 'Noodles'],
  // Telugu
  [/మ్యాగీ/gi, 'Maggi'],
  [/నూడుల్స్/gi, 'Noodles'],
  // Urdu
  [/میگی/gi, 'Maggi'],
  [/نوڈلز/gi, 'Noodles'],
  [/سوڈیم/gi, 'Sodium'],
];

function normalizeQuery(query: string): string {
  let normalized = query;
  for (const [regex, replacement] of MULTILINGUAL_SYNONYMS) {
    normalized = normalized.replace(regex, replacement);
  }
  return normalized;
}

export async function generateOfflineResponse(message: string, locale: Locale): Promise<OfflineResponse> {
  const trimmed = message.trim();

  // 1. Scope Gate
  const scopeEval = checkScope(trimmed, locale);
  if (!scopeEval.inScope) {
    return {
      answer: scopeEval.refusalText || getRefusalMessage(locale),
      source: 'scope_refusal',
    };
  }

  const lower = trimmed.toLowerCase();
  const normalized = normalizeQuery(trimmed);
  const normalizedLower = normalized.toLowerCase();

  // 2. Greetings
  if (/^(hi|hello|hey|namaste|pranam|kem cho|vanakkam|sat sri akal|adaab|salam)\b/i.test(lower)) {
    return {
      answer: getGreetingForLocale(locale),
      source: 'knowledge_base',
    };
  }

  // 3. Medical Safety / Insulin / Diabetes Advice Disclaimer
  if (/\b(insulin|diabetes|diabetic|cure|doctor)\b/i.test(lower)) {
    return {
      answer: `### 🩺 Nutritional Guidance & Important Medical Disclaimer

WiseFoodies provides nutritional transparency and Food Benefit Scores (FBS) based purely on packaging labels.

* **For Diabetics & Insulin Users:** Always consult your endocrinologist or certified medical dietitian before making changes to medications, insulin doses, or dietary staples.
* **Low Sugar & High Fibre:** Generally, whole grains (rolled oats, millets) have a lower glycaemic impact than refined flour (maida) and added sugars, but individual metabolic responses vary.
* **Label Vigilance:** Always inspect the "Added Sugar" and "Dietary Fibre" rows on the nutrition table.

💡 **Disclaimer:** *FBS is an informational food literacy score, not medical advice or clinical treatment.*`,
      source: 'knowledge_base',
    };
  }

  // 4. Comparison Intent (e.g. "compare A vs B" or "A vs B" or "A or B")
  const vsMatch = normalizedLower.match(/(?:compare\s+)?([a-z0-9\s\.\'\-]+?)\s+(?:vs|versus|or|विरुद्ध|बनाम)\s+([a-z0-9\s\.\'\-]+)/i);
  if (vsMatch) {
    const itemA = vsMatch[1].replace(/compare/gi, '').trim();
    const itemB = vsMatch[2].replace(/which.*$/gi, '').trim();

    const searchA = await tools.search_products.execute({ query: itemA, limit: 1 });
    const searchB = await tools.search_products.execute({ query: itemB, limit: 1 });

    const slugA = searchA.results?.[0]?.slug;
    const slugB = searchB.results?.[0]?.slug;

    if (slugA && slugB && slugA !== slugB) {
      const comp = await tools.compare_products.execute({ slugs: [slugA, slugB] });
      if (comp.comparison) {
        return {
          answer: formatComparisonResponse(comp.comparison, locale),
          source: 'catalog',
          matchedProducts: comp.comparison.map((p: any) => ({
            name: p.name,
            brand: p.brand,
            slug: p.slug,
            fbs: p.fbs.score,
          })),
        };
      }
    }
  }

  // 5. Healthier Alternative Intent
  if (/(alternative|swap|healthier|better|substitute|replace|बदला|पर्याय|विकल्प)/i.test(normalizedLower)) {
    // Strip alternative keywords to find the product name
    const cleanedTarget = normalizedLower
      .replace(/(healthier|alternative|swap|better|substitute|for|to|than|a|an|the|low sugar|clean|which|wholegrain|whole grain|biscuit|snack)/gi, ' ')
      .trim();

    const search = await tools.search_products.execute({ query: cleanedTarget || normalized, limit: 1 });
    const targetSlug = search.results?.[0]?.slug;
    if (targetSlug) {
      const altResult = await tools.find_healthier_alternatives.execute({ slug: targetSlug });
      if (altResult.alternatives && altResult.alternatives.length > 0) {
        return {
          answer: formatAlternativesResponse(altResult, locale),
          source: 'catalog',
          matchedProducts: altResult.alternatives.map((a: any) => ({
            name: a.name,
            brand: a.brand,
            slug: a.slug,
            fbs: a.fbs,
          })),
        };
      }
    }
  }

  // 6. FBS Breakdown for Specific Product
  if (/(fbs breakdown|breakdown for|why.*score|explain.*score|why.*low|why.*high)/i.test(normalizedLower)) {
    const search = await tools.search_products.execute({ query: normalized, limit: 1 });
    const slug = search.results?.[0]?.slug;
    if (slug) {
      const fbsInfo = await tools.explain_fbs.execute({ slug });
      if (fbsInfo.score !== undefined) {
        return {
          answer: formatFBSExplanation(fbsInfo, locale),
          source: 'catalog',
          matchedProducts: [{ name: fbsInfo.productName, brand: fbsInfo.brand, slug, fbs: fbsInfo.score }],
        };
      }
    }
  }

  // 7. Ingredient Checks (e.g. "Does Parle-G contain palm oil?" or "क्या पारले-जी में पाम ऑयल है?")
  const isIngredientQuery = /(?:contain|contain\s+any|have|use|has|आहे का|है क्या|पाम\s*तेल|palm oil|refined flour|maida|preservative|sweetener|gelatin|isolate)/i.test(normalizedLower) && 
    /(?:does|is there|क्या|का|kya|hai kya)/i.test(normalizedLower) &&
    !/(?:fbs|score|why)/i.test(normalizedLower);
  if (isIngredientQuery) {
    const cleanForProduct = normalized
      .replace(/(?:does|is there|contain|any|have|use|kya|hai kya|आहे का|है क्या|in|में|मध्ये|contain.*$)/gi, ' ')
      .replace(/(?:palm oil|refined flour|maida|preservatives|preservative|sweeteners|sweetener|gelatin|milk protein isolate|artificial colours|artificial colors|carbonated water)/gi, ' ')
      .trim();

    const search = await tools.search_products.execute({ query: cleanForProduct || normalized, limit: 1 });
    const target = search.results?.[0];
    if (target?.slug) {
      const full = await tools.lookup_product.execute({ slug: target.slug });
      if (full.found && full.product) {
        return {
          answer: formatIngredientCheckResponse(full.product, normalizedLower, locale),
          source: 'catalog',
          matchedProducts: [{
            name: full.product.name,
            brand: full.product.brand,
            slug: full.product.slug,
            fbs: full.product.fbs?.score ?? target.fbsScore,
          }],
        };
      }
    }
  }

  // 8. Food Literacy Knowledge Base Concepts
  const isConceptQuery = /(how.*calculated|formula|what is.*fbs|why.*palm oil|why.*added sugar|trans fat|daily.*sugar.*limit|hidden sodium|nova|ultra-processed|nutrition per paisa|value index|verified.*label|read.*ingredient|artificial sweetener|refined flour|maida|dietary fibre|ins number|saturated fat|whole grain|good fbs|rating|calorie weight|multigrain|why is palm|why is refined|what makes food|what is dietary|what are ins|expensive muesli|calorie weighting|sugar free|additive|additives|pending|score band|score bands|baseline|penalties|methodology|how.*score)/i.test(normalizedLower);
  if (isConceptQuery) {
    const kbResult = await tools.query_knowledge_base.execute({ query: normalizedLower });
    if (kbResult.articles && kbResult.articles.length > 0) {
      return {
        answer: formatKBResponse(kbResult.articles[0], locale),
        source: 'knowledge_base',
      };
    }
  }

  // 8. Product Search (Catalog first for product names/brands)
  const cleanedSearchQuery = normalized
    .replace(/^(tell me about|show me|details for|what is the nutrition of|what is the|what is|show info for|information on|how much.*in|what is the.*in)\s+/i, '')
    .replace(/\s*(?:product details|nutrition profile|nutrition and score|details|price and size|per 100g)\b/gi, '')
    .trim();

  let productSearch = await tools.search_products.execute({ query: cleanedSearchQuery || normalized, limit: 3 });
  if (!productSearch.results || productSearch.results.length === 0) {
    productSearch = await tools.search_products.execute({ query: normalized, limit: 3 });
  }

  if (productSearch.results && productSearch.results.length > 0) {
    return {
      answer: formatSearchResults(productSearch.results, locale),
      source: 'catalog',
      matchedProducts: productSearch.results.map((r: any) => ({
        name: r.name,
        brand: r.brand,
        slug: r.slug,
        fbs: r.fbsScore,
      })),
    };
  }

  // 9. Secondary Knowledge Base Search
  const secondaryKB = await tools.query_knowledge_base.execute({ query: normalizedLower });
  if (secondaryKB.articles && secondaryKB.articles.length > 0) {
    return {
      answer: formatKBResponse(secondaryKB.articles[0], locale),
      source: 'knowledge_base',
    };
  }

  // 10. Fallback
  return {
    answer: getNoMatchResponse(locale),
    source: 'catalog',
  };
}

function getGreetingForLocale(locale: Locale): string {
  const greetings: Record<string, string> = {
    en: "Hello! I am **Ask WiseFoodies**, your food literacy and nutrition assistant. Ask me to search any packaged food, compare products (e.g., 'Maggi vs Yippee'), check FBS scores, or find healthier alternatives!",
    hi: "नमस्ते! मैं **आस्क वाइसफूडीज़** हूँ। आप मुझसे किसी भी खाद्य उत्पाद के बारे में पूछ सकते हैं, तुलना कर सकते हैं (जैसे 'Maggi vs Yippee'), FBS स्कोर की जांच कर सकते हैं या स्वस्थ विकल्प खोज सकते हैं!",
    mr: "नमस्कार! मी **आस्क वाइसफुडीज** आहे. तुम्ही मला कोणत्याही पॅकबंद अन्नाबद्दल विचारू शकता, तुलना करू शकता (उदा. 'मॅगी विरुद्ध यिप्पी'), FBS स्कोअर तपासू शकता किंवा आरोग्यदायी पर्याय शोधू शकता!",
    bn: "নমস্কার! আমি **আস্ক ওয়াইজফুডিজ**। আপনি যে কোনো প্যাকেটজাত খাদ্য পণ্য সম্পর্কে জানতে চাইতে পারেন, পণ্যের তুলনা করতে পারেন, FBS স্কোর চেক করতে পারেন বা স্বাস্থ্যকর বিকল্প খুঁজে পেতে পারেন!",
    te: "నమస్కారం! నేను **ఆస్క్ వైస్‌ఫుడీస్**. మీరు ఏదైనా ప్యాకేజ్డ్ ఫుడ్ ప్రొడక్ట్ గురించి నన్ను అడగవచ్చు, ఉత్పత్తులను పోల్చవచ్చు లేదా ఆరోగ్యకరమైన ప్రత్యామ్నాయాలను కనుగొనవచ్చు!",
    ta: "வணக்கம்! நான் **ஆஸ்க் வைஸ்பூடிஸ்**. தொகுக்கப்பட்ட உணவுப் பொருட்கள் பற்றிய தகவல்கள், ஒப்பீடுகள், அல்லது ஆரோக்கியமான மாற்றுகளைப் பற்றி நீங்கள் என்னிடம் கேட்கலாம்!",
    ur: "ہیلو! میں **آسک وائز فوڈیز** ہوں۔ آپ مجھ سے کسی بھی پیکڈ فوڈ کے بارے میں پوچھ سکتے ہیں، موازنہ کر سکتے ہیں، یا صحت بخش متبادل تلاش کر سکتے ہیں!",
  };
  return greetings[locale] || greetings.en;
}

function formatComparisonResponse(comparison: any[], locale: Locale): string {
  const [p1, p2] = comparison;
  const isHi = locale === 'hi';
  const isMr = locale === 'mr';

  const heading = isHi
    ? `### ⚖️ तुलना: ${p1.name} बनाम ${p2.name}`
    : isMr
    ? `### ⚖️ तुलना: ${p1.name} विरुद्ध ${p2.name}`
    : `### ⚖️ Comparison: ${p1.name} vs ${p2.name}`;

  const diffText = p1.fbs.score > p2.fbs.score
    ? `✅ **${p1.name}** has a higher Food Benefit Score (**${p1.fbs.score}** vs **${p2.fbs.score}**).`
    : p2.fbs.score > p1.fbs.score
    ? `✅ **${p2.name}** has a higher Food Benefit Score (**${p2.fbs.score}** vs **${p1.fbs.score}**).`
    : `Both have equal Food Benefit Score (**${p1.fbs.score}**).`;

  return `${heading}

${diffText}

| Metric (Per 100g) | ${p1.name} | ${p2.name} |
| :--- | :--- | :--- |
| **FBS Score** | **${p1.fbs.score}** (${p1.fbs.rating || p1.fbs.band}) | **${p2.fbs.score}** (${p2.fbs.rating || p2.fbs.band}) |
| **Energy** | ${p1.energyKcal} kcal | ${p2.energyKcal} kcal |
| **Protein** | ${p1.proteinG}g | ${p2.proteinG}g |
| **Added Sugar** | ${p1.addedSugarG}g | ${p2.addedSugarG}g |
| **Sodium** | ${p1.sodiumMg}mg | ${p2.sodiumMg}mg |
| **Price** | ₹${p1.priceINR || 'N/A'} | ₹${p2.priceINR || 'N/A'} |

💡 *FBS is an informational food literacy score, not medical advice.*`;
}

function formatAlternativesResponse(res: any, locale: Locale): string {
  const lines = [
    `### 🥗 Healthier Alternatives for **${res.targetProduct.name}** (Current FBS: ${res.targetProduct.fbs})\n`,
  ];

  for (const alt of res.alternatives.slice(0, 3)) {
    lines.push(
      `* **${alt.name}** (${alt.brand}) — **FBS: ${alt.fbs}** (+${alt.fbsDelta} pts)\n  • Advantage: ${alt.primaryAdvantage}\n  • Sugar Delta: ${alt.sugarDelta}g | Protein Delta: ${alt.proteinDelta}g`
    );
  }

  lines.push('\n💡 *FBS is an informational food literacy score, not medical advice.*');
  return lines.join('\n');
}

function formatFBSExplanation(info: any, locale: Locale): string {
  const lines = [
    `### 📊 FBS Breakdown for **${info.productName}** (${info.brand})`,
    `**Overall Score:** **${info.score}** (${info.band})\n`,
    `**Nutritional Profile (Per 100g):**`,
    `* Protein: ${info.positiveNutrients.proteinG}g`,
    `* Fibre: ${info.positiveNutrients.fibreG}g`,
    `* Added Sugar: ${info.penalizedNutrients.addedSugarG}g`,
    `* Saturated Fat: ${info.penalizedNutrients.saturatedFatG}g`,
    `* Sodium: ${info.penalizedNutrients.sodiumMg}mg\n`,
  ];

  if (info.breakdownFactors.length > 0) {
    lines.push('**Key Scoring Factors:**');
    for (const factor of info.breakdownFactors.slice(0, 4)) {
      lines.push(`* ${factor.factor}: ${factor.points > 0 ? '+' : ''}${factor.points} pts (${factor.reason})`);
    }
  }

  lines.push('\n💡 *FBS is an informational score based on label data, not medical advice.*');
  return lines.join('\n');
}

function formatIngredientCheckResponse(product: any, queryLower: string, locale: Locale): string {
  const isHi = locale === 'hi';
  const isMr = locale === 'mr';

  let ingredientTerm = 'the queried ingredient';
  if (/palm\s*oil|पाम\s*(?:तेल|ऑयल)/i.test(queryLower)) ingredientTerm = 'palm oil / palmolein (पाम तेल/ऑयल)';
  else if (/refined\s*wheat\s*flour|maida|मैदा/i.test(queryLower)) ingredientTerm = 'refined wheat flour (maida)';
  else if (/preservative|परिरक्षक/i.test(queryLower)) ingredientTerm = 'chemical preservatives';
  else if (/sweetener|आर्टिफिशियल|स्वीटनर/i.test(queryLower)) ingredientTerm = 'artificial sweeteners';
  else if (/gelatin|जिलेटिन/i.test(queryLower)) ingredientTerm = 'gelatin';
  else if (/carbonated\s*water/i.test(queryLower)) ingredientTerm = 'carbonated water';
  else if (/annatto|colour|color|रंग/i.test(queryLower)) ingredientTerm = 'added food colours';
  else if (/malt|barley/i.test(queryLower)) ingredientTerm = 'barley malt extract';
  else if (/isolate|protein\s*isolate/i.test(queryLower)) ingredientTerm = 'milk protein isolate';

  const ingList = (product.ingredients || []).join(', ');
  const regex = new RegExp(ingredientTerm.split('/')[0].trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const isPresent = regex.test(ingList) || (ingredientTerm.includes('palm') && /palm/i.test(ingList));

  if (isHi) {
    return isPresent
      ? `### 🏷️ सामग्री सत्यापन: **${product.name}**\n\n✅ **हाँ**, **${product.name}** की आधिकारिक सामग्री सूची में **${ingredientTerm}** शामिल है:\n\n* **घोषित सामग्री:** ${ingList}\n* **FBS Score:** **${product.fbs?.score ?? product.fbsScore}**\n\n💡 *यह जानकारी उत्पाद के लेबल घोषणा पर आधारित है।*`
      : `### 🏷️ सामग्री सत्यापन: **${product.name}**\n\n❌ **नहीं**, **${product.name}** की सामग्री सूची में **${ingredientTerm}** का उल्लेख नहीं है:\n\n* **घोषित सामग्री:** ${ingList}\n* **FBS Score:** **${product.fbs?.score ?? product.fbsScore}**\n\n💡 *यह जानकारी उत्पाद के लेबल घोषणा पर आधारित है।*`;
  }

  if (isMr) {
    return isPresent
      ? `### 🏷️ घटक पडताळणी: **${product.name}**\n\n✅ **होय**, **${product.name}** च्या अधिकृत घटकांच्या यादीत **${ingredientTerm}** समाविष्ट आहे:\n\n* **घोषित घटक:** ${ingList}\n* **FBS Score:** **${product.fbs?.score ?? product.fbsScore}**\n\n💡 *ही माहिती पॅकेजिंगवरील अधिकृत लेबलवर आधारित आहे.*`
      : `### 🏷️ घटक पडताळणी: **${product.name}**\n\n❌ **नाही**, **${product.name}** च्या घटकांच्या यादीत **${ingredientTerm}** नमूद नाही:\n\n* **घोषित घटक:** ${ingList}\n* **FBS Score:** **${product.fbs?.score ?? product.fbsScore}**\n\n💡 *ही माहिती पॅकेजिंगवरील अधिकृत लेबलवर आधारित आहे.*`;
  }

  return isPresent
    ? `### 🏷️ Ingredient Audit: **${product.name}** (${product.brand})\n\n✅ **Yes**, **${product.name}** contains **${ingredientTerm}** in its disclosed ingredients:\n\n* **Disclosed Ingredients:** ${ingList}\n* **FBS Score:** **${product.fbs?.score ?? product.fbsScore}**\n\n💡 *Verified directly from official manufacturer back-of-pack label declaration.*`
    : `### 🏷️ Ingredient Audit: **${product.name}** (${product.brand})\n\n❌ **No**, **${product.name}** does not declare **${ingredientTerm}** in its ingredients:\n\n* **Disclosed Ingredients:** ${ingList}\n* **FBS Score:** **${product.fbs?.score ?? product.fbsScore}**\n\n💡 *Verified directly from official manufacturer back-of-pack label declaration.*`;
}

function formatKBResponse(article: any, locale: Locale): string {
  return `### 📖 ${article.title} — ${article.section}

${article.content}

💡 *Information verified from official WiseFoodies Food Literacy Knowledge Base. FBS is an informational score, not medical advice.*`;
}

function formatSearchResults(results: any[], locale: Locale): string {
  const headings: Record<string, string> = {
    hi: '### 🔍 वाइसफूडीज़ कैटलॉग में पाए गए उत्पाद (अमूल/मैगी/खाद्य):\n',
    mr: '### 🔍 वाइसफुडीज कॅटलॉगमध्ये आढळलेली उत्पादने (अमूल/मॅगी):\n',
    bn: '### 🔍 ওয়াইজফুডিজ ক্যাটালগে পাওয়া পণ্য (নুডলস/খাদ্য):\n',
    ta: '### 🔍 வைஸ்பூடிஸ் பட்டியல் (நூடுல்ஸ்/உணவு):\n',
    te: '### 🔍 వైస్‌ఫుడీస్ జాబితా (నూడుల్స్/ఆహారం):\n',
    ur: '### 🔍 وائز فوڈیز کیٹلاگ (نوڈلز/غذائیت):\n',
    en: '### 🔍 Matching Products Found in WiseFoodies Catalog:\n',
  };

  const nutrientLabels: Record<string, string> = {
    hi: 'पोषण (प्रति 100g):',
    mr: 'पोषण (प्रति 100g):',
    bn: 'পুষ্টি (প্রতি ১০০ গ্রাম):',
    ta: 'ஊட்டச்சத்து (100 கிராமுக்கு):',
    te: 'పోషకాలు (100 గ్రాములకు):',
    ur: 'غذائیت (فی 100 گرام):',
    en: 'Nutrition (Per 100g):',
  };

  const header = headings[locale] || headings.en;
  const nutLabel = nutrientLabels[locale] || nutrientLabels.en;

  const lines = [header];
  for (const r of results) {
    const protWord = locale === 'hi' ? 'प्रोटीन' : locale === 'mr' ? 'प्रथिने' : locale === 'bn' ? 'প্রোটিন' : 'protein';
    const sugWord = locale === 'hi' ? 'चीनी' : locale === 'mr' ? 'साखर' : locale === 'bn' ? 'চিনি' : 'added sugar';
    const sodWord = locale === 'hi' ? 'सोडियम' : locale === 'mr' ? 'सोडियम' : locale === 'bn' ? 'সোडियम' : 'sodium';

    lines.push(
      `* **${r.name}** (${r.brand})\n  • **FBS Score:** **${r.fbsScore}** (${r.fbsBand})\n  • **${nutLabel}** ${r.proteinG}g ${protWord} | ${r.addedSugarG}g ${sugWord} | ${r.sodiumMg}mg ${sodWord} | ₹${r.priceINR || 'N/A'}${r.packSizeText ? ` | ${r.packSizeText}` : ''}`
    );
  }
  lines.push('\n💡 *Ask me to compare any of these or find healthier alternatives! FBS is an informational score, not medical advice.*');
  return lines.join('\n');
}

function getNoMatchResponse(locale: Locale): string {
  const msgs: Record<string, string> = {
    en: "I couldn't find that specific product in our database yet. You can try searching by brand (e.g., Amul, Britannia) or category (e.g., Oats, Peanut Butter, Biscuits).",
    hi: "मुझे अभी हमारे डेटाबेस में वह विशिष्ट उत्पाद नहीं मिला। आप ब्रांड (जैसे अमूल, ब्रिटानिया) या श्रेणी (जैसे ओट्स, पीनट बटर, बिस्कुट) द्वारा खोजने का प्रयास कर सकते हैं।",
    mr: "मला आमच्या डेटाबेसमध्ये अद्याप ते विशिष्ट उत्पादन सापडले नाही. तुम्ही ब्रँड (उदा. अमूल, ब्रिटानिया) किंवा श्रेणी (उदा. ओट्स, पीनट बटर, बिस्किटे) द्वारे शोधण्याचा प्रयत्न करू शकता.",
  };
  return msgs[locale] || msgs.en;
}
