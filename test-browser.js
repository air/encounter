#!/usr/bin/env node

/**
 * Browser test using Puppeteer
 * Loads the game and captures console output
 */

const puppeteer = require('puppeteer');

async function testBrowser() {
  console.log('Starting browser test...');

  const browser = await puppeteer.launch({
    headless: false, // Visible mode works on macOS, headless has crashpad issues
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  const page = await browser.newPage();

  // Capture all console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });

    // Print to our console with type prefix
    const prefix = type === 'error' ? '❌ ERROR:' :
      type === 'warning' ? '⚠️  WARN:' :
        type === 'log' ? '📝 LOG:' :
          `[${type}]`;
    console.log(`${prefix} ${text}`);
  });

  // Capture page errors (uncaught exceptions)
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log(`💥 PAGE ERROR: ${error.message}`);
  });

  try {
    // Navigate to the app
    console.log('\nLoading http://localhost:8000/index.html...\n');
    await page.goto('http://localhost:8000/index.html', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Check for errors
    const hasErrors = pageErrors.length > 0 ||
      consoleMessages.some(msg => msg.type === 'error');

    console.log('\n========================================');
    console.log('BROWSER TEST SUMMARY');
    console.log('========================================');
    console.log(`Console messages: ${consoleMessages.length}`);
    console.log(`Page errors: ${pageErrors.length}`);

    if (hasErrors) {
      console.log('\n❌ TEST FAILED - Errors detected\n');

      if (pageErrors.length > 0) {
        console.log('Page Errors:');
        pageErrors.forEach(err => console.log(`  - ${err}`));
      }

      const errorMessages = consoleMessages.filter(msg => msg.type === 'error');
      if (errorMessages.length > 0) {
        console.log('\nConsole Errors:');
        errorMessages.forEach(msg => console.log(`  - ${msg.text}`));
      }

      process.exit(1);
    } else {
      console.log('\n✅ TEST PASSED - No errors detected\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED - Exception during test:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
testBrowser().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
