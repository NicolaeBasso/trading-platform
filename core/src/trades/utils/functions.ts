import { Trade, User } from '@prisma/client';

export function getUserBalance({
  user,
  trades,
  livePairs,
  tradeId,
}: {
  user: User;
  trades: Trade[];
  livePairs: any;
  tradeId?: string;
}) {
  const funds = user.balance;

  if (tradeId) trades = trades.filter((trade) => trade.id === tradeId);

  const accountData = trades.reduce(
    (acc, trade) => {
      const {
        pair,
        isLong,
        tradeSize,
        marginSize,
        priceOpened,
        leverageRatio,
      } = trade;

      const quoteType = isLong ? 'bid' : 'ofr';
      const currentPrice = livePairs[pair][quoteType];

      acc.margin += marginSize;

      if (isLong)
        acc.profit += (currentPrice - priceOpened) * tradeSize * leverageRatio;
      else
        acc.profit -= (currentPrice - priceOpened) * tradeSize * leverageRatio;

      acc.equity = acc.funds + acc.profit;

      acc.available = acc.equity - acc.margin;

      return acc;
    },
    { funds: user.balance, margin: 0, profit: 0, equity: 0, available: 0 },
  );

  const { equity, available, margin, profit } = accountData;

  return {
    funds,
    equity,
    available,
    margin,
    profit,
  };
}
