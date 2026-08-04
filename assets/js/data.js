const sm_keys = {
  settings: 'sm_settings',
  products: 'sm_products',
  cart: 'sm_cart',
  wishlist: 'sm_wishlist',
  orders: 'sm_orders',
  costs: 'sm_costs'
};

const defaultSettings = {
  storeName: 'SwiftMart Nepal',
  email: 'contact@swiftmartnepal.com',
  phone: '+977 976-9753746',
  whatsapp: '9779802483843',
  facebook: 'https://www.facebook.com/profile.php?id=61592544157695',
  announcement: 'Free delivery all over Nepal on orders over Rs 3,000!',
  deliveryFeeValley: 100,
  deliveryFeeOutside: 200,
  freeDeliveryThreshold: 3000,
  valleyDeliveryDays: '1',
  outsideDeliveryDays: '3-5',
  adminPin: '1234',
  heroImages: ['assets/images/hero.jpg']
};

// Migrate old settings seamlessly
let _existingSettings = JSON.parse(localStorage.getItem(sm_keys.settings) || 'null');
if (_existingSettings && _existingSettings.freeDeliveryThreshold === 2000) {
  _existingSettings.freeDeliveryThreshold = 3000;
  _existingSettings.announcement = 'Free delivery all over Nepal on orders over Rs 3,000!';
  _existingSettings.valleyDeliveryDays = '1';
  localStorage.setItem(sm_keys.settings, JSON.stringify(_existingSettings));
}

