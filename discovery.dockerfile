FROM python:3.9-slim
WORKDIR /usr/src/trading-platform-discovery/app
COPY ./flask-sd .
RUN pip3 install flask requests
CMD ["python3", "discovery.py"]

# docker build -f Dockerfile-discovery -t waffle4everyone/discovery .