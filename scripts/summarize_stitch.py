import re

def summarize_html(path, label):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    print(f"=== {label} (length: {len(html)}) ===")
    
    # Extract Tailwind or style blocks
    styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
    print(f"Number of style tags: {len(styles)}")
    for i, s in enumerate(styles):
        print(f"  Style block {i} preview: {s[:300]}...\n")
        
    # Extract fonts and icons links in head
    head_links = re.findall(r'<link[^>]*>', html[:2000])
    print("Head links:")
    for l in head_links:
        print(" ", l)
        
    # Extract main structural elements
    print("\nMain structure:")
    headers = re.findall(r'<h[1-4][^>]*>.*?</h[1-4]>', html)
    for h in headers[:15]:
        print(" ", h[:120])

summarize_html('C:/Users/ACER/.gemini/antigravity/brain/18ed5070-e89b-4cb2-a5df-9bb13afbfd0e/scratch/stitch1/code.html', 'STITCH 1')
summarize_html('C:/Users/ACER/.gemini/antigravity/brain/18ed5070-e89b-4cb2-a5df-9bb13afbfd0e/scratch/stitch2/code.html', 'STITCH 2')
