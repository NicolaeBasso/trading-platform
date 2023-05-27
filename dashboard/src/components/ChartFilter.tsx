import React from 'react';
import './Overview/styles.css';

const ChartFilter = ({ text, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={
        'w-12 m-2 h-8 border-1 rounded-md flex items-center justify-center cursor-pointer overview-button'
      }
    >
      {text}
    </button>
  );
};

export default ChartFilter;
