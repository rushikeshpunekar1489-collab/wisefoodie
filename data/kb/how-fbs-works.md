---
id: how-fbs-works
title: How the Food Benefit Score (FBS) is Calculated
domain: fbs_logic
topics: [fbs, formula, methodology, score, bands, scoring]
lastUpdated: "2026-10-16"
---

# Food Benefit Score (FBS) Methodology & Formula

The **Food Benefit Score (FBS)** is an algorithmic, transparent rating from **1.0 to 10.0** developed by WiseFoodies to assess the nutritional quality of packaged foods available in the Indian marketplace. Every product starts with a baseline score of **6.0 points**. Points are added for beneficial nutrients and deducted for components associated with adverse health outcomes or heavy ultra-processing.

| Factor | Threshold / Range | Points Impact | Description / Rule |
| :--- | :--- | :--- | :--- |
| **Base Score** | Initial starting value | **+6.0** | Standard baseline for packaged foods |
| **Protein** | 0g to 15g per 100g | **0 to +1.5** | Linear reward up to 15g protein (+1.5 max) |
| **Dietary Fibre** | 0g to 6g per 100g | **0 to +1.5** | Linear reward up to 6g dietary fibre (+1.5 max) |
| **Micronutrients** | >= 2 vitamins/minerals >= 15% RDA | **+0.5** | Reward for significant micronutrient fortification or density |
| **Whole-Food Ingredients** | 1st or 2nd ingredient is whole food | **+1.0** | Whole wheat, oats, ragi, pulses, nuts, seeds, milk, fruits, vegetables |
| **Nutrient Density** | (Protein + Fibre) per 100 kcal | **0 to +0.5** | Proportional score up to 5g total protein+fibre per 100 kcal |
| **Added Sugar** | 0g to 20g per 100g | **0 to -1.5** | Linear penalty up to 20g added/total sugars |
| **Sodium** | 0mg to 800mg (and >800mg) | **0 to -1.5** | Up to -1.0 pt for 800mg sodium; extra -0.5 pt for >800mg |
| **Saturated Fat** | 0g to 10g per 100g | **0 to -1.0** | Linear penalty up to 10g saturated fat |
| **Trans Fat** | > 0.2g per 100g | **-0.5** | Industrial trans fat penalty |
| **Processing & Additives** | >= 5 industrial additives/refined terms | **-0.7** | Penalty for ultra-processed formulations |
| **Energy Density** | > 450 kcal per 100g | **-0.3** | High caloric density penalty |
| **Sugary Beverage Anchor** | Liquid drink, sugar >=8g, protein<0.5g, fibre<0.2g | **-2.5** | Severe empty liquid sugar penalty |
| **Empty Calorie Load** | Solid food, sugar >=15g, protein<0.5g, fibre<0.2g | **-1.0** | Simple sugar load with negligible satiety |

### Score Bounds & Precision
- The raw score is clamped strictly between **1.0 and 10.0**.
- The final score is rounded to **1 decimal place**.

### The 6 FBS Score Bands
1. **Excellent (9.0 – 10.0)**: Unprocessed or minimally processed whole foods with high protein, high fibre, and zero added sugars.
2. **Very Good (8.0 – 8.9)**: High nutritional density with wholesome base ingredients and low sodium/sugar.
3. **Good (7.0 – 7.9)**: Balanced packaged staples, dairy foods, and nutritious meal builders.
4. **Moderate (5.0 – 6.9)**: Everyday packaged snacks or foods with moderate sugar, fat, or sodium levels.
5. **Limited (3.0 – 4.9)**: Highly refined products, salty namkeens, instant noodles, or sugary cookies.
6. **Poor (1.0 – 2.9)**: Ultra-processed sugary carbonated beverages, confectionery, or nutrient-void empty calories.

### Incomplete Data Handling
If a product label fails to declare any of the five core mandatory metrics (**Energy, Protein, Sugar, Fat, Sodium**), WiseFoodies marks the score as **Pending (null)** rather than guessing or hallucinating numbers.
