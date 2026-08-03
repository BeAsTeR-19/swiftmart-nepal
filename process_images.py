import os
from PIL import Image

def remove_white(img_path):
    if not os.path.exists(img_path):
        return
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # if white or very close to white, make transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(img_path, "PNG")

remove_white("assets/images/cod-icon.png")
remove_white("assets/images/bank-transfer-icon.png")
print("Images processed.")
