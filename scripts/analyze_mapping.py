import json
import os

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

print(f"Products in products.json: {len(products)}")
print(f"Products in staged: {len(staged)}")

staged_by_id = {p.get('id'): p for p in staged}
staged_by_name = {p.get('name', '').strip().lower(): p for p in staged}

matched_id = 0
matched_name = 0
unmatched = []

for p in products:
    pid = p.get('id')
    name = (p.get('name') or '').strip().lower()
    img = p.get('image') or p.get('imageUrl')
    
    if img:
        continue # already has image
        
    # check by id
    if pid in staged_by_id and staged_by_id[pid].get('image'):
        matched_id += 1
    elif name in staged_by_name and staged_by_name[name].get('image'):
        matched_name += 1
    else:
        unmatched.append(p)

print(f"Products needing image: {852 - 304} = 548")
print(f"Matched in staged by exact ID: {matched_id}")
print(f"Matched in staged by exact Name: {matched_name}")
print(f"Still unmatched from staged: {len(unmatched)}")

if unmatched:
    print(f"\nFirst 15 unmatched products:")
    for p in unmatched[:15]:
        print(f"  id: {p.get('id')}, name: {p.get('name')}, brand: {p.get('brand')}, category: {p.get('category')}")
