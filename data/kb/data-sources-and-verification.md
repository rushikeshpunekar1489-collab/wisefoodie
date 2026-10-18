---
id: data-sources-and-verification
title: Data Sources and Verification Protocol
domain: fbs_logic
topics: [data-sources, verification, fssai, back-of-pack, open-food-facts, auditing]
lastUpdated: "2026-10-16"
---

# Data Sources and Verification Protocol

WiseFoodies maintains a strict verification pipeline to ensure that all nutritional data, ingredient lists, prices, and claims displayed on our website accurately represent authentic products sold to Indian consumers.

### Primary Data Sources
1. **Physical Front-of-Pack and Back-of-Pack Scans**: High-resolution photography of product labels purchased in Indian retail grocery outlets and quick-commerce platforms (Blinkit, Zepto, Instamart).
2. **Official Brand Declarations**: Direct manufacturer websites, regulatory filings, and official packaging artwork disclosures.
3. **Open Food Facts India**: Public open database records cross-checked and verified against photographic packaging evidence.
4. **FSSAI Compliance Filings**: Indian Food Safety and Standards Authority regulations and mandatory nutritional declarations.

### The 4 Verification Badges
Every product in our catalog displays a distinct verification badge:
1. **Complete**: All 10 nutritional fields (Energy, Protein, Carbs, Total Sugar, Added Sugar, Fat, Saturated Fat, Trans Fat, Fibre, Sodium), complete descending ingredients list, pack size, price, and barcode have been verified against physical back-of-pack photographs.
2. **Extracted from Label (Needs Review)**: Data collected via OCR scanning from physical packaging, awaiting secondary human auditor review.
3. **Incomplete**: Essential nutritional values were not disclosed by the brand on the product label. The Food Benefit Score is placed in **Pending** status until complete data is obtained.
4. **Sample**: Baseline demonstration record used for schema and testing verification.

### Freshness and Update Cadence
Product records are stamped with an explicit `lastUpdated` date (e.g. "Last updated 2026-03-15"). When brands reformulate products (such as reducing sugar or replacing palm oil), our team re-scans the pack and updates the database, automatically recalculating the Food Benefit Score.
