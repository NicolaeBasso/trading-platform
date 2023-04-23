import { TradeType } from '../types/trade-type.type';

export class Trade {
  id: string;
  createdAt: number;
  updatedAt: number;
  type: TradeType;
  isOpen: boolean;
  leverageRatio: number;
  marginSize: number;
  leverageSize: number;
  tradeSize: number;
  priceOpened: number;
  priceClosed: number;
  stopLoss: number;
  takeProfit: number;
  overnightInterest: number;
  overnightFee: number;
}
