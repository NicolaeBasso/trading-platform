import { MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
// eslint-disable-next-line import/no-extraneous-dependencies
import { io } from 'socket.io-client';
import { QuoteType, tickers } from './constants/config';
import LiveCourseContext from './contexts/LiveCourseContext';
import QuoteTypeContext from './contexts/QuoteTypeContext';
import ThemeContext from './contexts/ThemeContext';
import TickerContext from './contexts/TickerContext';
import UserContext from './contexts/UserContext';
import UserDetailsContext from './contexts/UserDetailsContext';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // console.log('user', user);

  useEffect(() => {
    if (!localStorage.getItem('jwt') || !user) navigate('/login');
  }, [localStorage, user]);

  const [darkMode, setDarkMode] = useState(false);
  const [ticker, setTicker] = useState(tickers.BTCUSD);
  const [quoteType, setQuoteType] = useState(QuoteType.ASK);
  const [subscribed, setSubscribed] = useState([
    ticker,
    tickers.BTCUSD,
    tickers.ETHUSD,
    tickers.US100,
  ]);
  const [course, setCourse] = useState({ [`${ticker}`]: { live: {}, previous: {} } });

  useEffect(() => {
    const socket = io('ws://localhost:5555/market', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.info('WebSocket connection to /market established.');
      const message = { message: 'client' };

      socket.emit('events', message);
      socket.emit('course');
    });

    socket.on('course', (message) => {
      setCourse((previousValue: any) => {
        // console.log('previousValue', previousValue);
        return { live: message.pairs, previous: previousValue.live };
      });
    });

    socket.on('balance', (message) => {
      console.log('balance', message);
    });

    socket.on('disconnect', () => {
      console.info('WebSocket connection to /market closed.');
    });

    const interval = setInterval(() => {
      socket.emit('course', { pairs: subscribed });
    }, 300);

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  useEffect(() => {
    const socket = io('ws://localhost:5555/account', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.info('WebSocket connection to /account established.');
      const message = { message: 'Connect to /account' };

      socket.emit('balance');
    });

    socket.on('course', (message) => {
      setCourse((previousValue: any) => {
        // console.log('previousValue', previousValue);
        return { live: message.pairs, previous: previousValue.live };
      });
    });

    socket.on('balance', (message) => {
      console.log('balance', message);
    });

    socket.on('disconnect', () => {
      console.info('WebSocket connection to /market closed.');
    });

    const interval = setInterval(() => {
      socket.emit('balance');
    }, 300);

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  // useEffect(() => {}, [course]);

  const router = (
    <Routes>
      <Route path='*' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <UserContext.Provider value={{ user, setUser }}>
          <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
            <LiveCourseContext.Provider value={{ course, setCourse }}>
              <QuoteTypeContext.Provider value={{ quoteType, setQuoteType }}>
                <TickerContext.Provider value={{ ticker, setTicker }}>
                  {router}
                </TickerContext.Provider>
              </QuoteTypeContext.Provider>
            </LiveCourseContext.Provider>
          </UserDetailsContext.Provider>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </MantineProvider>
  );
}
