import { type Locale } from '@/lib/i18n';

export const EXACT_REFUSALS: Record<Locale, string> = {
  en: "Sorry, I can't assist you with that.",
  hi: "माफ़ कीजिए, मैं इसमें मदद नहीं कर सकता।",
  mr: "माफ करा, मी यामध्ये मदत करू शकत नाही.",
  bn: "দুঃখিত, আমি এতে সাহায্য করতে পারব না।",
  te: "క్షమించండి, నేను ఇందులో సహాయం చేయలేను.",
  ta: "மன்னிக்கவும், இதில் என்னால் உதவ முடியாது.",
  gu: "માફ કરશો, હું આમાં મદદ કરી શકતો નથી.",
  kn: "ಕ್ಷಮಿಸಿ, ನಾನು ಇದರಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.",
  ml: "ക്ഷമിക്കണം, ഇതിൽ എനിക്ക് സഹായിക്കാനാകില്ല.",
  pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਸ ਵਿੱਚ ਮਦਦ ਨਹੀਂ ਕਰ ਸਕਦਾ।",
  or: "କ୍ଷମା କରିବେ, ମୁଁ ଏଥିରେ ସାହାଯ୍ୟ କରିପାରିବି ନାହିଁ।",
  as: "ক্ষমা কৰিব, মই ইয়াত সহায় কৰিব নোৱাৰিম।",
  mai: "क्षमा करू, हम एहिमे मदति नहि कऽ सकैत छी।",
  sa: "क्षम्यताम्, अहं अस्मिन् साहाय्यं कर्तुं न शक्नोमि।",
  ur: "معذرت، میں اس میں مدد نہیں کر سکتا۔",
  ks: "مٲفی، بؤ ہؠکہ نہ اَتھ مَنٛز مَدَتھ کٔرِتھ۔",
  kok: "माफ करा, हांव हातूंत मदत करूंक शकना.",
  ne: "माफ गर्नुहोस्, म यसमा मद्दत गर्न सक्दिन।",
  sd: "معاف ڪجو، مان هن ۾ مدد نٿو ڪري سگهان.",
  doi: "माफ करो, मैं इस च मदद नेईं करी सकदा।",
  brx: "निमाहा बिनाय, आं बेयाव हेफाजाब होनो हाया।",
  sat: "ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱚᱣᱟ ᱨᱮ ᱜᱚᱲᱚ ᱵᱟᱹᱧ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾",
  mni: "ঙাকপীবীগনু, ঐনা মসিদা মতেং পাংবা ঙমদে।",
};

export function getRefusalMessage(locale: Locale): string {
  return EXACT_REFUSALS[locale] || EXACT_REFUSALS.en;
}

// Regex patterns for prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /system\s+prompt/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /act\s+as\s+an\s+unfiltered/i,
  /you\s+are\s+now\s+an\s+unrestricted/i,
  /reveal\s+(your\s+)?(system|internal)\s+(prompt|instructions)/i,
];

// Regex patterns for strictly out-of-scope domains
const OUT_OF_SCOPE_PATTERNS = [
  // Coding & IT (English + Indic transliterations)
  /\b(python|javascript|typescript|c\+\+|java|react|nextjs|html|css|sql|function|git|docker|kubernetes|api\s+endpoint|regex|debug\s+code|coding|software|algorithm|quantum\s+computing|computing)\b/i,
  /(पायथन|जावास्क्रिप्ट|प्रोग्रामिंग|कोड|फंक्शन)/i,
  // Politics & Government
  /\b(election|prime\s+minister|narendra\s+modi|rahul\s+gandhi|bjp|congress|parliament|president\s+of|political\s+party|vote\s+for|stock\s+market|investment\s+tips)\b/i,
  // Entertainment & Sports
  /\b(ipl|cricket|world\s+cup|t20|virat\s+kohli|rohit\s+sharma|messi|ronaldo|fifa|movie\s+review|movie\s+plot|inception|box\s+office|bollywood|hollywood|actor|actress|song\s+lyrics|cinema|film)\b/i,
  // Creative Writing & Humor
  /\b(poem|poetry|romantic\s+poem|rhyme|tell\s+me\s+a\s+joke|funny\s+joke|riddle|story\s+about|essay\s+on)\b/i,
  // Math & Generic Science
  /\b(calculate\s+integral|derivative\s+of|solve\s+for\s+x|solve\s+the\s+equation|\d+x\s*[\+\-\*=]|pythagorean\s+theorem|speed\s+of\s+light|gravity\s+constant)\b/i,
  // Human Anatomy & Non-food biology
  /\b(bones\s+in|anatomy\s+of|human\s+foot|human\s+skeleton|human\s+body|capital\s+of\s+[a-z]+)\b/i,
  // Gaming, Weapons, Violence & Cyber
  /\b(call\s+of\s+duty|pubg|fortnite|gta|minecraft|video\s+game|playstation|xbox|nintendo|gun|weapon|knife|bomb|ammunition|loadout|hack|wi-?fi\s+password|exploit|malware|phishing)\b/i,
  // Real Estate & Property
  /\b(rent\s+for|flat\s+in|apartment\s+in|real\s+estate|\d+\s*bhk)\b/i,
  // Philosophy & Religion debate
  /\b(meaning\s+of\s+human\s+existence|meaning\s+of\s+life|philosophical\s+meaning)\b/i,
];

