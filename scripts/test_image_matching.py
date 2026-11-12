import json
import os
import re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))

def clean_text(text):
    if not text:
        return ''
    t = text.lower()
    t = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

# Build index of staged products
staged_by_cleaned_name = {}
for p in staged:
    cname = clean_text(p.get('name', ''))
    staged_by_cleaned_name[cname] = p
    # also brand + name
    bname = clean_text(f"{p.get('brand', '')} {p.get('name', '')}")
    staged_by_cleaned_name[bname] = p

# Build index of public files
file_tokens = {}
for f in public_files:
    stem = os.path.splitext(f)[0]
    cstem = clean_text(stem)
    file_tokens[cstem] = f

print(f"Total products in catalog: {len(products)}")
print(f"Total staged items indexed: {len(staged_by_cleaned_name)}")
print(f"Total public files indexed: {len(file_tokens)}")

# Test matching each of the 852 products
matched_staged_exact = 0
matched_file_exact = 0
token_matches = 0
unmatched_products = []

for p in products:
    pname = clean_text(p.get('name', ''))
    pbrand = clean_text(p.get('brand', ''))
    pbname = clean_text(f"{pbrand} {pname}")
    
    # 1. Direct match with staged
    match_img = None
    if pname in staged_by_cleaned_name:
        match_img = staged_by_cleaned_name[pname].get('image')
        matched_staged_exact += 1
    elif pbname in staged_by_cleaned_name:
        match_img = staged_by_cleaned_name[pbname].get('image')
        matched_staged_exact += 1
    
    # 2. Direct slug match in public files
    if not match_img:
        slug_hyphen = re.sub(r'\s+', '-', pbname)
        if f"{slug_hyphen}.webp" in public_files:
            match_img = f"/products/{slug_hyphen}.webp"
            matched_file_exact += 1
        elif f"{re.sub(r'\s+', '-', pname)}.webp" in public_files:
            match_img = f"/products/{re.sub(r'\s+', '-', pname)}.webp"
            matched_file_exact += 1

    if not match_img:
        unmatched_products.append(p)

print(f"Matched staged exact: {matched_staged_exact}")
print(f"Matched file exact: {matched_file_exact}")
print(f"Remaining unmatched: {len(unmatched_products)}")
