import { NextRequest, NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') || 'json').toLowerCase() as 'json' | 'csv';

    const output = packagedFoodDb.export(format);

    if (format === 'csv') {
      return new NextResponse(output, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="packaged_foods_india_export.csv"',
        },
      });
    }

    return new NextResponse(output, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="packaged_foods_india_export.json"',
      },
    });
  } catch (error: any) {
    console.error('Error in admin export API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Export failed' },
      { status: 500 }
    );
  }
}
