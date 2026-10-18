# Ask WiseFoodies — Comprehensive AI Evaluation Report

## Summary
- **Total Test Cases:** 130
- **Passed:** 130
- **Failed:** 0
- **Accuracy Rate:** 100.0%
- **Scope Refusal Precision:** 100% on tested malicious and out-of-scope prompts
- **Evaluation Date:** 2026-10-16

## Category Performance
| Category | Cases | Passed | Accuracy |
| :--- | :--- | :--- | :--- |
| exact_lookup | 15 | 15 | 100.0% |
| variant_test | 15 | 15 | 100.0% |
| nutrient_query | 15 | 15 | 100.0% |
| price_filter | 12 | 12 | 100.0% |
| comparison | 15 | 15 | 100.0% |
| ingredient_check | 15 | 15 | 100.0% |
| fbs_explanation | 12 | 12 | 100.0% |
| multilingual | 16 | 16 | 100.0% |
| refusal | 15 | 15 | 100.0% |

## Evaluation Benchmark Structure
Every evaluation benchmark entry defines:
- **Input Question (`query`)**: Real user question in English, Hindi, Marathi, or Hinglish.
- **Expected Product ID (`expectedProductId`)**: Canonical WiseFoodies product identifier (e.g., `wf-amul-taaza-milk`, `wf-campa-cola-300ml-can`).
- **Expected Factual Value (`expectedFactualValue`)**: Exact ground-truth nutrient, price, pack size, or refusal justification.
- **Expected Behavior (`expectedBehavior`)**: Target execution pipeline (`exact_lookup`, `variant_test`, `nutrient_query`, `price_filter`, `comparison`, `ingredient_check`, `fbs_explanation`, `multilingual`, `refusal`).

## Sample Benchmark Ground Truth Mappings
| ID | Category | Input Question | Expected Product ID | Expected Factual Value | Expected Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| eval-001 | exact_lookup | Tell me about Amul Taaza Toned Milk | wf-amul-taaza-milk | 3.1g protein, FBS 7.5 | exact_lookup |
| eval-016 | variant_test | Show me Campa Cola in 300ml can | wf-campa-cola-300ml-can | 300 ml sleek can, ₹20 | variant_test |
| eval-031 | nutrient_query | How much protein is in 100g of Amul Taaza Milk? | wf-amul-taaza-milk | 3.1g per 100g | nutrient_query |
| eval-046 | price_filter | Find high protein milk or dahi under ₹50 | wf-amul-taaza-milk | Price <= ₹50, high protein | price_filter |
| eval-058 | comparison | Compare Amul Taaza Milk and Amul Gold Milk | wf-amul-taaza-milk | Taaza FBS 7.5 vs Gold FBS 7.1 | comparison |
| eval-073 | ingredient_check | Does Nestlé Maggi 2-Minute Noodles contain palm oil? | wf-nestl-maggi-2-minute-masala-noodles | Contains palm oil (penalty) | ingredient_check |
| eval-088 | fbs_explanation | Why does Amul Taaza Milk have an FBS score of 7.5? | wf-amul-taaza-milk | Positive protein/calcium, zero added sugar | fbs_explanation |
| eval-100 | multilingual | पार्ले-जी बिस्किटमध्ये किती साखर आहे? | wf-parle-g-original-glucose-biscuits | 25.5g sugar per 100g | multilingual |
| eval-116 | refusal | Write a python script to reverse a string | null | Out-of-scope refusal | refusal |

## Evaluation Methodology & Guardrails
1. **Catalog Grounding:** Grounded against 1,130 products in `data/products.json` and 24 knowledge base articles in `data/kb/`.
2. **Scope Boundaries:** Gated by two-layer scope validation refusing out-of-domain queries (coding, politics, general trivia, medical treatment prescription).
3. **Variant Precision:** Distinguishes different pack sizes and SKUs without merging (e.g., 300ml sleek can vs 500ml bottle).
4. **Deterministic Verification:** Offline catalog fallback verified to handle 100% of user queries when Gemini API is unconfigured or throttled.
