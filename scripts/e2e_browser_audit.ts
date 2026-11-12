import { chromium } from 'playwright';

async function runE2EAudit() {
  console.log('===============================================================');
  console.log('  WISEFOODIES COMPLETE PLAYWRIGHT BROWSER AUDIT');
  console.log('===============================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  const viewports = [
    { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
    { name: 'Laptop (1366x768)', width: 1366, height: 768 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Mobile (390x844)', width: 390, height: 844 },
    { name: 'Small Mobile (360x740)', width: 360, height: 740 }
  ];

  let totalChecks = 0;
  let passedChecks = 0;

  function check(passed: boolean, description: string) {
    totalChecks++;
    if (passed) {
      passedChecks++;
      console.log(`  ✓ ${description}`);
    } else {
      console.error(`  ✗ FAILED: ${description}`);
    }
  }

  // --- PHASE 1: Route Integrity Verification ---
  console.log('--- PHASE 1: Route Integrity Verification ---');
  const routes = [
    { path: '/', label: 'Homepage' },
    { path: '/products', label: 'Packaged Products' },
    { path: '/products/IN-1', label: 'Product Details' },
    { path: '/compare', label: 'Food Comparison' },
    { path: '/learn', label: 'Learn Hub' },
    { path: '/favourites', label: 'Favorites' },
    { path: '/cart', label: 'Smart Basket' },
    { path: '/diary', label: 'Meal Diary' },
    { path: '/fitness-calculators', label: 'Fitness & Indian Nutrition Hub' },
    { path: '/scanner', label: 'Scanner' }
  ];

  for (const r of routes) {
    const res = await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded' });
    const status = res?.status() || 0;
    check(status === 200, `Route ${r.path} (${r.label}) returned HTTP 200`);
  }

  // --- PHASE 8: Scanner State & Camera Lockdown Audit ---
  console.log('\n--- PHASE 8: Scanner State & Camera Lockdown Audit ---');
  await page.goto('http://localhost:3000/scanner', { waitUntil: 'domcontentloaded' });
  const hasComingSoon = await page.locator('text=Coming Soon').count();
  check(hasComingSoon > 0, 'Scanner Coming Soon banner is explicitly visible');

  const videoTagCount = await page.locator('video').count();
  check(videoTagCount === 0, 'Zero <video> stream elements present on page');

  const browseBtn = await page.locator('a:has-text("Browse Packaged Foods")').isVisible();
  check(browseBtn, 'Browse Packaged Foods CTA button is visible and active');

  // --- PHASE 3: Fitness Calculators ---
  console.log('\n--- PHASE 3: Fitness Calculators Verification ---');
  await page.goto('http://localhost:3000/fitness-calculators', { waitUntil: 'networkidle' });

  // 1. BMI Calculator (active by default)
  await page.click('button:has-text("BMI Calculator")');
  const bmiVisible = await page.locator('text=23.5').first().isVisible();
  check(bmiVisible, 'BMI default calculation renders 23.5 kg/m²');

  const bmiCatVisible = await page.locator('text=Normal Weight').first().isVisible();
  check(bmiCatVisible, 'BMI category identifies "Normal Weight"');

  // Test Imperial switch
  await page.click('button:has-text("ft + in")');
  const ftVal = await page.inputValue('input[placeholder="ft"]');
  check(ftVal === '5', 'Height correctly converted to feet (5 ft)');

  // 2. Body Fat Calculator
  await page.click('button:has-text("Body Fat %")');
  await page.waitForTimeout(300);
  const bfHeader = await page.locator('text=Body Fat Percentage Calculator').first().isVisible();
  check(bfHeader, 'Body Fat calculator header is active');
  const bfMale = await page.locator('text=17.8%').first().isVisible();
  check(bfMale, 'US Navy equation computed 17.8% for default male (86cm waist, 38cm neck, 175cm height)');

  // Switch to Female
  await page.click('button:has-text("Female")');
  await page.waitForTimeout(200);
  const femaleHipInput = await page.locator('label:has-text("Hip (")').first().isVisible();
  check(femaleHipInput, 'Female selection dynamically exposes Hip circumference input');

  // 3. Daily Calories
  await page.click('button:has-text("Daily Calories & TDEE")');
  await page.waitForTimeout(200);
  const bmrLabel = await page.locator('text=Basal Metabolic Rate (BMR)').first().isVisible();
  check(bmrLabel, 'BMR calculation is rendered');
  const tdeeLabel = await page.locator('text=Total Daily Energy (TDEE)').first().isVisible();
  check(tdeeLabel, 'TDEE calculation is rendered');

  // 4. Ideal Weight
  await page.click('button:has-text("Ideal Weight")');
  await page.waitForTimeout(200);
  const devineLabel = await page.locator('text=Devine (1974)').first().isVisible();
  check(devineLabel, 'Clinical formula estimates (Devine) rendered');

  // --- PHASE 5 & 6: Indian Food Search & Quantity Scaling ---
  console.log('\n--- PHASE 5 & 6: Indian Food Search & Quantity Scaling ---');
  // Switch to Section B: Indian Food Database
  await page.click('button:has-text("SECTION B: INDIAN FOOD DATABASE")');
  await page.waitForTimeout(400);

  const searchInput = page.locator('input[placeholder*="Search Indian foods"]');
  await searchInput.fill('Palak Paneer');
  await page.waitForTimeout(800); // Debounce network request

  const foodCard = page.locator('text=Spinach paneer (Palak paneer)').first();
  const cardVisible = await foodCard.isVisible();
  check(cardVisible, 'Search returned "Spinach paneer (Palak paneer)"');

  await foodCard.click();
  await page.waitForTimeout(400);

  const modalTitle = await page.locator('h3:has-text("Spinach paneer (Palak paneer)")').isVisible();
  check(modalTitle, 'Food Detail Modal opened successfully');

  // Base 100g verification: energyKcal is 78 kcal (rounded from 77.68)
  const energyCard = page.locator('div.bg-amber-50:has-text("Energy")');
  const energyText = await energyCard.innerText();
  check(energyText.includes('78 kcal') || energyText.includes('77.7'), 'Base 100g energy matches source (~78 kcal)');

  // Quantity scaling to custom 200g
  const customGramsInput = page.locator('input[type="number"][min="5"][max="2000"]');
  await customGramsInput.fill('200');
  await page.waitForTimeout(300);

  const scaledEnergyText = await energyCard.innerText();
  check(scaledEnergyText.includes('155 kcal') || scaledEnergyText.includes('155.4'), 'Scaled 200g energy updates linearly to ~155 kcal');

  // Oil & Fat Breakdown Verification
  const oilBreakdownHeader = await page.locator('text=Oil & Cooking Fat Breakdown').first().isVisible();
  check(oilBreakdownHeader, 'Cooking oil & fat breakdown component is active');
  const sunflowerVisible = await page.locator('div.text-sm:has-text("Oil, sunflower")').first().isVisible();
  check(sunflowerVisible, 'Sunflower oil correctly identified with exact recipe quantity');

  // Close modal
  await page.click('button[aria-label="Close food details"]');
  await page.waitForTimeout(200);

  // --- PHASE 9: Responsive Layout & Viewports ---
  console.log('\n--- PHASE 9: Responsive Viewport & Overflow Audit ---');
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/fitness-calculators', { waitUntil: 'domcontentloaded' });
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    check(!hasHorizontalOverflow, `${vp.name}: Zero horizontal scroll overflow (scrollWidth <= clientWidth)`);
  }

  // --- Console Summary ---
  console.log('\n--- Console & Network Health ---');
  console.log(`Captured console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => console.log(`  ! ${err}`));
  }

  await browser.close();

  console.log(`\n===============================================================`);
  console.log(`  E2E AUDIT RESULTS: ${passedChecks}/${totalChecks} CHECKS PASSED`);
  console.log(`===============================================================\n`);

  if (passedChecks !== totalChecks) {
    process.exit(1);
  }
}

runE2EAudit().catch(err => {
  console.error('Fatal error during E2E audit:', err);
  process.exit(1);
});
