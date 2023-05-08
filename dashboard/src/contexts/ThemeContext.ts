import React, { Context } from 'react';

const ThemeContext: Context<{ darkMode: any; setDarkMode: any }> = React.createContext({
  darkMode: null,
  setDarkMode: null,
});

export default ThemeContext;
