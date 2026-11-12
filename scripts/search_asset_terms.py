import os

for term in ['baker', 'prasuma', 'pringles', 'paper', 'whole truth', 'slurrp', 'alpenliebe', 'winkies']:
    matches = []
    for root, dirs, files in os.walk('.'):
        if 'node_modules' in root or '.git' in root or '.next' in root:
            continue
        for f in files:
            if term in f.lower():
                matches.append(os.path.join(root, f))
    print(f"Term '{term}': {len(matches)} matches: {matches[:3]}")
