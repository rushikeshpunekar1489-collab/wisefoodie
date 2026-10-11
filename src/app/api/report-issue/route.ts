import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, productSlug, issueType, details, email } = body;

    if (!productId || !issueType || !details) {
      return NextResponse.json(
        { error: 'productId, issueType, and details are required' },
        { status: 400 }
      );
    }

    let reports: any[] = [];
    if (fs.existsSync(REPORTS_FILE)) {
      try {
        const content = fs.readFileSync(REPORTS_FILE, 'utf-8');
        reports = JSON.parse(content);
      } catch (e) {
        reports = [];
      }
    }

    const newReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      productId,
      productSlug,
      issueType,
      details,
      email: email || null,
      timestamp: new Date().toISOString(),
      status: 'pending-review',
    };

    reports.push(newReport);
    fs.mkdirSync(path.dirname(REPORTS_FILE), { recursive: true });
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf-8');

    return NextResponse.json({ success: true, reportId: newReport.id });
  } catch (error: any) {
    console.error('Error saving issue report:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