const initialProducts = [
  {
    id: 'p1', name: '1.8L Stainless Steel Electric Kettle', slug: 'electric-kettle-1-8l',
    category: 'Kitchen', price: 1250, oldPrice: 1500, stock: 25, badge: 'Sale',
    image: 'assets/images/prod-kettle.jpg',
    description: 'A simple, reliable 1.8L kettle. Boils water quickly for your morning tea or instant noodles. Auto shut-off feature for safety. Made with food-grade stainless steel so it lasts longer without rusting.',
    specs: [{ label: 'Capacity', value: '1.8 Liters' }, { label: 'Material', value: 'Stainless Steel' }, { label: 'Power', value: '1500W' }],
    rating: 4.5, reviewCount: 12,
    reviews: [
      { name: 'Ramesh T.', city: 'Kathmandu', rating: 5, text: 'Ramro chha. Boils very fast.', date: '2025-10-12' },
      { name: 'Sita M.', city: 'Lalitpur', rating: 4, text: 'Good quality for the price.', date: '2025-11-01' }
    ]
  },
  {
    id: 'p2', name: '2000W Smart Induction Cooktop', slug: 'smart-induction-cooktop-2000w',
    category: 'Kitchen', price: 3500, oldPrice: 4200, stock: 15, badge: 'Hot',
    image: 'assets/images/prod-induction.jpg',
    description: 'Perfect for saving gas. This induction cooktop heats up fast and comes with touch controls. Great for boiling milk, making chiya, or full meals. Works with flat-bottom steel or iron utensils.',
    specs: [{ label: 'Power', value: '2000W' }, { label: 'Control', value: 'Touch Panel' }, { label: 'Timer', value: 'Up to 3 hours' }],
    rating: 4.8, reviewCount: 28,
    reviews: [{ name: 'Binod K.', city: 'Pokhara', rating: 5, text: 'Very useful during gas shortage. Works perfectly.', date: '2025-12-05' }]
  },
  {
    id: 'p3', name: 'Electric Rice Cooker 1.5L', slug: 'electric-rice-cooker-1-5l',
    category: 'Kitchen', price: 2800, oldPrice: null, stock: 30, badge: null,
    image: 'assets/images/prod-rice-cooker.jpg',
    description: 'Cooks rice perfectly every time. Ideal for a family of 3-4 people. Comes with a steaming basket for momos or veggies. Non-stick inner pot makes it very easy to clean.',
    specs: [{ label: 'Capacity', value: '1.5 Liters' }, { label: 'Accessories', value: 'Steamer, Measuring Cup, Spoon' }],
    rating: 4.6, reviewCount: 18,
    reviews: [{ name: 'Anjali S.', city: 'Bhaktapur', rating: 4, text: 'Bhat majjale pakchha. Easy to use.', date: '2025-09-20' }]
  },
  {
    id: 'p4', name: '2-Burner Electric Hot Plate', slug: '2-burner-electric-hot-plate',
    category: 'Kitchen', price: 4990, oldPrice: 5500, stock: 10, badge: 'New',
    image: 'assets/images/prod-hot-plate.jpg',
    description: 'A heavy-duty double hot plate for serious cooking. Both plates have independent temperature controls. Works with any type of cookware, not just induction base.',
    specs: [{ label: 'Power', value: '1000W + 1500W' }, { label: 'Body', value: 'Cast Iron' }],
    rating: 4.2, reviewCount: 5, reviews: []
  },
  {
    id: 'p5', name: 'Adjustable Aluminum Laptop Stand', slug: 'adjustable-aluminum-laptop-stand',
    category: 'Desk & Study', price: 1450, oldPrice: 1800, stock: 40, badge: 'Sale',
    image: 'assets/images/prod-laptop-stand.jpg',
    description: 'Say goodbye to neck pain. This portable aluminum laptop stand is fully adjustable to 6 different heights. Very sturdy, does not wobble while typing, and helps keep your laptop cool.',
    specs: [{ label: 'Material', value: 'Aluminum Alloy' }, { label: 'Compatibility', value: '10" to 15.6" laptops' }],
    rating: 4.9, reviewCount: 45,
    reviews: [{ name: 'Prakash R.', city: 'Kathmandu', rating: 5, text: 'Ekdam strong chha. Typing is comfortable.', date: '2026-01-15' }]
  },
  {
    id: 'p6', name: 'Rechargeable LED Desk Lamp', slug: 'rechargeable-led-desk-lamp',
    category: 'Desk & Study', price: 1100, oldPrice: null, stock: 22, badge: null,
    image: 'assets/images/prod-desk-lamp.jpg',
    description: 'Perfect for load shedding or studying late. This LED lamp has 3 color modes (warm, natural, cool white) and is dimmable. Lasts up to 5 hours on a full charge.',
    specs: [{ label: 'Battery', value: '2000mAh' }, { label: 'Charging', value: 'USB-C' }],
    rating: 4.4, reviewCount: 20, reviews: []
  },
  {
    id: 'p7', name: 'Quiet USB Desk Fan', slug: 'quiet-usb-desk-fan',
    category: 'Desk & Study', price: 990, oldPrice: 1200, stock: 50, badge: 'Hot',
    image: 'assets/images/prod-usb-fan.jpg',
    description: 'A lifesaver during hot summer days in the office. Plugs right into your laptop or power bank. Very quiet motor so it will not disturb your meetings.',
    specs: [{ label: 'Power Source', value: 'USB' }, { label: 'Speeds', value: '3 Speed Settings' }],
    rating: 4.7, reviewCount: 33, reviews: []
  },
  {
    id: 'p8', name: 'Silicone Cable Organizer Pack', slug: 'silicone-cable-organizer-pack',
    category: 'Desk & Study', price: 450, oldPrice: null, stock: 100, badge: null,
    image: 'assets/images/prod-cable-organizer.jpg',
    description: 'Keep your desk clean and mess-free. This pack comes with 5 magnetic silicone clips to hold your charging cables and earphones in place.',
    specs: [{ label: 'Quantity', value: '5 clips' }, { label: 'Material', value: 'Silicone' }],
    rating: 4.5, reviewCount: 15, reviews: []
  },
  {
    id: 'p9', name: 'Ultrasonic Air Humidifier 3L', slug: 'ultrasonic-air-humidifier-3l',
    category: 'Home Comfort', price: 2400, oldPrice: 2800, stock: 18, badge: 'New',
    image: 'assets/images/prod-humidifier.jpg',
    description: 'Kathmandu dust making your throat dry? This 3L humidifier runs quietly all night to keep the air moist. Great for better sleep and avoiding dry skin in winter.',
    specs: [{ label: 'Capacity', value: '3 Liters' }, { label: 'Runtime', value: 'Up to 12 hours' }],
    rating: 4.8, reviewCount: 10,
    reviews: [{ name: 'Nita S.', city: 'Kathmandu', rating: 5, text: 'Very helpful for my sinus. Runs silently.', date: '2026-02-10' }]
  },
  {
    id: 'p10', name: 'Double Bed Electric Blanket', slug: 'double-bed-electric-blanket',
    category: 'Home Comfort', price: 3200, oldPrice: 4000, stock: 12, badge: 'Sale',
    image: 'assets/images/prod-humidifier.jpg',
    description: 'Stay warm during freezing winter nights. Fits perfectly on a double bed. Has dual controllers so both sides can have different temperatures. Safe and energy efficient.',
    specs: [{ label: 'Size', value: 'Double Bed (60x70 inches)' }, { label: 'Settings', value: '3 Heat Levels' }],
    rating: 4.9, reviewCount: 55, reviews: []
  },
  {
    id: 'p11', name: 'Essential Oil Aroma Diffuser', slug: 'essential-oil-aroma-diffuser',
    category: 'Home Comfort', price: 1850, oldPrice: null, stock: 20, badge: null,
    image: 'assets/images/prod-humidifier.jpg',
    description: 'Make your room smell like a spa. Just add water and a few drops of your favorite essential oil. Also features soothing LED mood lighting.',
    specs: [{ label: 'Capacity', value: '300ml' }, { label: 'Features', value: 'Auto shut-off, LED lights' }],
    rating: 4.6, reviewCount: 14, reviews: []
  },
  {
    id: 'p12', name: 'Heavy Duty Rechargeable Torch', slug: 'heavy-duty-rechargeable-torch',
    category: 'Home Comfort', price: 1600, oldPrice: 1900, stock: 25, badge: 'Hot',
    image: 'assets/images/prod-usb-fan.jpg',
    description: 'A must-have for emergencies or night walks. Long range beam and very bright side light. Battery lasts for days on a single charge.',
    specs: [{ label: 'Battery', value: '4000mAh' }, { label: 'Range', value: 'Up to 500m' }],
    rating: 4.7, reviewCount: 22, reviews: []
  }
];

