FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip3 install flask requests prometheus_flask_exporter
CMD ["python3", "gateway.py"]

# docker build -f Dockerfile-gateway -t waffle4everyone/gateway .