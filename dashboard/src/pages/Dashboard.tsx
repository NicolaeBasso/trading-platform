/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Button, Input, Paper, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { AuthAPI } from '../api/auth';
// import * as anychart from 'anychart';
import 'anychart';

export const Dashboard = () => {
  console.log('MOUNT');

  const [form, setForm] = useState({ email: '', password: '' });
  const [isChart, setIsChart] = useState(false);

  const reactChart: any = (
    <div
      id='dashboard-chart'
      style={{ width: '800px', height: '600px', margin: '0 0 0 -100%' }}
    ></div>
  );

  const el: any = document.getElementById('dashboard-chart')?.getElementsByTagName('div');

  useEffect(() => {
    setIsChart(true);
  }, []);

  anychart.onDocumentReady(function () {
    // The data used in this sample can be obtained from the CDN
    // https://cdn.anychart.com/csv-data/csco-daily.csv
    anychart.data.loadCsvFile('https://cdn.anychart.com/csv-data/csco-daily.csv', function (data) {
      // create data table on loaded data
      const dataTable = anychart.data.table();
      dataTable.addData(data);

      // map loaded data for the ohlc series
      const mapping = dataTable.mapAs({
        open: 1,
        high: 2,
        low: 3,
        close: 4,
      });

      // map loaded data for the scroller
      const scrollerMapping = dataTable.mapAs();
      scrollerMapping.addField('value', 5);

      // create stock chart
      const chart = anychart.stock();

      // create first plot on the chart
      const plot = chart.plot(0);
      // set grid settings
      plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);

      // create EMA indicators with period 50
      plot.ema(dataTable.mapAs({ value: 4 })).series();
      // .stroke('1.5 #455a64');

      const series = plot.candlestick(mapping);
      series.name('CSCO');
      series.legendItem().iconType('rising-falling');

      // create scroller series with mapped data
      chart.scroller().candlestick(mapping);

      // set chart selected date/time range
      chart.selectRange('1995-01-03', '2010-01-01');

      // set container id for the chart
      chart.container('dashboard-chart');
      // initiate chart drawing
      if (
        (document.getElementById('dashboard-chart')?.getElementsByTagName('div')
          ?.length as number) < 5
      )
        chart.draw();

      // create range picker
      const rangePicker = anychart.ui.rangePicker();
      // init range picker
      rangePicker.render(chart);

      // create range selector
      const rangeSelector = anychart.ui.rangeSelector();
      // init range selector
      rangeSelector.render(chart);
    });
  });
  //

  useEffect(() => {
    console.log(form);
  }, [form]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    AuthAPI.login(form);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper style={{ width: 400, padding: 40 }}>
        <Text size='xl' style={{ marginBottom: 20 }}>
          Dashboard
        </Text>
        {reactChart}
      </Paper>
    </div>
  );
};
