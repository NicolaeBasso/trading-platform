import React, { Context } from 'react';

const StockContext: Context<{ stockSymbol: any; setStockSymbol: any }> = React.createContext({
  stockSymbol: null,
  setStockSymbol: null,
});

export default StockContext;
