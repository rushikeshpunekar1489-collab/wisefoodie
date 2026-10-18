import { describe, it, expect } from 'vitest';
import { LOCALES, RTL_LOCALES, isRTL, getTranslation, formatNumber, formatINR, isValidLocale } from '../lib/i18n';
import { getLocalizedProduct, localizeCategory } from '../lib/productLocalization';
import { checkScope, getRefusalMessage, EXACT_REFUSALS } from '../lib/ai/scope';
import type { Product } from '../types/product';

describe('Comprehensive Multilingual i18n Suite', () => {
  it('supports exactly 23 locales (22 Scheduled Indian Languages + English)', () => {
    expect(LOCALES.length).toBe(23);
    const codes = LOCALES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('mr');
    expect(codes).toContain('bn');
    expect(codes).toContain('te');
    expect(codes).toContain('ta');
    expect(codes).toContain('gu');
    expect(codes).toContain('kn');
    expect(codes).toContain('ml');
    expect(codes).toContain('pa');
    expect(codes).toContain('or');
    expect(codes).toContain('as');
    expect(codes).toContain('mai');
    expect(codes).toContain('sa');
    expect(codes).toContain('ur');
    expect(codes).toContain('ks');
    expect(codes).toContain('kok');
    expect(codes).toContain('ne');
    expect(codes).toContain('sd');
    expect(codes).toContain('doi');
    expect(codes).toContain('brx');
    expect(codes).toContain('sat');
    expect(codes).toContain('mni');
  });

  it('correctly identifies RTL writing directions for Urdu, Kashmiri, and Sindhi', () => {
    expect(isRTL('ur')).toBe(true);
    expect(isRTL('ks')).toBe(true);
    expect(isRTL('sd')).toBe(true);
    expect(isRTL('hi')).toBe(false);
    expect(isRTL('en')).toBe(false);
    expect(isRTL('bn')).toBe(false);
    expect(isRTL('ta')).toBe(false);
  });

  it('validates locale identifiers correctly', () => {
    expect(isValidLocale('hi')).toBe(true);
    expect(isValidLocale('HI')).toBe(true);
    expect(isValidLocale('ur')).toBe(true);
    expect(isValidLocale('xyz')).toBe(false);
    expect(isValidLocale(null)).toBe(false);
  });

  it('formats numbers and INR currencies in Indian numbering format', () => {
    expect(formatNumber(100000)).toBe('1,00,000');
    expect(formatINR(50)).toBe('₹50');
    expect(formatINR(125000)).toBe('₹1,25,000');
  });

  it('retrieves translations for all supported languages with fallback', () => {
    expect(getTranslation('en', 'nav.home')).toBe('Home');
    expect(getTranslation('hi', 'nav.home')).toBe('होम');
    expect(getTranslation('mr', 'nav.home')).toBe('मुख्यपृष्ठ');
    expect(getTranslation('bn', 'nav.home')).toBe('হোম');
    expect(getTranslation('ta', 'nav.home')).toBe('முகப்பு');
    expect(getTranslation('te', 'nav.home')).toBe('హోమ్');
    expect(getTranslation('ur', 'nav.home')).toBe('ہوم');
  });

  it('preserves product factual numbers while localizing presentation fields', () => {
    const sampleProduct: Product = {
      id: 'test-amul-milk',
      slug: 'test-amul-milk',
      name: 'Amul Taaza Milk',
      brand: 'Amul',
      category: 'Dairy & Frozen',
      subcategory: 'Milk',
      priceINR: 54,
      packSizeG: 1000,
      packSizeText: '1L',
      servingSizeG: 200,
      image: null,
      barcode: '8901262010053',
      aliases: [],
      dataSource: 'label',
      lastUpdated: '2026-01-01',
      verification: 'complete',
      per100g: {
        energyKcal: 58,
        proteinG: 3.0,
        carbsG: 4.7,
        totalSugarG: 4.7,
        addedSugarG: 0.0,
        fatG: 3.0,
        satFatG: 1.8,
        transFatG: 0.0,
        fibreG: 0.0,
        sodiumMg: 50,
        micronutrients: [],
      },
      fbs: {
        score: 7.8,
        band: 'Good Choice',
        breakdown: [],
      },
      nutritionPerPaisa: {
        proteinPerRupee: 0.55,
        fibrePerRupee: 0,
        tenRupeesGet: [],
      },
      ingredients: ['Standardized Milk'],
      ingredientTags: ['dairy'],
      benefits: ['High protein for muscle health', 'Good source of calcium'],
      concerns: [],
    };

    const localizedHi = getLocalizedProduct(sampleProduct, 'hi');
    expect(localizedHi.name).toBe('Amul Taaza Milk'); // Factual identity untouched
    expect(localizedHi.brand).toBe('Amul');
    expect(localizedHi.priceINR).toBe(54);
    expect(localizedHi.per100g.proteinG).toBe(3.0);
    expect(localizedHi.fbs.score).toBe(7.8);
    expect(localizedHi.localizedCategory).toBe('डेयरी और फ्रोजन');
    expect(localizedHi.localizedVerificationStatus).toBe('सत्यापित लेबल');

    const localizedMr = getLocalizedProduct(sampleProduct, 'mr');
    expect(localizedMr.localizedCategory).toBe('डेअरी आणि फ्रोजन');
    expect(localizedMr.localizedVerificationStatus).toBe('सत्यापित लेबल');
  });

  it('enforces exact scope refusal sentences across all 23 languages', () => {
    expect(getRefusalMessage('en')).toBe("Sorry, I can't assist you with that.");
    expect(getRefusalMessage('hi')).toBe("माफ़ कीजिए, मैं इसमें मदद नहीं कर सकता।");
    expect(getRefusalMessage('mr')).toBe("माफ करा, मी यामध्ये मदत करू शकत नाही.");
    expect(getRefusalMessage('bn')).toBe("দুঃখিত, আমি এতে সাহায্য করতে পারব না।");
    expect(getRefusalMessage('te')).toBe("క్షమించండి, నేను ఇందులో సహాయం చేయలేను.");
    expect(getRefusalMessage('ta')).toBe("மன்னிக்கவும், இதில் என்னால் உதவ முடியாது.");
    expect(getRefusalMessage('ur')).toBe("معذرت، میں اس میں مدد نہیں کر سکتا۔");

    const refusalKeys = Object.keys(EXACT_REFUSALS);
    expect(refusalKeys.length).toBe(23);
  });

  it('rejects out-of-scope prompts with exact localized refusal', () => {
    const resHi = checkScope('पायथन में कोड कैसे लिखें?', 'hi');
    expect(resHi.inScope).toBe(false);
    expect(resHi.refusalText).toBe("माफ़ कीजिए, मैं इसमें मदद नहीं कर सकता।");

    const resEn = checkScope('Write a python program to reverse string', 'en');
    expect(resEn.inScope).toBe(false);
    expect(resEn.refusalText).toBe("Sorry, I can't assist you with that.");

    const resModi = checkScope('Who is the Prime Minister of India?', 'en');
    expect(resModi.inScope).toBe(false);
    expect(resModi.refusalText).toBe("Sorry, I can't assist you with that.");
  });

  it('accepts legitimate food literacy questions in-scope', () => {
    const res1 = checkScope('What is the protein content of Amul Milk?', 'en');
    expect(res1.inScope).toBe(true);

    const res2 = checkScope('मैगी नूडल्स में कितनी चीनी है?', 'hi');
    expect(res2.inScope).toBe(true);

    const res3 = checkScope('Compare Maggi vs Yippee', 'en');
    expect(res3.inScope).toBe(true);

    const res4 = checkScope('Why is palm oil penalized in Food Benefit Score?', 'en');
    expect(res4.inScope).toBe(true);
  });
});
