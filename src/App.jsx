import React, { createContext, useEffect, useMemo, useState } from "react";
import Routes from "./Routes";

export const AuthContext = createContext({ token: null, setToken: () => {} });
export const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

function App() {
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const authValue = useMemo(() => ({ token, setToken }), [token]);
  const themeValue = useMemo(() => ({ theme, toggle }), [theme]);

  return (
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>
        <Routes />
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
