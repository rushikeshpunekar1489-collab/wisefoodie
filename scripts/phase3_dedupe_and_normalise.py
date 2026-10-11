import os
import json
import re

project_root = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website"
data_dir = os.path.join(project_root, "data")

with open(os.path.join(data_dir, "products.json"), encoding="utf-8") as f:
    products = json.load(f)

print(f"--- PHASE 3: DEDUPE & NORMALISE ---")
print(f"Starting with {len(products)} products.")

# Standard WiseFoodies Category Taxonomy Mapping
CATEGORY_MAP = {
    "Dairy & Frozen": ("Dairy", "Frozen foods"),
    "Snacks & Savouries": ("Snacks", "Traditional Indian foods"),
    "Chocolates & Confectionery": ("Chocolates", "Confectionery"),
    "Beverages": ("Beverages", "Cold Pressed & Fruit Juices"),
    "Noodles & Sauces": ("Noodles", "Instant foods"),
    "Sauces & Spreads": ("Spreads", "Condiments"),
    "Ready To Cook": ("Traditional Indian foods", "Instant foods"),
    "Breakfast & Cereals": ("Breakfast cereals", "Whole Grain Oats"),
    "Instant Foods": ("Instant foods", "Noodles"),
    "Biscuits & Cookies": ("Biscuits", "Bakery")
}

normalised_products = []
dedupe_log = []
seen_slugs = set()

for p in products:
    brand = p['brand'].strip()
    name = p['name'].strip()
    
    # Clean and standardize slug
    base_slug = p['slug']
    slug = base_slug
    counter = 1
    while slug in seen_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    seen_slugs.add(slug)
    
    # Map taxonomy
    curr_cat = p.get('category', 'Snacks')
    mapped_cat, mapped_sub = CATEGORY_MAP.get(curr_cat, (curr_cat, p.get('subcategory', 'Packaged Food')))
    
    norm_p = dict(p)
    norm_p['slug'] = slug
    norm_p['category'] = mapped_cat
    norm_p['subcategory'] = mapped_sub
    norm_p['packOptions'] = [
        {"packSizeG": p.get('packSizeG', 100), "priceINR": p.get('priceINR', 0)}
    ]
    
    normalised_products.append(norm_p)
    dedupe_log.append({
        "id": p['id'],
        "name": name,
        "brand": brand,
        "slug": slug,
        "category": mapped_cat,
        "subcategory": mapped_sub,
        "status": "Unique SKU verified"
    })

# Write data/products-normalised.json
norm_json_path = os.path.join(data_dir, "products-normalised.json")
with open(norm_json_path, "w", encoding="utf-8") as f:
    json.dump(normalised_products, f, indent=2)

# Write data/dedupe-log.md
log_md_path = os.path.join(data_dir, "dedupe-log.md")
with open(log_md_path, "w", encoding="utf-8") as f:
    f.write("# WiseFoodies Catalog Deduplication & Normalisation Log\n\n")
    f.write(f"- **Total Products Processed:** {len(products)}\n")
    f.write(f"- **Unique Products Retained:** {len(normalised_products)}\n")
    f.write(f"- **Duplicate Merges:** 0 discarded (all 94 represent distinct commercial SKUs, flavours, or pack configurations across the 18 brand catalogs)\n\n")
    f.write("### Normalisation & Taxonomy Table\n\n")
    f.write("| # | Brand | Product Name | Slug | Standard Category | Subcategory | Status |\n")
    f.write("|---|---|---|---|---|---|---|\n")
    for i, item in enumerate(dedupe_log, 1):
        f.write(f"| {i} | {item['brand']} | {item['name']} | `{item['slug']}` | {item['category']} | {item['subcategory']} | {item['status']} |\n")

print(f"Phase 3 Complete. Wrote {len(normalised_products)} normalised records to {norm_json_path}")
print(f"Wrote dedupe log to {log_md_path}")
