const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR STACK:', error.stack));
  
  try {
    await page.goto('http://localhost:8080');
    await new Promise(r => setTimeout(r, 1000));
  } catch (err) {
    console.error("Failed to load page:", err);
  } finally {
    await browser.close();
  }
})();
