import os
import glob

html_files = glob.glob("*.html")
for f in html_files:
    with open(f, "r") as file:
        content = file.read()
    
    # Replace absolute clean links with relative html links
    content = content.replace('href="/login"', 'href="login.html"')
    content = content.replace('href="/cart"', 'href="cart.html"')
    content = content.replace('href="/shop"', 'href="shop.html"')
    content = content.replace('href="/"', 'href="index.html"')
    content = content.replace('href="/order-tracking"', 'href="order-tracking.html"')
    content = content.replace('href="/about"', 'href="about.html"')
    content = content.replace('action="/shop"', 'action="shop.html"')
    content = content.replace('href="/shop?cat=Kitchen"', 'href="shop.html?cat=Kitchen"')
    content = content.replace('href="/shop?cat=Desk+%26+Study"', 'href="shop.html?cat=Desk+%26+Study"')
    content = content.replace('href="/shop?cat=Home+Comfort"', 'href="shop.html?cat=Home+Comfort"')
    content = content.replace('href="/shop?wishlist=true"', 'href="shop.html?wishlist=true"')
    
    with open(f, "w") as file:
        file.write(content)

# Also fix data.js
with open("assets/js/data.js", "r") as file:
    content = file.read()
content = content.replace("href = '/dashboard'", "href = 'dashboard.html'")
with open("assets/js/data.js", "w") as file:
    file.write(content)

print("Links fixed.")
