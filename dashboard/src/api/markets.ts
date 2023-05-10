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

const logout = async () => {
  const res = await axios.delete('/auth/logout', {});

  return res.data;
};

const forgotPassword = async (body: ForgotPasswordInterface) => {
  const res = await axios.post('/auth/forgot-password', body, { withCredentials: true });

  return res;
};

const resetPassword = async (body: ResetPasswordInterface) => {
  const res = await axios.post('/auth/reset-password', body, { withCredentials: true });

  return res;
};

export const MarketsAPI = { getTickerHistory, register, logout, resetPassword, forgotPassword };
