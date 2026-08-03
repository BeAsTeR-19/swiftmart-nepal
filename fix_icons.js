const fs = require('fs');
const htmlFiles = ['index.html', 'shop.html', 'cart.html', 'product.html', 'order-tracking.html', 'about.html', 'checkout.html'];

for (const file of htmlFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace COD image
    content = content.replace(/https:\/\/cdn-icons-png\.flaticon\.com\/128\/1554\/1554406\.png/g, 'assets/images/cod.svg');
    
    // Replace Bank image
    content = content.replace(/https:\/\/cdn-icons-png\.flaticon\.com\/128\/2830\/2830284\.png/g, 'assets/images/bank.svg');
    
    fs.writeFileSync(file, content);
  }
}
console.log('Payment icons updated to local SVGs!');
