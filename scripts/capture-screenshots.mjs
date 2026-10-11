import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'docs', 'screenshots');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const routes = [
  { path: '/', label: 'home' },
  { path: '/explore', label: 'explore' },
  { path: '/food/sample-rolled-oats', label: 'product-sample' },
  { path: '/food/amul-ice-cream', label: 'product-catalog' },
  { path: '/compare', label: 'compare' },
  { path: '/scanner', label: 'scanner' },
];

async function capture() {
  console.log('Launching browser via Playwright with Edge engine...');
  const browser = await chromium.launch({
    executablePath: fs.existsSync(EDGE_PATH) ? EDGE_PATH : undefined,
    headless: true,
  });

  const consoleErrors = [];

  for (const vp of viewports) {
    console.log(`\n--- Capturing viewport: ${vp.name} (${vp.width}px x ${vp.height}px) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore expected favicon or hydration warnings if benign
        if (!text.includes('favicon') && !text.includes('deprecated')) {
          consoleErrors.push({ viewport: vp.name, error: text });
        }
      }
    });

    for (const r of routes) {
      const url = `http://localhost:3000${r.path}`;
      try {
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(500); // Allow animations to settle

        const filename = `${r.label}-${vp.width}px.png`;
        const filePath = path.join(SCREENSHOTS_DIR, filename);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`✓ Saved ${filename}`);
      } catch (err) {
        console.error(`Failed to capture ${url}:`, err.message);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log('\n--- Screenshot QA Summary ---');
  console.log(`Total console errors detected: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.warn('Console errors:', consoleErrors);
  } else {
    console.log('Zero console errors detected across all core routes!');
  }
}

capture().catch(err => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
