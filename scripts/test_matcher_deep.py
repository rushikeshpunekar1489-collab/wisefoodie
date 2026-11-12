import json
import os
import re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))

def norm(text):
    if not text:
        return ''
    t = text.lower()
    t = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def get_tokens(text):
    t = norm(text)
    stop = {'biscuits', 'cookies', 'cookie', 'flavour', 'flavoured', 'pack', 'family', 'original', 'biscuit', 'premium', 'with', 'and', 'the', 'for', 'in', 'of', 'treat', 'delicious', 'tasty'}
    return set(t.split()) - stop

# Check for each product in products.json
matches = []
unmatched = []

for p in products:
    pid = p.get('id')
    pname = p.get('name')
    pbrand = p.get('brand')
    p_tokens = get_tokens(pname)
    p_brand_norm = norm(pbrand)
    
    # 1. Exact or near-exact match in staged
    best_match = None
    best_score = 0
    
    for s in staged:
        s_brand_norm = norm(s.get('brand'))
        # Must match brand (or brand substring/alias)
        brand_match = (
            p_brand_norm == s_brand_norm or 
            p_brand_norm in s_brand_norm or 
            s_brand_norm in p_brand_norm or
            ('itc' in s_brand_norm and ('sunfeast' in p_brand_norm or 'bingo' in p_brand_norm or 'yippee' in p_brand_norm)) or
            ('cadbury' in s_brand_norm and 'cadbury' in p_brand_norm)
        )
        if not brand_match:
            continue
            
        s_tokens = get_tokens(s.get('name'))
        intersection = p_tokens.intersection(s_tokens)
        if not intersection:
            continue
            
        # Jaccard / overlap score
        score = len(intersection) / len(p_tokens.union(s_tokens))
        # require significant token match
        if len(intersection) >= 2 and score > best_score:
            best_score = score
            best_match = s
        elif len(intersection) == 1 and len(p_tokens) == 1 and score > best_score:
            best_score = score
            best_match = s

    if best_match and best_score >= 0.35:
        matches.append((p, best_match, best_score))
    else:
        unmatched.append(p)

print(f"Total products: {len(products)}")
print(f"High-confidence matched from staged: {len(matches)}")
print(f"Unmatched: {len(unmatched)}")

print("\nSample 15 matches:")
for p, s, sc in matches[:15]:
    print(f"  [{p.get('id')}] '{p.get('name')}' ({p.get('brand')})")
    print(f"      -> '{s.get('name')}' ({s.get('brand')}) [score={sc:.2f}] img={s.get('image')}")
