import { Grid } from '@mantine/core';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { MarketsAPI } from '../api/markets';
import { timeFrames } from '../constants/config';
import { TickerCandle } from '../constants/types';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import ThemeContext from '../contexts/ThemeContext';
import TickerContext from '../contexts/TickerContext';
import Chart from './Chart';
import Overview from './Overview';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const { ticker, setTicker } = useContext(TickerContext);
  const { quoteType, setQuoteType } = useContext(QuoteTypeContext);

  const [period, setPeriod] = useState(timeFrames.DAY.api);
  const [tickerHistory, setTickerHistory]: [TickerCandle[], SetStateAction<any>] = useState([]);
  const [stockDetails, setStockDetails]: any = useState({});
  const [quote, setQuote]: any = useState({});

  const fetchData = async () => {
    const data = await MarketsAPI.getTickerHistory({ ticker, period });
    setTickerHistory(data[0]?.prices);
  };

  useEffect(() => {
    fetchData();
  }, [ticker, period, quoteType]);

  useEffect(() => {
    MarketsAPI.getAllTrades();
  }, []);

  return (
    <>
      <Grid
        h={100}
        justify='space-between'
        style={{
          backgroundColor: 'white',
          margin: '0 0 20px 0',
          alignContent: 'center',
          color: 'blue',
        }}
      >
        <Grid.Col span={3} style={{ marginLeft: '20px' }}>
          Overmind Trading
        </Grid.Col>
        <Grid.Col span={3}>
          <Grid>
            <Grid.Col span={3} style={{ display: 'flex', flexDirection: 'column' }}>
              <p>Available</p>
              <p>Available</p>
            </Grid.Col>
            <Grid.Col span={3}>
              <p>Equity</p>
              <p>Equity</p>
            </Grid.Col>
            <Grid.Col span={3}>
              <p>Funds</p>
              <p>Funds</p>
            </Grid.Col>
            <Grid.Col span={3}>
              <p>P&L</p>
              <p>P&L</p>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      <div className='flex flex-col h-screen'>
        {/* <div id='Ticker' className='flex justify-center items-center p-20'>
      <div>
        <Title>{ticker}</Title>
        <Search />
      </div>
    </div> */}
        <div className='flex flex-grow' style={{ margin: '20px' }}>
          <div id='Chart' className='w-3/4'>
            <Chart
              tickerHistory={tickerHistory}
              period={period}
              setPeriod={setPeriod}
              quoteType={quoteType}
            />
          </div>
          <div id='Overview' className='w-1/4'>
            <Overview
              symbol={ticker}
              price={quote.pc}
              change={quote.d}
              changePercent={quote.dp}
              currency={stockDetails.currency}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
