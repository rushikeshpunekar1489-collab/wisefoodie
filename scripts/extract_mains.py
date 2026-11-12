import re

def inspect_main(path, out_file):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    main = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    if main:
        with open(out_file, 'w', encoding='utf-8') as out:
            out.write(main.group(0))
        print(f"Wrote main from {path} to {out_file} (length: {len(main.group(0))})")

inspect_main('C:/Users/ACER/.gemini/antigravity/brain/18ed5070-e89b-4cb2-a5df-9bb13afbfd0e/scratch/stitch1/code.html', 'scripts/stitch1_main.html')
inspect_main('C:/Users/ACER/.gemini/antigravity/brain/18ed5070-e89b-4cb2-a5df-9bb13afbfd0e/scratch/stitch2/code.html', 'scripts/stitch2_main.html')
