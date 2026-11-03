# Master Website Bug & Improvement List
Generated: 2026-11-04 | Status: All Identified Issues Resolved & Verified

---

## Bug Tracking Summary Table

| Bug ID | Page / Component | Severity | Description | Status | Verification Proof |
|---|---|---|---|---|---|
| **BUG-001** | `src/app/search/SearchClient.tsx` | **P2 (Medium)** | Multi-catalog search gap: Searching on `/search` only queried the legacy 40-item catalog, excluding matching products from the 852 Indian Packaged Food dataset. | **FIXED** | Verified via live API and UI query: Returns both Indian Packaged Food items with `IndianFoodCard` and curated FBS scorecards with badges and match reasons. |
| **BUG-002** | `src/app/scanner/ScannerClient.tsx` | **P2 (Medium)** | Barcode / SKU scanner gap: Manual lookup in scanner only checked legacy catalog; Indian packaged food codes/names showed "Product Not in Database". | **FIXED** | Added fallback query to `/api/products/search?q=...`. Indian packaged food items render with full nutritional tags and link to `/products/[id]`. |
| **BUG-003** | `src/app/api/report-issue/route.ts` | **P2 (Medium)** | Rigid payload validation: Endpoint returned 400 if `productId` was not provided or if user passed `description` instead of `details`. | **FIXED** | Updated handler to default `productId = body.productId || 'general'` and accept `body.details || body.description`. Verified HTTP 200 on valid submissions and HTTP 400 on empty details. |
| **BUG-004** | `src/app/explore/ExploreClient.tsx` | **P3 (Low)** | User discovery: `/explore` had no visual banner directing users to the newly added 852 Indian Packaged Food Catalog (`/products`). | **FIXED** | Added an eye-catching gradient banner featuring "852 Products Dataset &bull; 262 Brands &bull; 13 Categories" linking directly to `/products`. |
| **BUG-005** | `src/app/compare/CompareClient.tsx` | **P3 (Low)** | Comparison matrix integration: `/compare` page default product picker only listed legacy items, missing search filtering and direct Indian foods linkage. | **FIXED** | Added live search input in product selector bottom sheet modal + Indian Packaged Food comparison referral banner. |
| **BUG-006** | `src/app/layout.tsx` | **P3 (Low)** | React hydration attribute mismatch: Client inline script set `dir="ltr"` causing console warning `server rendered HTML didn't match client properties`. | **FIXED** | Added `dir="ltr"` and `suppressHydrationWarning` to `<html ...>` in root layout. |
| **BUG-007** | `src/components/WeekTrendChart.tsx` & `useDiary.ts` | **P1 (High)** | Runtime `RangeError: Invalid time value` in `d.toISOString()` when `currentDate` / `selectedDate` was uninitialized (`""`) or invalid during SSR and initial hydration. | **FIXED** | Implemented `toSafeDateString()` utility in `lib/diary.ts` with local `YYYY-MM-DD` formatting; updated `WeekTrendChart`, `useDiary`, and `DiaryClient` to safely handle empty/invalid dates. Verified via Playwright and Vitest. |

---

## Detailed Bug Breakdown & Fix Records

### BUG-001: Multi-Catalog Search Unified Integration
- **Root Cause:** `SearchClient.tsx` called only `searchProducts(query)` which references the static 40-item curated FBS catalog in `lib/products.ts`.
- **Fix Applied:** Added concurrent asynchronous fetch to `/api/products/search?q=${encodeURIComponent(query)}&limit=12`. Rendered results in dedicated sections with count pills:
  1. Indian Packaged Food Database (852 items) rendered with `IndianFoodCard`.
  2. Curated Food Benefit Scorecards rendered with `ProductCard` and match reasoning badges.
- **Verification:** Tested with query "biscuit", "Amul", "high protein" returning rich cards from both catalogs.

### BUG-002: Scanner Barcode & SKU Lookup Fallback
- **Root Cause:** `handleBarcodeSearch` in `ScannerClient.tsx` only matched against `allProducts` (legacy array).
- **Fix Applied:** Integrated fallback search to `/api/products/search?q=${trimmed}&limit=1` when no legacy product matches. Renders `IndianFoodCard` dynamically with one-click navigation to `/products/[id]`.
- **Verification:** Searching Indian food codes or names returns the matched item with nutritional attributes.

### BUG-003: Report Issue API Payload Tolerance
- **Root Cause:** Strict object validation required `productId` even for general feedback, and required strictly `details` instead of accepting common field synonym `description`.
- **Fix Applied:** In `src/app/api/report-issue/route.ts`, relaxed fields:
  ```ts
  const productId = body.productId ? String(body.productId).trim() : 'general';
  const details = (body.details || body.description || '').trim();
  ```
- **Verification:** Node test script executed:
  - Empty submission -> 400 Bad Request (`details required`).
  - General report without productId -> 200 OK (`reportId` returned).

### BUG-004: Explore Page Cross-Discovery Banner
- **Root Cause:** The `/explore` route cataloged the initial curated database without navigational context for the newly integrated 852 Indian Packaged Food database.
- **Fix Applied:** Added a responsive banner above the quick filter chips highlighting the 852 Indian Packaged Food catalog with 25 fields and 262 brands, linking to `/products`.
- **Verification:** Verified at mobile (360px), tablet (768px), and desktop (1280px).

### BUG-005: Compare Modal Search & Cross-Catalog Referral
- **Root Cause:** The compare selector bottom sheet listed 94 products without a filter input, making selection tedious on small screens, and lacked a bridge to compare the 852 Indian products.
- **Fix Applied:** Added real-time text filter to the product picker bottom sheet and a referral badge to `/products`.
- **Verification:** Verified instant name/brand filtering and navigation link.

### BUG-006: Root Layout Hydration Attribute Synchronization
- **Root Cause:** Inline script executed before React hydration set `dir="ltr"` and `data-theme="light"`, causing React to log attribute mismatch warnings.
- **Fix Applied:** Declared `dir="ltr"` statically on `<html>` and added `suppressHydrationWarning`.
- **Verification:** Hydration mismatch warning eliminated from browser console logs.
