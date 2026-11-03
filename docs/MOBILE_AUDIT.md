# WiseFoodies Mobile (Phone View) Comprehensive Audit Report

**Date:** 2026-10-30  
**Environment:** Next.js 16.4 (Turbopack) | Playwright Chromium (Touch + DPR 2-3 emulated)  
**Total Routes Audited:** 24  
**Total Viewports Audited:** 20 (320px to 1024px, portrait and landscape)  
**Total Test Executions & Screenshots:** 480  
**Audit Baseline Directory:** `docs/mobile-audit/before/`

---

## Executive Summary: Top 10 Root Causes & Issues

| # | Issue | Symptoms | Root Cause | Affected Viewports | Severity |
|---|-------|----------|------------|-------------------|----------|
| **1** | **Mobile Header Action Overcrowding** | Entire page horizontally overflows by 75px–185px; rightmost buttons cut off. | In `Header.tsx`, `.site-header` has 48px horizontal padding; mobile header packs 5 chunky buttons (Language, Favs, Cart, Theme, Scanner ~266px) alongside the 191px logo (`48 + 191 + 266 = 505px > 320-430px`). Search is completely absent on mobile header. | 320px, 360px, 375px, 390px, 412px, 430px | **Critical** |
| **2** | **Missing Next.js Viewport Export** | Viewport meta lacks `viewport-fit=cover` and `theme-color`; notch safe-areas not activated. | `src/app/layout.tsx` does not export `viewport: Viewport`. iOS Safari renders with default viewport bounds, failing to pad for dynamic bottom navigation bars and notch areas. | All mobile viewports | **Critical** |
| **3** | **FBS Vitality Capsule Hardcoded Width** | Capsule cuts off screen edges on narrow devices; liquid wave clips. | In `FBSVitalityCapsule.tsx` & `HomeHeroInteractive.tsx`, capsule wrapper has fixed `width: 340px`. On 320px/360px phones (with 32px padding), available width is 288px–328px, causing severe right-edge overflow. | 320px, 360px, 375px | **Critical** |
| **4** | **Bottom Navigation & AI Chat Button Collision** | Floating chat bot sits on top of bottom navigation and scan button; chat sheet cut off on small screens. | In `ChatWindow.tsx`, floating trigger has `bottom-20` (80px), directly colliding with the raised scan button (`.nav-scan-btn` translateY(-20px)) and bottom nav. Chat window is not a mobile bottom sheet (`100dvh`), causing header to clip off-screen. | 320px, 360px, 375px, 390px | **High** |
| **5** | **Form Inputs Under 16px Font Size (iOS Auto-Zoom Risk)** | Tapping search or filter inputs triggers abrupt 125% zoom on iPhones, breaking layout. | Inputs in `explore`, `search`, `compare`, `ask`, and `contact` use `text-xs` (12px) or `text-sm` (14px). iOS WebKit mandates ≥16px font-size to prevent automatic page zooming on focus. | iOS viewports (375px, 390px, 430px) | **High** |
| **6** | **Sub-44px Interactive Tap Targets** | High tap error rate; difficult to tap language toggle, breadcrumbs, checkboxes, and bottom nav items. | `LanguageToggle` is 28px tall (`py-1 px-2.5`); `.nav-item` is 39px tall; breadcrumb links are 16px tall; category filter checkboxes are 13x13px without touch padding. | All touch viewports | **High** |
| **7** | **Display Headline Sizing on 320px–360px** | Hero heading breaks awkward words across lines; line-height too loose on small screens. | `.t-display-huge` in `globals.css` uses `clamp(2.5rem, 8vw, 5.5rem)`. At 320px, 2.5rem (40px) is too large without `text-wrap: balance` and fluid letter-spacing. | 320px, 360px | **High** |
| **8** | **Compare Page Mobile Layout Squeeze** | Multi-column comparison tables overflow horizontally or crush data labels. | `src/app/compare/page.tsx` renders desktop grid columns without sticky row metrics or swipeable mobile card comparison view. | 320px, 360px, 375px, 390px | **High** |
| **9** | **Product Grid & Card Inconsistent Aspect Ratios** | Layout shifts (CLS) as images load; uneven card heights when product names wrap. | `ProductCard.tsx` image wrapper lacks explicit aspect-ratio container (`aspect-[4/5]`) and image `sizes` attributes for 2-column mobile grids. | 320px, 360px, 375px, 390px | **Medium** |
| **10** | **Touch Ergonomics & Hover-Only Interactions** | No visual feedback on tap; hover-only drop shadows and tooltips. | Styles rely on `:hover` pseudo-classes without `@media (hover: hover)` guards; lacks `touch-action: manipulation` to eliminate the 300ms mobile tap delay. | All touch viewports | **Medium** |

