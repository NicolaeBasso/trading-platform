import { MantineProvider, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// eslint-disable-next-line import/no-extraneous-dependencies
import { io } from 'socket.io-client';
import { QuoteType, tickers } from './constants/config';
import LiveCourseContext from './contexts/LiveCourseContext';
import ThemeContext from './contexts/ThemeContext';
import TickerContext from './contexts/TickerContext';
import QuoteTypeContext from './contexts/QuoteTypeContext';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [ticker, setTicker] = useState(tickers.BTCUSD);
  const [quoteType, setQuoteType] = useState(QuoteType.ASK);
  const [subscribed, setSubscribed] = useState([
    ticker,
    tickers.US100,
    // tickers.NATURAL_GAS,
  ]);
  const [liveCourse, setLiveCourse] = useState({ [`${ticker}`]: {} });

  useEffect(() => {
    const socket = io('ws://localhost:5555/market', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.info('WebSocket connection established.');
      const message = { message: 'client' };

      socket.emit('events', message);
      socket.emit('course');
    });

    socket.on('course', (event) => {
      setLiveCourse(event.pairs);
    });

    socket.on('disconnect', () => {
      console.info('WebSocket connection closed.');
    });

    const interval = setInterval(() => {
      socket.emit('course', { pairs: subscribed });
    }, 300);

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  useEffect(() => {}, [liveCourse]);

  const router = (
    <Routes>
      <Route path='*' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <LiveCourseContext.Provider value={{ liveCourse, setLiveCourse }}>
          <QuoteTypeContext.Provider value={{ quoteType, setQuoteType }}>
            <TickerContext.Provider value={{ ticker, setTicker }}>
              {router}
              {Object.entries(liveCourse).map((ticker: any[]) => {
                return (
                  <Text size={'xl'} key={ticker[0]}>
                    {ticker[0]}
                    {JSON.stringify(ticker[1])}
                  </Text>
                );
              })}
            </TickerContext.Provider>
          </QuoteTypeContext.Provider>
        </LiveCourseContext.Provider>
      </ThemeContext.Provider>
    </MantineProvider>
  );
}
