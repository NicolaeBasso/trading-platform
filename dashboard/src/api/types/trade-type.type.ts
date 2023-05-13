export type TradeType = 'CFD' | 'OPTIONS' | 'STOCKS';

export type Trade = {
  id: string;
  createdAt: number;
  updatedAt: number;
  type: TradeType;
  isLong: boolean;
  isOpen: boolean;
  pair: string;
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
};
