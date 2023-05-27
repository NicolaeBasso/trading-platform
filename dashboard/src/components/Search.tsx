import { Select } from '@mantine/core';
import { useContext } from 'react';
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
