import { TradeType } from '../types/tradeType';

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
  overnightInterest: number;
  overnightFee: number;
}
