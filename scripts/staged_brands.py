import json

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

# list brands in staged
staged_brands = {}
for p in staged:
    b = p.get('brand', 'Unknown')
    staged_brands[b] = staged_brands.get(b, 0) + 1

for b, count in sorted(staged_brands.items(), key=lambda x: x[1], reverse=True)[:30]:
    print(f"  {b}: {count}")
