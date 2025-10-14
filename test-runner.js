// Simple test runner for login functionality
const puppeteer = require('puppeteer');

async function runLoginTests() {
  console.log('🚀 Starting Login Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Test 1: Load the login page
    console.log('📄 Test 1: Loading login page...');
    try {
      await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle0', timeout: 10000 });
      console.log('✅ Login page loaded successfully');
    } catch (error) {
      console.log('❌ Failed to load login page:', error.message);
      return;
    }
    
    // Test 2: Check if form elements are present
    console.log('\n📝 Test 2: Checking form elements...');
    const usernameField = await page.$('#username');
    const passwordField = await page.$('#password');
    const submitButton = await page.$('button[type="submit"]');
    
    if (usernameField && passwordField && submitButton) {
      console.log('✅ All form elements found');
    } else {
      console.log('❌ Missing form elements');
      return;
    }
    
    // Test 3: Test form validation
    console.log('\n🔍 Test 3: Testing form validation...');
    
    // Test empty form submission
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    const errorMessages = await page.$$('[role="alert"], .text-destructive');
    if (errorMessages.length > 0) {
      console.log('✅ Form validation working - errors shown for empty form');
    } else {
      console.log('❌ Form validation not working');
    }
    
    // Test 4: Test valid form input
    console.log('\n✏️ Test 4: Testing valid form input...');
    
    await page.type('#username', 'user@example.com');
    await page.type('#password', 'password123');
    
    const isSubmitEnabled = await page.evaluate(() => {
      const button = document.querySelector('button[type="submit"]');
      return !button.disabled;
    });
    
    if (isSubmitEnabled) {
      console.log('✅ Submit button enabled with valid input');
    } else {
      console.log('❌ Submit button not enabled with valid input');
    }
    
    // Test 5: Test password visibility toggle
    console.log('\n👁️ Test 5: Testing password visibility toggle...');
    
    const passwordTypeBefore = await page.evaluate(() => {
      return document.querySelector('#password').type;
    });
    
    await page.click('button[aria-label="Show password"]');
    await page.waitForTimeout(500);
    
    const passwordTypeAfter = await page.evaluate(() => {
      return document.querySelector('#password').type;
    });
    
    if (passwordTypeBefore === 'password' && passwordTypeAfter === 'text') {
      console.log('✅ Password visibility toggle working');
    } else {
      console.log('❌ Password visibility toggle not working');
    }
    
    // Test 6: Test remember me checkbox
    console.log('\n☑️ Test 6: Testing remember me checkbox...');
    
    await page.click('#remember');
    const isRememberChecked = await page.evaluate(() => {
      return document.querySelector('#remember').checked;
    });
    
    if (isRememberChecked) {
      console.log('✅ Remember me checkbox working');
    } else {
      console.log('❌ Remember me checkbox not working');
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Check if puppeteer is available, if not provide instructions
try {
  runLoginTests();
} catch (error) {
  console.log('❌ Puppeteer not found. Please install it first:');
  console.log('npm install puppeteer');
  console.log('\nOr run the Cypress tests instead:');
  console.log('npx cypress open');
}
