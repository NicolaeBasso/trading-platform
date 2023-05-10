import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MantineProvider, Text } from '@mantine/core';
import Dashboard from './components/Dashboard';

// eslint-disable-next-line import/no-extraneous-dependencies
import { io } from 'socket.io-client';
import ThemeContext from './contexts/ThemeContext';
import TickerContext from './contexts/TickerContext';
import { tickers } from './constants/config';
import LiveCourseContext from './contexts/LiveCourseContext';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [ticker, setTicker] = useState(tickers.BTCUSD);
  const [subscribed, setSubscribed] = useState([
    ticker,
    tickers.US100,
    // tickers.NATURAL_GAS,
  ]);
  const [liveCourse, setLiveCourse] = useState({ [`${ticker}`]: {} });

  useEffect(() => {
    console.log('Effect');

    const socket = io('ws://localhost:5555/market', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connection established.');
      const message = { message: 'client' };

      socket.emit('events', message);
      socket.emit('course');
    });

    socket.on('course', (event) => {
      console.log('Received message:', event);
      setLiveCourse(event.pairs);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket connection closed.');
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
    console.log(liveCourse);
  }, [liveCourse]);

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
        </LiveCourseContext.Provider>
      </ThemeContext.Provider>
    </MantineProvider>
  );
}
