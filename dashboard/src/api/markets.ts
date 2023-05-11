import axios from './axios';
import {
  LoginInterface,
  ForgotPasswordInterface,
  ResetPasswordInterface,
} from './interfaces/auth.interface';

const register = async (body: LoginInterface) => {
  const res = await axios.post('/auth/register', body);

  return res.data;
};

const getTickerHistory = async ({ ticker, period }: { ticker: string; period: string }) => {
  const res = await axios.get(`past?ticker=${ticker}&period=${period}`, {
    baseURL: 'http://localhost:6380',
  });

  return res.data;
};

const getAllTrades = async () => {
  const res = await axios.get('trades/all');

  console.log('getAllTrades', res);

  return res.data;
};

export const MarketsAPI = {
  getTickerHistory,
  getAllTrades,
};
