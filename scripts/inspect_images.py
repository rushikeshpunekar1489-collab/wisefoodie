import json
import os
import glob

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Total products in data/products.json: {len(products)}")

img_counts = 0
local_exists = 0
missing_local = []
external_urls = []
empty_images = []

public_products_files = set(os.listdir('public/products'))
print(f"Total files in public/products: {len(public_products_files)}")

for p in products:
    img = p.get('image') or p.get('imageUrl')
    if not img:
        empty_images.append(p.get('id', 'unknown'))
    elif img.startswith('http://') or img.startswith('https://'):
        external_urls.append((p.get('id'), p.get('name'), img))
    else:
        # local path, e.g. /products/xyz.webp or products/xyz.webp
        clean_path = img.lstrip('/')
        filename = os.path.basename(clean_path)
        if filename in public_products_files:
            local_exists += 1
        else:
            missing_local.append((p.get('id'), p.get('name'), img))

print(f"Empty/No image: {len(empty_images)}")
print(f"External URLs: {len(external_urls)}")
print(f"Local files matched in public/products: {local_exists}")
print(f"Local files MISSING from public/products: {len(missing_local)}")

if external_urls:
    print("\nSample external URLs:")
    for item in external_urls[:10]:
        print("  ", item)

if missing_local:
    print("\nSample missing local paths:")
    for item in missing_local[:10]:
        print("  ", item)

if empty_images:
    print("\nSample empty images:")
    for item in empty_images[:10]:
        print("  ", item)
