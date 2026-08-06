const fs = require('fs');
let html = fs.readFileSync('product.html', 'utf8');

// We need to add the wishlist button to pd-gallery
const galleryStart = `<div class="pd-gallery" style="position:relative; display:flex; flex-direction:column; overflow:hidden; padding:0; background:none; border:none;">`;

const buttonHtml = `
          <!-- WISHLIST BUTTON (Top Right of Image) -->
          <button id="pd-wish-btn" class="pc-wish" style="position:absolute; top:16px; right:16px; z-index:20; background:rgba(255,255,255,0.9); box-shadow:0 2px 8px rgba(0,0,0,0.15);" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
`;

if (!html.includes('pd-wish-btn')) {
    html = html.replace(galleryStart, galleryStart + '\n' + buttonHtml);
}

// We also need to add logic to update this button when the product loads, and handle clicks.
// Let's find where product details are rendered.
const renderLogicStr = `document.getElementById('pd-price').textContent = SM.formatPrice(p.price);`;

const newRenderLogic = renderLogicStr + `

    // Setup Wishlist Button
    const wishBtn = document.getElementById('pd-wish-btn');
    if (wishBtn) {
      const isW = window.SM.isWishlisted(p.id);
      wishBtn.classList.toggle('active', isW);
      wishBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="' + (isW ? '#c65d1a' : 'none') + '" stroke="' + (isW ? '#c65d1a' : '#999') + '" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      
      wishBtn.onclick = function(e) {
        e.stopPropagation();
        window.SM.toggleWishlist(p.id);
        const nw = window.SM.isWishlisted(p.id);
        this.classList.toggle('active', nw);
        this.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="' + (nw ? '#c65d1a' : 'none') + '" stroke="' + (nw ? '#c65d1a' : '#999') + '" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      };
    }
`;

if (!html.includes('Setup Wishlist Button')) {
    html = html.replace(renderLogicStr, newRenderLogic);
}

fs.writeFileSync('product.html', html);
console.log('Fixed product.html');
