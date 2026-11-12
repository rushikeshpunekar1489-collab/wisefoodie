import re

def clean(s):
    if not s: return ''
    s = s.lower()
    s = re.sub(r'[\'\"®™©\(\)\-\_\,\.\:\;\/\&\+\*\#\!]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

p_name = clean('Britannia Treat Jimjam Cream Biscuits')
fn_clean = clean('britannia-50-50-maska-chaska-cream')

print("p_name:", p_name)
print("fn_clean:", fn_clean)
print("'50 50' in fn_clean:", '50 50' in fn_clean)
print("'50 50' not in p_name and '50 50' in fn_clean:", '50 50' not in p_name and '50 50' in fn_clean)
