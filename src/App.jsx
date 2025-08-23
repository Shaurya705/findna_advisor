import React, { createContext, useEffect, useMemo, useState } from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";

export const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const themeValue = useMemo(() => ({ theme, toggle }), [theme]);

  return (
    <AuthProvider>
      <ThemeContext.Provider value={themeValue}>
        <Routes />
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;
