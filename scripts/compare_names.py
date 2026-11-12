import json
import os

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

print("First 15 products from products.json:")
for p in products[:15]:
    print(f"  [{p.get('id')}] Brand: '{p.get('brand')}' | Name: '{p.get('name')}'")

print("\nFirst 15 products from staged:")
for p in staged[:15]:
    print(f"  [{p.get('id')}] Brand: '{p.get('brand')}' | Name: '{p.get('name')}' | Img: '{p.get('image')}'")
