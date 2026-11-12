import json
import os
import re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

public_files = [f for f in os.listdir('public/products') if f.endswith('.webp') or f.endswith('.png') or f.endswith('.jpg')]

def norm(text):
    if not text:
        return ''
    t = text.lower()
    t = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def get_tokens(text):
    t = norm(text)
    stop = {'biscuits', 'cookies', 'cookie', 'flavour', 'flavoured', 'pack', 'family', 'original', 'biscuit', 'premium', 'with', 'and', 'the', 'for', 'in', 'of', 'treat', 'delicious', 'tasty', 'chips', 'wafer', 'wafers'}
    return set(t.split()) - stop

file_data = []
for f in public_files:
    stem = os.path.splitext(f)[0]
    tokens = get_tokens(stem)
    file_data.append({
        'filename': f,
        'stem': stem,
        'tokens': tokens,
        'raw_norm': norm(stem)
    })

print(f"Total public files: {len(file_data)}")

# Map each product
product_matches = {}

for p in products:
    pid = p.get('id')
    pname = p.get('name')
    pbrand = p.get('brand')
    p_tokens = get_tokens(pname)
    b_tokens = get_tokens(pbrand)
    
    best_file = None
    best_score = 0
    
    for fd in file_data:
        ftokens = fd['tokens']
        # Check brand match: at least one brand token in file tokens or stem
        brand_matched = False
        for bt in b_tokens:
            if bt in ftokens or bt in fd['raw_norm']:
                brand_matched = True
                break
        
        # also handle special brand aliases
        if not brand_matched:
            if 'sunfeast' in norm(pbrand) and ('itc' in fd['raw_norm'] or 'sunfeast' in fd['raw_norm']):
                brand_matched = True
            elif 'cadbury' in norm(pbrand) and 'cadbury' in fd['raw_norm']:
                brand_matched = True
            elif 'haldiram' in norm(pbrand) and 'haldiram' in fd['raw_norm']:
                brand_matched = True
            elif 'too yumm' in norm(pbrand) and 'too-yumm' in fd['stem']:
                brand_matched = True
                
        if not brand_matched:
            continue
            
        # calculate overlap between product tokens and file tokens
        overlap = p_tokens.intersection(ftokens)
        if not overlap:
            continue
            
        score = len(overlap) / (len(p_tokens) + len(ftokens) - len(overlap))
        # require at least 2 common tokens or exact token match if 1 token
        if (len(overlap) >= 2 or (len(overlap) == 1 and len(p_tokens) <= 2)) and score > best_score:
            best_score = score
            best_file = fd['filename']
            
    if best_file and best_score >= 0.25:
        product_matches[pid] = (best_file, best_score)

print(f"Products matched to public/products files: {len(product_matches)} / {len(products)}")
