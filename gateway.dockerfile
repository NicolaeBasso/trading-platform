FROM python:3.9-slim
WORKDIR /usr/src/trading-platform-gateway/app
COPY ./flask-gw .
RUN pip3 install flask requests
CMD ["python3", "gateway.py"]

# docker build -f Dockerfile-gateway -t waffle4everyone/gateway .