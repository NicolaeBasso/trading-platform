export type TickerCandle = {
  openPrice: {
    bid: number;
    ask: number;
  };

  closePrice: {
    bid: number;
    ask: number;
  };

  lowPrice: {
    bid: number;
    ask: number;
  };

  highPrice: {
    bid: number;
    ask: number;
  };

  lastTradedVolume: number;

  snapshotTime: string;

  snapshotTimeUTC: string;
};
