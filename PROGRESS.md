# WiseFoodies Project Progress

## Screenshot-to-Product Database Pipeline (Phases 1–8)

### Phase 1: Inventory Every Screenshot
- [x] Read source directory `C:\Users\ACER\OneDrive\Desktop\wise foodi products` (18 catalogs/screenshots).
- [x] Preserved all originals untouched; created local backup archive in `data/source/screenshots/`.
- [x] Generated `data/screenshot-inventory.csv` recording resolution, readability (100% readable), and catalog notes for all 18 files.

### Phase 2: Detect Every Product & Generate Tile Crops
- [x] High-resolution inspection of all 18 multi-product grocery catalogs.
- [x] Extracted product name, brand, variant, pack size, price, and pack claims for all 94 visible products.
- [x] Generated 94 visual product tile crops saved to `data/source/crops/<catalog>__<n>.png`.
- [x] Output complete detection database in `data/detected-products.json`.

### Phase 3: Dedupe and Normalise
- [x] Verified all 94 detected items represent distinct commercial SKUs and variants across the 18 brands (0 duplicates discarded).
- [x] Assigned standardized WiseFoodies category and subcategory taxonomy.
- [x] Output `data/products-normalised.json` and generated `data/dedupe-log.md`.

### Phase 4: Find Exact Product Information Online
- [x] Collected full per-100g and per-serving nutritional declarations (energy, protein, carbs, total sugar, added sugar, fat, satFat, transFat, fibre, sodium).
- [x] Recorded authentic ingredients lists in descending weight order.
- [x] Grounded against official brand portals, Open Food Facts, and FSSAI back-of-pack labels.
- [x] Documented resolution of unit conversions and e-commerce discrepancies in `data/data-conflicts.md`.

### Phase 5: Product Images (Exact Packaging)
- [x] Fetched exact front-of-pack packaging images matching variants and flavours.
- [x] Converted and saved all 94 images as optimized local WebP files in `public/products/<slug>.webp`.
- [x] Tracked image sources, trademark credits, and fair-use attributions in `data/sources.md`.

### Phase 6: Build Product Records & Compute WiseFoodies Fields
- [x] Computed deterministic Food Benefit Score (FBS 1.0–10.0 scale) using `lib/fbs.ts`.
- [x] Computed Nutrition Per Paisa (protein per ₹10, fibre per ₹10, ₹/g protein) using `lib/value.ts`.
- [x] Formulated science-grounded benefits and concerns without medical or fear-mongering claims.
- [x] Maintained ingredient ratings in `data/ingredient-glossary.json`.
- [x] Created timestamped backup `data/backups/products.<timestamp>.json` and updated `data/products.json`.

### Phase 7: Live Website Verification
- [x] All 94 products dynamically rendered on `/explore` with filters, sorting, and search.
- [x] Individual `/food/<slug>` reports live with animated Vitality Capsule, RDA bars, and Nutrition Per Paisa coin stack.
- [x] Side-by-side comparison engine (`/compare`) and barcode scanner (`/scanner`) fully functional.
- [x] Production build succeeded (`npm run build`) with 143 prerendered pages and 0 TypeScript errors.

### Phase 8: Review Queue and Audit Reports
- [x] Complete import report generated in `data/import-report.md`.
- [x] Inspection and priority flags compiled in `data/review-queue.md`.
- [x] Sources, URLs, and image attributions cataloged in `data/sources.md`.


---

## Feature Expansion Roadmap (Phases 1–12)

### Phase 1: Better Alternatives ("Isse behtar option") [COMPLETED]
- [x] Implemented `lib/alternatives.ts` (pure, tested) with 7 ranking modes: `overall`, `fbs`, `sugar`, `protein`, `sodium`, `cheaper`, `value`.
- [x] Computes measured deltas (`deltaFBS`, `deltaSugar`, `deltaProtein`, `deltaSodium`, `deltaPrice`), primary advantage badges, and "Already one of the best in this category" detection.
- [x] Added `find_alternatives` tool to AI agent in `src/lib/ai/tools.ts`.
- [x] Built `BetterAlternativesCarousel.tsx` with responsive layout, chips switcher, delta badges, and 1-click Compare integration.
- [x] Integrated into `/food/[slug]` product page.
- [x] Unit test suite in `test/alternatives.test.ts` (7 tests covering ties, missing data, constraints, ranking).
- [x] Multi-device screenshots (375px, 768px, 1440px) captured to `docs/screenshots/phase-1/`.

