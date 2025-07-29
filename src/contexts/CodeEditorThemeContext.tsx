import React, { createContext, useContext, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';

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

  // Set Monaco theme globally whenever dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      monaco.editor.setTheme('vs-dark');
    } else {
      monaco.editor.setTheme('vs');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <CodeEditorThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </CodeEditorThemeContext.Provider>
  );
};