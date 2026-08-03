import os, glob

files = glob.glob("*.html")

target = "<p>We are a small business based in Kathmandu bringing you genuinely useful everyday products. Reliable quality, honest pricing.</p>"

socials = """<p>We are a small business based in Kathmandu bringing you genuinely useful everyday products. Reliable quality, honest pricing.</p>
          <div class="social-icons" style="display:flex; gap:16px; margin-top:20px;">
            <!-- Facebook -->
            <a href="https://www.facebook.com/profile.php?id=61592544157695" target="_blank" aria-label="Facebook" style="color:rgba(255,255,255,0.8); transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
            </a>
            <!-- WhatsApp -->
            <a href="https://wa.me/9779769753746" target="_blank" aria-label="WhatsApp" style="color:rgba(255,255,255,0.8); transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M11.996 0c-6.627 0-12 5.373-12 12 0 2.12.553 4.113 1.516 5.862l-1.516 5.863 6.002-1.576c1.713.91 3.652 1.42 5.71 1.42 6.627 0 12-5.373 12-12s-5.373-12-12-12zm6.275 17.202c-.22.617-1.282 1.185-1.776 1.258-.456.066-.99.132-3.178-.773-2.65-1.096-4.32-3.83-4.453-4.006-.13-.175-1.066-1.422-1.066-2.716 0-1.294.67-1.932.906-2.193.238-.26.516-.327.69-.327.172 0 .344.003.498.01.173.008.405-.067.632.483.238.577.818 1.99.89 2.138.073.147.12.318.032.493-.086.174-.132.282-.262.433-.13.15-.278.328-.393.454-.127.136-.26.284-.114.536.146.25 .648 1.072 1.396 1.737.962.857 1.765 1.124 2.013 1.24.248.115.394.097.54-.07.146-.168.628-.733.796-.985.168-.252.336-.208.563-.122.228.087 1.439.678 1.685.802.247.123.41.183.47.284.06.103.06.595-.16 1.213z"/></svg>
            </a>
            <!-- Instagram -->
            <a href="#" target="_blank" aria-label="Instagram" style="color:rgba(255,255,255,0.8); transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>"""

for f in files:
    with open(f, "r") as file:
        content = file.read()
    if target in content and "social-icons" not in content:
        content = content.replace(target, socials)
        with open(f, "w") as file:
            file.write(content)
        print(f"Updated {f}")
