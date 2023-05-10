import React, { Context } from 'react';

const QuoteTypeContext: Context<{
  quoteType: any;
  setQuoteType: any;
}> = React.createContext({
  quoteType: null,
  setQuoteType: null,
});

export default QuoteTypeContext;
