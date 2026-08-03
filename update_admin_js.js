const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf-8');

adminHtml = adminHtml.replace(
  "localStorage.setItem('sm_orders', JSON.stringify(orders));",
  "// removed localStorage set"
);
adminHtml = adminHtml.replace(
  "localStorage.setItem('sm_orders', JSON.stringify(orders));",
  "// removed localStorage set"
);
adminHtml = adminHtml.replace(
  "let orders = await SM.getOrders();\\n  orders.push(order);\\n  localStorage.setItem('sm_orders', JSON.stringify(orders));",
  "await window.db.collection('orders').doc(order.id).set(order);"
);
adminHtml = adminHtml.replace(
  "o.status = st;",
  "await SM.updateOrderStatus(id, st);"
);
adminHtml = adminHtml.replace(
  "let orders = SM.getOrders().filter(x => x.id !== id);",
  "await SM.deleteOrder(id);"
);

// Fix finances
adminHtml = adminHtml.replace(
  "EXPENSES.push({",
  "await SM.addCost({"
);
adminHtml = adminHtml.replace(
  "localStorage.setItem('sm_costs', JSON.stringify(EXPENSES));",
  "// use SM.addCost instead"
);
adminHtml = adminHtml.replace(
  "window.deleteCost = function(id) {\\n  if (confirm('Delete expense?')) {\\n    EXPENSES = EXPENSES.filter(x => x.id !== id);\\n    localStorage.setItem('sm_costs', JSON.stringify(EXPENSES));\\n    renderFinances();\\n  }\\n};",
  "window.deleteCost = async function(id) {\\n  if (confirm('Delete expense?')) {\\n    await SM.deleteCost(id);\\n    EXPENSES = await SM.getCosts();\\n    renderFinances();\\n  }\\n};"
);

// Fix settings save
adminHtml = adminHtml.replace(
  "localStorage.setItem('sm_settings', JSON.stringify(s));",
  "await SM.saveSettings(s);"
);

// Let's just use string replacements for async function signatures where needed
adminHtml = adminHtml.replace("window.setStatus = function(id, st) {", "window.setStatus = async function(id, st) {");
adminHtml = adminHtml.replace("window.deleteOrder = function(id) {", "window.deleteOrder = async function(id) {");
adminHtml = adminHtml.replace("$('saveSettings').onclick = () => {", "$('saveSettings').onclick = async () => {");
adminHtml = adminHtml.replace("$('feAdd').onclick = () => {", "$('feAdd').onclick = async () => {");
adminHtml = adminHtml.replace("$('addProduct').onclick = () => editProduct(null);", "$('addProduct').onclick = async () => editProduct(null);");

// Let's rewrite checkAuth to use Firebase Auth if it was configured, otherwise keep the local password. 
// For now, I'll keep the local password because the auth user creation failed.

fs.writeFileSync('admin.html', adminHtml);
console.log('admin.html updated');
