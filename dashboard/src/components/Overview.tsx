import React, { useContext, useEffect, useState } from 'react';
import Card from './Card';
import TickerContext from '../contexts/TickerContext';
import LiveCourseContext from '../contexts/LiveCourseContext';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import { QuoteType } from '../constants/config';
import { Button, NumberInput, Title, ScrollArea } from '@mantine/core';
import Search from './Search';
import { TradesAPI } from '../api/trades';
import UserContext from '../contexts/UserContext';
import { Trade } from '../api/types/trade-type.type';
import { triangleIcon } from '../assets/triangle-icon';

const Overview = ({
  ticker,
  quoteType,
  setQuoteType,
  profile = {},
  trades = [],
  fetchUserDetails,
}) => {
  const { course } = useContext(LiveCourseContext);

  const tickerLive = course.live?.[ticker];
  const tickerPrevious = course.previous?.[ticker];
  // console.log('overview user', profile, trades);
  const [previousBid, setPreviousBid] = useState(tickerPrevious?.bid);
  const [currentBid, setCurrentBid] = useState(tickerLive?.bid);
  const [bidColor, setBidColor] = useState({ color: '#228be6' });
  const [tradeSize, setTradeSize] = useState(10);

  useEffect(() => {
    setPreviousBid(course.previous?.[ticker]?.bid);
    setCurrentBid(course.live?.[ticker]?.bid);
  }, [course]);

  const quoteTypeFromLiveCourse = (quoteType: QuoteType) => {
    if (quoteType === QuoteType.ASK) return 'ofr';

    return QuoteType.ASK;
  };

  const openTrade = async ({ isLong = true, tradeSize = 10 }) => {
    TradesAPI.openTrade({ isLong, tradeSize, pair: 'BTCUSD' });
    fetchUserDetails();
  };

  const closeTrade = async (id) => {
    TradesAPI.closeTrade(id);
    fetchUserDetails();
  };

  const liveCourseQuoteType = quoteTypeFromLiveCourse(quoteType);

  return (
    <div style={{ marginLeft: '10%', marginTop: '-15px', display: 'block' }}>
      <div>
        <div style={{ margin: '20px 0' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', height: '50px', marginBottom: '10px' }}
          >
            <Title
              my={'xs'}
              color={
                course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid ? 'red' : '#228be6'
              }
            >
              {ticker}
            </Title>
            {triangleIcon({
              width: '50px',
              height: '50px',
              shapeFillColor:
                course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid ? 'red' : '#228be6',
              transform:
                course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid
                  ? 'rotate(180)'
                  : 'rotate(0)',
            })}
          </div>
          <Search />
        </div>
      </div>
      <div style={{ height: '4rem', display: 'flex', alignItems: 'center' }}>
        Quote type:
        <Button
          style={{
            marginLeft: '10%',
            backgroundColor: quoteType === QuoteType.ASK ? '#228be6' : 'red',
          }}
          onClick={() => {
            setQuoteType(quoteType === QuoteType.ASK ? QuoteType.BID : QuoteType.ASK);
          }}
        >
          {quoteType?.toUpperCase()}
        </Button>
      </div>
      <p
        style={{
          color: course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid ? 'red' : '#228be6',
        }}
      >
        Bid: {tickerLive?.bid}
      </p>
      <p
        style={{
          color: course.previous?.[ticker]?.ask > course.live?.[ticker]?.ask ? 'red' : '#228be6',
        }}
      >
        Ask: {tickerLive?.ofr}
      </p>
      <p>Spread: {tickerLive?.ofr - tickerLive?.bid}</p>
      <NumberInput
        hideControls
        label='Position size'
        style={{ margin: '20px 0' }}
        value={tradeSize}
        onChange={(value: any) => {
          setTradeSize(value);
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          size='xl'
          style={{ backgroundColor: '#228be6', minWidth: '150px' }}
          onClick={() => {
            openTrade({ tradeSize });
          }}
        >
          LONG
        </Button>
        <Button
          size='xl'
          style={{ backgroundColor: 'red', minWidth: '150px' }}
          onClick={() => {
            openTrade({ tradeSize });
          }}
        >
          SHORT
        </Button>
      </div>
      <ScrollArea h={400} offsetScrollbars type='auto' style={{ marginTop: '20px' }}>
        <div>
          {trades.map((trade: Trade) => {
            return (
              <div key={trade?.id} style={{ padding: '20px', borderBottom: '1px solid gray' }}>
                <p>Pair: {trade.pair}</p>
                <p>Size: {trade.tradeSize}</p>
                <p>Type: {trade.isLong ? 'Long' : 'Short'}</p>
                <p>Opened price: {trade.priceOpened}</p>
                <p>Closed price: {trade.priceClosed || '–'}</p>
                <p>Leverage k: {trade.leverageRatio}</p>
                <Button
                  style={{ backgroundColor: 'red', margin: '5px 0 0 0' }}
                  onClick={() => {
                    closeTrade(trade.id);
                  }}
                >
                  Close trade
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Overview;
