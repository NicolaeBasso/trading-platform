FROM tensorflow/tensorflow

# FROM tensorflow/tensorflow:1.14.0-gpu-py3
# FROM armswdev/tensorflow-arm-neoverse

# FROM --platform=linux/arm64 tensorflow/tensorflow
# FROM --platform=linux/arm64 tensorflow/tensorflow

# FROM tensorflow_arm64:v1.0
WORKDIR /lstm
RUN pip3 install redis scikit-learn pandas pandas_ta
COPY . .
CMD ["python3", "lstm_model.py"]

# tensorflow-macos and tensorflow-metal from pypi?