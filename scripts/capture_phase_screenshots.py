import os
import sys
import time
from playwright.sync_api import sync_playwright

phase = sys.argv[1] if len(sys.argv) > 1 else "1"
output_dir = rf"C:\Users\ACER\OneDrive\Desktop\sarwesh website\docs\screenshots\phase-{phase}"
os.makedirs(output_dir, exist_ok=True)

viewports = [
    ("mobile_375", {"width": 375, "height": 812}),
    ("tablet_768", {"width": 768, "height": 1024}),
    ("desktop_1440", {"width": 1440, "height": 900}),
]

pages = [
    ("product_alternatives", "http://localhost:3000/food/amul-gold-milk"),
    ("biscuit_alternatives", "http://localhost:3000/food/britannia-good-day-butter-cookies"),
]

print(f"Capturing Phase {phase} screenshots to {output_dir}...")

with sync_playwright() as p:
    try:
        browser = p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        browser = p.chromium.launch(headless=True)

    for page_name, url in pages:
        for vp_name, vp_size in viewports:
            page = browser.new_page(viewport=vp_size)
            try:
                page.goto(url, wait_until="networkidle", timeout=15000)
                time.sleep(1)
                save_path = os.path.join(output_dir, f"{page_name}_{vp_name}.png")
                page.screenshot(path=save_path, full_page=False)
                print(f"Captured: {save_path}")
            except Exception as e:
                print(f"Error {url} {vp_name}: {e}")
            finally:
                page.close()
    browser.close()

print(f"Phase {phase} screenshots completed!")
