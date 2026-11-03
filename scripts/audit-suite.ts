import { packagedFoodDb } from '../lib/db/packagedFoodDb';
import { getAllProducts, getAllProductsWithSamples } from '../lib/products';

interface TestResult {
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL' | 'BLOCKED';
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

async function probeUrl(url: string, expectedStatus = 200, method = 'GET', body?: any, headers: Record<string, string> = {}) {
  try {
    const opts: RequestInit = { method, headers };
    if (body) {
      opts.body = typeof body === 'string' ? body : JSON.stringify(body);
      if (!headers['Content-Type'] && typeof body !== 'string') {
        headers['Content-Type'] = 'application/json';
      }
    }
    const res = await fetch(url, opts);
    const text = await res.text();
    const isOk = res.status === expectedStatus;
    return {
      status: res.status,
      ok: isOk,
      text,
      contentType: res.headers.get('content-type') || '',
    };
  } catch (err: any) {
    return { status: 0, ok: false, error: err.message, text: '', contentType: '' };
  }
}

async function runAudit() {
  console.log('==================================================');
  console.log('   STARTING AUTOMATED MASTER SITE AUDIT           ');
  console.log('==================================================\n');

  const BASE_URL = 'http://localhost:3000';

  // 1. PAGE ROUTES AUDIT
  console.log('>>> [1/5] Auditing all 25 Frontend Page Routes...');
  const pageRoutes = [
    '/',
    '/about',
    '/admin',
    '/ask',
    '/cart',
    '/category',
    '/category/chocolate',
    '/category/biscuit',
    '/category/snacks',
    '/compare',
    '/contact',
    '/dashboard',
    '/diary',
    '/disclaimer',
    '/explore',
    '/explore/dairy-frozen',
    '/favourites',
    '/food/amul-gold-milk',
    '/how-fbs-works',
    '/learn',
    '/learn/sugar',
    '/privacy',
    '/products',
    '/products/IN-1',
    '/scanner',
    '/search?q=milk',
    '/terms',
  ];

  for (const route of pageRoutes) {
    const res = await probeUrl(`${BASE_URL}${route}`);
    if (res.ok && !res.text.includes('Application error') && !res.text.includes('Unhandled Runtime Error')) {
      results.push({ category: 'Page Routes', name: route, status: 'PASS', details: `Status ${res.status}` });
    } else {
      results.push({
        category: 'Page Routes',
        name: route,
        status: 'FAIL',
        details: `Status ${res.status}`,
        error: res.error || (res.text.includes('Application error') ? 'Next.js application error in HTML' : 'Non-200 status'),
      });
    }
  }

  // 2. API ENDPOINTS AUDIT
  console.log('>>> [2/5] Auditing all Backend API Endpoints...');
  const apiTests = [
    { url: '/api/categories', method: 'GET', expected: 200, name: 'GET /api/categories' },
    { url: '/api/brands', method: 'GET', expected: 200, name: 'GET /api/brands' },
    { url: '/api/statistics', method: 'GET', expected: 200, name: 'GET /api/statistics' },
    { url: '/api/products?limit=10', method: 'GET', expected: 200, name: 'GET /api/products' },
    { url: '/api/products/search?q=parle', method: 'GET', expected: 200, name: 'GET /api/products/search' },
    { url: '/api/products/compare?ids=IN-1,IN-2', method: 'GET', expected: 200, name: 'GET /api/products/compare' },
    { url: '/api/products/IN-1', method: 'GET', expected: 200, name: 'GET /api/products/IN-1' },
    { url: '/api/products/IN-999999', method: 'GET', expected: 404, name: 'GET /api/products/IN-999999 (404 expected)' },
    { url: '/api/admin/export?format=json', method: 'GET', expected: 200, name: 'GET /api/admin/export (json)' },
    { url: '/api/admin/export?format=csv', method: 'GET', expected: 200, name: 'GET /api/admin/export (csv)' },
    {
      url: '/api/admin/import?preview=true',
      method: 'POST',
      body: JSON.stringify([{ 'Item name': 'Audit Test Bar', Brand_Name: 'AUDIT', Category: 'SNACKS' }]),
      expected: 200,
      name: 'POST /api/admin/import (preview mode)',
    },
    {
      url: '/api/report-issue',
      method: 'POST',
      body: JSON.stringify({ issueType: 'nutrition', description: 'Audit test issue report' }),
      expected: 200,
      name: 'POST /api/report-issue',
    },
  ];

  for (const t of apiTests) {
    const res = await probeUrl(`${BASE_URL}${t.url}`, t.expected, t.method, t.body);
    if (res.ok) {
      results.push({ category: 'API Endpoints', name: t.name, status: 'PASS', details: `Status ${res.status}` });
    } else {
      results.push({
        category: 'API Endpoints',
        name: t.name,
        status: 'FAIL',
        details: `Status ${res.status}`,
        error: res.error || `Expected ${t.expected}, got ${res.status}`,
      });
    }
  }

  // 3. DATABASE INTEGRITY AUDIT
  console.log('>>> [3/5] Auditing Database Integrity...');
  const allPackaged = packagedFoodDb.getAll();
  const allExisting = getAllProductsWithSamples();

  if (allPackaged.length === 852) {
    results.push({ category: 'Database', name: 'Indian Packaged Food Count (852)', status: 'PASS' });
  } else {
    results.push({ category: 'Database', name: 'Indian Packaged Food Count (852)', status: 'FAIL', error: `Found ${allPackaged.length}` });
  }

  if (allExisting.length > 0) {
    results.push({ category: 'Database', name: 'Existing Catalog Count (>0)', status: 'PASS', details: `${allExisting.length} products` });
  } else {
    results.push({ category: 'Database', name: 'Existing Catalog Count (>0)', status: 'FAIL', error: 'Existing catalog empty' });
  }

  const categories = packagedFoodDb.getCategories();
  if (categories.length === 13) {
    results.push({ category: 'Database', name: 'Categories Count (13)', status: 'PASS' });
  } else {
    results.push({ category: 'Database', name: 'Categories Count (13)', status: 'FAIL', error: `Found ${categories.length}` });
  }

  const brands = packagedFoodDb.getBrands();
  if (brands.length === 262) {
    results.push({ category: 'Database', name: 'Brands Count (262)', status: 'PASS' });
  } else {
    results.push({ category: 'Database', name: 'Brands Count (262)', status: 'FAIL', error: `Found ${brands.length}` });
  }

  // Check null preservation in database
  let nullPreserved = true;
  for (const item of allPackaged) {
    if (item.transFatG === undefined || item.cholesterolMg === undefined) {
      nullPreserved = false;
      break;
    }
  }
  if (nullPreserved) {
    results.push({ category: 'Database', name: 'Null Preservation (No undefined)', status: 'PASS' });
  } else {
    results.push({ category: 'Database', name: 'Null Preservation', status: 'FAIL', error: 'Found undefined fields' });
  }

  // 4. SECURITY AUDIT
  console.log('>>> [4/5] Auditing Security Configuration...');
  // Check if .env or secret keys are exposed in client responses
  const samplePage = await probeUrl(`${BASE_URL}/`);
  const hasExposedKeys = samplePage.text.includes('AIzaSy') || samplePage.text.includes('SECRET_KEY') || samplePage.text.includes('PASSWORD');
  if (!hasExposedKeys) {
    results.push({ category: 'Security', name: 'No Secrets Exposed in HTML', status: 'PASS' });
  } else {
    results.push({ category: 'Security', name: 'No Secrets Exposed in HTML', status: 'FAIL', error: 'Potential secret leak in HTML' });
  }

  // Check SQL / Injection resistance in API search
  const sqlProbe = await probeUrl(`${BASE_URL}/api/products/search?q=' OR '1'='1`);
  if (sqlProbe.status === 200) {
    results.push({ category: 'Security', name: 'Search API Injection Resistance', status: 'PASS' });
  } else {
    results.push({ category: 'Security', name: 'Search API Injection Resistance', status: 'FAIL', error: `Search failed on injection string: ${sqlProbe.status}` });
  }

  // 5. PRINT SUMMARY
  console.log('\n==================================================');
  console.log('   AUDIT SUMMARY RESULTS                          ');
  console.log('==================================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL CHECKS: ${results.length} | PASS: ${passes} | FAIL: ${fails}\n`);

  for (const r of results) {
    const icon = r.status === 'PASS' ? '✓' : '✗';
    console.log(`${icon} [${r.category}] ${r.name}: ${r.status} ${r.error ? `(${r.error})` : ''}`);
  }

  return { passes, fails, results };
}

runAudit();
