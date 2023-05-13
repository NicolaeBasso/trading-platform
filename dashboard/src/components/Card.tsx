import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

const Card = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div
      className={`w-full h-full rounded-md relative p-10  ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-neutral-200'
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
