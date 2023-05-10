import { Title } from '@mantine/core';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { MarketsAPI } from '../api/markets';
import { timeFrames } from '../constants/config';
import { TickerCandle } from '../constants/types';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import ThemeContext from '../contexts/ThemeContext';
import TickerContext from '../contexts/TickerContext';
import { fetchQuote, fetchStockDetails } from '../utils/api/stock-api';
import Chart from './Chart';
import Overview from './Overview';
import Search from './Search';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const { ticker, setTicker } = useContext(TickerContext);
  const { quoteType, setQuoteType } = useContext(QuoteTypeContext);

  // const [ticker, setTicker] = useState('BTCUSD');
  const [period, setPeriod] = useState(timeFrames.DAY.api);
  const [tickerHistory, setTickerHistory]: [TickerCandle[], SetStateAction<any>] = useState([]);
  const [stockDetails, setStockDetails]: any = useState({});
  const [quote, setQuote]: any = useState({});

  useEffect(() => {
    const updateStockDetails = async () => {
      try {
        const result = await fetchStockDetails(ticker);
        setStockDetails(result);
      } catch (error) {
        setStockDetails({});
        console.log(error);
      }
    };

    const updateStockOverview = async () => {
      try {
        const result = await fetchQuote(ticker);
        console.log('quote', result);
        setQuote(result);
      } catch (error) {
        setQuote({});
        console.log(error);
      }
    };

    updateStockDetails();
    updateStockOverview();
  }, [ticker]);

  const fetchData = async () => {
    const data = await MarketsAPI.getTickerHistory({ ticker, period });
    setTickerHistory(data[0]?.prices);
  };

  useEffect(() => {
    fetchData();
  }, [ticker, period, quoteType]);

  return (
    <div className='flex flex-col h-screen'>
      <div id='Ticker' className='flex justify-center items-center p-20'>
        <div>
          <Title>{ticker}</Title>
          <Search />
        </div>
      </div>
      <div className='flex flex-grow'>
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
  );
};

export default Dashboard;
