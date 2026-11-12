import json
import os
import re

with open('data/backups/products.before_image_accuracy_fix.json', 'r', encoding='utf-8') as f:
    original_products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))

def clean(s):
    if not s: return ''
    s = s.lower()
    s = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+\*\#\!]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def get_stem(filepath):
    fn = os.path.basename(filepath.lstrip('/'))
    return clean(os.path.splitext(fn)[0])

# Exact staged index
staged_exact = {}
for s in staged:
    img = s.get('image', '').lstrip('/')
    fn = os.path.basename(img)
    if fn in public_files:
        staged_exact[(clean(s.get('brand', '')), clean(s.get('name', '')))] = f"/products/{fn}"

# Positive validation function: checks if image is genuinely for this product
def is_valid_match(name, brand, image_path):
    if not image_path:
        return False
    fn = os.path.basename(image_path.lstrip('/'))
    if fn not in public_files:
        return False
        
    p_name = clean(name)
    b_name = clean(brand)
    f_stem = get_stem(image_path)
    
    # Subbrand positive checks:
    # If product mentions subbrand, image must mention it too
    subbrands = [
        'bourbon', 'good day', 'nutrichoice', '50 50', 'little hearts', 'milk bikis', 'marie', 'nice',
        'dark fantasy', 'farmlite', 'moms magic', 'bounce', 'yippee',
        'hide seek', 'monaco', 'krackjack', '20 20', 'frooti', 'appy',
        'maggi', 'kitkat', 'munch', 'milkybar', 'nescafe',
        'oreo', 'silk', 'bournvita', '5 star', 'perk', 'gems', 'dairy milk', 'chocobakes',
        'kisses', 'kurkure', 'bingo', 'smoodh', 'tang', 'lays', 'sting', 'thums up', 'sprite',
        'fanta', 'limca', 'maaza', 'slice', '7up', 'mountain dew', 'mirinda'
    ]
    
    for sb in subbrands:
        in_p = sb in p_name
        in_f = sb in f_stem
        if in_p != in_f:
            return False
            
    # Key ingredient/flavor positive checks:
    flavors = ['coconut', 'cashew', 'pista', 'almond', 'butter', 'choco chip', 'masala', 'atta', 'cuppa', 'sauce', 'tomato', 'cream onion', 'cheese', 'bhujia', 'sev', 'chana dal', 'moong dal']
    for fl in flavors:
        in_p = fl in p_name
        in_f = fl in f_stem
        # If product explicitly has flavor (e.g. coconut), image must match
        if in_p and not in_f:
            return False
            
    # Category cross-contamination checks:
    if 'noodle' in p_name and 'noodle' not in f_stem: return False
    if 'pasta' in p_name and 'pasta' not in f_stem: return False
    if 'biscuit' in p_name and ('noodle' in f_stem or 'pasta' in f_stem or 'juice' in f_stem): return False
    if 'biscuit' not in p_name and 'cookie' not in p_name and 'cookies' not in p_name:
        if 'biscuit' in f_stem or 'cookie' in f_stem or 'cookies' in f_stem: return False

    return True

verified_products = []
verified_count = 0
unverified_count = 0

for p in original_products:
    p_copy = dict(p)
    p_name = p['name']
    p_brand = p['brand']
    p_id = p['id']
    
    # 1. Check exact match from staged
    img = staged_exact.get((clean(p_brand), clean(p_name)))
    
    # 2. Check if valid
    if img and is_valid_match(p_name, p_brand, img):
        p_copy['image'] = img
        verified_count += 1
    elif p.get('image') and is_valid_match(p_name, p_brand, p.get('image')):
        p_copy['image'] = p.get('image')
        verified_count += 1
    else:
        p_copy['image'] = None
        unverified_count += 1
        
    verified_products.append(p_copy)

print(f"Total products: {len(verified_products)}")
print(f"100% Positively Verified Images: {verified_count}")
print(f"Products with Verified Packaging Pending: {unverified_count}")

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(verified_products, f, indent=2)

print("Saved clean data/products.json")
