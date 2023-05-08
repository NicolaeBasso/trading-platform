import redis, flask
from flask import request, Blueprint

past_db = redis.Redis(host='redis-master', port=6379, db=0)
future_db = redis.Redis(host='redis-master', port=6379, db=1)

cache_endpoints = Blueprint('cache_endpoints', __name__)

@cache_endpoints.get('/past')
def past():
    ticker = request.args.get('ticker')
    period = request.args.get('period')

    if period == 'ALL':
        data = past_db.json().get(ticker)
        return flask.jsonify(data)
    else:
        data = past_db.json().get(ticker, f'$.{period}')
        return flask.jsonify(data)

@cache_endpoints.get('/future')
def future():
    ticker = request.args.get('ticker', default='BTCUSD')

    return flask.jsonify(
        {
            "DAY": {
                "snapshotTimeUTC": [{"Date": "2023-05-09T00:00:00", "closePrice": 350}]
            }
        }
    )
