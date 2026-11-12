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

BRAND_MAP = {
    'parle': 'parle',
    'parle agro': 'parle',
    'britannia': 'britannia',
    'sunfeast': 'sunfeast',
    'itc': 'sunfeast',
    'amul': 'amul',
    'amulya': 'amul',
    'cadbury': 'cadbury',
    'mondelez': 'cadbury',
    'haldiram': 'haldirams',
    'haldirams': 'haldirams',
    'too yumm': 'too yumm',
    'too yumm!': 'too yumm',
    'mtr': 'mtr',
    'unibic': 'unibic',
    'gits': 'gits',
    'lay\'s': 'lays',
    'lays': 'lays',
    'hershey': 'hersheys',
    'hersheys': 'hersheys',
    'ching\'s': 'chings',
    'ching\'s secret': 'chings',
    'balaji': 'balaji',
    'nestle': 'nestle',
    'nestlé': 'nestle',
    'maggi': 'nestle',
    'raw pressery': 'raw pressery',
    'hocco': 'hocco',
    'mccain': 'mccain',
    'coca-cola': 'coca cola',
    'coke': 'coca cola',
    'pepsi': 'pepsico',
    'bingo': 'bingo',
    'mapro': 'mapro',
    'kissan': 'kissan',
    'knorr': 'knorr',
    'kellogg': 'kellogg',
    'kellogg\'s': 'kellogg'
}

def get_canonical_brand(b):
    cb = clean_str(b)
    for k, v in BRAND_MAP.items():
        if k in cb:
            return v
    return cb

# Index staged by canonical brand
staged_by_canon_brand = {}
for s in staged:
    s_img = s.get('image', '').lstrip('/')
    fn = os.path.basename(s_img)
    if fn in public_files:
        cb = get_canonical_brand(s.get('brand', ''))
        staged_by_canon_brand.setdefault(cb, []).append({
            'product': s,
            'name': clean_str(s.get('name', '')),
            'keywords': set(get_keywords(s.get('name', ''))),
            'image': f"/products/{fn}"
        })

# Index files by canonical brand
files_by_canon_brand = {}
for fn in public_files:
    stem = os.path.splitext(fn)[0]
    cb = get_canonical_brand(stem)
    files_by_canon_brand.setdefault(cb, []).append({
        'filename': fn,
        'image': f"/products/{fn}",
        'keywords': set(get_keywords(stem)),
        'stem': stem
    })

matched = []
unmatched = []

for p in products:
    p_brand = p.get('brand', '')
    p_name = p.get('name', '')
    p_keys = set(get_keywords(p_name))
    p_id = p.get('id')
    cb = get_canonical_brand(p_brand)
    
    best_candidate = None
    best_score = 0
    
    # 1. Look in staged with same canonical brand
    candidates = staged_by_canon_brand.get(cb, [])
    for s in candidates:
        common = p_keys.intersection(s['keywords'])
        if not common:
            continue
        score = len(common) / (len(p_keys.union(s['keywords'])))
        if any(len(k) >= 5 for k in common) and len(common) >= 2:
            score += 0.35
        if score > best_score:
            best_score = score
            best_candidate = s['image']
            
    # 2. Look in files with same canonical brand if not high score
    if best_score < 0.5:
        f_candidates = files_by_canon_brand.get(cb, [])
        for f in f_candidates:
            common = p_keys.intersection(f['keywords'])
            if not common:
                continue
            score = len(common) / (len(p_keys.union(f['keywords'])))
            if any(len(k) >= 5 for k in common) and len(common) >= 2:
                score += 0.35
            if score > best_score:
                best_score = score
                best_candidate = f['image']

    if best_candidate and best_score >= 0.45:
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

print(f"Total products: {len(products)}")
print(f"Matched with high confidence: {len(matched)}")
print(f"Unmatched: {len(unmatched)}")

print("\nSample 20 matches:")
for m in matched[:20]:
    print(f"  [{m['id']}] {m['name']} ({m['brand']}) -> {m['image']} ({m['score']:.2f})")

print("\nSample 15 unmatched:")
for u in unmatched[:15]:
    print(f"  [{u['id']}] {u['name']} ({u['brand']})")
