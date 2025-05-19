import React, { useContext } from 'react';
import Navbar from './Navbar';
import { ThemeContext } from '../components/ThemeContext';

export default function Layout({ children }) {
  const { theme } = useContext(ThemeContext);

  const themes = {
    light: { background: '#fff', text: '#000' },
    dark: { background: '#111', text: '#fff' },
    bleu: { background: '#e7f1ff', text: '#000' },
    rouge: { background: '#ffe5e5', text: '#000' },
    vert: { background: '#e9f7ef', text: '#000' },
    jaune: { background: '#fff9e5', text: '#000' },
    rose: { background: '#ffe6f0', text: '#000' },
    violet: { background: '#f3e8ff', text: '#000' },
    orange: { background: '#fff3e0', text: '#000' },
    teal: { background: '#e0fffa', text: '#000' },
  };

  const currentTheme = themes[theme] || themes.light;

  return (
    <div style={{ backgroundColor: currentTheme.background, color: currentTheme.text, minHeight: '100vh' }}>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
    </div>
  );
}
