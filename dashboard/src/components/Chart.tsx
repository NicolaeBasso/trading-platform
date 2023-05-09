import React, { useContext, useEffect, useState } from 'react';
import ChartFilter from './ChartFilter';
import Card from './Card';
import { Area, XAxis, YAxis, ResponsiveContainer, AreaChart, Tooltip } from 'recharts';
import ThemeContext from '../contexts/ThemeContext';
import TickerContext from '../contexts/TickerContext';
import { fetchHistoricalData } from '../utils/api/stock-api';
import {
  createDate,
  convertDateToUnixTimestamp,
  convertUnixTimestampToDate,
} from '../utils/helpers/date-helper';
import { chartConfig, timeFrames } from '../constants/config';

const Chart = (props) => {
  const { darkMode } = useContext(ThemeContext);
  const { ticker } = useContext(TickerContext);

  const { tickerHistory, period, setPeriod } = props;
  const [data, setData] = useState([]);

  const formatData = (data) => {
    return data.c.map((item, index) => {
      return {
        value: item.toFixed(2),
        date: convertUnixTimestampToDate(data.t[index]),
      };
    });
  };

  useEffect(() => {
    const getDateRange = () => {
      const { days, weeks, months, years } = chartConfig[period];

      const endDate = new Date();
      const startDate = createDate(endDate, -days, -weeks, -months, -years);

      const startTimestampUnix = convertDateToUnixTimestamp(startDate);
      const endTimestampUnix = convertDateToUnixTimestamp(endDate);
      return { startTimestampUnix, endTimestampUnix };
    };

    const updateChartData = async () => {
      try {
        const { startTimestampUnix, endTimestampUnix } = getDateRange();
        const resolution = chartConfig[period].resolution;
        const result = await fetchHistoricalData(
          ticker,
          resolution,
          startTimestampUnix,
          endTimestampUnix,
        );

        setData(formatData(result));
        // const data = { c: [100, 200], t: [100, 101] }
        // setData(formatData(data))
      } catch (error) {
        setData([]);
        console.log(error);
      }
    };

    updateChartData();
  }, [ticker, period]);

  // console.log('AreaChart data = ', data);

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
            value: el.closePrice.bid,
            date: el.snapshotTimeUTC,
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
          <Tooltip
          // content={<div style={{ border: '2px solid #969696' }}>
          //   <p>Open: 5</p>
          //   <p>Close: 10</p>
          //   <p>High: 12</p>
          //   <p>Low: 3</p>
          // </div>}
          // contentStyle={darkMode ? { backgroundColor: "#111827" } : null}
          // itemStyle={darkMode ? { color: "#818cf8" } : null}
          />
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
