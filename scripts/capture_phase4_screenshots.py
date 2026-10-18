import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\docs\screenshots\phase-4"
os.makedirs(output_dir, exist_ok=True)

viewports = [
    ("mobile_375", {"width": 375, "height": 812}),
    ("tablet_768", {"width": 768, "height": 1024}),
    ("desktop_1440", {"width": 1440, "height": 900}),
]

print(f"Capturing Phase 4 screenshots to {output_dir}...")

with sync_playwright() as p:
    try:
        browser = p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        browser = p.chromium.launch(channel="chrome", headless=True)

    # 1. Capture Explore with natural language ingredient search and filter chips
    for vp_name, vp_size in viewports:
        page = browser.new_page(viewport=vp_size)
        try:
            page.goto("http://localhost:3000/explore?q=no+palm+oil", wait_until="networkidle")
            time.sleep(2)

            path = os.path.join(output_dir, f"ingredient_filters_{vp_name}.png")
            page.screenshot(path=path)
            print(f"Captured: {path}")
        except Exception as e:
            print(f"Error on explore page at {vp_name}: {e}")
        finally:
            page.close()

    browser.close()

print("Phase 4 screenshots completed!")
