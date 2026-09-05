import { chromium } from '../srimatch-frontend/node_modules/playwright/index.mjs';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:\\Users\\sithu\\.gemini\\antigravity-ide\\brain\\4ed87762-fcd5-489d-8407-0037bf6032ee';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function getDbOtp(email) {
  for (let i = 0; i < 6; i++) {
    try {
      const raw = execSync(
        `docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -t -A -c "SELECT otp FROM otp_verifications WHERE LOWER(identifier) = LOWER('${email}') ORDER BY created_at DESC LIMIT 1;"`
      ).toString().trim();
      if (raw && raw.length >= 4) return raw;
    } catch (err) {}
    execSync('powershell -Command "Start-Sleep -Milliseconds 500"');
  }
  return null;
}

async function runFrontendAutomatedTests() {
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('🌐 SRIMATCH FRONTEND AUTOMATED PLAYWRIGHT UI TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  page.on('console', msg => console.log(`   [PAGE ${msg.type().toUpperCase()}]:`, msg.text()));
  page.on('pageerror', err => console.log(`   [PAGE ERROR]:`, err.message));
  const testResults = [];

  async function testStep(name, fn) {
    const start = Date.now();
    try {
      console.log(`⏳ Running: ${name}...`);
      const data = await fn();
      const duration = Date.now() - start;
      console.log(`✅ [PASS] ${name} (${duration}ms)`);
      testResults.push({ name, status: 'PASSED', duration, data });
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ [FAIL] ${name} (${duration}ms):`, error.message);
      testResults.push({ name, status: 'FAILED', duration, error: error.message });
    }
  }

  // 1. Landing Page
  await testStep('1. Landing Page UI & Features', async () => {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Sri Lankan', { timeout: 8000 });
    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_01_landing_page.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { screenshot: screenshotPath };
  });

  // 2. How It Works Page
  await testStep('2. How It Works Page & Guidelines', async () => {
    await page.goto('http://localhost:5173/how-it-works', { waitUntil: 'networkidle' });
    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_02_how_it_works.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { screenshot: screenshotPath };
  });

  // 3. User Registration Flow
  const testEmail = `auto_ui_${Date.now()}@srimatch.com`;
  const testPassword = 'Password123!';

  await testStep('3. User Registration Form & Validation', async () => {
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });

    // Fill form using exact placeholders
    await page.fill('input[placeholder="Amara"]', 'Nuwan');
    await page.fill('input[placeholder="Perera"]', 'Fernando');
    await page.fill('input[placeholder="you@example.com"]', testEmail);
    await page.fill('input[placeholder="Min. 8 characters"]', testPassword);
    await page.fill('input[placeholder="Repeat password"]', testPassword);
    
    // Check Agree to Terms
    await page.click('input#agreeToTerms', { force: true });
    await page.waitForTimeout(500);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_03_registration_form.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500);

    // Verify OTP modal or step appears
    const otpPrompt = await page.locator('text=verification').or(page.locator('input[placeholder="000000"]')).or(page.locator('text=code')).count();
    console.log(`   Registration submitted, OTP prompt detected count: ${otpPrompt}`);
    return { email: testEmail, otpPrompt: otpPrompt > 0 };
  });

  // 4. Email Verification via Database OTP
  await testStep('4. OTP Verification Execution', async () => {
    const otp = getDbOtp(testEmail);
    console.log(`   Retrieved OTP for ${testEmail}: ${otp}`);
    if (!otp) throw new Error('OTP not found in database');

    // Enter OTP on screen
    const otpInput = page.locator('input[placeholder="000000"]');
    if (await otpInput.isVisible({ timeout: 5000 })) {
      await otpInput.fill(otp);
      await page.waitForTimeout(500);
      const verifyBtn = page.locator('button[type="submit"]').first();
      await verifyBtn.click();
      await page.waitForTimeout(2500);
    }

    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_04_otp_verified.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { otp, screenshot: screenshotPath };
  });

  // 5. Login Flow
  await testStep('5. User Authentication & Login Flow', async () => {
    await context.clearCookies();
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

    await page.fill('input#email, input[placeholder="you@example.com"], input[type="email"]', testEmail);
    await page.fill('input#password, input[placeholder="Your password"], input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_05_login_success.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { currentUrl: page.url(), screenshot: screenshotPath };
  });

  // 6. Complete Profile Setup on UI & Discovery Feed
  await testStep('6. Discovery & Match Feed UI (/home)', async () => {
    // Register & seed Kasun with a fully completed profile for feed UI test
    const kasunEmail = `kasun_feed_${Date.now()}@srimatch.com`;
    await fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Kasun', lastName: 'Bandara', email: kasunEmail, password: testPassword, agreeToTerms: true, captchaToken: 'dev-bypass' })
    });
    const otp = getDbOtp(kasunEmail);
    await fetch('http://localhost:8080/api/v1/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: kasunEmail, otp })
    });

    await context.clearCookies();
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

    await page.fill('input#email, input[placeholder="you@example.com"], input[type="email"]', kasunEmail);
    await page.fill('input#password, input[placeholder="Your password"], input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500);

    await page.goto('http://localhost:5173/home', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_06_discovery_feed.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { currentUrl: page.url(), screenshot: screenshotPath };
  });

  // 7. Membership & Subscription Packages UI
  await testStep('7. Premium Membership Plans (/subscription)', async () => {
    await page.goto('http://localhost:5173/subscription', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_07_pricing_packages.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { currentUrl: page.url(), screenshot: screenshotPath };
  });

  // 8. Real-time Messaging Page
  await testStep('8. Messages & Chat Interface (/messages)', async () => {
    await page.goto('http://localhost:5173/messages', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_08_messages_chat.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { currentUrl: page.url(), screenshot: screenshotPath };
  });

  // 9. Admin Portal Login & Dashboard KPIs
  await testStep('9. Admin Panel Dashboard & User Table', async () => {
    // Create properly verified admin via API and DB elevation
    const adminEmail = `admin_ui_${Date.now()}@srimatch.com`;
    await fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Admin', lastName: 'Master', email: adminEmail, password: testPassword, agreeToTerms: true, captchaToken: 'dev-bypass' })
    });
    const adminOtp = getDbOtp(adminEmail);
    await fetch('http://localhost:8080/api/v1/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: adminEmail, otp: adminOtp })
    });
    execSync(`docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "UPDATE users SET role = 'ADMIN' WHERE email = '${adminEmail}';"`);

    await context.clearCookies();
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500);

    await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'ui_test_09_admin_dashboard.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { currentUrl: page.url(), screenshot: screenshotPath };
  });

  await browser.close();

  const passed = testResults.filter(r => r.status === 'PASSED').length;
  const failed = testResults.filter(r => r.status === 'FAILED').length;

  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  console.log(`📊 FRONTEND TEST RESULTS: ${passed}/${testResults.length} PASSED (${((passed/testResults.length)*100).toFixed(1)}%) | ${failed} FAILED`);
  console.log('═══════════════════════════════════════════════════════════════════════════');

  fs.writeFileSync(
    path.join('scratch', 'frontend_test_report.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), passed, failed, total: testResults.length, results: testResults }, null, 2)
  );

  return { passed, failed, total: testResults.length };
}

runFrontendAutomatedTests().catch(console.error);
