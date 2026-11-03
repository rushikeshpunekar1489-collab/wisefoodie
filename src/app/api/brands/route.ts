import { NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

export async function GET() {
  try {
    const brands = packagedFoodDb.getBrands();
    return NextResponse.json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error: any) {
    console.error('Error in brands API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
