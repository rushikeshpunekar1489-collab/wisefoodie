import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\docs\screenshots"
os.makedirs(output_dir, exist_ok=True)

viewports = [
    ("mobile_375", {"width": 375, "height": 812}),
    ("tablet_768", {"width": 768, "height": 1024}),
    ("desktop_1440", {"width": 1440, "height": 900}),
]

pages_to_test = [
    ("home", "http://localhost:3000/"),
    ("explore", "http://localhost:3000/explore"),
    ("product_report", "http://localhost:3000/food/amul-tricone-butterscotch"),
    ("compare", "http://localhost:3000/compare"),
]

print("Launching Playwright to capture responsive screenshots...")

with sync_playwright() as p:
    try:
        browser = p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        browser = p.chromium.launch(channel="chrome", headless=True)
    
    for page_name, url in pages_to_test:
        for vp_name, vp_size in viewports:
            # Skip tablet on product/compare to save time
            if vp_name == "tablet_768" and page_name in ["product_report", "compare"]:
                continue
                
            page = browser.new_page(viewport=vp_size)
            try:
                page.goto(url, wait_until="networkidle", timeout=15000)
                time.sleep(1) # wait for animations
                save_path = os.path.join(output_dir, f"{page_name}_{vp_name}.png")
                page.screenshot(path=save_path, full_page=False)
                print(f"Captured: {save_path} ({vp_size['width']}x{vp_size['height']})")
            except Exception as e:
                print(f"Error capturing {url} at {vp_name}: {e}")
            finally:
                page.close()
                
    browser.close()

print("All responsive verification screenshots saved successfully!")
