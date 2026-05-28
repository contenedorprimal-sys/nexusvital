import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexusvital-theme') || 'dark';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('nexusvital-sidebar') === 'collapsed';
  });

  useEffect(() => {
    localStorage.setItem('nexusvital-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nexusvital-sidebar', sidebarCollapsed ? 'collapsed' : 'expanded');
  }, [sidebarCollapsed]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
