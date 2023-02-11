import redis, flask
from redis.commands.json.path import Path
from redis.sentinel import Sentinel
from time import sleep
import requests

r = redis.Redis(host='redis-master', port=6379, db=0, password='redis')


'''
sentinel host
sentinel port
auth pass

'''

class RDSL:
    def __init__(self, sentinel_host='sentinel', sentinel_port=26379, password='redis') -> None:
        self.sentinel = Sentinel([(sentinel_host, sentinel_port)])
        self.password = password
        self.r = None


    def update_redis_ip(self, interval=15):
        while True:
            sleep(interval)
            try:
                host, port = self.sentinel.discover_master('redis-master')
                self.r = redis.Redis(host=host, port=port, db=0, password=self.password)
            except:
                print('update_redis_ip throw', flush=True)
    

    # Should be ran once first
    def update_cache(self):    
        if self.r.exists('BTCUSD'):
            print('key exists', flush=True)
        else: self.r.json().set('BTCUSD', Path.root_path(),  dict())
        
        for res in ['MINUTE', 'MINUTE_5', 'MINUTE_15', 'MINUTE_30', 'HOUR', 'HOUR_4', 'DAY', 'WEEK']:
            data = self.historical_price(resolution=res)
            r.json().set('BTCUSD', Path(f'.{res}'), data)


    def historical_price(self, epic='BTCUSD', resolution='WEEK', max='1000'):
        endpoint = f'https://demo-api-capital.backend-capital.com/api/v1/prices/{epic}?resolution={resolution}&max={max}'

        try:
            resp = requests.get(endpoint, headers=session_headers)
            return resp.json()
        except: print('historical_price throw', flush=True)

