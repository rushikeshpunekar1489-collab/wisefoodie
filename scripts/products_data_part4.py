# Product definitions part 4: McCain, MTR, Nestle, Unibic

RAW_PRODUCTS_4 = [
    # 15. McCain
    {
        "slug": "mccain-french-fries",
        "name": "McCain Crispy French Fries",
        "brand": "McCain",
        "category": "Snacks & Savouries",
        "subcategory": "Frozen Potato Finger Foods",
        "packSizeG": 420,
        "servingSizeG": 85,
        "priceINR": 125,
        "barcode": "8906004860101",
        "per100g": {
            "energyKcal": 158, "proteinG": 2.8, "carbsG": 25.5, "totalSugarG": 0.5, "addedSugarG": 0.0,
            "fatG": 5.0, "satFatG": 2.2, "transFatG": 0.0, "fibreG": 3.0, "sodiumMg": 220
        },
        "ingredients": ["Potatoes (92%)", "Edible Vegetable Oil (Palmolein)"],
        "benefits": ["Simple 2-ingredient formulation: 92% real whole potatoes and oil", "Pre-cut, flash-frozen without chemical batter coatings"],
        "concerns": ["Deep frying in home oil increases total fat and calorie load significantly; baking or air-frying is recommended"],
        "search_query": "McCain French Fries pack 420g white background"
    },
    {
        "slug": "mccain-chilli-garlic-potato-bites",
        "name": "McCain Chilli Garlic Potato Bites",
        "brand": "McCain",
        "category": "Snacks & Savouries",
        "subcategory": "Frozen Potato Finger Foods",
        "packSizeG": 420,
        "servingSizeG": 85,
        "priceINR": 140,
        "barcode": "8906004860118",
        "per100g": {
            "energyKcal": 175, "proteinG": 3.2, "carbsG": 28.0, "totalSugarG": 1.2, "addedSugarG": 0.5,
            "fatG": 5.8, "satFatG": 2.5, "transFatG": 0.0, "fibreG": 2.8, "sodiumMg": 580
        },
        "ingredients": ["Potato (70%)", "Edible Vegetable Oil (Palmolein)", "Garlic Paste (4%)", "Red Chilli Flakes (2%)", "Rice Flour", "Iodised Salt", "Onion Powder"],
        "benefits": ["Crisp exterior bite with aromatic roasted garlic and crushed red chilli flakes", "Rice flour coating gives crunch without heavy wheat batter"],
        "concerns": ["Moderate sodium content", "Pre-fried in palmolein oil"],
        "search_query": "McCain Chilli Garlic Potato Bites pack white background"
    },
    {
        "slug": "mccain-smiles-mashed-potato",
        "name": "McCain Smiles Mashed Potato Shapes",
        "brand": "McCain",
        "category": "Snacks & Savouries",
        "subcategory": "Frozen Potato Finger Foods",
        "packSizeG": 375,
        "servingSizeG": 75,
        "priceINR": 135,
        "barcode": "8906004860125",
        "per100g": {
            "energyKcal": 165, "proteinG": 2.5, "carbsG": 26.0, "totalSugarG": 0.8, "addedSugarG": 0.0,
            "fatG": 5.5, "satFatG": 2.4, "transFatG": 0.0, "fibreG": 2.5, "sodiumMg": 380
        },
        "ingredients": ["Potato (65%)", "Edible Vegetable Oil (Palmolein)", "Potato Flakes", "Corn Starch", "Iodised Salt"],
        "benefits": ["Fun iconic smiling face shape beloved by kids", "Soft fluffy seasoned mashed potato core"],
        "concerns": ["Refined corn starch and potato flakes reduce intact fiber; monitor home frying method"],
        "search_query": "McCain Smiles pack 375g white background"
    },
    {
        "slug": "mccain-aloo-tikki",
        "name": "McCain Crispy Aloo Tikki",
        "brand": "McCain",
        "category": "Snacks & Savouries",
        "subcategory": "Frozen Indian Snacks",
        "packSizeG": 400,
        "servingSizeG": 80,
        "priceINR": 120,
        "barcode": "8906004860132",
        "per100g": {
            "energyKcal": 172, "proteinG": 3.0, "carbsG": 27.5, "totalSugarG": 1.0, "addedSugarG": 0.0,
            "fatG": 5.5, "satFatG": 2.4, "transFatG": 0.0, "fibreG": 3.2, "sodiumMg": 520
        },
        "ingredients": ["Potato (72%)", "Edible Vegetable Oil (Palmolein)", "Corn Flour", "Spices & Condiments (Coriander, Cumin, Red Chilli, Ginger, Mint)", "Iodised Salt"],
        "benefits": ["Authentic chaat spice mix with cumin, ginger, and fresh mint flavour", "Ready in 3 minutes on a tawa (shallow fry) or air fryer"],
        "concerns": ["Pre-fried in palmolein oil with moderate sodium"],
        "search_query": "McCain Aloo Tikki pack 400g white background"
    },
    {
        "slug": "mccain-veggie-nuggets",
        "name": "McCain Crunchy Veggie Nuggets",
        "brand": "McCain",
        "category": "Snacks & Savouries",
        "subcategory": "Frozen Snacks",
        "packSizeG": 400,
        "servingSizeG": 80,
        "priceINR": 145,
        "barcode": "8906004860149",
        "per100g": {
            "energyKcal": 185, "proteinG": 4.5, "carbsG": 28.0, "totalSugarG": 2.0, "addedSugarG": 0.5,
            "fatG": 6.2, "satFatG": 2.8, "transFatG": 0.0, "fibreG": 3.8, "sodiumMg": 490
        },
        "ingredients": ["Vegetables (44% - Potatoes, Green Peas, Carrots, Sweet Corn)", "Breadcrumbs (Refined Wheat Flour, Yeast, Salt)", "Edible Vegetable Oil", "Batter (Wheat Flour, Corn Starch, Salt)", "Spices & Herbs"],
        "benefits": ["Contains 44% real mixed vegetables providing micronutrients and dietary fibre", "Crisp toasted breadcrumb exterior"],
        "concerns": ["Batter and breading contain refined maida; pre-fried"],
        "search_query": "McCain Veggie Nuggets pack white background"
    },

    # 16. MTR
    {
        "slug": "mtr-3-minute-poha",
        "name": "MTR 3-Minute Breakfast Khatta Meetha Poha",
        "brand": "MTR",
        "category": "Breakfast & Cereals",
        "subcategory": "Instant Breakfast",
        "packSizeG": 60,
        "servingSizeG": 60,
        "priceINR": 30,
        "barcode": "8901042950101",
        "per100g": {
            "energyKcal": 415, "proteinG": 8.0, "carbsG": 72.0, "totalSugarG": 12.0, "addedSugarG": 9.0,
            "fatG": 10.5, "satFatG": 4.5, "transFatG": 0.0, "fibreG": 4.5, "sodiumMg": 890
        },
        "ingredients": ["Rice Flakes (Poha 68%)", "Edible Vegetable Fat (Palm & Sunflower)", "Peanuts (8%)", "Sugar", "Dehydrated Onion", "Salt", "Green Chilli", "Curry Leaves", "Turmeric", "Mustard", "Cumin", "Acidity Regulator (INS 330 Citric Acid)"],
        "benefits": ["Traditional flattened rice base enriched with whole crunchy roasted peanuts (8%)", "Instant cup preparation requires only boiling water"],
        "concerns": ["Khatta-meetha profile contains added sugar (9g/100g)", "Palm oil and moderate sodium"],
        "search_query": "MTR 3 Minute Poha cup pack white background"
    },
    {
        "slug": "mtr-rava-idli-mix",
        "name": "MTR Instant Rava Idli Breakfast Mix",
        "brand": "MTR",
        "category": "Ready To Cook",
        "subcategory": "Breakfast Mixes",
        "packSizeG": 500,
        "servingSizeG": 60,
        "priceINR": 145,
        "barcode": "8901042950118",
        "per100g": {
            "energyKcal": 360, "proteinG": 11.5, "carbsG": 68.0, "totalSugarG": 1.5, "addedSugarG": 0.0,
            "fatG": 4.5, "satFatG": 1.8, "transFatG": 0.0, "fibreG": 4.0, "sodiumMg": 780
        },
        "ingredients": ["Semolina (Rawa 80%)", "Edible Vegetable Fat (Palm & Sesame)", "Bengal Gram Dal", "Cashew Nuts", "Salt", "Curry Leaves", "Ginger", "Mustard", "Raising Agent (INS 500(ii))"],
        "benefits": ["Invented by MTR during WWII wheat shortages; iconic heritage South Indian recipe", "Rich in grain protein (11.5g) and roasted whole cashews"],
        "concerns": ["Leavening agents add sodium to the dry mix"],
        "search_query": "MTR Rava Idli mix pack 500g white background"
    },
    {
        "slug": "mtr-gulab-jamun-mix",
        "name": "MTR Traditional Gulab Jamun Instant Mix",
        "brand": "MTR",
        "category": "Ready To Cook",
        "subcategory": "Dessert Mixes",
        "packSizeG": 175,
        "servingSizeG": 50,
        "priceINR": 115,
        "barcode": "8901042950125",
        "per100g": {
            "energyKcal": 410, "proteinG": 15.0, "carbsG": 60.0, "totalSugarG": 5.0, "addedSugarG": 0.0,
            "fatG": 12.0, "satFatG": 5.5, "transFatG": 0.0, "fibreG": 1.8, "sodiumMg": 390
        },
        "ingredients": ["Refined Wheat Flour (Maida)", "Skimmed Milk Powder (35%)", "Edible Vegetable Fat (Interesterified)", "Raising Agent (INS 500(ii))", "Acidity Regulator (INS 330)"],
        "benefits": ["Contains 35% skimmed dairy milk solids for melt-in-mouth soft texture", "Free from artificial colours and synthetic flavours"],
        "concerns": ["High in energy density once fried and soaked in sugar syrup"],
        "search_query": "MTR Gulab Jamun mix pack 175g white background"
    },
    {
        "slug": "mtr-sambar-masala-powder",
        "name": "MTR Authentic Spices Sambar Masala Powder",
        "brand": "MTR",
        "category": "Ready To Cook",
        "subcategory": "Spice Blends",
        "packSizeG": 100,
        "servingSizeG": 10,
        "priceINR": 55,
        "barcode": "8901042950132",
        "per100g": {
            "energyKcal": 320, "proteinG": 13.0, "carbsG": 48.0, "totalSugarG": 3.0, "addedSugarG": 0.0,
            "fatG": 8.0, "satFatG": 1.2, "transFatG": 0.0, "fibreG": 18.0, "sodiumMg": 420
        },
        "ingredients": ["Coriander (36%)", "Red Chilli (30%)", "Bengal Gram Dal", "Pigeon Pea (Toor Dal)", "Cumin", "Fenugreek", "Mustard", "Black Pepper", "Turmeric", "Asafoetida (Hing)"],
        "benefits": ["100% Whole spices and roasted lentils with zero added salt, preservatives, or artificial colours", "High dietary fibre (18g/100g) and rich in phytonutrients"],
        "concerns": ["Pungent and spicy; adjust dosage to heat tolerance"],
        "search_query": "MTR Sambar Powder 100g pack white background"
    },
    {
        "slug": "mtr-ready-to-eat-paneer-butter-masala",
        "name": "MTR Ready-to-Eat Paneer Butter Masala",
        "brand": "MTR",
        "category": "Ready To Eat",
        "subcategory": "Retort Meals",
        "packSizeG": 300,
        "servingSizeG": 150,
        "priceINR": 165,
        "barcode": "8901042950149",
        "per100g": {
            "energyKcal": 185, "proteinG": 6.8, "carbsG": 9.5, "totalSugarG": 4.5, "addedSugarG": 2.0,
            "fatG": 13.5, "satFatG": 7.5, "transFatG": 0.1, "fibreG": 2.2, "sodiumMg": 540
        },
        "ingredients": ["Tomato (25%)", "Paneer (Cottage Cheese 22%)", "Water", "Onion", "Butter (7%)", "Cashew Nuts", "Refined Sunflower Oil", "Cream", "Ginger", "Garlic", "Spices", "Salt"],
        "benefits": ["Generous 22% fresh dairy paneer chunks provide quality complete protein", "Retort pouch sterilized without chemical preservatives"],
        "concerns": ["Rich butter and cream gravy contributes 7.5g saturated fat per 100g"],
        "search_query": "MTR Ready to Eat Paneer Butter Masala pack white background"
    },

    # 17. Nestle
    {
        "slug": "nestle-kitkat-4-finger",
        "name": "Nestle KitKat 4-Finger Milk Chocolate Wafer",
        "brand": "Nestle",
        "category": "Chocolates & Confectionery",
        "subcategory": "Wafer Chocolates",
        "packSizeG": 38.5,
        "servingSizeG": 38.5,
        "priceINR": 30,
        "barcode": "8901058001015",
        "per100g": {
            "energyKcal": 498, "proteinG": 6.5, "carbsG": 64.0, "totalSugarG": 48.0, "addedSugarG": 42.0,
            "fatG": 23.8, "satFatG": 14.5, "transFatG": 0.1, "fibreG": 2.2, "sodiumMg": 110
        },
        "ingredients": ["Sugar", "Milk Solids", "Refined Wheat Flour (Maida)", "Cocoa Butter", "Cocoa Solids", "Edible Vegetable Fats (Hydrogenated Palm, Sesame)", "Emulsifier (INS 322 Soya Lecithin)", "Raising Agent (INS 500(ii))", "Yeast"],
        "benefits": ["Iconic snap break and airy crispy baked wafer layers", "Certified sustainably sourced cocoa beans"],
        "concerns": ["High in sugar and saturated vegetable lipids", "Low satiety value"],
        "search_query": "Nestle KitKat 4 finger chocolate bar pack white background"
    },
    {
        "slug": "nestle-munch-crunch",
        "name": "Nestle Munch Chocolate Coated Crunchy Wafer",
        "brand": "Nestle",
        "category": "Chocolates & Confectionery",
        "subcategory": "Wafer Chocolates",
        "packSizeG": 18,
        "servingSizeG": 18,
        "priceINR": 10,
        "barcode": "8901058001022",
        "per100g": {
            "energyKcal": 472, "proteinG": 5.0, "carbsG": 68.0, "totalSugarG": 42.0, "addedSugarG": 36.0,
            "fatG": 20.0, "satFatG": 12.0, "transFatG": 0.1, "fibreG": 1.8, "sodiumMg": 140
        },
        "ingredients": ["Refined Wheat Flour (Maida)", "Sugar", "Hydrogenated Vegetable Fats (Palm)", "Cocoa Solids (4.5%)", "Milk Solids", "Emulsifier (INS 322)", "Raising Agent (INS 500(ii))", "Salt"],
        "benefits": ["Very light and crunchy aerated wafer bite", "Low pack calorie damage (~85 kcal for entire bar)"],
        "concerns": ["Hydrogenated palm fat and refined maida base", "High sugar proportion"],
        "search_query": "Nestle Munch chocolate bar pack white background"
    },
    {
        "slug": "nestle-milkybar-white-chocolate",
        "name": "Nestle Milkybar Creamy White Chocolate Bar",
        "brand": "Nestle",
        "category": "Chocolates & Confectionery",
        "subcategory": "White Chocolate",
        "packSizeG": 40,
        "servingSizeG": 20,
        "priceINR": 25,
        "barcode": "8901058001039",
        "per100g": {
            "energyKcal": 526, "proteinG": 8.5, "carbsG": 58.0, "totalSugarG": 54.0, "addedSugarG": 44.0,
            "fatG": 28.5, "satFatG": 17.5, "transFatG": 0.1, "fibreG": 0.0, "sodiumMg": 175
        },
        "ingredients": ["Milk Solids (Cream, Skimmed Milk 35%)", "Sugar", "Hydrogenated Vegetable Oil", "Cocoa Butter", "Emulsifier (INS 322)", "Flavour (Vanilla)"],
        "benefits": ["Contains 35% milk solids; milk is the #1 ingredient listed before sugar", "Provides calcium from concentrated milk solids"],
        "concerns": ["Zero dietary fibre and zero cocoa flavonoids (white chocolate formulation)", "High saturated fat and sugar density"],
        "search_query": "Nestle Milkybar white chocolate bar pack white background"
    },
    {
        "slug": "nestle-nescafe-classic-coffee",
        "name": "Nescafe Classic 100% Pure Instant Coffee Jar",
        "brand": "Nestle",
        "category": "Beverages",
        "subcategory": "Instant Coffee",
        "packSizeG": 100,
        "servingSizeG": 2,
        "priceINR": 330,
        "barcode": "8901058001046",
        "per100g": {
            "energyKcal": 280, "proteinG": 14.0, "carbsG": 45.0, "totalSugarG": 0.0, "addedSugarG": 0.0,
            "fatG": 0.5, "satFatG": 0.2, "transFatG": 0.0, "fibreG": 24.0, "sodiumMg": 80
        },
        "ingredients": ["100% Pure Coffee Beans (Robusta & Arabica Blend)"],
        "benefits": ["Single-ingredient pure roasted coffee with zero added chicory, sugars, or fillers", "Rich in polyphenol antioxidants (chlorogenic acids) and natural caffeine"],
        "concerns": ["High caffeine sensitivity may cause insomnia or jitteriness if overconsumed"],
        "search_query": "Nescafe Classic glass jar 100g white background"
    },
    {
        "slug": "nestle-milkmaid-condensed-milk",
        "name": "Nestle Milkmaid Sweetened Condensed Milk",
        "brand": "Nestle",
        "category": "Dairy & Frozen",
        "subcategory": "Dessert Ingredients",
        "packSizeG": 380,
        "servingSizeG": 25,
        "priceINR": 144,
        "barcode": "8901058001053",
        "per100g": {
            "energyKcal": 322, "proteinG": 7.8, "carbsG": 55.5, "totalSugarG": 55.5, "addedSugarG": 44.0,
            "fatG": 8.0, "satFatG": 5.2, "transFatG": 0.1, "fibreG": 0.0, "sodiumMg": 115
        },
        "ingredients": ["Pasteurized Milk", "Sugar"],
        "benefits": ["Clean two-ingredient traditional recipe: pure cow/buffalo milk and cane sugar", "Essential kitchen secret for festive kheer, halwa, and fudge desserts"],
        "concerns": ["Very high sugar density (over 55% sugars by weight)"],
        "search_query": "Nestle Milkmaid tin 380g pack white background"
    },
    {
        "slug": "nestle-everyday-dairy-whitener",
        "name": "Nestle Everyday Dairy Whitener Milk Powder",
        "brand": "Nestle",
        "category": "Dairy & Frozen",
        "subcategory": "Milk Powders",
        "packSizeG": 400,
        "servingSizeG": 10,
        "priceINR": 255,
        "barcode": "8901058001060",
        "per100g": {
            "energyKcal": 456, "proteinG": 17.5, "carbsG": 50.0, "totalSugarG": 48.0, "addedSugarG": 22.0,
            "fatG": 20.5, "satFatG": 13.0, "transFatG": 0.2, "fibreG": 0.0, "sodiumMg": 230
        },
        "ingredients": ["Milk Solids", "Sugar"],
        "benefits": ["Produces thick, creamy, rich tea (chai) and coffee without curdling", "High dairy protein (17.5g per 100g) from real milk solids"],
        "concerns": ["Contains added sucrose (unlike plain whole milk powder)", "High saturated fat"],
        "search_query": "Nestle Everyday Dairy Whitener pack 400g white background"
    },

    # 18. Unibic
    {
        "slug": "unibic-choco-chip-cookies",
        "name": "Unibic Choco Chip Cookies with Real Chocolate",
        "brand": "Unibic",
        "category": "Biscuits & Cookies",
        "subcategory": "Choco Chip Cookies",
        "packSizeG": 500,
        "servingSizeG": 30,
        "priceINR": 150,
        "barcode": "8906009070101",
        "per100g": {
            "energyKcal": 495, "proteinG": 5.5, "carbsG": 66.0, "totalSugarG": 34.0, "addedSugarG": 31.0,
            "fatG": 23.0, "satFatG": 11.8, "transFatG": 0.1, "fibreG": 2.5, "sodiumMg": 310
        },
        "ingredients": ["Refined Wheat Flour (Maida)", "Chocolate Chips (21% - Sugar, Cocoa Solids, Cocoa Butter, Emulsifier INS 322)", "Sugar", "Edible Vegetable Oil (Palm)", "Desiccated Coconut", "Invert Sugar Syrup", "Raising Agents (INS 503(ii), INS 500(ii))", "Emulsifier (INS 322)"],
        "benefits": ["Generous 21% real chocolate chip inclusion gives rich cocoa bites", "Crisp European wire-cut cookie texture with desiccated coconut note"],
        "concerns": ["High in palm oil saturated lipids and refined sugar", "Calorie dense biscuit"],
        "search_query": "Unibic Choco Chip Cookies pack 500g white background"
    },
    {
        "slug": "unibic-big-bold-choco-blast",
        "name": "Unibic Big & Bold Choco Blast Filled Cookies",
        "brand": "Unibic",
        "category": "Biscuits & Cookies",
        "subcategory": "Cream Filled Cookies",
        "packSizeG": 300,
        "servingSizeG": 30,
        "priceINR": 120,
        "barcode": "8906009070118",
        "per100g": {
            "energyKcal": 515, "proteinG": 5.8, "carbsG": 64.0, "totalSugarG": 36.5, "addedSugarG": 33.0,
            "fatG": 26.0, "satFatG": 13.5, "transFatG": 0.1, "fibreG": 2.8, "sodiumMg": 330
        },
        "ingredients": ["Refined Wheat Flour (Maida)", "Choco Cream Filling (35% - Sugar, Edible Vegetable Oil, Cocoa Solids 8%, Milk Solids)", "Sugar", "Edible Vegetable Fat (Palm)", "Cocoa Solids", "Raising Agents", "Emulsifier (INS 322)"],
        "benefits": ["Molten chocolate core center filling inside rich crunchy chocolate biscuit"],
        "concerns": ["Very high in saturated palm fat and refined sugar (36.5% sugar)", "Calorie dense (~155 kcal for 2 cookies)"],
        "search_query": "Unibic Big Bold Choco Blast cookies pack white background"
    },
    {
        "slug": "unibic-butter-cookies",
        "name": "Unibic Rich Butter Cookies",
        "brand": "Unibic",
        "category": "Biscuits & Cookies",
        "subcategory": "Butter Cookies",
        "packSizeG": 500,
        "servingSizeG": 30,
        "priceINR": 140,
        "barcode": "8906009070125",
        "per100g": {
            "energyKcal": 502, "proteinG": 6.0, "carbsG": 65.0, "totalSugarG": 26.0, "addedSugarG": 24.0,
            "fatG": 24.0, "satFatG": 12.5, "transFatG": 0.1, "fibreG": 2.0, "sodiumMg": 340
        },
        "ingredients": ["Refined Wheat Flour (Maida)", "Sugar", "Butter (12%)", "Edible Vegetable Oil (Palm)", "Liquid Glucose", "Milk Solids", "Raising Agents (INS 503(ii), INS 500(ii))", "Salt"],
        "benefits": ["Contains 12% real dairy butter for rich authentic melt-in-mouth mouthfeel", "Lower sugar than filled chocolate cookies"],
        "concerns": ["Blended with refined palm oil alongside dairy butter", "Maida based bakery formulation"],
        "search_query": "Unibic Butter Cookies pack 500g white background"
    },
    {
        "slug": "unibic-oatmeal-digestive",
        "name": "Unibic Oatmeal Digestive High Fibre Cookies",
        "brand": "Unibic",
        "category": "Biscuits & Cookies",
        "subcategory": "Digestive Cookies",
        "packSizeG": 500,
        "servingSizeG": 30,
        "priceINR": 160,
        "barcode": "8906009070132",
        "per100g": {
            "energyKcal": 470, "proteinG": 8.0, "carbsG": 66.0, "totalSugarG": 20.0, "addedSugarG": 18.0,
            "fatG": 19.0, "satFatG": 9.0, "transFatG": 0.0, "fibreG": 7.5, "sodiumMg": 420
        },
        "ingredients": ["Wheat Flour (Whole Wheat Flour 30%, Refined Wheat Flour 20%)", "Rolled Oats (26%)", "Edible Vegetable Oil (Palm)", "Sugar", "Wheat Bran (5%)", "Invert Sugar", "Raising Agents (INS 500(ii), INS 503(ii))", "Salt"],
        "benefits": ["High dietary fibre (7.5g/100g) from 26% rolled oats and added wheat bran", "Better glycemic satiety than standard sweet tea biscuits"],
        "concerns": ["Still contains added cane sugar and palm oil shortening"],
        "search_query": "Unibic Oatmeal Digestive cookies pack white background"
    },
    {
        "slug": "unibic-fruit-and-nut-cookies",
        "name": "Unibic Fruit & Nut Delight Cookies",
        "brand": "Unibic",
        "category": "Biscuits & Cookies",
        "subcategory": "Fruit & Nut Cookies",
        "packSizeG": 500,
        "servingSizeG": 30,
        "priceINR": 160,
        "barcode": "8906009070149",
        "per100g": {
            "energyKcal": 485, "proteinG": 6.5, "carbsG": 66.5, "totalSugarG": 28.0, "addedSugarG": 24.0,
            "fatG": 21.0, "satFatG": 10.5, "transFatG": 0.1, "fibreG": 3.8, "sodiumMg": 320
        },
        "ingredients": ["Refined Wheat Flour (Maida)", "Fruits & Nuts (16% - Candied Papaya, Raisins, Almonds, Cashews)", "Sugar", "Edible Vegetable Oil (Palm)", "Desiccated Coconut", "Invert Syrup", "Milk Solids", "Raising Agents"],
        "benefits": ["Loaded with 16% whole nuts (almonds, cashews) and chewy fruit raisins", "Crisp crumb texture with subtle coconut undertone"],
        "concerns": ["Candied papaya fruit pieces contribute additional refined sugars", "Palm oil fat content"],
        "search_query": "Unibic Fruit and Nut cookies pack 500g white background"
    }
]
