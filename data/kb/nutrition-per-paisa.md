---
id: nutrition-per-paisa
title: Nutrition Per Paisa Value Metric
domain: fbs_logic
topics: [value, nutrition-per-paisa, price, protein-per-rupee, ten-rupees-get, affordability]
lastUpdated: "2026-10-16"
---

# Nutrition Per Paisa ("Kitna Poshan Kitne Me")

Packaged foods in India are frequently marketed with premium prices claiming "High Protein" or "Power Nutrition" when the actual amount of protein delivered per rupee is negligible. **Nutrition Per Paisa** is WiseFoodies' transparent value metric linking consumer economics to real nutritional yield.

### The Problem With Price Per Gram
Comparing two packaged products simply by price per 100 grams does not tell you how much nutrition you are actually purchasing. For example, a ₹50 pack of protein cookies might deliver only 4g of protein total, while a ₹34 pouch of milk delivers 16g of complete protein.

### How Nutrition Per Paisa is Computed
Using the declared retail price (MRP in INR) and package net weight in grams:
1. **Total Pack Nutrients**:
   $$\text{Total Protein (g)} = \frac{\text{Protein per 100g} \times \text{Pack Size (g)}}{100}$$
2. **Protein Per Rupee (g / ₹1)**:
   $$\text{Protein Per Rupee} = \frac{\text{Total Protein (g)}}{\text{Price (₹)}}$$
3. **Rupees Per Gram of Protein (₹ / g)**:
   $$\text{Cost per 1g Protein} = \frac{\text{Price (₹)}}{\text{Total Protein (g)}}$$
4. **Fibre Per Rupee (g / ₹1)**:
   Grams of dietary fibre purchased for every rupee spent.

### "What Does ₹10 Get You?" (Coin Stack Analysis)
To make nutrition tangible for everyday Indian shoppers, WiseFoodies calculates the exact nutritional quantities purchased with a standard ₹10 coin:
- **Grams of Product Purchased for ₹10**: $\frac{10}{\text{Price (INR)}} \times \text{Pack Size (g)}$
- **Energy (kcal)** for ₹10.
- **Protein (g)** for ₹10 (displayed if $\ge 0.5\text{g}$).
- **Dietary Fibre (g)** for ₹10 (displayed if $\ge 0.3\text{g}$).
- **Micronutrients** (e.g., Calcium, Iron) delivered for ₹10.

### Critical Distinction: Value vs Health
A high "Protein Per Rupee" does **not** automatically mean a food is healthy. A sugary peanut chikki might provide affordable protein, but it also delivers heavy refined sugar and calories. WiseFoodies displays both the **Food Benefit Score (FBS)** and **Nutrition Per Paisa** together so you never mistake cheap calories for genuine health.
