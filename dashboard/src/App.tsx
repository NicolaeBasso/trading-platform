import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MantineProvider, Text } from '@mantine/core';
import { Dashboard as AnyChartDashboard } from './pages/Dashboard';
import Dashboard from './components/Dashboard';

// eslint-disable-next-line import/no-extraneous-dependencies
import { io } from 'socket.io-client';
import ThemeContext from './contexts/ThemeContext';
import StockContext from './contexts/StockContext';

export default function App() {
  // const [btcUsd, setBtcUsd] = useState(null);
  const [pairs, setPairs] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('FB');

  useEffect(() => {
    console.log('Effect');

    const socket = io('ws://localhost:5555/market', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connection established.');
      const message = { message: 'client' };
      // socket.send(JSON.stringify(message));
      socket.emit('events', message);
      socket.emit('course');
    });

    socket.on('events', (event) => {
      console.log(`Received message: ${event.data}`);
    });

    socket.on('course', (event) => {
      console.log('Received message:', event);
      setPairs(event.pairs);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket connection closed.');
    });

    const interval = setInterval(() => {
      socket.emit('course', { pair: 'BTCUSD' });
    }, 300);

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  useEffect(() => {
    console.log(pairs);
  }, [pairs]);

  const router = (
    <Routes>
      <Route path='*' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );

  console.log(Object.entries(pairs));

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
          {router}
          {Object.entries(pairs).map((pair: any) => {
            return (
              <Text size={'xl'} key={pair[0]}>
                {pair[0]}
                {JSON.stringify(pair[1])}
              </Text>
            );
          })}
          {/* <Dashboard /> */}
          <AnyChartDashboard />
        </StockContext.Provider>
      </ThemeContext.Provider>
    </MantineProvider>
  );
}
