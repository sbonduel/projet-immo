// src/components/ThemeToggle.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'blue' : theme === 'blue' ? 'red' : 'light';
    setTheme(next);
  };

  return <button onClick={toggleTheme}>🎨 {theme}</button>;
};