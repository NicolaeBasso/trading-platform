FROM python:3.9-slim
WORKDIR /app
COPY ./discovery.py .
RUN pip3 install flask requests
EXPOSE 6666
CMD ["python3", "./discovery.py"]

# docker build -t discovery_local .
# docker run --name=discovery-service -p 6666:6666 waffle4everyone/discovery