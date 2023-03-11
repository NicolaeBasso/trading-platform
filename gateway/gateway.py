import flask, requests
import socket
import threading
from time import sleep
import json

from prometheus_flask_exporter import PrometheusMetrics

import logging
logging.basicConfig(level=logging.INFO)
logging.info("Setting LOGLEVEL to INFO")


GATEWAY_REGISTRY = {}

DISCOVERY = '127.0.0.1:6666'

gw = flask.Flask(__name__)
metrics = PrometheusMetrics(gw)
metrics.info("app_info", "Flask reverse proxy gateway", version="4.2.0")
# /metrics endpoint

@gw.post('/auth/register')
def register():
    try:
        ip = GATEWAY_REGISTRY['auth-service'][0]['ip']
        port = GATEWAY_REGISTRY['auth-service'][0]['port']
        endpoint = f"http://{ip}:{port}/auth/register"
        
        resp = requests.post(endpoint, data=json.dumps(flask.request.json), headers=flask.request.headers)

        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = flask.Response(resp.content, resp.status_code, headers)
        return response
    except:
        return flask.jsonify({"status": "service not found in GATEWAY_REGISTRY"})

@gw.post('/auth/login')
def login():
    try:
        ip = GATEWAY_REGISTRY['auth-service'][0]['ip']
        port = GATEWAY_REGISTRY['auth-service'][0]['port']
        endpoint = f"http://{ip}:{port}/auth/login"
        
        resp = requests.post(endpoint, data=json.dumps(flask.request.json), headers=flask.request.headers)
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = flask.Response(response=resp.content, status=resp.status_code, headers=headers)
        return response
    except:
        return flask.jsonify({"status": "service not found in GATEWAY_REGISTRY"})

@gw.get('/auth/logout')
def logout():
    try:
        ip = GATEWAY_REGISTRY['auth-service'][0]['ip']
        port = GATEWAY_REGISTRY['auth-service'][0]['port']
        endpoint = f"http://{ip}:{port}/auth/logout"
        
        resp = requests.get(endpoint, headers=flask.request.headers)
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = flask.Response(response=resp.content, status=resp.status_code, headers=headers)
        return response
    except:
        return flask.jsonify({"status": "service not found in GATEWAY_REGISTRY"})    


@gw.get('/BTCUSD/ALL')
def ticker():
    try:                
        # print(f"/ticker/{ticker}", flush=True)

        endpoint = f"http://py-cache:6380/BTCUSD/ALL"
        
        print('log1', flush=True)
        resp = requests.get(endpoint)
 
        print('log2', flush=True)
        response = flask.Response(response=resp.content, status=resp.status_code)
        
        print('log3', flush=True)
        return response

    except:
        return flask.jsonify({"status": "service not found in GATEWAY_REGISTRY"})   



@gw.get('/test')
def test():
    if 1:
        # test request
        resp = requests.get('http://discovery:6666/index', headers=flask.request.headers)

        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = flask.Response(response=resp.content,status=resp.status_code, headers=headers)
        return response
    else:
        return flask.jsonify({"status": "idk something went wrong"})  


def update():
    global GATEWAY_REGISTRY
    while True:
        try:
            r = requests.get("http://discovery:6666/index")
            if r.status_code == 200:
                GATEWAY_REGISTRY = r.json()
            
            print('registry: ', GATEWAY_REGISTRY, flush=True)
            sleep(10)
        except:
            print('update() requests error, is discovery down?', flush=True)
            sleep(10)


if __name__ == '__main__':
    update_thread = threading.Thread(target=update)
    update_thread.start()

    gw.run(host='0.0.0.0', port=5555)
