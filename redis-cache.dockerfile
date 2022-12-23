FROM python:3.9-slim
WORKDIR /usr/src/trading-platform-cache/app
RUN pip3 install flask redis yfinance
COPY ./flask-cache .
CMD ["python3", "cache.py"]

# docker build -f Dockerfile-redis-cache -t waffle4everyone/redis-cache .