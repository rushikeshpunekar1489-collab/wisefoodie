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

# Build comprehensive map from staged
staged_exact = {}
for s in staged:
    s_img = s.get('image', '').lstrip('/')
    fn = os.path.basename(s_img)
    if fn in public_files:
        b = clean(s.get('brand', ''))
        n = clean(s.get('name', ''))
        staged_exact[(b, n)] = f"/products/{fn}"
        staged_exact[('', n)] = f"/products/{fn}"

file_exact = {}
for fn in public_files:
    stem = os.path.splitext(fn)[0]
    file_exact[clean(stem)] = f"/products/{fn}"

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
        
    brand_name = clean(f"{brand} {name}")
    if brand_name in file_exact:
        return file_exact[brand_name], "file_brand_name"

    # Category and Brand-Specific Precision Matching
    
    # --- NOODLES / PASTA / READY TO EAT ---
    if 'maggi' in brand or 'maggi' in name:
        if '2 minute' in name or '2 min' in name or 'masala noodles' in name:
            if 'atta' in name and 'maggi-nutri-licious-atta-noodles.webp' in public_files:
                return '/products/maggi-nutri-licious-atta-noodles.webp', "maggi_atta"
            elif 'cuppa' in name and 'maggi-cuppa-masala-noodles.webp' in public_files:
                return '/products/maggi-cuppa-masala-noodles.webp', "maggi_cuppa"
            elif 'maggi-2-minute-masala-noodles.webp' in public_files:
                return '/products/maggi-2-minute-masala-noodles.webp', "maggi_2min"
        elif 'sauce' in name or 'ketchup' in name or 'chilli' in name:
            if 'maggi-hot-sweet-tomato-chilli-sauce.webp' in public_files:
                return '/products/maggi-hot-sweet-tomato-chilli-sauce.webp', "maggi_sauce"
                
    if 'yippee' in name or ('sunfeast' in brand and 'noodle' in name):
        if 'magic masala' in name and 'itc-yippee-magic-masala-noodles.webp' in public_files:
            return '/products/itc-yippee-magic-masala-noodles.webp', "yippee_magic_masala"
        elif 'power up' in name and 'itc-yippee-power-up-noodles.webp' in public_files:
            return '/products/itc-yippee-power-up-noodles.webp', "yippee_power_up"
        elif 'itc-yippee-classic-masala-noodles.webp' in public_files:
            return '/products/itc-yippee-classic-masala-noodles.webp', "yippee_classic"

    if 'ching' in brand or 'ching' in name:
        if 'schezwan' in name and 'chings-secret-schezwan-instant-noodles.webp' in public_files:
            return '/products/chings-secret-schezwan-instant-noodles.webp', "chings_schezwan_noodles"
        elif 'hot garlic' in name and 'chings-secret-instant-noodles-hot-garlic.webp' in public_files:
            return '/products/chings-secret-instant-noodles-hot-garlic.webp', "chings_hot_garlic"
        elif 'manchurian' in name and 'chings-secret-instant-noodles-manchurian.webp' in public_files:
            return '/products/chings-secret-instant-noodles-manchurian.webp', "chings_manchurian"
        elif 'hakka' in name and 'chings-secret-egg-hakka-noodles.webp' in public_files:
            return '/products/chings-secret-egg-hakka-noodles.webp', "chings_hakka"
        elif 'chowmein' in name and 'chings-secret-chowmein-noodles.webp' in public_files:
            return '/products/chings-secret-chowmein-noodles.webp', "chings_chowmein"

    # --- BEVERAGES ---
    if 'coca' in brand or 'coke' in brand or 'coca' in name:
        if 'diet' in name and 'coca-cola-diet-coke-can.webp' in public_files:
            return '/products/coca-cola-diet-coke-can.webp', "diet_coke"
        elif 'zero' in name and 'coca-cola-zero-sugar-can.webp' in public_files:
            return '/products/coca-cola-zero-sugar-can.webp', "coke_zero"
        elif 'coca-cola-can.webp' in public_files:
            return '/products/coca-cola-can.webp', "coca_cola"
            
    if 'thums up' in brand or 'thums up' in name:
        if 'charged' in name and 'thums-up-charged.webp' in public_files:
            return '/products/thums-up-charged.webp', "thums_up_charged"
        elif 'thums-up.webp' in public_files:
            return '/products/thums-up.webp', "thums_up"

    if 'sprite' in brand or 'sprite' in name:
        if 'lemon lime' in name and 'sprite-lemon-lime.webp' in public_files:
            return '/products/sprite-lemon-lime.webp', "sprite_lemon"
        elif 'sprite.webp' in public_files:
            return '/products/sprite.webp', "sprite"

    if 'fanta' in brand or 'fanta' in name:
        if 'orange' in name and 'fanta-orange.webp' in public_files:
            return '/products/fanta-orange.webp', "fanta_orange"
        elif 'fanta.webp' in public_files:
            return '/products/fanta.webp', "fanta"

    if 'frooti' in brand or 'frooti' in name:
        if 'parle-frooti-mango-drink.webp' in public_files:
            return '/products/parle-frooti-mango-drink.webp', "frooti"

    if 'appy' in brand or 'appy' in name:
        if 'fizz' in name and 'parle-appy-fizz.webp' in public_files:
            return '/products/parle-appy-fizz.webp', "appy_fizz"
        elif 'parle-appy.webp' in public_files:
            return '/products/parle-appy.webp', "appy"

    if 'sting' in name and 'sting-energy-drink.webp' in public_files:
        return '/products/sting-energy-drink.webp', "sting"

    if 'maaza' in name and 'maaza-mango-drink.webp' in public_files:
        return '/products/maaza-mango-drink.webp', "maaza"

    if 'slice' in name and 'slice.webp' in public_files:
        return '/products/slice.webp', "slice"

    if 'limca' in name and 'limca.webp' in public_files:
        return '/products/limca.webp', "limca"

    if 'mountain dew' in name and 'mountain-dew.webp' in public_files:
        return '/products/mountain-dew.webp', "mountain_dew"

    if '7up' in name and '7up.webp' in public_files:
        return '/products/7up.webp', "7up"

    if 'mirinda' in name and 'mirinda-orange.webp' in public_files:
        return '/products/mirinda-orange.webp', "mirinda"

    if 'tang' in name:
        if 'mango' in name and 'tang-mango-drink-mix.webp' in public_files:
            return '/products/tang-mango-drink-mix.webp', "tang_mango"
        elif 'orange' in name and 'tang-orange-drink-mix.webp' in public_files:
            return '/products/tang-orange-drink-mix.webp', "tang_orange"

    if 'smoodh' in name or ('parle agro' in brand and 'milkshake' in name):
        if 'chocolate' in name and 'smoodh-chocolate-milkshake.webp' in public_files:
            return '/products/smoodh-chocolate-milkshake.webp', "smoodh_choco"
        elif 'mango' in name and 'smoodh-mango-milkshake.webp' in public_files:
            return '/products/smoodh-mango-milkshake.webp', "smoodh_mango"
        elif 'kesar' in name and 'smoodh-kesar-badam-milkshake.webp' in public_files:
            return '/products/smoodh-kesar-badam-milkshake.webp', "smoodh_kesar"
        elif 'vanilla' in name and 'smoodh-vanilla-milkshake.webp' in public_files:
            return '/products/smoodh-vanilla-milkshake.webp', "smoodh_vanilla"
        elif 'strawberry' in name and 'smoodh-strawberry-milkshake.webp' in public_files:
            return '/products/smoodh-strawberry-milkshake.webp', "smoodh_strawberry"

    if 'raw pressery' in brand:
        if 'coconut' in name and 'raw-pressery-cold-pressed-coconut-water.webp' in public_files:
            return '/products/raw-pressery-cold-pressed-coconut-water.webp', "raw_coconut"
        elif 'valencia orange' in name and 'raw-pressery-cold-pressed-valencia-orange-juice.webp' in public_files:
            return '/products/raw-pressery-cold-pressed-valencia-orange-juice.webp', "raw_orange"
        elif 'mango' in name and 'raw-pressery-cold-pressed-mango-juice.webp' in public_files:
            return '/products/raw-pressery-cold-pressed-mango-juice.webp', "raw_mango"
        elif 'pomegranate' in name and 'raw-pressery-cold-pressed-pomegranate-juice.webp' in public_files:
            return '/products/raw-pressery-cold-pressed-pomegranate-juice.webp', "raw_pomegranate"
        elif 'mixed fruit' in name and 'raw-pressery-cold-pressed-mixed-fruit-juice.webp' in public_files:
            return '/products/raw-pressery-cold-pressed-mixed-fruit-juice.webp', "raw_mixed_fruit"
        elif 'apple' in name and 'raw-pressery-cold-pressed-apple-juice.webp' in public_files:
            return '/products/raw-pressery-cold-pressed-apple-juice.webp', "raw_apple"
        elif 'lemonade' in name and 'raw-pressery-lemonade.webp' in public_files:
            return '/products/raw-pressery-lemonade.webp', "raw_lemonade"

    # --- SNACKS & NAMKEEN ---
    if 'lay' in brand or 'lay\'s' in brand:
        if 'magic masala' in name or 'india\'s magic masala' in name:
            if 'lays-indias-magic-masala.webp' in public_files:
                return '/products/lays-indias-magic-masala.webp', "lays_magic_masala"
        elif 'classic salted' in name and 'lays-classic-salted.webp' in public_files:
            return '/products/lays-classic-salted.webp', "lays_salted"
        elif 'cream' in name and 'onion' in name and 'lays-american-style-cream-and-onion.webp' in public_files:
            return '/products/lays-american-style-cream-and-onion.webp', "lays_cream_onion"
        elif 'spanish tomato' in name and 'lays-spanish-tomato-tango.webp' in public_files:
            return '/products/lays-spanish-tomato-tango.webp', "lays_tomato"
        elif 'chile limon' in name and 'lays-wafer-style-sundried-chilli.webp' in public_files:
            return '/products/lays-wafer-style-sundried-chilli.webp', "lays_chilli"

    if 'kurkure' in brand or 'kurkure' in name:
        if 'masala munch' in name and 'kurkure-masala-munch.webp' in public_files:
            return '/products/kurkure-masala-munch.webp', "kurkure_masala_munch"
        elif 'green chutney' in name and 'kurkure-green-chutney.webp' in public_files:
            return '/products/kurkure-green-chutney.webp', "kurkure_green_chutney"
        elif 'solid masti' in name and 'kurkure-solid-masti.webp' in public_files:
            return '/products/kurkure-solid-masti.webp', "kurkure_solid_masti"
        elif 'chilli chatka' in name and 'kurkure-chilli-chatka.webp' in public_files:
            return '/products/kurkure-chilli-chatka.webp', "kurkure_chilli"

    if 'bingo' in brand or 'bingo' in name:
        if 'mad angles' in name:
            if 'achari masti' in name and 'itc-bingo-mad-angles-achari-masti.webp' in public_files:
                return '/products/itc-bingo-mad-angles-achari-masti.webp', "bingo_achari"
            elif 'chaat' in name and 'itc-bingo-mad-angles-chaat-masti.webp' in public_files:
                return '/products/itc-bingo-mad-angles-chaat-masti.webp', "bingo_chaat"
            elif 'cheese' in name and 'itc-bingo-mad-angles-cheese-nachos.webp' in public_files:
                return '/products/itc-bingo-mad-angles-cheese-nachos.webp', "bingo_cheese"
            elif 'itc-bingo-mad-angles-tomato-madness.webp' in public_files:
                return '/products/itc-bingo-mad-angles-tomato-madness.webp', "bingo_mad_angles"
        elif 'tedhe medhe' in name and 'itc-bingo-tedhe-medhe.webp' in public_files:
            return '/products/itc-bingo-tedhe-medhe.webp', "bingo_tedhe_medhe"

    if 'balaji' in brand:
        if 'masala' in name and ('wafer' in name or 'chips' in name) and 'balaji-masala-wafers.webp' in public_files:
            return '/products/balaji-masala-wafers.webp', "balaji_masala_wafers"
        elif 'cream' in name and 'onion' in name and 'balaji-cream-and-onion-wafers.webp' in public_files:
            return '/products/balaji-cream-and-onion-wafers.webp', "balaji_cream_onion"
        elif 'chaat' in name and 'balaji-chaat-chaska-wafers.webp' in public_files:
            return '/products/balaji-chaat-chaska-wafers.webp', "balaji_chaat"
        elif 'simply salted' in name and 'balaji-simply-salted-wafers.webp' in public_files:
            return '/products/balaji-simply-salted-wafers.webp', "balaji_salted"
        elif 'bhujia' in name and 'balaji-bhujia-sev.webp' in public_files:
            return '/products/balaji-bhujia-sev.webp', "balaji_bhujia"
        elif 'aloo sev' in name and 'balaji-aloo-sev.webp' in public_files:
            return '/products/balaji-aloo-sev.webp', "balaji_aloo_sev"
        elif 'ratlami' in name and 'balaji-ratlami-sev.webp' in public_files:
            return '/products/balaji-ratlami-sev.webp', "balaji_ratlami"
        elif 'gathiya' in name and 'balaji-gathiya.webp' in public_files:
            return '/products/balaji-gathiya.webp', "balaji_gathiya"
        elif 'chana dal' in name and 'balaji-chana-dal.webp' in public_files:
            return '/products/balaji-chana-dal.webp', "balaji_chana_dal"
        elif 'moong dal' in name and 'balaji-moong-dal.webp' in public_files:
            return '/products/balaji-moong-dal.webp', "balaji_moong_dal"

    if 'bikaji' in brand:
        if 'aloo bhujia' in name and 'bikaji-aloo-bhujia.webp' in public_files:
            return '/products/bikaji-aloo-bhujia.webp', "bikaji_aloo_bhujia"
        elif 'bikaneri bhujia' in name and 'bikaji-bikaneri-bhujia.webp' in public_files:
            return '/products/bikaji-bikaneri-bhujia.webp', "bikaji_bikaneri_bhujia"
        elif 'bhujia' in name and 'bikaji-bhujia.webp' in public_files:
            return '/products/bikaji-bhujia.webp', "bikaji_bhujia"

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
        elif 'soan papdi' in name and 'haldirams-soan-papdi.webp' in public_files:
            return '/products/haldirams-soan-papdi.webp', "haldirams_soan_papdi"
        elif 'moong dal' in name and 'haldirams-moong-dal.webp' in public_files:
            return '/products/haldirams-moong-dal.webp', "haldirams_moong_dal"
        elif 'khatta meetha' in name and 'haldirams-khatta-meetha.webp' in public_files:
            return '/products/haldirams-khatta-meetha.webp', "haldirams_khatta_meetha"
        elif 'navratan' in name and 'haldirams-navratan-mix.webp' in public_files:
            return '/products/haldirams-navratan-mix.webp', "haldirams_navratan"

    if 'too yumm' in brand:
        if 'karare' in name:
            if 'masala' in name and 'too-yumm-karare-masala.webp' in public_files:
                return '/products/too-yumm-karare-masala.webp', "too_yumm_karare_masala"
            elif 'chilli' in name and 'too-yumm-karare-chilli-achari.webp' in public_files:
                return '/products/too-yumm-karare-chilli-achari.webp', "too_yumm_karare_chilli"
            elif 'too-yumm-karare.webp' in public_files:
                return '/products/too-yumm-karare.webp', "too_yumm_karare"
        elif 'veggie stix' in name:
            if 'sour cream' in name and 'too-yumm-veggie-stix.webp' in public_files:
                return '/products/too-yumm-veggie-stix.webp', "too_yumm_veggie"
            elif 'too-yumm-veggie-stix-masala.webp' in public_files:
                return '/products/too-yumm-veggie-stix-masala.webp', "too_yumm_veggie_masala"
        elif 'foxnuts' in name or 'makhana' in name:
            if 'peri peri' in name and 'too-yumm-foxnuts-peri-peri.webp' in public_files:
                return '/products/too-yumm-foxnuts-peri-peri.webp', "too_yumm_foxnuts_peri"
            elif 'pudina' in name and 'too-yumm-foxnuts-pudina.webp' in public_files:
                return '/products/too-yumm-foxnuts-pudina.webp', "too_yumm_foxnuts_pudina"
            elif 'cheese' in name and 'too-yumm-foxnuts-cheese.webp' in public_files:
                return '/products/too-yumm-foxnuts-cheese.webp', "too_yumm_foxnuts_cheese"

    # --- CHOCOLATES & CONFECTIONERY ---
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
            if 'oreo' in name and 'cadbury-dairy-milk-silk-oreo.webp' in public_files:
                return '/products/cadbury-dairy-milk-silk-oreo.webp', "silk_oreo"
            elif 'fruit' in name and 'nut' in name and 'cadbury-dairy-milk-silk-fruit-and-nut.webp' in public_files:
                return '/products/cadbury-dairy-milk-silk-fruit-and-nut.webp', "silk_fruit_nut"
            elif 'roast almond' in name and 'cadbury-dairy-milk-silk-roast-almond.webp' in public_files:
                return '/products/cadbury-dairy-milk-silk-roast-almond.webp', "silk_almond"
            elif 'bubbly' in name and 'cadbury-dairy-milk-silk-bubbly.webp' in public_files:
                return '/products/cadbury-dairy-milk-silk-bubbly.webp', "silk_bubbly"
            elif 'cadbury-dairy-milk-silk.webp' in public_files:
                return '/products/cadbury-dairy-milk-silk.webp', "cadbury_silk"
        elif 'chocobakes' in name:
            if 'layered cakes' in name and 'cadbury-chocobakes-choc-layered-cakes.webp' in public_files:
                return '/products/cadbury-chocobakes-choc-layered-cakes.webp', "chocobakes_cakes"
            elif 'cadbury-chocobakes.webp' in public_files:
                return '/products/cadbury-chocobakes.webp', "chocobakes"
        elif 'bournvita' in name:
            if 'cadbury-bournvita-health-drink.webp' in public_files:
                return '/products/cadbury-bournvita-health-drink.webp', "bournvita"
        elif '5 star' in name and 'cadbury-5-star-chocolate-bar.webp' in public_files:
            return '/products/cadbury-5-star-chocolate-bar.webp', "5_star"
        elif 'perk' in name and 'cadbury-perk-chocolate-bar.webp' in public_files:
            return '/products/cadbury-perk-chocolate-bar.webp', "cadbury_perk"
        elif 'gems' in name and 'cadbury-gems.webp' in public_files:
            return '/products/cadbury-gems.webp', "cadbury_gems"
        elif 'dairy milk' in name and 'cadbury-dairy-milk-chocolate-bar.webp' in public_files:
            return '/products/cadbury-dairy-milk-chocolate-bar.webp', "dairy_milk"

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
                return '/products/hersheys-kisses-milk-chocolate.webp', "hersheys_kisses_milk"
            elif 'almonds' in name and 'hersheys-kisses-almonds.webp' in public_files:
                return '/products/hersheys-kisses-almonds.webp', "hersheys_kisses_almonds"
            elif 'cookies' in name and 'cream' in name and 'hersheys-kisses-cookies-n-creme.webp' in public_files:
                return '/products/hersheys-kisses-cookies-n-creme.webp', "hersheys_kisses_cookies"

    if 'kitkat' in name and 'nestle-kitkat-chocolate-wafer-bar.webp' in public_files:
        return '/products/nestle-kitkat-chocolate-wafer-bar.webp', "kitkat"
    if 'munch' in name and 'nestle-munch-chocolate-wafer-bar.webp' in public_files:
        return '/products/nestle-munch-chocolate-wafer-bar.webp', "munch"
    if 'milkybar' in name and 'nestle-milkybar-white-chocolate-bar.webp' in public_files:
        return '/products/nestle-milkybar-white-chocolate-bar.webp', "milkybar"

    # --- DAIRY ---
    if 'amul' in brand:
        if 'butter' in name:
            if 'garlic' in name and 'amul-garlic-butter.webp' in public_files:
                return '/products/amul-garlic-butter.webp', "amul_garlic_butter"
            elif 'amul-butter.webp' in public_files:
                return '/products/amul-butter.webp', "amul_butter"
        elif 'taaza' in name and 'amul-taaza-milk.webp' in public_files:
            return '/products/amul-taaza-milk.webp', "amul_taaza"
        elif 'gold' in name and 'milk' in name and 'amul-gold-milk.webp' in public_files:
            return '/products/amul-gold-milk.webp', "amul_gold"
        elif 'cow milk' in name and 'amul-cow-milk.webp' in public_files:
            return '/products/amul-cow-milk.webp', "amul_cow"
        elif 'buffalo milk' in name and 'amul-buffalo-milk.webp' in public_files:
            return '/products/amul-buffalo-milk.webp', "amul_buffalo"
        elif 'dark chocolate' in name:
            if '55' in name and 'amul-55-dark-chocolate.webp' in public_files:
                return '/products/amul-55-dark-chocolate.webp', "amul_55_dark"
            elif '75' in name and 'amul-75-dark-chocolate.webp' in public_files:
                return '/products/amul-75-dark-chocolate.webp', "amul_75_dark"
            elif '90' in name and 'amul-90-dark-chocolate.webp' in public_files:
                return '/products/amul-90-dark-chocolate.webp', "amul_90_dark"

    # --- BISCUITS (PARLE, BRITANNIA, SUNFEAST, UNIBIC) ---
    if 'parle' in brand:
        if 'hide' in name and 'seek' in name:
            if 'bourbon' in name or 'black' in name:
                if 'parle-hide-seek-black-bourbon.webp' in public_files:
                    return '/products/parle-hide-seek-black-bourbon.webp', "parle_hide_seek_bourbon"
            if 'parle-hide-seek-family-pack.webp' in public_files:
                return '/products/parle-hide-seek-family-pack.webp', "parle_hide_seek"
        elif 'monaco' in name and 'parle-monaco.webp' in public_files:
            return '/products/parle-monaco.webp', "parle_monaco"
        elif 'krackjack' in name and 'parle-krackjack.webp' in public_files:
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

    if 'britannia' in brand or 'britannia' in name:
        if 'bourbon' in name and 'britannia-bourbon.webp' in public_files:
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
                elif '5 grain' in name and 'britannia-nutrichoice-5-grain-digestive.webp' in public_files:
                    return '/products/britannia-nutrichoice-5-grain-digestive.webp', "nutrichoice_5grain"
                elif 'zero' in name and 'britannia-nutrichoice-digestive-zero.webp' in public_files:
                    return '/products/britannia-nutrichoice-digestive-zero.webp', "nutrichoice_zero"
                elif 'britannia-nutrichoice-hi-fibre-digestive.webp' in public_files:
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

    return None, None

matched_items = []
unmatched_items = []

for p in products:
    img, rule = match_product(p)
    if img:
        matched_items.append((p['id'], p['name'], p['brand'], img, rule))
    else:
        unmatched_items.append((p['id'], p['name'], p['brand'], p['category']))

print(f"Total products: {len(products)}")
print(f"Verified strict image matches: {len(matched_items)}")
print(f"Unmatched products (clean reportable): {len(unmatched_items)}")

# save matched mapping
with open('data/verified_product_images.json', 'w', encoding='utf-8') as out:
    json.dump({m[0]: m[3] for m in matched_items}, out, indent=2)
print("Saved data/verified_product_images.json")
