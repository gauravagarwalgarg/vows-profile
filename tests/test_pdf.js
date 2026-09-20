const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  console.log('Page loaded');
  await page.click('#btn-download-main');
  console.log('Clicked download main');
  await page.evaluate(() => {
    document.querySelector('[data-format="pdf"]').click();
  });
  console.log('Clicked PDF option');
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
