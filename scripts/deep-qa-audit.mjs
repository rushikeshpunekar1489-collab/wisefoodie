import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const VIEWPORTS = [
  { name: 'Mobile 360px', width: 360, height: 740 },
  { name: 'Mobile 375px', width: 375, height: 667 },
  { name: 'Mobile 390px', width: 390, height: 844 },
  { name: 'Mobile 430px', width: 430, height: 932 },
  { name: 'Tablet 768px', width: 768, height: 1024 },
  { name: 'Tablet 1024px', width: 1024, height: 768 },
  { name: 'Desktop 1280px', width: 1280, height: 800 },
  { name: 'Desktop 1440px', width: 1440, height: 900 },
  { name: 'Desktop 1920px', width: 1920, height: 1080 },
];

const PAGES_TO_TEST = [
  '/',
  '/products',
  '/products/IN-1',
  '/category',
  '/category/chocolate',
  '/dashboard',
  '/admin',
  '/compare',
  '/explore',
  '/food/amul-gold-milk',
  '/search?q=biscuit',
  '/scanner',
  '/cart',
  '/diary',
  '/favourites',
  '/how-fbs-works',
  '/learn',
  '/about',
  '/contact',
];

async function runQAAudit() {
  console.log('==================================================');
  console.log('   RUNNING DEEP BROWSER QA & RESPONSIVE AUDIT     ');
  console.log('==================================================\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--no-sandbox'],
  });

  const issues = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n>>> Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      permissions: ['camera'],
    });
    const page = await context.newPage();

    for (const path of PAGES_TO_TEST) {
      const url = `${BASE_URL}${path}`;
      const consoleErrors = [];
      const errorHandler = msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      };
      page.on('console', errorHandler);

      try {
        const res = await page.goto(url, { waitUntil: 'load', timeout: 8000 });
        const status = res ? res.status() : 0;

        if (status >= 400) {
          issues.push({
            severity: 'P1',
            viewport: vp.name,
            path,
            type: 'HTTP Error',
            details: `Status ${status}`,
          });
          console.log(`  ✗ ${path} -> HTTP ${status}`);
          continue;
        }

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            hasOverflow: scrollWidth > clientWidth + 2,
            diff: scrollWidth - clientWidth,
            scrollWidth,
            clientWidth,
          };
        });

        if (overflow.hasOverflow) {
          issues.push({
            severity: 'P2',
            viewport: vp.name,
            path,
            type: 'Horizontal Overflow',
            details: `scrollWidth (${overflow.scrollWidth}px) > clientWidth (${overflow.clientWidth}px) by ${overflow.diff}px`,
          });
          console.log(`  ⚠️ ${path} -> Overflow: +${overflow.diff}px`);
        } else {
          console.log(`  ✓ ${path} -> OK (Status: ${status})`);
        }

        // Check real console errors
        const realErrors = consoleErrors.filter(
          e =>
            !e.includes('favicon.ico') &&
            !e.includes('next-dev.js') &&
            !e.includes('Download the React DevTools') &&
            !e.includes('Warning: Extra attributes')
        );

        if (realErrors.length > 0) {
          issues.push({
            severity: 'P2',
            viewport: vp.name,
            path,
            type: 'Console Error',
            details: realErrors.slice(0, 2).join(' | '),
          });
        }
      } catch (err) {
        issues.push({
          severity: 'P1',
          viewport: vp.name,
          path,
          type: 'Navigation Error / Timeout',
          details: err.message,
        });
        console.log(`  ✗ ${path} -> Error: ${err.message}`);
      } finally {
        page.off('console', errorHandler);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log('\n==================================================');
  console.log('   AUDIT COMPLETE                                 ');
  console.log('==================================================');
  console.log(`Total Issues Discovered: ${issues.length}`);
  issues.forEach((iss, idx) => {
    console.log(`[#${idx + 1}] [${iss.severity}] ${iss.path} on ${iss.viewport}: ${iss.type} - ${iss.details}`);
  });

  return issues;
}

runQAAudit().catch(console.error);
