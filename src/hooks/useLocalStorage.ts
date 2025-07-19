import { useState, useEffect } from 'react';

// Custom hook for localStorage management
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for session storage
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for managing multiple localStorage keys
export function useMultipleLocalStorage(keys: string[]) {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadedValues: Record<string, any> = {};
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        loadedValues[key] = item ? JSON.parse(item) : null;
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        loadedValues[key] = null;
      }
    });
    setValues(loadedValues);
  }, [keys]);

  const updateValue = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setValues(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = (key: string) => {
    try {
      localStorage.removeItem(key);
      setValues(prev => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { values, updateValue, removeValue };
}
