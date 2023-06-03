import React from 'react';
import './Overview/styles.css';

const ChartFilter = ({ text, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={
        'w-12 m-2 h-8 border-1 rounded-md flex items-center justify-center cursor-pointer overview-button'
      }
      style={{ background: active ? '#0076c6' : 'white', color: active ? 'white' : '#0076c6' }}
    >
      {text}
    </button>
  );
};

export default ChartFilter;
