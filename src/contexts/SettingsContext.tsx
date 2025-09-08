import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  fontSize: number;
  brightness: number;
  isDarkMode: boolean;
  setFontSize: (size: number) => void;
  setBrightness: (brightness: number) => void;
  setDarkMode: (isDark: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const [brightness, setBrightness] = useState(100);
  const [isDarkMode, setDarkMode] = useState(true); // Set dark mode to true by default

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const value: SettingsContextType = {
    fontSize,
    brightness,
    isDarkMode,
    setFontSize,
    setBrightness,
    setDarkMode
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
