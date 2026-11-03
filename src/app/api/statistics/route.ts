import { NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

export async function GET() {
  try {
    const stats = packagedFoodDb.getStatistics();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error in statistics API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
