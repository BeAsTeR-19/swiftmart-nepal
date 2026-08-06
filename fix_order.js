const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('file:///Users/ujjwaldhungana/SwiftMart-Admin/index.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 5000));
  
  await page.evaluate(async () => {
    console.log("Fetching products in Admin...");
    let products = window.PRODUCTS;
    if (!products || products.length === 0) {
       products = await window.SM.getProducts();
    }
    console.log("Total products:", products.length);
    
    for (const p of products) {
      console.log("Found product:", p.name);
      const name = p.name.toLowerCase();
      let newOrder = p.displayOrder || 0;
      let changed = false;
      
      if (name.includes("rice cooker")) {
         newOrder = 100; changed = true;
      } else if (name.includes("2-burner") || name.includes("hot plate") || name.includes("hotplate")) {
         newOrder = 100; changed = true;
      } else if (name.includes("pointer") || name.includes("air fryer")) {
         newOrder = -10; changed = true;
      } else if (name.includes("daisuke") || name.includes("induction cooker")) {
         newOrder = -10; changed = true;
      }
      
      if (changed && p.displayOrder !== newOrder) {
         console.log(`Updating ${p.name} to order ${newOrder}...`);
         await window.SM.updateProduct(p.id, { ...p, displayOrder: newOrder });
         console.log(`Updated ${p.name}`);
      }
    }
  });
  
  await browser.close();
  console.log("Done!");
})();
