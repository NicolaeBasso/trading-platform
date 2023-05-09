import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import Overview from './Overview';
import Details from './Details';
import Chart from './Chart';
import Header from './Header';
import StockContext from '../contexts/StockContext';
import { fetchStockDetails, fetchQuote } from '../utils/api/stock-api';
import { MarketsAPI } from '../api/markets';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const { stockSymbol } = useContext(StockContext);

  const [ticker, setTicker] = useState('BTCUSD');
  const [tickerHistory, setTickerHistory] = useState([]);
  const [stockDetails, setStockDetails]: any = useState({});
  const [quote, setQuote]: any = useState({});

  useEffect(() => {
    const updateStockDetails = async () => {
      try {
        const result = await fetchStockDetails(stockSymbol);
        setStockDetails(result);
      } catch (error) {
        setStockDetails({});
        console.log(error);
      }
    };

    const updateStockOverview = async () => {
      try {
        const result = await fetchQuote(stockSymbol);
        console.log('quote', result);
        setQuote(result);
      } catch (error) {
        setQuote({});
        console.log(error);
      }
    };

    updateStockDetails();
    updateStockOverview();
  }, [stockSymbol]);

  const fetchData = async () => {
    const data = await MarketsAPI.getTickerHistory({ ticker, period: 'WEEK' });
    setTickerHistory(data[0]?.prices);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className={`h-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand ${
        darkMode ? 'bg-gray-900 text-gray-300' : 'bg-neutral-100'
      }`}
    >
      <div className='col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center'>
        <Header name={stockDetails.name} />
      </div>
      <div className='md:col-span-2 row-span-4'>
        <Chart tickerHistory={tickerHistory} />
      </div>
      <div>
        <Overview
          symbol={stockSymbol}
          price={quote.pc}
          change={quote.d}
          changePercent={quote.dp}
          currency={stockDetails.currency}
        />
      </div>
      <div className='row-span-2 xl:row-span-3'>
        <Details details={stockDetails} />
      </div>
    </div>
  );
};

export default Dashboard;
