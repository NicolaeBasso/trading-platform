from time import sleep
from threading import Thread
import flask
from flask_cors import CORS

import session
from cache_reverse_proxy import cache_endpoints

app = flask.Flask(__name__)
app.register_blueprint(cache_endpoints)
CORS(app, supports_credentials=True)




if __name__ == '__main__':
    session_create = Thread(target=session.create_session)
    session_create.start()
    sleep(3)

    update_cache = Thread(target=session.update_cache, args=('BTCUSD',))
    update_cache.start()

    app.run(host='0.0.0.0', port=6380)
