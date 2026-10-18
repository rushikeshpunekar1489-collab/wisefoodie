# WiseFoodies Multilingual Transformation Audit & Architecture Plan

**Date**: 2026-10-16  
**Auditor**: Senior Full-Stack & Localization Architect  
**Project**: WiseFoodies (`sarwesh website`)  
**Technology Stack**: Next.js 16.4.0 (Turbopack, App Router), TypeScript, Tailwind CSS, LocalStorage/Cookie Persistence, Vitest  

---

## 1. Executive Summary

WiseFoodies is an independent Indian packaged food intelligence platform containing **1,130+ verified commercial packaged food products** across 16 categories, featuring:
- **Food Benefit Score (FBS 1.0–10.0)** with granular nutritional breakdowns
- **Nutrition Per Paisa** value intelligence (protein & fibre per ₹1 and per ₹10)
- **Better Alternatives ("Isse Behtar Option")** same-category ranking
- **Side-by-side comparison matrix (`/compare`)**
- **Live camera & barcode scanner (`/scanner`)**
- **Smart Cart (`/cart`) & Food Diary (`/diary`)**
- **Food literacy articles (`/learn`)**
- **Ask WiseFoodies AI Assistant**

An initial localization framework existed for 3 languages (`en`, `hi`, `mr`) covering 146 translation keys in `messages/*.json`. This audit outlines the complete transformation to support **all 22 Scheduled Indian Languages** recognized under the Eighth Schedule of the Constitution of India, plus English (`en`):
1. **Assamese (`as`)** — Assamese/Bengali Script, LTR
2. **Bengali (`bn`)** — Bengali Script, LTR
3. **Bodo (`brx`)** — Devanagari Script, LTR
4. **Dogri (`doi`)** — Devanagari Script, LTR
5. **Gujarati (`gu`)** — Gujarati Script, LTR
6. **Hindi (`hi`)** — Devanagari Script, LTR
7. **Kannada (`kn`)** — Kannada Script, LTR
8. **Kashmiri (`ks`)** — Perso-Arabic Script, RTL
9. **Konkani (`kok`)** — Devanagari Script, LTR
10. **Maithili (`mai`)** — Devanagari Script, LTR
11. **Malayalam (`ml`)** — Malayalam Script, LTR
12. **Manipuri / Meitei (`mni`)** — Bengali/Meetei Mayek Script, LTR
13. **Marathi (`mr`)** — Devanagari Script, LTR
14. **Nepali (`ne`)** — Devanagari Script, LTR
15. **Odia (`or`)** — Odia Script, LTR
16. **Punjabi (`pa`)** — Gurmukhi Script, LTR
17. **Sanskrit (`sa`)** — Devanagari Script, LTR
18. **Santali (`sat`)** — Ol Chiki Script, LTR
19. **Sindhi (`sd`)** — Perso-Arabic Script, RTL
20. **Tamil (`ta`)** — Tamil Script, LTR
21. **Telugu (`te`)** — Telugu Script, LTR
22. **Urdu (`ur`)** — Perso-Arabic (Nastaliq) Script, RTL
23. **English (`en`)** — Latin Script, LTR (Base / Fallback)

---

## 2. Audit of Routes, Layouts & Existing Strings

