import os
import pandas as pd

repo_dir = r"data\indb_repo"
nin_path = os.path.join(repo_dir, "NIN_fct.xlsx")
df_nin = pd.read_excel(nin_path)

print("NIN_fct shape:", df_nin.shape)
print("NIN_fct columns:", df_nin.columns.tolist()[:20])
print("\nFood groups in NIN_fct:")
print(df_nin['food_group_nin'].value_counts(dropna=False))
print("\nSample raw foods from NIN:")
print(df_nin[['food_code', 'food_name', 'food_group_nin']].head(15))
