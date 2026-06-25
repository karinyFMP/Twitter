import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle-btn"
      style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '20px', border: '1px solid var(--border)' }}
    >
      {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
    </button>
  );
};

export default ThemeButton;