export const CATEGORY_ICONS: Record<string, string> = {
  BISCUIT: '🍪',
  CAKE: '🍰',
  CHOCOLATE: '🍫',
  DAIRY: '🥛',
  ICEREAMES: '🍨',
  'INSTANT FOOD': '🍜',
  JUICE: '🧃',
  SAUCE: '🥫',
  SNACKS: '🍿',
  SPREAD: '🍯',
  SWEETS: '🍬',
  WAFER: '🧇',
  WAFFLE: '🧇',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryToSlug(category: string): string {
  return slugify(category);
}

export function slugToCategory(slug: string, availableCategories: string[]): string | null {
  const normalized = slug.toLowerCase().replace(/-/g, ' ');
  const match = availableCategories.find(c => {
    return c.toLowerCase() === normalized || slugify(c) === slug;
  });
  return match || null;
}
