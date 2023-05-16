import axios from './axios';
import { CreateTradeDto } from './interfaces/trade.interface';

const getAllTrades = async (filter = 'open') => {
  const res = await axios.get(`trades/all?filter=${filter}`);

  console.log('getAllTrades', res);

  return res.data;
};

const openTrade = async (requestBody: CreateTradeDto) => {
  const res = await axios.post('trades/open', requestBody);

  console.log('openTrade', res);

  return res.data;
};

const closeTrade = async (id) => {
  const res = await axios.patch(`trades/close/${id}`);

  console.log('openTrade', res);

  return res.data;
};

export const TradesAPI = {
  getAllTrades,
  openTrade,
  closeTrade,
};
