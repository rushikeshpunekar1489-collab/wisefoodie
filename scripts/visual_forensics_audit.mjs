import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), 'docs', 'screenshots', 'forensics');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const routes = [
  { path: '/', id: 'home', label: 'Homepage / Landing', component: 'src/app/page.tsx' },
  { path: '/products', id: 'products', label: 'Packaged Products Catalog', component: 'src/app/products/page.tsx' },
  { path: '/products/IN-1', id: 'product-detail', label: 'Product Detail (Packaged Food)', component: 'src/app/products/[id]/page.tsx' },
  { path: '/food/sample-rolled-oats', id: 'food-detail-sample', label: 'Food FBS Deep Dive', component: 'src/app/food/[slug]/page.tsx' },
  { path: '/category', id: 'category-hub', label: 'Category Directory', component: 'src/app/category/page.tsx' },
  { path: '/category/biscuit', id: 'category-biscuit', label: 'Category: Biscuits', component: 'src/app/category/[slug]/page.tsx' },
  { path: '/explore', id: 'explore-hub', label: 'Explore Hub', component: 'src/app/explore/page.tsx' },
  { path: '/explore/BISCUIT', id: 'explore-biscuit', label: 'Explore: Biscuit Category', component: 'src/app/explore/[category]/page.tsx' },
  { path: '/compare', id: 'compare', label: 'Food Comparison Engine', component: 'src/app/compare/page.tsx' },
  { path: '/fitness-calculators', id: 'fitness-calculators', label: 'Fitness & Indian Nutrition Hub', component: 'src/app/fitness-calculators/page.tsx' },
  { path: '/cart', id: 'cart', label: 'Smart Basket / Daily Budget', component: 'src/app/cart/page.tsx' },
  { path: '/favourites', id: 'favourites', label: 'Saved Favorites', component: 'src/app/favourites/page.tsx' },
  { path: '/diary', id: 'diary', label: 'Meal Diary & Daily Macros', component: 'src/app/diary/page.tsx' },
  { path: '/scanner', id: 'scanner', label: 'Barcode Scanner (Camera / OCR)', component: 'src/app/scanner/page.tsx' },
  { path: '/learn', id: 'learn-hub', label: 'Food Knowledge Hub', component: 'src/app/learn/page.tsx' },
  { path: '/learn/food-labels-101', id: 'learn-topic', label: 'Knowledge Guide Article', component: 'src/app/learn/[topic]/page.tsx' },
  { path: '/how-fbs-works', id: 'how-fbs-works', label: 'How FBS Works', component: 'src/app/how-fbs-works/page.tsx' },
  { path: '/ask', id: 'ask-ai', label: 'AI Nutritionist Chat', component: 'src/app/ask/page.tsx' },
  { path: '/search?q=tea', id: 'search', label: 'Search Results Page', component: 'src/app/search/page.tsx' },
  { path: '/dashboard', id: 'dashboard', label: 'Health Dashboard', component: 'src/app/dashboard/page.tsx' },
  { path: '/about', id: 'about', label: 'About WiseFoodies', component: 'src/app/about/page.tsx' },
  { path: '/contact', id: 'contact', label: 'Contact Us', component: 'src/app/contact/page.tsx' },
  { path: '/privacy', id: 'privacy', label: 'Privacy Policy', component: 'src/app/privacy/page.tsx' },
  { path: '/terms', id: 'terms', label: 'Terms of Service', component: 'src/app/terms/page.tsx' },
  { path: '/disclaimer', id: 'disclaimer', label: 'Health Disclaimer', component: 'src/app/disclaimer/page.tsx' },
  { path: '/admin', id: 'admin', label: 'Admin Health & Sync', component: 'src/app/admin/page.tsx' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

async function runForensics() {
  console.log('--- STARTING COMPLETE BROWSER FORENSICS RUN ---');
  const browser = await chromium.launch({ headless: true });
  const forensicsData = {
    timestamp: new Date().toISOString(),
    routesChecked: [],
    tokens: {},
    modalInteractions: [],
    componentMap: [],
  };

  for (const vp of viewports) {
    console.log(`\n=== VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const r of routes) {
      const url = `http://localhost:3000${r.path}`;
      try {
        console.log(`Navigating [${vp.name}] -> ${url}`);
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 35000 });
        await page.waitForTimeout(400);

        const status = response ? response.status() : 0;
        const pageTitle = await page.title();

        // 1. Capture Full Page Screenshot
        const screenshotName = `${r.id}-${vp.name}-full.png`;
        const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Forensics extraction on desktop
        if (vp.name === 'desktop') {
          const domForensics = await page.evaluate(() => {
            function getStyles(el) {
              const cs = window.getComputedStyle(el);
              return {
                fontFamily: cs.fontFamily,
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                color: cs.color,
                backgroundColor: cs.backgroundColor,
                borderRadius: cs.borderRadius,
                boxShadow: cs.boxShadow,
                padding: cs.padding,
                margin: cs.margin,
                display: cs.display,
                width: `${el.offsetWidth}px`,
                height: `${el.offsetHeight}px`,
              };
            }

            // Extract sections
            const sectionEls = Array.from(document.querySelectorAll('header, nav, main, section, footer, [role="region"], aside'));
            const sections = sectionEls.map((s, idx) => {
              const rect = s.getBoundingClientRect();
              return {
                index: idx,
                tag: s.tagName.toLowerCase(),
                id: s.id || null,
                className: (s.className && typeof s.className === 'string') ? s.className.slice(0, 100) : '',
                rect: {
                  top: Math.round(rect.top + window.scrollY),
                  left: Math.round(rect.left),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                },
                heading: s.querySelector('h1, h2, h3')?.innerText?.trim().slice(0, 120) || null,
                styleSummary: getStyles(s),
              };
            });

            // Extract images and assets
            const imgEls = Array.from(document.querySelectorAll('img, svg'));
            const assets = imgEls.slice(0, 30).map(img => {
              if (img.tagName.toLowerCase() === 'img') {
                return {
                  type: 'img',
                  src: img.getAttribute('src'),
                  alt: img.getAttribute('alt') || '',
                  width: img.offsetWidth,
                  height: img.offsetHeight,
                };
              } else {
                return {
                  type: 'svg',
                  className: img.getAttribute('class') || '',
                  ariaLabel: img.getAttribute('aria-label') || '',
                  width: img.clientWidth,
                  height: img.clientHeight,
                };
              }
            });

            // Extract buttons and CTAs
            const buttonEls = Array.from(document.querySelectorAll('button, a.btn-chunky, a[role="button"]'));
            const buttons = buttonEls.slice(0, 25).map(b => ({
              tag: b.tagName.toLowerCase(),
              text: b.innerText?.trim().slice(0, 50),
              className: (b.className && typeof b.className === 'string') ? b.className : '',
              styles: getStyles(b),
            }));

            // Extract visible typography headings and paragraphs
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).slice(0, 15).map(h => ({
              level: h.tagName.toLowerCase(),
              text: h.innerText?.trim().slice(0, 150),
              styles: getStyles(h),
            }));

            // Content text preview
            const bodyText = document.body.innerText?.slice(0, 1000);

            return {
              sections,
              assets,
              buttons,
              headings,
              bodyText,
            };
          });

          forensicsData.routesChecked.push({
            route: r.path,
            id: r.id,
            label: r.label,
            sourceFile: r.component,
            status,
            pageTitle,
            desktopScreenshot: screenshotName,
            domForensics,
          });
        }
      } catch (err) {
        console.error(`Error inspecting ${url} on ${vp.name}:`, err.message);
      }
    }

    // Special Modal & State Inspections (on Desktop & Mobile)
    if (vp.name === 'desktop') {
      console.log('\n--- TESTING DESKTOP MODALS & INTERACTIVE STATES ---');
      try {
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        // 1. Language Modal
        const langBtn = page.locator('button[aria-label*="language" i], button:has-text("English"), button:has-text("हिन्दी")').first();
        if (await langBtn.isVisible()) {
          console.log('Triggering Language Modal...');
          await langBtn.click();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'modal-language-selector.png') });
          const modalData = await page.evaluate(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal ? { title: modal.querySelector('h2, h3')?.innerText, text: modal.innerText.slice(0, 300) } : null;
          });
          forensicsData.modalInteractions.push({ name: 'LanguageSelectorModal', data: modalData });
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }

        // 2. Cart Drawer
        const cartBtn = page.locator('button[aria-label*="cart" i], button[aria-label*="basket" i], button:has-text("Basket")').first();
        if (await cartBtn.isVisible()) {
          console.log('Triggering Cart Drawer...');
          await cartBtn.click();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'drawer-cart.png') });
          const drawerData = await page.evaluate(() => {
            const drawer = document.querySelector('[role="dialog"], aside.cart-drawer, .fixed.inset-y-0.right-0');
            return drawer ? { title: drawer.querySelector('h2, h3')?.innerText, text: drawer.innerText.slice(0, 300) } : null;
          });
          forensicsData.modalInteractions.push({ name: 'CartDrawer', data: drawerData });
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }

        // 3. Fitness Calculator Interactive Switch
        console.log('Navigating to Fitness Calculators to test tabs...');
        await page.goto('http://localhost:3000/fitness-calculators', { waitUntil: 'networkidle' });
        const tabs = ['BMI Calculator', 'Body Fat %', 'TDEE & Calorie Burn', 'Macro Split Calculator', 'Ideal Body Weight'];
        for (const tab of tabs) {
          const tabBtn = page.locator(`button:has-text("${tab}")`).first();
          if (await tabBtn.isVisible()) {
            await tabBtn.click();
            await page.waitForTimeout(200);
            const slug = tab.toLowerCase().replace(/[^a-z0-9]/g, '-');
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, `fitness-tab-${slug}.png`) });
          }
        }
      } catch (err) {
        console.warn('Modal test note:', err.message);
      }
    }

    if (vp.name === 'mobile') {
      console.log('\n--- TESTING MOBILE NAVIGATION DRAWER & STATES ---');
      try {
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
        const menuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i]').first();
        if (await menuBtn.isVisible()) {
          console.log('Triggering Mobile Menu...');
          await menuBtn.click();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'nav-mobile-menu-open.png') });
          const menuData = await page.evaluate(() => {
            const menu = document.querySelector('[role="dialog"], nav.mobile-nav, .fixed.inset-0');
            return menu ? { text: menu.innerText.slice(0, 300) } : null;
          });
          forensicsData.modalInteractions.push({ name: 'MobileNavMenu', data: menuData });
        }
      } catch (err) {
        console.warn('Mobile nav test note:', err.message);
      }
    }

    await context.close();
  }

  // Extract CSS Design Tokens from root
  const tokenContext = await browser.newContext();
  const tokenPage = await tokenContext.newPage();
  await tokenPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  const rootTokens = await tokenPage.evaluate(() => {
    const cs = window.getComputedStyle(document.documentElement);
    const tokenNames = [
      '--ink', '--cream', '--leaf', '--mint', '--mango', '--tomato', '--berry', '--sky', '--bubblegum',
      '--surface', '--surface-alt', '--font-display', '--font-body', '--radius-sm', '--radius-md',
      '--radius-lg', '--radius-pill', '--shadow-hard', '--shadow-hard-hover', '--shadow-hard-press',
      '--ease-spring', '--motion-fast', '--motion-med', '--motion-slow', '--nav-height',
      '--z-elevated', '--z-sticky', '--z-header', '--z-floating-chat', '--z-bottom-nav', '--z-drawer', '--z-modal', '--z-toast'
    ];
    const out = {};
    for (const name of tokenNames) {
      out[name] = cs.getPropertyValue(name).trim();
    }
    return out;
  });
  forensicsData.tokens = rootTokens;
  await tokenContext.close();

  await browser.close();

  // Save forensics data
  const jsonPath = path.join(process.cwd(), 'docs', 'forensics_data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(forensicsData, null, 2), 'utf8');
  console.log(`\n✓ Forensics data saved to ${jsonPath}`);
  console.log(`✓ Screenshots saved to ${SCREENSHOT_DIR}`);
  console.log('--- FORENSICS RUN COMPLETE ---');
}

runForensics().catch(err => {
  console.error('Fatal forensics error:', err);
  process.exit(1);
});
