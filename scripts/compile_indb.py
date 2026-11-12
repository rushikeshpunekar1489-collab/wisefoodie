import os
import json
import math
import re
import pandas as pd

# Paths
local_wb = r"C:\Users\ACER\Downloads\Anuvaad_INDB_2024.11.xlsx"
repo_dir = r"data\indb_repo"
output_db = r"data\indian_nutrition_db.json"
output_summary = r"data\indian_nutrition_summary.json"

print("Starting INDB Nutrition Data Import & Compilation...")

# 1. Load Anuvaad_INDB_2024.11.xlsx
df_anuvaad = pd.read_excel(local_wb)
print(f"Loaded Anuvaad INDB: {df_anuvaad.shape[0]} rows, {df_anuvaad.shape[1]} cols")

# 2. Load recipes.xlsx for ingredients & oil data
df_recipes = pd.read_excel(os.path.join(repo_dir, "recipes.xlsx"))
print(f"Loaded recipes.xlsx: {df_recipes.shape[0]} ingredient rows")

# 3. Load recipes_servingsize.xlsx
df_servings = pd.read_excel(os.path.join(repo_dir, "recipes_servingsize.xlsx"))
print(f"Loaded recipes_servingsize.xlsx: {df_servings.shape[0]} rows")

# 4. Load NIN_fct.xlsx (Raw foods from ICMR-NIN)
df_nin = pd.read_excel(os.path.join(repo_dir, "NIN_fct.xlsx"))
print(f"Loaded NIN_fct.xlsx: {df_nin.shape[0]} raw food rows")

# Map servingsize info by recipe_code
servings_map = {}
for _, row in df_servings.iterrows():
    code = str(row['recipe_code']).strip()
    servings_map[code] = {
        'no_of_servings': float(row['no_of_servings']) if pd.notna(row['no_of_servings']) and float(row['no_of_servings']) > 0 else 1.0,
        'size_of_servings': float(row['size_of_servings']) if pd.notna(row['size_of_servings']) else None,
        'servings_unit': str(row['servings_unit']).strip() if pd.notna(row['servings_unit']) else 'serving',
        'remarks': str(row['remarks_1']).strip() if pd.notna(row['remarks_1']) else None
    }

# Map recipe ingredients and oil breakdown by recipe_code
recipe_ingredients_map = {}
recipe_oil_map = {}

# Standard oil density / weight per unit (based on INDB.do Stata conversions)
# 1 tsp oil/ghee/butter = 4g, 1 tbsp = 13.5g, 1 ml = 0.92g, 1 C (cup) = 227g butter / 218g oil, 1 g = 1g
def convert_to_grams(amount, unit, food_name):
    if pd.isna(amount) or amount <= 0:
        return 0.0
    u = str(unit).strip().lower()
    fn = str(food_name).lower()
    if u == 'g':
        return float(amount)
    elif u == 'tsp':
        return float(amount) * 4.0
    elif u == 'tbsp':
        return float(amount) * 13.5
    elif u == 'ml':
        return float(amount) * 0.92
    elif u == 'c':
        return float(amount) * (227.0 if 'butter' in fn else 218.0)
    return float(amount)

oil_keywords = ['oil', 'ghee', 'butter', 'margarine', 'vanaspati']
non_oil_excludes = ['peanut butter', 'egg', 'chicken', 'lamb', 'beansprouts', 'rice', 'potato', 'water', 'silver foil', 'stock', 'sugar', 'cream', 'milk', 'sweetcorn']

for code, group in df_recipes.groupby('recipe_code'):
    code_str = str(code).strip()
    ingredients_list = []
    oil_items = []
    total_oil_g = 0.0

    for _, row in group.iterrows():
        ing_name = str(row['food_name']).strip() if pd.notna(row['food_name']) else str(row['ingredient_name_org']).strip()
        amt = float(row['amount']) if pd.notna(row['amount']) else 0.0
        unit = str(row['unit']).strip() if pd.notna(row['unit']) else 'g'
        amt_org = str(row['amount_org']).strip() if pd.notna(row['amount_org']) else ''
        unit_org = str(row['unit_org']).strip() if pd.notna(row['unit_org']) else ''

        ingredients_list.append({
            'name': ing_name,
            'amount': amt,
            'unit': unit,
            'original': f"{amt_org} {unit_org}".strip()
        })

        # Check if pure cooking oil/fat
        fn_lower = ing_name.lower()
        is_oil = any(k in fn_lower for k in oil_keywords) and not any(ex in fn_lower for ex in non_oil_excludes)
        if is_oil:
            grams = convert_to_grams(amt, unit, ing_name)
            oil_items.append({
                'name': ing_name,
                'raw_amount': amt,
                'raw_unit': unit,
                'grams': round(grams, 2)
            })
            total_oil_g += grams

    recipe_ingredients_map[code_str] = ingredients_list
    if len(oil_items) > 0 and total_oil_g > 0:
        recipe_oil_map[code_str] = {
            'has_oil': True,
            'oil_items': oil_items,
            'total_oil_g': round(total_oil_g, 2),
            'unique_oil_types': list(set([o['name'] for o in oil_items]))
        }
    else:
        recipe_oil_map[code_str] = {
            'has_oil': False,
            'oil_items': [],
            'total_oil_g': 0.0,
            'unique_oil_types': []
        }