const DATA_VERSION = 3;

const SM = {
  _products: null,
  _settings: null,
  async init() {
    if (this._products && this._settings) return;
    
    // Check if settings exists in Firestore, if not populate initial data
    const settingsSnap = await db.collection('settings').doc('store').get();
    if (!settingsSnap.exists) {
      await db.collection('settings').doc('store').set(defaultSettings);
      this._settings = defaultSettings;
    } else {
      this._settings = settingsSnap.data();
      // Auto-migrate old announcement
      if (this._settings.announcement === 'Free delivery everywhere on orders over Rs 3,000') {
        this._settings.announcement = 'Free delivery all over Nepal on orders over Rs 3,000!';
        db.collection('settings').doc('store').update({ announcement: this._settings.announcement }).catch(e => console.error(e));
      }
    }
    this.initDrawer();
    
    const prodSnap = await db.collection('products').get();
    if (prodSnap.empty) {
      const batch = db.batch();
      for (const p of initialProducts) {
        batch.set(db.collection('products').doc(p.id), p);
      }
      await batch.commit();
      this._products = initialProducts;
    } else {
      this._products = prodSnap.docs.map(d => d.data());
    }

    if (!localStorage.getItem(sm_keys.cart)) localStorage.setItem(sm_keys.cart, JSON.stringify([]));
    if (!localStorage.getItem(sm_keys.wishlist)) localStorage.setItem(sm_keys.wishlist, JSON.stringify([]));
  },
  getSettings() { 
    return this._settings || defaultSettings;
  },
  async saveSettings(s) { 
    await db.collection('settings').doc('store').set(s);
    this._settings = s;
  },
  getProducts() { 
    return this._products || initialProducts;
  },
  async saveProducts(productsArray) {
    const batch = db.batch();
    productsArray.forEach(p => {
      const ref = db.collection('products').doc(p.id);
      batch.set(ref, p);
    });
    await batch.commit();
    this._products = productsArray;
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

  initDrawer() {
    if (document.getElementById("cart-drawer")) return;
    const html = `
      <div id="cart-drawer-overlay" class="drawer-overlay" onclick="SM.closeDrawer()"></div>
      <div id="cart-drawer" class="drawer">
        <div class="drawer-header">
          <h3>Your Cart (<span id="drawer-count">0</span>)</h3>
          <button class="drawer-close" onclick="SM.closeDrawer()">&times;</button>
        </div>
        <div class="drawer-body" id="drawer-items"></div>
        <div class="drawer-footer">
          <div class="drawer-total"><span>Total</span><span id="drawer-total-price">Rs 0</span></div>
          <a href="/checkout" class="btn btn-accent btn-block" style="text-align:center;">Checkout</a>
          <a href="/cart" class="btn btn-outline btn-block mt-2" style="text-align:center;">View Full Cart</a>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
    
    // Intercept cart icon clicks
    const cartIcons = document.querySelectorAll(".hdr-cart");
    cartIcons.forEach(icon => {
      icon.addEventListener("click", (e) => {
        if (window.location.pathname.includes("/cart") || window.location.pathname.includes("/checkout")) return;
        e.preventDefault();
        SM.openDrawer();
      });
    });
  },
  closeDrawer() {
    const d = document.getElementById("cart-drawer");
    if(d) d.classList.remove("open");
    const o = document.getElementById("cart-drawer-overlay");
    if(o) o.classList.remove("open");
  },
  async openDrawer() {
    this.initDrawer();
    const d = document.getElementById("cart-drawer");
    if(d) d.classList.add("open");
    const o = document.getElementById("cart-drawer-overlay");
    if(o) o.classList.add("open");
    await this.renderDrawer();
  },
  async renderDrawer() {
    const cart = this.getCart();
    const countEl = document.getElementById("drawer-count");
    if(countEl) countEl.textContent = this.getCartCount();
    const container = document.getElementById("drawer-items");
    if (!container) return;
    if (cart.length === 0) {
      container.innerHTML = `<div class="drawer-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg><p>Your cart is empty.</p><button class="btn btn-primary mt-2" onclick="SM.closeDrawer()">Start Shopping</button></div>`;
      document.getElementById("drawer-total-price").textContent = "Rs 0";
      return;
    }
    let html = "";
    let total = 0;
    const products = this.getProducts();
    for (const item of cart) {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        total += p.price * item.quantity;
        html += `
          <div class="drawer-item">
            <img src="${p.image}" class="drawer-item-img">
            <div class="drawer-item-info">
              <div class="drawer-item-title">${p.name}</div>
              <div class="drawer-item-price">${SM.formatPrice(p.price)}</div>
              <div class="drawer-qty-ctrl">
                <button onclick="SM.updateDrawerQty('${p.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="SM.updateDrawerQty('${p.id}', 1)">+</button>
              </div>
            </div>
          </div>
        `;
      }
    }
    container.innerHTML = html;
    document.getElementById("drawer-total-price").textContent = SM.formatPrice(total);
  },
  async updateDrawerQty(pid, delta) {
    const cart = this.getCart();
    const item = cart.find(i => i.productId === pid);
    if (!item) return;
    const newQty = item.quantity + delta;
    this.updateCartQty(pid, newQty);
    if (typeof updateCartCount !== "undefined") updateCartCount();
    await this.renderDrawer();
  },

  addToCart(pid, qty = 1) {
    const c = this.getCart(); const e = c.find(i => i.productId === pid);
    if (e) e.quantity += qty; else c.push({ productId: pid, quantity: qty });
    localStorage.setItem(sm_keys.cart, JSON.stringify(c));
    if (typeof updateCartCount !== 'undefined') updateCartCount();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/cart') && !window.location.pathname.includes('/checkout')) { this.openDrawer(); }
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
    const user = firebase.auth().currentUser;
    const o = { ...data, id, status: 'placed', date: now, userId: user ? user.uid : null, statusHistory: [{ status: 'placed', timestamp: new Date(now).toISOString() }], timestamps: { placedAt: new Date(now).toISOString() } };
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
    return 'Rs. ' + Number(n).toLocaleString('en-IN');
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
    return `<div class="product-card" data-id="${p.id}">
      <a href="/product?id=${p.id}" class="pc-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 fill=%22%23ccc%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f5f5f5%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        ${p.badge ? `<span class="pc-badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
      </a>
      <button class="pc-wish ${wishlisted ? 'active' : ''}" onclick="event.stopPropagation();SM.toggleWishlist('${p.id}');location.reload();" aria-label="Wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlisted ? '#c65d1a' : 'none'}" stroke="${wishlisted ? '#c65d1a' : '#999'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <div class="pc-body">
        <a href="/product?id=${p.id}" class="pc-name">${p.name}</a>
        <div class="pc-stars">${this.renderStars(p.rating)} <span class="pc-rev-count">(${p.reviewCount})</span></div>
        <div class="pc-price-row">
          <span class="pc-price">${this.formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="pc-old">${this.formatPrice(p.oldPrice)}</span>` : ''}
          ${p.oldPrice ? `<span class="pc-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
        </div>
        ${p.stock < 5 ? `<div style="color:var(--red); font-size: 13px; font-weight: 600; margin-bottom: 8px;">Only ${p.stock} stocks left!</div>` : ''}
        <button class="pc-cart-btn" onclick="event.stopPropagation();SM.addToCart('${p.id}');showToast('Added to cart', 'success', '${p.name.replace(/'/g, "\\'")}');updateCartCount();">Add to Cart</button>
      </div>
    </div>`;
  }
};
window.SM = SM;
setTimeout(() => { SM.init(); }, 100);


/* Toast */
function showToast(msg, type = 'success', subtitle = '') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div'); t.className = 'toast toast-' + type; 
  const icon = type === 'success' ? `<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : '';
  t.innerHTML = `<div class="toast-head">${icon}${msg}</div>${subtitle ? '<div class="toast-body">' + subtitle + '</div>' : ''}`;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3500);
}
function updateCartCount() {
  document.querySelectorAll('.cart-count').forEach(el => {
    const c = SM.getCartCount(); el.textContent = c; el.style.display = c > 0 ? 'flex' : 'none';
  });
}

firebase.auth().onAuthStateChanged(user => {
  const nameEl = document.getElementById('hdr-user-name');
  if (user && nameEl) {
    nameEl.textContent = user.displayName || user.email.split('@')[0];
    document.getElementById('hdr-user').href = '/dashboard';
  }
});
