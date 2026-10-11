# WiseFoodies Nutritional Data Discrepancy & Conflict Log

### Policy on Discrepancies
When quick-commerce listings (e.g. Blinkit, Zepto, Swiggy Instamart) differ from manufacturer physical packaging declarations, WiseFoodies **strictly prefers the physical packaging declaration**.

### Recorded Nuances & Resolutions

1. **Salt vs. Sodium Conversion on Instant Noodles & Soups**
   - *Observation:* Some Indian e-commerce listings state 'Salt 2.5g' while official back-of-pack states 'Sodium 1000mg'.
   - *Resolution:* Grounded in official FSSAI sodium formula: $Sodium (mg) = Salt (g) \times 400$.

2. **Added Sugars vs. Total Carbohydrates in Juices & Dairy**
   - *Observation:* Cold-pressed fruit juices contain naturally occurring fruit fructose without added cane sugar.
   - *Resolution:* Kept `addedSugarG: 0` while tracking `totalSugarG` accurately.

3. **Atta vs. Maida Blend Nuance in Noodles**
   - *Observation:* Front-of-pack claims 'Atta Noodles', but ingredients reveal refined wheat flour blend.
   - *Resolution:* Transparently recorded true ingredient list and factored into Ultra-Processing score.
