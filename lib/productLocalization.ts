import type { Product } from '../types/product';
import { type Locale, getTranslation, translateBenefit, translateConcern, translateFBSBand } from './i18n';
import glossaryData from '../data/glossary/nutrition-glossary.json';

export interface LocalizedProductView {
  // Original preserved factual identity
  id: string;
  name: string;
  brand: string;
  slug: string;
  barcode: string | null;
  priceINR: number | null;
  packSizeG: number | null;
  packSizeText: string | null;
  servingSizeG: number | null;
  ingredients: string[];
  per100g: Product['per100g'];
  fbs: Product['fbs'];

  // Localized presentation fields
  localizedCategory: string;
  localizedVerificationStatus: string;
  localizedFBSBand: string;
  localizedBenefits: string[];
  localizedConcerns: string[];
  localizedMissingDataNotice?: string;
}

const CATEGORY_LOCALIZATIONS: Record<string, Partial<Record<Locale, string>>> = {
  'dairy & frozen': {
    en: 'Dairy & Frozen',
    hi: 'डेयरी और फ्रोजन',
    mr: 'डेअरी आणि फ्रोजन',
    bn: 'দুগ্ধজাত ও হিমায়িত',
    te: 'డైరీ మరియు ఘనీభవించినవి',
    ta: 'பால் மற்றும் உறைந்தவை',
    gu: 'ડેરી અને ફ્રોઝન',
    kn: 'ಡೈರಿ ಮತ್ತು ಹೆಪ್ಪುಗಟ್ಟಿದವು',
    ml: 'ഡയറിയും ഫ്രോസൺ ഭക്ഷണവും',
    pa: 'ਡੇਅਰੀ ਅਤੇ ਫ੍ਰੋਜ਼ਨ',
    or: 'ଦୁଗ୍ଧଜାତ ଓ ଫ୍ରୋଜେନ୍',
    as: 'দুগ্ধজাত আৰু হিমায়িত',
    mai: 'डेयरी आरू फ्रोजन',
    sa: 'दुग्धजातानि शीतीकृतानि च',
    ur: 'ڈیری اور منجمد مصنوعات',
    ks: 'ڈیری تہٕ منجمد مصنوعات',
    kok: 'डेअरी आनी फ्रोजन',
    ne: 'डेरी तथा फ्रोजन',
    sd: 'ڊيري ۽ فريز ڪيل شيون',
    doi: 'डेयरी ते फ्रोजन',
    brx: 'दाइरी आरो फ्रोजन',
    sat: 'ᱰᱮᱭᱨᱤ ᱟᱨ ᱯᱷᱨᱳᱡᱮᱱ',
    mni: 'দুগ্ধ অমসুং ফ্রোজেন পোত্থোক',
  },
  'snacks & savouries': {
    en: 'Snacks & Savouries',
    hi: 'नमकीन और स्नैक्स',
    mr: 'स्नॅक्स आणि फरसाण',
    bn: 'স্ন্যাক্স ও নোনতা খাবার',
    te: 'స్నాక్స్ మరియు సేవు',
    ta: 'தின்பண்டங்கள் மற்றும் கார வகைகள்',
    gu: 'નાસ્તો અને ફરસાણ',
    kn: 'ತಿಂಡಿಗಳು ಮತ್ತು ಖಾರಗಳು',
    ml: 'ലഘുഭക്ഷണങ്ങൾ',
    pa: 'ਸਨੈਕਸ ਅਤੇ ਨਮਕੀਨ',
    or: 'ସ୍ନାକ୍ସ ଏବଂ ନମକିନ',
    as: 'জলপান আৰু নিমকীয়া খাদ্য',
    ur: 'نمکین اور اسنیکس',
  },
  'chocolates & confectionery': {
    en: 'Chocolates & Confectionery',
    hi: 'चॉकलेट और कन्फेक्शनरी',
    mr: 'चॉकलेट्स आणि कन्फेक्शनरी',
    bn: 'চকলেট ও মিষ্টি সামগ্রী',
    te: 'చాక్లెట్లు మరియు మిఠాయిలు',
    ta: 'சாக்லேட்டுகள் மற்றும் மிட்டாய்கள்',
    gu: 'ચોકલેટ અને કન્ફેક્શનરી',
    kn: 'ಚಾಕೊಲೇಟ್ ಮತ್ತು ಮಿಠಾಯಿಗಳು',
    ml: 'ചോക്ലേറ്റുകളും മിഠായികളും',
    pa: 'ਚਾਕਲੇਟ ਅਤੇ ਮਿਠਾਈਆਂ',
    or: 'ଚକୋଲେଟ୍ ଏବଂ କନଫେକସନାରୀ',
    ur: 'چاکلیٹ اور کنفیکشنری',
  },
  'beverages': {
    en: 'Beverages',
    hi: 'पेय पदार्थ',
    mr: 'पेये (बेव्हरेजेस)',
    bn: 'পানীয়',
    te: 'పానీయాలు',
    ta: 'பானங்கள்',
    gu: 'પીણાં',
    kn: 'ಪಾನೀಯಗಳು',
    ml: 'പാനീയങ്ങൾ',
    pa: 'ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ',
    or: 'ପାନୀୟ',
    ur: 'مشروبات',
  },
  'breakfast cereals': {
    en: 'Breakfast Cereals',
    hi: 'नाश्ता अनाज / सेरेल्स',
    mr: 'न्याहारीची तृणधान्ये',
    bn: 'প্রাতঃরাশের দানাশস্য',
    te: 'అల్పాహార తృణధాన్యాలు',
    ta: 'காலை உணவு தானியங்கள்',
    gu: 'સવારનો નાસ્તો / અનાજ',
    kn: 'ಉಪಹಾರ ಧಾನ್ಯಗಳು',
    ml: 'പ്രഭാതഭക്ഷണ ധാന്യങ്ങൾ',
    pa: 'ਨਾਸ਼ਤੇ ਦੇ ਅਨਾਜ',
    or: 'ଜଳଖିଆ ଶସ୍ୟ',
    ur: 'ناشتے کے اناج',
  },
  'noodles & sauces': {
    en: 'Noodles & Sauces',
    hi: 'नूडल्स और सॉस',
    mr: 'नूडल्स आणि सॉस',
    bn: 'নুডুলস ও সস',
    te: 'నూడుల్స్ మరియు సాస్',
    ta: 'நூடுல்ஸ் மற்றும் சாஸ்',
    gu: 'નૂડલ્સ અને સોસ',
    kn: 'ನೂಡಲ್ಸ್ ಮತ್ತು ಸಾಸ್‌ಗಳು',
    ml: 'നൂഡിൽസും സോസുകളും',
    pa: 'ਨੂਡਲਜ਼ ਅਤੇ ਸਾਸ',
    or: 'ନୁଡଲ୍ସ ଏବଂ ସସ୍',
    ur: 'نوڈلز اور چٹنی',
  },
  'ready to cook': {
    en: 'Ready to Cook',
    hi: 'पकाने के लिए तैयार',
    mr: 'तयार जेवण (रेडी टू कुक)',
    bn: 'রান্নার জন্য প্রস্তুত',
    te: 'వండడానికి సిద్ధంగా ఉన్నవి',
    ta: 'சமைக்கத் தயார் உணவு',
    gu: 'રાંધવા માટે તૈયાર',
    kn: 'ಅಡುಗೆಗೆ ಸಿದ್ಧವಿರುವ ಆಹಾರ',
    ml: 'പാകം ചെയ്യാൻ തയ്യാറായവ',
    pa: 'ਪਕਾਉਣ ਲਈ ਤਿਆਰ',
    or: 'ରନ୍ଧନ ପାଇଁ ପ୍ରସ୍ତୁତ',
    ur: 'پکانے کے لیے تیار',
  },
  'sauces & spreads': {
    en: 'Sauces & Spreads',
    hi: 'सॉस और स्प्रेड्स',
    mr: 'सॉस आणि स्प्रेड्स',
    bn: 'সস ও স্প্রেড',
    te: 'సాస్‌లు మరియు స్ప్రెడ్‌లు',
    ta: 'சாஸ் மற்றும் ஸ்ப்ரெட்கள்',
    gu: 'સોસ અને સ્પ્રેડ',
    kn: 'ಸಾಸ್‌ಗಳು ಮತ್ತು ಸ್ಪ್ರೆಡ್‌ಗಳು',
    ml: 'സോസുകളും സ്പ്രെഡുകളും',
    pa: 'ਸਾਸ ਅਤੇ ਸਪਰੈੱਡ',
    or: 'ସସ୍ ଏବଂ ସ୍ପ୍ରେଡ୍',
    ur: 'ساس اور اسپریڈ',
  },
  'biscuits & cookies': {
    en: 'Biscuits & Cookies',
    hi: 'बिस्कुट और कुकीज़',
    mr: 'बिस्किटे आणि कुकीज',
    bn: 'বিস্কুট ও কুকিজ',
    te: 'బిస్కెట్లు మరియు కుకీలు',
    ta: 'பிஸ்கட் மற்றும் குக்கீஸ்',
    gu: 'બિસ્કિટ અને કૂકીઝ',
    kn: 'ಬಿಸ್ಕತ್ತುಗಳು ಮತ್ತು ಕುಕೀಗಳು',
    ml: 'ബിസ്ക്കറ്റുകളും കുക്കികളും',
    pa: 'ਬਿਸਕੁਟ ਅਤੇ ਕੂਕੀਜ਼',
    or: 'ବିସ୍କୁଟ୍ ଏବଂ କୁକିଜ୍',
    ur: 'بسکٹ اور کوکیز',
  },
  'atta, rice & dal': {
    en: 'Atta, Rice & Dal',
    hi: 'आटा, चावल और दाल',
    mr: 'आटा, तांदूळ आणि डाळ',
    bn: 'আটা, চাল ও ডাল',
    te: 'పిండి, బియ్యం మరియు పప్పు',
    ta: 'மாவு, அரிசி மற்றும் பருப்பு',
    gu: 'લોટ, ચોખા અને દાળ',
    kn: 'ಹಿಟ್ಟು, ಅಕ್ಕಿ ಮತ್ತು ಬೇಳೆ',
    ml: 'പൊടി, അരി, പരിപ്പ്',
    pa: 'ਆਟਾ, ਚੌਲ ਅਤੇ ਦਾਲ',
    or: 'ଅଟା, ଚାଉଳ ଏବଂ ଡାଲି',
    ur: 'آٹا، چاول اور دال',
  },
};

