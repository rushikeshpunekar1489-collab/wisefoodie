import json
import os

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# count how many products per brand
unmatched_by_brand = {}
for p in products:
    brand = p.get('brand', 'Unknown')
    unmatched_by_brand[brand] = unmatched_by_brand.get(brand, 0) + 1

print(f"Total brands in catalog: {len(unmatched_by_brand)}")
for b, count in sorted(unmatched_by_brand.items(), key=lambda x: x[1], reverse=True)[:30]:
    print(f"  {b}: {count}")
