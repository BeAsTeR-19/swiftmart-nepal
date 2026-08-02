
// --- UI Helpers ---
const $ = id => document.getElementById(id);
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), 3000);
}

function openModal(html) {
  $('modalBox').innerHTML = `<button class="x" onclick="closeModal()">×</button>` + html;
  $('overlay').classList.add('on');
  $('modal').classList.add('on');
}
function closeModal() {
  $('overlay').classList.remove('on');
  $('modal').classList.remove('on');
}
$('overlay').onclick = closeModal;

// --- Auth ---
$('liBtn').onclick = login;
$('liPass').addEventListener('keydown', e => { if(e.key === 'Enter') login(); });
function login() {
  const val = $('liPass').value;
  const s = SM.getSettings();
  if (val === s.adminPin) {
    $('loginView').style.display = 'none';
    $('shell').classList.add('on');
    $('liErr').textContent = '';
    $('liPass').value = '';
    initApp();
  } else {
    $('liErr').textContent = 'Incorrect PIN';
  }
}
$('signOut').onclick = () => {
  $('loginView').style.display = 'flex';
  $('shell').classList.remove('on');
};

// --- Tabs ---
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('on'));
  $('view-' + b.dataset.tab).classList.add('on');
});

// --- State ---
let ORDERS = [];
let PRODUCTS = [];
let EXPENSES = [];
let oFilter = 'all';
const FLOW = ['placed', 'confirmed', 'dispatched', 'delivered'];
const FLOW_LABEL = { placed: 'Placed', confirmed: 'Confirmed', dispatched: 'Dispatched', delivered: 'Delivered', cancelled: 'Cancelled' };

function initApp() {
  ORDERS = SM.getOrders().sort((a,b) => b.date - a.date);
  PRODUCTS = SM.getProducts();
  EXPENSES = JSON.parse(localStorage.getItem('sm_costs') || '[]').sort((a,b) => b.date - a.date);
  
  renderOrdersView();
  renderProducts();
  renderFinances();
  renderSettings();
  
  $('feDate').value = new Date().toISOString().split('T')[0];
}

