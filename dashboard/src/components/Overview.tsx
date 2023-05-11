import React, { useContext } from 'react';
import Card from './Card';
import TickerContext from '../contexts/TickerContext';
import LiveCourseContext from '../contexts/LiveCourseContext';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import { QuoteType } from '../constants/config';
import { Button, NumberInput, Title } from '@mantine/core';
import Search from './Search';

const Overview = ({ symbol, price, change, changePercent, currency }) => {
  const { ticker } = useContext(TickerContext);
  const { liveCourse } = useContext(LiveCourseContext);
  const { quoteType, setQuoteType } = useContext(QuoteTypeContext);

  const quoteTypeFromLiveCourse = (quoteType: QuoteType) => {
    if (quoteType === QuoteType.ASK) return 'ofr';

    return QuoteType.ASK;
  };

  const liveCourseQuoteType = quoteTypeFromLiveCourse(quoteType);
  const tickerLive = liveCourse[ticker];

  return (
    <div style={{ marginLeft: '10%', display: 'block' }}>
      <div>
        <div style={{ margin: '20px 0' }}>
          <Title my={'xs'}>{ticker}</Title>
          <Search />
        </div>
      </div>
      <div style={{ height: '4rem', display: 'flex', alignItems: 'center' }}>
        Quote type:
        <Button
          style={{
            marginLeft: '10%',
            backgroundColor: quoteType === QuoteType.ASK ? 'blue' : 'red',
          }}
          onClick={() => {
            setQuoteType(quoteType === QuoteType.ASK ? QuoteType.BID : QuoteType.ASK);
          }}
        >
          {quoteType?.toUpperCase()}
        </Button>
      </div>
      <p>Bid: {tickerLive?.bid}</p>
      <p>Ask: {tickerLive?.ofr}</p>
      <NumberInput hideControls label='Enter position size' style={{ margin: '20px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button size='xl' style={{ backgroundColor: 'blue', minWidth: '150px' }}>
          LONG
        </Button>
        <Button size='xl' style={{ backgroundColor: 'red', minWidth: '150px' }}>
          SHORT
        </Button>
      </div>
    </div>
  );
};

export default Overview;
