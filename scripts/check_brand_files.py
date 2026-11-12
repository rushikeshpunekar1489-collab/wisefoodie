import os
import json

files = os.listdir('public/products')

def search_files(term):
    term = term.lower()
    return [f for f in files if term in f.lower()]

print("Britannia files in public/products (count:", len(search_files('britannia')), "):")
for f in sorted(search_files('britannia'))[:20]:
    print(" ", f)

print("\nParle files in public/products (count:", len(search_files('parle')), "):")
for f in sorted(search_files('parle'))[:20]:
    print(" ", f)

print("\nSunfeast / ITC files in public/products (count:", len(search_files('sunfeast')) + len(search_files('dark-fantasy')), "):")
for f in sorted(search_files('sunfeast') + search_files('dark-fantasy'))[:20]:
    print(" ", f)

print("\nUnibic files in public/products (count:", len(search_files('unibic')), "):")
for f in sorted(search_files('unibic'))[:20]:
    print(" ", f)
