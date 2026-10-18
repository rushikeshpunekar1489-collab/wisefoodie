import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\docs\screenshots\phase-3"
os.makedirs(output_dir, exist_ok=True)

viewports = [
    ("mobile_375", {"width": 375, "height": 812}),
    ("tablet_768", {"width": 768, "height": 1024}),
    ("desktop_1440", {"width": 1440, "height": 900}),
]

print(f"Capturing Phase 3 screenshots to {output_dir}...")

with sync_playwright() as p:
    try:
        browser = p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        browser = p.chromium.launch(channel="chrome", headless=True)

    # 1. First visit product page and add 2 items to the smart cart
    setup_page = browser.new_page(viewport={"width": 1440, "height": 900})
    setup_page.goto("http://localhost:3000/food/amul-gold-milk", wait_until="networkidle")
    time.sleep(1)
    add_btn = setup_page.locator('button:has-text("Add to Basket")').first
    if add_btn.is_visible():
        add_btn.click()
        time.sleep(0.5)

    setup_page.goto("http://localhost:3000/food/maggi-2-minute-noodles", wait_until="networkidle")
    time.sleep(1)
    add_btn2 = setup_page.locator('button:has-text("Add to Basket")').first
    if add_btn2.is_visible():
        add_btn2.click()
        time.sleep(0.5)
    setup_page.close()

    # 2. Capture /cart page at 3 viewports
    for vp_name, vp_size in viewports:
        page = browser.new_page(viewport=vp_size)
        try:
            # Set localStorage cart items directly to ensure populated state
            page.goto("http://localhost:3000/cart", wait_until="networkidle")
            page.evaluate("""() => {
                const sampleCart = {
                    version: 1,
                    items: [
                        { slug: 'amul-gold-milk', quantity: 2, addedAt: Date.now() },
                        { slug: 'maggi-2-minute-noodles', quantity: 3, addedAt: Date.now() },
                        { slug: 'cadbury-dairy-milk-silk', quantity: 1, addedAt: Date.now() }
                    ]
                };
                localStorage.setItem('wf_cart_v1', JSON.stringify(sampleCart));
            }""")
            page.reload(wait_until="networkidle")
            time.sleep(1.5)

            path = os.path.join(output_dir, f"smart_cart_{vp_name}.png")
            page.screenshot(path=path)
            print(f"Captured: {path}")
        except Exception as e:
            print(f"Error on cart page at {vp_name}: {e}")
        finally:
            page.close()

    browser.close()

print("Phase 3 screenshots completed!")
