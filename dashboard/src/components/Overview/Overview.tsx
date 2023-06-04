import { Button, NumberInput, ScrollArea, Title } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { TradesAPI } from '../../api/trades';
import { Trade } from '../../api/types/trade-type.type';
import { triangleIcon } from '../../assets/triangle-icon';
import { QuoteType } from '../../constants/config';
import LiveCourseContext from '../../contexts/LiveCourseContext';
import Search from '../Search';
import './styles.css';

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
  const [previousBid, setPreviousBid] = useState(tickerPrevious?.bid);
  const [currentBid, setCurrentBid] = useState(tickerLive?.bid);
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
    await TradesAPI.openTrade({ isLong, tradeSize, pair: 'BTCUSD' });
    fetchUserDetails();
  };

  const closeTrade = async (id) => {
    await TradesAPI.closeTrade(id);
    fetchUserDetails();
  };

  const liveCourseQuoteType = quoteTypeFromLiveCourse(quoteType);

  return (
    <div style={{ marginLeft: '10%', display: 'block' }}>
      <div>
        <div style={{}}>
          <div
            style={{ display: 'flex', alignItems: 'center', height: '50px', marginBottom: '10px' }}
          >
            <Title
              my={'xs'}
              color={
                course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid ? '#de2e21' : '#228be6'
              }
            >
              {ticker}
            </Title>
            {triangleIcon({
              width: '50px',
              height: '50px',
              shapeFillColor:
                course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid ? '#de2e21' : '#228be6',
              transform:
                course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid
                  ? 'rotate(180)'
                  : 'rotate(0)',
            })}
          </div>
          <Search />
        </div>
      </div>
      <div className='overview-quote'>
        Quote type:
        <Button
          style={{
            marginLeft: '10%',
            backgroundColor: quoteType === QuoteType.ASK ? '#228be6' : '#de2e21',
          }}
          onClick={() => {
            setQuoteType(quoteType === QuoteType.ASK ? QuoteType.BID : QuoteType.ASK);
          }}
        >
          {quoteType?.toUpperCase()}
        </Button>
      </div>
      <div className='overview-key-val'>
        <p
          style={{
            color:
              course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid ? '#de2e21' : '#228be6',
            justifyContent: 'space-between',
          }}
        >
          Bid:
        </p>
        <p
          style={{
            color:
              course.previous?.[ticker]?.bid > course.live?.[ticker]?.bid ? '#de2e21' : '#228be6',
            justifyContent: 'space-between',
          }}
        >
          {tickerLive?.bid}
        </p>
      </div>

      <div className='overview-key-val'>
        <p
          style={{
            color:
              course.previous?.[ticker]?.ask > course.live?.[ticker]?.ask ? '#de2e21' : '#228be6',
          }}
        >
          Ask:
        </p>
        <p
          style={{
            color:
              course.previous?.[ticker]?.ask > course.live?.[ticker]?.ask ? '#de2e21' : '#228be6',
          }}
        >
          {tickerLive?.ofr}
        </p>
      </div>

      <div className='overview-key-val'>
        <p
          style={{
            color:
              course.previous?.[ticker]?.ask > course.live?.[ticker]?.ask ? '#de2e21' : '#228be6',
          }}
        >
          Spread:
        </p>
        <p
          style={{
            color:
              course.previous?.[ticker]?.ask > course.live?.[ticker]?.ask ? '#de2e21' : '#228be6',
          }}
        >
          {(tickerLive?.ofr - tickerLive?.bid ? tickerLive?.ofr - tickerLive?.bid : 0).toFixed(2)}
        </p>
      </div>

      <NumberInput
        size='lg'
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
          style={{ backgroundColor: '#228be6', minWidth: '150px', width: '45%' }}
          onClick={() => {
            openTrade({ tradeSize, isLong: true });
          }}
        >
          LONG
        </Button>
        <Button
          size='xl'
          style={{ backgroundColor: '#de2e21', minWidth: '150px', width: '45%' }}
          onClick={() => {
            openTrade({ tradeSize, isLong: false });
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
                <div className='overview-key-val'>
                  <p>Pair:</p>
                  <p>{trade.pair}</p>
                </div>

                <div className='overview-key-val'>
                  <p>Type:</p>
                  <p>{trade.isLong ? 'Long' : 'Short'}</p>
                </div>

                <div className='overview-key-val'>
                  <p>Size:</p>
                  <p>{trade.tradeSize}</p>
                </div>

                <div className='overview-key-val'>
                  <p>Opened price:</p>
                  <p>{trade.priceOpened}</p>
                </div>

                <div className='overview-key-val'>
                  <p>Closed price:</p>
                  <p>{trade.priceClosed || '–'}</p>
                </div>

                <div className='overview-key-val'>
                  <p>Leverage k:</p>
                  <p>{trade.leverageRatio}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    style={{ backgroundColor: '#228be6', margin: '5px 0 0 0', minWidth: '9rem' }}
                    onClick={() => {
                      // updateTrade(trade.id);
                    }}
                  >
                    Update trade
                  </Button>
                  <Button
                    style={{ backgroundColor: '#de2e21', margin: '5px 0 0 0', minWidth: '9rem' }}
                    onClick={() => {
                      closeTrade(trade.id);
                    }}
                  >
                    Close trade
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Overview;
