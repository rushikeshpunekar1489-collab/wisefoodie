import { NextRequest, NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';

function parseCsv(text: string): Record<string, any>[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const parseRow = (rowStr: string): string[] => {
    const values: string[] = [];
    let insideQuote = false;
    let current = '';

    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        if (insideQuote && rowStr[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = parseRow(lines[0]);
  const records: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseRow(lines[i]);
    const rec: Record<string, any> = {};
    headers.forEach((h, idx) => {
      let val: any = vals[idx] !== undefined ? vals[idx] : null;
      if (val === '' || val === 'null' || val === 'NULL') {
        val = null;
      } else if (!isNaN(Number(val)) && val !== null) {
        val = Number(val);
      }
      rec[h] = val;
    });
    records.push(rec);
  }

  return records;
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get('preview') === 'true';
    const mode = (searchParams.get('mode') as 'merge' | 'replace') || 'merge';

    const contentType = request.headers.get('content-type') || '';
    let rawItems: any[] = [];

    if (contentType.includes('application/json')) {
      const jsonBody = await request.json();
      if (Array.isArray(jsonBody)) {
        rawItems = jsonBody;
      } else if (jsonBody.items && Array.isArray(jsonBody.items)) {
        rawItems = jsonBody.items;
      } else {
        rawItems = [jsonBody];
      }
    } else {
      // Text / CSV
      const text = await request.text();
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        const parsed = JSON.parse(text);
        rawItems = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        rawItems = parseCsv(text);
      }
    }

    if (rawItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No product records found in payload' },
        { status: 400 }
      );
    }

    // Validate records
    const errors: string[] = [];
    let validCount = 0;

    for (let i = 0; i < rawItems.length; i++) {
      const r = rawItems[i];
      const name = r['Item name'] || r.name;
      const brand = r['Brand_Name'] || r.brand;
      const cat = r['Category'] || r.category;

      if (!name) {
        errors.push(`Row ${i + 1}: Missing Product Name`);
      } else if (!brand) {
        errors.push(`Row ${i + 1}: Missing Brand Name`);
      } else if (!cat) {
        errors.push(`Row ${i + 1}: Missing Category`);
      } else {
        validCount++;
      }
    }

    if (isPreview) {
      return NextResponse.json({
        success: true,
        preview: true,
        totalProvided: rawItems.length,
        validCount,
        invalidCount: errors.length,
        errors,
        sample: rawItems.slice(0, 3),
      });
    }

    // Execute bulk import
    const result = packagedFoodDb.bulkImport(rawItems, mode);

    return NextResponse.json({
      success: result.success,
      imported: result.imported,
      errors: result.errors,
      totalNow: packagedFoodDb.getAll().length,
    });
  } catch (error: any) {
    console.error('Error in admin import API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Import failed' },
      { status: 500 }
    );
  }
}
