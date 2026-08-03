const fs = require('fs');
const htmlFiles = ['index.html', 'shop.html', 'cart.html', 'product.html', 'order-tracking.html', 'about.html'];

for (const file of htmlFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // In header
    // from: <img src="assets/images/logo.jpeg" alt="SwiftMart Nepal Logo" class="logo-img">
    // to: <img src="assets/images/logo.jpeg" alt="SwiftMart Nepal Logo" class="logo-img"> <span class="logo-text">SwiftMart</span>
    content = content.replace(
      /<img src="assets\/images\/logo\.jpeg" alt="SwiftMart Nepal Logo" class="logo-img">\s*<\/a>/,
      `<img src="assets/images/logo.jpeg" alt="SwiftMart Nepal Logo" class="logo-img">\n        <span class="logo-text">SwiftMart</span>\n      </a>`
    );

    // In footer (index.html, etc)
    // from: <img src="assets/images/logo.jpeg" alt="Logo" style="height:32px; border-radius:4px;">
    // to: <img src="assets/images/logo.jpeg" alt="Logo" style="height:32px; border-radius:4px;">
    //     <span style="font-family:var(--font-h); font-weight:800; font-size:18px; letter-spacing:-0.5px; color:#fff;">SwiftMart</span>
    // Note: Actually, in footer, the previous agent might have kept it. Let's only replace the header one if it's missing.

    fs.writeFileSync(file, content);
  }
}
console.log('Logo text restored!');
