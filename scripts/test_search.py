import json
import re

with open('data/indian_nutrition_db.json', 'r', encoding='utf-8') as f:
    foods = json.load(f)

def search_foods(query, foods_list, limit=5):
    q = query.strip().lower()
    q_tokens = [t for t in re.split(r'\s+', q) if t]
    if not q_tokens:
        return []

    results = []
    for food in foods_list:
        score = 0
        name_lower = food['name'].lower()
        name_en_lower = (food.get('nameEn') or '').lower()
        name_local_lower = (food.get('nameLocal') or '').lower()
        aliases = [a.lower() for a in food.get('aliases', [])]

        # Exact match on full query
        if q == name_lower or q == name_en_lower or q == name_local_lower:
            score += 200
        elif name_lower.startswith(q) or name_en_lower.startswith(q) or name_local_lower.startswith(q):
            score += 120
        elif q in name_lower or q in name_en_lower or q in name_local_lower:
            score += 80

        # Exact match in aliases
        if q in aliases:
            score += 90
        elif any(a.startswith(q) for a in aliases):
            score += 50
        elif any(q in a for a in aliases):
            score += 30

        # Token matches
        matched_tokens = 0
        for token in q_tokens:
            token_hit = False
            if token in name_lower or token in name_en_lower or token in name_local_lower:
                token_hit = True
                score += 30
            elif any(token in a for a in aliases):
                token_hit = True
                score += 20
            
            if token_hit:
                matched_tokens += 1

        if matched_tokens == len(q_tokens):
            score += 50

        if score > 0:
            results.append((score, food))

    results.sort(key=lambda x: x[0], reverse=True)
    return [(score, f['code'], f['name'], f['provenance'], f['oilBreakdown']['available']) for score, f in results[:limit]]

test_queries = [
    'Aloo Gobi',
    'Palak Paneer',
    'Batata',
    'Bhindi',
    'भिंडी',
    'Bhendi',
    'Vangi',
    'Baingan Bharta',
    'Poha',
    'पोहा',
    'Upma',
    'Idli',
    'Dosa',
    'Roti',
    'Chapati',
    'Rajma',
    'Khichdi',
    'Dal',
    'Matar Paneer',
    'Sweet Lassi',
    'Amaranth'
]

print("=== SEARCH ENGINE ACCURACY TEST ===")
for tq in test_queries:
    res = search_foods(tq, foods, limit=3)
    print(f"\nQuery: '{tq}' (Matches: {len(res)})")
    for r in res:
        print(f"   [{r[0]} pts] {r[1]}: {r[2]} | Source: {r[3]} | Oil: {r[4]}")
