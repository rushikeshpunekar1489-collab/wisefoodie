import enMessages from '../messages/en.json';
import hiMessages from '../messages/hi.json';
import mrMessages from '../messages/mr.json';
import bnMessages from '../messages/bn.json';
import teMessages from '../messages/te.json';
import taMessages from '../messages/ta.json';
import guMessages from '../messages/gu.json';
import knMessages from '../messages/kn.json';
import mlMessages from '../messages/ml.json';
import paMessages from '../messages/pa.json';
import orMessages from '../messages/or.json';
import asMessages from '../messages/as.json';
import maiMessages from '../messages/mai.json';
import saMessages from '../messages/sa.json';
import urMessages from '../messages/ur.json';
import ksMessages from '../messages/ks.json';
import kokMessages from '../messages/kok.json';
import neMessages from '../messages/ne.json';
import sdMessages from '../messages/sd.json';
import doiMessages from '../messages/doi.json';
import brxMessages from '../messages/brx.json';
import satMessages from '../messages/sat.json';
import mniMessages from '../messages/mni.json';

export type Locale =
  | 'en' | 'hi' | 'mr' | 'bn' | 'te' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or'
  | 'as' | 'mai' | 'sa' | 'ur' | 'ks' | 'kok' | 'ne' | 'sd' | 'doi' | 'brx' | 'sat' | 'mni';

export interface LocaleMeta {
  code: Locale;
  label: string;
  native: string;
  script: string;
  dir: 'ltr' | 'rtl';
  region?: string;
}

export const RTL_LOCALES: Locale[] = ['ur', 'ks', 'sd'];

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en', label: 'English', native: 'English', script: 'Latin', dir: 'ltr', region: 'India / Global' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', script: 'Devanagari', dir: 'ltr', region: 'Northern & Central India' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', script: 'Devanagari', dir: 'ltr', region: 'Maharashtra' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', script: 'Bengali', dir: 'ltr', region: 'West Bengal, Tripura, Assam' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', script: 'Telugu', dir: 'ltr', region: 'Andhra Pradesh, Telangana' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', script: 'Tamil', dir: 'ltr', region: 'Tamil Nadu, Puducherry' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', script: 'Gujarati', dir: 'ltr', region: 'Gujarat' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', script: 'Kannada', dir: 'ltr', region: 'Karnataka' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', script: 'Malayalam', dir: 'ltr', region: 'Kerala, Lakshadweep' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', dir: 'ltr', region: 'Punjab, Delhi, Haryana' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', script: 'Odia', dir: 'ltr', region: 'Odisha' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া', script: 'Bengali-Assamese', dir: 'ltr', region: 'Assam' },
  { code: 'mai', label: 'Maithili', native: 'मैथिली', script: 'Devanagari', dir: 'ltr', region: 'Bihar, Jharkhand' },
  { code: 'sa', label: 'Sanskrit', native: 'संस्कृतम्', script: 'Devanagari', dir: 'ltr', region: 'Pan-Indian Classical' },
  { code: 'ur', label: 'Urdu', native: 'اردو', script: 'Perso-Arabic', dir: 'rtl', region: 'Pan-Indian' },
  { code: 'ks', label: 'Kashmiri', native: 'کٲشُر', script: 'Perso-Arabic', dir: 'rtl', region: 'Jammu & Kashmir' },
  { code: 'kok', label: 'Konkani', native: 'कोंकणी', script: 'Devanagari', dir: 'ltr', region: 'Goa, Karnataka, Maharashtra' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली', script: 'Devanagari', dir: 'ltr', region: 'Sikkim, West Bengal' },
  { code: 'sd', label: 'Sindhi', native: 'سنڌي', script: 'Perso-Arabic', dir: 'rtl', region: 'Gujarat, Maharashtra, Rajasthan' },
  { code: 'doi', label: 'Dogri', native: 'डोगरी', script: 'Devanagari', dir: 'ltr', region: 'Jammu & Kashmir, Himachal' },
  { code: 'brx', label: 'Bodo', native: 'बड़ो', script: 'Devanagari', dir: 'ltr', region: 'Assam, Bodoland' },
  { code: 'sat', label: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', dir: 'ltr', region: 'Jharkhand, West Bengal, Odisha' },
  { code: 'mni', label: 'Manipuri', native: 'মৈতৈলোন্', script: 'Bengali-Meitei', dir: 'ltr', region: 'Manipur' },
];

export const DEFAULT_LOCALE: Locale = 'en';

export const VALID_LOCALES = new Set<string>(LOCALES.map(l => l.code));

export function isValidLocale(code: string | null | undefined): code is Locale {
  if (!code) return false;
  return VALID_LOCALES.has(code.toLowerCase());
}

type MessageTree = Record<string, any>;

const messagesMap: Record<Locale, MessageTree> = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
  bn: bnMessages,
  te: teMessages,
  ta: taMessages,
  gu: guMessages,
  kn: knMessages,
  ml: mlMessages,
  pa: paMessages,
  or: orMessages,
  as: asMessages,
  mai: maiMessages,
  sa: saMessages,
  ur: urMessages,
  ks: ksMessages,
  kok: kokMessages,
  ne: neMessages,
  sd: sdMessages,
  doi: doiMessages,
  brx: brxMessages,
  sat: satMessages,
  mni: mniMessages,
};

