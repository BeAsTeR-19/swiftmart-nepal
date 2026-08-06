const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('file:///Users/ujjwaldhungana/SwiftMart/index.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const btn = document.querySelector('.pc-wish');
    if (btn) {
      console.log('Found button, clicking it!');
      btn.click();
    } else {
      console.log('No .pc-wish button found!');
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const wishlist = await page.evaluate(() => localStorage.getItem('sm_wishlist'));
  console.log('Wishlist in localstorage:', wishlist);
  
  await browser.close();
})();
