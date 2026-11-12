import json
import os

with open('data/products.json', 'r', encoding='utf-8') as f:
    products_json = json.load(f)

with open('data/packaged_foods_india.json', 'r', encoding='utf-8') as f:
    packaged_foods = json.load(f)

print(f"data/products.json length: {len(products_json)}")
print(f"data/packaged_foods_india.json length: {len(packaged_foods)}")

# Compare IDs / names between products.json and packaged_foods_india.json
match_count = 0
for i in range(min(len(products_json), len(packaged_foods))):
    p1 = products_json[i]
    p2 = packaged_foods[i]
    # S.No in packaged_foods
    sno = p2.get('S.No')
    if p1.get('id') == f"IN-{sno}":
        match_count += 1

print(f"Exact 1-to-1 match count between products.json and packaged_foods_india: {match_count}")
