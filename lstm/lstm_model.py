import redis, json
from tensorflow import keras
import numpy as np
import pandas as pd
import pandas_ta as ta
from sklearn.preprocessing import StandardScaler
from redis.commands.json.path import Path


past_db = redis.Redis(host='redis-master', port=6379, db=0)
future_db = redis.Redis(host='redis-master', port=6379, db=1)




def get_and_parse_data(ticker='BTCUSD', period='DAY'):
    df = pd.read_json(f"http://py-cache:6380/past?ticker={ticker}&period={period}")

    data = pd.json_normalize(df.loc[0]['prices'],  max_level=1)

    # Adding indicators
    data['RSI']=ta.rsi(data['closePrice.bid'], length=15)
    data['EMAF']=ta.ema(data['closePrice.bid'], length=20)
    data['EMAM']=ta.ema(data['closePrice.bid'], length=100)
    data['EMAS']=ta.ema(data['closePrice.bid'], length=150)

    data.dropna(how='any', inplace=True)
    return data
    

def get_scaler(data):
    scaler = StandardScaler()
    scaler = scaler.fit(data)
    return scaler


def parse_dates(data):
    dates = pd.to_datetime(data['snapshotTimeUTC'])
    data.drop(['snapshotTimeUTC', 'snapshotTime'], axis=1, inplace=True)
    return [data, dates]


def predict(data, model_path, n_days_for_prediction):
    model = keras.models.load_model(model_path)
    prediction = model.predict(data[-n_days_for_prediction:])
    return prediction


# GET data, add indicators, drop NaNs
data = get_and_parse_data(ticker='BTCUSD', period='DAY')

# Filter data apart from dates
data, dates = parse_dates(data)

# Scale data
scaler = get_scaler(data)
data = scaler.transform(data)

# Predict
n_days_for_prediction =14
n_past = 28

data_for_prediction = []
for i in range(n_past, len(data) - 2):
    data_for_prediction.append(data[i-n_past:i, 0:data.shape[1]])


predictions = predict(np.array(data_for_prediction), 'BTCUSD-DAY.h5', n_days_for_prediction)

# Inverse scale and append correct dates
pred_future = scaler.inverse_transform(predictions)
pred_dates  = pd.date_range(list(dates)[-1], periods=n_days_for_prediction).tolist()

mapper = {
    0: 'snapshotTimeUTC',
    1: 'lastTradedVolume',
    2: 'closePriceask',
    3: 'closePricebid',
    4: 'highPriceask',
    5: 'highPricebid',
    6: 'lowPriceask',
    7: 'lowPricebid',
    8: 'openPriceask',
    9: 'openPricebid'
}

df = pd.concat([pd.DataFrame(pred_dates), pd.DataFrame(pred_future)], axis=1, ignore_index=True)
df.drop([10, 11, 12, 13], axis=1, inplace=True)
df.drop(0, inplace=True)
df.rename(mapper= mapper, axis=1, inplace=True)

print(df)

j = (df.groupby(['snapshotTimeUTC', 'lastTradedVolume'])
       .apply(lambda x: x[['openPricebid','openPriceask','closePricebid', 'closePriceask','highPricebid', 'highPriceask','lowPricebid', 'lowPriceask']].to_dict('records'))
       .reset_index()
       .rename(columns={0:'prices'})
       .to_json(orient='records'))


from json_parser import parser
j = json.loads(j)
j = parser(j, 'MINUTE')

print(j)

if future_db.exists('BTCUSD'):
    pass
else:
    future_db.json().set('BTCUSD', Path.root_path(), j)

