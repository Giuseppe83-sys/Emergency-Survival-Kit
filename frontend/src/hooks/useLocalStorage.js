import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// Hook for managing language preference
export const useLanguage = () => {
  const [language, setLanguage] = useLocalStorage('survival-kit-language', 'en');
  return [language, setLanguage];
};

// Hook for managing Go-Bag checklist
export const useChecklist = () => {
  const [checklist, setChecklist] = useLocalStorage('survival-kit-checklist', null);
  return [checklist, setChecklist];
};

// Hook for managing custom checklist items
export const useCustomItems = () => {
  const [customItems, setCustomItems] = useLocalStorage('survival-kit-custom-items', []);
  return [customItems, setCustomItems];
};

// Hook for managing emergency contacts
export const useContacts = () => {
  const [contacts, setContacts] = useLocalStorage('survival-kit-contacts', []);
  return [contacts, setContacts];
};

// Hook for managing map markers
export const useMapMarkers = () => {
  const [markers, setMarkers] = useLocalStorage('survival-kit-markers', []);
  return [markers, setMarkers];
};

// Hook for managing timer presets
export const useTimerPresets = () => {
  const [presets, setPresets] = useLocalStorage('survival-kit-timer-presets', [
    { id: '1', name: '5 min', seconds: 300 },
    { id: '2', name: '15 min', seconds: 900 },
    { id: '3', name: '30 min', seconds: 1800 },
    { id: '4', name: '1 hour', seconds: 3600 }
  ]);
  return [presets, setPresets];
};

export default useLocalStorage;