/**
 * Pure translation lookup with nested key support and parameter replacement.
 * e.g. t('alternatives.alreadyBest') or t('common.contains')
 */
export function getTranslation(
  locale: Locale,
  keyPath: string,
  params?: Record<string, string | number>
): string {
  const parts = keyPath.split('.');
  
  // Try current locale
  let current: any = messagesMap[locale] || messagesMap[DEFAULT_LOCALE];
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = null;
      break;
    }
  }

  // Fallback to English if not found
  if (current == null && locale !== DEFAULT_LOCALE) {
    let fallback: any = messagesMap[DEFAULT_LOCALE];
    for (const part of parts) {
      if (fallback && typeof fallback === 'object' && part in fallback) {
        fallback = fallback[part];
      } else {
        fallback = null;
        break;
      }
    }
    current = fallback;
  }

  if (typeof current !== 'string') {
    return keyPath;
  }

  let result = current;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }

  return result;
}

/**
 * Format numbers using Indian numbering system (e.g. 1,00,000).
 * Numbers & units remain standard across Indian packaging.
 */
export function formatNumber(val: number, decimals: number = 0): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(val);
}

/**
 * Format Indian Rupee currency (₹).
 */
export function formatINR(val: number, decimals: number = 0): string {
  if (isNaN(val)) return '₹0';
  return `₹${formatNumber(val, decimals)}`;
}

/**
 * Translate standard benefit strings through translation templates.
 */
export function translateBenefit(benefit: string, locale: Locale): string {
  if (locale === 'en' || !benefit) return benefit;
  const b = benefit.toLowerCase();

  if (b.includes('muscle') || b.includes('high protein') || b.includes('high in protein')) {
    return getTranslation(locale, 'templates.benefits.highProtein');
  }
  if (b.includes('good protein') || b.includes('good source of protein') || b.includes('protein')) {
    return getTranslation(locale, 'templates.benefits.goodProtein');
  }
  if (b.includes('fibre') || b.includes('fiber') || b.includes('digestion')) {
    return getTranslation(locale, 'templates.benefits.fibreRich');
  }
  if (b.includes('zero added sugar') || b.includes('no added sugar')) {
    return getTranslation(locale, 'templates.benefits.zeroAddedSugar');
  }
  if (b.includes('low sugar') || b.includes('low in sugar')) {
    return getTranslation(locale, 'templates.benefits.lowSugar');
  }
  if (b.includes('whole grain') || b.includes('wholegrain') || b.includes('oats')) {
    return getTranslation(locale, 'templates.benefits.wholeGrain');
  }
  if (b.includes('calcium') || b.includes('bone')) {
    return getTranslation(locale, 'templates.benefits.calciumRich');
  }
  if (b.includes('trans fat') || b.includes('zero trans')) {
    return getTranslation(locale, 'templates.benefits.transFatFree');
  }
  if (b.includes('low sodium') || b.includes('less salt')) {
    return getTranslation(locale, 'templates.benefits.lowSodium');
  }
  if (b.includes('wholesome') || b.includes('natural') || b.includes('simple')) {
    return getTranslation(locale, 'templates.benefits.naturalIngredients');
  }

  return benefit;
}

/**
 * Translate standard concern strings through translation templates.
 */
export function translateConcern(concern: string, locale: Locale): string {
  if (locale === 'en' || !concern) return concern;
  const c = concern.toLowerCase();

  if (c.includes('added sugar') || c.includes('high sugar') || c.includes('sugar')) {
    return getTranslation(locale, 'templates.concerns.highAddedSugar');
  }
  if (c.includes('sodium') || c.includes('salt')) {
    return getTranslation(locale, 'templates.concerns.highSodium');
  }
  if (c.includes('palm') || c.includes('palmolein')) {
    return getTranslation(locale, 'templates.concerns.containsPalmOil');
  }
  if (c.includes('maida') || c.includes('refined flour') || c.includes('refined wheat')) {
    return getTranslation(locale, 'templates.concerns.refinedFlour');
  }
  if (c.includes('sweetener') || c.includes('artificial sugar')) {
    return getTranslation(locale, 'templates.concerns.artificialSweeteners');
  }
  if (c.includes('colour') || c.includes('color') || c.includes('synthetic')) {
    return getTranslation(locale, 'templates.concerns.syntheticColour');
  }
  if (c.includes('sat fat') || c.includes('saturated fat')) {
    return getTranslation(locale, 'templates.concerns.highSatFat');
  }
  if (c.includes('ultra-processed') || c.includes('ultra processed') || c.includes('additive')) {
    return getTranslation(locale, 'templates.concerns.ultraProcessed');
  }

  return concern;
}

/**
 * Translate FBS band rating labels.
 */
export function translateFBSBand(band: string, locale: Locale): string {
  if (!band) return '';
  const lower = band.toLowerCase();
  if (lower.includes('good')) return getTranslation(locale, 'fbs.bands.good');
  if (lower.includes('moderate')) return getTranslation(locale, 'fbs.bands.moderate');
  if (lower.includes('limited')) return getTranslation(locale, 'fbs.bands.limited');
  if (lower.includes('avoid') || lower.includes('ultra')) return getTranslation(locale, 'fbs.bands.avoid');
  return band;
}
