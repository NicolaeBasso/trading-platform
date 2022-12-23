import flask
import threading
from time import sleep
import yfinance as yf
import redis
import json

tickers = {
    'msft': yf.Ticker('MSFT').analyst_price_target.to_json(),
    'aapl': yf.Ticker('AAPL').analyst_price_target.to_json(),
    'goog': yf.Ticker('GOOGL').analyst_price_target.to_json()

}

r = redis.Redis(host='redis-cache', port=6379, db=0)


def update():
    while True:
        sleep(10)
        r.set('msft', tickers['msft'])
        r.set('aapl', tickers['aapl'])
        r.set('googl', tickers['googl'])

        sleep(600)


app = flask.Flask(__name__)


@app.get('/ticker/<ticker>')
def ticker(ticker):
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