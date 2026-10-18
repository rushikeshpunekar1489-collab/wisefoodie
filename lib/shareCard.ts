/**
 * WiseFoodies Share Card Pure Utilities
 */

import type { Product } from '@/types/product';

export interface ShareCardConfig {
  format: 'portrait' | 'landscape';
  width: number;
  height: number;
}

export const SHARE_FORMATS: Record<'portrait' | 'landscape', ShareCardConfig> = {
  portrait: {
    format: 'portrait',
    width: 1080,
    height: 1350, // Instagram 4:5 portrait
  },
  landscape: {
    format: 'landscape',
    width: 1200,
    height: 630, // Twitter / OpenGraph landscape
  },
};

/**
 * Generate standard pre-filled share caption
 */
export function generateShareCaption(product: {
  name: string;
  brand: string;
  fbsScore: number | null;
  url: string;
}): string {
  const scoreStr = product.fbsScore !== null ? `${product.fbsScore.toFixed(1)}/10` : 'an initial rating';
  return `${product.name} by ${product.brand} scored ${scoreStr} on WiseFoodies Food Benefit Score. Know what's in your food before you buy → ${product.url}`;
}

/**
 * Generate WhatsApp share intent URL
 */
export function generateWhatsAppShareUrl(caption: string): string {
  return `https://wa.me/?text=${encodeURIComponent(caption)}`;
}

/**
 * Get band color hex string for canvas/OG rendering
 */
export function getScoreBandColor(score: number | null): string {
  if (score === null) return '#94a3b8';
  if (score >= 9.0) return '#15803d'; // Leaf green
  if (score >= 7.0) return '#10b981'; // Mint green
  if (score >= 5.0) return '#eab308'; // Mango yellow
  if (score >= 3.0) return '#f97316'; // Orange
  return '#ef4444'; // Tomato red
}

/**
 * Get soft background wash for canvas/OG rendering
 */
export function getScoreBgColor(score: number | null): string {
  if (score === null) return '#f8fafc';
  if (score >= 7.0) return '#ecfdf5';
  if (score >= 5.0) return '#fefce8';
  return '#fff1f2';
}
