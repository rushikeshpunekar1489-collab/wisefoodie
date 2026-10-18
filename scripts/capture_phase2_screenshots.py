import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\docs\screenshots\phase-2"
os.makedirs(output_dir, exist_ok=True)

viewports = [
    ("mobile_375", {"width": 375, "height": 812}),
    ("tablet_768", {"width": 768, "height": 1024}),
    ("desktop_1440", {"width": 1440, "height": 900}),
]

print(f"Capturing Phase 2 screenshots to {output_dir}...")

with sync_playwright() as p:
    try:
        browser = p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        browser = p.chromium.launch(channel="chrome", headless=True)

    # 1. Product page with Heart and Share buttons
    for vp_name, vp_size in viewports:
        page = browser.new_page(viewport=vp_size)
        try:
            page.goto("http://localhost:3000/food/amul-gold-milk", wait_until="networkidle", timeout=15000)
            time.sleep(1)
            # Add to favourites by clicking the heart button
            heart_btn = page.locator('button[aria-label*="favourites"]').first
            if heart_btn.is_visible():
                heart_btn.click()
                time.sleep(0.5)

            path = os.path.join(output_dir, f"product_share_fav_{vp_name}.png")
            page.screenshot(path=path)
            print(f"Captured: {path}")

            # Open share modal on desktop to capture it
            if vp_name == "desktop_1440":
                share_btn = page.locator('button:has-text("Share")').first
                if share_btn.is_visible():
                    share_btn.click()
                    time.sleep(1)
                    modal_path = os.path.join(output_dir, f"share_card_modal_{vp_name}.png")
                    page.screenshot(path=modal_path)
                    print(f"Captured: {modal_path}")
        except Exception as e:
            print(f"Error on product page at {vp_name}: {e}")
        finally:
            page.close()

    # 2. Favourites page
    for vp_name, vp_size in viewports:
        page = browser.new_page(viewport=vp_size)
        try:
            page.goto("http://localhost:3000/favourites", wait_until="networkidle", timeout=15000)
            time.sleep(1)
            path = os.path.join(output_dir, f"favourites_page_{vp_name}.png")
            page.screenshot(path=path)
            print(f"Captured: {path}")
        except Exception as e:
            print(f"Error on favourites page at {vp_name}: {e}")
        finally:
            page.close()

    browser.close()

print("Phase 2 screenshots completed!")
