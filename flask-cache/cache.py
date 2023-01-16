import requests
import json
from time import sleep
from threading import Thread
import redis, flask
from redis.commands.json.path import Path
import datetime


session_headers = {
    'X-SECURITY-TOKEN': None,
    'CST': None
}

r = redis.Redis(host='redis-cache', port=6379, db=0)


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


def convert_epoch(resolution=None):
    epoch = server_time() / 1000

    NOW = datetime.datetime.fromtimestamp(epoch).strftime('%Y-%m-%dT%H:%M:%S')
    

    MINUTE = datetime.datetime.fromtimestamp(epoch - 60000).strftime('%Y-%m-%dT%H:%M:%S')
    MINUTE_5 = datetime.datetime.fromtimestamp(epoch - 300000).strftime('%Y-%m-%dT%H:%M:%S')
    MINUTE_15 = datetime.datetime.fromtimestamp(epoch - 900000).strftime('%Y-%m-%dT%H:%M:%S')
    MINUTE_30 = datetime.datetime.fromtimestamp(epoch - 1800000).strftime('%Y-%m-%dT%H:%M:%S')
    HOUR = datetime.datetime.fromtimestamp(epoch - 3600000).strftime('%Y-%m-%dT%H:%M:%S')
    HOUR_4 = datetime.datetime.fromtimestamp(epoch - 14400000).strftime('%Y-%m-%dT%H:%M:%S')
    DAY = datetime.datetime.fromtimestamp(epoch - 86400000).strftime('%Y-%m-%dT%H:%M:%S')
    WEEK = datetime.datetime.fromtimestamp(epoch - 604800000, tz=datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
    
    if resolution == 'MINUTE':
        return [MINUTE, NOW]
    elif resolution == 'MINUTE_5':
        return [MINUTE_5, NOW]
    elif resolution == 'MINUTE_15':
        return [MINUTE_15, NOW]
    elif resolution == 'MINUTE_30':
        return [MINUTE_30, NOW]        
    elif resolution == 'HOUR':
        return [HOUR, NOW]
    elif resolution == 'HOUR_4':
        return [HOUR_4, NOW]
    elif resolution == 'DAY':
        return [DAY, NOW]
    elif resolution == 'WEEK':
        return [WEEK, NOW]
    else:
        return None


def historical_price(epic='BTCUSD', resolution='WEEK', max='1000'):
    endpoint = f'https://demo-api-capital.backend-capital.com/api/v1/prices/{epic}?resolution={resolution}&max={max}'

    try:
        resp = requests.get(endpoint, headers=session_headers)
        return resp.json()
    except: print('historical_price throw', flush=True)


def update_cache():    
    if r.exists('BTCUSD'):
        print('key exists')
    else: r.json().set('BTCUSD', Path.root_path(),  dict())
    
    for res in ['MINUTE', 'MINUTE_5', 'MINUTE_15', 'MINUTE_30', 'HOUR', 'HOUR_4', 'DAY', 'WEEK']:
        data = historical_price(resolution=res)
        r.json().set('BTCUSD', Path(f'.{res}'), data)


cache = flask.Flask(__name__)
@cache.get('/BTCUSD/<interval>')
def btcusd(interval):
    if interval == 'ALL':
        data = r.json().get('BTCUSD')
        print(interval, flush=True)
        return flask.jsonify(data)
    else:
        data = r.json().get('BTCUSD', f'$.{interval}')
        print(interval, flush=True)
        return flask.jsonify(data)


if __name__ == '__main__':
    session = Thread(target=create_session)
    session.start()
    sleep(5)
    update_cache()

    cache.run(host='localhost', port=6380)