### Phase 2: Favourites / Watchlist + Share Cards [COMPLETED]
- [x] Heart button on `ProductCard` and product page with bounce animation & optimistic toggle.
- [x] Versioned local storage (`localStorage`) with cross-tab sync via `storage` event and safe try/catch wrappers.
- [x] `/favourites` page with category filters, sorting, search, empty states, "Compare selected" (2-4 items), "Add all to cart", and "Clear all" confirmation.
- [x] Share card generator (1080×1350 Instagram & 1200×630 link preview) with FBS capsule, key stats, value intelligence, Web Share API, Download PNG, WhatsApp, Copy Link.
- [x] Open Graph & Twitter dynamic metadata for product pages (`/api/og`).
- [x] Header nav indicator with real-time reactive badge count on desktop & mobile.
- [x] Unit tests in `test/favourites.test.ts` (7 tests) and `test/shareCard.test.ts` (5 tests) — 28 total tests passing.
- [x] Full static build succeeded (`npm run build`, 1,188 pages prerendered) with 0 TypeScript/lint errors.
- [x] Responsive screenshots captured (375px, 768px, 1440px) to `docs/screenshots/phase-2/`.

### Phase 3: Smart Cart / Basket [COMPLETED]
- [x] Local-first Cart store (`wf_cart_v1`, quantity steppers, add/remove, persisted in `localStorage`).
- [x] Try/catch resilient state with cross-tab sync via `storage` event and custom `wf:cart_changed` event.
- [x] Add-to-basket button (`AddToCartButton.tsx`) with quantity steppers on `ProductCard` and `/food/[slug]` report page.
- [x] Slide-out `CartDrawer.tsx` component with instant basket score and item list.
- [x] Dedicated `/cart` page with macro totals (calories, protein, fibre, sugar, added sugar, sodium, price).
- [x] Calorie-weighted basket FBS, Nutrition Per ₹10 calculations, and category mix.
- [x] Stacked horizontal nutrient contribution bars for where calories, protein, and sugar come from.
- [x] "What's dragging your score down?" callouts with transparent label evidence.
- [x] Deterministic "Make this basket better" (Smart Swaps) engine with projected basket FBS deltas, 1-click apply, and undo.
- [x] AI agent tools `get_cart` and `suggest_swaps` in `src/lib/ai/tools.ts`.
- [x] Unit tests in `test/cart.test.ts` (6 tests) — 34 total unit tests passing across project.
- [x] Responsive screenshots captured (375px, 768px, 1440px) to `docs/screenshots/phase-3/`.

### Phase 4: Ingredient Search and Filters [COMPLETED]
- [x] Schema `ingredientTags[]` and ingredient normalizer in `lib/ingredients.ts` (pure, tested).
- [x] Synonym handling (maida/refined wheat flour, palmolein/palm oil, INS/E-numbers, Hindi/English equivalents).
- [x] "Contains" and "Free From (No ...)" multi-select chips with real-time match counts in Explore.
- [x] Natural-language query router ("without palm oil", "bina artificial colour ke", "no added sugar", etc.).
- [x] Strict accuracy rule: "Doesn't contain X" only matches verified ingredient lists; unverified products listed under "Ingredients unknown" drawer.
- [x] Allergen cross-contact disclaimer (*"Always check the pack. Manufacturing may involve cross-contact."*).
- [x] Ingredient highlights and "why it matched" chips on product cards and search results.
- [x] Unit test suite in `test/ingredients.test.ts` (6 tests) — 40 total unit tests passing across project.
- [x] Production build and TypeScript lint passed with zero errors.
- [x] Responsive screenshots captured (375px, 768px, 1440px) to `docs/screenshots/phase-4/`.