print(f"Mapped {len(recipe_ingredients_map)} recipe ingredient lists")
print(f"Found {sum(1 for v in recipe_oil_map.values() if v['has_oil'])} recipes with verified added oil/fat")

# Helper to safely clean numeric value (preserve None / undefined if not available)
def clean_num(val):
    if pd.isna(val) or val is None:
        return None
    try:
        f = float(val)
        return None if math.isnan(f) else round(f, 3)
    except:
        return None

# Compile Master Food List
all_food_records = []

# A. Process 1,014 Prepared Dishes from Anuvaad INDB
for _, row in df_anuvaad.iterrows():
    code = str(row['food_code']).strip()
    raw_name = str(row['food_name']).strip()
    source_key = str(row['primarysource']).strip()

    # Determine provenance display name
    if source_key == 'asc_manual':
        provenance = 'Art & Science of Cooking (ASC 5th Ed.)'
        source_category = 'Cooked Dish (ASC Recipe)'
    elif source_key == 'bfp_manual':
        provenance = 'Basic Food Preparation (BFP 4th Ed.)'
        source_category = 'Cooked Dish (BFP Recipe)'
    else:
        provenance = 'Open Source Recipes (INDB OSR)'
        source_category = 'Cooked Dish (OSR Recipe)'

    # Extract English and local name if given in parentheses: "Potato cauliflower (Aloo gobhi)"
    match = re.match(r'^(.*?)\s*\((.*?)\)\s*$', raw_name)
    if match:
        name_en = match.group(1).strip()
        name_local = match.group(2).strip()
    else:
        name_en = raw_name
        name_local = None

    # Servings information
    serv_info = servings_map.get(code, {})
    no_of_servings = serv_info.get('no_of_servings', 1.0)
    servings_unit_name = serv_info.get('servings_unit', 'serving')
    serving_weight_g = clean_num(row.get('servings_unit')) or serv_info.get('size_of_servings') or 100.0

    # Oil breakdown
    oil_info = recipe_oil_map.get(code, {'has_oil': False, 'oil_items': [], 'total_oil_g': 0.0, 'unique_oil_types': []})
    oil_per_serving_g = round(oil_info['total_oil_g'] / no_of_servings, 2) if oil_info['has_oil'] and no_of_servings > 0 else 0.0
    oil_cals_per_serving = round(oil_per_serving_g * 9.0, 1)

    record = {
        'id': f"INDB-{code}",
        'code': code,
        'name': raw_name,
        'nameEn': name_en,
        'nameLocal': name_local,
        'foodType': 'cooked',
        'foodGroup': 'Cooked Indian Recipe',
        'category': source_category,
        'provenance': provenance,
        'primarySource': source_key,
        'servingInfo': {
            'servingWeightG': serving_weight_g,
            'servingUnit': servings_unit_name,
            'noOfServingsInRecipe': no_of_servings,
            'servingLabel': f"1 {servings_unit_name} ({int(serving_weight_g) if serving_weight_g.is_integer() else serving_weight_g}g)"
        },
        'oilBreakdown': {
            'available': oil_info['has_oil'],
            'oilTypes': oil_info['unique_oil_types'],
            'totalRecipeOilG': oil_info['total_oil_g'],
            'oilPerServingG': oil_per_serving_g if oil_info['has_oil'] else None,
            'oilCaloriesPerServing': oil_cals_per_serving if oil_info['has_oil'] else None,
            'oilItems': oil_info['oil_items'],
            'note': 'Calculated from source recipe ingredients' if oil_info['has_oil'] else 'Oil quantity not available in source recipe.'
        },
        'ingredients': recipe_ingredients_map.get(code, []),
        'nutrientsPer100g': {
            'energyKcal': clean_num(row.get('energy_kcal')),
            'energyKj': clean_num(row.get('energy_kj')),
            'proteinG': clean_num(row.get('protein_g')),
            'carbG': clean_num(row.get('carb_g')),
            'fatG': clean_num(row.get('fat_g')),
            'fibreG': clean_num(row.get('fibre_g')),
            'freeSugarG': clean_num(row.get('freesugar_g')),
            'sfaMg': clean_num(row.get('sfa_mg')),
            'mufaMg': clean_num(row.get('mufa_mg')),
            'pufaMg': clean_num(row.get('pufa_mg')),
            'cholesterolMg': clean_num(row.get('cholesterol_mg')),
            'calciumMg': clean_num(row.get('calcium_mg')),
            'phosphorusMg': clean_num(row.get('phosphorus_mg')),
            'magnesiumMg': clean_num(row.get('magnesium_mg')),
            'sodiumMg': clean_num(row.get('sodium_mg')),
            'potassiumMg': clean_num(row.get('potassium_mg')),
            'ironMg': clean_num(row.get('iron_mg')),
            'copperMg': clean_num(row.get('copper_mg')),
            'zincMg': clean_num(row.get('zinc_mg')),
            'seleniumUg': clean_num(row.get('selenium_ug')),
            'chromiumMg': clean_num(row.get('chromium_mg')),
            'manganeseMg': clean_num(row.get('manganese_mg')),
            'molybdenumMg': clean_num(row.get('molybdenum_mg')),
            'vitaUg': clean_num(row.get('vita_ug')),
            'viteMg': clean_num(row.get('vite_mg')),
            'vitd2Ug': clean_num(row.get('vitd2_ug')),
            'vitd3Ug': clean_num(row.get('vitd3_ug')),
            'vitk1Ug': clean_num(row.get('vitk1_ug')),
            'vitk2Ug': clean_num(row.get('vitk2_ug')),
            'folateUg': clean_num(row.get('folate_ug')),
            'vitb1Mg': clean_num(row.get('vitb1_mg')),
            'vitb2Mg': clean_num(row.get('vitb2_mg')),
            'vitb3Mg': clean_num(row.get('vitb3_mg')),
            'vitb5Mg': clean_num(row.get('vitb5_mg')),
            'vitb6Mg': clean_num(row.get('vitb6_mg')),
            'vitb7Ug': clean_num(row.get('vitb7_ug')),
            'vitb9Ug': clean_num(row.get('vitb9_ug')),
            'vitcMg': clean_num(row.get('vitc_mg')),
            'carotenoidsUg': clean_num(row.get('carotenoids_ug')),
        },
        'nutrientsPerServing': {
            'energyKcal': clean_num(row.get('unit_serving_energy_kcal')),
            'energyKj': clean_num(row.get('unit_serving_energy_kj')),
            'proteinG': clean_num(row.get('unit_serving_protein_g')),
            'carbG': clean_num(row.get('unit_serving_carb_g')),
            'fatG': clean_num(row.get('unit_serving_fat_g')),
            'fibreG': clean_num(row.get('unit_serving_fibre_g')),
            'freeSugarG': clean_num(row.get('unit_serving_freesugar_g')),
            'sfaMg': clean_num(row.get('unit_serving_sfa_mg')),
            'mufaMg': clean_num(row.get('unit_serving_mufa_mg')),
            'pufaMg': clean_num(row.get('unit_serving_pufa_mg')),
            'cholesterolMg': clean_num(row.get('unit_serving_cholesterol_mg')),
            'calciumMg': clean_num(row.get('unit_serving_calcium_mg')),
            'phosphorusMg': clean_num(row.get('unit_serving_phosphorus_mg')),
            'magnesiumMg': clean_num(row.get('unit_serving_magnesium_mg')),
            'sodiumMg': clean_num(row.get('unit_serving_sodium_mg')),
            'potassiumMg': clean_num(row.get('unit_serving_potassium_mg')),
            'ironMg': clean_num(row.get('unit_serving_iron_mg')),
            'copperMg': clean_num(row.get('unit_serving_copper_mg')),
            'zincMg': clean_num(row.get('unit_serving_zinc_mg')),
            'seleniumUg': clean_num(row.get('unit_serving_selenium_ug')),
            'chromiumMg': clean_num(row.get('unit_serving_chromium_mg')),
            'manganeseMg': clean_num(row.get('unit_serving_manganese_mg')),
            'molybdenumMg': clean_num(row.get('unit_serving_molybdenum_mg')),
            'vitaUg': clean_num(row.get('unit_serving_vita_ug')),
            'viteMg': clean_num(row.get('unit_serving_vite_mg')),
            'vitd2Ug': clean_num(row.get('unit_serving_vitd2_ug')),
            'vitd3Ug': clean_num(row.get('unit_serving_vitd3_ug')),
            'vitk1Ug': clean_num(row.get('unit_serving_vitk1_ug')),
            'vitk2Ug': clean_num(row.get('unit_serving_vitk2_ug')),
            'folateUg': clean_num(row.get('unit_serving_folate_ug')),
            'vitb1Mg': clean_num(row.get('unit_serving_vitb1_mg')),
            'vitb2Mg': clean_num(row.get('unit_serving_vitb2_mg')),
            'vitb3Mg': clean_num(row.get('unit_serving_vitb3_mg')),
            'vitb5Mg': clean_num(row.get('unit_serving_vitb5_mg')),
            'vitb6Mg': clean_num(row.get('unit_serving_vitb6_mg')),
            'vitb7Ug': clean_num(row.get('unit_serving_vitb7_ug')),
            'vitb9Ug': clean_num(row.get('unit_serving_vitb9_ug')),
            'vitcMg': clean_num(row.get('unit_serving_vitc_mg')),
            'carotenoidsUg': clean_num(row.get('unit_serving_carotenoids_ug')),
        }
    }
    all_food_records.append(record)

