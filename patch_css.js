const fs = require('fs');

let css = fs.readFileSync('assets/css/styles.css', 'utf-8');

// Update variables
css = css.replace('--primary: #001f5b;', '--primary: #2563eb;');
css = css.replace('--primary-light: #0a3175;', '--primary-light: #5555ff;');

// Update header
css = css.replace(
  '.header{background:var(--primary);color:#fff;border-bottom:none;position:sticky;top:0;z-index:100}',
  '.header{background:#fff;color:var(--text);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}'
);

css = css.replace(
  '.logo-link{display:flex;align-items:center;gap:8px;flex-shrink:0;color:#fff}',
  '.logo-link{display:flex;align-items:center;gap:8px;flex-shrink:0;color:var(--primary)}'
);

css = css.replace(
  '.logo-text{font-family:var(--font-h);font-size:20px;font-weight:800;color:#fff;letter-spacing:-.5px}',
  '.logo-text{font-family:var(--font-h);font-size:20px;font-weight:800;color:var(--primary);letter-spacing:-.5px}'
);

css = css.replace(
  '.search-wrap input{width:100%;padding:10px 16px 10px 42px;border:none;border-radius:100px;background:#fff;font-size:14px;color:var(--text);transition:all .2s}',
  '.search-wrap form{display:flex;border:1.5px solid var(--primary);border-radius:100px;overflow:hidden;background:#fff;}\n.search-wrap input{flex:1;border:none;padding:10px 16px;outline:none;font-size:14px;color:var(--text);}\n.search-btn{background:var(--primary-light);color:#fff;border:none;padding:0 24px;font-weight:600;cursor:pointer;transition:background 0.2s}\n.search-btn:hover{background:var(--primary)}'
);
css = css.replace(
  '.search-wrap input:focus{outline:none;box-shadow:0 0 0 3px rgba(255,255,255,.3)}',
  ''
);
css = css.replace(
  '.search-wrap svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-3)}',
  ''
);

css = css.replace(
  '.hdr-btn{position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius);border:none;background:transparent;cursor:pointer;color:#fff;transition:background .15s}',
  '.hdr-btn{position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:none;background:transparent;cursor:pointer;color:var(--primary-light);background:rgba(85,85,255,0.08);transition:all .15s}\n.hdr-user-btn{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);margin-left:10px;cursor:pointer}\n.hdr-user-btn .icon-user{width:40px;height:40px;border-radius:50%;background:rgba(85,85,255,0.08);color:var(--primary-light);display:flex;align-items:center;justify-content:center;}\n.hdr-user-btn .user-text{display:flex;flex-direction:column;font-size:12px;line-height:1.2;}\n.hdr-user-btn .user-text span{color:var(--text-3);}\n.hdr-user-btn .user-text strong{color:var(--text);font-weight:600;font-size:13px;}'
);
css = css.replace(
  '.hdr-btn:hover{background:rgba(255,255,255,.1)}',
  '.hdr-btn:hover{background:var(--primary-light);color:#fff}\n.hdr-user-btn:hover .icon-user{background:var(--primary-light);color:#fff}'
);

// WhatsApp float remove (the user asked to remove WhatsApp chat)
css = css.replace(
  '.wa-float{',
  '.wa-float{display:none;'
);

// Toast modifications for "comprehensive add to cart message"
// Wait, the add to cart message in the screenshot is a floating white box with green checkmark and green text.
// The current toast is `.toast`.
css = css.replace(
  '.toast{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow-lg);padding:12px 20px;font-size:14px;font-weight:500;border-left:4px solid var(--success);transform:translateX(120%);transition:transform .25s ease}',
  '.toast{background:#fff;border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:16px;font-size:14px;font-weight:500;transform:translateX(120%);transition:transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display:flex; flex-direction:column; gap:6px; min-width:300px;}\n.toast-head{display:flex;align-items:center;gap:8px;color:var(--success);font-weight:600;font-size:15px;}\n.toast-head svg{width:20px;height:20px;fill:currentColor}\n.toast-body{color:var(--text-2);font-size:13px;font-weight:400;margin-left:28px}'
);

fs.writeFileSync('assets/css/styles.css', css);
console.log('CSS updated');
