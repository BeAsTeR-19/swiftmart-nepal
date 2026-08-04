const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// 1. Modify the hero buttons
// The current hero buttons are in a <div class="flex" style="gap:12px; flex-wrap:wrap;">
const heroStart = html.indexOf('<div class="flex" style="gap:12px; flex-wrap:wrap;">');
const heroEnd = html.indexOf('</div>', heroStart) + 6;

if (heroStart !== -1) {
  const whatsappSvgMatch = html.match(/<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17\.472[^>]+><\/path><\/svg>/);
  let svg = whatsappSvgMatch ? whatsappSvgMatch[0] : '<svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';
  
  svg = svg.replace('fill="currentColor"', 'fill="#25d366"');

  const newHeroButtons = `<div class="flex" style="gap:16px; flex-wrap:wrap; margin-top: 16px;">
          <a href="shop.html" class="btn btn-primary btn-lg" style="border-radius: 100px; box-shadow: 0 8px 20px rgba(76, 97, 255, 0.4); padding: 14px 36px; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 24px rgba(76, 97, 255, 0.5)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 8px 20px rgba(76, 97, 255, 0.4)';">Browse the Store</a>
          <a href="https://wa.me/9779802483843" target="_blank" class="btn btn-lg" style="border-radius: 100px; background: rgba(255,255,255,0.15); color: #fff; border: 1.5px solid rgba(255,255,255,0.4); backdrop-filter: blur(8px); padding: 14px 36px; display: inline-flex; align-items: center; gap: 10px; transition: background 0.2s, transform 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='none';">
            \${svg}
            WhatsApp Us
          </a>
        </div>`;
  
  html = html.substring(0, heroStart) + newHeroButtons + html.substring(heroEnd);
}

// 2. Modify the CTA section
const ctaRegex = /<!-- CTA -->\s*<section class="section text-center" style="background:#e0f2f1;">[\s\S]*?<\/section>/;
const match = html.match(ctaRegex);
if (match) {
  const whatsappSvg = `<svg width="48" height="48" viewBox="0 0 24 24" fill="#ffffff" style="margin: 0 auto 16px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`;
  
  const newCta = `<!-- CTA -->
  <section class="section" style="padding: 60px 0;">
    <div class="container">
      <div style="background: linear-gradient(135deg, #128C7E 0%, #25D366 100%); border-radius: 24px; padding: 56px 32px; text-align: center; color: #fff; box-shadow: 0 16px 40px rgba(37, 211, 102, 0.25);">
        \${whatsappSvg}
        <h2 style="color: #fff; font-size: clamp(28px, 4vw, 36px); margin-bottom: 16px; font-weight: 800; line-height: 1.2;">Need Help Choosing?</h2>
        <p style="font-size: 17px; color: rgba(255,255,255,0.95); margin-bottom: 36px; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.6;">Message us directly on WhatsApp. Our team is ready to help you find the perfect products for your home.</p>
        <a href="https://wa.me/9779802483843" target="_blank" class="btn btn-lg" style="background: #fff; color: #128C7E; border-radius: 100px; font-weight: 700; padding: 16px 40px; font-size: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';">
          Chat with Us Now
        </a>
      </div>
    </div>
  </section>`;
  
  html = html.replace(match[0], newCta);
}

fs.writeFileSync('index.html', html);
console.log('Modified index.html buttons and CTA successfully');
