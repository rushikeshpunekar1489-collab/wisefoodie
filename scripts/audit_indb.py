import os
import pandas as pd
import json

local_wb = r"C:\Users\ACER\Downloads\Anuvaad_INDB_2024.11.xlsx"
repo_dir = r"data\indb_repo"

print("==================================================")
print("AUDIT: LOCAL EXCEL WORKBOOK")
print("==================================================")
if os.path.exists(local_wb):
    xl_local = pd.ExcelFile(local_wb)
    print("Sheets in Anuvaad_INDB_2024.11.xlsx:", xl_local.sheet_names)
    for s in xl_local.sheet_names:
        df = xl_local.parse(s)
        print(f"Sheet '{s}': {df.shape[0]} rows, {df.shape[1]} columns")
        print("Columns:", df.columns.tolist())
        print("Data types summary:")
        print(df.dtypes.value_counts())
        print("\nPrimary sources:")
        print(df['primarysource'].value_counts(dropna=False))
        print("\nNull values in top 15 columns:")
        print(df.iloc[:, :15].isnull().sum())
        print("\nDuplicates in food_code:", df['food_code'].duplicated().sum())
        print("Duplicates in food_name:", df['food_name'].str.strip().str.lower().duplicated().sum())
else:
    print("Local workbook NOT FOUND at", local_wb)

print("\n==================================================")
print("AUDIT: GITHUB REPO DATASETS")
print("==================================================")
repo_files = ['NIN_fct.xlsx', 'UK_fct.xlsx', 'US_fct.xlsx', 'recipes.xlsx', 'recipes_names.xlsx', 'recipes_servingsize.xlsx', 'Units.xlsx']

for rf in repo_files:
    fp = os.path.join(repo_dir, rf)
    if os.path.exists(fp):
        print(f"\n--- File: {rf} ---")
        try:
            xl = pd.ExcelFile(fp)
            print("Sheets:", xl.sheet_names)
            for s in xl.sheet_names:
                df = xl.parse(s)
                print(f"  Sheet '{s}': {df.shape[0]} rows, {df.shape[1]} columns")
                print(f"  Columns: {df.columns.tolist()[:12]}")
                if rf == 'recipes.xlsx':
                    print("  recipes.xlsx sample rows:")
                    print(df.head(3))
                elif rf == 'recipes_servingsize.xlsx':
                    print("  recipes_servingsize.xlsx sample rows:")
                    print(df.head(3))
        except Exception as e:
            print("  Error reading:", e)

