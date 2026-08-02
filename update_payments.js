const fs = require('fs');


// 1. Update checkout.html Payment Section
let checkoutHtml = fs.readFileSync('checkout.html', 'utf-8');

const payTabsStart = checkoutHtml.indexOf('<div class="pay-tabs">');
const submitBtnStart = checkoutHtml.indexOf('<label class="consent-checkbox">');

if (payTabsStart !== -1 && submitBtnStart !== -1) {
  const newPaymentHTML = `<div class="pay-tabs">
                <div class="pay-tab active" data-tab="cod" onclick="switchTab('cod')">
                  <img src="https://cdn-icons-png.flaticon.com/128/1554/1554406.png" style="height:28px; width:auto; object-fit:contain;" alt="COD">
                  Cash on Delivery
                </div>
                <div class="pay-tab" data-tab="esewa" onclick="switchTab('esewa')">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Esewa_logo.webp" style="height:28px; width:auto; object-fit:contain;" alt="eSewa">
                  eSewa
                </div>
                <div class="pay-tab" data-tab="bank" onclick="switchTab('bank')">
                  <img src="https://cdn-icons-png.flaticon.com/128/2830/2830284.png" style="height:28px; width:auto; object-fit:contain;" alt="Bank">
                  Bank Transfer
                </div>
              </div>
              <input type="hidden" name="paymentMethod" id="payment-method-input" value="COD">

              <!-- COD Content -->
              <div class="tab-content active" id="tab-cod">
                <div style="padding: 16px; background: var(--bg-alt); border-radius: var(--radius); font-size: 0.9rem; color: var(--text-2); line-height: 1.5;">
                  <strong>Pay with Cash on Delivery</strong><br>
                  You will pay the delivery agent in cash when your order arrives at your doorstep.
                </div>
              </div>

              <!-- eSewa Content -->
              <div class="tab-content" id="tab-esewa">
                <div class="qr-section">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=eSewa:9769753746" alt="eSewa QR" style="width:160px; height:160px; border-radius:8px; margin-bottom:12px; border:2px solid var(--esewa); padding: 4px; background:#fff;">
                  <p>Or send directly to: <strong style="color:var(--esewa); font-size:16px;">976-9753746</strong></p>
                  <p style="margin-top:4px; font-size:12px; color:var(--text-3);">Name: SwiftMart Nepal</p>
                </div>
                <div class="pay-form-group">
                  <label>Your eSewa Mobile Number *</label>
                  <input type="tel" id="esewa-number" name="esewaNumber" placeholder="e.g. 98XXXXXXXX">
                </div>
                <div class="pay-form-group">
                  <label>Transaction / Reference Code *</label>
                  <input type="text" id="esewa-txn" name="esewaTxn" placeholder="e.g. 00012345678">
                </div>
              </div>

              <!-- Bank Content -->
              <div class="tab-content" id="tab-bank">
                <div class="qr-section">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=BankTransfer:123456789" alt="Bank QR" style="width:160px; height:160px; border-radius:8px; margin-bottom:12px; border:2px solid #154c7a; padding: 4px; background:#fff;">
                  <p>Or transfer directly to:</p>
                  <div style="font-size:14px; color:var(--text); text-align:left; background:#fff; padding:12px; border-radius:4px; margin-top:8px; border:1px solid var(--border);">
                    <div style="margin-bottom:4px;"><strong>Bank:</strong> Global IME Bank</div>
                    <div style="margin-bottom:4px;"><strong>Account Name:</strong> SwiftMart Nepal</div>
                    <div><strong>Account No:</strong> 01234567890123</div>
                  </div>
                </div>
                <div class="pay-form-group">
                  <label>Your Bank Account Name *</label>
                  <input type="text" id="bank-name" name="bankName" placeholder="e.g. John Doe">
                </div>
                <div class="pay-form-group">
                  <label>Transaction / Reference Code *</label>
                  <input type="text" id="bank-txn" name="bankTxn" placeholder="e.g. TRN123456">
                </div>
              </div>

              `;
  checkoutHtml = checkoutHtml.substring(0, payTabsStart) + newPaymentHTML + checkoutHtml.substring(submitBtnStart);
}

// Update the validation in checkout.html JS
checkoutHtml = checkoutHtml.replace(/if \(data\.paymentMethod === 'eSewa'\) {[\s\S]*?} else if \(data\.paymentMethod === 'Khalti'\) {[\s\S]*?}/, 
`if (data.paymentMethod === 'eSewa') {
          txId = data.esewaTxn;
          const esewaNum = data.esewaNumber;
          if(!esewaNum) return SM.toast('Please enter your eSewa Mobile Number', 'error');
          if(!txId) return SM.toast('Please enter eSewa Transaction Code', 'error');
          txId = \`Num: \${esewaNum}, Txn: \${txId}\`;
        } else if (data.paymentMethod === 'Bank') {
          txId = data.bankTxn;
          const bankName = data.bankName;
          if(!bankName) return SM.toast('Please enter your Bank Account Name', 'error');
          if(!txId) return SM.toast('Please enter Bank Transaction Code', 'error');
          txId = \`Name: \${bankName}, Txn: \${txId}\`;
        }`);

checkoutHtml = checkoutHtml.replace(/let methodMap = { cod: 'COD', esewa: 'eSewa', khalti: 'Khalti' };/g, "let methodMap = { cod: 'COD', esewa: 'eSewa', bank: 'Bank' };");
checkoutHtml = checkoutHtml.replace(/\.pay-tab\.active\[data-tab="khalti"\] \{ border-color: var\(--khalti\); color: var\(--khalti\); \}/g, ".pay-tab.active[data-tab=\"bank\"] { border-color: var(--bank, #154c7a); color: var(--bank, #154c7a); }");
checkoutHtml = checkoutHtml.replace(/<div class="pay-tab" data-tab="khalti"[\s\S]*?<\/svg>\s*Khalti\s*<\/div>/g, ""); // if needed

fs.writeFileSync('checkout.html', checkoutHtml);

// 2. Update Footer Payment Badges in all HTML files
const htmlFiles = ['index.html', 'shop.html', 'cart.html', 'product.html', 'order-tracking.html', 'about.html'];

const newBadgesHtml = `<div class="pay-badges" style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
            <img src="https://cdn-icons-png.flaticon.com/128/1554/1554406.png" style="height:24px; background:#fff; padding:2px; border-radius:4px;" alt="COD">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Esewa_logo.webp" style="height:24px; background:#fff; padding:2px; border-radius:4px;" alt="eSewa">
            <img src="https://cdn-icons-png.flaticon.com/128/2830/2830284.png" style="height:24px; background:#fff; padding:2px; border-radius:4px;" alt="Bank">
          </div>`;

for (const file of htmlFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace footer badges block
    content = content.replace(/<div class="pay-badges">[\s\S]*?<\/div>/g, newBadgesHtml);
    content = content.replace(/<div class="pay-badges" style="opacity:0\.7">[\s\S]*?<\/div>/g, newBadgesHtml.replace('class="pay-badges"', 'class="pay-badges" style="opacity:0.7"'));
    
    // Make sure we change "Khalti" to "Bank Transfer" in the text
    content = content.replace(/We accept Cash on Delivery and digital wallets./g, "We accept Cash on Delivery, eSewa, and Bank Transfers.");

    fs.writeFileSync(file, content);
  }
}

console.log('Payment methods updated successfully!');
