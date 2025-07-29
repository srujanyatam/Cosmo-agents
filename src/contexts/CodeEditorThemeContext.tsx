import React, { createContext, useContext, useState, useEffect } from 'react';

interface CodeEditorThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const CodeEditorThemeContext = createContext<CodeEditorThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const CodeEditorThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('codeEditorDarkMode');
    return stored ? stored === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('codeEditorDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <CodeEditorThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </CodeEditorThemeContext.Provider>
  );
};