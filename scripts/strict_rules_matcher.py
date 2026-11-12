import json
import os
import re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('data/products_full_staged.json', 'r', encoding='utf-8') as f:
    staged = json.load(f)

public_files = set(os.listdir('public/products'))

def clean(s):
    if not s: return ''
    s = s.lower()
    s = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+\*\#\!]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

# Build a dictionary of staged products by clean brand and clean name
staged_exact = {}
for s in staged:
    s_img = s.get('image', '').lstrip('/')
    fn = os.path.basename(s_img)
    if fn in public_files:
        key = (clean(s.get('brand', '')), clean(s.get('name', '')))
        staged_exact[key] = f"/products/{fn}"
        # also key without brand in name if name already contains brand
        staged_exact[('', clean(s.get('name', '')))] = f"/products/{fn}"

# Also index all public_files by exact stem
file_exact = {}
for fn in public_files:
    stem = os.path.splitext(fn)[0]
    file_exact[clean(stem)] = f"/products/{fn}"

print(f"Indexed {len(staged_exact)} staged keys and {len(file_exact)} file stems.")

# High precision rules for specific variants and subbrands
def match_product(p):
    brand = clean(p.get('brand', ''))
    name = clean(p.get('name', ''))
    
    # 1. Exact match on brand + name
    if (brand, name) in staged_exact:
        return staged_exact[(brand, name)], "staged_exact_both"
    if ('', name) in staged_exact:
        return staged_exact[('', name)], "staged_exact_name"
    if name in file_exact:
        return file_exact[name], "file_exact"
        
    # Check if name prefixed with brand is in file_exact
    brand_name = clean(f"{brand} {name}")
    if brand_name in file_exact:
        return file_exact[brand_name], "file_brand_name"

    # Specific subbrand rules
    # PARLE
    if 'parle' in brand:
        if 'hide' in name and 'seek' in name:
            if 'bourbon' in name or 'black' in name:
                if 'parle-hide-seek-black-bourbon.webp' in public_files:
                    return '/products/parle-hide-seek-black-bourbon.webp', "parle_hide_seek_bourbon"
            if 'parle-hide-seek-family-pack.webp' in public_files:
                return '/products/parle-hide-seek-family-pack.webp', "parle_hide_seek"
        elif 'monaco' in name:
            if 'parle-monaco.webp' in public_files:
                return '/products/parle-monaco.webp', "parle_monaco"
        elif 'krackjack' in name:
            if 'parle-krackjack.webp' in public_files:
                return '/products/parle-krackjack.webp', "parle_krackjack"
        elif '20 20' in name or '20-20' in name:
            if 'cashew' in name and 'parle-20-20-cashew-cookies.webp' in public_files:
                return '/products/parle-20-20-cashew-cookies.webp', "parle_2020_cashew"
            elif 'butter' in name and 'parle-20-20-butter-cookies.webp' in public_files:
                return '/products/parle-20-20-butter-cookies.webp', "parle_2020_butter"
            elif 'choco' in name and 'parle-20-20-choco-chip-cookies.webp' in public_files:
                return '/products/parle-20-20-choco-chip-cookies.webp', "parle_2020_choco"
            elif 'nice' in name and 'parle-20-20-nice.webp' in public_files:
                return '/products/parle-20-20-nice.webp', "parle_2020_nice"
        elif 'frooti' in name:
            if 'parle-frooti-mango-drink.webp' in public_files:
                return '/products/parle-frooti-mango-drink.webp', "parle_frooti"
        elif 'appy fizz' in name:
            if 'parle-appy-fizz.webp' in public_files:
                return '/products/parle-appy-fizz.webp', "parle_appy_fizz"

    # BRITANNIA
    if 'britannia' in brand or 'britannia' in name:
        if 'bourbon' in name:
            if 'britannia-bourbon.webp' in public_files:
                return '/products/britannia-bourbon.webp', "britannia_bourbon"
        elif 'good day' in name:
            if 'cashew' in name and 'britannia-good-day-cashew-cookies.webp' in public_files:
                return '/products/britannia-good-day-cashew-cookies.webp', "good_day_cashew"
            elif 'pista' in name and 'britannia-good-day-pista-badam-cookies.webp' in public_files:
                return '/products/britannia-good-day-pista-badam-cookies.webp', "good_day_pista"
            elif 'butter' in name and 'britannia-good-day-butter-cookies.webp' in public_files:
                return '/products/britannia-good-day-butter-cookies.webp', "good_day_butter"
            elif 'chocochip' in name or 'chunkies' in name:
                if 'britannia-good-day-chunkies-chocolate.webp' in public_files:
                    return '/products/britannia-good-day-chunkies-chocolate.webp', "good_day_chunkies"
        elif 'nutrichoice' in name:
            if 'digestive' in name:
                if 'oats' in name and 'britannia-nutrichoice-digestive-oats.webp' in public_files:
                    return '/products/britannia-nutrichoice-digestive-oats.webp', "nutrichoice_digestive_oats"
                if '5 grain' in name and 'britannia-nutrichoice-5-grain-digestive.webp' in public_files:
                    return '/products/britannia-nutrichoice-5-grain-digestive.webp', "nutrichoice_5grain"
                if 'zero' in name and 'britannia-nutrichoice-digestive-zero.webp' in public_files:
                    return '/products/britannia-nutrichoice-digestive-zero.webp', "nutrichoice_zero"
                if 'britannia-nutrichoice-hi-fibre-digestive.webp' in public_files:
                    return '/products/britannia-nutrichoice-hi-fibre-digestive.webp', "nutrichoice_digestive"
            elif 'oats' in name and 'britannia-nutrichoice-oats-cookies.webp' in public_files:
                return '/products/britannia-nutrichoice-oats-cookies.webp', "nutrichoice_oats"
        elif 'little hearts' in name and 'britannia-little-hearts-classic.webp' in public_files:
            return '/products/britannia-little-hearts-classic.webp', "little_hearts"
        elif 'milk bikis' in name and 'britannia-milk-bikis.webp' in public_files:
            return '/products/britannia-milk-bikis.webp', "milk_bikis"
        elif 'marie gold' in name or 'marie' in name:
            if 'britannia-marie-gold.webp' in public_files:
                return '/products/britannia-marie-gold.webp', "marie_gold"
        elif 'nice' in name and 'britannia-nice-time.webp' in public_files:
            return '/products/britannia-nice-time.webp', "nice_time"
        elif '50 50' in name or '50-50' in name:
            if 'maska chaska' in name and 'britannia-50-50-maska-chaska.webp' in public_files:
                return '/products/britannia-50-50-maska-chaska.webp', "5050_maska"
            elif 'potazos' in name and 'britannia-50-50-potazos.webp' in public_files:
                return '/products/britannia-50-50-potazos.webp', "5050_potazos"
            elif 'sweet' in name and 'salty' in name and 'britannia-50-50-sweet-salty.webp' in public_files:
                return '/products/britannia-50-50-sweet-salty.webp', "5050_sweet_salty"

    # SUNFEAST / ITC
    if 'sunfeast' in brand or 'itc' in brand or 'sunfeast' in name:
        if 'dark fantasy' in name:
            if 'choco fills' in name and 'itc-sunfeast-dark-fantasy-choco-fills.webp' in public_files:
                return '/products/itc-sunfeast-dark-fantasy-choco-fills.webp', "dark_fantasy_choco_fills"
            elif 'bourbon' in name and 'itc-sunfeast-dark-fantasy-bourbon.webp' in public_files:
                return '/products/itc-sunfeast-dark-fantasy-bourbon.webp', "dark_fantasy_bourbon"
            elif 'choco meltz' in name and 'itc-sunfeast-dark-fantasy-choco-meltz.webp' in public_files:
                return '/products/itc-sunfeast-dark-fantasy-choco-meltz.webp', "dark_fantasy_choco_meltz"
        elif 'farmlite' in name:
            if 'oats' in name and 'almonds' in name and 'itc-sunfeast-farmlite-oats-almonds.webp' in public_files:
                return '/products/itc-sunfeast-farmlite-oats-almonds.webp', "farmlite_oats_almonds"
            elif 'itc-sunfeast-farmlite-digestive-all-good.webp' in public_files:
                return '/products/itc-sunfeast-farmlite-digestive-all-good.webp', "farmlite_digestive"
        elif 'moms magic' in name or "mom's magic" in name:
            if 'cashew' in name and 'itc-sunfeast-moms-magic-rich-cashew.webp' in public_files:
                return '/products/itc-sunfeast-moms-magic-rich-cashew.webp', "moms_magic_cashew"
            elif 'itc-sunfeast-moms-magic-butter-cookies.webp' in public_files:
                return '/products/itc-sunfeast-moms-magic-butter-cookies.webp', "moms_magic_butter"
        elif 'bounce' in name and 'itc-sunfeast-bounce.webp' in public_files:
            return '/products/itc-sunfeast-bounce.webp', "sunfeast_bounce"
        elif 'yippee' in name:
            if 'magic masala' in name and 'itc-yippee-magic-masala-noodles.webp' in public_files:
                return '/products/itc-yippee-magic-masala-noodles.webp', "yippee_magic_masala"
            elif 'itc-yippee-classic-masala-noodles.webp' in public_files:
                return '/products/itc-yippee-classic-masala-noodles.webp', "yippee_classic"

    # UNIBIC
    if 'unibic' in brand or 'unibic' in name:
        if 'coconut' in name and 'unibic-coconut-cookies.webp' in public_files:
            return '/products/unibic-coconut-cookies.webp', "unibic_coconut"
        elif 'choco chip' in name and 'unibic-choco-chip-cookies.webp' in public_files:
            return '/products/unibic-choco-chip-cookies.webp', "unibic_choco_chip"
        elif 'butter' in name and 'unibic-butter-cookies.webp' in public_files:
            return '/products/unibic-butter-cookies.webp', "unibic_butter"
        elif 'cashew' in name and 'unibic-cashew-cookies.webp' in public_files:
            return '/products/unibic-cashew-cookies.webp', "unibic_cashew"
        elif 'almond' in name and 'unibic-almond-cookies.webp' in public_files:
            return '/products/unibic-almond-cookies.webp', "unibic_almond"
        elif 'pista' in name and 'unibic-pista-cookies.webp' in public_files:
            return '/products/unibic-pista-cookies.webp', "unibic_pista"
        elif 'multigrain' in name and 'unibic-multigrain-cookies.webp' in public_files:
            return '/products/unibic-multigrain-cookies.webp', "unibic_multigrain"
        elif 'digestive' in name and 'unibic-digestive-cookies.webp' in public_files:
            return '/products/unibic-digestive-cookies.webp', "unibic_digestive"
        elif 'fruit' in name and 'nut' in name and 'unibic-fruit-and-nut-cookies.webp' in public_files:
            return '/products/unibic-fruit-and-nut-cookies.webp', "unibic_fruit_nut"
        elif 'oatmeal' in name and 'unibic-oatmeal-cookies.webp' in public_files:
            return '/products/unibic-oatmeal-cookies.webp', "unibic_oatmeal"

    # CADBURY / OREO
    if 'cadbury' in brand or 'mondelez' in brand or 'oreo' in brand or 'cadbury' in name:
        if 'oreo' in name:
            if 'chocolate' in name and 'oreo-chocolate-cream.webp' in public_files:
                return '/products/oreo-chocolate-cream.webp', "oreo_chocolate"
            elif 'vanilla' in name and 'oreo-vanilla-cream.webp' in public_files:
                return '/products/oreo-vanilla-cream.webp', "oreo_vanilla"
            elif 'strawberry' in name and 'oreo-strawberry-cream.webp' in public_files:
                return '/products/oreo-strawberry-cream.webp', "oreo_strawberry"
            elif 'oreo-original.webp' in public_files:
                return '/products/oreo-original.webp', "oreo_original"
        elif 'silk' in name:
            if 'cadbury-dairy-milk-silk.webp' in public_files:
                return '/products/cadbury-dairy-milk-silk.webp', "cadbury_silk"
        elif 'bournvita' in name:
            if 'cadbury-bournvita-health-drink.webp' in public_files:
                return '/products/cadbury-bournvita-health-drink.webp', "bournvita"
        elif '5 star' in name:
            if 'cadbury-5-star-chocolate-bar.webp' in public_files:
                return '/products/cadbury-5-star-chocolate-bar.webp', "5_star"
        elif 'perk' in name:
            if 'cadbury-perk-chocolate-bar.webp' in public_files:
                return '/products/cadbury-perk-chocolate-bar.webp', "cadbury_perk"
        elif 'gems' in name:
            if 'cadbury-gems.webp' in public_files:
                return '/products/cadbury-gems.webp', "cadbury_gems"
        elif 'dairy milk' in name:
            if 'cadbury-dairy-milk-chocolate-bar.webp' in public_files:
                return '/products/cadbury-dairy-milk-chocolate-bar.webp', "dairy_milk"

    # NESTLE / MAGGI
    if 'nestle' in brand or 'maggi' in brand or 'maggi' in name:
        if 'maggi' in name:
            if 'atta' in name and 'maggi-nutri-licious-atta-noodles.webp' in public_files:
                return '/products/maggi-nutri-licious-atta-noodles.webp', "maggi_atta"
            elif 'sauce' in name or 'chilli' in name:
                if 'maggi-hot-sweet-tomato-chilli-sauce.webp' in public_files:
                    return '/products/maggi-hot-sweet-tomato-chilli-sauce.webp', "maggi_sauce"
            elif 'cuppa' in name and 'maggi-cuppa-masala-noodles.webp' in public_files:
                return '/products/maggi-cuppa-masala-noodles.webp', "maggi_cuppa"
            elif 'maggi-2-minute-masala-noodles.webp' in public_files:
                return '/products/maggi-2-minute-masala-noodles.webp', "maggi_2min"
        elif 'kitkat' in name and 'nestle-kitkat-chocolate-wafer-bar.webp' in public_files:
            return '/products/nestle-kitkat-chocolate-wafer-bar.webp', "kitkat"
        elif 'munch' in name and 'nestle-munch-chocolate-wafer-bar.webp' in public_files:
            return '/products/nestle-munch-chocolate-wafer-bar.webp', "munch"
        elif 'milkybar' in name and 'nestle-milkybar-white-chocolate-bar.webp' in public_files:
            return '/products/nestle-milkybar-white-chocolate-bar.webp', "milkybar"
        elif 'nescafe' in name and 'nestle-nescafe-classic-instant-coffee.webp' in public_files:
            return '/products/nestle-nescafe-classic-instant-coffee.webp', "nescafe"

    # AMUL
    if 'amul' in brand:
        if 'butter' in name:
            if 'garlic' in name and 'amul-garlic-butter.webp' in public_files:
                return '/products/amul-garlic-butter.webp', "amul_garlic_butter"
            elif 'amul-butter.webp' in public_files:
                return '/products/amul-butter.webp', "amul_butter"
        elif 'taaza' in name and 'amul-taaza-milk.webp' in public_files:
            return '/products/amul-taaza-milk.webp', "amul_taaza"
        elif 'gold' in name and 'milk' in name and 'amul-gold-milk.webp' in public_files:
            return '/products/amul-gold-milk.webp', "amul_gold_milk"
        elif 'cow milk' in name and 'amul-cow-milk.webp' in public_files:
            return '/products/amul-cow-milk.webp', "amul_cow_milk"
        elif 'dark chocolate' in name:
            if '55' in name and 'amul-55-dark-chocolate.webp' in public_files:
                return '/products/amul-55-dark-chocolate.webp', "amul_55_dark"
            elif '75' in name and 'amul-75-dark-chocolate.webp' in public_files:
                return '/products/amul-75-dark-chocolate.webp', "amul_75_dark"
            elif '90' in name and 'amul-90-dark-chocolate.webp' in public_files:
                return '/products/amul-90-dark-chocolate.webp', "amul_90_dark"

    # BALAJI
    if 'balaji' in brand:
        if 'wafers' in name or 'chips' in name:
            if 'masala' in name and 'balaji-masala-wafers.webp' in public_files:
                return '/products/balaji-masala-wafers.webp', "balaji_masala"
            elif 'cream' in name and 'onion' in name and 'balaji-cream-and-onion-wafers.webp' in public_files:
                return '/products/balaji-cream-and-onion-wafers.webp', "balaji_cream_onion"
            elif 'chaat' in name and 'balaji-chaat-chaska-wafers.webp' in public_files:
                return '/products/balaji-chaat-chaska-wafers.webp', "balaji_chaat"
        elif 'bhujia' in name and 'balaji-bhujia-sev.webp' in public_files:
            return '/products/balaji-bhujia-sev.webp', "balaji_bhujia"
        elif 'aloo sev' in name and 'balaji-aloo-sev.webp' in public_files:
            return '/products/balaji-aloo-sev.webp', "balaji_aloo_sev"

    # BIKAJI
    if 'bikaji' in brand:
        if 'aloo bhujia' in name and 'bikaji-aloo-bhujia.webp' in public_files:
            return '/products/bikaji-aloo-bhujia.webp', "bikaji_aloo_bhujia"
        elif 'bhujia' in name and 'bikaji-bhujia.webp' in public_files:
            return '/products/bikaji-bhujia.webp', "bikaji_bhujia"

    # HALDIRAMS
    if 'haldiram' in brand:
        if 'aloo bhujia' in name and 'haldirams-aloo-bhujia.webp' in public_files:
            return '/products/haldirams-aloo-bhujia.webp', "haldirams_aloo_bhujia"
        elif 'bhujia' in name and 'haldirams-bhujia-sev.webp' in public_files:
            return '/products/haldirams-bhujia-sev.webp', "haldirams_bhujia"
        elif 'kaju katli' in name and 'haldirams-kaju-katli.webp' in public_files:
            return '/products/haldirams-kaju-katli.webp', "haldirams_kaju_katli"
        elif 'gulab jamun' in name and 'haldirams-gulab-jamun.webp' in public_files:
            return '/products/haldirams-gulab-jamun.webp', "haldirams_gulab_jamun"
        elif 'rasgulla' in name and 'haldirams-rasgulla.webp' in public_files:
            return '/products/haldirams-rasgulla.webp', "haldirams_rasgulla"

    # TOO YUMM
    if 'too yumm' in brand:
        if 'karare' in name:
            if 'munchy masala' in name or 'masala' in name:
                if 'too-yumm-karare-masala.webp' in public_files:
                    return '/products/too-yumm-karare-masala.webp', "too_yumm_karare_masala"
            elif 'chilli' in name and 'too-yumm-karare-chilli-achari.webp' in public_files:
                return '/products/too-yumm-karare-chilli-achari.webp', "too_yumm_karare_chilli"
        elif 'veggie stix' in name:
            if 'sour cream' in name or 'masala' in name:
                if 'too-yumm-veggie-stix-masala.webp' in public_files:
                    return '/products/too-yumm-veggie-stix-masala.webp', "too_yumm_veggie_masala"
        elif 'foxnuts' in name or 'makhana' in name:
            if 'peri peri' in name and 'too-yumm-foxnuts-peri-peri.webp' in public_files:
                return '/products/too-yumm-foxnuts-peri-peri.webp', "too_yumm_makhana_peri"

    # HERSHEY'S
    if 'hershey' in brand:
        if 'syrup' in name:
            if 'chocolate' in name and 'hersheys-chocolate-syrup.webp' in public_files:
                return '/products/hersheys-chocolate-syrup.webp', "hersheys_syrup_choco"
            elif 'caramel' in name and 'hersheys-caramel-syrup.webp' in public_files:
                return '/products/hersheys-caramel-syrup.webp', "hersheys_syrup_caramel"
            elif 'strawberry' in name and 'hersheys-strawberry-syrup.webp' in public_files:
                return '/products/hersheys-strawberry-syrup.webp', "hersheys_syrup_strawberry"
        elif 'kisses' in name:
            if 'milk chocolate' in name and 'hersheys-kisses-milk-chocolate.webp' in public_files:
                return '/products/hersheys-kisses-milk-chocolate.webp', "hersheys_kisses"
            elif 'almonds' in name and 'hersheys-kisses-almonds.webp' in public_files:
                return '/products/hersheys-kisses-almonds.webp', "hersheys_kisses_almonds"

    # MTR
    if 'mtr' in brand:
        if 'gulab jamun' in name and 'mtr-gulab-jamun-mix.webp' in public_files:
            return '/products/mtr-gulab-jamun-mix.webp', "mtr_gulab_jamun"
        elif 'rava idli' in name and 'mtr-rava-idli-mix.webp' in public_files:
            return '/products/mtr-rava-idli-mix.webp', "mtr_rava_idli"
        elif 'dosa' in name and 'mtr-dosa-mix.webp' in public_files:
            return '/products/mtr-dosa-mix.webp', "mtr_dosa"
        elif 'sambar' in name and 'mtr-sambar-powder.webp' in public_files:
            return '/products/mtr-sambar-powder.webp', "mtr_sambar"
        elif 'rasam' in name and 'mtr-rasam-powder.webp' in public_files:
            return '/products/mtr-rasam-powder.webp', "mtr_rasam"

    return None, None

matched_count = 0
results = []
for p in products:
    img, rule = match_product(p)
    if img:
        matched_count += 1
        results.append((p['id'], p['name'], p['brand'], img, rule))

print(f"Strict high-accuracy matches: {matched_count} / {len(products)}")
print("\nSample 25 strict matches:")
for r in results[:25]:
    print(f"  [{r[0]}] {r[1]} ({r[2]}) -> {r[3]} [{r[4]}]")
