export interface LearnTopic {
  slug: string;
  title: string;
  icon: string;
  category: string;
  summary: string;
  keyTakeaway: string;
  details: string[];
  tips: string[];
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    slug: 'labels',
    title: 'Reading Indian Nutrition Labels',
    icon: '🏷️',
    category: 'Label Literacy',
    summary: 'How to cut through front-of-pack claims and find the real nutrition table.',
    keyTakeaway: 'Always look at the back per 100g panel, not the marketing claims on the front.',
    details: [
      'Front-of-pack buzzwords like "Healthy", "Natural", and "Fit" have loose regulatory restrictions.',
      'Ingredients must be listed in descending order of weight. The first 3 ingredients represent the bulk of the food.',
      'Always compare products on a standardized 100g basis, as serving sizes are often manipulated to show deceptively low sugar values.'
    ],
    tips: [
      'Check the first 2 ingredients. If sugar or maida comes first, it is a confection, not a health food.',
      'Multiply serving size by the number of servings you actually eat.'
    ]
  },
  {
    slug: 'sugar',
    title: 'The 12 Aliases of Added Sugar',
    icon: '🍯',
    category: 'Nutrient Deep-Dive',
    summary: 'How manufacturers hide sugar behind scientific-sounding chemical names.',
    keyTakeaway: 'Invert syrup, liquid glucose, and maltodextrin behave just like sugar in the body.',
    details: [
      'Invert Sugar: A split sucrose solution that keeps biscuits moist and soft.',
      'Liquid Glucose: Starch hydrolysate widely used in candies, spreads, and beverages.',
      'Maltodextrin: A tasteless starch powder with a glycemic index higher than table sugar.',
      'Fruit Juice Concentrate: Marketed as natural fruit, but chemically concentrated fructose.'
    ],
    tips: [
      'Scan ingredient lists for words ending in "-ose" (glucose, fructose, dextrose).',
      'The WHO recommends limiting added sugar to less than 25g per day for an adult.'
    ]
  },
  {
    slug: 'protein',
    title: 'True Protein Density vs Marketing',
    icon: '💪',
    category: 'Nutrient Deep-Dive',
    summary: 'Evaluating whether a "Protein Rich" snack genuinely delivers meaningful amino acids.',
    keyTakeaway: 'Check protein per 100 kcal, not just total grams per pack.',
    details: [
      'A biscuit containing 5g protein per 100g is not "high protein" when it also carries 30g sugar.',
      'Look for protein sources: Milk solids, whey, soy isolate, nuts, and pulses represent quality proteins.',
      'ICMR-NIN recommends 0.83g of protein per kg of body weight daily (approx 54g for an adult).'
    ],
    tips: [
      'Calculate protein per rupee using our Nutrition Per Paisa tool.',
      'Whole dals, paneer, and eggs remain the most cost-effective protein staples in India.'
    ]
  },
  {
    slug: 'fibre',
    title: 'Dietary Fibre & Soluble Beta-Glucans',
    icon: '🌾',
    category: 'Nutrient Deep-Dive',
    summary: 'The secret to sustained fullness, gut microflora, and lower cholesterol.',
    keyTakeaway: 'Whole oats and unpolished millets provide intrinsic soluble fibre missing in refined snacks.',
    details: [
      'Fibre slows gastric emptying and dampens post-meal glucose spikes.',
      'Soluble fibre (like beta-glucan in oats) binds to bile acids to assist in lowering LDL cholesterol.',
      'Most urban Indian diets achieve less than 15g of the recommended 30g daily fibre.'
    ],
    tips: [
      'Look for at least 6g of fibre per 100g in breakfast cereals and bakery items.',
      'Added inulin or polydextrose can boost fibre numbers on packaging but whole-food fibre is superior.'
    ]
  },
  {
    slug: 'sodium',
    title: 'Hidden Sodium in Savoury Snacks & Bread',
    icon: '🧂',
    category: 'Nutrient Deep-Dive',
    summary: 'Why instant noodles and bakery items pack more salt than potato chips.',
    keyTakeaway: 'A single pack of instant noodles can exceed 50% of your maximum daily sodium allowance.',
    details: [
      'Sodium is not just table salt; it exists as baking soda (INS 500ii), MSG (INS 621), and preservatives.',
      'WHO recommends maximum 2000mg sodium daily (about 5g of salt).',
      'Excessive sodium intake is the primary dietary contributor to hypertension and stroke in India.'
    ],
    tips: [
      'Check sodium per 100g: under 120mg is low, over 600mg is high, and over 800mg is very high.',
      'Rinse canned beans or reduce seasoning packet use by half in instant noodles.'
    ]
  },
  {
    slug: 'additives',
    title: 'Decoding INS Numbers & Food Additives',
    icon: '🧪',
    category: 'Additives & Processing',
    summary: 'International Numbering System (INS) explained for everyday grocery shoppers.',
    keyTakeaway: 'INS numbers are global codes for food additives; some are harmless vitamins while others flag heavy ultra-processing.',
    details: [
      'INS 300 is Ascorbic Acid (Vitamin C) - completely harmless.',
      'INS 330 is Citric Acid - common fruit acid for flavour balance.',
      'INS 322 is Lecithin - natural plant lipid emulsifier.',
      'INS 150d is Ammonia-Sulphite Caramel - synthetic dark dye in sodas.',
      'INS 635 is Disodium 5-ribonucleotides - intense umami flavour enhancer.'
    ],
    tips: [
      'Products with more than 5 distinct INS numbers are almost always ultra-processed.',
      'Look up any unknown additive directly in our ingredient glossary.'
    ]
  },
  {
    slug: 'palm-oil',
    title: 'Edible Vegetable Oil & Palm Oil Realities',
    icon: '🌴',
    category: 'Fats & Lipids',
    summary: 'Why "Edible Vegetable Oil" on Indian labels almost always means palm oil.',
    keyTakeaway: 'Palm oil is chosen for its cheap price and high frying stability, not for your heart.',
    details: [
      'Palm oil contains ~45-50% saturated palmitic acid.',
      'Indian labeling regulations allow grouping under generic "Edible Vegetable Oil".',
      'Repeatedly reheated industrial palm oil in snack factories generates free radicals.'
    ],
    tips: [
      'Look for snacks baked or prepared with cold-pressed mustard, peanut, or sunflower oils.',
      'Treat palm-oil deep-fried savouries as occasional treats rather than daily tea accompaniments.'
    ]
  },
  {
    slug: 'refined-flour',
    title: 'Refined Wheat Flour (Maida) vs Whole Grains',
    icon: '🍞',
    category: 'Grains & Carbs',
    summary: 'What happens to wheat when the bran and germ are stripped away.',
    keyTakeaway: 'Maida is stripped of 80% of its dietary fibre, B vitamins, and trace minerals.',
    details: [
      'Whole wheat grain consists of Bran (fibre/minerals), Endosperm (starch), and Germ (nutrients/oils).',
      'Maida is purely the starchy endosperm, rapidly digested like sugar.',
      'Many "brown breads" in India are simply maida colored with caramel colour (INS 150).'
    ],
    tips: [
      'Ensure "Whole Wheat Flour" or "Atta" is listed as the very first ingredient on bread.',
      'Check that fibre content is at least 6g per 100g on packaged breads.'
    ]
  },
  {
    slug: 'serving-size',
    title: 'The Serving Size Manipulation Trap',
    icon: '⚖️',
    category: 'Label Literacy',
    summary: 'How brands display microscopic portions to make sugar and calories look harmless.',
    keyTakeaway: 'Always judge packaged food by the 100g column, not the arbitrary single serving column.',
    details: [
      'A 100g chocolate bar might declare a serving size of "15g (2 tiny squares)".',
      'An individual can easily consume 50g-100g in one sitting, consuming 4-6x the declared numbers.',
      'FSSAI regulations mandate both per-serving and per-100g disclosure.'
    ],
    tips: [
      'Compare your actual bowl or snack portion against the tiny declared serving size.',
      'Notice how low sodium or low calorie claims evaporate when multiplied across the entire pack.'
    ]
  },
  {
    slug: 'colours',
    title: 'Synthetic Food Colours & Southampton Additives',
    icon: '🎨',
    category: 'Additives & Processing',
    summary: 'Artificial tartrazine, sunset yellow, and caramel colours in Indian foods.',
    keyTakeaway: 'Synthetic dyes offer zero nutritional value and are purely cosmetic marketing tools.',
    details: [
      'Tartrazine (INS 102), Sunset Yellow (INS 110), and Ponceau 4R (INS 124) are synthetic azo dyes.',
      'European regulations mandate warning labels for hyperactivity in children on these dyes.',
      'Natural alternatives exist: turmeric (curcumin), beetroot powder, and paprika extract.'
    ],
    tips: [
      'Avoid bright neon confectionery, artificially dyed drinks, and yellow extruded snacks.',
      'Choose foods using natural spices or plant pigments.'
    ]
  },
  {
    slug: 'processing',
    title: 'Understanding Ultra-Processed Foods (NOVA)',
    icon: '🏭',
    category: 'Processing Science',
    summary: 'The NOVA classification: Unprocessed, Culinary, Processed, and Ultra-Processed.',
    keyTakeaway: 'Ultra-processed foods are formulations of substances derived from foods with chemical additives.',
    details: [
      'Group 1: Unprocessed whole foods (apples, whole oats, plain milk, raw dal).',
      'Group 2: Culinary ingredients (salt, cold-pressed oil, butter, jaggery).',
      'Group 3: Processed foods (canned vegetables, cheese, artisanal breads).',
      'Group 4: Ultra-processed foods (packaged biscuits, sodas, instant noodles, reconstituted snacks).'
    ],
    tips: [
      'If you could not recreate the food in a home kitchen due to chemical ingredients, it is ultra-processed.',
      'Keep Group 4 foods to a minority of your grocery basket.'
    ]
  },
  {
    slug: 'nutrition-claims',
    title: 'Decoding Commercial Nutrition Claims',
    icon: '📢',
    category: 'Label Literacy',
    summary: '"No Added Sugar", "Zero Cholesterol", "Trans Fat Free" — what do they actually mean?',
    keyTakeaway: '"Zero Cholesterol" on plant oils is a marketing trick; no plant oil ever contains cholesterol.',
    details: [
      '"No Added Sugar" does not mean sugar-free; it may be packed with dates, concentrated juices, or maltodextrin.',
      '"Cholesterol Free" on vegetable oil is deceptive because cholesterol is only synthesised by animal livers.',
      '"Trans Fat Free" in India means &lt;0.2g per serving, but small amounts can still be present.'
    ],
    tips: [
      'Ignore front-of-pack stamps and look straight at the total carbohydrates and sugar lines.',
      'Remember: Real whole foods rarely have marketing slogans printed across them.'
    ]
  }
];
