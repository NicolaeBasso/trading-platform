import React, { Context } from 'react';

const LiveCourseContext: Context<{ liveCourse: any; setLiveCourse: any }> = React.createContext({
  liveCourse: {},
  setLiveCourse: {},
});

export default LiveCourseContext;