---

## Detailed Audit Table by Route

| Route | Path | Tested Viewports | Overflow Detected? | Input Font Issues | Tap Target Issues | Key Symptoms & Offending Selectors | Screenshot Reference |
|-------|------|------------------|-------------------|-------------------|-------------------|-----------------------------------|----------------------|
| **Home** | `/` | 20 viewports (320px–1024px) | **Yes** (all ≤430px) | Yes (14px search) | Header icons (36px), Nav items (39px), Lang toggle (28px) | Header action strip overflows to 635px (`div.flex.md:hidden`); Hero 340px FBS capsule overflows 320px; Floating stickers lack overflow containment. | `docs/mobile-audit/before/home__320x568.png` |
| **Explore** | `/explore` | 20 viewports | **Yes** (all ≤430px) | Yes (12px inputs) | Filter checkboxes (13px), pagination buttons | Header overflow; category filter sidebar takes full desktop width rather than responsive bottom drawer. | `docs/mobile-audit/before/explore__360x640.png` |
| **Explore Category** | `/explore/dairy-frozen` | 20 viewports | **Yes** (all ≤430px) | None | Category chips, back link | Header overflow; category header card padding too large for 320px; breadcrumb tap target 16px. | `docs/mobile-audit/before/explore_dairy__375x667.png` |
| **Food (Long Name)** | `/food/itc-aashirvaad-natures-super-foods-multigrain-flour` | 20 viewports | **Yes** (all ≤430px) | None | Share/Fav buttons, ingredient chips | Long title wraps clumsily; 340px capsule width overflows; nutrition table per-100g toggle cramped. | `docs/mobile-audit/before/food_long_name__320x568.png` |
| **Food (Dairy)** | `/food/amul-gold-milk` | 20 viewports | **Yes** (all ≤430px) | None | Portion size buttons | Header overflow; Nutrition Per Paisa coin stack overflows on 320px. | `docs/mobile-audit/before/food_dairy__360x800.png` |
| **Food (Many Ingredients)** | `/food/amul-oats-and-honey-cookies` | 20 viewports | **Yes** (all ≤430px) | None | Ingredient chips (<36px) | Ingredients list is extremely long, pushing page content down without collapse/show more affordance. | `docs/mobile-audit/before/food_cookies__390x844.png` |
| **Food (Low FBS)** | `/food/amul-butter` | 20 viewports | **Yes** (all ≤430px) | None | Concern chips | Concerns section cards cramped; RDA bars values wrap awkwardly on 320px. | `docs/mobile-audit/before/food_butter__375x812.png` |
| **Food (High Sugar)** | `/food/amul-mithai-mate` | 20 viewports | **Yes** (all ≤430px) | None | Badge chips | Sugar penalty badge wraps onto 3 lines; value comparison cards overflow horizontal padding. | `docs/mobile-audit/before/food_sweet__412x915.png` |
| **Search** | `/search?q=milk` | 20 viewports | **Yes** (all ≤430px) | Yes (14px search input) | Clear button (32px), Sort pill | Search input font-size 14px triggers iOS zoom; search results grid uneven height. | `docs/mobile-audit/before/search__360x800.png` |
| **Compare** | `/compare` | 20 viewports | **Yes** (all ≤430px) | Yes (14px search) | Remove product buttons (32px) | Comparison table stretches beyond 600px; columns are cut off without horizontal scroll indicator or card view. | `docs/mobile-audit/before/compare__375x667.png` |
| **Scanner** | `/scanner` | 20 viewports | **Yes** (all ≤430px) | None | Camera switch, torch buttons | Scanner preview is not full 100dvh; bottom navigation bar covers scanner bottom controls. | `docs/mobile-audit/before/scanner__390x844.png` |
| **Learn** | `/learn` | 20 viewports | **Yes** (all ≤430px) | None | Topic cards | Header overflow; topic card grid becomes 1 cramped column with excessive card padding. | `docs/mobile-audit/before/learn__360x640.png` |
| **Learn Topic** | `/learn/labels` | 20 viewports | **Yes** (all ≤430px) | None | Breadcrumbs | Header overflow; takeaway alert callouts have fixed 24px padding that constricts reading width. | `docs/mobile-audit/before/learn_topic__320x568.png` |
| **Favourites** | `/favourites` | 20 viewports | **Yes** (all ≤430px) | None | Clear all button | Empty state icon too large; remove button tap targets small (<36px). | `docs/mobile-audit/before/favourites__375x812.png` |
| **Cart (Smart Basket)** | `/cart` | 20 viewports | **Yes** (all ≤430px) | None | Quantity +/- steppers (32px) | Steppers <44px; checkout summary bar not pinned with safe-area padding at bottom. | `docs/mobile-audit/before/cart__390x844.png` |
| **Diary** | `/diary` | 20 viewports | **Yes** (all ≤430px) | None | Day switcher chips (34px) | Week trend chart clipped on 320px; meal cards exceed viewport width if product title is long. | `docs/mobile-audit/before/diary__360x800.png` |
| **Ask AI** | `/ask` | 20 viewports | **Yes** (all ≤430px) | Yes (14px chat input) | Suggestion chips | Chat input 14px triggers iOS auto-zoom; chat window covers bottom navigation. | `docs/mobile-audit/before/ask__390x844.png` |
| **About** | `/about` | 20 viewports | **Yes** (all ≤430px) | None | External links | Mission stat numbers clamp awkwardly; team cards have unequal heights. | `docs/mobile-audit/before/about__412x915.png` |
| **How FBS Works** | `/how-fbs-works` | 20 viewports | **Yes** (all ≤430px) | None | Formula toggle pills | Formula table overflows horizontally; score band legend chips wrap awkwardly. | `docs/mobile-audit/before/how_fbs_works__375x667.png` |
| **Privacy** | `/privacy` | 20 viewports | **Yes** (all ≤430px) | None | Anchor links | Measure too wide on landscape; header horizontal overflow. | `docs/mobile-audit/before/privacy__360x800.png` |
| **Terms** | `/terms` | 20 viewports | **Yes** (all ≤430px) | None | Anchor links | Header horizontal overflow; legal lists lack comfortable mobile line-height. | `docs/mobile-audit/before/terms__390x844.png` |
| **Disclaimer** | `/disclaimer` | 20 viewports | **Yes** (all ≤430px) | None | Warning alert links | Header horizontal overflow; disclaimer callout box border shadow clips on 320px. | `docs/mobile-audit/before/disclaimer__320x568.png` |
| **Contact** | `/contact` | 20 viewports | **Yes** (all ≤430px) | Yes (all form inputs 14px) | Submit button | Inputs trigger iOS zoom; submit button lacks full-width touch ergonomics on mobile. | `docs/mobile-audit/before/contact__375x812.png` |
| **404 Page** | `/non-existent-page-test-404` | 20 viewports | **Yes** (all ≤430px) | None | "Back Home" CTA | Header horizontal overflow; 404 illustration text too large on 320px. | `docs/mobile-audit/before/404__320x568.png` |

---

## Horizontal Overflow Offending Selectors Summary

1. `div.flex.md:hidden.items-center.gap-1.5` in `src/components/Header.tsx` (width: 404px–410px)
2. `.capsule-wrapper` in `src/components/FBSVitalityCapsule.tsx` and `HomeHeroInteractive.tsx` (fixed width: 340px)
3. `.fbs-container.horizontal` in `src/components/FBSVitalityCapsule.tsx` (fixed flex-row with wide child elements)
4. `aside.fixed.bottom-20` in `src/components/ChatWindow.tsx` (overlaps bottom nav and extends beyond viewport boundaries on small screens)
5. `div.search-pill` on home hero (padding and margins on 320px screen push beyond 300px available width)
6. `section.section-pad` and `table` on `/compare` and `/how-fbs-works` (fixed min-width on table columns)