/**
 * Localize category name for display.
 */
export function localizeCategory(category: string | undefined | null, locale: Locale): string {
  if (!category) return getTranslation(locale, 'categories.all');
  const lower = category.trim().toLowerCase();
  
  // 1. Direct multilingual dictionary match
  const directDict = CATEGORY_LOCALIZATIONS[lower];
  if (directDict) {
    if (directDict[locale]) return directDict[locale]!;
    if (directDict.en) return directDict.en!;
  }

  // 2. Fallback to messages lookup
  const key = `categories.${lower.replace(/[^a-z0-9]/g, '')}`;
  const translated = getTranslation(locale, key);
  if (translated && translated !== key) return translated;

  return category;
}

/**
 * Localize verification status.
 */
export function localizeVerificationStatus(
  status: Product['verification'] | boolean | undefined,
  locale: Locale
): string {
  const isVerified = typeof status === 'boolean' ? status : status === 'complete';
  return isVerified
    ? getTranslation(locale, 'common.verified')
    : getTranslation(locale, 'common.incomplete');
}

/**
 * Localize nutrient display term from the multilingual food glossary.
 */
export function localizeNutrientTerm(termKey: string, locale: Locale): string {
  const term = (glossaryData.terms as Record<string, any>)[termKey];
  if (term && term.translations && term.translations[locale]) {
    return term.translations[locale];
  }
  return term?.translations?.en || termKey;
}

/**
 * Create a backward-compatible localized view of a Product record.
 * Factual data (numbers, ingredients, prices, barcode) are never altered.
 */
export function getLocalizedProduct(product: Product, locale: Locale): LocalizedProductView {
  const localizedBenefits = (product.benefits || []).map((b) => translateBenefit(b, locale));
  const localizedConcerns = (product.concerns || []).map((c) => translateConcern(c, locale));
  const localizedCategory = localizeCategory(product.category, locale);
  const localizedVerificationStatus = localizeVerificationStatus(product.verification, locale);
  const localizedFBSBand = product.fbs?.band
    ? translateFBSBand(product.fbs.band, locale)
    : '';

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    slug: product.slug,
    barcode: product.barcode,
    priceINR: product.priceINR,
    packSizeG: product.packSizeG,
    packSizeText: product.packSizeText,
    servingSizeG: product.servingSizeG,
    ingredients: product.ingredients,
    per100g: product.per100g,
    fbs: product.fbs,
    localizedCategory,
    localizedVerificationStatus,
    localizedFBSBand,
    localizedBenefits,
    localizedConcerns,
    localizedMissingDataNotice: product.verification === 'complete' ? undefined : getTranslation(locale, 'common.incomplete'),
  };
}