### 2.1 Route Inventory
| Route | Type | Current User-Facing Content |
| :--- | :--- | :--- |
| `/` | Static | Home Hero, Quick Search, Category Pills, Trending Products, Value Spotlight, Mission Callouts |
| `/explore` | Static/Client | Filter drawer, Category chips, Sort dropdown, "Contains" vs "Free from" ingredients, Results count, Product grid |
| `/explore/[category]` | Dynamic/Static | Category banner, Subcategory tabs, Filtered product cards, Empty state |
| `/food/[slug]` | Dynamic/Static | Product report: Vitality Capsule, RDA Bars, Nutrition Per Paisa, Ingredients breakdown, Benefits, Concerns, Alternatives, Share Card |
| `/compare` | Client (`Suspense`) | 2–4 product comparison matrix, Nutrient deltas, Difference highlights, Automated verdict, Add to cart |
| `/scanner` | Client | Camera stream, Barcode input, OCR status, Missing product notice, Scanning tips |
| `/learn` | Static | 12 Food literacy articles, Topics grid, Key takeaways, Deep-dive guides |
| `/learn/[topic]` | Dynamic/Static | Article content, Summary, Actionable tips, Related products |
| `/cart` | Client | Basket FBS, Total Spend, Total Nutrition, Macro contribution bars, "Dragging score down", Smart Swaps |
| `/favourites` | Client | Saved watchlist, Category filter, "Compare selected", "Add all to cart", Clear confirmation |
| `/diary` | Client (`Suspense`) | Daily meal logger, ICMR-NIN RDA bars, Streak tracker, Portion modal, CSV export |
| `/search` | Client | Natural language search results, "Why matched" chips, Empty state suggestions |
| `/about` | Static | Platform mission, Methodology, Independent analysis |
| `/terms` | Static | Terms of use, Fair use of brand logos, Informational notice |
| `/privacy` | Static | Local-first privacy notice, No personal data collection |
| `/disclaimer` | Static | Medical advice disclaimer, Allergen cross-contact notice |
| `/contact` | Static | Support email, Issue submission instructions |
| `/api/ai/chat` | Server API | Chatbot streaming endpoint, Tool execution, Scope gate |
| `/api/report-issue` | Server API | Community correction submission endpoint |

### 2.2 Hardcoded English Strings Identified
1. **Header & Navigation**: Search input placeholder, mobile drawer labels, language switch aria labels.
2. **Product Cards**: "View Report", "Quick Compare", "Add to Basket", "Added", "Score Pending", "Verified Label", "Sample".
3. **Product Page Details**: "Ingredients (in descending weight order)", "Nutritional Declaration", "Per 100g", "Per Serve", "RDA Contribution", "Why this score?", "Isse Behtar Options", "Nutrition Per ₹10", "Report an issue".
4. **Compare Matrix**: "Select up to 4 items", "Differences Highlighted", "Winner on Protein", "Lower Added Sugar", "Clean Label Verdict".
5. **Scanner**: "Point camera at barcode", "Camera permission denied", "Enter barcode manually", "Product not found in WiseFoodies database yet".
6. **Smart Basket / Cart**: "Calorie-weighted average", "What's dragging your score down?", "Make this basket better", "Projected Basket FBS", "1-click apply swap".
7. **Food Diary**: "Daily Intake Log", "ICMR-NIN 2020 Reference", "Active Streak", "Copy yesterday's meals", "Portion selection".
8. **Issue Modal & Share Modal**: "Report wrong price or ingredients", "Download Instagram Story (1080x1350)", "Download Link Preview (1200x630)", "Copied link to clipboard".
9. **Chatbot (`ChatWindow.tsx`)**: "Ask WiseFoodies", "Ask anything about food labels...", "Chats aren't saved. Don't share personal details.", suggested prompts, typing indicator, offline fallback message.

---

## 3. Product Catalog Localization Architecture

### 3.1 Single Source of Truth Preservation
- `data/products.json` (1,130 products) is preserved completely intact.
- **Never translate or alter**:
  - `id`, `slug`, `barcode`
  - `name`, `brand` (Preserve authentic Indian packaging brand names, e.g., "Amul", "Britannia", "Tata Tea", "Haldiram's", "Nestlé")
  - `priceINR`, `packSizeG`, `servingSizeG`
  - All numbers in `per100g` (`energyKcal`, `proteinG`, `totalSugarG`, `addedSugarG`, `sodiumMg`, etc.)
  - `fbs.score`, `fbs.band` calculation logic
  - `nutritionPerPaisa` numerical values

