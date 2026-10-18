---
id: faq
title: Frequently Asked Questions (FAQ)
domain: website_knowledge
topics: [faq, questions, help, fbs, scanner, compare, value, cart, diary, errors]
lastUpdated: "2026-10-16"
---

# Frequently Asked Questions (50+ Common Queries)

### General Platform Questions
1. **What is WiseFoodies?**
   WiseFoodies is an independent Indian packaged food intelligence platform that decodes nutrition labels, calculates Food Benefit Scores (FBS), and computes economic value metrics (Nutrition Per Paisa) across 1,130+ packaged products.
2. **Is WiseFoodies free to use?**
   Yes, 100% free and open to everyone without any subscription or paywall.
3. **Does WiseFoodies sell food or take brand sponsorships?**
   No. WiseFoodies does not sell products, accept paid endorsements, or alter scores for commercial sponsorship.
4. **Is WiseFoodies medical advice?**
   No. FBS and our reports are purely informational educational tools based on label disclosures, never medical advice.
5. **How many products are in the WiseFoodies catalog?**
   Over 1,130 verified commercial packaged food products across 16 major Indian categories.
6. **How often is the product data updated?**
   Data is updated continually as new products hit retail shelves or when community issue reports trigger re-audits.
7. **Is my Food Diary or Cart stored on your servers?**
   No. Your Food Diary, Favourites, and Cart are saved locally on your device's browser (`localStorage`) for 100% privacy.
8. **What languages does WiseFoodies support?**
   English, Hindi (हिंदी), and Marathi (मराठी) across the interface and AI assistant.
9. **Can I use WiseFoodies offline?**
   Yes, the website functions as a local-first application and our offline assistant answers catalog queries even without internet.
10. **Who created WiseFoodies?**
    An independent team of food researchers, technologists, and public health advocates dedicated to label transparency in India.

### Food Benefit Score (FBS) Questions
11. **What is the Food Benefit Score (FBS)?**
    An algorithmic score on a 1.0 to 10.0 scale reflecting overall nutritional quality, protein, fibre, sugar, sodium, trans fat, and processing level.
12. **What is the base starting score for FBS?**
    Every packaged food starts at a baseline score of 6.0 points before nutritional additions and deductions.
13. **What is the maximum and minimum possible score?**
    Scores are strictly clamped between a minimum of 1.0 and a maximum of 10.0.
14. **What do the FBS score bands mean?**
    Excellent (9.0–10.0), Very Good (8.0–8.9), Good (7.0–7.9), Moderate (5.0–6.9), Limited (3.0–4.9), and Poor (1.0–2.9).
15. **How does protein affect the score?**
    Adds up to +1.5 points linearly for up to 15g protein per 100g.
16. **How does dietary fibre affect the score?**
    Adds up to +1.5 points linearly for up to 6g dietary fibre per 100g.
17. **How does sugar penalize the score?**
    Deducts up to -1.5 points linearly for up to 20g of added or total sugar per 100g.
18. **How does sodium affect the score?**
    Deducts up to -1.0 point up to 800mg sodium, with an extra penalty up to -0.5 point for sodium exceeding 800mg (total -1.5 max).
19. **How does saturated fat affect the score?**
    Deducts up to -1.0 point linearly for up to 10g saturated fat per 100g.
20. **Is there a penalty for trans fat?**
    Yes, any product containing over 0.2g trans fat per 100g incurs an automatic -0.5 point deduction.
21. **What is the penalty for industrial additives?**
    Foods with 5 or more flagged industrial additives (emulsifiers, synthetic colours, artificial flavours) receive a -0.7 point penalty.
22. **What is the sugary beverage penalty?**
    Liquid drinks containing 8g or more sugar with less than 0.5g protein and 0.2g fibre receive a -2.5 point penalty.
23. **Why is a product's FBS score marked as 'Pending'?**
    When a brand fails to declare one of the 5 mandatory nutrients (Energy, Protein, Sugar, Fat, Sodium), the score is held as Pending rather than estimated.
24. **Does a high FBS mean I can eat unlimited amounts?**
    No. Portion control and balanced whole meals are always essential.