// In-scope food keywords that identify food, nutrition, brands, and WiseFoodies topics
const FOOD_KEYWORDS = [
  'food', 'snack', 'drink', 'beverage', 'product', 'biscuit', 'chips', 'oats',
  'noodle', 'noodles', 'cereal', 'chocolate', 'dairy', 'milk', 'curd', 'yogurt',
  'dahi', 'lassi', 'paneer', 'cheese', 'butter', 'ghee', 'oil', 'sugar', 'protein', 'fibre', 'fiber',
  'sodium', 'salt', 'fat', 'calorie', 'kcal', 'fbs', 'score', 'nutrition', 'ingredient',
  'ingredients', 'maida', 'wheat', 'atta', 'palm', 'sweetener', 'preservative', 'additive',
  'carbonated', 'caffeine', 'maltodextrin', 'emulsifier', 'cake', 'cookies', 'cookie', 'bread',
  'pasta', 'ketchup', 'sauce', 'bhujia', 'sev', 'namkeen', 'peanut', 'honey', 'coffee', 'tea',
  'compare', 'alternative', 'healthier', 'healthy', 'paisa', 'value', 'fssai',
  'maggi', 'amul', 'britannia', 'parle', 'nestle', 'haldiram', 'lays', 'kurkure',
  'kellogg', 'saffola', 'marico', 'dabur', 'itc', 'horlicks', 'bournvita', 'complan',
  'kissan', 'tata', 'nutella', 'quaker', 'yippee', 'too yumm', 'pintola', 'myfitness',
  'epigamia', 'mother dairy', 'knorr', 'ching', 'tropicana', 'real', 'act ii', '4700bc',
  'campa', 'cola', 'pepsi', 'coke', 'thums up', 'limca', 'fanta', 'mirinda', 'gobbles', 'taaza',
  'diet', 'diabetes', 'diabetic', 'allergy', 'gluten', 'vegan', 'vegetarian', 'non-veg',
  'insulin', 'cart', 'basket', 'diary', 'scan', 'label', 'per 100g', 'serving',
  // Multilingual Food Words
  'खाद्य', 'भोजन', 'नाश्ता', 'दूध', 'दही', 'पनीर', 'घी', 'तेल', 'चीनी', 'शक्कर', 'प्रोटीन', 'फाइबर', 'सोडियम', 'बिस्कुट', 'बिस्कीट', 'मैगी', 'मॅगी', 'नूडल्स', 'नुडल्स', 'अमूल', 'अमुल', 'पाम', 'पारले', 'पार्ले', 'ओट्स', 'कॉर्न', 'फ्लेक्स', 'स्वास्थ्य', 'आरोग्य', 'आरोग्यदायी', 'भुजिया', 'सेव', 'नमकीन',
  'अन्न', 'साखर', 'प्रथिने', 'तंतू', 'पर्याय',
  'খাদ্য', 'দুধ', 'চিনি', 'প্রোটিন', 'নুডলস', 'ম্যাগি',
  'ఆహారం', 'పాలు', 'చక్కెర', 'ప్రొటీన్', 'నూడుల్స్', 'మ్యాగీ',
  'உணவு', 'பால்', 'சர்க்கரை', 'புரதம்', 'நூடுல்ஸ்', 'மேகி',
  'خوراک', 'دودھ', 'چینی', 'پروٹین', 'نوڈلز', 'میگی'
];

export interface ScopeEvaluation {
  inScope: boolean;
  reason?: string;
  refusalText?: string;
}

export function checkScope(query: string, locale: Locale = 'en'): ScopeEvaluation {
  const trimmed = query.trim();
  if (!trimmed) {
    return { inScope: false, reason: 'Empty query', refusalText: getRefusalMessage(locale) };
  }

  const lower = trimmed.toLowerCase();

  // 1. Jailbreak / Injection Detection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(lower)) {
      return {
        inScope: false,
        reason: 'Injection / Jailbreak attempt',
        refusalText: getRefusalMessage(locale),
      };
    }
  }

  // 2. Strict Medical Prescription / Disease Cure check (always refused even if food is mentioned)
  if (/\b(prescribe|cure\s+cancer|cure\s+covid|antibiotic\s+dose)\b/i.test(lower)) {
    return {
      inScope: false,
      reason: 'Medical prescription or cure request',
      refusalText: getRefusalMessage(locale),
    };
  }

  // 3. Out-of-Scope Patterns Check
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(lower)) {
      return {
        inScope: false,
        reason: 'Out-of-scope domain',
        refusalText: getRefusalMessage(locale),
      };
    }
  }

  // 4. Greetings and general pleasantries
  if (/^(hi|hello|hey|namaste|pranam|kem cho|vanakkam|sat sri akal|kashish|salam|assalam|adaab)\b/i.test(lower)) {
    return { inScope: true };
  }

  // 5. Clear food keywords present -> in scope
  const hasFoodKeyword = FOOD_KEYWORDS.some((kw) => {
    if (/^[a-z0-9\s-]+$/i.test(kw)) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(lower);
    }
    return lower.includes(kw);
  });
  if (hasFoodKeyword) {
    return { inScope: true };
  }

  // 6. Common food questions (e.g., "tell me about...", "what is...", "how does...") if not matched by out-of-scope
  if (/\b(ingredient|nutrition|calories|protein|sugar|fbs|score|brand|pack|eat|taste|snack)\b/i.test(lower)) {
    return { inScope: true };
  }

  // Default to refusing non-food queries
  return {
    inScope: false,
    reason: 'Non-food query',
    refusalText: getRefusalMessage(locale),
  };
}
