import { NextRequest, NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids') || '';
    const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean);

    const result = packagedFoodDb.compare(ids);

    return NextResponse.json({
      success: true,
      products: result.products,
      highlights: result.highlights,
    });
  } catch (error: any) {
    console.error('Error in compare API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Comparison failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids : [];

    const result = packagedFoodDb.compare(ids);

    return NextResponse.json({
      success: true,
      products: result.products,
      highlights: result.highlights,
    });
  } catch (error: any) {
    console.error('Error in compare API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Comparison failed' },
      { status: 500 }
    );
  }
}
