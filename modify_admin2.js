const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf-8');

// Add cropper CSS and JS if not present
if (!html.includes('cropper.min.css')) {
  html = html.replace('</head>', '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css">\n</head>');
  html = html.replace('</body>', '  <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>\n</body>');
}

// Update the Product Modal HTML to include Cropper container and logic
const oldImgInputHtml = `<input type="file" id="fpImgFile" accept="image/*" style="margin-bottom:6px">`;
const newImgInputHtml = `<input type="file" id="fpImgFile" accept="image/*" style="margin-bottom:6px">
        <div id="cropContainer" style="display:none; margin:10px 0;">
          <div style="max-height:300px; overflow:hidden;">
            <img id="cropImage" style="max-width:100%; display:block;">
          </div>
          <div style="display:flex;gap:10px;margin-top:10px;">
            <button class="btn btn-line" type="button" onclick="cropper.rotate(-90)">Rotate Left</button>
            <button class="btn btn-line" type="button" onclick="cropper.rotate(90)">Rotate Right</button>
            <button class="btn btn-gold" type="button" onclick="applyCrop()">Apply Crop</button>
          </div>
        </div>`;
html = html.replace(oldImgInputHtml, newImgInputHtml);

// Add the cropper logic in the script section
const cropperLogic = `
let cropper = null;

// This will run when the file input changes
document.addEventListener('change', function(e) {
  if(e.target && e.target.id === 'fpImgFile') {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        $('cropImage').src = event.target.result;
        $('cropContainer').style.display = 'block';
        $('fpImg').value = ''; // clear url input since we are uploading
        if(cropper) { cropper.destroy(); }
        cropper = new Cropper($('cropImage'), {
          aspectRatio: 1, // 1:1 square ratio for product images
          viewMode: 2
        });
      };
      reader.readAsDataURL(file);
    }
  }
});

window.applyCrop = function() {
  if(!cropper) return;
  const canvas = cropper.getCroppedCanvas({
    width: 600,
    height: 600
  });
  $('fpImg').value = canvas.toDataURL('image/jpeg', 0.8);
  $('cropContainer').style.display = 'none';
  toast('Image cropped successfully');
};
`;

if (!html.includes('cropper = null')) {
  html = html.replace('// --- Products ---', cropperLogic + '\n// --- Products ---');
}

// Update saveProduct to just use $('fpImg').value if it was populated by cropper
// We already modified saveProduct in previous script, let's fix it to respect the cropped data URL
// Previously:
/*
  if (fileInput && fileInput.files && fileInput.files[0]) {
    // Read file as data URL
    imgVal = await new Promise(res => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    });
  }
*/
const oldSaveBlock = `if (fileInput && fileInput.files && fileInput.files[0]) {
    // Read file as data URL
    imgVal = await new Promise(res => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    });
  }`;
const newSaveBlock = `if (!$('fpImg').value && fileInput && fileInput.files && fileInput.files[0]) {
    // Fallback if user didn't hit 'Apply Crop'
    imgVal = await new Promise(res => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    });
  }`;
html = html.replace(oldSaveBlock, newSaveBlock);

fs.writeFileSync('admin.html', html);
console.log('admin.html updated with cropper.');
