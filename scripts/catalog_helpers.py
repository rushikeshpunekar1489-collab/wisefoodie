import os
import sys
import json
import time
import io
import requests
from PIL import Image
from ddgs import DDGS

# Public products directory
PRODUCTS_IMG_DIR = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\public\products"
os.makedirs(PRODUCTS_IMG_DIR, exist_ok=True)

OUTPUT_FILE = r"C:\Users\ACER\OneDrive\Desktop\sarwesh website\data\products.json"

WHOLE_FOOD_TERMS = [
    'whole grain', 'whole wheat', 'rolled oats', 'oats', 'ragi', 'jowar', 'bajra',
    'nuts', 'almonds', 'cashews', 'walnuts', 'peanuts',
    'seeds', 'chia seeds', 'flax seeds', 'pumpkin seeds', 'sunflower seeds',
    'pulses', 'dal', 'chana', 'moong', 'lentils', 'beans', 'chickpeas',
    'fruit', 'vegetable', 'apple', 'banana', 'curd', 'milk', 'paneer', 'yogurt', 'potato'
]

REFINED_AND_ADDITIVE_TERMS = [
    'refined wheat flour', 'maida', 'palm oil', 'palmolein', 'invert sugar',
    'high fructose corn syrup', 'corn syrup', 'maltodextrin', 'liquid glucose',
    'artificial flavour', 'nature identical flavour', 'synthetic food colour',
    'preservative', 'emulsifier', 'stabilizer', 'thickener', 'acidity regulator',
    'flavour enhancer', 'ins 471', 'ins 322', 'ins 150d', 'ins 635', 'ins 621',
    'caramel color', 'colour', 'ins 330', 'ins 338', 'sodium benzoate', 'potassium sorbate'
]

def compute_fbs(data):
    p100 = data['per100g']
    energy = p100.get('energyKcal', 0)
    protein = p100.get('proteinG', 0)
    carbs = p100.get('carbsG', 0)
    sugar = p100.get('totalSugarG', 0)
    added_sugar = p100.get('addedSugarG', sugar)
    fat = p100.get('fatG', 0)
    sat_fat = p100.get('satFatG', 0)
    trans_fat = p100.get('transFatG', 0)
    fibre = p100.get('fibreG', 0)
    sodium = p100.get('sodiumMg', 0)
    ingredients = [i.lower() for i in data.get('ingredients', [])]
    is_beverage = 'beverage' in data.get('category', '').lower() or 'juice' in data.get('name', '').lower() or 'drink' in data.get('name', '').lower() or 'cola' in data.get('name', '').lower()

    breakdown = []
    total_score = 6.0
    breakdown.append({
        'factor': 'Base Score',
        'value': '6.0',
        'points': 6.0,
        'reason': 'Standard baseline score for packaged foods'
    })

    # 1. Protein
    p_pts = min(1.5, (protein / 15.0) * 1.5)
    p_pts = round(p_pts, 2)
    total_score += p_pts
    breakdown.append({
        'factor': 'Protein',
        'value': f'{protein}g',
        'points': p_pts,
        'reason': f'+{p_pts} pts for {protein}g protein per 100g'
    })

    # 2. Fibre
    f_pts = min(1.5, (fibre / 6.0) * 1.5)
    f_pts = round(f_pts, 2)
    total_score += f_pts
    breakdown.append({
        'factor': 'Dietary Fibre',
        'value': f'{fibre}g',
        'points': f_pts,
        'reason': f'+{f_pts} pts for {fibre}g fibre per 100g'
    })

    # 3. Whole-Food Base
    first_two = ingredients[:2]
    has_whole = any(any(term in ing for term in WHOLE_FOOD_TERMS) for ing in first_two)
    if has_whole:
        total_score += 1.0
        breakdown.append({
            'factor': 'Whole-Food Base',
            'value': 'Wholesome base ingredient',
            'points': 1.0,
            'reason': 'Recognizable whole food as 1st/2nd ingredient'
        })

    # 4. Nutrient Density
    if energy > 0:
        density = (protein + fibre) / (energy / 100.0)
        nd_pts = min(0.5, (density / 5.0) * 0.5)
        nd_pts = round(nd_pts, 2)
        total_score += nd_pts
        breakdown.append({
            'factor': 'Nutrient Density',
            'value': f'{round(density, 1)}g / 100kcal',
            'points': nd_pts,
            'reason': 'Protein & fibre per 100 kcal'
        })

    # 5. Added Sugar
    s_pen = min(1.5, (added_sugar / 20.0) * 1.5)
    s_pen = round(s_pen, 2)
    total_score -= s_pen
    breakdown.append({
        'factor': 'Added / Simple Sugars',
        'value': f'{added_sugar}g',
        'points': -s_pen,
        'reason': f'-{s_pen} pts penalty for refined sugar'
    })

    # 6. Sodium
    base_sod = min(1.5, (sodium / 800.0) * 1.5)
    excess_sod = (sodium - 800.0) / 800.0 * 0.5 if sodium > 800 else 0
    sod_pen = round(min(2.0, base_sod + excess_sod), 2)
    total_score -= sod_pen
    breakdown.append({
        'factor': 'Sodium',
        'value': f'{sodium}mg',
        'points': -sod_pen,
        'reason': f'-{sod_pen} pts sodium penalty'
    })

    # 7. Saturated Fat
    sat_pen = min(1.0, (sat_fat / 10.0) * 1.0)
    sat_pen = round(sat_pen, 2)
    total_score -= sat_pen
    breakdown.append({
        'factor': 'Saturated Fat',
        'value': f'{sat_fat}g',
        'points': -sat_pen,
        'reason': f'-{sat_pen} pts saturated lipid penalty'
    })

    # 8. Trans Fat
    if trans_fat > 0.2:
        total_score -= 0.5
        breakdown.append({
            'factor': 'Trans Fat',
            'value': f'{trans_fat}g',
            'points': -0.5,
            'reason': 'Trans fatty acids detected'
        })

    # 9. Ultra Processing
    ing_text = ' '.join(ingredients)
    flagged = sum(1 for term in REFINED_AND_ADDITIVE_TERMS if term in ing_text)
    if flagged >= 5:
        total_score -= 0.7
        breakdown.append({
            'factor': 'Ultra-Processing Penalty',
            'value': f'{flagged} flagged items',
            'points': -0.7,
            'reason': 'Multiple industrial additives and refined starches'
        })

    # 10. Energy Density
    if energy > 450:
        total_score -= 0.3
        breakdown.append({
            'factor': 'High Calorie Density',
            'value': f'{energy} kcal/100g',
            'points': -0.3,
            'reason': 'High energy density (>450 kcal/100g)'
        })

    # 11. Liquid Sugar Beverage Anchor
    if is_beverage and added_sugar >= 8.0 and protein < 0.5 and fibre < 0.2:
        total_score -= 2.5
        breakdown.append({
            'factor': 'Liquid Sugar Anchor',
            'value': 'Sugar-Sweetened Beverage',
            'points': -2.5,
            'reason': 'High glycemic liquid calories lacking satiety'
        })

    clamped = max(1.0, min(10.0, total_score))
    final_score = round(clamped, 1)

    if final_score >= 9.0:
        band = 'Excellent'
    elif final_score >= 8.0:
        band = 'Very Good'
    elif final_score >= 7.0:
        band = 'Good'
    elif final_score >= 5.0:
        band = 'Moderate'
    elif final_score >= 3.0:
        band = 'Limited'
    else:
        band = 'Poor'

    return {
        'score': final_score,
        'band': band,
        'breakdown': breakdown
    }

