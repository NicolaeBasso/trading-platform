import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

const Card = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div
      style={{ height: '80vh' }}
      className={`w-full h-full rounded-md relative ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-neutral-200'
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
