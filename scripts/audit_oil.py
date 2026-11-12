import os
import pandas as pd

repo_dir = r"data\indb_repo"
recipes_path = os.path.join(repo_dir, "recipes.xlsx")
df_recipes = pd.read_excel(recipes_path)

print("recipes.xlsx shape:", df_recipes.shape)
print("recipes.xlsx columns:", df_recipes.columns.tolist())

# Check for oil / ghee / butter in ingredients
oil_keywords = ['oil', 'ghee', 'butter', 'vanaspati', 'lard', 'fat', 'margarine']
pattern = '|'.join(oil_keywords)

oil_ingredients = df_recipes[df_recipes['food_name'].str.contains(pattern, case=False, na=False) |
                             df_recipes['ingredient_name_org'].str.contains(pattern, case=False, na=False)]

print(f"\nTotal ingredient rows mentioning oil/ghee/butter/fat: {len(oil_ingredients)}")
print("Unique oil/fat ingredients:", oil_ingredients['food_name'].dropna().unique()[:25])
print("\nUnique recipe codes with oil/fat ingredients:", oil_ingredients['recipe_code'].nunique())

# Check sample recipe with oil
sample_code = oil_ingredients['recipe_code'].iloc[0]
sample_rows = df_recipes[df_recipes['recipe_code'] == sample_code]
print(f"\nSample Recipe ({sample_code}):")
print(sample_rows[['recipe_name', 'ingredient_name_org', 'amount_org', 'unit_org', 'amount', 'unit', 'food_name']])
