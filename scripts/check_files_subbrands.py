import os

files = os.listdir('public/products')

for query in ['jimjam', 'treat', 'oreo', 'chocobakes', 'bourbon', 'digestive', 'marie', 'rusk', 'wafer', 'noodle', 'maggi', 'yippee', 'chana', 'bhujia', 'sev', 'namkeen']:
    m = [f for f in files if query in f.lower()]
    print(f"Query '{query}': {len(m)} files -> {m[:5]}")
