const fs = require('fs');
let html = fs.readFileSync('checkout.html', 'utf8');

// 1. Replace the select dropdowns with text inputs
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
                  <input type="text" name="city" required placeholder="e.g. Kathmandu">
                </div>
                <div class="pay-form-group">
                  <label>Zone (Province) *</label>
                  <input type="text" name="zone" required placeholder="e.g. Bagmati">
                </div>
              </div>
              
              <div class="pay-form-group">
                <label>Area *</label>
                <input type="text" name="area" required placeholder="e.g. Baneshwor">
              </div>`;

html = html.replace(oldUI, newUI);

// 2. Remove the Pathao JS initialization logic from DOMContentLoaded
const jsToRemove = `      // Initialize Pathao logic
      let settings = SM.getSettings();
      if (!settings.pathaoClient) {
        try {
          const snap = await db.collection('settings').doc('store').get();
          if(snap.exists) settings = snap.data();
        } catch(e){}
      }
      let pathaoToken = '';
      async function fetchPathao(endpoint, method = 'GET', body = null) {
        const headers = { 'Authorization': pathaoToken ? \`Bearer \${pathaoToken}\` : '' };
        const res = await fetch('/api/pathao', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: 'https://api-hermes.pathao.com' + endpoint, method, headers, body })
        });
        return res.json();
      }

      if (settings.pathaoClient) {
        try {
          const authRes = await fetchPathao('/aladdin/api/v1/issue-token', 'POST', {
            client_id: settings.pathaoClient, client_secret: settings.pathaoSecret,
            username: settings.pathaoUser, password: settings.pathaoPass, grant_type: 'password'
          });
          pathaoToken = authRes.access_token || (authRes.data && authRes.data.access_token) || authRes.id_token;
          
          document.getElementById('pathaoCity').innerHTML = '<option value="">Loading Cities...</option>';
          const citiesRes = await fetchPathao('/aladdin/api/v1/countries/1/city-list');
          const cities = citiesRes.data.data || citiesRes.data;
          document.getElementById('pathaoCity').innerHTML = '<option value="">-- Select City --</option>' + cities.map(c => \`<option value="\${c.city_id}">\${c.city_name}</option>\`).join('');
        } catch (e) {
          console.error('Pathao Init Error:', e);
          document.getElementById('pathaoCity').innerHTML = '<option value="">Failed to load cities</option>';
        }
      }

      window.loadPathaoZones = async () => {
        const cid = document.getElementById('pathaoCity').value;
        if(!cid) return;
        document.getElementById('pathaoZone').innerHTML = '<option value="">Loading...</option>';
        try {
          const zRes = await fetchPathao('/aladdin/api/v1/cities/' + cid + '/zone-list');
          const zones = zRes.data.data || zRes.data;
          document.getElementById('pathaoZone').innerHTML = '<option value="">-- Select Zone --</option>' + zones.map(z => \`<option value="\${z.zone_id}">\${z.zone_name}</option>\`).join('');
        } catch(e) {
          document.getElementById('pathaoZone').innerHTML = '<option value="">Failed to load</option>';
        }
      };

      window.loadPathaoAreas = async () => {
        const zid = document.getElementById('pathaoZone').value;
        if(!zid) return;
        document.getElementById('pathaoArea').innerHTML = '<option value="">Loading...</option>';
        try {
          const aRes = await fetchPathao('/aladdin/api/v1/zones/' + zid + '/area-list');
          const areas = aRes.data.data || aRes.data;
          document.getElementById('pathaoArea').innerHTML = '<option value="">-- Select Area --</option>' + areas.map(a => \`<option value="\${a.area_id}">\${a.area_name}</option>\`).join('');
        } catch(e) {
          document.getElementById('pathaoArea').innerHTML = '<option value="">Failed to load</option>';
        }
      };`;

html = html.replace(jsToRemove, '');

// 3. Update the form submit logic to get the values correctly
// Originally it did: const cityEl = document.getElementById('pathaoCity'); ... city = cityEl.options[cityEl.selectedIndex].text
// Let's replace that block
const oldSubmitFields = `const cityEl = document.getElementById('pathaoCity');
        const zoneEl = document.getElementById('pathaoZone');
        const areaEl = document.getElementById('pathaoArea');
        const city = cityEl.options && cityEl.selectedIndex >= 0 ? cityEl.options[cityEl.selectedIndex].text : cityEl.value;
        const zone = zoneEl.options && zoneEl.selectedIndex >= 0 ? zoneEl.options[zoneEl.selectedIndex].text : zoneEl.value;
        const area = areaEl.options && areaEl.selectedIndex >= 0 ? areaEl.options[areaEl.selectedIndex].text : areaEl.value;`;

const newSubmitFields = `const city = document.querySelector('input[name="city"]').value.trim();
        const zone = document.querySelector('input[name="zone"]').value.trim();
        const area = document.querySelector('input[name="area"]').value.trim();`;
        
html = html.replace(oldSubmitFields, newSubmitFields);

fs.writeFileSync('checkout.html', html);
console.log('checkout inputs updated');
