import pandas as pd

df_recipes = pd.read_excel('data/indb_repo/recipes.xlsx')
df_srv = pd.read_excel('data/indb_repo/recipes_servingsize.xlsx')

# Inspect unique units in recipes
print("Units in recipes.xlsx:")
print(df_recipes['unit'].value_counts())

# Specifically for oil/fat items:
oil_pattern = 'oil|ghee|butter|vanaspati|margarine|fat'
oil_rows = df_recipes[df_recipes['food_name'].str.contains(oil_pattern, case=False, na=False) |
                      df_recipes['ingredient_name_org'].str.contains(oil_pattern, case=False, na=False)]

# Exclude non-cooking fats if any (like peanut butter or stock cubes if caught)
pure_oils = oil_rows[~oil_rows['food_name'].str.contains('peanut butter|egg|chicken|lamb|beansprouts|rice|potato|water|foil|stock|sugar|cream|milk|sweetcorn', case=False, na=False)]

print("\nPure cooking oil/fat ingredients:")
print(pure_oils['food_name'].value_counts())
print("\nUnits used for pure oils:")
print(pure_oils['unit'].value_counts())

# Check conversion: tsp = 5g/ml, tbsp = 15g/ml, g = 1g, ml = 0.92g or ~1g
# Check if amounts are already converted in 'amount' column
print("\nSample pure oil rows (comparing amount_org, unit_org vs amount, unit):")
print(pure_oils[['recipe_code', 'recipe_name', 'food_name', 'amount_org', 'unit_org', 'amount', 'unit']].head(15))
