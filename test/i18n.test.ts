import { describe, it, expect } from 'vitest';
import {
  getTranslation,
  formatNumber,
  formatINR,
  translateBenefit,
  translateConcern,
  translateFBSBand,
  LOCALES,
  type Locale,
} from '../lib/i18n';

describe('i18n Pure Logic & Formatting', () => {
  it('has all 23 supported locales defined with labels (22 Scheduled Indian Languages + English)', () => {
    expect(LOCALES.length).toBe(23);
    const codes = LOCALES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('mr');
    expect(codes).toContain('bn');
    expect(codes).toContain('ta');
    expect(codes).toContain('ur');
    expect(LOCALES.find((l) => l.code === 'hi')?.native).toBe('हिंदी');
    expect(LOCALES.find((l) => l.code === 'mr')?.native).toBe('मराठी');
    expect(LOCALES.find((l) => l.code === 'bn')?.native).toBe('বাংলা');
    expect(LOCALES.find((l) => l.code === 'ta')?.native).toBe('தமிழ்');
    expect(LOCALES.find((l) => l.code === 'ur')?.native).toBe('اردو');
  });

  it('retrieves nested keys accurately for English, Hindi, and Marathi', () => {
    expect(getTranslation('en', 'nav.explore')).toBe('Explore');
    expect(getTranslation('hi', 'nav.explore')).toBe('एक्सप्लोर');
    expect(getTranslation('mr', 'nav.explore')).toBe('एक्सप्लोर करा');

    expect(getTranslation('en', 'common.chooseBetter')).toBe('Choose Better');
    expect(getTranslation('hi', 'common.chooseBetter')).toBe('बेहतर चुनें');
    expect(getTranslation('mr', 'common.chooseBetter')).toBe('अधिक चांगले निवडा');
  });

  it('interpolates parameters correctly with {key} syntax', () => {
    const interpolated = getTranslation('en', 'fbs.scoreOutOf10');
    expect(interpolated).toBe('out of 10');

    // Test with custom key replacement
    const custom = getTranslation('en', 'nonexistent.greeting', { user: 'Sarwesh' });
    expect(custom).toBe('nonexistent.greeting');
  });

  it('formats numbers and currencies according to Indian numbering system (en-IN)', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(150000)).toBe('1,50,000');
    expect(formatINR(45)).toBe('₹45');
    expect(formatINR(1250)).toBe('₹1,250');
  });

  it('translates common benefit strings using translated parameters', () => {
    const rawBenefit = 'High in protein for muscle health';
    expect(translateBenefit(rawBenefit, 'en')).toBe(rawBenefit);
    expect(translateBenefit(rawBenefit, 'hi')).toBe('मांसपेशियों के स्वास्थ्य के लिए उच्च प्रोटीन');
    expect(translateBenefit(rawBenefit, 'mr')).toBe('स्नायूंच्या आरोग्यासाठी उच्च प्रथिने');

    const fibreBenefit = 'High dietary fibre supporting digestion';
    expect(translateBenefit(fibreBenefit, 'hi')).toBe('पाचन में सहायक उच्च आहार फाइबर');
    expect(translateBenefit(fibreBenefit, 'mr')).toBe('पचनास मदत करणारे उच्च आहारातील फायबर');
  });

  it('translates common concern strings using translated parameters', () => {
    const rawConcern = 'High in added sugar';
    expect(translateConcern(rawConcern, 'en')).toBe(rawConcern);
    expect(translateConcern(rawConcern, 'hi')).toBe('अतिरिक्त चीनी की उच्च मात्रा');
    expect(translateConcern(rawConcern, 'mr')).toBe('अतिरिक्त साखरेचे जास्त प्रमाण');

    const palmConcern = 'Contains refined palm oil';
    expect(translateConcern(palmConcern, 'hi')).toBe('रिफाइंड पाम ऑयल शामिल है');
    expect(translateConcern(palmConcern, 'mr')).toBe('रिफाइंड पाम ऑईल समाविष्ट आहे');
  });

  it('translates FBS band ratings consistently', () => {
    expect(translateFBSBand('Good Choice', 'hi')).toBe('अच्छा विकल्प');
    expect(translateFBSBand('Moderate', 'hi')).toBe('मध्यम');
    expect(translateFBSBand('Good Choice', 'mr')).toBe('चांगला पर्याय');
    expect(translateFBSBand('Limited', 'mr')).toBe('मर्यादित प्रमाणात');
  });
});
