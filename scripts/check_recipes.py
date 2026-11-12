import pandas as pd

df = pd.read_excel(r'C:\Users\ACER\Downloads\Anuvaad_INDB_2024.11.xlsx')
terms = ['aloo', 'gobi', 'paneer', 'palak', 'dal', 'rajma', 'chole', 'chana', 'poha', 'upma', 'idli', 'dosa', 'roti', 'chapati', 'bhindi', 'baingan', 'pulao', 'khichdi', 'sambar', 'biryani', 'halwa', 'ladoo', 'paratha', 'curry']

print(f"Total rows in Anuvaad_INDB: {len(df)}")
for t in terms:
    matches = df[df['food_name'].str.contains(t, case=False, na=False)]
    example = matches['food_name'].iloc[0] if len(matches) > 0 else "NONE"
    print(f"Term: '{t:10}' -> {len(matches):2} matches | Sample: {example}")

print("\n--- Check Palak Paneer specifically ---")
pp = df[df['food_name'].str.contains('palak|paneer', case=False, na=False)]
print(pp[['food_code', 'food_name']].to_string())

print("\n--- Check Aloo Gobi specifically ---")
ag = df[df['food_name'].str.contains('aloo|gobi|potato|cauliflower', case=False, na=False)]
print(ag[['food_code', 'food_name']].head(15).to_string())