### 3.2 Dynamic Localized Presentation Layer
We introduce `lib/productLocalization.ts` which dynamically translates:
1. **Category & Subcategory names**: (e.g., "Dairy & Frozen" -> "डेयरी और फ्रोजन" -> "ডেইরি ও ফ্রোজেন" -> "ഡയറിയും ഫ്രോസണും")
2. **Benefits & Concerns**: Parameterized template translation using localized sentence builders.
3. **FBS Factor reasons**: Translates standard breakdown factor explanations ("High in added sugar", "Excellent protein content", "Ultra-processed with >= 5 additives").
4. **Verification Status**: Complete, Incomplete, Extracted from label, Sample.
5. **Nutrition Metric Labels**: Calories, Protein, Total Sugar, Added Sugar, Saturated Fat, Trans Fat, Fibre, Sodium.

---

## 4. Chatbot Diagnostic & API Failure Resolution

### 4.1 Diagnosis
- Inspecting `.env.local` revealed a placeholder/test key (`GEMINI_API_KEY`) that returns `401 Unauthorized` when calling Google Generative AI endpoints.
- Previously, this caused the chat route (`/api/ai/chat`) to return a `500 Internal Server Error` with `{ error: 'Internal Server Error', details: '[401] API_KEY_INVALID' }`.
- In `ChatWindow.tsx`, any network or HTTP error showed: *"Sorry, I'm having trouble connecting to my brain. Please try again!"*.

### 4.2 Architectural Solution
1. **Never Show Raw Errors or 500s**: The server must catch 401, 429, 500, network offline, and missing key states.
2. **Deterministic Catalog-Grounded Offline Fallback**:
   - When the model is unavailable, the chatbot uses `lib/ai/retrieve.ts` and `lib/ai/tools.ts` to parse user queries deterministically.
   - For example:
     - Looking up a product ("Amul Gold Milk") -> retrieves exact catalog values and formats ProductCard + nutrition breakdown in the active language.
     - Comparing products ("Compare Maggi vs Yippee") -> computes difference deltas from catalog and renders comparison response.
     - Asking for recommendations ("High protein biscuits") -> filters catalog items and displays top 3 cards.
     - Asking about methodology ("What is FBS?") -> retrieves exact knowledge base chunk from `data/kb/how-fbs-works.md`.
     - Out of scope queries -> returns the exact refusal sentence in the selected language.
   - Includes a friendly non-intrusive indicator: *"Smart replies are temporarily limited."*
3. **Language Forwarding**: The chat request includes `{ locale }`. System prompts, offline fallback templates, suggestion chips, and refusal replies are all returned in the user's selected language.

---

## 5. Technical Implementation Roadmap

- **Phase 2**: Define `LOCALES` for all 22 Scheduled Languages + English in `lib/i18n.ts`, with script codes, writing directions (`ltr` vs `rtl`), native names, and English labels.
- **Phase 3**: Build `LanguageSelectorModal.tsx` / `LanguageSelector.tsx` with searchable popup, keyboard navigation, accessible ARIA attributes, and persistence in `localStorage` + cookie `wf_locale`.
- **Phase 4**: Expand `messages/{locale}.json` translation dictionary for all 23 languages. Build automated validation script `scripts/check-i18n.ts` supporting 100% parity across all locales.
- **Phase 5**: Create `lib/productLocalization.ts` for localized category names, nutrient labels, benefits, concerns, and verification tags.
- **Phase 6**: Create `data/glossary/nutrition-glossary.json` documenting consistent terminology across all 22 languages.
- **Phase 7**: Implement multilingual Gemini prompt, scope gate, and deterministic catalog offline fallback in `/api/ai/chat` and `ChatWindow.tsx`.
- **Phase 8**: Refactor translation lookup with strong typing, safe fallback to English for missing keys, and no raw key rendering.
- **Phase 9**: RTL styling in `globals.css` (`html[dir="rtl"]`), responsive testing across mobile (375px), tablet (768px), and desktop (1440px).
- **Phase 10**: Automated test suite (`test/i18n-comprehensive.test.ts`) validating all 23 locales, key parity, RTL handling, and numeric preservation.
- **Phase 11**: Documentation in `docs/I18N.md` and progress tracking in `PROGRESS.md`.
