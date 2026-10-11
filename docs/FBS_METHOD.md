# Food Benefit Score (FBS) Calculation Methodology

> *FBS is an informational score based on label data. It is not medical advice or a guarantee of health outcomes.*

## Core Philosophy
The Food Benefit Score (FBS) is a deterministic, explainable, and scientific metric calibrated specifically for Indian packaged foods. Unlike black-box algorithms, every point added or deducted corresponds to a specific line item on the product's nutrition facts panel and ingredient declaration.

## Base & Scale
- **Base Score:** 6.0 / 10.0
- **Scale Range:** 1.0 to 10.0 (clamped, rounded to 1 decimal place)
- **Evaluation Basis:** Per 100 g (or 100 ml for beverages)

## Scoring Rules Table

| Factor | Criterion | Points Added / Deducted | Rationale |
|---|---|---|---|
| **Protein** | Linear 0 → 15 g | 0 to +1.5 pts | Encourages muscle repair and satiety. Max points at 15g/100g. |
| **Dietary Fibre** | Linear 0 → 6 g | 0 to +1.5 pts | Promotes gut health and lowers glycemic response. Max at 6g/100g. |
| **Micronutrients** | ≥ 2 vitamins/minerals each ≥ 15% RDA | +0.5 pts | Recognizes significant micronutrient density. |
| **Whole-Food Base** | 1st or 2nd ingredient is whole grain, pulse, nut, seed, dairy, fruit, or vegetable | +1.0 pt | Rewards wholesome, minimally processed food matrices. |
| **Nutrient Density** | (Protein g + Fibre g) per 100 kcal, linear 0 → 5 | 0 to +0.5 pts | Satiety to calorie efficiency ratio. |
| **Added Sugar** | Linear 0 → 20 g | 0 to −1.5 pts | Discourages excessive refined sugar intake. |
| **Sodium** | Linear 0 → 800 mg (+ excess scaling > 800mg) | 0 to −1.5 pts | Penalizes high salt load relative to WHO 2000mg daily guidance. |
| **Saturated Fat** | Linear 0 → 10 g | 0 to −1.0 pt | Moderates saturated lipid load. |
| **Trans Fat** | > 0.2 g per 100 g | −0.5 pts | Discourages industrial trans-fatty acids. |
| **Ultra-Processing** | ≥ 5 flagged additives / refined starches / artificial flavours | −0.7 pts | Penalizes heavily chemical/industrial ultra-processing. |
| **High Energy Density** | > 450 kcal / 100 g | −0.3 pts | Flags hyper-palatable, calorie-dense foods. |
| **Liquid Calorie / SSB Anchor** | Liquid beverage with sugar ≥ 8g, protein < 0.5g, fibre < 0.2g | −2.5 pts | Reflects rapid glucose spike and lack of satiety in sugar-sweetened beverages. |

## Score Bands & Frequency Guidelines
- **9.0 – 10.0 (Excellent):** Wholesome foods packed with protein, fibre, and essential micronutrients. (Regular consumption)
- **8.0 – 8.9 (Very Good):** Nutritious everyday choices with clean ingredient lists. (Regular consumption)
- **7.0 – 7.9 (Good):** Balanced foods suitable for daily or frequent meals. (Regular consumption)
- **5.0 – 6.9 (Moderate):** Balanced treats or staple foods with moderate sodium or fats. (Occasional consumption)
- **3.0 – 4.9 (Limited):** Highly refined treats, sweet biscuits, or instant noodles. (Limit consumption)
- **1.0 – 2.9 (Poor):** Ultra-processed sugary sodas, confectioneries with empty calories. (Rarely consume)

## Calibration Anchor Verification
Every release of WiseFoodies validates against 5 fundamental anchor foods:
1. **Rolled Whole Oats:** Score ≥ 7.5 (Observed: ~9.1)
2. **Plain Fresh Paneer / Curd:** Score ≥ 6.5 (Observed: ~7.8)
3. **Typical Sweet Biscuit (e.g. Parle-G):** Score 3.5 – 5.5 (Observed: ~3.7)
4. **Instant Noodles (e.g. Maggi):** Score 3.0 – 5.0 (Observed: ~4.9)
5. **Sugary Soft Drink (e.g. Cola):** Score ≤ 3.0 (Observed: ~2.7)
