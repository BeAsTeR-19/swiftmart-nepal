const fs = require('fs');
let html = fs.readFileSync('checkout.html', 'utf8');

// 1. Replace the Pathao Selects with Text Inputs
const oldUI = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="pay-form-group">
                  <label>City *</label>
                  <select name="city" id="pathaoCity" required onchange="loadPathaoZones()">
                    <option value="">Loading Cities...</option>
                  </select>
                </div>
                <div class="pay-form-group">
                  <label>Zone *</label>
                  <select name="zone" id="pathaoZone" required onchange="loadPathaoAreas()">
                    <option value="">Select City first</option>
                  </select>
                </div>
              </div>
              
              <div class="pay-form-group">
                <label>Area *</label>
                <select name="area" id="pathaoArea" required>
                  <option value="">Select Zone first</option>
                </select>
              </div>`;

const newUI = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="pay-form-group">
                  <label>City *</label>
                  <input type="text" name="city" id="pathaoCity" required placeholder="e.g. Kathmandu">
                </div>
                <div class="pay-form-group">
                  <label>Zone (Province) *</label>
                  <input type="text" name="zone" id="pathaoZone" required placeholder="e.g. Bagmati">
                </div>
              </div>
              
              <div class="pay-form-group">
                <label>Area *</label>
                <input type="text" name="area" id="pathaoArea" required placeholder="e.g. Baneshwor">
              </div>`;

html = html.replace(oldUI, newUI);

// 2. Unhide zone-select
const oldZone = `<div class="pay-form-group" style="display:none;">
                <label>Delivery Zone *</label>
                <select name="deliveryZone" id="zone-select" onchange="updateTotals()">
                  <option value="inside">Inside Kathmandu Valley</option>
                  <option value="outside">Outside Valley</option>
                </select>
              </div>`;
const newZone = `<div class="pay-form-group">
                <label>Delivery Location *</label>
                <select name="deliveryZone" id="zone-select" onchange="updateTotals()">
                  <option value="inside">Inside Kathmandu Valley</option>
                  <option value="outside">Outside Valley</option>
                </select>
              </div>`;
html = html.replace(oldZone, newZone);

// 3. Remove Pathao JS
const re = /\/\/ Initialize Pathao logic[\s\S]*?\} catch\(e\) \{\n          document\.getElementById\('pathaoArea'\)\.innerHTML = '<option value="">Failed to load<\/option>';\n        \}\n      \};/m;
html = html.replace(re, '');

// 4. Update the extraction logic on form submit
const oldExtract = `const cityEl = document.getElementById('pathaoCity');
        const zoneEl = document.getElementById('pathaoZone');
        const areaEl = document.getElementById('pathaoArea');
        
        data.city = cityEl.options[cityEl.selectedIndex]?.text || '';
        data.zone = zoneEl.options[zoneEl.selectedIndex]?.text || '';
        data.area = areaEl.options[areaEl.selectedIndex]?.text || '';`;

const newExtract = `const cityEl = document.getElementById('pathaoCity');
        const zoneEl = document.getElementById('pathaoZone');
        const areaEl = document.getElementById('pathaoArea');
        
        data.city = cityEl.value.trim();
        data.zone = zoneEl.value.trim();
        data.area = areaEl.value.trim();`;

html = html.replace(oldExtract, newExtract);

fs.writeFileSync('checkout.html', html);
console.log('checkout fixed');
