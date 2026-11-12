import json
import os

print("=== CHECKING OTHER DATA FILES FOR IMAGES ===")

for filename in ['data/products_full_staged.json', 'data/packaged_foods_india.json', 'data/products-normalised.json', 'data/detected-products.json']:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if isinstance(data, list):
                    items = data
                elif isinstance(data, dict):
                    items = data.get('products') or data.get('items') or list(data.values())
                else:
                    items = []
                
                has_img = sum(1 for x in items if isinstance(x, dict) and (x.get('image') or x.get('imageUrl') or x.get('images')))
                print(f"{filename}: total {len(items)}, has_image: {has_img}")
                # sample
                for x in items[:3]:
                    if isinstance(x, dict):
                        print(f"  sample: id={x.get('id')}, name={x.get('name')}, image={x.get('image') or x.get('imageUrl')}")
            except Exception as e:
                print(f"Error reading {filename}: {e}")

public_files = os.listdir('public/products')
print(f"\nSample 25 public/products files:")
for f in sorted(public_files)[:25]:
    print(f"  {f}")
