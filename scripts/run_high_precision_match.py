import json
import os
import re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))

def clean_str(s):
    if not s: return ''
    s = s.lower()
    s = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+\*\#\!]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def get_keywords(s):
    cs = clean_str(s)
    stop = {'biscuits', 'cookies', 'cookie', 'flavour', 'flavoured', 'pack', 'family', 'original', 'biscuit', 'premium', 'with', 'and', 'the', 'for', 'in', 'of', 'treat', 'delicious', 'tasty', 'chips', 'wafer', 'wafers', 'crisps', 'snack', 'snacks', 'namkeen', 'indian', 'instant', 'ready', 'to', 'eat', 'serve'}
    words = [w for w in cs.split() if w not in stop and len(w) > 1]
    return words

# Build high-precision index of staged products
staged_index = []
for s in staged:
    s_img = s.get('image', '').lstrip('/')
    fn = os.path.basename(s_img)
    if fn in public_files:
        staged_index.append({
            'product': s,
            'brand': clean_str(s.get('brand', '')),
            'name': clean_str(s.get('name', '')),
            'keywords': set(get_keywords(s.get('name', ''))),
            'image': f"/products/{fn}"
        })

print(f"Staged index items with verified disk files: {len(staged_index)}")

# Build file index from public_files
file_index = []
for fn in public_files:
    stem = os.path.splitext(fn)[0]
    file_index.append({
        'filename': fn,
        'image': f"/products/{fn}",
        'keywords': set(get_keywords(stem)),
        'clean_stem': clean_str(stem)
    })

print(f"File index items: {len(file_index)}")

# Brand normalization dictionary
BRAND_ALIASES = {
    'PARLE': ['parle', 'parle agro', 'frooti', 'appy', 'hide & seek', 'monaco', 'krackjack', '20-20'],
    'BRITANNIA': ['britannia', 'good day', 'bourbon', 'nutrichoice', '50-50', 'treat', 'marie gold', 'little hearts', 'jimjam', 'tiger', 'milk bikis'],
    'SUNFEAST': ['itc', 'sunfeast', 'dark fantasy', 'moms magic', 'farmlite', 'yippee', 'bounce'],
    'AMUL': ['amul', 'amulya'],
    'CADBURY': ['cadbury', 'mondelez', 'dairy milk', 'oreo', 'bournvita', '5 star', 'perk', 'gems'],
    'HALDIRAMS': ['haldiram', 'haldirams'],
    'TOO YUMM': ['too yumm', 'too-yumm'],
    'MTR': ['mtr'],
    'UNIBIC': ['unibic'],
    'GITS': ['gits'],
    'LAY\'S': ['lays', 'lay\'s', 'frito lay'],
    'HERSHEYS': ['hershey', 'hersheys', 'kisses'],
    'CHING\'S SECRET': ['chings', 'ching\'s', 'ching\'s secret'],
    'BALAJI': ['balaji'],
    'NESTLE': ['nestle', 'nestlé', 'maggi', 'kitkat', 'munch', 'bar one', 'milkybar', 'nescafe'],
    'RAW PRESSERY': ['raw', 'raw pressery', 'pressery'],
    'HOCCO': ['hocco'],
    'MCCAIN': ['mccain'],
    'COCA-COLA': ['coca cola', 'coke', 'thums up', 'sprite', 'fanta', 'limca', 'maaza', 'kinley'],
    'PEPSICO': ['pepsi', '7up', 'mountain dew', 'mirinda', 'sting', 'tropicana', 'slice', 'aquafina', 'kurkure', 'doritos'],
    'BINGO': ['itc bingo', 'bingo', 'tedhe medhe', 'mad angles'],
    'MAPRO': ['mapro'],
    'KISSAN': ['kissan'],
    'KNORR': ['knorr'],
    'KELLOGG\'S': ['kellogg', 'kelloggs', 'kellogg\'s']
}

def brands_match(b1, b2):
    b1_c = clean_str(b1)
    b2_c = clean_str(b2)
    if b1_c == b2_c or b1_c in b2_c or b2_c in b1_c:
        return True
    for canon, aliases in BRAND_ALIASES.items():
        in_1 = any(clean_str(a) in b1_c for a in aliases)
        in_2 = any(clean_str(a) in b2_c for a in aliases)
        if in_1 and in_2:
            return True
    return False

matched = []
unmatched = []

for p in products:
    p_brand = p.get('brand', '')
    p_name = p.get('name', '')
    p_keys = set(get_keywords(p_name))
    p_id = p.get('id')
    
    best_candidate = None
    best_score = 0
    
    # 1. Search staged
    for s in staged_index:
        if not brands_match(p_brand, s['brand']):
            # check if brand is inside product name
            if not any(clean_str(a) in clean_str(p_name) for a in BRAND_ALIASES.get(s['brand'].upper(), [])):
                continue
        
        common = p_keys.intersection(s['keywords'])
        if not common:
            continue
            
        score = len(common) / (len(p_keys.union(s['keywords'])))
        # Boost for distinctive keyword matches (e.g. bourbon, jimjam, digestive, tricone, pistachio)
        distinctive = any(len(k) >= 5 for k in common)
        if distinctive and len(common) >= 2:
            score += 0.3
            
        if score > best_score and (len(common) >= 2 or (len(p_keys) <= 2 and len(common) >= 1)):
            best_score = score
            best_candidate = s['image']

    # 2. Search files directly if not matched or score low
    if best_score < 0.5:
        for f in file_index:
            # Check brand match in file
            brand_in_file = False
            for canon, aliases in BRAND_ALIASES.items():
                if brands_match(p_brand, canon):
                    for a in aliases:
                        if clean_str(a) in f['clean_stem']:
                            brand_in_file = True
                            break
            if not brand_in_file:
                continue
                
            common = p_keys.intersection(f['keywords'])
            if not common:
                continue
                
            score = len(common) / (len(p_keys.union(f['keywords'])))
            if any(len(k) >= 5 for k in common) and len(common) >= 2:
                score += 0.3
                
            if score > best_score and (len(common) >= 2 or (len(p_keys) <= 2 and len(common) >= 1)):
                best_score = score
                best_candidate = f['image']

    if best_candidate and best_score >= 0.4:
        matched.append({
            'id': p_id,
            'name': p_name,
            'brand': p_brand,
            'image': best_candidate,
            'score': best_score
        })
    else:
        unmatched.append({
            'id': p_id,
            'name': p_name,
            'brand': p_brand
        })

print(f"\nResults:")
print(f"Total products: {len(products)}")
print(f"Matched with high confidence: {len(matched)}")
print(f"Unmatched: {len(unmatched)}")

print("\nSample 15 matches:")
for m in matched[:15]:
    print(f"  [{m['id']}] {m['name']} ({m['brand']}) -> {m['image']} (score: {m['score']:.2f})")

print("\nSample 15 unmatched:")
for u in unmatched[:15]:
    print(f"  [{u['id']}] {u['name']} ({u['brand']})")
