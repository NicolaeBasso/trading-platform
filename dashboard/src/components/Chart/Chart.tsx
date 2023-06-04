import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { timeFrames } from '../../constants/config';
import { TickerCandle } from '../../constants/types';
import Card from '../Card';
import ChartFilter from '../ChartFilter';
import './styles.css';

const Chart = (props) => {
  const { tickerHistory, tickerPrediction, period, setPeriod, quoteType } = props;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { payload: element }: { payload: TickerCandle } = payload[0];

      return (
        <div style={{ padding: '10px', border: 'none !important' }}>
          <div className='tooltip-key-val'>
            <p>Date UTC:</p>
            <p>{element.snapshotTimeUTC}</p>
          </div>

          <div className='tooltip-key-val'>
            <p>Close:</p>
            <p>{element.closePrice[quoteType]}</p>
          </div>

          <div className='tooltip-key-val'>
            <p>Open:</p>
            <p>{element.openPrice[quoteType]}</p>
          </div>

          <div className='tooltip-key-val'>
            <p>Low:</p>
            <p>{element.lowPrice[quoteType]}</p>
          </div>

          <div className='tooltip-key-val'>
            <p>High:</p>
            <p>{element.highPrice[quoteType]}</p>
          </div>

          <div className='tooltip-key-val'>
            <p>Volume:</p>
            <p>{element.lastTradedVolume}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const tickerHistoryItems = tickerHistory.slice(tickerHistory.length - 300).map((el) => {
    const item = {
      past: el.closePrice[quoteType],
      date: el.snapshotTimeUTC,
      ...el,
    };

    return item;
  });

  const tickerPredictionItems = tickerPrediction.map((el) => {
    const item = {
      prediction: el.closePrice[quoteType],
      date: el.snapshotTimeUTC,
      ...el,
    };

    return item;
  });

  const chartData = [...tickerHistoryItems, ...tickerPredictionItems];

  return (
    <Card>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id='pastColor' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={'#0076c6'} stopOpacity={0.8} />
              <stop offset='95%' stopColor={'#0076c6'} stopOpacity={0} />
            </linearGradient>
            <linearGradient id='predictionColor' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={'#de2e21'} stopOpacity={0.8} />
              <stop offset='95%' stopColor={'#de2e21'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip />} />
          <Area
            type='monotone'
            dataKey='past'
            stroke='#0076c6'
            fill='url(#pastColor)'
            fillOpacity={1}
            strokeWidth={0.5}
          />
          <Area
            type='monotone'
            dataKey='prediction'
            stroke='#0076c6'
            fill='url(#predictionColor)'
            fillOpacity={1}
            strokeWidth={0.5}
          />
          <XAxis dataKey='date' />
          <YAxis domain={['dataMin', 'dataMax']} />
        </AreaChart>
      </ResponsiveContainer>

      <ul className='flex absolute bottom--5 right-0 z-40'>
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
    </Card>
  );
};

export default Chart;
