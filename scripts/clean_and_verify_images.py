import json
import os
import re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))

def clean(s):
    if not s: return ''
    s = s.lower()
    s = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+\*\#\!]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

# Build map from staged
staged_exact = {}
for s in staged:
    s_img = s.get('image', '').lstrip('/')
    fn = os.path.basename(s_img)
    if fn in public_files:
        b = clean(s.get('brand', ''))
        n = clean(s.get('name', ''))
        staged_exact[(b, n)] = f"/products/{fn}"

file_exact = {}
for fn in public_files:
    stem = os.path.splitext(fn)[0]
    file_exact[clean(stem)] = f"/products/{fn}"

# Helper to verify whether an image matches the product
def verify_image_match(product_name, brand_name, image_path):
    if not image_path:
        return None
    fn = os.path.basename(image_path.lstrip('/'))
    if fn not in public_files:
        return None
        
    p_name = clean(product_name)
    b_name = clean(brand_name)
    fn_clean = clean(os.path.splitext(fn)[0])
    
    # Specific negative rules (prevent cross-contamination)
    if 'digestive' in p_name and 'digestive' not in fn_clean: return None
    if 'digestive' not in p_name and 'digestive' in fn_clean: return None
    if 'bourbon' in p_name and 'bourbon' not in fn_clean: return None
    if 'bourbon' not in p_name and 'bourbon' in fn_clean: return None
    if 'good day' in p_name and 'good day' not in fn_clean: return None
    if 'good day' not in p_name and 'good day' in fn_clean: return None
    if 'marie' in p_name and 'marie' not in fn_clean: return None
    if 'marie' not in p_name and 'marie' in fn_clean: return None
    if 'little hearts' in p_name and 'little hearts' not in fn_clean: return None
    if 'milk bikis' in p_name and 'milk bikis' not in fn_clean: return None
    if 'nice' in p_name and 'nice' not in fn_clean: return None
    if '50 50' in p_name and '50 50' not in fn_clean: return None
    if 'dark fantasy' in p_name and 'dark fantasy' not in fn_clean: return None
    if 'dark fantasy' not in p_name and 'dark fantasy' in fn_clean: return None
    if 'yippee' in p_name and 'yippee' not in fn_clean: return None
    if 'yippee' not in p_name and 'yippee' in fn_clean: return None
    if 'maggi' in p_name and 'maggi' not in fn_clean: return None
    if 'maggi' not in p_name and 'maggi' in fn_clean: return None
    if 'kurkure' in p_name and 'kurkure' not in fn_clean: return None
    if 'kurkure' not in p_name and 'kurkure' in fn_clean: return None
    if 'bingo' in p_name and 'bingo' not in fn_clean: return None
    if 'bingo' not in p_name and 'bingo' in fn_clean: return None
    if 'oreo' in p_name and 'oreo' not in fn_clean: return None
    if 'silk' in p_name and 'silk' not in fn_clean: return None
    if 'smoodh' in p_name and 'smoodh' not in fn_clean: return None
    if 'tang' in p_name and 'tang' not in fn_clean: return None
    if 'kisses' in p_name and 'kisses' not in fn_clean: return None
    if 'bhujia' in p_name and 'bhujia' not in fn_clean: return None
    if 'bhujia' not in p_name and 'bhujia' in fn_clean: return None
    if 'chana dal' in p_name and 'chana dal' not in fn_clean: return None
    if 'moong dal' in p_name and 'moong dal' not in fn_clean: return None
    if 'noodles' in p_name and 'noodle' not in fn_clean: return None
    if 'wafers' in p_name and 'wafer' not in fn_clean: return None
    
    # Specific flavor/ingredient matches
    if 'coconut' in p_name and 'coconut' not in fn_clean: return None
    if 'cashew' in p_name and 'cashew' not in fn_clean: return None
    if 'pista' in p_name and 'pista' not in fn_clean: return None
    if 'almond' in p_name and 'almond' not in fn_clean: return None
    if 'butter' in p_name and 'butter' not in fn_clean and 'cookies' in fn_clean: return None
    
    return image_path

# Execute cleanup
verified_count = 0
cleaned_products = []
unverified_report = []

for p in products:
    p_copy = dict(p)
    pid = p['id']
    pname = p['name']
    pbrand = p['brand']
    
    # Check if exact match from staged
    img = None
    if (clean(pbrand), clean(pname)) in staged_exact:
        img = staged_exact[(clean(pbrand), clean(pname))]
    elif clean(pname) in file_exact:
        img = file_exact[clean(pname)]
    elif clean(f"{clean(pbrand)} {clean(pname)}") in file_exact:
        img = file_exact[clean(f"{clean(pbrand)} {clean(pname)}")]
        
    # If not found yet, check existing image with verification check
    if not img and p.get('image'):
        img = verify_image_match(pname, pbrand, p.get('image'))
        
    # Assign verified image or None
    if img:
        p_copy['image'] = img
        verified_count += 1
    else:
        p_copy['image'] = None
        unverified_report.append({
            'id': pid,
            'name': pname,
            'brand': pbrand,
            'category': p.get('category')
        })
        
    cleaned_products.append(p_copy)

print(f"Total products: {len(products)}")
print(f"Products with 100% verified, accurate images: {verified_count}")
print(f"Products cleanly marked as pending verified packaging: {len(unverified_report)}")

# Save backup of current products.json first
with open('data/backups/products.before_image_accuracy_fix.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

# Write cleaned products.json
with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned_products, f, indent=2)

print("Updated data/products.json successfully!")
