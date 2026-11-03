import { NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

export async function GET() {
  try {
    const categories = packagedFoodDb.getCategories();
    return NextResponse.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
