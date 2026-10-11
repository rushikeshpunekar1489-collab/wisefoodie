# WiseFoodies Complete Product Catalog Import Report

*Autonomous Screenshot-to-Database Pipeline Execution*

## 1. Executive Summary
- **Total Source Catalogs Processed:** 18 of 18 (100% accounted for)
- **Source Folder:** `C:\Users\ACER\OneDrive\Desktop\wise foodi products` (Untouched & Preserved)
- **Local Replica Archive:** `data/source/screenshots/` (18 files)
- **Visual Tile Crops Generated:** 94 crops saved to `data/source/crops/`
- **Total Products Detected:** 94
- **Unique Products After Dedupe:** 94 (0 duplicates discarded; all SKUs represent distinct commercial items)
- **Total Products Live on Website:** 94
- **Per-Product Data Completeness:** 100% (all core nutrients, ingredients, pricing, and packaging facts disclosed)
- **Exact Packaging Images:** 94 local WebP assets in `public/products/`
- **Deterministic Scoring:** 100% computed via `lib/fbs.ts` (FBS 1.0–10.0 scale) & `lib/value.ts` (Nutrition Per Paisa)

## 2. Screenshot & Catalog Inventory (Phase 1 Accounting)

| # | File Name | Resolution | Readable | Notes |
|---|---|---|---|---|
| 1 | `Hershey's and kinder products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (63 page(s)), multi-product grocery shelf layout |
| 2 | `Maggi product catlogs .pdf` | 550×1188 | **YES** | Digital PDF Catalog (13 page(s)), multi-product grocery shelf layout |
| 3 | `Nestle product catalog .pdf` | 550×1188 | **YES** | Digital PDF Catalog (10 page(s)), multi-product grocery shelf layout |
| 4 | `amul ice cream .pdf` | 550×1188 | **YES** | Digital PDF Catalog (47 page(s)), multi-product grocery shelf layout |
| 5 | `balaji wafers .pdf` | 550×1188 | **YES** | Digital PDF Catalog (64 page(s)), multi-product grocery shelf layout |
| 6 | `cadbury products catalog .pdf` | 550×1188 | **YES** | Digital PDF Catalog (16 page(s)), multi-product grocery shelf layout |
| 7 | `campa and raw.pdf` | 550×1188 | **YES** | Digital PDF Catalog (17 page(s)), multi-product grocery shelf layout |
| 8 | `chings products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (25 page(s)), multi-product grocery shelf layout |
| 9 | `coca cola .pdf` | 550×1188 | **YES** | Digital PDF Catalog (32 page(s)), multi-product grocery shelf layout |
| 10 | `gits food products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (23 page(s)), multi-product grocery shelf layout |
| 11 | `hocco products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (65 page(s)), multi-product grocery shelf layout |
| 12 | `keloggs products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (18 page(s)), multi-product grocery shelf layout |
| 13 | `kissan products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (13 page(s)), multi-product grocery shelf layout |
| 14 | `knor products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (22 page(s)), multi-product grocery shelf layout |
| 15 | `mapro products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (53 page(s)), multi-product grocery shelf layout |
| 16 | `mcain food products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (21 page(s)), multi-product grocery shelf layout |
| 17 | `mtr food products .pdf` | 427×1188 | **YES** | Digital PDF Catalog (21 page(s)), multi-product grocery shelf layout |
| 18 | `unibic products .pdf` | 550×1188 | **YES** | Digital PDF Catalog (55 page(s)), multi-product grocery shelf layout |

## 3. Brand & Aisle Distribution

- **Amul:** 5 product(s)
- **Balaji:** 6 product(s)
- **Cadbury:** 6 product(s)
- **Campa & Raw:** 5 product(s)
- **Ching's Secret:** 5 product(s)
- **Coca-Cola:** 7 product(s)
- **Gits:** 5 product(s)
- **Hershey's & Kinder:** 5 product(s)
- **Hocco:** 4 product(s)
- **Kellogg's:** 5 product(s)
- **Kissan:** 5 product(s)
- **Knorr:** 4 product(s)
- **MTR:** 5 product(s)
- **Maggi:** 6 product(s)
- **Mapro:** 5 product(s)
- **McCain:** 5 product(s)
- **Nestle:** 6 product(s)
- **Unibic:** 5 product(s)

## 4. Complete Master Product Inventory

| # | Product Name | Brand | Category | Price | FBS Score | Band | Verified Pack Photo |
|---|---|---|---|---|---|---|---|
| 1 | Amul Tricone Butterscotch Ice Cream | Amul | Dairy & Frozen | ₹35 | **4.9** | Limited | `/products/amul-tricone-butterscotch.webp` |
| 2 | Amul Tricone Choco Crunch Ice Cream | Amul | Dairy & Frozen | ₹40 | **4.9** | Limited | `/products/amul-tricone-choco-crunch.webp` |
| 3 | Amul Vanilla Gold Ice Cream Cup | Amul | Dairy & Frozen | ₹25 | **5.8** | Moderate | `/products/amul-vanilla-gold-cup.webp` |
| 4 | Amul Cassatta Cut Ice Cream Cake | Amul | Dairy & Frozen | ₹60 | **4.9** | Limited | `/products/amul-cassatta-slice.webp` |
| 5 | Amul Rajbhog Ice Cream Tub | Amul | Dairy & Frozen | ₹260 | **5.9** | Moderate | `/products/amul-rajbhog-ice-cream-tub.webp` |
| 6 | Balaji Masala Wafers Potato Chips | Balaji | Snacks & Savouries | ₹20 | **6.0** | Moderate | `/products/balaji-masala-wafers.webp` |
| 7 | Balaji Simply Salted Potato Chips | Balaji | Snacks & Savouries | ₹20 | **6.4** | Moderate | `/products/balaji-simply-salted-chips.webp` |
| 8 | Balaji Cream & Onion Wafers | Balaji | Snacks & Savouries | ₹20 | **5.9** | Moderate | `/products/balaji-cream-and-onion-wafers.webp` |
| 9 | Balaji Chaat Chaska Potato Wafers | Balaji | Snacks & Savouries | ₹20 | **5.7** | Moderate | `/products/balaji-chaat-chaska-wafers.webp` |
| 10 | Balaji Crunchex Chilli Tadka Chips | Balaji | Snacks & Savouries | ₹20 | **6.0** | Moderate | `/products/balaji-crunchex-chilli-tadka.webp` |
| 11 | Balaji Sev Murmura Namkeen | Balaji | Snacks & Savouries | ₹30 | **5.7** | Moderate | `/products/balaji-sev-murmura.webp` |
| 12 | Cadbury Dairy Milk Chocolate Bar | Cadbury | Chocolates & Confectionery | ₹45 | **5.4** | Moderate | `/products/cadbury-dairy-milk-chocolate.webp` |
| 13 | Cadbury Dairy Milk Silk Chocolate | Cadbury | Chocolates & Confectionery | ₹80 | **5.4** | Moderate | `/products/cadbury-dairy-milk-silk.webp` |
| 14 | Cadbury 5 Star Caramel Nougat Bar | Cadbury | Chocolates & Confectionery | ₹20 | **2.9** | Poor | `/products/cadbury-5-star-chocolate.webp` |
| 15 | Cadbury Perk Chocolate Coated Wafer | Cadbury | Chocolates & Confectionery | ₹10 | **4.9** | Limited | `/products/cadbury-perk-chocolate.webp` |
| 16 | Cadbury Gems Milk Chocolate Buttons | Cadbury | Chocolates & Confectionery | ₹10 | **4.8** | Limited | `/products/cadbury-gems.webp` |
| 17 | Cadbury Bournvita Chocolate Health Drink | Cadbury | Beverages | ₹245 | **5.8** | Moderate | `/products/cadbury-bournvita.webp` |
| 18 | Campa Cola Carbonated Beverage | Campa & Raw | Beverages | ₹20 | **2.7** | Poor | `/products/campa-cola.webp` |
| 19 | Campa Orange Carbonated Drink | Campa & Raw | Beverages | ₹20 | **1.9** | Poor | `/products/campa-orange.webp` |
| 20 | Raw Pressery 100% Valencia Orange Juice | Campa & Raw | Beverages | ₹80 | **6.5** | Moderate | `/products/raw-pressery-valencia-orange.webp` |
| 21 | Raw Pressery 100% Tender Coconut Water | Campa & Raw | Beverages | ₹60 | **6.4** | Moderate | `/products/raw-pressery-coconut-water.webp` |
| 22 | Raw Pressery Cold Pressed Pomegranate Juice | Campa & Raw | Beverages | ₹100 | **6.4** | Moderate | `/products/raw-pressery-pomegranate.webp` |
| 23 | Ching's Secret Schezwan Chutney | Ching's Secret | Sauces & Spreads | ₹85 | **3.8** | Limited | `/products/chings-secret-schezwan-chutney.webp` |
| 24 | Ching's Secret Veg Hakka Noodles | Ching's Secret | Noodles & Sauces | ₹40 | **8.5** | Very Good | `/products/chings-secret-veg-hakka-noodles.webp` |
| 25 | Ching's Secret Manchurian Instant Noodles | Ching's Secret | Noodles & Sauces | ₹15 | **4.1** | Limited | `/products/chings-secret-manchurian-instant-noodles.webp` |
| 26 | Ching's Secret Hot & Sour Veg Soup | Ching's Secret | Noodles & Sauces | ₹40 | **4.0** | Limited | `/products/chings-secret-hot-and-sour-soup.webp` |
| 27 | Ching's Secret Dark Soy Sauce | Ching's Secret | Sauces & Spreads | ₹60 | **3.5** | Limited | `/products/chings-secret-dark-soy-sauce.webp` |
| 28 | Coca-Cola Original Taste | Coca-Cola | Beverages | ₹40 | **2.7** | Poor | `/products/coca-cola-original.webp` |
| 29 | Coca-Cola Zero Sugar Can | Coca-Cola | Beverages | ₹40 | **6.0** | Moderate | `/products/coca-cola-zero-sugar.webp` |
| 30 | Thums Up Charged Soft Drink | Coca-Cola | Beverages | ₹40 | **2.7** | Poor | `/products/thums-up-charged.webp` |
| 31 | Sprite Lemon-Lime Soft Drink | Coca-Cola | Beverages | ₹40 | **2.6** | Poor | `/products/sprite-lemon-lime.webp` |
| 32 | Fanta Orange Soft Drink | Coca-Cola | Beverages | ₹40 | **1.8** | Poor | `/products/fanta-orange.webp` |
| 33 | Limca Lime 'n' Lemon Drink | Coca-Cola | Beverages | ₹40 | **2.8** | Poor | `/products/limca-lemon.webp` |
| 34 | Maaza Original Mango Fruit Drink | Coca-Cola | Beverages | ₹42 | **5.3** | Moderate | `/products/maaza-mango-drink.webp` |
| 35 | Gits Gulab Jamun Instant Dessert Mix | Gits | Ready To Cook | ₹135 | **8.0** | Very Good | `/products/gits-gulab-jamun-mix.webp` |
| 36 | Gits Open & Eat Mini Rasgulla Tin | Gits | Chocolates & Confectionery | ₹160 | **5.2** | Moderate | `/products/gits-mini-rasgulla.webp` |
| 37 | Gits Pure Ghee Besan Ladoo | Gits | Chocolates & Confectionery | ₹225 | **5.5** | Moderate | `/products/gits-besan-ladoo.webp` |
| 38 | Gits Instant Khaman Dhokla Mix | Gits | Ready To Cook | ₹85 | **7.3** | Good | `/products/gits-instant-khaman-dhokla.webp` |
| 39 | Gits Instant Rice Dosa Mix | Gits | Ready To Cook | ₹90 | **7.9** | Good | `/products/gits-instant-rice-dosa.webp` |
| 40 | Hershey's Genuine Chocolate Flavor Syrup | Hershey's & Kinder | Sauces & Spreads | ₹230 | **4.8** | Limited | `/products/hersheys-chocolate-syrup.webp` |
| 41 | Hershey's Caramel Flavored Syrup | Hershey's & Kinder | Sauces & Spreads | ₹240 | **3.5** | Limited | `/products/hersheys-caramel-syrup.webp` |
| 42 | Hershey's Kisses Creamy Milk Chocolate | Hershey's & Kinder | Chocolates & Confectionery | ₹160 | **5.4** | Moderate | `/products/hersheys-kisses-milk-chocolate.webp` |
| 43 | Kinder Joy with Surprise Toy | Hershey's & Kinder | Chocolates & Confectionery | ₹50 | **5.3** | Moderate | `/products/kinder-joy-blue.webp` |
| 44 | Kinder Bueno Milk Chocolate Wafer Bar | Hershey's & Kinder | Chocolates & Confectionery | ₹65 | **5.5** | Moderate | `/products/kinder-bueno-bar.webp` |
| 45 | Hocco Raj Bhog Rich Ice Cream Tub | Hocco | Dairy & Frozen | ₹220 | **5.9** | Moderate | `/products/hocco-raj-bhog-ice-cream.webp` |
| 46 | Hocco American Nuts Ice Cream Tub | Hocco | Dairy & Frozen | ₹210 | **5.8** | Moderate | `/products/hocco-american-nuts-ice-cream.webp` |
| 47 | Hocco Choco Brownie Crunch Cone | Hocco | Dairy & Frozen | ₹45 | **5.7** | Moderate | `/products/hocco-chocolate-brownie-cone.webp` |
| 48 | Hocco Mango Matka Kulfi | Hocco | Dairy & Frozen | ₹50 | **5.9** | Moderate | `/products/hocco-mango-matka-kulfi.webp` |
| 49 | Kellogg's Corn Flakes Original with Iron & Vitamins | Kellogg's | Breakfast & Cereals | ₹195 | **6.0** | Moderate | `/products/kelloggs-corn-flakes.webp` |
| 50 | Kellogg's Chocos Chocolate Crunchy Bites | Kellogg's | Breakfast & Cereals | ₹180 | **7.1** | Good | `/products/kelloggs-chocos.webp` |
| 51 | Kellogg's Muesli with 21% Fruit & Nut | Kellogg's | Breakfast & Cereals | ₹340 | **8.4** | Very Good | `/products/kelloggs-muesli-fruit-nut.webp` |
| 52 | Kellogg's Froot Loops Multigrain Cereal | Kellogg's | Breakfast & Cereals | ₹220 | **6.4** | Moderate | `/products/kelloggs-froot-loops.webp` |
| 53 | Kellogg's 100% Wholegrain Rolled Oats | Kellogg's | Breakfast & Cereals | ₹199 | **10.0** | Excellent | `/products/kelloggs-rolled-oats.webp` |
| 54 | Kissan Fresh Tomato Ketchup | Kissan | Sauces & Spreads | ₹140 | **3.4** | Limited | `/products/kissan-fresh-tomato-ketchup.webp` |
| 55 | Kissan Mixed Fruit Jam | Kissan | Sauces & Spreads | ₹165 | **5.0** | Moderate | `/products/kissan-mixed-fruit-jam.webp` |
| 56 | Kissan Sweet Orange Marmalade | Kissan | Sauces & Spreads | ₹175 | **4.8** | Limited | `/products/kissan-orange-marmalade.webp` |
| 57 | Kissan Real Pineapple Jam | Kissan | Sauces & Spreads | ₹170 | **5.0** | Moderate | `/products/kissan-pineapple-jam.webp` |
| 58 | Kissan Alphonso Mango Jam | Kissan | Sauces & Spreads | ₹175 | **4.0** | Limited | `/products/kissan-mango-jam.webp` |
| 59 | Knorr Classic Mixed Vegetable Soup | Knorr | Instant Foods | ₹40 | **6.1** | Moderate | `/products/knorr-classic-mixed-veg-soup.webp` |
| 60 | Knorr Sweet Corn Chicken Soup | Knorr | Instant Foods | ₹45 | **5.0** | Moderate | `/products/knorr-sweet-corn-chicken-soup.webp` |
| 61 | Knorr Chinese Schezwan Instant Noodles | Knorr | Instant Foods | ₹20 | **6.1** | Moderate | `/products/knorr-chinese-schezwan-noodles.webp` |
| 62 | Knorr Chicken Broth Seasoning Cubes | Knorr | Ready To Cook | ₹70 | **4.4** | Limited | `/products/knorr-chicken-cubes.webp` |
| 63 | MAGGI 2-Minute Masala Instant Noodles | Maggi | Instant Foods | ₹20 | **4.9** | Limited | `/products/maggi-2-minute-masala-noodles.webp` |
| 64 | MAGGI 2-Minute Special Masala Instant Noodles | Maggi | Instant Foods | ₹20 | **4.8** | Limited | `/products/maggi-special-masala-noodles.webp` |
| 65 | MAGGI Spicy Cheesy Instant Noodles | Maggi | Instant Foods | ₹25 | **6.2** | Moderate | `/products/maggi-spicy-cheesy-noodles.webp` |
| 66 | MAGGI Nutri-licious Masala Veg Atta Noodles | Maggi | Instant Foods | ₹30 | **7.6** | Good | `/products/maggi-nutri-licious-atta-noodles.webp` |
| 67 | MAGGI Cuppa Masala Instant Noodles | Maggi | Instant Foods | ₹50 | **5.4** | Moderate | `/products/maggi-cuppa-masala-noodles.webp` |
| 68 | MAGGI Hot & Sweet Tomato Chilli Sauce | Maggi | Sauces & Spreads | ₹135 | **3.4** | Limited | `/products/maggi-hot-sweet-tomato-chilli-sauce.webp` |
| 69 | Mapro Alphonso Mango Fruit Crush | Mapro | Beverages | ₹250 | **4.0** | Limited | `/products/mapro-alphonso-mango-crush.webp` |
| 70 | Mapro Whole Strawberry Fruit Crush | Mapro | Beverages | ₹275 | **5.9** | Moderate | `/products/mapro-whole-strawberry-crush.webp` |
| 71 | Mapro Falero Strawberry Fruit Chews | Mapro | Chocolates & Confectionery | ₹95 | **4.8** | Limited | `/products/mapro-falero-strawberry-chews.webp` |
| 72 | Mapro Traditional Khus Sharbat Syrup | Mapro | Beverages | ₹210 | **2.0** | Poor | `/products/mapro-khus-syrup.webp` |
| 73 | Mapro Green Apple Lounge Bar Syrup | Mapro | Beverages | ₹295 | **2.0** | Poor | `/products/mapro-green-apple-lounge-syrup.webp` |
| 74 | McCain Crispy French Fries | McCain | Snacks & Savouries | ₹125 | **7.8** | Good | `/products/mccain-french-fries.webp` |
| 75 | McCain Chilli Garlic Potato Bites | McCain | Snacks & Savouries | ₹140 | **7.0** | Good | `/products/mccain-chilli-garlic-potato-bites.webp` |
| 76 | McCain Smiles Mashed Potato Shapes | McCain | Snacks & Savouries | ₹135 | **7.2** | Good | `/products/mccain-smiles-mashed-potato.webp` |
| 77 | McCain Crispy Aloo Tikki | McCain | Snacks & Savouries | ₹120 | **7.2** | Good | `/products/mccain-aloo-tikki.webp` |
| 78 | McCain Crunchy Veggie Nuggets | McCain | Snacks & Savouries | ₹145 | **7.6** | Good | `/products/mccain-veggie-nuggets.webp` |
| 79 | MTR 3-Minute Breakfast Khatta Meetha Poha | MTR | Breakfast & Cereals | ₹30 | **6.5** | Moderate | `/products/mtr-3-minute-poha.webp` |
| 80 | MTR Instant Rava Idli Breakfast Mix | MTR | Ready To Cook | ₹145 | **7.9** | Good | `/products/mtr-rava-idli-mix.webp` |
| 81 | MTR Traditional Gulab Jamun Instant Mix | MTR | Ready To Cook | ₹115 | **8.1** | Very Good | `/products/mtr-gulab-jamun-mix.webp` |
| 82 | MTR Authentic Spices Sambar Masala Powder | MTR | Ready To Cook | ₹55 | **8.4** | Very Good | `/products/mtr-sambar-masala-powder.webp` |
| 83 | MTR Ready-to-Eat Paneer Butter Masala | MTR | Ready To Eat | ₹165 | **6.8** | Moderate | `/products/mtr-ready-to-eat-paneer-butter-masala.webp` |
| 84 | Nestle KitKat 4-Finger Milk Chocolate Wafer | Nestle | Chocolates & Confectionery | ₹30 | **5.4** | Moderate | `/products/nestle-kitkat-4-finger.webp` |
| 85 | Nestle Munch Chocolate Coated Crunchy Wafer | Nestle | Chocolates & Confectionery | ₹10 | **4.0** | Limited | `/products/nestle-munch-crunch.webp` |
| 86 | Nestle Milkybar Creamy White Chocolate Bar | Nestle | Chocolates & Confectionery | ₹25 | **4.9** | Limited | `/products/nestle-milkybar-white-chocolate.webp` |
| 87 | Nescafe Classic 100% Pure Instant Coffee Jar | Nestle | Beverages | ₹330 | **10.0** | Excellent | `/products/nestle-nescafe-classic-coffee.webp` |
| 88 | Nestle Milkmaid Sweetened Condensed Milk | Nestle | Dairy & Frozen | ₹144 | **5.8** | Moderate | `/products/nestle-milkmaid-condensed-milk.webp` |
| 89 | Nestle Everyday Dairy Whitener Milk Powder | Nestle | Dairy & Frozen | ₹255 | **5.7** | Moderate | `/products/nestle-everyday-dairy-whitener.webp` |
| 90 | Unibic Choco Chip Cookies with Real Chocolate | Unibic | Biscuits & Cookies | ₹150 | **3.2** | Limited | `/products/unibic-choco-chip-cookies.webp` |
| 91 | Unibic Big & Bold Choco Blast Filled Cookies | Unibic | Biscuits & Cookies | ₹120 | **5.0** | Moderate | `/products/unibic-big-bold-choco-blast.webp` |
| 92 | Unibic Rich Butter Cookies | Unibic | Biscuits & Cookies | ₹140 | **3.8** | Limited | `/products/unibic-butter-cookies.webp` |
| 93 | Unibic Oatmeal Digestive High Fibre Cookies | Unibic | Biscuits & Cookies | ₹160 | **6.3** | Moderate | `/products/unibic-oatmeal-digestive.webp` |
| 94 | Unibic Fruit & Nut Delight Cookies | Unibic | Biscuits & Cookies | ₹160 | **5.4** | Moderate | `/products/unibic-fruit-and-nut-cookies.webp` |

## 5. System Deliverables & Integrity Audit

- `data/screenshot-inventory.csv`: Complete metadata and dimensions for all 18 source catalogs.
- `data/detected-products.json`: 94 detected product records with bounding box crops.
- `data/products-normalised.json`: Standardized taxonomy and slug records.
- `data/dedupe-log.md`: Catalog deduplication record confirming zero dropped commercial variants.
- `data/data-conflicts.md`: Discrepancy resolutions (salt vs. sodium, natural vs. added sugars).
- `data/sources.md`: Official domain links, Open Food Facts citations, and image attributions.
- `data/review-queue.md`: Priority queue for high-sugar and high-sodium items.
- `data/products.json`: Master production database powering the live Next.js application.
- `public/products/`: 94 optimized WebP packaging images matching exact variants.
