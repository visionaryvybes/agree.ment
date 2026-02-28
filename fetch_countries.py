import urllib.request
import json

try:
    req = urllib.request.Request("https://restcountries.com/v3.1/all", headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as url:
        data = json.loads(url.read().decode())
        
    countries = []
    for c in data:
        name = c['name']['common']
        code = c['cca2']
        flag = c.get('flag', '')
        region = c.get('region', 'Other')
        countries.append({'name': name, 'code': code, 'flag': flag, 'region': region})
        
    countries.sort(key=lambda x: x['name'])
    
    ts_content = "export interface Country { name: string; code: string; flag: string; region: string; }\n\n"
    ts_content += "export const countries: Country[] = [\n"
    for c in countries:
        flag = c['flag'].replace("'", "\\'")
        name = c['name'].replace("'", "\\'")
        ts_content += f"  {{ name: '{name}', code: '{c['code']}', flag: '{flag}', region: '{c['region']}' }},\n"
    ts_content += "];\n"
    
    with open("src/data/countries.ts", "w") as f:
        f.write(ts_content)
    print("Successfully wrote src/data/countries.ts with", len(countries), "countries")
except Exception as e:
    print("Error:", e)