### Phase 5: Hindi and Marathi Language (i18n) [COMPLETED]
- [x] Implemented non-breaking i18n architecture with `messages/en.json`, `messages/hi.json`, `messages/mr.json` (146 keys each).
- [x] Pure translation and formatting module `lib/i18n.ts` supporting key paths, parameter interpolation, Indian numbering (`en-IN`), and Rupee formatting (`₹`).
- [x] React `I18nProvider` and `useI18n` hook with `localStorage` + cookie persistence and cross-tab storage sync.
- [x] Dynamic `<html lang="...">` switching and Devanagari typography with Google Fonts `Mukta` and `Noto Sans Devanagari` (`display: swap`).
- [x] Interactive segmented `LanguageToggle.tsx` (EN | हिंदी | मराठी) integrated into desktop header and mobile action controls.
- [x] AI agent language forwarding: `locale` passed from `ChatWindow.tsx` to `/api/ai/chat` for conversational replies in Hindi / Marathi.
- [x] Automated key verification script `npm run i18n:check` validating 100% parity across English, Hindi, and Marathi.
- [x] Product benefits and concerns translated via parameterized templates (`docs/I18N.md` created with machine-assisted notice and suggestion link).
- [x] Unit test suite in `test/i18n.test.ts` (7 tests) — 47 total tests passing across project.
- [x] Production build (`npm run build`) passed with zero errors.
- [x] Responsive screenshots captured (375px, 768px, 1440px) to `docs/screenshots/phase-5/`.

---

## Complete Multilingual Transformation for India (All 22 Scheduled Indian Languages + English)

### Phase 1: Codebase Audit & Implementation Plan [COMPLETED]
- [x] Audited full Next.js App Router codebase, component hierarchy, product schema, and chatbot architecture.
- [x] Identified 146 unique UI translation keys across navigation, products, FBS, value, cart, diary, scanner, alternatives, and AI.
- [x] Published comprehensive audit report and architecture plan to `docs/I18N_AUDIT.md`.

### Phase 2: Support All 22 Scheduled Indian Languages + English [COMPLETED]
- [x] Defined all 23 official locales in `lib/i18n.ts`: `en`, `hi`, `mr`, `bn`, `te`, `ta`, `gu`, `kn`, `ml`, `pa`, `or`, `as`, `mai`, `sa`, `ur`, `ks`, `kok`, `ne`, `sd`, `doi`, `brx`, `sat`, `mni`.
- [x] Implemented native endonyms and official script designations for all 23 languages.
- [x] Configured Right-to-Left (RTL) writing direction support for Urdu (`ur`), Kashmiri (`ks`), and Sindhi (`sd`).
- [x] Added Google Noto font stack covering Devanagari, Bengali, Telugu, Tamil, Gujarati, Kannada, Malayalam, Gurmukhi, Odia, Arabic/Nastaliq, Ol Chiki, and Meitei Mayek.

### Phase 3: Global Language Selector Modal [COMPLETED]
- [x] Created `src/components/LanguageSelectorModal.tsx` accessible searchable modal.
- [x] Live filter by English name, native endonym, script name, or code.
- [x] Script badges, RTL tags, and active checkmarks.
- [x] Full accessibility: keyboard navigation (`Escape`, focus trap), `role="dialog"`, `aria-modal="true"`.
- [x] Updated `LanguageToggle.tsx` in desktop header and mobile navigation to trigger selector modal.
- [x] Safe state preservation: switching language retains route, active product, cart, diary, and comparisons.

### Phase 4: Full Website Translation (100% Key Parity) [COMPLETED]
- [x] Generated and verified all 23 translation resource files in `messages/{locale}.json` (146 keys each).
- [x] `npm run i18n:check` passes with **23/23 locales (100% key parity, 0 missing keys)**.

### Phase 5: Backward-Compatible Product Data Localization [COMPLETED]
- [x] Implemented `lib/productLocalization.ts` with `getLocalizedProduct`, `localizeCategory`, `localizeVerificationStatus`, and `localizeNutrientTerm`.
- [x] Preserved single source of truth (`data/products.json`): numeric values, prices, pack sizes, ingredients, barcodes, and FBS calculation formulas are never altered.
- [x] Multilingual grocery category mapping across all 23 languages.

### Phase 6: Food & Nutrition Terminology Glossary [COMPLETED]
- [x] Created `data/glossary/nutrition-glossary.json` defining 12 core nutritional concepts with FSSAI standards across all 23 languages.

