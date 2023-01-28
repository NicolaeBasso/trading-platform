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
       sock.connect((ip,port))
    except:
    #    print(False, flush=True)
       return False
    else:
       sock.close()
       return True


def check():
    global DISCOVERY_REGISTRY
    while True:
        sleep(5)
        for key in list(DISCOVERY_REGISTRY.keys()): #[auth, uth]
            sleep(1)
            if len(DISCOVERY_REGISTRY[key]) == 0:
                del DISCOVERY_REGISTRY[key]
                break

            indeces = range(len(DISCOVERY_REGISTRY[key]))[0::-1]
            for i in indeces: #[2, 1, 0]
                if not ping(DISCOVERY_REGISTRY[key][i]['ip'], DISCOVERY_REGISTRY[key][i]['port']):
                    del DISCOVERY_REGISTRY[key][i]
                    # print('deleting index', flush=True)
                    # print(key, i, flush=True)




if __name__ == '__main__':
    check_thread = threading.Thread(target=check)
    check_thread.start()

    app.run(host='0.0.0.0', port=6666)