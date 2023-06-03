import { tickers, timeFrames } from '../constants/config';
import axios from './axios';

const getTickerHistory = async ({
  ticker = tickers.BTCUSD,
  period = timeFrames.DAY.api,
}: {
  ticker: string;
  period: string;
}) => {
  const res = await axios.get(`past?ticker=${ticker}&period=${period}`, {
    baseURL: 'http://localhost:6380',
  });

  return res.data;
};

const getTickerPrediction = async ({
  ticker = tickers.BTCUSD,
  period = timeFrames.DAY.api,
}: {
  ticker: string;
  period: string;
}) => {
  const res = await axios.get(`future?ticker=${ticker}&period=${period}`, {
    baseURL: 'http://localhost:6380',
  });

  return res.data;
};

export const MarketsAPI = {
  getTickerHistory,
  getTickerPrediction,
};
