import json

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

print(f"Products in products.json: {len(products)}")
print(f"Products in staged: {len(staged)}")

# Check how many brand/name overlap
brands_p = set(p.get('brand', '').strip().upper() for p in products)
brands_s = set(s.get('brand', '').strip().upper() for s in staged)

print(f"Brands in products.json: {len(brands_p)}")
print(f"Brands in staged: {len(brands_s)}")
print(f"Common brands: {len(brands_p.intersection(brands_s))}")
print("Sample common brands:", list(brands_p.intersection(brands_s))[:15])

# What brands are in products.json that are NOT in staged?
missing_brands = brands_p - brands_s
print(f"Brands in products.json NOT in staged: {len(missing_brands)}")
print("Sample missing brands:", list(missing_brands)[:15])
