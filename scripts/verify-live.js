// verify-live.js — Playwright live verification for renderforge.zwart.qzz.io
// Checks all routes for 200, 0 console errors, 0 pageerrors

const { chromium } = require('playwright');

const BASE = 'https://renderforge.zwart.qzz.io';
const ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/dashboard',
  '/analytics',
  '/export',
  '/gallery',
  '/graph',
  '/playground',
  '/finance',
  '/settings',
  '/auth/logout',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalErrors = 0;
  let totalPageErrors = 0;
  let failedRoutes = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`  CONSOLE ERROR: ${msg.text()}`);
      totalErrors++;
    }
  });

  page.on('pageerror', err => {
    console.log(`  PAGE ERROR: ${err.message}`);
    totalPageErrors++;
  });

  for (const route of ROUTES) {
    const url = BASE + route;
    console.log(`\nChecking: ${url}`);
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const status = response ? response.status() : 0;
      console.log(`  Status: ${status}`);

      if (status !== 200) {
        failedRoutes.push(`${route} — HTTP ${status}`);
      }

      // Wait a bit for any delayed errors
      await page.waitForTimeout(1000);
    } catch (err) {
      console.log(`  FAILED: ${err.message}`);
      failedRoutes.push(`${route} — ${err.message}`);
    }
  }

  await browser.close();

  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log(`Routes checked: ${ROUTES.length}`);
  console.log(`Console errors: ${totalErrors}`);
  console.log(`Page errors: ${totalPageErrors}`);
  console.log(`Failed routes: ${failedRoutes.length}`);

  if (failedRoutes.length > 0) {
    console.log('\nFailed routes:');
    failedRoutes.forEach(r => console.log(`  - ${r}`));
  }

  if (totalErrors === 0 && totalPageErrors === 0 && failedRoutes.length === 0) {
    console.log('\n✅ VERIFY_PASS — All routes OK, 0 errors');
    process.exit(0);
  } else {
    console.log('\n❌ VERIFY_FAIL — Errors found');
    process.exit(1);
  }
})();
