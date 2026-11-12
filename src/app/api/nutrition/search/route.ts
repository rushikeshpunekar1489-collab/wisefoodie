import { NextRequest, NextResponse } from 'next/server';
import { indianNutritionDb } from '@/lib/db/indianNutritionDb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const foodType = (searchParams.get('foodType') as 'all' | 'cooked' | 'raw') || 'all';
    const hasOilDataOnly = searchParams.get('hasOil') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const result = indianNutritionDb.search({
      query,
      category,
      foodType,
      hasOilDataOnly,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error in /api/nutrition/search:', err);
    return NextResponse.json(
      { error: 'Failed to search nutrition database', details: err?.message },
      { status: 500 }
    );
  }
}
