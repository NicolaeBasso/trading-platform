from time import sleep
from threading import Thread
import flask

import session
from cache_reverse_proxy import cache_endpoints

app = flask.Flask(__name__)
app.register_blueprint(cache_endpoints)


if __name__ == '__main__':
    session = Thread(target=session.create_session)
    session.start()
    

    app.run(host='0.0.0.0', port=6380)
