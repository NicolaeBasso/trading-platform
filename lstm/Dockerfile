FROM tensorflow/tensorflow
WORKDIR /lstm
RUN pip3 install redis scikit-learn pandas pandas_ta
COPY . .
CMD ["python3", "lstm_model.py"]

 