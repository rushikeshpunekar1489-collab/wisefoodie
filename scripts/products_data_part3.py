# Product definitions part 3: Kellogg's, Kissan, Knorr, Maggi, Mapro

RAW_PRODUCTS_3 = [
    # 10. Kellogg's
    {
        "slug": "kelloggs-corn-flakes",
        "name": "Kellogg's Corn Flakes Original with Iron & Vitamins",
        "brand": "Kellogg's",
        "category": "Breakfast & Cereals",
        "subcategory": "Corn Flakes",
        "packSizeG": 475,
        "servingSizeG": 30,
        "priceINR": 195,
        "barcode": "8901499001015",
        "per100g": {
            "energyKcal": 378, "proteinG": 7.5, "carbsG": 84.0, "totalSugarG": 8.0, "addedSugarG": 7.0,
            "fatG": 0.8, "satFatG": 0.2, "transFatG": 0.0, "fibreG": 3.0, "sodiumMg": 680
        },
        "ingredients": ["Milled Corn (91%)", "Sugar", "Cereal Extract", "Iodised Salt", "Vitamins & Minerals (Vitamin C, B1, B2, B3, B6, B12, Folate, Iron)"],
        "benefits": ["Virtually fat-free (0.8g/100g)", "Fortified with essential B-vitamins and iron"],
        "concerns": ["High glycemic index causes rapid hunger return unless paired with protein", "Moderate sodium added for flavor"],
        "search_query": "Kelloggs Corn Flakes original box 475g pack white background"
    },
    {
        "slug": "kelloggs-chocos",
        "name": "Kellogg's Chocos Chocolate Crunchy Bites",
        "brand": "Kellogg's",
        "category": "Breakfast & Cereals",
        "subcategory": "Kids Cereals",
        "packSizeG": 385,
        "servingSizeG": 30,
        "priceINR": 180,
        "barcode": "8901499001022",
        "per100g": {
            "energyKcal": 382, "proteinG": 8.8, "carbsG": 82.0, "totalSugarG": 29.0, "addedSugarG": 27.0,
            "fatG": 2.5, "satFatG": 1.0, "transFatG": 0.0, "fibreG": 4.5, "sodiumMg": 360
        },
        "ingredients": ["Wheat Solids (Whole Wheat Flour 29%, Refined Wheat Flour 25%)", "Sugar", "Cocoa Solids (5.4%)", "Minerals (Calcium, Iron)", "Vitamins (B1, B2, B3, B6, B12, Folate, C)", "Colour (INS 150d)"],
        "benefits": ["Contains whole wheat grain flour and cocoa powder", "Fortified with Calcium and Vitamin D"],
        "concerns": ["Nearly 30% added sugar turns milk into chocolate sugar syrup", "High glycemic response"],
        "search_query": "Kelloggs Chocos box 385g pack white background"
    },
    {
        "slug": "kelloggs-muesli-fruit-nut",
        "name": "Kellogg's Muesli with 21% Fruit & Nut",
        "brand": "Kellogg's",
        "category": "Breakfast & Cereals",
        "subcategory": "Muesli & Granola",
        "packSizeG": 500,
        "servingSizeG": 40,
        "priceINR": 340,
        "barcode": "8901499001039",
        "per100g": {
            "energyKcal": 395, "proteinG": 8.2, "carbsG": 78.0, "totalSugarG": 18.0, "addedSugarG": 9.5,
            "fatG": 5.5, "satFatG": 1.5, "transFatG": 0.0, "fibreG": 6.8, "sodiumMg": 240
        },
        "ingredients": ["Multigrain Grains (Wheat 24%, Corn Flakes 17%, Rolled Barley 9%, Rolled Oats 9%)", "Dried Fruits & Nuts (21% - Raisins, Papaya, Cranberries, Almonds)", "Sugar", "Cereal Extract", "Wheat Bran"],
        "benefits": ["High dietary fibre (6.8g/100g) supports gut health and fullness", "Blend of 4 whole grains, roasted almonds, and antioxidant fruits"],
        "concerns": ["Contains added sucrose on top of natural fruit fructose"],
        "search_query": "Kelloggs Muesli 21 Fruit and Nut pack 500g white background"
    },
    {
        "slug": "kelloggs-froot-loops",
        "name": "Kellogg's Froot Loops Multigrain Cereal",
        "brand": "Kellogg's",
        "category": "Breakfast & Cereals",
        "subcategory": "Flavoured Cereals",
        "packSizeG": 285,
        "servingSizeG": 30,
        "priceINR": 220,
        "barcode": "8901499001046",
        "per100g": {
            "energyKcal": 384, "proteinG": 6.2, "carbsG": 84.5, "totalSugarG": 32.0, "addedSugarG": 30.0,
            "fatG": 2.2, "satFatG": 0.8, "transFatG": 0.0, "fibreG": 3.5, "sodiumMg": 420
        },
        "ingredients": ["Corn Flour Blend (Whole Grain Corn, Degermed Corn)", "Sugar", "Wheat Flour", "Whole Grain Oat Flour", "Natural Fruit Flavours", "Colours (INS 129, INS 110, INS 102, INS 133)", "Vitamins & Minerals"],
        "benefits": ["Crunchy loop shape with multi-fruit flavours and vivid colours", "Provides essential morning vitamins"],
        "concerns": ["Very high sugar (32g/100g)", "Contains synthetic artificial food colouring dyes"],
        "search_query": "Kelloggs Froot Loops box pack white background"
    },
    {
        "slug": "kelloggs-rolled-oats",
        "name": "Kellogg's 100% Wholegrain Rolled Oats",
        "brand": "Kellogg's",
        "category": "Breakfast & Cereals",
        "subcategory": "Plain Oats",
        "packSizeG": 1000,
        "servingSizeG": 40,
        "priceINR": 199,
        "barcode": "8901499001053",
        "per100g": {
            "energyKcal": 390, "proteinG": 13.0, "carbsG": 67.0, "totalSugarG": 0.8, "addedSugarG": 0.0,
            "fatG": 7.0, "satFatG": 1.3, "transFatG": 0.0, "fibreG": 10.2, "sodiumMg": 6
        },
        "ingredients": ["100% Whole Grain Rolled Oats"],
        "benefits": ["Single-ingredient clean whole food with 10.2g fibre and 13g plant protein", "Beta-glucan soluble fibre clinically proven to assist healthy lipid levels"],
        "concerns": ["Requires cooking or soaking to break down starches"],
        "search_query": "Kelloggs Oats 100 Wholegrain 1kg pouch pack white background"
    },

    # 11. Kissan
    {
        "slug": "kissan-fresh-tomato-ketchup",
        "name": "Kissan Fresh Tomato Ketchup",
        "brand": "Kissan",
        "category": "Sauces & Spreads",
        "subcategory": "Tomato Ketchup",
        "packSizeG": 950,
        "servingSizeG": 15,
        "priceINR": 140,
        "barcode": "8901030010101",
        "per100g": {
            "energyKcal": 135, "proteinG": 1.2, "carbsG": 32.0, "totalSugarG": 28.5, "addedSugarG": 24.0,
            "fatG": 0.2, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.8, "sodiumMg": 890
        },
        "ingredients": ["Water", "Tomato Paste (28%)", "Sugar", "Salt", "Acidity Regulator (INS 260 Acetic Acid)", "Thickening Agents (INS 1422, INS 415)", "Spices & Condiments", "Preservative (INS 211 Sodium Benzoate)"],
        "benefits": ["Made with 100% real farm-picked tomatoes", "Fat-free condiment"],
        "concerns": ["Over 28% total sugar content; 1 tablespoon adds ~4.3g sugar", "High sodium and chemical preservative"],
        "search_query": "Kissan Fresh Tomato Ketchup bottle 950g pack white background"
    },
    {
        "slug": "kissan-mixed-fruit-jam",
        "name": "Kissan Mixed Fruit Jam",
        "brand": "Kissan",
        "category": "Sauces & Spreads",
        "subcategory": "Fruit Jams",
        "packSizeG": 500,
        "servingSizeG": 20,
        "priceINR": 165,
        "barcode": "8901030010118",
        "per100g": {
            "energyKcal": 284, "proteinG": 0.3, "carbsG": 70.0, "totalSugarG": 65.0, "addedSugarG": 58.0,
            "fatG": 0.0, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.6, "sodiumMg": 28
        },
        "ingredients": ["Sugar", "Mixed Fruit Pulps (45% - Banana, Papaya, Apple, Pear, Pineapple, Mango, Grape, Orange)", "Thickener (INS 440 Pectin)", "Acidity Regulator (INS 330)", "Synthetic Food Colour (INS 122)", "Preservative (INS 211)"],
        "benefits": ["Blend of 8 real fruit pulps creating signature iconic sweet-tangy spread", "Fat-free and easy spread on rotis or toast"],
        "concerns": ["Sugar is the primary ingredient by weight (65% sugars)", "Contains synthetic red colour INS 122"],
        "search_query": "Kissan Mixed Fruit Jam glass jar 500g pack white background"
    },
    {
        "slug": "kissan-orange-marmalade",
        "name": "Kissan Sweet Orange Marmalade",
        "brand": "Kissan",
        "category": "Sauces & Spreads",
        "subcategory": "Marmalade",
        "packSizeG": 500,
        "servingSizeG": 20,
        "priceINR": 175,
        "barcode": "8901030010125",
        "per100g": {
            "energyKcal": 276, "proteinG": 0.4, "carbsG": 68.0, "totalSugarG": 63.0, "addedSugarG": 56.0,
            "fatG": 0.0, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.9, "sodiumMg": 30
        },
        "ingredients": ["Sugar", "Orange Juice & Pulp (40%)", "Orange Shreds (Peel 5%)", "Pectin (INS 440)", "Acidity Regulator (INS 330)", "Preservative (INS 211)"],
        "benefits": ["Real candied orange zest shreds provide authentic citrus aroma and pleasant slight bitterness"],
        "concerns": ["Heavy sugar matrix (63% sugars)", "Negligible protein and dietary fibre"],
        "search_query": "Kissan Orange Marmalade jar 500g white background"
    },
    {
        "slug": "kissan-pineapple-jam",
        "name": "Kissan Real Pineapple Jam",
        "brand": "Kissan",
        "category": "Sauces & Spreads",
        "subcategory": "Fruit Jams",
        "packSizeG": 500,
        "servingSizeG": 20,
        "priceINR": 170,
        "barcode": "8901030010132",
        "per100g": {
            "energyKcal": 280, "proteinG": 0.3, "carbsG": 69.0, "totalSugarG": 64.0, "addedSugarG": 57.0,
            "fatG": 0.0, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.7, "sodiumMg": 26
        },
        "ingredients": ["Sugar", "Pineapple Pulp (45%)", "Thickener (INS 440 Pectin)", "Acidity Regulator (INS 330)", "Synthetic Food Colour (INS 102 Tartrazine)", "Preservative (INS 211)"],
        "benefits": ["Distinct tropical pineapple sweet-tart punch", "Smooth spreadability"],
        "concerns": ["High refined sugar concentration", "Synthetic yellow dye (Tartrazine INS 102)"],
        "search_query": "Kissan Pineapple Jam jar 500g pack white background"
    },
    {
        "slug": "kissan-mango-jam",
        "name": "Kissan Alphonso Mango Jam",
        "brand": "Kissan",
        "category": "Sauces & Spreads",
        "subcategory": "Fruit Jams",
        "packSizeG": 500,
        "servingSizeG": 20,
        "priceINR": 175,
        "barcode": "8901030010149",
        "per100g": {
            "energyKcal": 282, "proteinG": 0.4, "carbsG": 69.5, "totalSugarG": 64.5, "addedSugarG": 57.5,
            "fatG": 0.0, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.8, "sodiumMg": 25
        },
        "ingredients": ["Sugar", "Alphonso Mango Pulp (45%)", "Thickener (INS 440)", "Acidity Regulator (INS 330)", "Preservative (INS 211)", "Nature Identical Flavour"],
        "benefits": ["Rich flavour derived from Indian Alphonso mango pulp", "Fat-free sweet spread"],
        "concerns": ["Dominated by added sugar syrup", "High glycemic index"],
        "search_query": "Kissan Mango Jam jar 500g pack white background"
    },

    # 12. Knorr
    {
        "slug": "knorr-classic-mixed-veg-soup",
        "name": "Knorr Classic Mixed Vegetable Soup",
        "brand": "Knorr",
        "category": "Instant Foods",
        "subcategory": "Instant Soups",
        "packSizeG": 43,
        "servingSizeG": 11,
        "priceINR": 40,
        "barcode": "8901030500101",
        "per100g": {
            "energyKcal": 332, "proteinG": 6.8, "carbsG": 68.0, "totalSugarG": 18.0, "addedSugarG": 14.0,
            "fatG": 3.8, "satFatG": 1.8, "transFatG": 0.0, "fibreG": 5.2, "sodiumMg": 3650
        },
        "ingredients": ["Refined Wheat Flour (Maida)", "Dehydrated Vegetables (18% - Carrot, Cabbage, Green Peas, Onion)", "Corn Starch", "Sugar", "Iodised Salt", "Hydrolyzed Vegetable Protein", "Flavour Enhancers (INS 627, INS 631)", "Sunflower Oil", "Spices"],
        "benefits": ["Contains 18% real dehydrated vegetables", "Quick 3-minute warm winter or rainy day refreshment"],
        "concerns": ["Excessive sodium concentration (3650mg/100g dry powder = ~400mg per prepared cup)", "Maida and corn starch thickeners"],
        "search_query": "Knorr Classic Mixed Vegetable Soup pack 43g white background"
    },
    {
        "slug": "knorr-sweet-corn-chicken-soup",
        "name": "Knorr Sweet Corn Chicken Soup",
        "brand": "Knorr",
        "category": "Instant Foods",
        "subcategory": "Instant Soups",
        "packSizeG": 42,
        "servingSizeG": 10.5,
        "priceINR": 45,
        "barcode": "8901030500118",
        "per100g": {
            "energyKcal": 345, "proteinG": 10.5, "carbsG": 66.0, "totalSugarG": 21.0, "addedSugarG": 16.0,
            "fatG": 4.2, "satFatG": 2.0, "transFatG": 0.0, "fibreG": 3.8, "sodiumMg": 3800
        },
        "ingredients": ["Corn Starch", "Sugar", "Dehydrated Sweet Corn (12%)", "Chicken Meat Powder (8%)", "Salt", "Hydrolyzed Protein", "Flavour Enhancer (INS 627, INS 631)", "Onion & Garlic Powder", "Spices"],
        "benefits": ["Chicken meat powder provides 10.5g protein in dry blend", "Classic sweet-corn velvety Chinese soup texture"],
        "concerns": ["Very high sodium (3800mg/100g)", "Corn starch thickening and added sugars"],
        "search_query": "Knorr Sweet Corn Chicken Soup pack 42g white background"
    },
    {
        "slug": "knorr-chinese-schezwan-noodles",
        "name": "Knorr Chinese Schezwan Instant Noodles",
        "brand": "Knorr",
        "category": "Instant Foods",
        "subcategory": "Instant Noodles",
        "packSizeG": 70,
        "servingSizeG": 70,
        "priceINR": 20,
        "barcode": "8901030500125",
        "per100g": {
            "energyKcal": 448, "proteinG": 8.0, "carbsG": 64.0, "totalSugarG": 3.8, "addedSugarG": 2.2,
            "fatG": 17.5, "satFatG": 8.2, "transFatG": 0.1, "fibreG": 3.0, "sodiumMg": 1150
        },
        "ingredients": ["Noodles: Refined Wheat Flour (Maida), Edible Vegetable Oil (Palmolein), Salt, Wheat Gluten", "Taste Maker: Spices (Garlic, Red Chilli, Pepper), Salt, Sugar, Soy Sauce Powder, Flavour Enhancers (INS 627, INS 631)"],
        "benefits": ["Zesty Schezwan garlic and chilli street flavour profile"],
        "concerns": ["Deep fried in refined palmolein with high saturated fat", "High sodium (1150mg/100g = ~805mg per single pack)"],
        "search_query": "Knorr Chinese Schezwan noodles pack white background"
    },
    {
        "slug": "knorr-chicken-cubes",
        "name": "Knorr Chicken Broth Seasoning Cubes",
        "brand": "Knorr",
        "category": "Ready To Cook",
        "subcategory": "Stock & Broth Cubes",
        "packSizeG": 60,
        "servingSizeG": 10,
        "priceINR": 70,
        "barcode": "8901030500132",
        "per100g": {
            "energyKcal": 220, "proteinG": 8.0, "carbsG": 18.0, "totalSugarG": 5.0, "addedSugarG": 4.0,
            "fatG": 12.0, "satFatG": 6.0, "transFatG": 0.0, "fibreG": 0.5, "sodiumMg": 18500
        },
        "ingredients": ["Iodised Salt", "Hydrogenated Palm Fat", "Flavour Enhancers (INS 621 MSG, INS 627, INS 631)", "Corn Starch", "Chicken Powder (5%)", "Sugar", "Onion Powder", "Caramel Colour (INS 150d)"],
        "benefits": ["Instantly elevates curries, gravies, and soups with rich roasted poultry umami"],
        "concerns": ["Over 45% salt by weight (18,500mg sodium per 100g)", "Contains hydrogenated palm fat and MSG"],
        "search_query": "Knorr Chicken Cubes pack 60g white background"
    },

    # 13. Maggi
    {
        "slug": "maggi-2-minute-masala-noodles",
        "name": "MAGGI 2-Minute Masala Instant Noodles",
        "brand": "Maggi",
        "category": "Instant Foods",
        "subcategory": "Instant Noodles",
        "packSizeG": 70,
        "servingSizeG": 70,
        "priceINR": 20,
        "barcode": "8901058852101",
        "per100g": {
            "energyKcal": 427, "proteinG": 8.0, "carbsG": 63.5, "totalSugarG": 2.2, "addedSugarG": 1.2,
            "fatG": 15.7, "satFatG": 6.8, "transFatG": 0.1, "fibreG": 3.6, "sodiumMg": 1028
        },
        "ingredients": ["Noodles: Refined Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Mineral (Calcium Carbonate), Thickeners (INS 508, INS 412), Acidity Regulators (INS 501(i), INS 500(i))", "Tastemaker: Hydrolysed Groundnut Protein, Mixed Spices (Coriander, Turmeric, Cumin, Aniseed, Fenugreek, Ginger, Black Pepper, Clove, Nutmeg, Cardamom), Noodle Powder, Sugar, Edible Starch, Palm Oil, Salt, Flavour Enhancer (INS 635)"],
        "benefits": ["Iconic nostalgic roasted spice aroma with 10 roasted Indian spices", "Fortified with Iron & Calcium"],
        "concerns": ["Refined maida noodle cake flash-fried in palm oil (6.8g sat fat)", "High sodium (1028mg/100g = ~720mg per single pack)"],
        "search_query": "Maggi 2-Minute Masala Instant Noodles pack 70g white background"
    },
    {
        "slug": "maggi-special-masala-noodles",
        "name": "MAGGI 2-Minute Special Masala Instant Noodles",
        "brand": "Maggi",
        "category": "Instant Foods",
        "subcategory": "Instant Noodles",
        "packSizeG": 70,
        "servingSizeG": 70,
        "priceINR": 20,
        "barcode": "8901058852118",
        "per100g": {
            "energyKcal": 435, "proteinG": 8.4, "carbsG": 62.0, "totalSugarG": 2.8, "addedSugarG": 1.5,
            "fatG": 16.5, "satFatG": 7.2, "transFatG": 0.1, "fibreG": 3.8, "sodiumMg": 1120
        },
        "ingredients": ["Noodles: Refined Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten", "Special Tastemaker: 20 Spices & Herbs (Red Chilli, Roasted Cumin, Star Anise, Cinnamon, Mace, Green Cardamom, Kasuri Methi), Salt, Sugar, Flavour Enhancer (INS 635)"],
        "benefits": ["Intense recipe featuring 20 roasted herbs and spices including kasuri methi and mace", "Good source of iron"],
        "concerns": ["Deep-fried noodle structure with elevated palm oil saturated lipids and sodium"],
        "search_query": "Maggi Special Masala Noodles pack 70g white background"
    },
    {
        "slug": "maggi-spicy-cheesy-noodles",
        "name": "MAGGI Spicy Cheesy Instant Noodles",
        "brand": "Maggi",
        "category": "Instant Foods",
        "subcategory": "Instant Noodles",
        "packSizeG": 76,
        "servingSizeG": 76,
        "priceINR": 25,
        "barcode": "8901058852125",
        "per100g": {
            "energyKcal": 450, "proteinG": 8.8, "carbsG": 61.5, "totalSugarG": 4.5, "addedSugarG": 2.5,
            "fatG": 18.2, "satFatG": 8.5, "transFatG": 0.1, "fibreG": 3.2, "sodiumMg": 1180
        },
        "ingredients": ["Noodles: Refined Wheat Flour, Palm Oil, Salt", "Tastemaker: Cheese Powder (Processed Cheddar), Milk Solids, Red Chilli Flakes, Sugar, Salt, Hydrolysed Protein, Flavour Enhancers (INS 635)"],
        "benefits": ["Rich spicy cheese sauce coating the noodles", "Higher protein from dairy cheese solids (8.8g)"],
        "concerns": ["Highest fat and calorie density among Maggi noodle range (450 kcal/100g)", "Substantial sodium load"],
        "search_query": "Maggi Spicy Cheesy Noodles pack 76g white background"
    },
    {
        "slug": "maggi-nutri-licious-atta-noodles",
        "name": "MAGGI Nutri-licious Masala Veg Atta Noodles",
        "brand": "Maggi",
        "category": "Instant Foods",
        "subcategory": "Atta Noodles",
        "packSizeG": 72.5,
        "servingSizeG": 72.5,
        "priceINR": 30,
        "barcode": "8901058852132",
        "per100g": {
            "energyKcal": 412, "proteinG": 9.5, "carbsG": 65.0, "totalSugarG": 3.2, "addedSugarG": 1.5,
            "fatG": 12.5, "satFatG": 5.4, "transFatG": 0.0, "fibreG": 6.8, "sodiumMg": 890
        },
        "ingredients": ["Atta Noodles: Whole Wheat Flour (Atta 85%), Palm Oil, Salt, Wheat Gluten", "Veg Tastemaker: Dehydrated Vegetables (Carrot, Peas), Roasted Spices, Salt, Hydrolysed Groundnut Protein, Sugar"],
        "benefits": ["85% Whole wheat grain atta base providing 6.8g dietary fibre per 100g", "Lower saturated fat and higher grain satiety than regular maida noodles"],
        "concerns": ["Still fried in palm oil during manufacturing; contains ~645mg sodium per portion"],
        "search_query": "Maggi Nutri-licious Atta Noodles pack white background"
    },
    {
        "slug": "maggi-cuppa-masala-noodles",
        "name": "MAGGI Cuppa Masala Instant Noodles",
        "brand": "Maggi",
        "category": "Instant Foods",
        "subcategory": "Cup Noodles",
        "packSizeG": 70,
        "servingSizeG": 70,
        "priceINR": 50,
        "barcode": "8901058852149",
        "per100g": {
            "energyKcal": 430, "proteinG": 8.2, "carbsG": 62.5, "totalSugarG": 3.0, "addedSugarG": 1.8,
            "fatG": 16.2, "satFatG": 7.5, "transFatG": 0.1, "fibreG": 3.5, "sodiumMg": 1150
        },
        "ingredients": ["Noodles: Refined Wheat Flour, Palm Oil, Salt, Calcium Carbonate", "Tastemaker & Veggies: Dehydrated Carrots, Sweet Corn, Green Peas, Spices, Salt, Sugar, Flavour Enhancer (INS 635)"],
        "benefits": ["Convenient on-the-go packaging with fold-out fork; requires only boiling water", "Includes real dehydrated sweet corn and peas"],
        "concerns": ["Single-use plastic cup packaging creates environmental footprint", "High sodium (1150mg/100g)"],
        "search_query": "Maggi Cuppa Masala Noodles cup pack white background"
    },
    {
        "slug": "maggi-hot-sweet-tomato-chilli-sauce",
        "name": "MAGGI Hot & Sweet Tomato Chilli Sauce",
        "brand": "Maggi",
        "category": "Sauces & Spreads",
        "subcategory": "Chilli Sauces",
        "packSizeG": 500,
        "servingSizeG": 15,
        "priceINR": 135,
        "barcode": "8901058852156",
        "per100g": {
            "energyKcal": 158, "proteinG": 1.2, "carbsG": 37.5, "totalSugarG": 34.0, "addedSugarG": 30.0,
            "fatG": 0.2, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.8, "sodiumMg": 940
        },
        "ingredients": ["Water", "Sugar", "Tomato Paste (22%)", "Red Chilli Puree (8%)", "Salt", "Acidity Regulator (INS 260)", "Thickeners (INS 1422, INS 415)", "Garlic & Ginger Powders", "Preservative (INS 211)"],
        "benefits": ["Spicy kick from real red chillies balances tomato sweetness", "Extremely versatile dip for pakoras, samosas, and snacks"],
        "concerns": ["Sugar is the 2nd ingredient (>34% total sugar)", "Substantial sodium density"],
        "search_query": "Maggi Hot and Sweet Tomato Chilli Sauce bottle 500g white background"
    },

    # 14. Mapro
    {
        "slug": "mapro-alphonso-mango-crush",
        "name": "Mapro Alphonso Mango Fruit Crush",
        "brand": "Mapro",
        "category": "Beverages",
        "subcategory": "Fruit Crushes & Syrups",
        "packSizeG": 1000,
        "servingSizeG": 35,
        "priceINR": 250,
        "barcode": "8901777001015",
        "per100g": {
            "energyKcal": 235, "proteinG": 0.5, "carbsG": 58.0, "totalSugarG": 52.0, "addedSugarG": 42.0,
            "fatG": 0.1, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.8, "sodiumMg": 35
        },
        "ingredients": ["Sugar", "Water", "Alphonso Mango Pulp (35%)", "Thickener (INS 440 Pectin)", "Acidity Regulator (INS 330)", "Preservative (INS 224)", "Natural & Nature Identical Flavour"],
        "benefits": ["Contains 35% authentic Ratnagiri Alphonso mango pulp with real fruit strands", "Fat-free base for milkshakes, ice cream sundaes, and mocktails"],
        "concerns": ["Concentrated sugar syrup product requiring strict dilution guidelines"],
        "search_query": "Mapro Alphonso Mango Fruit Crush bottle 1000ml white background"
    },
    {
        "slug": "mapro-whole-strawberry-crush",
        "name": "Mapro Whole Strawberry Fruit Crush",
        "brand": "Mapro",
        "category": "Beverages",
        "subcategory": "Fruit Crushes & Syrups",
        "packSizeG": 1000,
        "servingSizeG": 35,
        "priceINR": 275,
        "barcode": "8901777001022",
        "per100g": {
            "energyKcal": 228, "proteinG": 0.6, "carbsG": 56.0, "totalSugarG": 50.0, "addedSugarG": 40.0,
            "fatG": 0.2, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 1.2, "sodiumMg": 30
        },
        "ingredients": ["Strawberries (Whole Fruit Chunks 40%)", "Sugar", "Water", "Pectin (INS 440)", "Acidity Regulator (INS 330)", "Natural Colour (INS 163)", "Preservative (INS 211)"],
        "benefits": ["Packed with 40% real Mahabaleshwar strawberries with visible whole berry chunks", "Rich in natural strawberry fruit seeds and aroma"],
        "concerns": ["High sugar syrup base (50% sugars)", "Contains potassium benzoate preservative"],
        "search_query": "Mapro Whole Strawberry Crush bottle 1000ml white background"
    },
    {
        "slug": "mapro-falero-strawberry-chews",
        "name": "Mapro Falero Strawberry Fruit Chews",
        "brand": "Mapro",
        "category": "Chocolates & Confectionery",
        "subcategory": "Fruit Chews & Candies",
        "packSizeG": 250,
        "servingSizeG": 20,
        "priceINR": 95,
        "barcode": "8901777001039",
        "per100g": {
            "energyKcal": 320, "proteinG": 0.4, "carbsG": 79.0, "totalSugarG": 62.0, "addedSugarG": 54.0,
            "fatG": 0.1, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 1.0, "sodiumMg": 45
        },
        "ingredients": ["Sugar", "Liquid Glucose", "Strawberry Fruit Pulp (33%)", "Pectin (INS 440)", "Acidity Regulator (INS 330)", "Natural Colour"],
        "benefits": ["Contains 33% real fruit pulp (rare for gummy/chew confections)", "Soft melt-in-mouth gelatin-free pectin jelly texture"],
        "concerns": ["High in simple sugars and liquid glucose (62% sugar)", "Sticky candy can adhere to teeth"],
        "search_query": "Mapro Falero Strawberry Fruit Chews pack white background"
    },
    {
        "slug": "mapro-khus-syrup",
        "name": "Mapro Traditional Khus Sharbat Syrup",
        "brand": "Mapro",
        "category": "Beverages",
        "subcategory": "Traditional Syrups",
        "packSizeG": 750,
        "servingSizeG": 30,
        "priceINR": 210,
        "barcode": "8901777001046",
        "per100g": {
            "energyKcal": 255, "proteinG": 0.0, "carbsG": 63.5, "totalSugarG": 61.0, "addedSugarG": 60.0,
            "fatG": 0.0, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.0, "sodiumMg": 20
        },
        "ingredients": ["Sugar", "Water", "Vetiver Extract (Khus Roots 10%)", "Acidity Regulator (INS 330)", "Colour (INS 142)", "Preservative (INS 211)"],
        "benefits": ["Traditional Ayurvedic cooling herbal extract of Vetiver roots (Khus) for scorching summers"],
        "concerns": ["Nearly pure liquid sugar syrup; requires dilution", "Contains synthetic food green colour INS 142"],
        "search_query": "Mapro Khus Syrup bottle 750ml white background"
    },
    {
        "slug": "mapro-green-apple-lounge-syrup",
        "name": "Mapro Green Apple Lounge Bar Syrup",
        "brand": "Mapro",
        "category": "Beverages",
        "subcategory": "Cocktail & Mocktail Syrups",
        "packSizeG": 750,
        "servingSizeG": 30,
        "priceINR": 295,
        "barcode": "8901777001053",
        "per100g": {
            "energyKcal": 260, "proteinG": 0.1, "carbsG": 65.0, "totalSugarG": 62.0, "addedSugarG": 60.0,
            "fatG": 0.0, "satFatG": 0.0, "transFatG": 0.0, "fibreG": 0.0, "sodiumMg": 22
        },
        "ingredients": ["Sugar", "Water", "Green Apple Juice (20%)", "Acidity Regulator (INS 330)", "Colour (INS 102, INS 133)", "Flavours (Natural Apple)"],
        "benefits": ["Crisp, tart, refreshing green apple mixer for mocktails and sparkling sodas"],
        "concerns": ["High added sugar content", "Contains artificial food colours"],
        "search_query": "Mapro Lounge Green Apple syrup bottle white background"
    }
]