print(f"Processed {len(all_food_records)} prepared recipes from Anuvaad INDB")

# B. Process 897 Raw Indian Foods from NIN_fct
raw_count = 0
for _, row in df_nin.iterrows():
    code = str(row['food_code']).strip()
    name = str(row['food_name']).strip()
    grp = str(row['food_group_nin']).strip() if pd.notna(row['food_group_nin']) else 'Raw Indian Food'

    # Check scientific name in parenthesis: e.g. "Amaranth seed, black (Amaranthus cruentus)"
    match = re.match(r'^(.*?)\s*\((.*?)\)\s*$', name)
    if match:
        name_en = match.group(1).strip()
        sci_name = match.group(2).strip()
    else:
        name_en = name
        sci_name = None

    record = {
        'id': f"NIN-{code}",
        'code': code,
        'name': name,
        'nameEn': name_en,
        'nameLocal': sci_name,
        'foodType': 'raw',
        'foodGroup': grp,
        'category': f"Raw Food ({grp})",
        'provenance': 'ICMR-NIN Indian Food Composition Tables (IFCT 2017)',
        'primarySource': 'icmr_nin_ifct',
        'servingInfo': {
            'servingWeightG': 100.0,
            'servingUnit': 'standard portion',
            'noOfServingsInRecipe': 1.0,
            'servingLabel': '100g standard portion'
        },
        'oilBreakdown': {
            'available': False,
            'oilTypes': [],
            'totalRecipeOilG': 0.0,
            'oilPerServingG': None,
            'oilCaloriesPerServing': None,
            'oilItems': [],
            'note': 'Raw ingredient (unprepared). No added cooking oil.'
        },
        'ingredients': [],
        'nutrientsPer100g': {
            'energyKcal': clean_num(row.get('energy_kcal')),
            'energyKj': clean_num(row.get('energy_kj')),
            'proteinG': clean_num(row.get('protein_g')),
            'carbG': clean_num(row.get('carb_g')),
            'fatG': clean_num(row.get('fat_g')),
            'fibreG': clean_num(row.get('fibre_g')),
            'freeSugarG': clean_num(row.get('freesugar_g')),
            'sfaMg': clean_num(row.get('sfa_mg')),
            'mufaMg': clean_num(row.get('mufa_mg')),
            'pufaMg': clean_num(row.get('pufa_mg')),
            'cholesterolMg': clean_num(row.get('cholesterol_mg')),
            'calciumMg': clean_num(row.get('calcium_mg')),
            'phosphorusMg': clean_num(row.get('phosphorus_mg')),
            'magnesiumMg': clean_num(row.get('magnesium_mg')),
            'sodiumMg': clean_num(row.get('sodium_mg')),
            'potassiumMg': clean_num(row.get('potassium_mg')),
            'ironMg': clean_num(row.get('iron_mg')),
            'copperMg': clean_num(row.get('copper_mg')),
            'zincMg': clean_num(row.get('zinc_mg')),
            'seleniumUg': clean_num(row.get('selenium_ug')),
            'chromiumMg': clean_num(row.get('chromium_mg')),
            'manganeseMg': clean_num(row.get('manganese_mg')),
            'molybdenumMg': clean_num(row.get('molybdenum_mg')),
            'vitaUg': clean_num(row.get('vita_ug')),
            'viteMg': clean_num(row.get('vite_mg')),
            'vitd2Ug': clean_num(row.get('vitd2_ug')),
            'vitd3Ug': clean_num(row.get('vitd3_ug')),
            'vitk1Ug': clean_num(row.get('vitk1_ug')),
            'vitk2Ug': clean_num(row.get('vitk2_ug')),
            'folateUg': clean_num(row.get('folate_ug')),
            'vitb1Mg': clean_num(row.get('vitb1_mg')),
            'vitb2Mg': clean_num(row.get('vitb2_mg')),
            'vitb3Mg': clean_num(row.get('vitb3_mg')),
            'vitb5Mg': clean_num(row.get('vitb5_mg')),
            'vitb6Mg': clean_num(row.get('vitb6_mg')),
            'vitb7Ug': clean_num(row.get('vitb7_ug')),
            'vitb9Ug': clean_num(row.get('vitb9_ug')),
            'vitcMg': clean_num(row.get('vitc_mg')),
            'carotenoidsUg': clean_num(row.get('carotenoids_ug')),
        },
        'nutrientsPerServing': {
            # For raw foods, 1 portion = 100g
            'energyKcal': clean_num(row.get('energy_kcal')),
            'energyKj': clean_num(row.get('energy_kj')),
            'proteinG': clean_num(row.get('protein_g')),
            'carbG': clean_num(row.get('carb_g')),
            'fatG': clean_num(row.get('fat_g')),
            'fibreG': clean_num(row.get('fibre_g')),
            'freeSugarG': clean_num(row.get('freesugar_g')),
            'sfaMg': clean_num(row.get('sfa_mg')),
            'mufaMg': clean_num(row.get('mufa_mg')),
            'pufaMg': clean_num(row.get('pufa_mg')),
            'cholesterolMg': clean_num(row.get('cholesterol_mg')),
            'calciumMg': clean_num(row.get('calcium_mg')),
            'phosphorusMg': clean_num(row.get('phosphorus_mg')),
            'magnesiumMg': clean_num(row.get('magnesium_mg')),
            'sodiumMg': clean_num(row.get('sodium_mg')),
            'potassiumMg': clean_num(row.get('potassium_mg')),
            'ironMg': clean_num(row.get('iron_mg')),
            'copperMg': clean_num(row.get('copper_mg')),
            'zincMg': clean_num(row.get('zinc_mg')),
            'seleniumUg': clean_num(row.get('selenium_ug')),
            'chromiumMg': clean_num(row.get('chromium_mg')),
            'manganeseMg': clean_num(row.get('manganese_mg')),
            'molybdenumMg': clean_num(row.get('molybdenum_mg')),
            'vitaUg': clean_num(row.get('vita_ug')),
            'viteMg': clean_num(row.get('vite_mg')),
            'vitd2Ug': clean_num(row.get('vitd2_ug')),
            'vitd3Ug': clean_num(row.get('vitd3_ug')),
            'vitk1Ug': clean_num(row.get('vitk1_ug')),
            'vitk2Ug': clean_num(row.get('vitk2_ug')),
            'folateUg': clean_num(row.get('folate_ug')),
            'vitb1Mg': clean_num(row.get('vitb1_mg')),
            'vitb2Mg': clean_num(row.get('vitb2_mg')),
            'vitb3Mg': clean_num(row.get('vitb3_mg')),
            'vitb5Mg': clean_num(row.get('vitb5_mg')),
            'vitb6Mg': clean_num(row.get('vitb6_mg')),
            'vitb7Ug': clean_num(row.get('vitb7_ug')),
            'vitb9Ug': clean_num(row.get('vitb9_ug')),
            'vitcMg': clean_num(row.get('vitc_mg')),
            'carotenoidsUg': clean_num(row.get('carotenoids_ug')),
        }
    }
    all_food_records.append(record)
    raw_count += 1

print(f"Processed {raw_count} raw foods from NIN IFCT")
print(f"Total compiled records: {len(all_food_records)}")

# Write to JSON
with open(output_db, 'w', encoding='utf-8') as f:
    json.dump(all_food_records, f, ensure_ascii=False, indent=2)

summary = {
    'totalRecords': len(all_food_records),
    'cookedDishes': 1014,
    'rawFoods': raw_count,
    'recipesWithOilData': sum(1 for r in all_food_records if r['oilBreakdown']['available']),
    'sources': {
        'asc_manual': 490,
        'bfp_manual': 376,
        'open_source_recipes': 148,
        'icmr_nin_ifct': raw_count
    }
}

with open(output_summary, 'w', encoding='utf-8') as f:
    json.dump(summary, f, indent=2)

print("SUCCESS: Exported data/indian_nutrition_db.json and summary.")
