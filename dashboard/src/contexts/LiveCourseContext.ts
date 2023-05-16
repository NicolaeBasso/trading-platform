import React, { Context } from 'react';

const LiveCourseContext: Context<{ course: any; setCourse: any }> = React.createContext({
  course: { previous: {}, live: {} },
  setCourse: {},
});

export default LiveCourseContext;
