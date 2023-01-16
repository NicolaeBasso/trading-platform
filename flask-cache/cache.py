import flask
import threading
from time import sleep
import yfinance as yf
import redis


cached_tickers = {
    'gspc': yf.Ticker('^GSPC').analyst_price_target.to_json(),
    'gdaxi': yf.Ticker('^gdaxi').analyst_price_target.to_json(),
    'ndx': yf.Ticker('^ndx').analyst_price_target.to_json()

}

r = redis.Redis(host='redis-cache', port=6379, db=0)


def update():
    while True:
        sleep(10)
        r.set('gspc', cached_tickers['gspc'])
        r.set('gdaxi', cached_tickers['gdaxi'])
        r.set('ndx', cached_tickers['ndx'])

        sleep(600)



app = flask.Flask(__name__)


@app.get('/ticker/<ticker>')
def ticker(ticker):
    if ticker not in cached_tickers:
        try:
            _ = yf.Ticker(ticker).analyst_price_target.to_json()
        except:
            return flask.jsonify({"status": "wrong ticker"})
        finally:
            return flask.jsonify(_)
            


    try:
        print(f"/ticker/{ticker}", flush=True)
        resp = r.get(f'{ticker}')

        #  resp = requests.post(endpoint, data=json.dumps(flask.request.json), headers=flask.request.headers)
        print(resp, flush=True)
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        # headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        print(resp.decode('utf-8'), flush=True)

        response = flask.Response(response=resp.decode('utf-8'))
        print(response, flush=True)
        return response
    except:
        return flask.jsonify({"status": "service not found in GATEWAY_REGISTRY"}) 

if __name__ == '__main__':
    update_thread = threading.Thread(target=update)
    update_thread.start()

    app.run(host="0.0.0.0", port=6380)