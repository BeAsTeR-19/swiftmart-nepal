const fs = require('fs');

const files = ['index.html', 'product.html', 'shop.html', 'cart.html', 'checkout.html', 'about.html', 'admin.html'];

for (let file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace hardcoded text
    content = content.replace(/Free delivery inside Kathmandu valley on orders over Rs 2,000/g, 'Free delivery everywhere on orders over Rs 3,000');
    content = content.replace(/Kathmandu valley in 1-2 days\./g, 'Kathmandu valley in 1 day.');
    content = content.replace(/Free delivery over Rs 2,000/g, 'Free delivery over Rs 3,000');
    
    // about.html specifics
    content = content.replace(/1-2 days \(Rs 100 fee\)/g, '1 day (Rs 100 fee)');
    content = content.replace(/On orders over Rs 2,000 inside the valley!/g, 'On orders over Rs 3,000 everywhere!');
    content = content.replace(/We deliver within 1-2 days inside the Kathmandu Valley/g, 'We deliver within 1 day inside the Kathmandu Valley');
    
    // cart.html / checkout.html logic
    content = content.replace(/if \(isInside && subtotal >= settings\.freeDeliveryThreshold\)/g, 'if (subtotal >= settings.freeDeliveryThreshold)');
    content = content.replace(/if \(isInside && subtotalVal >= settings\.freeDeliveryThreshold\)/g, 'if (subtotalVal >= settings.freeDeliveryThreshold)');
    
    fs.writeFileSync(file, content);
  }
}

// Update data.js
let dataJs = fs.readFileSync('assets/js/data.js', 'utf-8');
dataJs = dataJs.replace(/Free delivery inside Kathmandu valley on orders over Rs 2,000/g, 'Free delivery everywhere on orders over Rs 3,000');
dataJs = dataJs.replace(/freeDeliveryThreshold: 2000/g, 'freeDeliveryThreshold: 3000');
dataJs = dataJs.replace(/valleyDeliveryDays: '1-2'/g, "valleyDeliveryDays: '1'");

// Add migration block right after defaultSettings definition
const migrationBlock = `
// Migrate old settings seamlessly
let _existingSettings = JSON.parse(localStorage.getItem(sm_keys.settings) || 'null');
if (_existingSettings && _existingSettings.freeDeliveryThreshold === 2000) {
  _existingSettings.freeDeliveryThreshold = 3000;
  _existingSettings.announcement = 'Free delivery everywhere on orders over Rs 3,000';
  _existingSettings.valleyDeliveryDays = '1';
  localStorage.setItem(sm_keys.settings, JSON.stringify(_existingSettings));
}
`;

if (!dataJs.includes('Migrate old settings seamlessly')) {
  dataJs = dataJs.replace(/const defaultSettings = \{[\s\S]*?\};\n/, match => match + migrationBlock);
}

fs.writeFileSync('assets/js/data.js', dataJs);

console.log('Delivery text and logic updated!');
