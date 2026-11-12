import json
import re

# Load compiled DB
with open('data/indian_nutrition_db.json', 'r', encoding='utf-8') as f:
    foods = json.load(f)

# Comprehensive Multilingual Term Map (English, Hindi, Marathi, Transliterations, Synonyms)
# Key = canonical concept, Value = list of alias strings
CONCEPT_MAP = {
    'potato': ['potato', 'aloo', 'aalu', 'alu', 'batata', 'batate', 'आलू', 'बटाटा', 'बटाटे', 'आलु'],
    'cauliflower': ['cauliflower', 'gobi', 'gobhi', 'phool gobi', 'phoolgobhi', 'flower', 'फूलगोभी', 'गोभी', 'फूल गोभी'],
    'cabbage': ['cabbage', 'patta gobi', 'pattagobhi', 'bandhgobi', 'kobi', 'पत्ता गोभी', 'पत्तागोभी', 'कोबी', 'बंदगोभी'],
    'okra': ['okra', 'bhindi', 'bhendi', 'lady finger', 'ladyfinger', 'भिंडी', 'भेंडी'],
    'eggplant': ['eggplant', 'brinjal', 'aubergine', 'baingan', 'vangi', 'vange', 'baigan', 'बैंगन', 'वांगी', 'वांगे', 'बैंगण'],
    'spinach': ['spinach', 'palak', 'पालक'],
    'fenugreek': ['fenugreek', 'methi', 'मेथी'],
    'peas': ['peas', 'green peas', 'matar', 'muttar', 'mutter', 'watana', 'मटर', 'वाटाणा'],
    'paneer': ['paneer', 'panir', 'cottage cheese', 'पनीर'],
    'lentil': ['lentil', 'lentils', 'dal', 'daal', 'dhal', 'दाल', 'डाळ'],
    'chickpea': ['chickpea', 'chickpeas', 'chana', 'channa', 'chole', 'chhole', 'bengal gram', 'harbhara', 'चना', 'छोले', 'हरभरा'],
    'kidney beans': ['kidney beans', 'red kidney beans', 'rajma', 'rajmah', 'राजमा'],
    'black gram': ['black gram', 'urad', 'udad', 'mash dal', 'उड़द', 'उडद'],
    'green gram': ['green gram', 'moong', 'mung', 'mug dal', 'मूंग', 'मूग'],
    'pigeon pea': ['pigeon pea', 'toor', 'tur', 'arhar', 'tuvar', 'तूर', 'अरहर'],
    'rice': ['rice', 'chawal', 'bhat', 'tandool', 'chaawal', 'चावल', 'भात', 'तांदूळ'],
    'poha': ['poha', 'pohe', 'chivda', 'chirwa', 'aval', 'flattened rice', 'beaten rice', 'पोहा', 'पोहे'],
    'wheat': ['wheat', 'gehu', 'gavhu', 'गेहूं', 'गहू'],
    'flour': ['flour', 'atta', 'aata', 'whole wheat flour', 'आटा'],
    'refined flour': ['refined flour', 'maida', 'मैदा'],
    'gram flour': ['gram flour', 'besan', 'chickpea flour', 'बेसन'],
    'semolina': ['semolina', 'suji', 'sooji', 'rava', 'सूजी', 'रवा'],
    'millet': ['millet', 'millets', 'ragi', 'nachni', 'jowar', 'bajra', 'बाजरा', 'रागी', 'नाचणी', 'ज्वार'],
    'bread': ['bread', 'roti', 'chapati', 'chapathi', 'phulka', 'poli', 'रोटी', 'चपाती', 'फुलका', 'पोळी'],
    'paratha': ['paratha', 'parantha', 'parotta', 'पराठा'],
    'puri': ['puri', 'poori', 'पूरी'],
    'upma': ['upma', 'uppittu', 'sanja', 'उपमा'],
    'idli': ['idli', 'iddli', 'idly', 'इडली'],
    'dosa': ['dosa', 'dosai', 'dhosa', 'डोसा'],
    'khichdi': ['khichdi', 'khichri', 'khichadi', 'pongal', 'खिचड़ी', 'खिचडी'],
    'pulao': ['pulao', 'pilaf', 'pulav', 'पुलाव'],
    'biryani': ['biryani', 'biriyani', 'बिरयानी'],
    'sambar': ['sambar', 'sambhar', 'सांभर'],
    'curry': ['curry', 'sabzi', 'sabji', 'bhaji', 'tarkari', 'सब्जी', 'भाजी', 'करी'],
    'tea': ['tea', 'chai', 'garam chai', 'चाय'],
    'coffee': ['coffee', 'kaapi', 'कॉफ़ी', 'कॉफी'],
    'milk': ['milk', 'doodh', 'dudh', 'दूध'],
    'curd': ['curd', 'yogurt', 'dahi', 'दही'],
    'buttermilk': ['buttermilk', 'chhaas', 'chaas', 'lassi', 'taak', 'mattha', 'छाछ', 'लस्सी', 'ताक'],
    'butter': ['butter', 'makkhan', 'makhan', 'loni', 'मक्खन', 'लोणी'],
    'ghee': ['ghee', 'desi ghee', 'clarified butter', 'घी', 'तूप'],
    'oil': ['oil', 'tel', 'tail', 'तेल', 'तेल'],
    'sugar': ['sugar', 'cheeni', 'shakar', 'sakhar', 'चीनी', 'साखर'],
    'jaggery': ['jaggery', 'gud', 'gul', 'गुड़', 'गूळ'],
    'onion': ['onion', 'pyaz', 'pyaaz', 'kanda', 'प्याज', 'कांदा'],
    'garlic': ['garlic', 'lehsun', 'lasun', 'लहसुन', 'लसूण'],
    'ginger': ['ginger', 'adrak', 'ale', 'अदरक', 'आले'],
    'tomato': ['tomato', 'tamatar', 'tameta', 'टमाटर', 'टोमॅटो'],
    'coriander': ['coriander', 'dhaniya', 'kothmir', 'धनिया', 'कोथिंबीर'],
    'cumin': ['cumin', 'jeera', 'zeera', 'जिरं', 'जीरा'],
    'turmeric': ['turmeric', 'haldi', 'हल्दी', 'हळद'],
    'chilli': ['chilli', 'mirch', 'mirchi', 'मिर्च', 'मिरची'],
    'bottle gourd': ['bottle gourd', 'lauki', 'dudhi', 'ghiya', 'लौकी', 'दूधी', 'दुधी', 'घिया'],
    'bitter gourd': ['bitter gourd', 'karela', 'karle', 'करेला', 'कारले'],
    'cucumber': ['cucumber', 'kheera', 'kakdi', 'खीरा', 'काकडी'],
    'carrot': ['carrot', 'gajar', 'गाजर'],
    'radish': ['radish', 'mooli', 'mula', 'मूली', 'मुळा'],
    'capsicum': ['capsicum', 'bell pepper', 'shimla mirch', 'ढोबळी मिरची', 'शिमला मिर्च'],
    'beetroot': ['beetroot', 'chukandar', 'चुकंदर'],
    'apple': ['apple', 'seb', 'safarchand', 'सेब', 'सफरचंद'],
    'banana': ['banana', 'kela', 'kele', 'केला', 'केळे'],
    'mango': ['mango', 'aam', 'amba', 'आम', 'आंबा'],
    'orange': ['orange', 'santra', 'narangi', 'संत्रा', 'नारंगी'],
    'lemon': ['lemon', 'lime', 'nimbu', 'limbu', 'नींबू', 'लिंबू'],
    'pomegranate': ['pomegranate', 'anar', 'dalimb', 'अनार', 'डाळिंब'],
    'grapes': ['grapes', 'angoor', 'draksh', 'अंगूर', 'द्राक्षे'],
    'coconut': ['coconut', 'nariyal', 'naral', 'नारियल', 'नारळ'],
    'peanut': ['peanut', 'groundnut', 'moongfali', 'mungfali', 'shengdana', 'मूंगफली', 'शेंगदाणा'],
    'almond': ['almond', 'badam', 'बादाम'],
    'cashew': ['cashew', 'kaju', 'काजू'],
    'mushroom': ['mushroom', 'khumb', 'मशरूम', 'कुकुरमुत्ता'],
    'halwa': ['halwa', 'sheera', 'हलवा', 'शीरा'],
    'kheer': ['kheer', 'payasam', 'खीर', 'पायसम'],
    'ladoo': ['ladoo', 'laddu', 'लड्डू'],
    'barfi': ['barfi', 'burfi', 'बर्फ़ी', 'बर्फी'],
    'samosa': ['samosa', 'समोसा'],
    'pakora': ['pakora', 'pakoda', 'bhajji', 'भजिया', 'पकोड़ा', 'पकोडा'],
    'cutlet': ['cutlet', 'tikki', 'टिक्की', 'कटलेट'],
    'roll': ['roll', 'kathi roll', 'काठी रोल'],
    'sandwich': ['sandwich', 'सैंडविच'],
    'soup': ['soup', 'shorba', 'सूप', 'शोरबा'],
    'salad': ['salad', 'kachumber', 'kosambari', 'सलाद', 'कचुंबर', 'कोशिंबीर'],
    'raita': ['raita', 'पचड़ी', 'रायता']
}

