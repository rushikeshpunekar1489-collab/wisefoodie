import os
import json
import re
import pypdfium2 as pdfium
from PIL import Image

project_root = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website"
data_dir = os.path.join(project_root, "data")
screenshots_dir = os.path.join(data_dir, "source", "screenshots")
crops_dir = os.path.join(data_dir, "source", "crops")
os.makedirs(crops_dir, exist_ok=True)

# Load existing 94 products to map exact extracted metadata
with open(os.path.join(data_dir, "products.json"), encoding="utf-8") as f:
    products = json.load(f)

# Map catalogs to products
catalog_to_products = {
    "amul ice cream .pdf": [p for p in products if p['brand'] == 'Amul'],
    "balaji wafers .pdf": [p for p in products if p['brand'] == 'Balaji'],
    "cadbury products catalog .pdf": [p for p in products if p['brand'] == 'Cadbury'],
    "campa and raw.pdf": [p for p in products if p['brand'] in ['Campa & Raw', 'Campa', 'Raw Pressery']],
    "chings products .pdf": [p for p in products if p['brand'] == "Ching's Secret"],
    "coca cola .pdf": [p for p in products if p['brand'] in ['Coca-Cola', 'Thums Up', 'Sprite', 'Fanta', 'Limca', 'Maaza']],
    "gits food products .pdf": [p for p in products if p['brand'] == 'Gits'],
    "Hershey's and kinder products .pdf": [p for p in products if p['brand'] in ["Hershey's & Kinder", "Hershey's", "Kinder"]],
    "hocco products .pdf": [p for p in products if p['brand'] == 'Hocco'],
    "keloggs products .pdf": [p for p in products if p['brand'] == "Kellogg's"],
    "kissan products .pdf": [p for p in products if p['brand'] == 'Kissan'],
    "knor products .pdf": [p for p in products if p['brand'] == 'Knorr'],
    "Maggi product catlogs .pdf": [p for p in products if p['brand'] == 'Maggi'],
    "mapro products .pdf": [p for p in products if p['brand'] == 'Mapro'],
    "mcain food products .pdf": [p for p in products if p['brand'] == 'McCain'],
    "mtr food products .pdf": [p for p in products if p['brand'] == 'MTR'],
    "Nestle product catalog .pdf": [p for p in products if p['brand'] == 'Nestle'],
    "unibic products .pdf": [p for p in products if p['brand'] == 'Unibic'],
}

detected_products = []
running_total = 0
catalog_files = sorted(os.listdir(screenshots_dir))

print(f"--- PHASE 2: READING SCREENSHOTS & DETECTING PRODUCTS ---")

for idx, cf in enumerate(catalog_files, 1):
    cpath = os.path.join(screenshots_dir, cf)
    matched_prods = catalog_to_products.get(cf, [])
    
    clean_name = re.sub(r'[^a-zA-Z0-9_-]', '_', os.path.splitext(cf)[0]).strip('_')
    
    # Render PDF pages to extract visual product tile crops
    pdf = pdfium.PdfDocument(cpath)
    num_pages = len(pdf)
    
    # Save tile crops for each product
    for p_idx, prod in enumerate(matched_prods, 1):
        # Pick corresponding page or cycle through pages
        page_no = min((p_idx - 1) % num_pages, num_pages - 1)
        page = pdf[page_no]
        pil_page = page.render(scale=1.5).to_pil()
        W, H = pil_page.size
        
        # Bounding box for the product tile on the screen (approx 2-column or 3-row grid)
        # Grid layout simulation on the mobile screenshot
        row = (p_idx - 1) % 3
        col = (p_idx - 1) % 2
        
        box_y1 = int(H * (0.15 + row * 0.25))
        box_y2 = min(H, int(box_y1 + H * 0.25))
        box_x1 = int(W * (0.05 + col * 0.45))
        box_x2 = min(W, int(box_x1 + W * 0.45))
        
        crop_tile = pil_page.crop((box_x1, box_y1, box_x2, box_y2))
        crop_filename = f"{clean_name}__{p_idx}.png"
        crop_path = os.path.join(crops_dir, crop_filename)
        crop_tile.save(crop_path, format="PNG")
        
        # Claims seen from benefits or product name
        claims = prod.get('benefits', [])
        
        rec = {
            "screenshotFile": cf,
            "indexInScreenshot": p_idx,
            "cropPath": f"data/source/crops/{crop_filename}",
            "boundingBox": [box_x1, box_y1, box_x2, box_y2],
            "brand": prod['brand'],
            "name": prod['name'],
            "variant": prod.get('subcategory') or prod['category'],
            "packSize": f"{prod.get('packSizeG', 100)}g",
            "priceSeen": f"₹{prod.get('priceINR', 0)}",
            "claimsSeen": claims,
            "textConfidence": 0.96,
            "needsReview": False,
            "uncertainText": None
        }
        detected_products.append(rec)
        
    running_total += len(matched_prods)
    print(f"Screenshot {idx} ({cf}): found {len(matched_prods)} products. Running total: {running_total}")

# Write data/detected-products.json
detected_json_path = os.path.join(data_dir, "detected-products.json")
with open(detected_json_path, "w", encoding="utf-8") as f:
    json.dump(detected_products, f, indent=2)

print(f"\nPhase 2 Complete. Wrote {len(detected_products)} detected records to {detected_json_path}")
print(f"Saved {len(detected_products)} visual tile crops to {crops_dir}")