// --- Orders ---
function renderOrdersView() {
  // Stats
  const active = ORDERS.filter(o => o.status !== 'cancelled');
  const placedN = ORDERS.filter(o => o.status === 'placed').length;
  const prog = ORDERS.filter(o => ['confirmed', 'dispatched'].includes(o.status)).length;
  const today = new Date(); today.setHours(0,0,0,0);
  const todayN = ORDERS.filter(o => o.date >= today.getTime()).length;
  const rev = active.reduce((s,o) => s + o.total, 0);
  
  $('stats').innerHTML = `
    <div class="stat"><b>${placedN}</b><span>New orders</span></div>
    <div class="stat"><b>${prog}</b><span>In progress</span></div>
    <div class="stat"><b>${todayN}</b><span>Orders today</span></div>
    <div class="stat"><b>${SM.formatPrice(rev)}</b><span>Order value (active)</span></div>
  `;
  
  // Chips
  const counts = { all: ORDERS.length };
  [...FLOW, 'cancelled'].forEach(s => counts[s] = ORDERS.filter(o => o.status === s).length);
  
  $('oChips').innerHTML = ['all', ...FLOW, 'cancelled'].map(s => 
    `<button class="chip ${oFilter===s?'active':''}" data-f="${s}">${s==='all'?'All':FLOW_LABEL[s]} <span class="n">${counts[s]}</span></button>`
  ).join('');
  
  document.querySelectorAll('#oChips .chip').forEach(b => b.onclick = () => { oFilter = b.dataset.f; renderOrdersView(); });
  
  // List
  const list = ORDERS.filter(o => oFilter === 'all' || o.status === oFilter);
  const box = $('oList');
  if(!list.length) { box.innerHTML = '<div class="empty-note">No orders found in this category.</div>'; return; }
  
  box.innerHTML = list.map(o => `
    <div class="orow" onclick="openOrder('${o.id}')">
      <span class="num">${o.id}</span>
      <span class="who"><b>${esc(o.customer.name)}</b><span>${esc(o.customer.city)} · ${o.items.length} items · ${esc(o.payment.method)}</span></span>
      <span class="tot">${SM.formatPrice(o.total)}</span>
      <span class="pill ${o.status}">${FLOW_LABEL[o.status]}</span>
      <span class="when">${new Date(o.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

window.openOrder = function(id) {
  const o = ORDERS.find(x => x.id === id); if(!o) return;
  const itemsHTML = o.items.map(i => `<tr><td>${esc(i.name)} ×${i.quantity}</td><td>${SM.formatPrice(i.price * i.quantity)}</td></tr>`).join('');
  const nexts = FLOW.slice(FLOW.indexOf(o.status) + 1);
  
  const waPhone = o.customer.phone.replace(/[^0-9]/g, '');
  const waLink = "https://wa.me/" + (waPhone.length === 10 ? "977" + waPhone : waPhone);
  
  openModal(`
    <h3>Order ${o.id} <span class="pill ${o.status}" style="vertical-align:middle;margin-left:8px">${FLOW_LABEL[o.status]}</span></h3>
    <div class="od">
      <div class="grid2">
        <div class="block"><h4>Customer</h4><div><b>${esc(o.customer.name)}</b><br>
          <a href="tel:${esc(o.customer.phone)}">${esc(o.customer.phone)}</a> · <a target="_blank" href="${waLink}">WhatsApp</a><br>
          ${esc(o.customer.address)}, ${esc(o.customer.city)}<br>${esc(o.customer.zone)}</div></div>
        <div class="block"><h4>Details</h4><div>Payment: <b>${esc(o.payment.method)}</b><br>Placed: ${new Date(o.date).toLocaleString()}<br>${o.customer.note ? "Note: <b>"+esc(o.customer.note)+"</b>" : "No note"}</div></div>
      </div>
      <div class="block"><h4>Items</h4><table>${itemsHTML}<tr class="tt"><td>Total</td><td>${SM.formatPrice(o.total)}</td></tr></table></div>
      <div class="statusline">
        ${nexts.length && o.status !== 'cancelled' ? `<button class="btn btn-crimson" onclick="setStatus('${o.id}','${nexts[0]}')">Mark ${FLOW_LABEL[nexts[0]]}</button>` : ''}
        ${o.status !== 'cancelled' && o.status !== 'delivered' ? `<button class="btn btn-line" onclick="setStatus('${o.id}','cancelled')">Cancel order</button>` : ''}
        <button class="btn btn-line" onclick="deleteOrder('${o.id}')">Delete</button>
      </div>
    </div>
  `);
};

window.setStatus = function(id, st) {
  let orders = SM.getOrders();
  let o = orders.find(x => x.id === id);
  if (o) {
    o.status = st;
    localStorage.setItem('sm_orders', JSON.stringify(orders));
    ORDERS = orders.sort((a,b) => b.date - a.date);
    toast('Order updated');
    closeModal();
    renderOrdersView();
    renderFinances();
  }
};

window.deleteOrder = function(id) {
  if (confirm('Delete order?')) {
    let orders = SM.getOrders().filter(x => x.id !== id);
    localStorage.setItem('sm_orders', JSON.stringify(orders));
    ORDERS = orders.sort((a,b) => b.date - a.date);
    toast('Order deleted');
    closeModal();
    renderOrdersView();
    renderFinances();
  }
};

// --- Products ---
function renderProducts() {
  $('pCount').textContent = PRODUCTS.length + ' products in store';
  $('pGrid').innerHTML = PRODUCTS.map(p => `
    <div class="pcard">
      <div class="im"><img src="${esc(p.image)}" alt="">${p.stock<1?'<span class="off">Out of stock</span>':''}</div>
      <div class="in">
        <span class="nm">${esc(p.name)}</span>
        <span class="meta">${esc(p.category)}${p.badge?" · "+esc(p.badge):""}</span>
        <span class="pr">${SM.formatPrice(p.price)}</span>
        <div class="acts">
          <button class="btn-line" onclick="editProduct('${p.id}')">Edit</button>
          <button class="warn btn-line" onclick="delProduct('${p.id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

$('addProduct').onclick = () => editProduct(null);
window.editProduct = function(id) {
  const p = id ? PRODUCTS.find(x => x.id === id) : null;
  openModal(`
    <h3>${p ? 'Edit Product' : 'Add Product'}</h3>
    <input type="hidden" id="fpId" value="${p ? p.id : ''}">
    <label>Name</label><input type="text" id="fpName" value="${p ? esc(p.name) : ''}">
    <div class="row2">
      <div><label>Category</label><select id="fpCat">
        <option ${p&&p.category==='Kitchen'?'selected':''}>Kitchen</option>
        <option ${p&&p.category==='Desk & Study'?'selected':''}>Desk & Study</option>
        <option ${p&&p.category==='Home Comfort'?'selected':''}>Home Comfort</option>
      </select></div>
      <div><label>Badge (Optional)</label><input type="text" id="fpBadge" value="${p ? esc(p.badge||'') : ''}"></div>
    </div>
    <div class="row2">
      <div><label>Price (Rs)</label><input type="number" id="fpPrice" value="${p ? p.price : ''}"></div>
      <div><label>Old Price (Rs)</label><input type="number" id="fpOld" value="${p ? p.oldPrice||0 : 0}"></div>
    </div>
    <div class="row2">
      <div><label>Stock</label><input type="number" id="fpStock" value="${p ? p.stock : 10}"></div>
      <div><label>Image URL</label><input type="text" id="fpImg" value="${p ? esc(p.image) : ''}"></div>
    </div>
    <label>Description</label><textarea id="fpDesc">${p ? esc(p.description) : ''}</textarea>
    <div class="foot">
      <button class="btn btn-crimson" onclick="saveProduct()">Save Product</button>
    </div>
  `);
};

window.saveProduct = function() {
  const id = $('fpId').value;
  const pData = {
    name: $('fpName').value,
    category: $('fpCat').value,
    badge: $('fpBadge').value,
    price: parseInt($('fpPrice').value),
    oldPrice: parseInt($('fpOld').value) || 0,
    stock: parseInt($('fpStock').value),
    image: $('fpImg').value,
    description: $('fpDesc').value
  };
  
  if(id) {
    const idx = PRODUCTS.findIndex(x => x.id === id);
    PRODUCTS[idx] = { ...PRODUCTS[idx], ...pData };
  } else {
    pData.id = 'prod_' + Date.now();
    pData.reviews = 0; pData.rating = 5.0;
    PRODUCTS.push(pData);
  }
  
  localStorage.setItem('sm_products', JSON.stringify(PRODUCTS));
  renderProducts();
  closeModal();
  toast('Product saved');
};

window.delProduct = function(id) {
  if (confirm('Delete product?')) {
    PRODUCTS = PRODUCTS.filter(x => x.id !== id);
    localStorage.setItem('sm_products', JSON.stringify(PRODUCTS));
    renderProducts();
    toast('Product deleted');
  }
};

// --- Finances ---
function renderFinances() {
  const deliveredSales = ORDERS.filter(o => o.status === 'delivered').reduce((s,o) => s + o.total, 0);
  const totalCosts = EXPENSES.reduce((s,c) => s + c.amount, 0);
  const profit = deliveredSales - totalCosts;
  
  $('fSale').textContent = SM.formatPrice(deliveredSales);
  $('fCost').textContent = SM.formatPrice(totalCosts);
  $('fProf').textContent = SM.formatPrice(profit);
  $('fProf').className = profit >= 0 ? 'profit-pos' : 'profit-neg';
  
  $('finExpList').innerHTML = EXPENSES.map(c => `
    <div class="exp-row">
      <div class="cat">${c.category}</div>
      <div class="d">${esc(c.note)}<small>${new Date(c.date).toLocaleDateString()}</small></div>
      <div class="amt">${SM.formatPrice(c.amount)}</div>
      <button class="xd" onclick="deleteCost(${c.id})">×</button>
    </div>
  `).join('');
}

$('feAdd').onclick = () => {
  const amt = parseInt($('feAmt').value);
  const d = $('feDate').value;
  if (!amt || !d) return toast('Fill required fields');
  
  EXPENSES.push({
    id: Date.now(),
    date: new Date(d).getTime(),
    amount: amt,
    category: $('feCat').value,
    note: $('feDesc').value
  });
  
  localStorage.setItem('sm_costs', JSON.stringify(EXPENSES));
  $('feAmt').value = ''; $('feDesc').value = '';
  EXPENSES.sort((a,b) => b.date - a.date);
  renderFinances();
  toast('Cost added');
};

window.deleteCost = function(id) {
  if (confirm('Delete expense?')) {
    EXPENSES = EXPENSES.filter(x => x.id !== id);
    localStorage.setItem('sm_costs', JSON.stringify(EXPENSES));
    renderFinances();
  }
};

// --- Settings ---
function renderSettings() {
  const s = SM.getSettings();
  $('set-ann').value = s.announcement;
  $('set-fee-in').value = s.deliveryFeeInside;
  $('set-fee-out').value = s.deliveryFeeOutside;
  $('set-free').value = s.freeDeliveryThreshold;
  $('set-pin').value = s.adminPin;
}

$('saveSettings').onclick = () => {
  const s = SM.getSettings();
  s.announcement = $('set-ann').value;
  s.deliveryFeeInside = parseInt($('set-fee-in').value);
  s.deliveryFeeOutside = parseInt($('set-fee-out').value);
  s.freeDeliveryThreshold = parseInt($('set-free').value);
  s.adminPin = $('set-pin').value;
  
  localStorage.setItem('sm_settings', JSON.stringify(s));
  toast('Settings saved');
};
