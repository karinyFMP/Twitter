import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  // Inicializa o estado buscando do localStorage ou assume 'light' como padrão
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // Efeito colateral: Toda vez que o tema mudar, atualiza a classe no HTML e no localStorage
  useEffect(() => {
    const root = window.document.body; // Altera no <body> global da aplicação
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado para facilitar o uso nos componentes
export const useTheme = () => useContext(ThemeContext);