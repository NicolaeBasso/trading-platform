import { SetStateAction, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketsAPI } from '../api/markets';
import { TradesAPI } from '../api/trades';
import { UsersAPI } from '../api/users';
import { timeFrames } from '../constants/config';
import { TickerCandle } from '../constants/types';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import TickerContext from '../contexts/TickerContext';
import UserContext from '../contexts/UserContext';
import Chart from './Chart/Chart';
import Overview from './Overview/Overview';
import { TopNavBar } from './TopNavBar';

const Dashboard = () => {
  const navigate = useNavigate();

  const { ticker, setTicker } = useContext(TickerContext);
  const { quoteType, setQuoteType } = useContext(QuoteTypeContext);
  const { user, setUser } = useContext(UserContext);

  if (!user || !localStorage.getItem('jwt')) navigate('/login');

  const [period, setPeriod] = useState(timeFrames.DAY.api);
  const [tickerHistory, setTickerHistory]: [TickerCandle[], SetStateAction<any>] = useState([]);
  const [tickerPrediction, setTickerPrediction]: [TickerCandle[], SetStateAction<any>] = useState(
    [],
  );

  const { profile = null, trades = [] } = user || {};

  const fetchTickerHistory = async () => {
    try {
      const data = await MarketsAPI.getTickerHistory({ ticker, period });
      setTickerHistory(data?.[0]?.prices || []);
    } catch (error) {
      setTickerHistory([]);
    }
  };

  const fetchTickerPrediction = async () => {
    try {
      const data = await MarketsAPI.getTickerPrediction({ ticker, period });
      setTickerPrediction(data?.[0]?.prices || []);
    } catch (error) {
      setTickerPrediction([]);
    }
  };

  const fetchUserDetails = async () => {
    const user = await UsersAPI.getUser();
    const trades = await TradesAPI.getAllTrades();

    setUser({ profile: { ...user }, trades: [...trades] });
  };

  useEffect(() => {
    fetchTickerHistory();
    fetchTickerPrediction();
  }, [ticker, period, quoteType]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div style={{}}>
      <TopNavBar setUser={setUser} />
      <div className='flex flex-col' style={{ margin: '0.5rem 0 0 0', padding: '1rem 2rem' }}>
        <div className='flex flex-grow'>
          <div id='Chart' className='w-3/4'>
            <Chart
              tickerHistory={tickerHistory}
              tickerPrediction={tickerPrediction}
              period={period}
              setPeriod={setPeriod}
              quoteType={quoteType}
            />
          </div>
          <div id='Overview' className='w-1/4'>
            <Overview
              ticker={ticker}
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
