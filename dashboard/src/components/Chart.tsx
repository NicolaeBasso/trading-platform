import { useContext, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { timeFrames } from '../constants/config';
import { TickerCandle } from '../constants/types';
import QuoteTypeContext from '../contexts/QuoteTypeContext';
import ThemeContext from '../contexts/ThemeContext';
import TickerContext from '../contexts/TickerContext';
import { convertUnixTimestampToDate } from '../utils/helpers/date-helper';
import Card from './Card';
import ChartFilter from './ChartFilter';
import { Button } from '@mantine/core';

const Chart = (props) => {
  const { darkMode } = useContext(ThemeContext);
  const { ticker } = useContext(TickerContext);
  // const { quoteType, setQuoteType } = useContext(QuoteTypeContext);

  const { tickerHistory, period, setPeriod, quoteType } = props;
  const [data, setData] = useState([]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { payload: element }: { payload: TickerCandle } = payload[0];

      return (
        <div style={{ padding: '10px', border: 'none' }}>
          <p>Date UTC {element.snapshotTimeUTC}</p>
          <p>Open: {element.closePrice[quoteType]}</p>
          <p>Close: {element.openPrice[quoteType]}</p>
          <p>Low: {element.lowPrice[quoteType]}</p>
          <p>High: {element.lowPrice[quoteType]}</p>
          <p>Volume: {element.lastTradedVolume}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <ul className='flex absolute top-2 right-2 z-40'>
        {Object.keys(timeFrames).map((el, idx, arr) => (
          <li key={el}>
            <ChartFilter
              text={timeFrames[el].text}
              active={period === el}
              onClick={() => {
                setPeriod(timeFrames[el].api);
              }}
            />
          </li>
        ))}
      </ul>

      <ResponsiveContainer>
        <AreaChart
          data={tickerHistory.map((el) => ({
            value: el.closePrice[quoteType],
            yes: 'yes',
            date: el.snapshotTimeUTC,
            ...el,
          }))}
        >
          <defs>
            <linearGradient id='chartColor' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor={darkMode ? '#312e81' : 'rgb(199 210 254)'}
                stopOpacity={0.8}
              />
              <stop
                offset='95%'
                stopColor={darkMode ? '#312e81' : 'rgb(199 210 254)'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip />} />
          <Area
            type='monotone'
            dataKey='value'
            stroke='#312e81'
            fill='url(#chartColor)'
            fillOpacity={1}
            strokeWidth={0.5}
          />
          <XAxis dataKey='date' />
          <YAxis domain={['dataMin', 'dataMax']} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
