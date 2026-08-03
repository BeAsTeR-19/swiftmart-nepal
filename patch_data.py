import re

with open("assets/js/data.js", "r") as f:
    c = f.read()

drawer_methods = """
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
          <a href="checkout.html" class="btn btn-accent btn-block" style="text-align:center;">Checkout</a>
          <a href="cart.html" class="btn btn-outline btn-block mt-2" style="text-align:center;">View Full Cart</a>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
    
    // Intercept cart icon clicks
    const cartIcons = document.querySelectorAll(".hdr-cart");
    cartIcons.forEach(icon => {
      icon.addEventListener("click", (e) => {
        if (window.location.pathname.includes("cart.html") || window.location.pathname.includes("checkout.html")) return;
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
"""

if "initDrawer" not in c:
    c = c.replace("  addToCart(pid, qty = 1) {", drawer_methods + "\n  addToCart(pid, qty = 1) {")
    
    old_init = "this._settings = settingsSnap.data();\n      // Auto-migrate old announcement"
    new_init = "this._settings = settingsSnap.data();\n      // Auto-migrate old announcement\n      this.initDrawer();"
    c = c.replace(old_init, new_init)
    
    old_add = "localStorage.setItem(sm_keys.cart, JSON.stringify(c));\n  },"
    new_add = "localStorage.setItem(sm_keys.cart, JSON.stringify(c));\n    if (typeof updateCartCount !== 'undefined') updateCartCount();\n    if (typeof window !== 'undefined' && !window.location.pathname.includes('cart.html') && !window.location.pathname.includes('checkout.html')) { this.openDrawer(); }\n  },"
    c = c.replace(old_add, new_add)
    
    with open("assets/js/data.js", "w") as f:
        f.write(c)
    print("Injected Drawer JS logic")
else:
    print("Already injected")
