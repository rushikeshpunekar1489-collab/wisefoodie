import os
import shutil
import datetime

project_root = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website"
data_dir = os.path.join(project_root, "data")
backup_dir = os.path.join(data_dir, "backups")
screenshots_dir = os.path.join(data_dir, "source", "screenshots")
crops_dir = os.path.join(data_dir, "source", "crops")
docs_screenshots_dir = os.path.join(project_root, "docs", "screenshots")

os.makedirs(backup_dir, exist_ok=True)
os.makedirs(screenshots_dir, exist_ok=True)
os.makedirs(crops_dir, exist_ok=True)
os.makedirs(docs_screenshots_dir, exist_ok=True)

# Backup data/products.json
products_json = os.path.join(data_dir, "products.json")
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
backup_path = os.path.join(backup_dir, f"products.{timestamp}.json")

if os.path.exists(products_json):
    shutil.copy2(products_json, backup_path)
    print(f"Successfully backed up products.json to: {backup_path}")
else:
    print("Warning: data/products.json does not exist yet to backup.")

# Copy original screenshots/catalogs to data/source/screenshots without touching originals
source_folder = r"C:\Users\ACER\OneDrive\Desktop\wise foodi products"
if os.path.exists(source_folder):
    files = os.listdir(source_folder)
    print(f"Found {len(files)} files in source folder: {source_folder}")
    for f in files:
        src = os.path.join(source_folder, f)
        if os.path.isfile(src):
            dst = os.path.join(screenshots_dir, f)
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
    print(f"Verified all {len(files)} files copied to: {screenshots_dir}")
else:
    print(f"Error: source folder {source_folder} not found.")
