import { Button, Grid } from '@mantine/core';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { MarketsAPI } from '../api/markets';
import { timeFrames } from '../constants/config';
import { TickerCandle } from '../constants/types';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import ThemeContext from '../contexts/ThemeContext';
import TickerContext from '../contexts/TickerContext';
import Chart from './Chart';
import Overview from './Overview';
import { logoutIcon } from '../assets/icons/logout';
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { TradesAPI } from '../api/trades';
import { UsersAPI } from '../api/users';
import LiveCourseContext from '../contexts/LiveCourseContext';
import { TopNavBar } from './TopNavBar';

const Dashboard = () => {
  const navigate = useNavigate();

  const { darkMode } = useContext(ThemeContext);
  const { ticker, setTicker } = useContext(TickerContext);
  const { quoteType, setQuoteType } = useContext(QuoteTypeContext);
  const { course, setCourse } = useContext(LiveCourseContext);
  const { user, setUser } = useContext(UserContext);

  if (!user || !localStorage.getItem('jwt')) navigate('/login');

  const [period, setPeriod] = useState(timeFrames.DAY.api);
  const [tickerHistory, setTickerHistory]: [TickerCandle[], SetStateAction<any>] = useState([]);
  const [stockDetails, setStockDetails]: any = useState({});
  const [quote, setQuote]: any = useState({});

  const { profile = null, trades = [] } = user || {};

  const fetchTickerHistory = async () => {
    const data = await MarketsAPI.getTickerHistory({ ticker, period });

    setTickerHistory(data[0]?.prices);
  };

  const fetchUserDetails = async () => {
    const user = await UsersAPI.getUser();
    const trades = await TradesAPI.getAllTrades();

    // console.log(user);

    setUser({ profile: { ...user }, trades: [...trades] });
  };

  useEffect(() => {
    fetchTickerHistory();
  }, [ticker, period, quoteType]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div
      style={{
        margin: '0 20px 20px 20px',
      }}
    >
      <TopNavBar setUser={setUser} />
      <div className='flex flex-col'>
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
              ticker={ticker}
              // previousCourse={}
              // course={course}
              quoteType={quoteType}
              setQuoteType={setQuoteType}
              profile={profile}
              trades={trades}
              fetchUserDetails={fetchUserDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
