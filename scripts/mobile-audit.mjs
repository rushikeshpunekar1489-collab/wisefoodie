import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve('docs/mobile-audit/before');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'explore', path: '/explore' },
  { name: 'explore_dairy', path: '/explore/dairy-frozen' },
  { name: 'food_long_name', path: '/food/itc-aashirvaad-natures-super-foods-multigrain-flour' },
  { name: 'food_dairy', path: '/food/amul-gold-milk' },
  { name: 'food_cookies', path: '/food/amul-oats-and-honey-cookies' },
  { name: 'food_butter', path: '/food/amul-butter' },
  { name: 'food_sweet', path: '/food/amul-mithai-mate' },
  { name: 'search', path: '/search?q=milk' },
  { name: 'compare', path: '/compare' },
  { name: 'scanner', path: '/scanner' },
  { name: 'learn', path: '/learn' },
  { name: 'learn_topic', path: '/learn/labels' },
  { name: 'favourites', path: '/favourites' },
  { name: 'cart', path: '/cart' },
  { name: 'diary', path: '/diary' },
  { name: 'ask', path: '/ask' },
  { name: 'about', path: '/about' },
  { name: 'how_fbs_works', path: '/how-fbs-works' },
  { name: 'privacy', path: '/privacy' },
  { name: 'terms', path: '/terms' },
  { name: 'disclaimer', path: '/disclaimer' },
  { name: 'contact', path: '/contact' },
  { name: '404', path: '/non-existent-page-test-404' }
];

const VIEWPORTS = [
  { width: 320, height: 568, name: '320x568', isLandscape: false, dpr: 2 },
  { width: 568, height: 320, name: '568x320_landscape', isLandscape: true, dpr: 2 },
  { width: 360, height: 640, name: '360x640', isLandscape: false, dpr: 2 },
  { width: 640, height: 360, name: '640x360_landscape', isLandscape: true, dpr: 2 },
  { width: 360, height: 800, name: '360x800', isLandscape: false, dpr: 2 },
  { width: 800, height: 360, name: '800x360_landscape', isLandscape: true, dpr: 2 },
  { width: 375, height: 667, name: '375x667', isLandscape: false, dpr: 2 },
  { width: 667, height: 375, name: '667x375_landscape', isLandscape: true, dpr: 2 },
  { width: 375, height: 812, name: '375x812', isLandscape: false, dpr: 3 },
  { width: 812, height: 375, name: '812x375_landscape', isLandscape: true, dpr: 3 },
  { width: 390, height: 844, name: '390x844', isLandscape: false, dpr: 3 },
  { width: 844, height: 390, name: '844x390_landscape', isLandscape: true, dpr: 3 },
  { width: 393, height: 873, name: '393x873', isLandscape: false, dpr: 2.75 },
  { width: 873, height: 393, name: '873x393_landscape', isLandscape: true, dpr: 2.75 },
  { width: 412, height: 915, name: '412x915', isLandscape: false, dpr: 2.625 },
  { width: 915, height: 412, name: '915x412_landscape', isLandscape: true, dpr: 2.625 },
  { width: 430, height: 932, name: '430x932', isLandscape: false, dpr: 3 },
  { width: 932, height: 430, name: '932x430_landscape', isLandscape: true, dpr: 3 },
  { width: 768, height: 1024, name: '768x1024_tablet', isLandscape: false, dpr: 2 },
  { width: 1024, height: 768, name: '1024x768_desktop', isLandscape: true, dpr: 2 }
];

