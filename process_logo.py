from PIL import Image

def process_logo():
    img = Image.open('assets/images/logo.jpeg').convert("RGBA")
    data = img.getdata()
    
    new_data = []
    # Find bounding box
    min_x, min_y = img.width, img.height
    max_x, max_y = 0, 0
    
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = data[y * img.width + x]
            # If not purely white (allowing some tolerance for jpeg artifacts)
            if not (r > 240 and g > 240 and b > 240):
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    # Add a tiny 10px padding
    pad = 10
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(img.width, max_x + pad)
    max_y = min(img.height, max_y + pad)
    
    cropped = img.crop((min_x, min_y, max_x, max_y))
    
    # Make white transparent
    cdata = cropped.getdata()
    cnew_data = []
    for item in cdata:
        # If it's very bright (white-ish), make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            cnew_data.append((255, 255, 255, 0))
        else:
            cnew_data.append(item)
            
    cropped.putdata(cnew_data)
    cropped.save('assets/images/logo_clean.png', "PNG")
    print(f"Processed logo to size: {cropped.width}x{cropped.height}")

if __name__ == '__main__':
    process_logo()
