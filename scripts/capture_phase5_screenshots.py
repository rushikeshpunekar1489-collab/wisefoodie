import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\docs\screenshots\phase-5"
os.makedirs(output_dir, exist_ok=True)

viewports = [
    ("mobile_375", {"width": 375, "height": 812}),
    ("tablet_768", {"width": 768, "height": 1024}),
    ("desktop_1440", {"width": 1440, "height": 900}),
]

print(f"Capturing Phase 5 screenshots to {output_dir}...")

with sync_playwright() as p:
    try:
        browser = p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        browser = p.chromium.launch(channel="chrome", headless=True)

    # 1. Capture Header & Navigation in Hindi (hi) at 3 viewports
    for vp_name, vp_size in viewports:
        page = browser.new_page(viewport=vp_size)
        try:
            page.goto("http://localhost:3000", wait_until="networkidle")
            page.evaluate("""() => {
                localStorage.setItem('wf_locale', 'hi');
                document.documentElement.lang = 'hi';
            }""")
            page.reload(wait_until="networkidle")
            time.sleep(1.5)

            path = os.path.join(output_dir, f"language_hindi_{vp_name}.png")
            page.screenshot(path=path)
            print(f"Captured: {path}")
        except Exception as e:
            print(f"Error at {vp_name}: {e}")
        finally:
            page.close()

    # 2. Capture in Marathi (mr) at desktop
    page_mr = browser.new_page(viewport={"width": 1440, "height": 900})
    try:
        page_mr.goto("http://localhost:3000", wait_until="networkidle")
        page_mr.evaluate("""() => {
            localStorage.setItem('wf_locale', 'mr');
            document.documentElement.lang = 'mr';
        }""")
        page_mr.reload(wait_until="networkidle")
        time.sleep(1.5)

        path = os.path.join(output_dir, "language_marathi_desktop_1440.png")
        page_mr.screenshot(path=path)
        print(f"Captured: {path}")
    except Exception as e:
        print(f"Error on Marathi desktop capture: {e}")
    finally:
        page_mr.close()

    browser.close()

print("Phase 5 screenshots completed!")