25. **Can two products with the same calories have very different FBS scores?**
    Yes. A 400 kcal oats pouch rich in fibre and protein can score 8.5, while a 400 kcal pack of fried maida chips can score 3.2.

### Nutrition Per Paisa Questions
26. **What is Nutrition Per Paisa?**
    An economic value metric calculating the exact grams of protein and fibre delivered per rupee spent.
27. **What is 'Protein Per Rupee'?**
    Total grams of protein in the entire package divided by the retail price (MRP).
28. **What does 'What you get for ₹10' mean?**
    A tangible calculation showing how many grams of food, calories, protein, and fibre you receive for a ₹10 coin.
29. **Why is price or value missing for some products?**
    When a product is sold in loose institutional formats or when current retail MRP is undergoing verification, value is marked unavailable.
30. **Is a higher Nutrition Per Paisa always healthier?**
    No. A sugary peanut brittle or oily snack might offer cheap protein, but also excessive sugar and fat. Always consider FBS and Nutrition Per Paisa together.

### Comparison Tool Questions
31. **How many products can I compare at once?**
    Between 2 and 4 products side-by-side on `/compare`.
32. **Can I compare products from different categories?**
    Yes, but the system will alert you that cross-category foods serve different dietary roles.
33. **How does the comparison verdict work?**
    It neutrally highlights which product has more protein, lower sugar, less sodium, fewer additives, or superior value per rupee.
34. **Can I add compared products directly to my cart?**
    Yes, each product card in the comparison matrix has an "Add to Cart" button.

### Barcode & Scanner Questions
35. **Is the scanner live and functional on mobile?**
    Yes. The scanner (`/scanner`) accesses your device camera in real time to read barcodes and labels.
36. **What camera permissions are needed?**
    Standard browser video permission (`facingMode: environment`). No photos are stored on our servers.
37. **Can I scan products without a barcode?**
    Yes, you can upload packaging front-of-pack images or type product names manually.
38. **Why didn't my barcode scan properly?**
    Packaging glare, curved cans, wrinkled pouches, or low lighting can interfere with scanning. Tilt the pack 15 degrees away from light.
39. **What if my scanned product is not in the database?**
    Tap "Report Missing Product" directly from the scanner screen to submit it for our next catalog update.

### Smart Cart and Basket Questions
40. **What is Basket FBS?**
    A calorie-weighted average Food Benefit Score representing the overall nutritional quality of your combined grocery cart.
41. **What are Smart Swaps?**
    Automated recommendations suggesting healthier alternatives in the same category that elevate your overall basket FBS.
42. **Does the cart calculate total price and calories?**
    Yes, along with total protein, added sugar, sodium, and macro contribution percentages.
43. **Can I export my cart?**
    Yes, you can share or review your basket summary anytime.

### Food Diary Questions
44. **What is the Food Diary feature?**
    A daily intake logger (`/diary`) comparing what you eat against ICMR-NIN Indian adult daily reference values.
45. **What reference values are used in the diary?**
    The official 2020 ICMR-NIN guidelines (2000 kcal, 54g protein, max 25g added sugar, max 2000mg sodium, 30g fibre).
46. **Is my food log confidential?**
    100% confidential. Your food diary entries are stored exclusively in your browser's local storage and never transmitted to our servers.
47. **Can I export my Food Diary to CSV?**
    Yes, tap the "Export CSV" button in `/diary` to download your complete history.

### AI Assistant & Community Questions
48. **What is Ask WiseFoodies?**
    An on-demand AI assistant grounded directly in our catalog and knowledge base to answer questions about products, ingredients, scores, and site tools.
49. **Can the AI assistant give me a medical diet plan?**
    No. The assistant strictly provides label facts, nutritional calculations, and platform guidance, refusing medical diagnosis or treatment requests.
50. **What happens if I ask an off-topic question to the chatbot?**
    The assistant politely replies: "Sorry, I can't assist you with that." and steers back to food and nutrition.
51. **How do I report incorrect product information?**
    Click "Report an issue" on any product page, select the mismatch type, and submit a correction for our audit team.
52. **How can brands verify or update their product information?**
    Brands can submit official packaging artwork, lab reports, and FSSAI filings through our verification queue for expedited review.
