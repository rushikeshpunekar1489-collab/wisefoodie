import { NextRequest, NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 10;

    const searchResult = packagedFoodDb.search(query, limit);

    // Extract quick suggestions: matching product names, matching brands, matching categories
    const suggestionsSet = new Set<string>();
    const qLower = query.toLowerCase().trim();

    if (qLower) {
      // Check categories
      for (const cat of packagedFoodDb.getCategories()) {
        if (cat.name.toLowerCase().includes(qLower)) {
          suggestionsSet.add(cat.name);
        }
      }
      // Check brands
      for (const b of packagedFoodDb.getBrands()) {
        if (b.name.toLowerCase().includes(qLower)) {
          suggestionsSet.add(b.name);
          if (suggestionsSet.size >= 8) break;
        }
      }
      // Check product names
      for (const item of searchResult.items) {
        suggestionsSet.add(item.name);
        if (suggestionsSet.size >= 10) break;
      }
    }

    return NextResponse.json({
      success: true,
      query,
      total: searchResult.total,
      suggestions: Array.from(suggestionsSet),
      items: searchResult.items,
    });
  } catch (error: any) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
