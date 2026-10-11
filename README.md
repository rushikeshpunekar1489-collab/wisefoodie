# WiseFoodies: Packaged-Food Intelligence Platform

> **Eat Smarter. Choose Better.**  
> *Know Your Food Before You Buy It.*  
> Loop: **Scan. Score. Compare. Choose.**

---

## 🌟 Overview
**WiseFoodies** is an independent, scientific, and consumer-first packaged-food intelligence web application specifically calibrated for Indian grocery shoppers. It decodes nutritional declarations, demystifies chemical additives & hidden sugars, calculates the proprietary **Food Benefit Score (FBS)** on a deterministic 1.0–10.0 scale, and computes **Nutrition Per Paisa™** (₹ per gram protein/fibre).

---

## 🚀 Quick Start

### 1. Installation & Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> **Note on OneDrive:** This project resides in `C:\Users\ACER\OneDrive\Desktop\sarwesh website`. Both `node_modules` and `.next` are ignored in `.gitignore`. If OneDrive slows down disk writes during `npm install`, you may temporarily pause OneDrive syncing.

### 2. Run Unit Tests (FBS Calibration Anchors & Value Metrics)
```bash
npm test
```

### 3. Run Production Build & Type Checking
```bash
# Type check and lint
npm run lint

# Production bundle build
npm run build
```

---

## 📦 How to Add New Products & Re-Import

1. Place your new product files (PDF catalogs, product images, or spreadsheets) into your products folder:
   ```
   C:\Users\ACER\OneDrive\Desktop\wise foodi products\
   ```
   *(Or copy them directly into `data/source/`)*
2. Run the idempotent import script:
   ```bash
   npm run import
   ```
3. The importer will:
   - Read all items in `data/source/`
   - Extract and optimize package images into `public/products/<slug>.webp`
   - Regenerate `data/products.json`
   - Produce a transparent audit report at `data/import-report.md`
   - Immediately update the site without requiring a server restart.

---

## 🔬 How the Food Benefit Score (FBS) Works

The Food Benefit Score is computed per 100g as a **pure deterministic function** (`lib/fbs.ts`). It starts at a base score of **6.0 / 10.0**:

| Factor | Criterion | Points Added / Deducted |
|---|---|---|
| **Base Score** | Starting baseline for packaged foods | **6.0** |
| **Protein** | Linear 0 → 15 g per 100 g | 0 to **+1.5** |
| **Dietary Fibre** | Linear 0 → 6 g per 100 g | 0 to **+1.5** |
| **Micronutrients** | ≥ 2 vitamins/minerals each ≥ 15% Indian Adult RDA | **+0.5** |
| **Whole-Food Base** | 1st or 2nd ingredient is whole grain, pulse, nut, seed, dairy, fruit | **+1.0** |
| **Nutrient Density** | (Protein g + Fibre g) per 100 kcal, linear 0 → 5 | 0 to **+0.5** |
| **Added Sugar** | Linear 0 → 20 g per 100 g | 0 to **−1.5** |
| **Sodium** | Linear 0 → 800 mg (+ excess scaling > 800mg) | 0 to **−1.5** |
| **Saturated Fat** | Linear 0 → 10 g per 100 g | 0 to **−1.0** |
| **Trans Fat** | > 0.2 g per 100 g | **−0.5** |
| **Ultra-Processing** | ≥ 5 flagged additives / refined starches / artificial flavours | **−0.7** |
| **Energy Density** | > 450 kcal per 100 g | **−0.3** |
| **Liquid Calorie Anchor** | Liquid beverage with sugar ≥ 8g, protein &lt; 0.5g, fibre &lt; 0.2g | **−2.5** |

- **Bands:** 9.0–10.0 (Excellent), 8.0–8.9 (Very Good), 7.0–7.9 (Good), 5.0–6.9 (Moderate), 3.0–4.9 (Limited), 1.0–2.9 (Poor).
- **Automated Calibration Anchors (`npm test`):**
  - Rolled Whole Oats: ≥ 7.5 *(Scores ~9.1)*
  - Plain Paneer / Curd: ≥ 6.5 *(Scores ~7.8)*
  - Typical Sweet Glucose Biscuit: 3.5–5.5 *(Scores ~3.7)*
  - Instant Masala Noodles: 3.0–5.0 *(Scores ~4.9)*
  - Sugary Carbonated Soft Drink: ≤ 3.0 *(Scores ~2.7)*

*FBS is an informational score based on label data. It is not medical advice or a guarantee of health outcomes.*

---

## 🛠️ Architecture & Tech Stack
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Data Access Layer:** `lib/products.ts` (typed JSON data access layer designed to easily swap to SQLite or PostgreSQL)
- **Signature UI Component:** `FBSVitalityCapsule` — pill-shaped animated liquid capsule reflecting score & band fill.
- **Economic Tool:** `NutritionPerPaisaCard` — ₹ per gram protein & fibre, plus "What do you get for ₹10?"
- **Scanner:** HTML5 video camera stream with BarcodeDetector and fallback photo upload.
- **Comparison Engine:** Side-by-side matrix for 2–4 items with auto-highlighted best values and WiseFoodies Verdict.
- **Reporting Route:** `POST /api/report-issue` appends user feedback directly to `data/reports.json`.
