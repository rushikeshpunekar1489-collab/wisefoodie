import { NextRequest, NextResponse } from 'next/server';
import { indianNutritionDb } from '@/lib/db/indianNutritionDb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = indianNutritionDb.getById(id);

    if (!item) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (err: any) {
    console.error('Error in /api/nutrition/[id]:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve food item', details: err?.message },
      { status: 500 }
    );
  }
}
