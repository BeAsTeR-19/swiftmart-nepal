const fs = require('fs');
const htmlFiles = ['index.html', 'shop.html', 'cart.html', 'product.html', 'order-tracking.html', 'about.html', 'checkout.html'];

for (const file of htmlFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    content = content.replace(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/f\/f3\/Esewa_logo\.webp/g, 'assets/images/esewa.png');
    
    fs.writeFileSync(file, content);
  }
}
console.log('eSewa URL fixed!');
