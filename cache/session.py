import json, redis, requests
from redis.commands.json.path import Path
from time import sleep


session_headers = {
    'X-SECURITY-TOKEN': None,
    'CST': None
}

r = redis.Redis(host='redis-master', port=6379, db=0)         


def create_session():
    endpoint = 'https://demo-api-capital.backend-capital.com/api/v1/session'
    headers = {
        'X-CAP-API-KEY': 'qUBPe2IICLeKIkKD',
        'Content-Type': 'application/json'
        }
    payload = json.dumps({
        "identifier": "waffle4everyone@gmail.com",
        "password": "vrewth3V!!*&F,,",
        "encryptedPassword": "false"
        })
    try:
        resp = requests.post(endpoint, data=payload, headers=headers)
        TOKEN = resp.headers['X-SECURITY-TOKEN']
        CST = resp.headers['CST']
    except: print('create_session throw')
    else: 
        global session_headers
        session_headers['X-SECURITY-TOKEN'] = TOKEN
        session_headers['CST'] = CST
    
    while True:
        sleep(500)
        ping_session(TOKEN, CST)


def ping_session(TOKEN, CST):
    endpoint = 'https://demo-api-capital.backend-capital.com/api/v1/ping'
    headers = {
        'X-SECURITY-TOKEN': TOKEN,
        'CST': CST
        }
    try: ping = requests.get(endpoint, headers=headers)
    except: print('ping_session throw', flush=True)


def market_navigation():
    endpoint = 'https://demo-api-capital.backend-capital.com/api/v1/marketnavigation'
    
    try: resp = requests.get(endpoint, headers=session_headers)
    except: print('market_navigation throw', flush=True)


def market_details(epic='BTCUSD'):
    endpoint = f'https://demo-api-capital.backend-capital.com/api/v1/markets/{epic}'
    
    try: resp = requests.get(endpoint, headers=session_headers)
    except: print('market_details throw', flush=True)
 

def server_time():
    endpoint = 'https://demo-api-capital.backend-capital.com/api/v1/time'
    try: 
        resp = requests.get(endpoint)
        data = json.loads(resp.text)
        return data['serverTime']
    except: print('server_time throw', flush=True)


def historical_price(epic='BTCUSD', resolution='WEEK', max='1000'):
    endpoint = f'https://demo-api-capital.backend-capital.com/api/v1/prices/{epic}?resolution={resolution}&max={max}'

    try:
        resp = requests.get(endpoint, headers=session_headers)
        return resp.json()
    except: print('historical_price throw', flush=True)


def update_cache(ticker):    
    if r.exists(ticker):
        print('key exists', flush=True)
    else: r.json().set(ticker, Path.root_path(),  dict())
    
    for res in ['MINUTE', 'MINUTE_5', 'MINUTE_15', 'MINUTE_30', 'HOUR', 'HOUR_4', 'DAY', 'WEEK']:
        data = historical_price(epic=ticker, resolution=res)
        r.json().set(ticker, Path(f'.{res}'), data)

    sleep(60)

