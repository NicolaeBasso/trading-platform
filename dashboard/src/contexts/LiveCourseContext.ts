import React, { Context } from 'react';
import { tickers } from '../constants/config';

const LiveCourseContext: Context<{ liveCourse: any; setLiveCourse: any }> = React.createContext({
  liveCourse: {},
  setLiveCourse: {},
});

export default LiveCourseContext;
