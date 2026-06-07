import urllib.request, json
try:
    req = urllib.request.Request('https://api.github.com/users/mrAbhimanyuVishwakarma/repos?per_page=100', headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    repos = json.loads(response.read().decode('utf-8'))
    for r in repos:
        if 'aura' in r['name'].lower() or 'tube' in r['name'].lower():
            print(f"{r['name']}: {r['description']} - {r['language']}")
except Exception as e:
    print(f"Error: {e}")