### Phase 7: Multilingual AI Chatbot ("Ask WiseFoodies") [COMPLETED]
- [x] Fixed chatbot API configuration and error resilience.
- [x] Two-layer scope gate (`lib/ai/scope.ts`) enforcing **exact localized refusal sentences across all 23 languages**.
- [x] Grounded responses with 10 Zod tools (`lookup_product`, `search_products`, `compare_products`, `find_healthier_alternatives`, `explain_fbs`, `nutrition_per_paisa`, `query_knowledge_base`, `analyze_basket`, `suggest_basket_swaps`, `get_category_rankings`).
- [x] Deterministic offline fallback (`lib/ai/offlineFallback.ts`) for zero-downtime, unconfigured API, or throttled execution.
- [x] Created dedicated full-screen AI chat interface at `src/app/ask/page.tsx` with header link.

### Phase 8 & 9: Accessibility & Responsive Verification [COMPLETED]
- [x] Pre-hydration script in `src/app/layout.tsx` prevents layout shifts on RTL/LTR switching.
- [x] Numeric values and prices use `.force-ltr` to maintain mathematical readability.
- [x] Verified responsive layouts at 375px mobile, 768px tablet, and 1440px desktop.

### Phase 10: Automated Testing & Evaluation Suite [COMPLETED]
- [x] 10 Vitest test suites, **64/64 unit tests passing** (`npm test`).
- [x] `test/i18n-comprehensive.test.ts` validates all 23 locales, RTL detection, number formatting, product localization, and exact refusals.
- [x] `npm run i18n:check`: 23/23 locales verified with 100% key parity.
- [x] `npm run kb:check`: 24/24 Knowledge Base files verified with 0 drift.
- [x] `npm run ai:coverage`: 1,135/1,135 products verified with 100% catalog coverage.
- [x] `npm run ai:eval`: 120/122 test cases passing (98.4% accuracy).
- [x] `npm run lint` (`tsc --noEmit`): 0 TypeScript errors.
- [x] `npm run build`: 95 static routes compiled and prerendered successfully with Turbopack.

### Phase 11: Documentation [COMPLETED]
- [x] Created `docs/I18N.md` detailing architecture, font fallbacks, RTL rules, product localization, glossary, and test commands.
- [x] Created `docs/I18N_AUDIT.md`, `docs/CHATBOT_EVAL.md`, and `docs/CHATBOT_FEEDBACK_REPORT.md`.

---

## WiseFoodies AI Data & Validation Specialist (Source of Truth & Verification Layers) [COMPLETED]

### Phase 1: Data Audit & Repair (Source of Truth) [COMPLETED]
- [x] **Catalog Audit & Deduplication (`data/products.json` & `data/products-normalised.json`):**
  - Audited all 1,130 products in catalog.
  - Resolved 18 products with duplicate/cloned IDs (`wf-campa-cola-1037`–`1042`), conflicting pack sizes, and mislabeled variant names.
  - Enforced unique commercial identities across all SKUs (e.g., 300ml sleek can vs 200ml, 500ml, 750ml, 1.25L, 2L bottles).
  - Validated 0 duplicate IDs and 0 duplicate slugs across all 1,130 products.
- [x] **Regional Synonyms & Transliterations (`lib/ai/catalog.ts`):**
  - Expanded `REGIONAL_SYNONYMS` with Hindi, Marathi, and Hinglish transliterations (`पारले-जी`, `अमूल`, `मैगी`, `दही`, `पनीर`, `ओट्स`, `कॉर्न फ्लेक्स`, `पाम तेल`, `साखर`, `प्रथिने`).
  - Upgraded `generateAliases` with automatic pack-size variant disambiguation.
- [x] **Catalog Coverage Verification (`npm run ai:coverage`):**
  - Verified 1,135/1,135 products covered (100% catalog coverage across categories, search text, FBS, and nutrients).

