Install deps:
pip install requests flask
pip3 install requests flask

Run:
python main.py
pip3 install requests flask
run discovery:
python3 discovery.py

Docker:
Dockerfile run:
docker run --name=discovery_service -p 6666:6666 waffle4everyone/discovery

Compose:
docker-compose up --build
docker-compose up -d --build

Test:
telnet localhost 6666
curl http://127.0.0.1:6666/index
curl localhost:6666/index