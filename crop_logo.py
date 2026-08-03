from PIL import Image, ImageChops

# Load image and convert to grayscale
img = Image.open('assets/images/logo.jpeg')
gray = img.convert('L')

# Threshold: pixels < 240 become 255 (white/active), else 0 (black/bg)
thresh = gray.point(lambda p: 255 if p < 240 else 0)

# Get bounding box of all non-zero regions
bbox = thresh.getbbox()
if bbox:
    left, upper, right, lower = bbox
    
    # We want only the left-most icon. The icon is usually separated from text by a gap.
    # Let's scan columns from 'left' to 'right' to find the first completely empty column (gap)
    # in the thresholded image.
    width, height = thresh.size
    
    gap_x = right
    for x in range(left, right):
        # check if this column is empty (all pixels are 0)
        column_pixels = [thresh.getpixel((x, y)) for y in range(upper, lower)]
        if max(column_pixels) == 0:
            # We found a gap! The icon ends here.
            gap_x = x
            break
            
    # Crop to just the icon
    icon_box = (left, upper, gap_x, lower)
    cropped = img.crop(icon_box)
    
    # Add a small padding (white background)
    padding = 10
    new_width = (gap_x - left) + 2*padding
    new_height = (lower - upper) + 2*padding
    
    # Make a square if we want, or just pad it
    final_img = Image.new('RGB', (new_width, new_height), (255, 255, 255))
    final_img.paste(cropped, (padding, padding))
    
    final_img.save('assets/images/logo.jpeg', quality=95)
    print("Logo successfully cropped to the left-most icon using PIL.")
else:
    print("No bounding box found.")
