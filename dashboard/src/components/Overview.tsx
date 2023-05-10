import React, { useContext } from 'react';
import Card from './Card';
import TickerContext from '../contexts/TickerContext';
import LiveCourseContext from '../contexts/LiveCourseContext';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import { QuoteType } from '../constants/config';
import { Button } from '@mantine/core';

const Overview = ({ symbol, price, change, changePercent, currency }) => {
  const { ticker } = useContext(TickerContext);
  const { liveCourse } = useContext(LiveCourseContext);
  const { quoteType, setQuoteType } = useContext(QuoteTypeContext);

  console.log(liveCourse, ticker);

  const quoteTypeFromLiveCourse = (quoteType: QuoteType) => {
    if (quoteType === QuoteType.ASK) return 'ofr';

    return QuoteType.ASK;
  };

  const liveCourseQuoteType = quoteTypeFromLiveCourse(quoteType);
  const tickerLive = liveCourse[ticker];

  return (
    <div style={{ marginLeft: '10%', display: 'block' }}>
      Quote type:
      <Button
        onClick={() => {
          console.log('Quote button clicked!');
          setQuoteType(quoteType === QuoteType.ASK ? QuoteType.BID : QuoteType.ASK);
        }}
        style={{ backgroundColor: 'blue', marginLeft: '10%' }}
      >
        {quoteType?.toUpperCase()}
      </Button>
      <p>Bid: {tickerLive?.bid}</p>
      <p>Ask: {tickerLive?.ofr}</p>
    </div>
    // <Card>
    //   <span className='absolute left-4 top-4 text-neutral-400 text-lg xl:text-xl 2xl:text-2xl'>
    //     {symbol}
    //   </span>
    //   <div className='w-full h-full flex items-center justify-around'>
    //     <span className='text-2xl xl:text-4xl 2xl:text-5xl flex items-center'>
    //       ${quoteType === QuoteType.ASK ? liveCourse[ticker]?.ofr : liveCourse[ticker]?.bid || ''}
    //       <span className='text-lg xl:text-xl 2xl:text-2xl text-neutral-400 m-2'>{currency}</span>
    //     </span>
    //     <span
    //       className={`text-lg xl:text-xl 2xl:text-2xl ${
    //         change > 0 ? 'text-lime-500' : 'text-red-500'
    //       }`}
    //     >
    //       {change} <span>({changePercent}%)</span>
    //     </span>
    //   </div>
    // </Card>
  );
};

export default Overview;
