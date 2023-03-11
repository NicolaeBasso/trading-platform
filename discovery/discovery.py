import flask, requests
import socket
import threading
from time import sleep

DISCOVERY_REGISTRY = {}

app = flask.Flask(__name__)


@app.post('/update')
def update():
    global DISCOVERY_REGISTRY
    request = flask.request.json
    if request['type'] in DISCOVERY_REGISTRY.keys():
        for d in DISCOVERY_REGISTRY[request['type']]:
            if d == {'ip':request['ip'], 'port':request['port']}: # means we received a duplicate
                return flask.jsonify({"status": "received a duplicate"})
        # otherwise append ip/port to registry
        DISCOVERY_REGISTRY[request['type']].append({'ip':request['ip'], 'port':request['port']})
    else:
        DISCOVERY_REGISTRY[request['type']] = [{'ip':request['ip'], 'port':request['port']}]
    return flask.jsonify({"status": "success"})


@app.get('/index')
def index():
    global DISCOVERY_REGISTRY
    return flask.jsonify(DISCOVERY_REGISTRY)



def ping(ip,port,timeout=2):
    sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM) 
    sock.settimeout(timeout)
    try:
        if "auth" in ip:
            requests.get(f'http://{ip}:{port}/users')
        elif "core" in ip:
            requests.get(f'http://{ip}:{port}/trade/all')

        sock.connect((ip,port))
    except:
        if "auth" in ip:
            print(f'timeout for {ip}:{port}/users, removing service', flush=True)
        elif "core" in ip:
            print(f'timeout for {ip}:{port}/trade/all, removing service', flush=True)
        return False
    else:
        sock.close()
        return True


def check():
    global DISCOVERY_REGISTRY
    while True:
        sleep(5)
        for key in list(DISCOVERY_REGISTRY.keys()): #[auth, core]
            sleep(1)
            if len(DISCOVERY_REGISTRY[key]) == 0:
                del DISCOVERY_REGISTRY[key]
                break

            indeces = list(range(len(DISCOVERY_REGISTRY[key])))
            
            for i in indeces[::-1]: 
                print(f"indeces: {indeces}, key: {key}, i: {i}; {DISCOVERY_REGISTRY}")
                if not ping(DISCOVERY_REGISTRY[key][i]['ip'], DISCOVERY_REGISTRY[key][i]['port']):
                    del DISCOVERY_REGISTRY[key][i]





if __name__ == '__main__':
    check_thread = threading.Thread(target=check)
    check_thread.start()

    app.run(host='0.0.0.0', port=6666)