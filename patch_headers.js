const fs = require('fs');
const path = require('path');

const newHeader = `  <!-- HEADER -->
  <header class="header">
    <div class="header-inner container">
      <!-- LOGO -->
      <a href="index.html" class="logo-link">
        <img src="assets/images/logo.svg" alt="SwiftMart Nepal Logo" class="logo-img">
        <span class="logo-text">SwiftMart</span>
      </a>

      <!-- SEARCH -->
      <div class="search-wrap">
        <form id="search-form" action="shop.html" method="GET">
          <input type="text" name="q" placeholder="Search for products & more..." required>
          <button type="submit" class="search-btn">Search</button>
        </form>
      </div>

      <!-- HEADER ACTIONS -->
      <div class="hdr-actions">
        <!-- Wishlist -->
        <a href="shop.html?wishlist=true" class="hdr-btn" aria-label="Wishlist">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </a>
        
        <!-- Cart -->
        <a href="cart.html" class="hdr-btn" aria-label="Cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span class="cart-count">0</span>
        </a>

        <!-- User -->
        <a href="login.html" class="hdr-user-btn" id="hdr-user">
          <div class="icon-user">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div class="user-text">
            <span>Welcome</span>
            <strong id="hdr-user-name">Sign In / Register</strong>
          </div>
        </a>

        <!-- Mobile Menu Btn -->
        <button class="hdr-btn mob-menu-btn" id="mob-menu-btn" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- DESKTOP NAV -->
    <nav class="nav">
      <ul>`;

const files = ['shop.html', 'cart.html', 'checkout.html', 'order-tracking.html', 'product.html'];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  // extract from <!-- HEADER --> to <!-- DESKTOP NAV -->\n    <nav class="nav">\n      <ul>
  const re = /<!-- HEADER -->[\s\S]*?<!-- DESKTOP NAV -->\s*<nav class="nav">\s*<ul>/;
  if (re.test(c)) {
    c = c.replace(re, newHeader);
    fs.writeFileSync(f, c);
    console.log('Updated ' + f);
  }
}

// Now replace in index.html because we changed id="hdr-user-name"
let cIndex = fs.readFileSync('index.html', 'utf8');
cIndex = cIndex.replace(
  /<strong>Sign In \/ Register<\/strong>/,
  '<strong id="hdr-user-name">Sign In / Register</strong>'
);
fs.writeFileSync('index.html', cIndex);

// Add auth state listener to data.js
let dataJs = fs.readFileSync('assets/js/data.js', 'utf8');
const authLogic = `
firebase.auth().onAuthStateChanged(user => {
  const nameEl = document.getElementById('hdr-user-name');
  if (user && nameEl) {
    nameEl.textContent = user.displayName || user.email.split('@')[0];
    document.getElementById('hdr-user').href = 'javascript:void(0);'; // For now, maybe an account page later
    document.getElementById('hdr-user').onclick = async (e) => {
      e.preventDefault();
      if (confirm('Log out?')) {
        await firebase.auth().signOut();
        window.location.reload();
      }
    };
  }
});
`;
if (!dataJs.includes('firebase.auth().onAuthStateChanged')) {
  dataJs = dataJs + authLogic;
  fs.writeFileSync('assets/js/data.js', dataJs);
}

// Add firebase_init.js if missing in the files
for (const f of ['index.html', ...files]) {
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('firebase_init.js')) {
    c = c.replace('</head>', '  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>\n  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>\n  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>\n  <script src="assets/js/firebase_init.js"></script>\n</head>');
    fs.writeFileSync(f, c);
  }
}

