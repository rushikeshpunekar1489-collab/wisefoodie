import json
import os

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))
print(f"Total staged products: {len(staged)}")
print(f"Total public files: {len(public_files)}")

staged_matched_files = 0
for p in staged:
    img = p.get('image', '').lstrip('/')
    fn = os.path.basename(img)
    if fn in public_files:
        staged_matched_files += 1

print(f"Staged products with exact file existing in public/products: {staged_matched_files} / {len(staged)}")

# Let's inspect data/products.json vs data/packaged_foods_india.json vs staged
with open('data/products.json', 'r', encoding='utf-8') as f:
    current_products = json.load(f)

print(f"Current products.json count: {len(current_products)}")
print("Sample current products fields:", list(current_products[0].keys()))
print("Sample staged products fields:", list(staged[0].keys()))
