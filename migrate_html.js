const fs = require('fs');

const firebaseScripts = `
  <!-- Firebase Compat SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="assets/js/firebase_init.js"></script>
`;

const htmlFiles = [
  'index.html', 'product.html', 'shop.html', 'cart.html', 'checkout.html', 'admin.html', 'order-tracking.html', 'about.html'
];

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  // Inject firebase scripts before data.js
  if (!content.includes('firebase-app-compat.js')) {
    content = content.replace('<script src="assets/js/data.js"></script>', firebaseScripts + '\n  <script src="assets/js/data.js"></script>');
  }
  
  // Convert event listener to async
  content = content.replace(/document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/g, "document.addEventListener('DOMContentLoaded', async () => {");
  
  // Convert SM calls to await
  content = content.replace(/const settings = SM\.getSettings\(\);/g, 'const settings = await SM.getSettings();');
  content = content.replace(/const products = SM\.getProducts\(\);/g, 'const products = await SM.getProducts();');
  content = content.replace(/let orders = SM\.getOrders\(\);/g, 'let orders = await SM.getOrders();');
  content = content.replace(/const orders = SM\.getOrders\(\);/g, 'const orders = await SM.getOrders();');
  content = content.replace(/ORDERS = SM\.getOrders\(\)\.sort/g, 'ORDERS = (await SM.getOrders()).sort');
  content = content.replace(/PRODUCTS = SM\.getProducts\(\);/g, 'PRODUCTS = await SM.getProducts();');
  content = content.replace(/const currentProduct = SM\.getProduct\(productId\);/g, 'const currentProduct = await SM.getProduct(productId);');
  
  fs.writeFileSync(file, content);
});

// Create firebase_init.js
const firebaseInitCode = `
const firebaseConfig = {
  projectId: "swiftmart-nepal-db",
  appId: "1:1073632338094:web:3d620c49a66c2cbf0a0d3f",
  storageBucket: "swiftmart-nepal-db.firebasestorage.app",
  apiKey: "AIzaSyAEL58j-iLYUWvDdFb7J2euZ2Yk7GTMphc",
  authDomain: "swiftmart-nepal-db.firebaseapp.com",
  messagingSenderId: "1073632338094"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
`;
fs.writeFileSync('assets/js/firebase_init.js', firebaseInitCode);

console.log('HTML files and firebase_init.js successfully generated.');
