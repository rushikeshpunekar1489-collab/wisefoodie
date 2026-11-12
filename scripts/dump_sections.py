import re

def print_sections(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # get header
    header = re.search(r'<header[^>]*>.*?</header>', html, re.DOTALL)
    print("=== HEADER ===")
    if header:
        print(header.group(0)[:1500])
        
    # get bottom nav
    nav = re.search(r'<nav[^>]*>.*?</nav>', html, re.DOTALL)
    print("\n=== NAV ===")
    if nav:
        print(nav.group(0)[:1500])
        
    # get footer
    footer = re.search(r'<footer[^>]*>.*?</footer>', html, re.DOTALL)
    print("\n=== FOOTER ===")
    if footer:
        print(footer.group(0)[:1500])

print("--- STITCH 1 ---")
print_sections('C:/Users/ACER/.gemini/antigravity/brain/18ed5070-e89b-4cb2-a5df-9bb13afbfd0e/scratch/stitch1/code.html')
