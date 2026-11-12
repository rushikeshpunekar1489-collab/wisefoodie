import json

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with_img = [p for p in products if p.get('image') or p.get('imageUrl')]
print(f"Total with img: {len(with_img)}")
for p in with_img[:10]:
    print(f"id={p['id']}, name={p['name']}, brand={p.get('brand')}, image={p.get('image')}")