async function runAudit() {
  console.log(`Starting Mobile Audit across ${ROUTES.length} routes and ${VIEWPORTS.length} viewports...`);
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allIssues = [];
  const tasks = [];
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      tasks.push({ route, vp });
    }
  }

  console.log(`Total test matrix tasks: ${tasks.length}`);
  const CONCURRENCY = 4;
  let completed = 0;

  async function worker(id) {
    while (tasks.length > 0) {
      const { route, vp } = tasks.shift();
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
        hasTouch: true,
        isMobile: vp.width <= 500 || vp.height <= 500,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      });

      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      const url = `${BASE_URL}${route.path}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(400);

        const auditResult = await page.evaluate(({ vpWidth, vpHeight }) => {
          const docEl = document.documentElement;
          const body = document.body;
          const docScrollWidth = docEl.scrollWidth;
          const bodyScrollWidth = body ? body.scrollWidth : 0;
          const clientWidth = docEl.clientWidth;
          const hasHorizontalOverflow = docScrollWidth > clientWidth + 1 || bodyScrollWidth > clientWidth + 1;

          const overflowingElements = [];
          const allEls = Array.from(document.querySelectorAll('*'));
          for (const el of allEls) {
            const rect = el.getBoundingClientRect();
            if (rect.width > clientWidth + 1 || rect.right > clientWidth + 1) {
              let parent = el.parentElement;
              let insideScroll = false;
              while (parent && parent !== document.body && parent !== docEl) {
                const style = window.getComputedStyle(parent);
                if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
                  insideScroll = true;
                  break;
                }
                parent = parent.parentElement;
              }
              if (!insideScroll && el.offsetWidth > 0 && el.offsetHeight > 0) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className || '').toString().slice(0, 80);
                const id = el.id ? `#${el.id}` : '';
                const text = (el.innerText || '').slice(0, 30).replace(/\n/g, ' ');
                overflowingElements.push({
                  selector: `${tag}${id}${cls ? '.' + cls.split(' ').filter(Boolean).slice(0, 3).join('.') : ''}`,
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  text
                });
              }
            }
          }

          const vpMeta = document.querySelector('meta[name="viewport"]');
          const vpMetaContent = vpMeta ? vpMeta.getAttribute('content') : null;
          const hasViewportFit = vpMetaContent ? vpMetaContent.includes('viewport-fit=cover') : false;
          const hasDisabledZoom = vpMetaContent ? (vpMetaContent.includes('user-scalable=no') || vpMetaContent.includes('maximum-scale=1')) : false;

          const smallTapTargets = [];
          const clickables = Array.from(document.querySelectorAll('a, button, input, select, [role="button"]'));
          for (const el of clickables) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.top < vpHeight && rect.bottom > 0) {
              if (rect.width < 44 || rect.height < 44) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className || '').toString().slice(0, 50);
                const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').slice(0, 25);
                smallTapTargets.push({
                  tag,
                  cls,
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                  text
                });
              }
            }
          }

          const smallInputs = [];
          const inputs = Array.from(document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea'));
          for (const inp of inputs) {
            const style = window.getComputedStyle(inp);
            const fontSize = parseFloat(style.fontSize);
            if (fontSize < 16) {
              smallInputs.push({
                placeholder: inp.getAttribute('placeholder') || inp.getAttribute('name') || '',
                fontSize
              });
            }
          }

          const smallTextNodes = [];
          const textEls = Array.from(document.querySelectorAll('p, li, span.description, .card-text'));
          for (const tEl of textEls) {
            const style = window.getComputedStyle(tEl);
            const fs = parseFloat(style.fontSize);
            if (fs < 14 && (tEl.innerText || '').trim().length > 30) {
              smallTextNodes.push({
                fs,
                text: (tEl.innerText || '').slice(0, 30)
              });
            }
          }

          const bottomNav = document.querySelector('.bottom-nav');
          const chatBtn = document.querySelector('aside button[aria-label*="Ask"]');
          let navOverlap = false;
          if (bottomNav && chatBtn) {
            const navRect = bottomNav.getBoundingClientRect();
            const chatRect = chatBtn.getBoundingClientRect();
            if (chatRect.bottom >= navRect.top && chatRect.top <= navRect.bottom) {
              navOverlap = true;
            }
          }

          return {
            docScrollWidth,
            clientWidth,
            hasHorizontalOverflow,
            overflowingElements: overflowingElements.slice(0, 8),
            vpMetaContent,
            hasViewportFit,
            hasDisabledZoom,
            smallTapTargets: smallTapTargets.slice(0, 10),
            smallInputs,
            smallTextNodes: smallTextNodes.slice(0, 8),
            navOverlap
          };
        }, { vpWidth: vp.width, vpHeight: vp.height });

        const screenshotFileName = `${route.name}__${vp.name}.png`;
        const screenshotPath = path.join(OUTPUT_DIR, screenshotFileName);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        allIssues.push({
          route: route.name,
          path: route.path,
          viewport: vp.name,
          width: vp.width,
          height: vp.height,
          isLandscape: vp.isLandscape,
          screenshot: `docs/mobile-audit/before/${screenshotFileName}`,
          consoleErrors,
          ...auditResult
        });
      } catch (err) {
        console.error(`Error auditing ${route.name} @ ${vp.name}:`, err.message);
      } finally {
        await context.close();
        completed++;
        if (completed % 40 === 0 || completed === 480) {
          console.log(`Progress: ${completed} / 480 completed (${Math.round(completed / 4.8)}%)`);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  await browser.close();

  // Save raw audit data
  fs.writeFileSync('docs/mobile-audit-raw.json', JSON.stringify(allIssues, null, 2), 'utf8');

  // Analyze top worst problems
  const overflowIssues = allIssues.filter(r => r.hasHorizontalOverflow);
  const inputZoomIssues = allIssues.filter(r => r.smallInputs.length > 0);
  const navOverlapIssues = allIssues.filter(r => r.navOverlap);
  const smallTapIssues = allIssues.filter(r => r.smallTapTargets.length > 0);

  console.log(`\n========================================`);
  console.log(`MOBILE AUDIT COMPLETE`);
  console.log(`Total tests run: ${allIssues.length}`);
  console.log(`Horizontal overflow detected: ${overflowIssues.length} instances`);
  console.log(`Inputs < 16px (iOS zoom risk): ${inputZoomIssues.length} instances`);
  console.log(`Bottom nav / Chat button overlap: ${navOverlapIssues.length} instances`);
  console.log(`========================================\n`);

  return allIssues;
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