# Normalize string helper
def normalize(s):
    if not s:
        return ''
    s = s.lower()
    s = re.sub(r'[\(\)\[\],\/\\\-\.\+]', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

all_aliases = {}
alias_to_food_ids = {}

for f in foods:
    fid = f['id']
    name_str = f['name']
    name_norm = normalize(name_str)
    
    assigned_aliases = set()
    assigned_aliases.add(name_norm)
    if f.get('nameEn'):
        assigned_aliases.add(normalize(f['nameEn']))
    if f.get('nameLocal'):
        assigned_aliases.add(normalize(f['nameLocal']))

    # Check concepts
    for concept, terms in CONCEPT_MAP.items():
        # If any term matches in food name or ingredients
        has_concept = False
        for t in terms:
            t_norm = normalize(t)
            if re.search(r'\b' + re.escape(t_norm) + r'\b', name_norm):
                has_concept = True
                break
        
        if has_concept:
            for t in terms:
                assigned_aliases.add(normalize(t))

    f['aliases'] = sorted(list(assigned_aliases))
    
    for a in assigned_aliases:
        if a not in alias_to_food_ids:
            alias_to_food_ids[a] = []
        alias_to_food_ids[a].append(fid)

# Update database file with aliases
with open('data/indian_nutrition_db.json', 'w', encoding='utf-8') as f:
    json.dump(foods, f, ensure_ascii=False, indent=2)

print(f"Total unique aliases mapped: {len(alias_to_food_ids)}")
print("Sample aliases and count of matched foods:")
for k in list(alias_to_food_ids.keys())[:20]:
    print(f"  '{k}' -> {len(alias_to_food_ids[k])} foods")

# Save alias index separately for rapid lookup if needed
with open('data/indian_food_aliases.json', 'w', encoding='utf-8') as f:
    json.dump({
        'totalAliases': len(alias_to_food_ids),
        'aliases': {k: alias_to_food_ids[k][:20] for k in alias_to_food_ids}
    }, f, ensure_ascii=False, indent=2)

print("SUCCESS: Aliases generated and merged into indian_nutrition_db.json")
