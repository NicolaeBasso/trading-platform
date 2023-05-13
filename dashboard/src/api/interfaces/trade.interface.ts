import { TradeType } from '../types/trade-type.type';

export interface CreateTradeDto {
  type?: TradeType;
  isLong: boolean;
  pair: string;
  leverageRatio?: number;
  tradeSize: number;
  stopLoss?: number;
  takeProfit?: number;
}