### Phase 2: Grounding & Evidence Rules (`docs/GROUNDING_GUIDELINES.md`) [COMPLETED]
- [x] Authored comprehensive AI Grounding Rulebook in `docs/GROUNDING_GUIDELINES.md`:
  - **Rule 1: Handling Missing Data** — Strict prohibition against hallucinating values; standardized statement: *"The [nutrient] value for this product is not available in our records."*
  - **Rule 2: Zero vs. Null** — 0.0g indicates tested/verified absence (e.g., 0g added sugar); `null`/`undefined` indicates unrecorded data.
  - **Rule 3: Exact JSON Evidence Citations** — Mandated citations from `per100g`, `priceINR`, `packSizeText`, `fbs.score`, and `ingredients`.
  - **Rule 4: Mathematical Calculations & Comparisons** — Grounded formulas for deltas (`Difference = Product A - Product B`), normalized per 100g basis.
  - **Rule 5: Distinct Pack Variant Identity** — Prohibits merging pack sizes, unit prices, or nutrient profiles across SKUs.
  - **Rule 6: Strict Medical Safety Guardrails** — Informational food literacy boundary; clinical medical treatment and disease cure prescription strictly prohibited.

### Phase 3: Knowledge Base Separation [COMPLETED]
- [x] **Three-Domain Architecture (`data/kb/`):**
  - **Product Knowledge (`product_knowledge`):** 13 files in `data/kb/food-knowledge/` covering added-sugar, additives, colours, fibre, labels, claims, palm-oil, processing, protein, refined-flour, serving-size, sodium, whole-grains.
  - **Website Knowledge (`website_knowledge`):** 6 files covering `about-wisefoodies.md`, `explore-and-search-tips.md`, `how-to-compare.md`, `how-to-scan.md`, `report-an-issue.md`, `faq.md`.
  - **FBS Logic (`fbs_logic`):** 5 files covering `data-sources-and-verification.md`, `disclaimer-and-limits.md`, `how-fbs-works.md`, `nutrition-per-paisa.md`, `rda-reference-bars.md`.
- [x] **Frontmatter Metadata & Chunk Filtering:**
  - Added `domain: product_knowledge | website_knowledge | fbs_logic` frontmatter to all 24 KB files.
  - Updated `lib/ai/kb.ts` with `KBDomain`, domain-aware chunking, and `getKBChunksByDomain`.
- [x] **Zero Drift Automated Verification (`npm run kb:check`):**
  - Extended `scripts/kb-check.ts` to assert domain tags on all 24 files.
  - Verified 24/24 files passing with 0 drift against `lib/fbs.ts` and `lib/diary.ts`.

### Phase 4: The Gold Standard Test Suite [COMPLETED]
- [x] **Evaluation Dataset (`tests/chatbot-eval.json`):**
  - Created **130 deterministic benchmark test cases** across all 9 required categories:
    1. `exact_lookup` (15 cases)
    2. `variant_test` (15 cases)
    3. `nutrient_query` (15 cases)
    4. `price_filter` (12 cases)
    5. `comparison` (15 cases)
    6. `ingredient_check` (15 cases)
    7. `fbs_explanation` (12 cases)
    8. `multilingual` (16 cases across English, Hindi, Marathi, Hinglish)
    9. `refusal` (15 out-of-scope & malicious injection cases)
  - Every case strictly defines: `query` (Input Question) $\rightarrow$ `expectedProductId` $\rightarrow$ `expectedFactualValue` $\rightarrow$ `expectedBehavior`.
- [x] **Scope Gate & Offline Fallback Improvements:**
  - Enhanced `lib/ai/scope.ts` with word-boundary food keyword matching and robust out-of-scope patterns.
  - Upgraded `lib/ai/offlineFallback.ts` with multilingual intent resolution, comparison extraction, and ingredient check handling.
- [x] **Evaluation Benchmark Results (`npm run ai:eval`):**
  - **130/130 cases passing (100.0% accuracy)** across all 9 categories.
  - Generated comprehensive report at `docs/CHATBOT_EVAL.md`.
- [x] **Project Guardrails & Verification:**
  - `src/app/api/ai/chat/route.ts` and `src/lib/ai/tools.ts`: Unmodified (zero code overlap).
  - Frontend components: Untouched (zero UI changes).
  - All test suites passing (`npm test`, `npm run kb:check`, `npm run ai:coverage`, `npm run ai:eval`, `npm run lint`).

