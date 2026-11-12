import json
import os

backups = [
    'data/products.json',
    'data/products_full_staged.json',
    'data/backups/products.backup_pre_csv_replacement.json',
    'data/backups/products.1792098420.json',
    'data/backups/products.20261010_035057.json'
]

for b in backups:
    if os.path.exists(b):
        with open(b, 'r', encoding='utf-8') as f:
            data = json.load(f)
            has_img = sum(1 for x in data if x.get('image') or x.get('imageUrl'))
            print(f"{b}: len={len(data)}, with_img={has_img}, sample_id={data[0].get('id')}, sample_name={data[0].get('name')}")
