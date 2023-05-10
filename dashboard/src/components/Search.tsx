import React, { useContext, useState } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import { searchSymbol } from '../utils/api/stock-api';
import SearchResults from './SearchResults';
import { SearchIcon, XIcon } from '@heroicons/react/solid';
import { Select } from '@mantine/core';
import { tickers, tickersArr } from '../constants/config';
import TickerContext from '../contexts/TickerContext';

const Search = () => {
  const { ticker, setTicker } = useContext(TickerContext);

  return (
    <Select
      placeholder='Pick one ticker...'
      value={ticker}
      searchable
      nothingFound='No options'
      onChange={(val) => {
        setTicker(tickers[`${val}`]);
      }}
      data={tickersArr}
    />
  );
};

export default Search;
