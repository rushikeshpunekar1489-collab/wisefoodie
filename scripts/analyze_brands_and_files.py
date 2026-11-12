import os
import json
import re

files = os.listdir('public/products')
print(f"Total image files in public/products: {len(files)}")

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Group products by brand
brands = {}
for p in products:
    b = p.get('brand', 'UNKNOWN').strip()
    brands.setdefault(b, []).append(p)

print(f"\nUnique brands in 852 products: {len(brands)}")
for b, plist in sorted(brands.items(), key=lambda x: len(x[1]), reverse=True)[:20]:
    print(f"  {b}: {len(plist)} items")

# Check how many public/products filenames start with brand names or contain product names
print("\nSample filenames in public/products:")
for f in sorted(files)[:30]:
    print(f"  {f}")
