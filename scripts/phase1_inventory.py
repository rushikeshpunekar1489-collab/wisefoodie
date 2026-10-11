import os
import csv
import pypdfium2 as pdfium

screenshots_dir = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\data\source\screenshots"
output_csv = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\data\screenshot-inventory.csv"

files = sorted(os.listdir(screenshots_dir))
print(f"Total screenshots/catalogs in folder: {len(files)}")

inventory = []

for f in files:
    full_path = os.path.join(screenshots_dir, f)
    ext = os.path.splitext(f)[1].lower()
    
    if ext == ".pdf":
        try:
            pdf = pdfium.PdfDocument(full_path)
            num_pages = len(pdf)
            if num_pages > 0:
                page = pdf[0]
                # Render at 1x to measure pixel dimensions
                img = page.render(scale=1.5).to_pil()
                width, height = img.size
                readable = "yes"
                notes = f"Digital PDF Catalog ({num_pages} page(s)), multi-product grocery shelf layout"
            else:
                width, height = 0, 0
                readable = "no"
                notes = "Empty PDF document"
        except Exception as e:
            width, height = 0, 0
            readable = "no"
            notes = f"Failed to read: {str(e)}"
    else:
        # Image files
        try:
            from PIL import Image
            with Image.open(full_path) as img:
                width, height = img.size
                readable = "yes"
                notes = "Screenshot raster image"
        except Exception as e:
            width, height = 0, 0
            readable = "no"
            notes = f"Failed to open image: {str(e)}"

    inventory.append({
        "file": f,
        "width": width,
        "height": height,
        "readable": readable,
        "notes": notes
    })
    print(f"[{readable.upper()}] {f} - {width}x{height} - {notes}")

with open(output_csv, "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["file", "width", "height", "readable", "notes"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(inventory)

print(f"\nPhase 1 Complete. Saved inventory of {len(inventory)} files to {output_csv}")
