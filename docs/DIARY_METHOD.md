# WiseFoodies Food Diary Methodology & Nutritional Reference System

## 1. Ethical Guardrails & Health Principles
WiseFoodies' Food Diary ("Aaj maine kya khaya") adheres strictly to ethical, non-judgmental, and evidence-grounded health principles:
- **No Medical Advice:** All calculations and displays represent voluntary nutritional contributions against published population references, never individualized medical targets or clinical prescriptions.
- **No Restrictive Dieting or Weight Targets:** WiseFoodies strictly excludes calorie deficits, target weights, BMI calculations, or weight-loss framing.
- **No Eating Disorder Triggers or Shaming:** Language is neutral, encouraging, and informative. If a user logs extreme or atypical consumption patterns, the system does not shame, scold, or diagnose.
- **Local-First Privacy:** All diary entries and preferences reside exclusively on the user's device (`localStorage`). No health conditions, medications, or sensitive attributes are requested or stored.

---

## 2. Reference Values (ICMR-NIN 2020 RDA Standards)
Nutrient percentages are calibrated against the **Indian Council of Medical Research – National Institute of Nutrition (ICMR-NIN)** Recommended Dietary Allowances (RDA) 2020 guidelines for sedentary-to-moderate Indian adults (standard 65 kg reference adult):

| Nutrient | Standard Reference Value | Framing | Source Basis |
| :--- | :--- | :--- | :--- |
| **Energy** | 2000 kcal | Reference benchmark | ICMR-NIN 2020 adult baseline |
| **Protein** | 54 g | Recommended target | ~0.83 g/kg body weight standard |
| **Added Sugar** | 25 g | Upper reference limit | WHO & ICMR guideline (<5-10% of energy) |
| **Dietary Fibre** | 30 g | Recommended target | ICMR daily adult intake recommendation |
| **Sodium** | 2000 mg | Upper reference limit | WHO / ICMR upper intake level |
| **Saturated Fat**| 20 g | Upper reference limit | ~8-10% of total energy |
| **Total Fat** | 65 g | Reference benchmark | 25-30% of total energy |

---

## 3. Simple Goals Adaptations
Users can adjust reference targets to match their non-clinical lifestyle preferences:

1. **Balanced (Default):** Uses the standard ICMR-NIN adult reference targets listed above.
2. **More Protein:** Increases the protein display reference from 54 g to **75 g** (~1.15 g/kg for active lifestyles), keeping other targets at baseline.
3. **Less Sugar:** Tightens the added sugar upper reference limit from 25 g to **20 g**, encouraging lower-glycemic and whole-food choices.
4. **Less Sodium:** Lowers the daily sodium upper reference limit from 2000 mg to **1500 mg**, useful for users conscious of packaged salt intake.

---

## 4. Handling Incomplete Data ("At Least" Rule)
In packaged food retailing, many brands omit certain voluntary disclosures (such as soluble fibre or separated added sugars).
- **Rule:** WiseFoodies **never invents or hallucinates missing nutrients**.
- When any logged item lacks data for a nutrient, the displayed total is explicitly flagged with:
  `≥ [Value] (missing on N items)`
  and an informational notice clarifies that the actual intake is **at least** the recorded quantity.

---

## 5. CSV Export & Local Data Ownership
Users maintain 100% control over their food history. A one-click **Export CSV** feature produces an unencrypted, standardized CSV containing timestamped food entries, serving weights, and calculated macronutrient breakdowns for personal record-keeping or nutritionist review.
