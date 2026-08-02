const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf-8');

// 1. Link styles.css
if (!html.includes('assets/css/styles.css')) {
  html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/styles.css">\n</head>');
}

// 2. Map variables so it fits the new style
html = html.replace(
  /:root\{[^}]+\}/,
  `:root{
  --crimson: var(--primary, #1a2744);
  --crimson-dark: var(--primary-light, #2a3f66);
  --cream: var(--bg-alt, #f5f5f5);
  --cream2: var(--border, #e5e5e5);
  --gold: var(--accent, #c65d1a);
  --gold-soft: var(--accent-hover, #b35116);
  --ink: var(--text, #1c1c1c);
  --ok: var(--success, #2e7d32);
  --disp: var(--font-h, sans-serif);
  --body: var(--font, sans-serif);
}`
);

// 3. Add Custom Order Button next to Orders heading
html = html.replace(
  '<div><h2>Orders</h2><div class="subtle">Manage customer orders from the storefront.</div></div>',
  '<div><h2>Orders</h2><div class="subtle">Manage customer orders from the storefront.</div></div><button class="btn btn-crimson" onclick="openCustomOrderModal()">+ Create Custom Order</button>'
);

// 4. Update Product Modal HTML in editProduct function
// It currently has:
// <div><label>Stock</label><input type="number" id="fpStock" value="${p ? p.stock : 10}"></div>
// <div><label>Image URL</label><input type="text" id="fpImg" value="${p ? esc(p.image) : ''}"></div>
const oldProductModal = `<div><label>Stock</label><input type="number" id="fpStock" value="\${p ? p.stock : 10}"></div>
      <div><label>Image URL</label><input type="text" id="fpImg" value="\${p ? esc(p.image) : ''}"></div>`;
const newProductModal = `<div><label>Stock & Availability</label>
        <div style="display:flex;gap:10px;align-items:center;">
          <input type="number" id="fpStock" value="\${p ? p.stock : 10}" style="flex:1">
          <label style="margin:0;display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="checkbox" id="fpOutStock" \${p && p.stock < 1 ? 'checked' : ''} style="width:auto;"> Out of stock</label>
        </div>
      </div>
      <div>
        <label>Image (Upload or URL)</label>
        <input type="file" id="fpImgFile" accept="image/*" style="margin-bottom:6px">
        <input type="text" id="fpImg" value="\${p ? esc(p.image) : ''}" placeholder="Or enter Image URL">
      </div>`;
html = html.replace(oldProductModal, newProductModal);

// 5. Update saveProduct function to handle image upload and out of stock
const oldSaveProductStart = `window.saveProduct = function() {
  const id = $('fpId').value;`;
const newSaveProductStart = `window.saveProduct = async function() {
  const id = $('fpId').value;
  let imgVal = $('fpImg').value;
  const fileInput = $('fpImgFile');
  if (fileInput && fileInput.files && fileInput.files[0]) {
    // Read file as data URL
    imgVal = await new Promise(res => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    });
  }`;
html = html.replace(oldSaveProductStart, newSaveProductStart);

const oldSaveProductProps = `stock: parseInt($('fpStock').value),
    image: $('fpImg').value,`;
const newSaveProductProps = `stock: $('fpOutStock').checked ? 0 : parseInt($('fpStock').value),
    image: imgVal,`;
html = html.replace(oldSaveProductProps, newSaveProductProps);

// 6. Add openCustomOrderModal and saveCustomOrder to the script
const customOrderScript = `
window.openCustomOrderModal = function() {
  const prods = PRODUCTS.map(p => \`<option value="\${p.id}">\${esc(p.name)} - \${SM.formatPrice(p.price)}</option>\`).join('');
  openModal(\`
    <h3>Create Custom Order</h3>
    <div class="row2">
      <div><label>Customer Name</label><input type="text" id="coName"></div>
      <div><label>Phone Number</label><input type="text" id="coPhone"></div>
    </div>
    <div class="row2">
      <div><label>City</label><input type="text" id="coCity" value="Kathmandu"></div>
      <div><label>Zone</label>
        <select id="coZone">
          <option value="Inside Kathmandu Valley">Inside Kathmandu Valley</option>
          <option value="Outside Valley">Outside Valley</option>
        </select>
      </div>
    </div>
    <label>Address</label><input type="text" id="coAddress">
    <label>Product</label>
    <div style="display:flex;gap:10px;">
      <select id="coProd" style="flex:1">\${prods}</select>
      <input type="number" id="coQty" value="1" min="1" style="width:80px" title="Quantity">
    </div>
    <div class="foot" style="margin-top:16px;">
      <button class="btn btn-crimson" onclick="saveCustomOrder()">Create Order</button>
    </div>
  \`);
};

window.saveCustomOrder = function() {
  const name = $('coName').value;
  const phone = $('coPhone').value;
  const city = $('coCity').value;
  const zone = $('coZone').value;
  const address = $('coAddress').value;
  const prodId = $('coProd').value;
  const qty = parseInt($('coQty').value) || 1;
  
  if(!name || !phone || !address) return toast('Fill all customer details');
  
  const p = PRODUCTS.find(x => x.id === prodId);
  if(!p) return toast('Product not found');
  
  const item = {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    quantity: qty
  };
  
  const s = SM.getSettings();
  const subtotal = p.price * qty;
  let deliveryFee = 0;
  if (subtotal < s.freeDeliveryThreshold) {
    deliveryFee = zone === 'Inside Kathmandu Valley' ? s.deliveryFeeInside : s.deliveryFeeOutside;
  }
  
  const order = {
    id: 'ORD' + Date.now().toString().slice(-6),
    date: Date.now(),
    customer: { name, phone, zone, city, address, note: 'Custom Order' },
    payment: { method: 'Cash on Delivery', status: 'pending' },
    items: [item],
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    total: subtotal + deliveryFee,
    status: 'placed'
  };
  
  let orders = SM.getOrders();
  orders.push(order);
  localStorage.setItem('sm_orders', JSON.stringify(orders));
  
  ORDERS = orders.sort((a,b) => b.date - a.date);
  closeModal();
  renderOrdersView();
  toast('Custom order created');
};
`;
if (!html.includes('window.openCustomOrderModal')) {
  html = html.replace('// --- Settings ---', customOrderScript + '\n// --- Settings ---');
}

fs.writeFileSync('admin.html', html);
console.log('admin.html modified successfully.');
