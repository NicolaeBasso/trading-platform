FROM python:3.9-slim
WORKDIR /app
RUN pip3 install flask flask-cors redis requests
COPY . .
CMD ["python3", "cache.py"]

# docker build -f Dockerfile-redis-cache -t waffle4everyone/redis-cache .