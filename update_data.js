const fs = require('fs');

let dataJs = fs.readFileSync('assets/js/data.js', 'utf-8');

// Replace the entire SM object
const smObjectReplacement = `const SM = {
  async init() {
    // Check if settings exists in Firestore, if not populate initial data
    const settingsSnap = await db.collection('settings').doc('store').get();
    if (!settingsSnap.exists) {
      await db.collection('settings').doc('store').set(defaultSettings);
    }
    
    const prodSnap = await db.collection('products').limit(1).get();
    if (prodSnap.empty) {
      for (const p of initialProducts) {
        await db.collection('products').doc(p.id).set(p);
      }
    }

    if (!localStorage.getItem(sm_keys.cart)) localStorage.setItem(sm_keys.cart, JSON.stringify([]));
    if (!localStorage.getItem(sm_keys.wishlist)) localStorage.setItem(sm_keys.wishlist, JSON.stringify([]));
  },
  async getSettings() { 
    const doc = await db.collection('settings').doc('store').get();
    return doc.exists ? doc.data() : defaultSettings;
  },
  async saveSettings(s) { 
    await db.collection('settings').doc('store').set(s);
  },
  async getProducts() { 
    const snap = await db.collection('products').get();
    return snap.docs.map(d => d.data());
  },
  async saveProducts(productsArray) {
    // only used by admin to re-save all products? Usually admin saves one by one
    // But in the old logic we saved the whole array.
    const batch = db.batch();
    productsArray.forEach(p => {
      const ref = db.collection('products').doc(p.id);
      batch.set(ref, p);
    });
    await batch.commit();
  },
  async getProduct(id) { 
    const doc = await db.collection('products').doc(id).get();
    return doc.exists ? doc.data() : null;
  },
  async addProduct(p) { 
    await db.collection('products').doc(p.id).set(p);
  },
  async updateProduct(id, u) { 
    await db.collection('products').doc(id).update(u);
  },
  async deleteProduct(id) { 
    await db.collection('products').doc(id).delete();
  },
  getCart() { return JSON.parse(localStorage.getItem(sm_keys.cart)) || []; },
  addToCart(pid, qty = 1) {
    const c = this.getCart(); const e = c.find(i => i.productId === pid);
    if (e) e.quantity += qty; else c.push({ productId: pid, quantity: qty });
    localStorage.setItem(sm_keys.cart, JSON.stringify(c));
  },
  updateCartQty(pid, qty) {
    if (qty <= 0) { this.removeFromCart(pid); return; }
    const c = this.getCart(); const e = c.find(i => i.productId === pid);
    if (e) { e.quantity = qty; localStorage.setItem(sm_keys.cart, JSON.stringify(c)); }
  },
  removeFromCart(pid) { localStorage.setItem(sm_keys.cart, JSON.stringify(this.getCart().filter(i => i.productId !== pid))); },
  clearCart() { localStorage.setItem(sm_keys.cart, JSON.stringify([])); },
  getCartCount() { return this.getCart().reduce((t, i) => t + i.quantity, 0); },
  async getCartTotal() {
    const cart = this.getCart();
    let total = 0;
    for (const i of cart) {
      const p = await this.getProduct(i.productId);
      if (p) total += p.price * i.quantity;
    }
    return total;
  },
  getWishlist() { return JSON.parse(localStorage.getItem(sm_keys.wishlist)) || []; },
  toggleWishlist(pid) {
    let w = this.getWishlist();
    w = w.includes(pid) ? w.filter(id => id !== pid) : [...w, pid];
    localStorage.setItem(sm_keys.wishlist, JSON.stringify(w));
  },
  isWishlisted(pid) { return this.getWishlist().includes(pid); },
  async getOrders() { 
    const snap = await db.collection('orders').get();
    return snap.docs.map(d => d.data());
  },
  async createOrder(data) {
    const now = Date.now();
    const id = this.generateOrderId();
    const o = { ...data, id, status: 'placed', date: now, statusHistory: [{ status: 'placed', timestamp: new Date(now).toISOString() }], timestamps: { placedAt: new Date(now).toISOString() } };
    await db.collection('orders').doc(id).set(o);
    this.clearCart(); 
    return o;
  },
  async updateOrderStatus(oid, status) {
    const oSnap = await db.collection('orders').doc(oid).get();
    if (oSnap.exists) {
      const o = oSnap.data();
      o.status = status; o.statusHistory.push({ status, timestamp: new Date().toISOString() });
      if (status === 'confirmed') o.timestamps.confirmedAt = new Date().toISOString();
      if (status === 'dispatched') o.timestamps.dispatchedAt = new Date().toISOString();
      if (status === 'delivered') o.timestamps.deliveredAt = new Date().toISOString();
      await db.collection('orders').doc(oid).set(o);
    }
  },
  async deleteOrder(oid) { 
    await db.collection('orders').doc(oid).delete();
  },
  async getOrder(oid) { 
    const doc = await db.collection('orders').doc(oid).get();
    return doc.exists ? doc.data() : null;
  },
  async getCosts() { 
    const snap = await db.collection('costs').get();
    return snap.docs.map(d => d.data());
  },
  async addCost(c) { 
    const id = 'C-' + Date.now();
    await db.collection('costs').doc(id).set({ ...c, id });
  },
  async deleteCost(id) { 
    await db.collection('costs').doc(id).delete();
  },
  generateOrderId() {
    const ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let r = '';
    for (let i = 0; i < 5; i++) r += ch.charAt(Math.floor(Math.random() * ch.length));
    return 'SM-' + r;
  },
  formatPrice(n) {
    if (n == null) return '';
    const s = Math.round(n).toString();
    const last3 = s.substring(s.length - 3);
    const rest = s.substring(0, s.length - 3);
    return 'Rs ' + (rest ? rest.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ',') + ',' + last3 : last3);
  },
  renderStars(rating) {
    let h = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      else if (i - 0.5 <= rating) h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><defs><clipPath id="hc"><rect x="0" y="0" width="12" height="24"/></clipPath></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" clip-path="url(#hc)"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="#f59e0b" stroke-width="1.5"/></svg>';
      else h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
    return h;
  },
  productCard(p) {
    const wishlisted = this.isWishlisted(p.id);
    return \`<div class="product-card" data-id="\${p.id}">
      <a href="product.html?id=\${p.id}" class="pc-img-wrap">
        <img src="\${p.image}" alt="\${p.name}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 fill=%22%23ccc%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f5f5f5%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        \${p.badge ? \`<span class="pc-badge badge-\${p.badge.toLowerCase()}">\${p.badge}</span>\` : ''}
      </a>
      <button class="pc-wish \${wishlisted ? 'active' : ''}" onclick="event.stopPropagation();SM.toggleWishlist('\${p.id}');location.reload();" aria-label="Wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="\${wishlisted ? '#c65d1a' : 'none'}" stroke="\${wishlisted ? '#c65d1a' : '#999'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <div class="pc-body">
        <a href="product.html?id=\${p.id}" class="pc-name">\${p.name}</a>
        <div class="pc-stars">\${this.renderStars(p.rating)} <span class="pc-rev-count">(\${p.reviewCount})</span></div>
        <div class="pc-price-row">
          <span class="pc-price">\${this.formatPrice(p.price)}</span>
          \${p.oldPrice ? \`<span class="pc-old">\${this.formatPrice(p.oldPrice)}</span>\` : ''}
          \${p.oldPrice ? \`<span class="pc-discount">-\${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>\` : ''}
        </div>
        \${p.stock < 5 ? \`<div style="color:var(--red); font-size: 13px; font-weight: 600; margin-bottom: 8px;">Only \${p.stock} stocks left!</div>\` : ''}
        <button class="pc-cart-btn" onclick="event.stopPropagation();SM.addToCart('\${p.id}');showToast('Added to cart');updateCartCount();">Add to Cart</button>
      </div>
    </div>\`;
  }
};
window.SM = SM;
setTimeout(() => { SM.init(); }, 100);
`;

dataJs = dataJs.replace(/const SM = \{[\s\S]*window\.SM = SM;\nSM\.init\(\);/m, smObjectReplacement);

fs.writeFileSync('assets/js/data.js', dataJs);
console.log('data.js updated for Firebase.');
