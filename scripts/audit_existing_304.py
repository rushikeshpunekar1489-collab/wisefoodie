import json
import os

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

public_files = set(os.listdir('public/products'))

valid_existing = []
invalid_existing = []

for p in products:
    img = p.get('image')
    if not img:
        continue
    fn = os.path.basename(img.lstrip('/'))
    if fn not in public_files:
        invalid_existing.append((p['id'], p['name'], img, 'file_missing'))
        continue
    
    # check if filename matches product name tokens
    # e.g. p['name'] has 'bourbon' and filename has 'bourbon'
    p_name = p['name'].lower()
    fn_lower = fn.lower()
    
    # Check obvious mismatches
    mismatch = False
    if 'digestive' in p_name and 'digestive' not in fn_lower:
        mismatch = True
    elif 'jimjam' in p_name and 'jimjam' not in fn_lower:
        mismatch = True
    elif 'coconut' in p_name and 'coconut' not in fn_lower and 'almond' in fn_lower:
        mismatch = True
    elif 'pista' in p_name and 'butter-cookies' in fn_lower:
        mismatch = True
    elif 'cashew' in p_name and 'butter-cookies' in fn_lower:
        mismatch = True
    elif 'marie' in p_name and 'marie' not in fn_lower:
        mismatch = True
    elif 'bourbon' in p_name and 'bourbon' not in fn_lower:
        mismatch = True
        
    if mismatch:
        invalid_existing.append((p['id'], p['name'], img, 'mismatched_product'))
    else:
        valid_existing.append((p['id'], p['name'], img))

print(f"Total existing with image: {len(valid_existing) + len(invalid_existing)}")
print(f"Verified accurate existing images: {len(valid_existing)}")
print(f"Mismatched/faulty existing images: {len(invalid_existing)}")

print("\nSample 10 verified accurate existing images:")
for item in valid_existing[:10]:
    print("  ", item)

print("\nSample 10 mismatched existing images that were wrongly assigned previously:")
for item in invalid_existing[:10]:
    print("  ", item)