def compute_nutrition_per_paisa(price_inr, pack_size_g, p100):
    if not price_inr or price_inr <= 0 or not pack_size_g or pack_size_g <= 0:
        return {'proteinPerRupee': None, 'fibrePerRupee': None, 'tenRupeesGet': []}

    cost_per_gram = price_inr / pack_size_g
    protein_per_g = (p100.get('proteinG') or 0) / 100.0
    fibre_per_g = (p100.get('fibreG') or 0) / 100.0
    energy_per_g = (p100.get('energyKcal') or 0) / 100.0

    protein_per_rupee = round(protein_per_g / cost_per_gram, 2)
    fibre_per_rupee = round(fibre_per_g / cost_per_gram, 2)

    grams_for_10 = (10.0 / price_inr) * pack_size_g
    ten_rupees_get = [
        {'nutrient': 'Energy', 'amount': f"{round(grams_for_10 * energy_per_g)} kcal"},
        {'nutrient': 'Protein', 'amount': f"{round(grams_for_10 * protein_per_g, 1)}g"},
        {'nutrient': 'Dietary Fibre', 'amount': f"{round(grams_for_10 * fibre_per_g, 1)}g"},
    ]

    return {
        'proteinPerRupee': protein_per_rupee,
        'fibrePerRupee': fibre_per_rupee,
        'tenRupeesGet': ten_rupees_get
    }

def download_product_image(search_query, slug):
    target_path = os.path.join(PRODUCTS_IMG_DIR, f"{slug}.webp")
    # If already exists and size > 5KB, reuse
    if os.path.exists(target_path) and os.path.getsize(target_path) > 5000:
        return f"/products/{slug}.webp"

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        with DDGS() as ddgs:
            results = list(ddgs.images(search_query, max_results=3))
            for r in results:
                try:
                    resp = requests.get(r['image'], headers=headers, timeout=6)
                    if resp.status_code == 200 and len(resp.content) > 3000:
                        img = Image.open(io.BytesIO(resp.content)).convert('RGB')
                        # Resize if too large
                        if max(img.size) > 1200:
                            img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                        img.save(target_path, 'WEBP', quality=85)
                        print(f"Downloaded image for {slug}: {img.size}")
                        return f"/products/{slug}.webp"
                except Exception as ie:
                    continue
    except Exception as e:
        print(f"Error querying image for {slug}: {e}")

    # Fallback to catalog cover if exists
    return f"/products/{slug}.webp" if os.path.exists(target_path) else None
