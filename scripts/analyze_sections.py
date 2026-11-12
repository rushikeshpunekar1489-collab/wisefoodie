import re

with open('scripts/stitch1_main.html', 'r', encoding='utf-8') as f:
    s1 = f.read()

print("=== STITCH 1 SECTIONS ===")
# Find all top-level sections / divs inside main
sections = re.findall(r'<section[^>]*>.*?</section>', s1, re.DOTALL)
print(f"Total <section> tags: {len(sections)}")
for i, s in enumerate(sections):
    h = re.search(r'<h[1-4][^>]*>(.*?)</h[1-4]>', s)
    h_text = h.group(0) if h else "No heading"
    print(f"Section {i}: length {len(s)} | Heading: {h_text}")

with open('scripts/stitch2_main.html', 'r', encoding='utf-8') as f:
    s2 = f.read()

print("\n=== STITCH 2 SECTIONS ===")
sections2 = re.findall(r'<section[^>]*>.*?</section>', s2, re.DOTALL)
print(f"Total <section> tags: {len(sections2)}")
for i, s in enumerate(sections2):
    h = re.search(r'<h[1-4][^>]*>(.*?)</h[1-4]>', s)
    h_text = h.group(0) if h else "No heading"
    print(f"Section {i}: length {len(s)} | Heading: {h_text}")
