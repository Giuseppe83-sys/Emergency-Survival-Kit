import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { translations, supportedLanguages } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useLocalStorage('survival-kit-language', 'en');

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const isRTL = supportedLanguages.find(l => l.code === language)?.rtl || false;

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
    supportedLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
