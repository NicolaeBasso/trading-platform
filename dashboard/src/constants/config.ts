export const chartConfig = {
  '1D': { resolution: '1', days: 1, weeks: 0, months: 0, years: 0 },
  '1W': { resolution: '15', days: 0, weeks: 1, months: 0, years: 0 },
  '1M': { resolution: '60', days: 0, weeks: 0, months: 1, years: 0 },
  '1Y': { resolution: 'D', days: 0, weeks: 0, months: 0, years: 1 },
};

export enum QuoteType {
  BID = 'bid',
  ASK = 'ask',
}

export enum PositionType {
  LONG = 'long',
  SHORT = 'short',
}

export const timeFrames = {
  WEEK: { text: '1W', api: 'WEEK' },
  DAY: { text: '1D', api: 'DAY' },
  HOUR_4: { text: '4H', api: 'HOUR_4' },
  HOUR: { text: '1H', api: 'HOUR' },
  MINUTE_30: { text: '30m', api: 'MINUTE_30' },
  MINUTE_15: { text: '15m', api: 'MINUTE_15' },
  MINUTE_5: { text: '5m', api: 'MINUTE_5' },
  MINUTE: { text: '1m', api: 'MINUTE' },
};

export const tickers = {
  US100: 'US100',
  US500: 'US500',
  NATURAL_GAS: 'NATURAL_GAS',
  CRUDE_OIL: 'CRUDE_OIL',
  BTCUSD: 'BTCUSD',
  ETHUSD: 'ETHUSD',
  AAPL: 'AAPL',
  NVDA: 'NVDA',
  VIX: 'VIX',
};

export const tickersArr = Object.values(tickers);
