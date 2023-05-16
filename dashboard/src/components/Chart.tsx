import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { timeFrames } from '../constants/config';
import { TickerCandle } from '../constants/types';
import Card from './Card';
import ChartFilter from './ChartFilter';

const Chart = (props) => {
  const { tickerHistory, period, setPeriod, quoteType } = props;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { payload: element }: { payload: TickerCandle } = payload[0];

      return (
        <div style={{ padding: '10px', border: 'none !important' }}>
          <p>Date UTC {element.snapshotTimeUTC}</p>
          <p>Close: {element.closePrice[quoteType]}</p>
          <p>Open: {element.openPrice[quoteType]}</p>
          <p>Low: {element.lowPrice[quoteType]}</p>
          <p>High: {element.highPrice[quoteType]}</p>
          <p>Volume: {element.lastTradedVolume}</p>
        </div>
      );
    }

    return null;
  };

  const data = tickerHistory.map((el, idx, arr) => ({
    past: idx <= arr.length / 2 ? el.closePrice[quoteType] : null,
    prediction: idx >= arr.length / 2 ? el.closePrice[quoteType] : null,
    date: el.snapshotTimeUTC,
    ...el,
  }));

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
        <AreaChart data={data}>
          <defs>
            <linearGradient id='pastColor' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={'#312e81'} stopOpacity={0.8} />
              <stop offset='95%' stopColor={'#312e81'} stopOpacity={0} />
            </linearGradient>
            <linearGradient id='predictionColor' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={'red'} stopOpacity={0.8} />
              <stop offset='95%' stopColor={'red'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip />} />
          <Area
            type='monotone'
            dataKey='past'
            stroke='#312e81'
            fill='url(#pastColor)'
            fillOpacity={1}
            strokeWidth={0.5}
          />
          <Area
            type='monotone'
            dataKey='prediction'
            stroke='#312e81'
            fill='url(#predictionColor)'
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
