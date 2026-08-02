const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');
html = html.replace(/\\`/g, '`');
html = html.replace(/\\\${/g, '${');
fs.writeFileSync('admin.html', html);
