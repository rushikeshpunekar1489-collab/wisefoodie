import re

with open('C:/Users/ACER/.gemini/antigravity/brain/18ed5070-e89b-4cb2-a5df-9bb13afbfd0e/scratch/stitch1/code.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find script tag for tailwind config or similar
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
for i, s in enumerate(scripts):
    if 'tailwind' in s or 'theme' in s or 'colors' in s:
        print(f"=== Script {i} (length: {len(s)}) ===")
        print(s[:2000])

# check head for tailwind cdn or config
head = html[:html.find('</head>')]
print("=== Head preview ===")
for line in head.splitlines()[:30]:
    print(line)
