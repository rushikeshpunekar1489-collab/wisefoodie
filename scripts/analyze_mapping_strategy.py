import json
import os
import re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))

def tokenize(text):
    if not text:
        return set()
    t = text.lower()
    t = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+]', ' ', t)
    # remove noise words
    stop = {'biscuits', 'cookies', 'cookie', 'flavour', 'flavoured', 'pack', 'family', 'original', 'biscuit', 'premium', 'with', 'and', 'the', 'for', 'in', 'of'}
    tokens = set(t.split()) - stop
    return tokens

# Map staged items by brand
staged_by_brand = {}
for s in staged:
    b = s.get('brand', '').strip().upper()
    # Normalize common brand variations
    if 'BRITANNIA' in b: b = 'BRITANNIA'
    elif 'PARLE AGRO' in b: b = 'PARLE AGRO'
    elif 'PARLE' in b: b = 'PARLE'
    elif 'AMUL' in b: b = 'AMUL'
    elif 'CADBURY' in b or 'MONDELEZ' in b: b = 'CADBURY'
    elif 'ITC' in b or 'SUNFEAST' in b or 'BINGO' in b: b = 'SUNFEAST'
    elif 'HALDIRAM' in b: b = 'HALDIRAMS'
    elif 'UNIBIC' in b: b = 'UNIBIC'
    elif 'TOO YUMM' in b: b = 'TOO YUMM'
    elif 'MTR' in b: b = 'MTR'
    elif 'GITS' in b: b = 'GITS'
    elif 'LAY' in b: b = 'LAYS'
    elif 'HERSHEY' in b: b = 'HERSHEYS'
    elif 'CHING' in b: b = 'CHINGS'
    elif 'BALAJI' in b: b = 'BALAJI'
    elif 'NESTLE' in b or 'MAGGI' in b: b = 'NESTLE'
    elif 'RAW PRESSERY' in b: b = 'RAW PRESSERY'
    
    staged_by_brand.setdefault(b, []).append(s)

print(f"Staged brands indexed: {list(staged_by_brand.keys())[:15]}")
