import React, { Context } from 'react';

const TickerContext: Context<{ ticker: any; setTicker: any }> = React.createContext({
  ticker: null,
  setTicker: null,
});

export default TickerContext;
