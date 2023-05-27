import axios from './axios';
import { CreateTradeDto } from './interfaces/trade.interface';

const getAllTrades = async (filter = 'open') => {
  const res = await axios.get(`trades/all?filter=${filter}`);

  return res.data;
};

const openTrade = async (requestBody: CreateTradeDto) => {
  const res = await axios.post('trades/open', requestBody);

  return res.data;
};

const closeTrade = async (id) => {
  const res = await axios.patch(`trades/close/${id}`);

  return res.data;
};

export const TradesAPI = {
  getAllTrades,
  openTrade,
  closeTrade,
};
