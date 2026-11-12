import pandas as pd

df_srv = pd.read_excel('data/indb_repo/recipes_servingsize.xlsx')
print("recipes_servingsize columns:", df_srv.columns.tolist())
print("Sample rows:")
print(df_srv[['recipe_code', 'recipe_name', 'no_of_servings', 'size_of_servings', 'servings_unit']].head(10))
print("\nUnique serving units:")
print(df_srv['servings_unit'].value_counts())
