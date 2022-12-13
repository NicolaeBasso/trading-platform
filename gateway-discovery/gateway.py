import flask, requests
import socket
import threading
from time import sleep

GATEWAY_REGISTRY = {}

GATEWAY_IP = '0.0.0.0'
GATEWAY_PORT = 5555

# use docker compose caontainer name
DISCOVERY_HOSTNAME =''

gw = flask.Flask(__name__)


gw.get('/register')
def register():
    return flask.jsonify({"status": "success"})

gw.get('/login')
def login():
    return flask.jsonify({"status": "success"})

gw.get('/create-order')
def create_order():
    return flask.jsonify({"status": "success"})

gw.get('/get-market-data')
def get_market_data():
    return flask.jsonify({"status": "success"})

gw.get('/open-trade')
def open_trade():
    return flask.jsonify({"status": "success"})


def update():
    global GATEWAY_REGISTRY
    while True:
        r = requests.get(f"http://{DISCOVERY_HOSTNAME}:6666/index")
        if r.status_code == 200:
            GATEWAY_REGISTRY = r.json()
        sleep(10)


if __name__ == '__main__':
    update_thread = threading.Thread(target=update)
    update_thread.start()

    gw.run(host=GATEWAY_IP, port=GATEWAY_PORT)
