import { describe, it, expect } from 'vitest';
import {
  generateShareCaption,
  generateWhatsAppShareUrl,
  getScoreBandColor,
  getScoreBgColor,
  SHARE_FORMATS,
} from '../lib/shareCard';

describe('Share Card Pure Logic', () => {
  it('formats share captions correctly with measured scores', () => {
    const caption = generateShareCaption({
      name: 'Amul Gold Milk',
      brand: 'Amul',
      fbsScore: 8.5,
      url: 'https://wisefoodies.in/food/amul-gold-milk',
    });

    expect(caption).toContain('Amul Gold Milk');
    expect(caption).toContain('Amul');
    expect(caption).toContain('8.5/10');
    expect(caption).toContain('https://wisefoodies.in/food/amul-gold-milk');
  });

  it('handles null scores in captions gracefully without crashing', () => {
    const caption = generateShareCaption({
      name: 'Mystery Snack',
      brand: 'Generic',
      fbsScore: null,
      url: 'https://wisefoodies.in/food/mystery-snack',
    });

    expect(caption).toContain('an initial rating');
    expect(caption).toContain('https://wisefoodies.in/food/mystery-snack');
  });

  it('generates proper WhatsApp share URLs', () => {
    const url = generateWhatsAppShareUrl('Hello world & test');
    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(url).toContain('Hello%20world%20%26%20test');
  });

  it('maps scores to consistent band colors', () => {
    expect(getScoreBandColor(9.5)).toBe('#15803d');
    expect(getScoreBandColor(7.5)).toBe('#10b981');
    expect(getScoreBandColor(5.5)).toBe('#eab308');
    expect(getScoreBandColor(3.5)).toBe('#f97316');
    expect(getScoreBandColor(2.0)).toBe('#ef4444');
    expect(getScoreBandColor(null)).toBe('#94a3b8');
  });

  it('returns valid share card format specifications', () => {
    expect(SHARE_FORMATS.portrait.width).toBe(1080);
    expect(SHARE_FORMATS.portrait.height).toBe(1350);
    expect(SHARE_FORMATS.landscape.width).toBe(1200);
    expect(SHARE_FORMATS.landscape.height).toBe(630);
  });
});
