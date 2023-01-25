import flask, requests
import socket
import threading
from time import sleep
import json

from prometheus_flask_exporter import PrometheusMetrics


# Valid registry names:
'''
discovery_service
core_service
auth_service
cache_db
nosql_db
sql_db
'''


GATEWAY_REGISTRY = {}

GATEWAY_IP = '0.0.0.0'
GATEWAY_PORT = 5555

DISCOVERY = '127.0.0.1:6666'

gw = flask.Flask(__name__)
metrics = PrometheusMetrics(gw)
# /metrics endpoint

@gw.post('/auth/register')
def register():
    try:
        endpoint = "http://auth-service:5002/register"

        print(flask.request.json, flush=True)
        
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
        endpoint = f"http://auth-service:5002/login"
        
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
        endpoint = f"http://auth-service:5002/login"
        
        resp = requests.get(endpoint, headers=flask.request.headers)
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = flask.Response(response=resp.content, status=resp.status_code, headers=headers)
        return response
    except:
        return flask.jsonify({"status": "service not found in GATEWAY_REGISTRY"})    


@gw.get('/ticker/<ticker>')
def ticker(ticker):
    try:                
        print(f"/ticker/{ticker}", flush=True)

        endpoint = f"http://py-cache:6380/ticker/{ticker}"
        

        resp = requests.get(endpoint, headers=flask.request.headers)
        print('req was sent to redis', flush=True)
        print(resp.content, flush=True)

        # excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        # headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        # response = flask.Response(response=resp.content, status=resp.status_code, headers=headers)

        # excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        # headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = flask.Response(response=resp.content, status=resp.status_code)

        # print(response.decode('utf-8'), flush=True)

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
            r = requests.get(f"http://{DISCOVERY}/index")
            if r.status_code == 200:
                GATEWAY_REGISTRY = r.json()
            sleep(10)
        except:
            print('update() requests error', flush=True)


if __name__ == '__main__':
    # update_thread = threading.Thread(target=update)
    # update_thread.start()

    gw.run(host=GATEWAY_IP, port=GATEWAY_PORT)
